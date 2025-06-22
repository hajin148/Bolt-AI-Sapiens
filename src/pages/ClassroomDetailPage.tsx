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
  AlertCircle
} from 'lucide-react';
import { Classroom, Module, CreateModuleData } from '../types/Learning';

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
    e.stopPropagation(); // Prevent navigation when editing
    setEditingModule(module);
    setShowModuleModal(true);
  };

  const handleDeleteModule = async (moduleId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when deleting
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

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access this classroom.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading classroom...</p>
        </div>
      </div>
    );
  }

  if (error || !classroom) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Classroom Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The classroom you\'re looking for doesn\'t exist.'}</p>
          <Button onClick={() => navigate('/learning')} variant="outline">
            Back to Learning Space
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/learning')}
            className="mb-4 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learning Space
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${classroom.color}20` }}
                >
                  <BookOpen className="h-6 w-6" style={{ color: classroom.color }} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{classroom.name}</h1>
                  <p className="text-gray-600">{modules.length} module{modules.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleAddModule}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </div>
        </div>

        {/* Syllabus */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Syllabus</h2>
            {classroom.description ? (
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {classroom.description}
              </p>
            ) : (
              <p className="text-gray-500 italic">No syllabus description provided.</p>
            )}
          </CardContent>
        </Card>

        {/* Modules */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Learning Modules</h2>
          </div>

          {modulesLoading ? (
            <div className="text-center py-8">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-600 mb-2" />
              <p className="text-gray-600">Loading modules...</p>
            </div>
          ) : modules.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
                <p className="text-gray-600 mb-4">
                  Start building your curriculum by adding your first learning module.
                </p>
                <Button onClick={handleAddModule} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Module
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {modules.map((module, index) => (
                <Card 
                  key={module.id} 
                  className="group hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300"
                  onClick={() => handleModuleClick(module)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: classroom.color }}
                        >
                          {module.step_number}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {module.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleEditModule(module, e)}
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteModule(module.id, e)}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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