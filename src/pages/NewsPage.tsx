import React from 'react';
import NewsList from '../components/news/NewsList';

const NewsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <NewsList />
      </div>
    </div>
  );
};

export default NewsPage;