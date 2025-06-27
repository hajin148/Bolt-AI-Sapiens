import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Edit, Trash2 } from 'lucide-react';
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
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105"
      style={{ backgroundColor: `${classroom.color}15` }}
    >
      <div 
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: classroom.color }}
      />
      
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
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
                className="h-8 w-8 p-0 hover:bg-gray-100"
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
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {truncateDescription(classroom.description)}
          </p>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <BookOpen size={12} />
            <span>{classroom.module_count || 0} modules</span>
          </div>
        </div>
        
        <Button 
          onClick={handleViewModules}
          className="w-full"
          style={{ backgroundColor: classroom.color }}
        >
          View Modules
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClassroomCard;