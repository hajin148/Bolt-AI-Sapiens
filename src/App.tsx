import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { categories, tools } from './data/tools';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import AuthModal from './components/AuthModal';
import PricingModal from './components/PricingModal';
import SearchBar from './components/SearchBar';
import ToolCard from './components/ToolCard';
import ToolSidebar from './components/ToolSidebar';
import Footer from './components/Footer';
import NewsPage from './pages/NewsPage';
import ArticlePage from './components/news/ArticlePage';
import LearningSpacePage from './pages/LearningSpacePage';
import ClassroomDetailPage from './pages/ClassroomDetailPage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import PromptsPage from './pages/PromptsPage';
import PromptChatPage from './pages/PromptChatPage';
import { useAuth } from './contexts/AuthContext';
import { Tool } from './types/Tool';

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTools, setFilteredTools] = useState(tools);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showToolSidebar, setShowToolSidebar] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
    setShowToolSidebar(true);
  };

  const handleCloseSidebar = () => {
    setShowToolSidebar(false);
    setSelectedTool(null);
  };

  const toolsByCategory = categories.reduce((acc, category) => {
    acc[category.id] = filteredTools.filter(tool => tool.category === category.id);
    return acc;
  }, {} as Record<string, typeof tools>);

  const filteredToolCount = filteredTools.length;

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#121212] opacity-100"></div>

        <div className="relative px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto mb-16">
            <div className="max-w-lg mb-2">
              <SearchBar onSearch={handleSearch} placeholder="Search by key feature" />
              {searchQuery && (
                <div className="mt-2 text-sm text-gray-400">
                  Found {filteredToolCount} AI tool{filteredToolCount !== 1 ? 's' : ''} related to "{searchQuery}"
                </div>
              )}
            </div>

            {/* Scrollable category bar with left/right buttons */}
            <div className="relative w-1/2 mb-10 mt-1">
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 text-blue-400 hover:text-blue-600 bg-[#121212] rounded-full"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="overflow-x-auto no-scrollbar ml-8 mr-8" ref={scrollRef}>
                <div className="flex gap-2 py-1 min-w-[300px] w-fit">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`px-3 py-1 text-xs rounded-md whitespace-nowrap transition-all shrink-0 ${
                      activeCategory === 'all'
                        ? 'text-white bg-blue-600'
                        : 'text-blue-500 hover:bg-blue-500/10'
                    }`}
                  >
                    See all
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`px-3 py-1 text-xs rounded-md whitespace-nowrap transition-all shrink-0 ${
                        activeCategory === category.id
                          ? 'text-white bg-blue-600'
                          : 'text-blue-500 hover:bg-blue-500/10'
                      }`}
                    >
                      {category.title}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 text-blue-400 hover:text-blue-600 bg-[#121212] rounded-full"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {filteredToolCount === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-4">No AI tools found</h2>
              <p className="text-gray-400 mb-8">Try changing your search criteria or browse all categories.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-20 max-w-6xl mx-auto px-4">
              {categories.map(category => {
                const categoryTools = toolsByCategory[category.id] || [];
                if (categoryTools.length === 0) return null;

                return (
                  <section key={category.id} id={category.id} className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <h2 className="text-lg font-semibold text-white">{category.title}</h2>
                    </div>
                    <p className="text-sm text-gray-400 opacity-80">{category.description}</p>

                    <div className="flex flex-wrap gap-4 justify-start">
                      {categoryTools.map((tool) => (
                        <ToolCard 
                          key={`${category.id}-${tool.name}`} 
                          tool={tool} 
                          onToolClick={handleToolClick}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Tool Sidebar */}
      <ToolSidebar
        tool={selectedTool}
        isOpen={showToolSidebar}
        onClose={handleCloseSidebar}
      />
    </div>
  );
}

function HomePage() {
  return <App />;
}

export default function AppWithRoutes() {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  const isNewsRoute = location.pathname.startsWith('/news');
  const isLearningRoute = location.pathname.startsWith('/learning') || location.pathname.startsWith('/classroom');
  const isPromptRoute = location.pathname.startsWith('/prompts');
  const isHomePage = location.pathname === '/';

  const showSidebar = true; // Always show sidebar

  const handleLoginClick = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleSignupClick = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleUpgradeClick = () => {
    setShowPricingModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 overflow-x-hidden">
      <NavBar 
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onUpgradeClick={handleUpgradeClick}
      />
      
      <div className="flex">
        {showSidebar && <SideBar />}
        <SideBar onUpgradeClick={handleUpgradeClick} onLoginClick={handleLoginClick} />

        <div className="flex-1 lg:ml-[280px] pt-16 min-w-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:videoId" element={<ArticlePage />} />
            <Route path="/learning" element={<LearningSpacePage />} />
            <Route path="/classroom/:id" element={<ClassroomDetailPage />} />
            <Route path="/classroom/:classroomId/module/:moduleId" element={<ModuleDetailPage />} />
            <Route path="/prompts" element={<PromptsPage />} />
            <Route path="/prompts/:sessionId" element={<PromptChatPage />} />
          </Routes>
        </div>
      </div>
      
      {isHomePage && (
        <div className="w-full lg:ml-[140px] overflow-x-hidden">
          <Footer />
        </div>
      )}
      
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
    </div>
  );
}