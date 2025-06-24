import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Classroom, CreateClassroomData } from '../../types/Learning';

interface ClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClassroomData) => Promise<void>;
  classroom?: Classroom | null;
  loading?: boolean;
}

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#84CC16', // Lime
];

const ClassroomModal: React.FC<ClassroomModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  classroom,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateClassroomData>({
    name: '',
    description: '',
    color: PRESET_COLORS[0]
  });

  useEffect(() => {
    if (classroom) {
      setFormData({
        name: classroom.name,
        description: classroom.description,
        color: classroom.color
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: PRESET_COLORS[0]
      });
    }
  }, [classroom, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting classroom:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {classroom ? 'Edit Classroom' : 'Create New Classroom'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Classroom Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter classroom name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Syllabus</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what students will learn in this classroom..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label>Color Theme</Label>
            <div className="grid grid-cols-8 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color 
                      ? 'border-gray-900 scale-110' 
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || !formData.name.trim()}
            >
              {loading ? 'Saving...' : classroom ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClassroomModal;