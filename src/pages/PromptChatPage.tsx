import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePromptMessages } from '../hooks/usePrompts';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  AlertCircle,
  Sparkles,
  Heart,
  Tag
} from 'lucide-react';
import { PromptSession, PromptMessage, GeminiResponse, LearningSpaceData } from '../types/Prompt';

const PromptChatPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { messages, loading: messagesLoading, addMessage } = usePromptMessages(sessionId || '');
  
  const [session, setSession] = useState<PromptSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [creatingLearningSpace, setCreatingLearningSpace] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId || !currentUser) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('prompt_sessions')
          .select('*')
          .eq('id', sessionId)
          .eq('user_id', currentUser.id)
          .single();

        if (error) throw error;
        setSession(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch session');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || sending || !sessionId) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setSending(true);

    try {
      // 사용자 메시지 저장
      await addMessage({
        session_id: sessionId,
        sender: 'user',
        content: userMessage
      });

      // 현재 메시지들과 새 메시지를 포함한 배열 생성
      const allMessages = [
        ...messages,
        { sender: 'user' as const, content: userMessage }
      ];

      // Gemini API 호출
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini_chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages.map(msg => ({
            sender: msg.sender,
            content: msg.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const aiResponse: GeminiResponse = await response.json();

      // AI 응답 저장
      const aiMessage = await addMessage({
        session_id: sessionId,
        sender: 'ai',
        content: aiResponse.content
      });

      // 세션 업데이트 (main_prompt가 있는 경우)
      if (aiResponse.main_prompt && session) {
        await supabase
          .from('prompt_sessions')
          .update({ 
            main_prompt: aiResponse.main_prompt,
            title: aiResponse.main_prompt.length > 50 
              ? aiResponse.main_prompt.substring(0, 50) + '...'
              : aiResponse.main_prompt
          })
          .eq('id', sessionId);
        
        setSession(prev => prev ? {
          ...prev,
          main_prompt: aiResponse.main_prompt!,
          title: aiResponse.main_prompt!.length > 50 
            ? aiResponse.main_prompt!.substring(0, 50) + '...'
            : aiResponse.main_prompt!
        } : null);
      }

      // suggest_learning_space 플래그를 메시지에 추가 (UI에서 사용)
      if (aiResponse.suggest_learning_space) {
        // 메시지 상태에 플래그 추가 (로컬 상태만)
        // 실제 DB에는 저장하지 않고 UI에서만 사용
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError('메시지 전송에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setSending(false);
    }
  };

  const handleCreateLearningSpace = async () => {
    if (!sessionId || creatingLearningSpace) return;

    setCreatingLearningSpace(true);
    try {
      // 전체 메시지 히스토리를 사용하여 학습 공간 생성
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemini_chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({
            sender: msg.sender,
            content: msg.content
          })),
          action: 'generate_learning_space'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate learning space');
      }

      const learningSpaceData: LearningSpaceData = await response.json();

      // 강의실 생성
      const { data: classroom, error: classroomError } = await supabase
        .from('classrooms')
        .insert({
          name: learningSpaceData.classroom.name,
          description: learningSpaceData.classroom.description,
          color: learningSpaceData.classroom.color,
          user_id: currentUser!.id
        })
        .select()
        .single();

      if (classroomError) throw classroomError;

      // 모듈들 생성
      const { error: modulesError } = await supabase
        .from('modules')
        .insert(
          learningSpaceData.modules.map(module => ({
            classroom_id: classroom.id,
            title: module.title,
            description: module.description,
            step_number: module.step_number
          }))
        );

      if (modulesError) throw modulesError;

      // 학습 공간 링크 생성
      await supabase
        .from('learning_space_links')
        .insert({
          prompt_session_id: sessionId,
          classroom_id: classroom.id
        });

      // 생성된 강의실로 이동
      navigate(`/classroom/${classroom.id}`);

    } catch (error) {
      console.error('Error creating learning space:', error);
      setError('학습 공간 생성에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setCreatingLearningSpace(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">로그인이 필요합니다</h2>
          <p className="text-gray-600">프롬프트 기능을 사용하려면 로그인해 주세요.</p>
        </div>
      </div>
    );
  }

  if (loading || messagesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-600 mb-4" />
          <p className="text-gray-600">대화를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">대화를 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/prompts')} variant="outline">
            대화 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <Button
            variant="ghost"
            onClick={() => navigate('/prompts')}
            className="mb-4 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            대화 목록
          </Button>
          
          {session && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {session.title}
              </h2>
              {session.main_prompt && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Main Prompt</h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{session.main_prompt}</p>
                  </div>
                </div>
              )}
              
              {session.tags.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {session.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={session.is_favorited ? 'text-red-500' : 'text-gray-400'}
                >
                  <Heart className={`h-4 w-4 ${session.is_favorited ? 'fill-current' : ''}`} />
                </Button>
                <span className="text-xs text-gray-500">Favorite</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">AI와 대화를 시작하세요</h3>
              <p className="text-gray-600">학습하고 싶은 주제에 대해 질문해보세요.</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={message.id || index} className="flex gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-purple-100 text-purple-600'
                }`}>
                  {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                
                <div className="flex-1">
                  <div className={`inline-block p-4 rounded-lg max-w-3xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {/* 학습 공간 생성 버튼 - AI 메시지에만 표시 */}
                  {message.sender === 'ai' && index === messages.length - 1 && session?.main_prompt && (
                    <div className="mt-4">
                      <Button
                        onClick={handleCreateLearningSpace}
                        disabled={creatingLearningSpace}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        {creatingLearningSpace ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        학습 공간 생성
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          
          {sending && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="inline-block p-4 rounded-lg bg-white border border-gray-200">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-gray-600">AI가 응답을 생성하고 있습니다...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="mt-2 text-red-600 hover:text-red-700"
              >
                닫기
              </Button>
            </div>
          )}
          
          <div className="flex gap-3">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              disabled={sending}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || sending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptChatPage;