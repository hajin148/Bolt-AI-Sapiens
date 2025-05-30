import React, { useState, useEffect } from 'react';
import { categories, tools } from './data/tools';
import NavBar from './components/NavBar';
import SearchBar from './components/SearchBar';
import CategorySection from './components/CategorySection';
import Footer from './components/Footer';
import { Globe } from 'lucide-react';

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTools, setFilteredTools] = useState(tools);
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');

  useEffect(() => {
    const filtered = tools.filter((tool) => {
      // Get the category info for this tool
      const toolCategory = categories.find(cat => cat.id === tool.category);
      
      // Convert all searchable text to lowercase for case-insensitive search
      const searchLower = searchQuery.toLowerCase();
      const nameLower = tool.name.toLowerCase();
      const descriptionLower = tool.description.toLowerCase();
      const categoryTitleLower = toolCategory?.title.toLowerCase() || '';
      const categoryDescLower = toolCategory?.description.toLowerCase() || '';

      // Filter by search query across multiple fields
      const matchesSearch = searchQuery === '' || 
        nameLower.includes(searchLower) ||
        descriptionLower.includes(searchLower) ||
        categoryTitleLower.includes(searchLower) ||
        categoryDescLower.includes(searchLower);
      
      // Filter by category
      const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredTools(filtered);
  }, [searchQuery, activeCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    // Scroll to category section if a specific category is selected
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

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  // Group tools by category
  const toolsByCategory = categories.reduce((acc, category) => {
    acc[category.id] = filteredTools.filter(tool => tool.category === category.id);
    return acc;
  }, {} as Record<string, typeof tools>);

  // Count total filtered tools
  const filteredToolCount = filteredTools.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end pt-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-white shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">{language === 'ko' ? 'EN' : 'KO'}</span>
          </button>
        </div>
        
        <NavBar 
          categories={categories} 
          activeCategory={activeCategory} 
          onCategoryChange={handleCategoryChange} 
          language={language}
        />
        
        <header className="py-12">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              {language === 'ko' ? '리버의 AI 툴 모음' : "River's AI Tools Collection"}
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              {language === 'ko' 
                ? '최고의 AI 툴들을 카테고리 별로 확인하세요' 
                : 'Discover the best AI tools organized by category'}
            </p>
          </div>
          
          <div className="mt-10">
            <SearchBar 
              onSearch={handleSearch} 
              placeholder={language === 'ko' ? 'AI 툴 검색하기..' : 'Search AI tools..'}
            />
          </div>
          
          {searchQuery && (
            <div className="mt-4 text-center text-sm text-gray-500">
              {language === 'ko'
                ? `${filteredToolCount}개의 AI 툴이 "${searchQuery}"와(과) 관련이 있습니다`
                : `Found ${filteredToolCount} AI tool${filteredToolCount !== 1 ? 's' : ''} related to "${searchQuery}"`}
            </div>
          )}
        </header>

        <main>
          {/* If no tools found */}
          {filteredToolCount === 0 && (
            <div className="text-center py-16">
              <h2 className="text-xl font-medium text-gray-600">
                {language === 'ko' ? '관련된 AI 툴이 없습니다.' : 'No AI tools found.'}
              </h2>
              <p className="mt-2 text-gray-500">
                {language === 'ko' ? '검색 조건을 변경해보세요.' : 'Try changing your search criteria.'}
              </p>
            </div>
          )}

          {/* Show all categories or filtered categories */}
          {categories.map(category => (
            <CategorySection 
              key={category.id} 
              category={category} 
              tools={toolsByCategory[category.id] || []}
              language={language}
            />
          ))}
        </main>
      </div>
      
      <Footer language={language} />
    </div>
  );
}

export default App;