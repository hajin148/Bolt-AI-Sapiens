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
  Tag,
  MoreHorizontal,
  Share,
  Bookmark
} from 'lucide-react';
import { PromptSession, PromptMessage, GeminiResponse, LearningSpaceData, EnhancedVideoDigest } from '../types/Prompt';
import { VideoDigest, ContentItem } from '../types/Learning';

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
  const [showLearningSpaceButton, setShowLearningSpaceButton] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to refresh sidebar prompt sessions
  const refreshSidebarPrompts = () => {
    // Trigger a custom event to refresh sidebar
    window.dispatchEvent(new CustomEvent('refreshPromptSessions'));
  };
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
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          // Session not found, redirect to home
          navigate('/');
          return;
        }
        
        setSession(data);
      } catch (err) {
        // If session not found, refresh sidebar to remove stale entries
        refreshSidebarPrompts();
        // Redirect to home instead of showing error
        navigate('/');
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
    setError(null);

    try {
      // Save user message
      await addMessage({
        session_id: sessionId,
        sender: 'user',
        content: userMessage
      });

      // Create message array including the new user message
      const allMessages = [
        ...messages,
        { sender: 'user' as const, content: userMessage }
      ];

      // Call Gemini API
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

      // Save AI response
      await addMessage({
        session_id: sessionId,
        sender: 'ai',
        content: aiResponse.content
      });

      // Update session if main_prompt is provided
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
        
        // Trigger sidebar refresh when session is updated
        console.log('Triggering sidebar refresh for updated session');
        window.dispatchEvent(new CustomEvent('refreshPromptSessions'));
      }

      // Show learning space button if suggested
      if (aiResponse.suggest_learning_space) {
        setShowLearningSpaceButton(true);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Helper function to convert enhanced video digest to simple format
  const convertVideoDigest = (enhancedDigest: EnhancedVideoDigest): VideoDigest => {
    return {
      video_id: enhancedDigest.video_id,
      title: enhancedDigest.title,
      url: enhancedDigest.url || (enhancedDigest.video_id ? `https://www.youtube.com/watch?v=${enhancedDigest.video_id}` : undefined),
      duration: enhancedDigest.duration || '0:00',
      thumbnail: enhancedDigest.thumbnail,
      published_at: enhancedDigest.published_at,
      summary: enhancedDigest.summary,
      lang: enhancedDigest.lang,
      youtube_channels: enhancedDigest.youtube_channels
    };
  };

  const handleCreateLearningSpace = async () => {
    if (!sessionId || creatingLearningSpace) return;

    setCreatingLearningSpace(true);
    setError(null);
    
    try {
      // Use entire message history to generate learning space
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

      // Create classroom
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

      // Create modules with enhanced content and digests
      const { error: modulesError } = await supabase
        .from('modules')
        .insert(
          learningSpaceData.modules.map(module => ({
            classroom_id: classroom.id,
            title: module.title,
            description: module.description,
            step_number: module.step_number,
            content: module.content as ContentItem[],
            digests: module.digests.map(convertVideoDigest) as VideoDigest[]
          }))
        );

      if (modulesError) throw modulesError;

      // Create learning space link
      await supabase
        .from('learning_space_links')
        .insert({
          prompt_session_id: sessionId,
          classroom_id: classroom.id
        });

      // Show success message
      setError(null);
      
      // Navigate to the created classroom
      navigate(`/classroom/${classroom.id}`);

      // Trigger sidebar refresh for learning classrooms
      console.log('Triggering sidebar refresh for new classroom');
      window.dispatchEvent(new CustomEvent('refreshLearningClassrooms'));

    } catch (error) {
      console.error('Error creating learning space:', error);
      setError('Failed to create learning space. Please try again.');
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
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400">Please log in to access the AI Prompts feature.</p>
        </div>
      </div>
    );
  }

  if (loading || messagesLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-600 mb-4" />
          <p className="text-gray-400">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Conversation Not Found</h2>
          <p className="text-gray-400 mb-4">The conversation you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => navigate('/')} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Go to AI Tools
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#121212] px-6 py-4 sticky top-0 z-10 hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {session && (
              <div>
                <h1 className="text-lg font-semibold text-white">
                  {session.title}
                </h1>
                {session.main_prompt && (
                  <p className="text-sm text-gray-400 line-clamp-1">
                    {session.main_prompt}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Share className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 min-h-[calc(100vh-120px)]">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
          {messages.length === 0 ? (
            <div className="text-center py-20">
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={message.id || index} className="flex gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-blue-600/20 text-blue-400' 
                    : 'bg-purple-600/20 text-purple-400'
                }`}>
                  {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                
                <div className="flex-1">
                  <div className={`inline-block p-4 rounded-lg max-w-3xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800/50 border border-gray-700 text-white'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {/* Learning space creation button - only show for the last AI message if suggested */}
                  {message.sender === 'ai' && 
                   index === messages.length - 1 && 
                   showLearningSpaceButton && 
                   session?.main_prompt && (
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
                        Create Enhanced Learning Space
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">
                        AI will generate detailed content, code examples, and YouTube video recommendations
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          
          {sending && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="inline-block p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                    <span className="text-gray-300">AI is generating a response...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Updated to match Figma design */}
      <div className="bg-[#121212] p-6 sticky bottom-0">
        {error && (
          <div className="mb-4 p-3 bg-red-600/20 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setError(null)}
              className="mt-2 text-red-400 hover:text-red-300"
            >
              Dismiss
            </Button>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What do you need help with?"
              disabled={sending}
              className="w-full h-14 pl-6 pr-16 bg-[#2A2A2A] border border-[#404040] rounded-[28px] text-white placeholder-gray-400 focus:outline-none focus:border-[#7C3AED] transition-colors text-base"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || sending}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-gray-600 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
            >
              {sending ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : (
                <Send className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptChatPage;