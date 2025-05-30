import React, { useState, useEffect } from 'react';
import { categories, tools } from './data/tools';
import NavBar from './components/NavBar';
import SearchBar from './components/SearchBar';
import CategorySection from './components/CategorySection';
import Footer from './components/Footer';
import FavoritesArea from './components/FavoritesArea';

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTools, setFilteredTools] = useState(tools);

  useEffect(() => {
    const filtered = tools.filter((tool) => {
      const toolCategory = categories.find(cat => cat.id === tool.category);
      
      const searchLower = searchQuery.toLowerCase();
      const nameLower = tool.name.toLowerCase();
      const descriptionLower = tool.description.toLowerCase();
      const categoryTitleLower = toolCategory?.title.toLowerCase() || '';
      const categoryDescLower = toolCategory?.description.toLowerCase() || '';

      const matchesSearch = searchQuery === '' || 
        nameLower.includes(searchLower) ||
        descriptionLower.includes(searchLower) ||
        categoryTitleLower.includes(searchLower) ||
        categoryDescLower.includes(searchLower);
      
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredTools(filtered);
  }, [searchQuery, activeCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (categoryId !== 'all') {
      const element = document.getElementById(categoryId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toolsByCategory = categories.reduce((acc, category) => {
    acc[category.id] = filteredTools.filter(tool => tool.category === category.id);
    return acc;
  }, {} as Record<string, typeof tools>);

  const filteredToolCount = filteredTools.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NavBar />
        
        <header className="py-12">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              AI Sapiens Directory
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Discover the best AI tools organized by category
            </p>
          </div>
          
          <div className="mt-10 space-y-6">
            <div className="max-w-md mx-auto">
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="Search AI tools.."
              />
            </div>

            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10" />
              
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex space-x-2 px-8 min-w-max py-2">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                      ${activeCategory === 'all'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }
                    `}
                  >
                    All Categories
                  </button>
                  
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                        ${activeCategory === category.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }
                      `}
                    >
                      <span className="mr-1">{category.icon}</span>
                      {category.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {searchQuery && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Found {filteredToolCount} AI tool{filteredToolCount !== 1 ? 's' : ''} related to "{searchQuery}"
            </div>
          )}
        </header>

        <main>
          <FavoritesArea allTools={tools} />

          {filteredToolCount === 0 && (
            <div className="text-center py-16">
              <h2 className="text-xl font-medium text-gray-600">
                No AI tools found.
              </h2>
              <p className="mt-2 text-gray-500">
                Try changing your search criteria.
              </p>
            </div>
          )}

          {categories.map(category => (
            <CategorySection 
              key={category.id} 
              category={category} 
              tools={toolsByCategory[category.id] || []}
            />
          ))}
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

export default App;