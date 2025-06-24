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
import { Module, CreateModuleData } from '../../types/Learning';

interface ModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<CreateModuleData, 'classroom_id'>) => Promise<void>;
  module?: Module | null;
  nextStepNumber: number;
  loading?: boolean;
}

const ModuleModal: React.FC<ModuleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  module,
  nextStepNumber,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    step_number: nextStepNumber
  });

  useEffect(() => {
    if (module) {
      setFormData({
        title: module.title,
        description: module.description,
        step_number: module.step_number
      });
    } else {
      setFormData({
        title: '',
        description: '',
        step_number: nextStepNumber
      });
    }
  }, [module, nextStepNumber, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting module:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {module ? 'Edit Module' : 'Add New Module'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Module Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter module title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what students will learn in this module..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="step_number">Step Number</Label>
            <Input
              id="step_number"
              type="number"
              min="1"
              value={formData.step_number}
              onChange={(e) => setFormData({ ...formData, step_number: parseInt(e.target.value) || 1 })}
              required
            />
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
              disabled={loading || !formData.title.trim()}
            >
              {loading ? 'Saving...' : module ? 'Update' : 'Add Module'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleModal;