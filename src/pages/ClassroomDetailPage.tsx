import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useClassroomModules } from '../hooks/useLearningSpace';
import { supabase } from '../lib/supabase';
import ModuleModal from '../components/learning/ModuleModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Plus, 
  BookOpen, 
  Edit, 
  Trash2, 
  ChevronRight,
  Loader2,
  AlertCircle,
  Search,
  Play,
  CheckCircle,
  Circle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Classroom, Module, CreateModuleData, ModuleProgress } from '../types/Learning';

const ClassroomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { modules, loading: modulesLoading, createModule, updateModule, deleteModule } = useClassroomModules(id || '');
  
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleProgress, setModuleProgress] = useState<Record<string, ModuleProgress>>({});
  const [progressLoading, setProgressLoading] = useState(true);

  useEffect(() => {
    const fetchClassroom = async () => {
      if (!id || !currentUser) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('classrooms')
          .select('*')
          .eq('id', id)
          .eq('user_id', currentUser.id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Classroom not found');

        setClassroom(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch classroom');
      } finally {
        setLoading(false);
      }
    };

    fetchClassroom();
  }, [id, currentUser]);

  // Fetch module progress for all modules
  useEffect(() => {
    const fetchModuleProgress = async () => {
      if (!currentUser || modules.length === 0) return;

      try {
        setProgressLoading(true);
        const moduleIds = modules.map(m => m.id);
        
        const { data, error } = await supabase
          .from('module_progress')
          .select('*')
          .eq('user_id', currentUser.id)
          .in('module_id', moduleIds);

        if (error) throw error;

        const progressMap: Record<string, ModuleProgress> = {};
        data?.forEach(progress => {
          progressMap[progress.module_id] = progress;
        });
        
        setModuleProgress(progressMap);
      } catch (err) {
        console.error('Error fetching module progress:', err);
      } finally {
        setProgressLoading(false);
      }
    };

    fetchModuleProgress();
  }, [currentUser, modules]);

  const handleCreateModule = async (data: Omit<CreateModuleData, 'classroom_id'>) => {
    setSubmitting(true);
    try {
      await createModule(data);
      setShowModuleModal(false);
    } catch (error) {
      console.error('Error creating module:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateModule = async (data: Omit<CreateModuleData, 'classroom_id'>) => {
    if (!editingModule) return;
    
    setSubmitting(true);
    try {
      await updateModule(editingModule.id, data);
      setShowModuleModal(false);
      setEditingModule(null);
    } catch (error) {
      console.error('Error updating module:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditModule = (module: Module, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingModule(module);
    setShowModuleModal(true);
  };

  const handleDeleteModule = async (moduleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this module?')) {
      try {
        await deleteModule(moduleId);
      } catch (error) {
        console.error('Error deleting module:', error);
      }
    }
  };

  const handleModuleClick = (module: Module) => {
    navigate(`/classroom/${id}/module/${module.id}`);
  };

  const handleAddModule = () => {
    setEditingModule(null);
    setShowModuleModal(true);
  };

  const handleCloseModal = () => {
    setShowModuleModal(false);
    setEditingModule(null);
  };

  const getNextStepNumber = () => {
    return modules.length > 0 ? Math.max(...modules.map(m => m.step_number)) + 1 : 1;
  };

  const filteredModules = modules.filter(module =>
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isModuleCompleted = (moduleId: string) => {
    return moduleProgress[moduleId]?.is_completed || false;
  };

  const getCompletedModulesCount = () => {
    return filteredModules.filter(module => isModuleCompleted(module.id)).length;
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400">Please log in to access this classroom.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-400">Loading classroom...</p>
        </div>
      </div>
    );
  }

  if (error || !classroom) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Classroom Not Found</h2>
          <p className="text-gray-400 mb-4">{error || 'The classroom you\'re looking for doesn\'t exist.'}</p>
          <Button onClick={() => navigate('/learning')} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Back to Learning Space
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - Following Figma Design */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/learning')}
            className="mb-6 text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learning Space
          </Button>

          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${classroom.color}20` }}
                >
                  <BookOpen className="h-8 w-8" style={{ color: classroom.color }} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{classroom.name}</h1>
                  <div className="flex items-center gap-4 text-gray-400">
                    <span>{filteredModules.length} module{filteredModules.length !== 1 ? 's' : ''}</span>
                    {!progressLoading && (
                      <span className="text-green-400">
                        {getCompletedModulesCount()} completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleAddModule}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Syllabus */}
        <Card className="mb-8 bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Syllabus</h2>
            {classroom.description ? (
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {classroom.description}
              </p>
            ) : (
              <p className="text-gray-500 italic">No syllabus description provided.</p>
            )}
          </CardContent>
        </Card>

        {/* Modules - Following Figma List Design */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Learning Modules</h2>
            {searchQuery && (
              <p className="text-sm text-gray-400">
                {filteredModules.length} module{filteredModules.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          {modulesLoading ? (
            <div className="text-center py-8">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-600 mb-2" />
              <p className="text-gray-400">Loading modules...</p>
            </div>
          ) : filteredModules.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  {searchQuery ? 'No modules found' : 'No modules yet'}
                </h3>
                <p className="text-gray-400 mb-4">
                  {searchQuery 
                    ? 'Try searching with different keywords.'
                    : 'Start building your curriculum by adding your first learning module.'
                  }
                </p>
                {!searchQuery && (
                  <Button onClick={handleAddModule} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Module
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredModules.map((module, index) => {
                const isCompleted = isModuleCompleted(module.id);
                
                return (
                  <Card 
                    key={module.id} 
                    className={`group hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-blue-500/50 bg-gray-800/50 border-gray-700 ${
                      isCompleted ? 'ring-2 ring-green-500/30' : ''
                    }`}
                    onClick={() => handleModuleClick(module)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 relative">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                            style={{ backgroundColor: classroom.color }}
                          >
                            {module.step_number}
                          </div>
                          {/* Completion indicator */}
                          {isCompleted && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`text-lg font-semibold group-hover:text-blue-400 transition-colors ${
                              isCompleted ? 'text-green-400' : 'text-white'
                            }`}>
                              {module.title}
                            </h3>
                            {isCompleted && (
                              <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded border border-green-500/30">
                                Completed
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm line-clamp-2">
                            {module.description}
                          </p>
                          
                          {/* Content indicators */}
                          <div className="flex items-center gap-3 mt-2">
                            {module.content && module.content.length > 0 && (
                              <span className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded border border-green-500/30">
                                {module.content.length} Content Items
                              </span>
                            )}
                            {module.digests && module.digests.length > 0 && (
                              <span className="text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded border border-red-500/30 flex items-center gap-1">
                                <Play className="h-3 w-3" />
                                {module.digests.length} Videos
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleEditModule(module, e)}
                              className="h-8 w-8 p-0 hover:bg-gray-700 text-gray-400 hover:text-white"
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleDeleteModule(module.id, e)}
                              className="h-8 w-8 p-0 hover:bg-red-600/20 hover:text-red-400 text-gray-400"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                          <ChevronRight className={`h-5 w-5 group-hover:text-blue-400 transition-colors ${
                            isCompleted ? 'text-green-400' : 'text-gray-400'
                          }`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Module Modal */}
        <ModuleModal
          isOpen={showModuleModal}
          onClose={handleCloseModal}
          onSubmit={editingModule ? handleUpdateModule : handleCreateModule}
          module={editingModule}
          nextStepNumber={getNextStepNumber()}
          loading={submitting}
        />
      </div>
    </div>
  );
};

export default ClassroomDetailPage;