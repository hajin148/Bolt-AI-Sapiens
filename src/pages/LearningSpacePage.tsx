import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLearningSpace } from '../hooks/useLearningSpace';
import ClassroomCard from '../components/learning/ClassroomCard';
import ClassroomModal from '../components/learning/ClassroomModal';
import { Button } from '@/components/ui/button';
import { GraduationCap, Loader2, AlertCircle, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Classroom, CreateClassroomData } from '../types/Learning';

const LearningSpacePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { classrooms, loading, error, createClassroom, updateClassroom, deleteClassroom } = useLearningSpace();
  const [showModal, setShowModal] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<Classroom | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
        // Trigger sidebar refresh
        window.dispatchEvent(new CustomEvent('refreshLearningClassrooms'));
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

  const filteredClassrooms = classrooms.filter(classroom =>
    classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    classroom.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400">Please log in to access your learning space.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-400">Loading your learning space...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Classrooms</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - Following Figma Design */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Learning Space</h1>
              <p className="text-gray-400">Manage your virtual classrooms and learning modules</p>
            </div>
          </div>

          {/* Search Bar - Following Figma */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search classrooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Classrooms Grid - Following Figma Layout */}
        {filteredClassrooms.length === 0 && searchQuery === '' ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="h-12 w-12 text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">Welcome to Your Learning Space</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Create your first classroom to start organizing your learning content into structured modules and lessons.
            </p>
            <Button onClick={handleAddNew} size="lg" className="bg-blue-600 hover:bg-blue-700">
              <GraduationCap className="h-5 w-5 mr-2" />
              Create Your First Classroom
            </Button>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-6">
              <p className="text-sm text-gray-400">
                {filteredClassrooms.length} classroom{filteredClassrooms.length !== 1 ? 's' : ''} 
                {searchQuery && ` found for "${searchQuery}"`}
              </p>
            </div>

            {/* Grid Layout - Following Figma */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Classroom Cards */}
              {filteredClassrooms.map((classroom) => (
                <ClassroomCard
                  key={classroom.id}
                  classroom={classroom}
                  onEdit={handleEditClassroom}
                  onDelete={handleDeleteClassroom}
                />
              ))}
            </div>

            {/* No Results */}
            {filteredClassrooms.length === 0 && searchQuery && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No classrooms found</h3>
                <p className="text-gray-400 mb-4">Try searching with different keywords.</p>
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Clear search
                </Button>
              </div>
            )}
          </>
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