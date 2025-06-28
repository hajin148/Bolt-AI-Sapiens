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
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  List
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
  const [showModuleList, setShowModuleList] = useState(false);

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
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400">Please log in to access this module.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-400">Loading module...</p>
        </div>
      </div>
    );
  }

  if (error || !module || !classroom) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Module Not Found</h2>
          <p className="text-gray-400 mb-4">{error || 'The module you\'re looking for doesn\'t exist.'}</p>
          <Button onClick={() => navigate(`/classroom/${classroomId}`)} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
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
    <div className="min-h-screen bg-[#121212]">
      {/* Fixed Header - Following Figma */}
      <div className="sticky top-0 bg-[#121212]/95 backdrop-blur-sm border-b border-gray-800 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(`/classroom/${classroomId}`)}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {classroom.name}
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Module {module.step_number} of {allModules.length}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Module List Toggle */}
              <Button
                variant="ghost"
                onClick={() => setShowModuleList(!showModuleList)}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <List className="h-4 w-4" />
              </Button>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  onClick={() => previousModule && navigateToModule(previousModule)}
                  disabled={!previousModule}
                  className="text-gray-300 hover:text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => nextModule && navigateToModule(nextModule)}
                  disabled={!nextModule}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  style={{ backgroundColor: nextModule ? classroom.color : undefined }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-1 mt-4">
            <div 
              className="h-1 rounded-full transition-all duration-300"
              style={{ 
                backgroundColor: classroom.color,
                width: `${((currentIndex + 1) / allModules.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${showModuleList ? 'mr-80' : ''}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Module Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: classroom.color }}
                >
                  {module.step_number}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{module.title}</h1>
                  <p className="text-gray-400 mt-1">Step {module.step_number} of {allModules.length}</p>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              {/* Module Overview */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                    <h2 className="text-xl font-semibold text-white">Module Overview</h2>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                      {module.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Learning Content */}
              {module.content && module.content.length > 0 && (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-8">
                    <h2 className="text-xl font-semibold text-white mb-6">Detailed Learning Content</h2>
                    <ContentRenderer content={module.content} />
                  </CardContent>
                </Card>
              )}

              {/* Recommended Videos */}
              {module.digests && module.digests.length > 0 && (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-8">
                    <VideoDigestList digests={module.digests} />
                  </CardContent>
                </Card>
              )}

              {/* Completion Section */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>Estimated learning time: 15-30 minutes</span>
                    </div>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Module List Sidebar - Following Figma */}
        {showModuleList && (
          <div className="fixed right-0 top-[73px] w-80 h-[calc(100vh-73px)] bg-gray-900/95 backdrop-blur-sm border-l border-gray-800 z-30">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">All Modules</h3>
              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {allModules.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => navigateToModule(mod)}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      mod.id === moduleId
                        ? 'bg-blue-600/20 border border-blue-500/30'
                        : 'hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          mod.id === moduleId
                            ? 'text-white'
                            : 'text-white'
                        }`}
                        style={{ backgroundColor: mod.id === moduleId ? classroom.color : '#6B7280' }}
                      >
                        {mod.step_number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${
                          mod.id === moduleId ? 'text-blue-300' : 'text-white'
                        }`}>
                          {mod.title}
                        </div>
                        {mod.id === moduleId && (
                          <div className="text-xs text-blue-400 mt-1">Currently Learning</div>
                        )}
                        {/* Content indicators */}
                        <div className="flex items-center gap-2 mt-2">
                          {mod.content && mod.content.length > 0 && (
                            <span className="text-xs bg-green-600/20 text-green-400 px-2 py-0.5 rounded border border-green-500/30">
                              {mod.content.length} Items
                            </span>
                          )}
                          {mod.digests && mod.digests.length > 0 && (
                            <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
                              {mod.digests.length} Videos
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleDetailPage;