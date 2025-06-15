import React from 'react';
import NewsList from '../components/news/NewsList';

const NewsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NewsList />
      </div>
    </div>
  );
};

export default NewsPage;