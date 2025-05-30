import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import GoalRecommendationModal from './GoalRecommendationModal';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder: string;
}

const GOAL_KEYWORDS = ['i want to', 'how to', 'help me'];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const { currentUser, userProfile } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);

    // Check if the input looks like a goal
    const isGoal = GOAL_KEYWORDS.some(keyword => 
      value.toLowerCase().includes(keyword)
    );

    // Show modal only for paid users with goal-like queries
    if (isGoal && currentUser && userProfile?.isPaid) {
      setShowGoalModal(true);
    }
  };

  return (
    <div className="relative max-w-md w-full mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        {query && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={() => {
              setQuery('');
              onSearch('');
            }}
          >
            <span className="sr-only">Clear</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <GoalRecommendationModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        goal={query}
      />
    </div>
  );
};

export default SearchBar;