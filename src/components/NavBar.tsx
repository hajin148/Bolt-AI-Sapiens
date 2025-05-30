import React, { useState, useEffect } from 'react';
import { CategoryInfo } from '../types/Tool';

interface NavBarProps {
  categories: CategoryInfo[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ categories, activeCategory, onCategoryChange }) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${isSticky ? 'sticky top-0 z-10 bg-white/95 shadow-md backdrop-blur-sm py-2' : 'py-4'} transition-all duration-300 ease-in-out`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">
              AI Sapiens
            </h1>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <select
                value={activeCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;