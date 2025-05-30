import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Tool } from '../types/Tool';

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
    
    // This would typically call an API to get personalized recommendations
    // For now, we'll use mock data
    const mockRecommendations: RecommendedTool[] = [
      {
        ...tools.find(t => t.name === 'V0') as Tool,
        monthlyCost: 'Free - $20/mo',
        tutorialUrl: 'https://youtube.com/watch?v=example1',
        tutorialDuration: '15:30',
        sampleProjectUrl: 'https://example.com/project1'
      },
      {
        ...tools.find(t => t.name === 'Dora') as Tool,
        monthlyCost: '$29/mo',
        tutorialUrl: 'https://youtube.com/watch?v=example2',
        tutorialDuration: '45:20',
        sampleProjectUrl: 'https://example.com/project2'
      }
    ];

    setRecommendations(mockRecommendations);
    setSubmitted(true);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-2xl font-bold mb-4">
            Tool Recommendations for: {goal}
          </Dialog.Title>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Get Recommendations
              </button>
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

              <button
                onClick={() => setSubmitted(false)}
                className="w-full mt-4 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Modify Preferences
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default GoalRecommendationModal;