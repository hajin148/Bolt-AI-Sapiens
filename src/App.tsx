import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { categories, tools } from './data/tools';
import NavBar from './components/NavBar';
import AuthModal from './components/AuthModal';
import PricingModal from './components/PricingModal';
import SearchBar from './components/SearchBar';
import CategorySection from './components/CategorySection';
import Footer from './components/Footer';
import FavoritesArea from './components/FavoritesArea';
import NewsPage from './pages/NewsPage';
import ArticlePage from './components/news/ArticlePage';
import LearningSpacePage from './pages/LearningSpacePage';
import ClassroomDetailPage from './pages/ClassroomDetailPage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import { useAuth } from './contexts/AuthContext';

function HomePage() {
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
    <>
      <header className="py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">AI Sapiens Directory</h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">Discover the best AI tools organized by category</p>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center space-y-6">
          <div className="w-full max-w-md">
            <SearchBar onSearch={handleSearch} placeholder="Search AI tools.." />
          </div>

          <FavoritesArea allTools={tools} />

          <div className="w-full max-w-xs md:hidden">
            <select
              value={activeCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.title}</option>
              ))}
            </select>
          </div>

          <div className="hidden md:block w-full max-w-4xl">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-full border ${
                  activeCategory === 'all'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-full border ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>{category.title}
                </button>
              ))}
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
        {filteredToolCount === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-medium text-gray-600">No AI tools found.</h2>
            <p className="mt-2 text-gray-500">Try changing your search criteria.</p>
          </div>
        ) : (
          categories.map(category => (
            <CategorySection
              key={category.id}
              category={category}
              tools={toolsByCategory[category.id] || []}
            />
          ))
        )}
      </main>
    </>
  );
}

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const location = useLocation();

  const isNewsRoute = location.pathname.startsWith('/news');
  const isLearningRoute = location.pathname.startsWith('/learning') || location.pathname.startsWith('/classroom');

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />
      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NavBar
          onLoginClick={() => {
            setAuthMode('login');
            setShowAuthModal(true);
          }}
          onSignupClick={() => {
            setAuthMode('signup');
            setShowAuthModal(true);
          }}
          onUpgradeClick={() => setShowPricingModal(true)}
        />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:videoId" element={<ArticlePage />} />
          <Route path="/learning" element={<LearningSpacePage />} />
          <Route path="/classroom/:id" element={<ClassroomDetailPage />} />
          <Route path="/classroom/:classroomId/module/:moduleId" element={<ModuleDetailPage />} />
        </Routes>
      </div>

      {!isNewsRoute && !isLearningRoute && <Footer />}
    </div>
  );
}

export default App;