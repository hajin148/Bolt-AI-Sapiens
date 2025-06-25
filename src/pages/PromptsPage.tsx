import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePromptSessions } from '../hooks/usePromptSessions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  Plus, 
  Heart, 
  Calendar, 
  Tag,
  Loader2,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { PromptSession } from '../types/Prompt';

const PromptsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { sessions, loading, error, createSession, deleteSession, updateSession } = usePromptSessions();
  const [creating, setCreating] = useState(false);

  const handleCreateNewSession = async () => {
    if (!currentUser) return;
    
    setCreating(true);
    try {
      const newSession = await createSession();
      navigate(`/prompts/${newSession.id}`);
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleSessionClick = (sessionId: string) => {
    navigate(`/prompts/${sessionId}`);
  };

  const handleToggleFavorite = async (session: PromptSession, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateSession(session.id, { is_favorited: !session.is_favorited });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      try {
        await deleteSession(sessionId);
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access your prompt conversations.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading your conversations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Conversations</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Prompt Conversations</h1>
              <p className="text-gray-600">Chat with AI and create learning spaces from your conversations</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {sessions.length} conversation{sessions.length !== 1 ? 's' : ''}
            </p>
            <Button 
              onClick={handleCreateNewSession} 
              disabled={creating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {creating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              New Conversation
            </Button>
          </div>
        </div>

        {/* Sessions Grid */}
        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-12 w-12 text-purple-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Start Your First Conversation</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Chat with AI to explore topics, ask questions, and automatically generate structured learning spaces.
            </p>
            <Button 
              onClick={handleCreateNewSession} 
              disabled={creating}
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700"
            >
              {creating ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <MessageSquare className="h-5 w-5 mr-2" />
              )}
              Start Chatting
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <Card 
                key={session.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-purple-300"
                onClick={() => handleSessionClick(session.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {session.title}
                      </h3>
                      {session.main_prompt && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {session.main_prompt}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={(e) => handleToggleFavorite(session, e)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Heart 
                          size={16} 
                          className={session.is_favorited ? 'fill-red-500 text-red-500' : 'text-gray-400'} 
                        />
                      </button>
                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="p-1 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  {session.tags && session.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {session.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700"
                        >
                          <Tag size={10} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                      {session.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{session.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar size={12} className="mr-1" />
                    <span>{formatDate(session.updated_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptsPage;