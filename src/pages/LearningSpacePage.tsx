import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLearningSpace } from '../hooks/useLearningSpace';
import ClassroomCard from '../components/learning/ClassroomCard';
import AddClassroomCard from '../components/learning/AddClassroomCard';
import ClassroomModal from '../components/learning/ClassroomModal';
import { Button } from '@/components/ui/button';
import { GraduationCap, Loader2, AlertCircle } from 'lucide-react';
import { Classroom, CreateClassroomData } from '../types/Learning';

const LearningSpacePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { classrooms, loading, error, createClassroom, updateClassroom, deleteClassroom } = useLearningSpace();
  const [showModal, setShowModal] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCreateClassroom = async (data: CreateClassroomData) => {
    setSubmitting(true);
    try {
      await createClassroom(data);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating classroom:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateClassroom = async (data: CreateClassroomData) => {
    if (!editingClassroom) return;
    
    setSubmitting(true);
    try {
      await updateClassroom(editingClassroom.id, data);
      setShowModal(false);
      setEditingClassroom(null);
    } catch (error) {
      console.error('Error updating classroom:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClassroom = (classroom: Classroom) => {
    setEditingClassroom(classroom);
    setShowModal(true);
  };

  const handleDeleteClassroom = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this classroom? This will also delete all modules.')) {
      try {
        await deleteClassroom(id);
      } catch (error) {
        console.error('Error deleting classroom:', error);
      }
    }
  };

  const handleAddNew = () => {
    setEditingClassroom(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClassroom(null);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access your learning space.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading your learning space...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Classrooms</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Learning Space</h1>
              <p className="text-gray-600">Manage your virtual classrooms and learning modules</p>
            </div>
          </div>
          
          {classrooms.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {classrooms.length} classroom{classrooms.length !== 1 ? 's' : ''} created
              </p>
              <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
                <GraduationCap className="h-4 w-4 mr-2" />
                New Classroom
              </Button>
            </div>
          )}
        </div>

        {/* Classrooms Grid */}
        {classrooms.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome to Your Learning Space</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first classroom to start organizing your learning content into structured modules and lessons.
            </p>
            <Button onClick={handleAddNew} size="lg" className="bg-blue-600 hover:bg-blue-700">
              <GraduationCap className="h-5 w-5 mr-2" />
              Create Your First Classroom
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {classrooms.map((classroom) => (
              <ClassroomCard
                key={classroom.id}
                classroom={classroom}
                onEdit={handleEditClassroom}
                onDelete={handleDeleteClassroom}
              />
            ))}
            <AddClassroomCard onClick={handleAddNew} />
          </div>
        )}

        {/* Modal */}
        <ClassroomModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={editingClassroom ? handleUpdateClassroom : handleCreateClassroom}
          classroom={editingClassroom}
          loading={submitting}
        />
      </div>
    </div>
  );
};

export default LearningSpacePage;