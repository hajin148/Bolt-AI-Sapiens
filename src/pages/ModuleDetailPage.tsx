import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ContentRenderer from '../components/learning/ContentRenderer';
import VideoDigestList from '../components/learning/VideoDigestList';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Module, Classroom } from '../types/Learning';

const ModuleDetailPage: React.FC = () => {
  const { classroomId, moduleId } = useParams<{ classroomId: string; moduleId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [module, setModule] = useState<Module | null>(null);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [allModules, setAllModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!classroomId || !moduleId || !currentUser) return;

      try {
        setLoading(true);

        // Fetch classroom
        const { data: classroomData, error: classroomError } = await supabase
          .from('classrooms')
          .select('*')
          .eq('id', classroomId)
          .eq('user_id', currentUser.id)
          .single();

        if (classroomError) throw classroomError;
        setClassroom(classroomData);

        // Fetch current module
        const { data: moduleData, error: moduleError } = await supabase
          .from('modules')
          .select('*')
          .eq('id', moduleId)
          .eq('classroom_id', classroomId)
          .single();

        if (moduleError) throw moduleError;
        setModule(moduleData);

        // Fetch all modules for navigation
        const { data: allModulesData, error: allModulesError } = await supabase
          .from('modules')
          .select('*')
          .eq('classroom_id', classroomId)
          .order('step_number', { ascending: true });

        if (allModulesError) throw allModulesError;
        setAllModules(allModulesData || []);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch module');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classroomId, moduleId, currentUser]);

  const getCurrentModuleIndex = () => {
    return allModules.findIndex(m => m.id === moduleId);
  };

  const getPreviousModule = () => {
    const currentIndex = getCurrentModuleIndex();
    return currentIndex > 0 ? allModules[currentIndex - 1] : null;
  };

  const getNextModule = () => {
    const currentIndex = getCurrentModuleIndex();
    return currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null;
  };

  const navigateToModule = (targetModule: Module) => {
    navigate(`/classroom/${classroomId}/module/${targetModule.id}`);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access this module.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading module...</p>
        </div>
      </div>
    );
  }

  if (error || !module || !classroom) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Module Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The module you\'re looking for doesn\'t exist.'}</p>
          <Button onClick={() => navigate(`/classroom/${classroomId}`)} variant="outline">
            Back to Classroom
          </Button>
        </div>
      </div>
    );
  }

  const previousModule = getPreviousModule();
  const nextModule = getNextModule();
  const currentIndex = getCurrentModuleIndex();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/classroom/${classroomId}`)}
            className="mb-4 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {classroom.name}
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: classroom.color }}
            >
              {module.step_number}
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <BookOpen className="h-4 w-4" />
                <span>Module {module.step_number} of {allModules.length}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{module.title}</h1>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                backgroundColor: classroom.color,
                width: `${((currentIndex + 1) / allModules.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Single Scrollable Content */}
        <div className="space-y-8">
          {/* Module Overview */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">모듈 개요</h2>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                  {module.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Learning Content */}
          {module.content && module.content.length > 0 && (
            <Card>
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">상세 학습 내용</h2>
                <ContentRenderer content={module.content} />
              </CardContent>
            </Card>
          )}

          {/* Recommended Videos */}
          {module.digests && module.digests.length > 0 && (
            <Card>
              <CardContent className="p-8">
                <VideoDigestList digests={module.digests} />
              </CardContent>
            </Card>
          )}

          {/* Completion Section */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>예상 학습 시간: 15-30분</span>
                </div>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  학습 완료
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12">
          <div className="flex-1">
            {previousModule && (
              <Button
                variant="outline"
                onClick={() => navigateToModule(previousModule)}
                className="group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <div className="text-xs text-gray-500">이전</div>
                  <div className="font-medium">{previousModule.title}</div>
                </div>
              </Button>
            )}
          </div>

          <div className="flex-1 text-center">
            <div className="text-sm text-gray-500">
              {currentIndex + 1} of {allModules.length} modules
            </div>
          </div>

          <div className="flex-1 flex justify-end">
            {nextModule && (
              <Button
                onClick={() => navigateToModule(nextModule)}
                className="group"
                style={{ backgroundColor: classroom.color }}
              >
                <div className="text-right">
                  <div className="text-xs opacity-90">다음</div>
                  <div className="font-medium">{nextModule.title}</div>
                </div>
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </div>

        {/* Module List Sidebar */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">전체 모듈</h3>
            <div className="space-y-2">
              {allModules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => navigateToModule(mod)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    mod.id === moduleId
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        mod.id === moduleId
                          ? 'text-white'
                          : 'text-white'
                      }`}
                      style={{ backgroundColor: mod.id === moduleId ? classroom.color : '#9CA3AF' }}
                    >
                      {mod.step_number}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${
                        mod.id === moduleId ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {mod.title}
                      </div>
                      {mod.id === moduleId && (
                        <div className="text-xs text-blue-600 mt-1">현재 학습 중</div>
                      )}
                      {/* Content indicators */}
                      <div className="flex items-center gap-2 mt-1">
                        {mod.content && mod.content.length > 0 && (
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
                            콘텐츠 {mod.content.length}개
                          </span>
                        )}
                        {mod.digests && mod.digests.length > 0 && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                            영상 {mod.digests.length}개
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModuleDetailPage;