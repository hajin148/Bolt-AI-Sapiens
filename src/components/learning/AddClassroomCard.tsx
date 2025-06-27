import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface AddClassroomCardProps {
  onClick: () => void;
}

const AddClassroomCard: React.FC<AddClassroomCardProps> = ({ onClick }) => {
  return (
    <Card 
      className="group cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:scale-105"
      onClick={onClick}
    >
      <CardContent className="p-6 h-full flex flex-col items-center justify-center text-gray-500 group-hover:text-blue-600">
        <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center mb-4 transition-colors">
          <Plus size={32} />
        </div>
        <h3 className="text-lg font-medium">Add New Classroom</h3>
        <p className="text-sm text-center mt-2">
          Create a new learning space with modules and content
        </p>
      </CardContent>
    </Card>
  );
};

export default AddClassroomCard;