import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface AddClassroomCardProps {
  onClick: () => void;
}

const AddClassroomCard: React.FC<AddClassroomCardProps> = ({ onClick }) => {
  return (
    <Card 
      className="group cursor-pointer border-2 border-dashed border-gray-600 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gray-800/30 hover:bg-gray-800/50"
      onClick={onClick}
    >
      <CardContent className="p-6 h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-400">
        <div className="w-16 h-16 rounded-full bg-gray-700 group-hover:bg-blue-600/20 flex items-center justify-center mb-4 transition-colors">
          <Plus size={32} />
        </div>
        <h3 className="text-lg font-medium text-white">Add New Classroom</h3>
        <p className="text-sm text-center mt-2 text-gray-400">
          Create a new learning space with modules and content
        </p>
      </CardContent>
    </Card>
  );
};

export default AddClassroomCard;