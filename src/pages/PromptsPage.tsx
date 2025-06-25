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
  Edit
} from 'lucide-react';
import { PromptSession } from '../types/Prompt';

const PromptsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { sessions, loading, error, createSession, deleteSession } = usePrompts();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [creating, setCreating] = useState(false);

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
    if (window.confirm('이 대화를 삭제하시겠습니까?')) {
      try {
        await deleteSession(sessionId);
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.main_prompt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">대화 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI 프롬프트</h1>
              <p className="text-gray-600">AI와 대화하며 맞춤형 학습 공간을 생성하세요</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="대화 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
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
              새 대화 시작
            </Button>
          </div>
        </div>

        {/* Sessions Grid */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-12 w-12 text-purple-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {searchQuery ? '검색 결과가 없습니다' : 'AI와 첫 대화를 시작해보세요'}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? '다른 검색어로 시도해보세요.' 
                : 'AI와 대화하며 학습하고 싶은 주제를 탐색하고, 맞춤형 학습 공간을 자동으로 생성할 수 있습니다.'
              }
            </p>
            {!searchQuery && (
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
                첫 대화 시작하기
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <Card 
                key={session.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-purple-300"
                onClick={() => navigate(`/prompts/${session.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 mb-2">
                        {session.title}
                      </h3>
                      {session.main_prompt && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {session.main_prompt}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {session.is_favorited && (
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>

                  {session.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {session.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {session.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{session.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(session.updated_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>대화</span>
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