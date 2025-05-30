import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Tool } from '../types/Tool';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { tools } from '../data/tools';

interface GoalRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: string;
}

interface RecommendedTool extends Tool {
  monthlyCost?: string;
  tutorialUrl?: string;
  tutorialDuration?: string;
  sampleProjectUrl?: string;
}

const GoalRecommendationModal: React.FC<GoalRecommendationModalProps> = ({
  isOpen,
  onClose,
  goal
}) => {
  const [level, setLevel] = useState('beginner');
  const [timeAvailable, setTimeAvailable] = useState('1 hour');
  const [language, setLanguage] = useState('English');
  const [recommendations, setRecommendations] = useState<RecommendedTool[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock recommendations based on the goal
    const mockRecommendations: RecommendedTool[] = [
      {
        ...tools.find(t => t.name === 'V0')!,
        monthlyCost: 'Free - $20/mo',
        tutorialUrl: 'https://youtube.com/watch?v=example1',
        tutorialDuration: '15:30',
        sampleProjectUrl: 'https://example.com/project1'
      },
      {
        ...tools.find(t => t.name === 'Dora')!,
        monthlyCost: '$29/mo',
        tutorialUrl: 'https://youtube.com/watch?v=example2',
        tutorialDuration: '45:20',
        sampleProjectUrl: 'https://example.com/project2'
      }
    ];

    setRecommendations(mockRecommendations);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setRecommendations([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Tool Recommendations
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-6">
            Goal: <span className="font-medium text-gray-900">{goal}</span>
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Programming Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Available
                  </label>
                  <select
                    value={timeAvailable}
                    onChange={(e) => setTimeAvailable(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="1 hour">1 hour</option>
                    <option value="1 day">1 day</option>
                    <option value="1 week">1 week</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="English">English</option>
                    <option value="Korean">Korean</option>
                  </select>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Get Recommendations
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              {recommendations.map((tool) => (
                <div
                  key={tool.name}
                  className="border rounded-lg p-4 hover:border-blue-400 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{tool.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {tool.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">
                        {tool.monthlyCost}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {tool.tutorialUrl && (
                      <a
                        href={tool.tutorialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline block"
                      >
                        📺 Tutorial ({tool.tutorialDuration})
                      </a>
                    )}
                    {tool.sampleProjectUrl && (
                      <a
                        href={tool.sampleProjectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline block"
                      >
                        🚀 Sample Project
                      </a>
                    )}
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full mt-4"
              >
                Modify Preferences
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoalRecommendationModal;