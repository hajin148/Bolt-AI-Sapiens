import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePromptMessages } from '../hooks/usePromptSessions';
import { GeminiService } from '../services/geminiService';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Send, 
  Loader2, 
  AlertCircle, 
  BookOpen,
  Heart,
  Tag,
  Plus
} from 'lucide-react';
import { PromptSession, PromptMessage } from '../types/Prompt';

const PromptSessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { messages, loading: messagesLoading, addMessage } = usePromptMessages(sessionId || '');
  
  const [session, setSession] = useState<PromptSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [generatingLearningSpace, setGeneratingLearningSpace] = useState(false);
  const [showSuggestLearningSpace, setShowSuggestLearningSpace] = useState(false);
  
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
        if (!data) throw new Error('Session not found');

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
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || sending || !sessionId) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setSending(true);

    try {
      // Add user message
      await addMessage({
        sender: 'user',
        content: userMessage
      });

      // Prepare conversation history
      const conversationHistory = messages.map(msg => 
        `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.content}`
      );
      conversationHistory.push(`User: ${userMessage}`);

      // Get AI response
      const response = await GeminiService.generateResponse(userMessage, conversationHistory);

      // Add AI message
      await addMessage({
        sender: 'ai',
        content: response.content
      });

      // Update session with main_prompt if provided
      if (response.main_prompt && session) {
        await supabase
          .from('prompt_sessions')
          .update({ 
            main_prompt: response.main_prompt,
            title: response.main_prompt.length > 50 
              ? response.main_prompt.substring(0, 50) + '...' 
              : response.main_prompt
          })
          .eq('id', sessionId);

        setSession(prev => prev ? {
          ...prev,
          main_prompt: response.main_prompt!,
          title: response.main_prompt!.length > 50 
            ? response.main_prompt!.substring(0, 50) + '...' 
            : response.main_prompt!
        } : null);
      }

      // Show learning space suggestion if appropriate
      if (response.suggest_learning_space) {
        setShowSuggestLearningSpace(true);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      await addMessage({
        sender: 'ai',
        content: 'Sorry, I encountered an error. Please try again.'
      });
    } finally {
      setSending(false);
    }
  };

  const handleCreateLearningSpace = async () => {
    if (!sessionId || !messages.length) return;

    setGeneratingLearningSpace(true);
    try {
      // Prepare conversation history
      const conversationHistory = messages.map(msg => 
        `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.content}`
      );

      // Generate learning space data
      const learningSpaceData = await GeminiService.generateLearningSpace(conversationHistory);

      // Create classroom
      const { data: classroom, error: classroomError } = await supabase
        .from('classrooms')
        .insert({
          name: learningSpaceData.classroom.name,
          description: learningSpaceData.classroom.description,
          color: learningSpaceData.classroom.theme_color,
          user_id: currentUser!.id
        })
        .select()
        .single();

      if (classroomError) throw classroomError;

      // Create modules
      const moduleInserts = learningSpaceData.modules.map(module => ({
        classroom_id: classroom.id,
        title: module.title,
        description: module.description,
        step_number: module.step
      }));

      const { error: modulesError } = await supabase
        .from('modules')
        .insert(moduleInserts);

      if (modulesError) throw modulesError;

      // Create learning space link
      await supabase
        .from('learning_space_links')
        .insert({
          prompt_session_id: sessionId,
          classroom_id: classroom.id
        });

      // Navigate to the created learning space
      navigate(`/classroom/${classroom.id}`);

    } catch (error) {
      console.error('Error creating learning space:', error);
      alert('Failed to create learning space. Please try again.');
    } finally {
      setGeneratingLearningSpace(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!session) return;

    try {
      const { error } = await supabase
        .from('prompt_sessions')
        .update({ is_favorited: !session.is_favorited })
        .eq('id', session.id);

      if (error) throw error;

      setSession(prev => prev ? { ...prev, is_favorited: !prev.is_favorited } : null);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access this conversation.</p>
        </div>
      </div>
    );
  }

  if (loading || messagesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-600 mb-4" />
          <p className="text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Conversation Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The conversation you\'re looking for doesn\'t exist.'}</p>
          <Button onClick={() => navigate('/prompts')} variant="outline">
            Back to Conversations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Button
            variant="ghost"
            onClick={() => navigate('/prompts')}
            className="mb-4 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Conversations
          </Button>
          
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">Main Prompt</h2>
            <button
              onClick={handleToggleFavorite}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Heart 
                size={16} 
                className={session.is_favorited ? 'fill-red-500 text-red-500' : 'text-gray-400'} 
              />
            </button>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-gray-700">
              {session.main_prompt || 'No main topic identified yet. Continue the conversation to help AI understand your learning goals.'}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-1">
              {session.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700"
                >
                  <Tag size={10} className="mr-1" />
                  {tag}
                </span>
              ))}
              <button className="inline-flex items-center px-2 py-1 rounded-full text-xs border border-dashed border-gray-300 text-gray-500 hover:border-purple-300 hover:text-purple-600">
                <Plus size={10} className="mr-1" />
                Add tag
              </button>
            </div>
          </div>

          <div className="flex items-center text-xs text-gray-500">
            <input type="checkbox" className="mr-2" checked={session.is_favorited} readOnly />
            <span>Favorite</span>
          </div>
        </div>

        {(showSuggestLearningSpace || messages.length > 2) && (
          <div className="p-4">
            <Button
              onClick={handleCreateLearningSpace}
              disabled={generatingLearningSpace || messages.length === 0}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {generatingLearningSpace ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <BookOpen className="h-4 w-4 mr-2" />
              )}
              Create Learning Space
            </Button>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start the conversation</h3>
              <p className="text-gray-600">Ask questions, explore topics, or discuss what you'd like to learn.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl px-4 py-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  <div className="text-sm font-medium mb-1">
                    {message.sender === 'user' ? 'You' : 'AI'}
                  </div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))
          )}
          
          {sending && (
            <div className="flex justify-start">
              <div className="max-w-3xl px-4 py-3 rounded-lg bg-white border border-gray-200">
                <div className="text-sm font-medium mb-1">AI</div>
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={sending}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={!inputValue.trim() || sending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PromptSessionPage;