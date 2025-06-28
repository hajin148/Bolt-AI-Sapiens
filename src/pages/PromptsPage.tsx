import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePrompts } from '../hooks/usePrompts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Heart, 
  Calendar,
  Loader2,
  AlertCircle,
  Trash2,
  Edit,
  MoreHorizontal,
  Filter
} from 'lucide-react';
import { PromptSession } from '../types/Prompt';

const PromptsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { sessions, loading, error, createSession, deleteSession } = usePrompts();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'favorites'>('all');

  const handleCreateNewSession = async () => {
    if (!currentUser) return;
    
    setCreating(true);
    try {
      const newSession = await createSession({
        title: 'New Conversation',
        tags: []
      });
      navigate(`/prompts/${newSession.id}`);
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      try {
        await deleteSession(sessionId);
        // Trigger sidebar refresh
        window.dispatchEvent(new CustomEvent('refreshPromptSessions'));
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.main_prompt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || 
      (filterType === 'favorites' && session.is_favorited);
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-600 mb-4" />
          <p className="text-gray-400">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Conversations</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">AI Prompts</h1>
              <p className="text-gray-400">Chat with AI and create personalized learning spaces</p>
            </div>
            
            <Button 
              onClick={handleCreateNewSession}
              disabled={creating}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
            >
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              New Chat
            </Button>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
                className={filterType === 'all' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
              >
                All
              </Button>
              <Button
                variant={filterType === 'favorites' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('favorites')}
                className={filterType === 'favorites' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
              >
                <Heart className="h-3 w-3 mr-1" />
                Favorites
              </Button>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-12 w-12 text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {searchQuery || filterType === 'favorites' ? 'No conversations found' : 'Start your first AI conversation'}
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {searchQuery || filterType === 'favorites'
                ? 'Try adjusting your search or filters.' 
                : 'Chat with AI to explore learning topics and automatically generate personalized learning spaces.'
              }
            </p>
            {!searchQuery && filterType === 'all' && (
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
                Start First Conversation
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSessions.map((session) => (
              <Card 
                key={session.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-purple-500/50 bg-gray-800/50 border-gray-700"
                onClick={() => navigate(`/prompts/${session.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                          {session.title}
                        </h3>
                        {session.is_favorited && (
                          <Heart className="h-4 w-4 text-red-500 fill-current flex-shrink-0" />
                        )}
                      </div>
                      
                      {session.main_prompt && (
                        <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                          {session.main_prompt}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {session.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {session.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-purple-600/20 text-purple-400 border-purple-500/30">
                                  {tag}
                                </Badge>
                              ))}
                              {session.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs bg-gray-600/20 text-gray-400">
                                  +{session.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(session.updated_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="h-8 w-8 p-0 hover:bg-red-600/20 hover:text-red-400 text-gray-400"
                      >
                        <Trash2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        className="h-8 w-8 p-0 hover:bg-gray-700 text-gray-400"
                      >
                        <MoreHorizontal size={14} />
                      </Button>
                    </div>
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