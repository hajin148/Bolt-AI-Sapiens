import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Edit, Trash2, ChevronRight } from 'lucide-react';
import { Classroom } from '../../types/Learning';

interface ClassroomCardProps {
  classroom: Classroom;
  onEdit: (classroom: Classroom) => void;
  onDelete: (id: string) => void;
}

const ClassroomCard: React.FC<ClassroomCardProps> = ({ classroom, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleViewModules = () => {
    navigate(`/classroom/${classroom.id}`);
  };

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 bg-gray-800/50 border-gray-700 hover:border-gray-600 cursor-pointer"
      onClick={handleViewModules}
    >
      {/* Color accent bar */}
      <div 
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: classroom.color }}
      />
      
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
              {classroom.name}
            </h3>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(classroom);
                }}
                className="h-8 w-8 p-0 hover:bg-gray-700 text-gray-400 hover:text-white"
              >
                <Edit size={14} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(classroom.id);
                }}
                className="h-8 w-8 p-0 hover:bg-red-600/20 hover:text-red-400 text-gray-400"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-gray-400 mb-4 line-clamp-3">
            {truncateDescription(classroom.description)}
          </p>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <BookOpen size={12} />
            <span>{classroom.module_count || 0} modules</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Button 
            onClick={handleViewModules}
            className="flex-1 mr-2"
            style={{ backgroundColor: classroom.color }}
          >
            View Modules
          </Button>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassroomCard;