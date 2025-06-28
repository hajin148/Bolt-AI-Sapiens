import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { tools } from '../data/tools';
import { 
  PlusCircle,
  Wallet,
  Menu,
  X,
  ExternalLink,
  BookOpen,
  Loader2
} from 'lucide-react';
import { Avatar } from './ui/avatar';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface SideBarProps {
  onUpgradeClick: () => void;
}

interface LearningModule {
  id: string;
  title: string;
  classroom_id: string;
  classroom_name: string;
  step_number: number;
}

interface PromptSession {
  id: string;
  title: string;
  updated_at: string;
}

const SideBar: React.FC<SideBarProps> = ({ onUpgradeClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile, userTokens } = useAuth();
  const [learningModules, setLearningModules] = useState<LearningModule[]>([]);
  const [promptSessions, setPromptSessions] = useState<PromptSession[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [showAllFavorites, setShowAllFavorites] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 화면 크기 감지
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (!mobile) {
        setIsExpanded(false); // 데스크톱에서는 항상 펼쳐진 상태
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // 사용자의 Learning Space 모듈들 가져오기
  useEffect(() => {
    const fetchLearningModules = async () => {
      if (!currentUser) {
        setLearningModules([]);
        return;
      }

      setLoadingModules(true);
      try {
        const { data, error } = await supabase
          .from('modules')
          .select(`
            id,
            title,
            classroom_id,
            step_number,
            classrooms!inner(
              id,
              name,
              user_id
            )
          `)
          .eq('classrooms.user_id', currentUser.id)
          .order('created_at', { foreignTable: 'classrooms', ascending: false })
          .order('step_number', { ascending: true })
          .limit(5);

        if (error) throw error;

        const modules: LearningModule[] = (data || []).map(item => ({
          id: item.id,
          title: item.title,
          classroom_id: item.classroom_id,
          classroom_name: item.classrooms.name,
          step_number: item.step_number
        }));

        setLearningModules(modules);
      } catch (error) {
        console.error('Error fetching learning modules:', error);
        setLearningModules([]);
      } finally {
        setLoadingModules(false);
      }
    };

    fetchLearningModules();
  }, [currentUser]);

  // 사용자의 Prompt Sessions 가져오기
  useEffect(() => {
    const fetchPromptSessions = async () => {
      if (!currentUser) {
        setPromptSessions([]);
        return;
      }

      setLoadingPrompts(true);
      try {
        const { data, error } = await supabase
          .from('prompt_sessions')
          .select('id, title, updated_at')
          .eq('user_id', currentUser.id)
          .order('updated_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        setPromptSessions(data || []);
      } catch (error) {
        console.error('Error fetching prompt sessions:', error);
        setPromptSessions([]);
      } finally {
        setLoadingPrompts(false);
      }
    };

    fetchPromptSessions();
  }, [currentUser]);

  const getFavoriteTools = () => {
    if (!currentUser || !userProfile?.favorites) return [];
    
    return userProfile.favorites
      .map(favoriteName => {
        const tool = tools.find(t => t.name.toLowerCase() === favoriteName.toLowerCase());
        return tool ? { name: tool.name } : null;
      })
      .filter(Boolean);
  };

  const allFavoriteItems = getFavoriteTools();
  const displayedFavoriteItems = showAllFavorites ? allFavoriteItems : allFavoriteItems.slice(0, 5);
  const hasMoreFavorites = allFavoriteItems.length > 5;

  const learnSpaceItems = learningModules.map(module => ({ name: module.title }));

  const getToolIcon = (toolName: string) => {
    const tool = tools.find(t => t.name.toLowerCase() === toolName.toLowerCase());
    return tool?.iconUrl || null;
  };

  const handleNewPrompt = () => {
    navigate('/prompts');
    if (isMobile) setIsExpanded(false);
  };

  const handleToolClick = (toolName: string) => {
    const tool = tools.find(t => t.name.toLowerCase() === toolName.toLowerCase());
    if (tool) {
      window.open(tool.url, '_blank', 'noopener,noreferrer');
    }
    if (isMobile) setIsExpanded(false);
  };

  const handleModuleClick = (moduleName: string) => {
    const module = learningModules.find(m => m.title === moduleName);
    if (module) {
      navigate(`/classroom/${module.classroom_id}`);
    }
    if (isMobile) setIsExpanded(false);
  };

  const handlePromptClick = (sessionId: string) => {
    navigate(`/prompts/${sessionId}`);
    if (isMobile) setIsExpanded(false);
  };

  // Reusable menu item component
  const MenuItem = ({ name, section, sessionId }: { name: string; section: 'recent' | 'favorite' | 'learn' | 'prompt'; sessionId?: string }) => {
    const iconUrl = section === 'favorite' ? getToolIcon(name) : null;
    
    return (
      <div 
        className="flex items-center gap-2 px-[18px] py-1 w-full cursor-pointer hover:bg-[#4c4c4d] transition-colors"
        onClick={() => {
          if (section === 'favorite') {
            handleToolClick(name);
          } else if (section === 'learn') {
            handleModuleClick(name);
          } else if (section === 'prompt' && sessionId) {
            handlePromptClick(sessionId);
          }
        }}
      >
        {/* Only show icons for favorite section */}
        {section === 'favorite' && (
          <>
            {iconUrl ? (
              <img 
                src={iconUrl} 
                alt={`${name} icon`}
                className="w-6 h-6 rounded object-cover flex-shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <Avatar className={`w-6 h-6 bg-[#565656] rounded flex-shrink-0 ${iconUrl ? 'hidden' : 'flex'}`} />
          </>
        )}
        
        <span 
          className={`font-['Pretendard-Regular',Helvetica] font-normal text-[#d5d5d5] text-[13px] tracking-[-0.20px] leading-[22px] ${
            (section === 'learn' || section === 'prompt') ? 'truncate' : 'whitespace-nowrap'
          } flex-1 min-w-0`}
          title={name} // Show full text on hover
        >
          {name}
        </span>
      </div>
    );
  };

  // 모바일에서 햄버거 메뉴만 표시
  if (isMobile) {
    return (
      <>
        {/* 햄버거 메뉴 버튼 - NavBar 아래에 위치 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="fixed top-20 left-4 z-40 w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-gray-800 transition-colors lg:hidden shadow-lg"
        >
          {isExpanded ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* 오버레이 */}
        {isExpanded && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            style={{ top: '72px' }} // NavBar 높이만큼 아래에서 시작
            onClick={() => setIsExpanded(false)}
          />
        )}

        {/* 모바일 사이드바 - NavBar 아래에 위치 */}
        <div className={`fixed left-0 w-[280px] bg-[#3c3c3d] z-30 transform transition-transform duration-300 lg:hidden shadow-2xl ${
          isExpanded ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ 
          top: '72px', // NavBar 높이만큼 아래에서 시작
          height: 'calc(100vh - 72px)' // NavBar 높이를 제외한 전체 높이
        }}>
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col w-full items-start pt-[20px]">
                {/* New Prompt Button */}
                <Button
                  variant="ghost"
                  className="relative self-stretch w-full h-11 justify-start px-[18px] text-white hover:bg-[#4c4c4d]"
                  onClick={handleNewPrompt}
                >
                  <PlusCircle className="w-5 h-5 mr-[23px] flex-shrink-0" />
                  <span className="font-['Pretendard-Regular',Helvetica] font-normal text-sm tracking-[-0.21px] leading-[22px]">
                    New Prompt
                  </span>
                </Button>

                {/* Favorites Section */}
                <div className="relative self-stretch w-full border-b border-[#575757] pb-4">
                  <h3 className="px-[18px] pt-4 font-['Pretendard-Medium',Helvetica] font-medium text-white text-sm tracking-[-0.21px] leading-[22px]">
                    Favorites
                  </h3>
                  <div className="flex flex-col w-full items-start mt-3">
                    {displayedFavoriteItems.length > 0 ? (
                      <>
                        {displayedFavoriteItems.map((item, index) => (
                          <MenuItem key={`favorite-${index}`} name={item.name} section="favorite" />
                        ))}
                        {hasMoreFavorites && (
                          <button
                            onClick={() => setShowAllFavorites(!showAllFavorites)}
                            className="px-[18px] py-2 w-full text-left text-sm text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {showAllFavorites ? 'Show less' : `See more (${allFavoriteItems.length - 5})`}
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="px-[18px] py-2">
                        <span className="font-['Pretendard-Regular',Helvetica] font-normal text-[#999999] text-[13px] tracking-[-0.20px] leading-[22px]">
                          No favorites yet
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* LearnSpace Section */}
                <div className="relative self-stretch w-full border-b border-[#575757] pb-4">
                  <h3 className="px-[18px] pt-[15px] font-['Pretendard-Medium',Helvetica] font-medium text-white text-sm tracking-[-0.21px] leading-[22px]">
                    LearnSpace
                  </h3>
                  <div className="flex flex-col w-full items-start mt-3">
                    {loadingModules ? (
                      <div className="px-[18px] py-2 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-[#999999] flex-shrink-0" />
                        <span className="font-['Pretendard-Regular',Helvetica] font-normal text-[#999999] text-[13px] tracking-[-0.20px] leading-[22px]">
                          Loading...
                        </span>
                      </div>
                    ) : learnSpaceItems.length > 0 ? (
                      learnSpaceItems.map((item, index) => (
                        <MenuItem key={`learn-${index}`} name={item.name} section="learn" />
                      ))
                    ) : (
                      <div className="px-[18px] py-2">
                        <span className="font-['Pretendard-Regular',Helvetica] font-normal text-[#999999] text-[13px] tracking-[-0.20px] leading-[22px]">
                          No modules yet
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Prompt History Section */}
                <div className="relative self-stretch w-full pb-4">
                  <h3 className="px-[18px] pt-[15px] font-['Pretendard-Medium',Helvetica] font-medium text-white text-sm tracking-[-0.21px] leading-[22px]">
                    Prompt History
                  </h3>
                  <div className="flex flex-col w-full items-start mt-3">
                    {loadingPrompts ? (
                      <div className="px-[18px] py-2 flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-[#999999] flex-shrink-0" />
                        <span className="font-['Pretendard-Regular',Helvetica] font-normal text-[#999999] text-[13px] tracking-[-0.20px] leading-[22px]">
                          Loading...
                        </span>
                      </div>
                    ) : promptSessions.length > 0 ? (
                      promptSessions.map((session) => (
                        <MenuItem 
                          key={`prompt-${session.id}`} 
                          name={session.title} 
                          section="prompt" 
                          sessionId={session.id}
                        />
                      ))
                    ) : (
                      <div className="px-[18px] py-2">
                        <span className="font-['Pretendard-Regular',Helvetica] font-normal text-[#999999] text-[13px] tracking-[-0.20px] leading-[22px]">
                          {currentUser ? 'No conversations yet' : 'Login to see history'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Points Display - Fixed at bottom */}
            <div className="p-2.5 pb-[46px]">
              <div className="w-full h-[38px] bg-[#222222] rounded-[40px] overflow-hidden flex items-center justify-between px-3">
                <Wallet className="w-5 h-5 text-white flex-shrink-0" />
                <span className="font-['Pretendard-Medium',Helvetica] font-medium text-white text-sm text-right tracking-[-0.21px] leading-[22px] truncate">
                  {userTokens.toLocaleString()}pt
                </span>
              </div>
            </div>

            {/* Copyright - Fixed at bottom */}
            <div className="px-[18px] pb-[17px] font-['Pretendard-Regular',Helvetica] font-normal text-[#999999] text-[10px] tracking-[-0.15px] leading-[normal]">
              © 2025 AI Sapiens. All rights reserved.
            </div>
          </div>
        </div>
      </>
    );
  }

  // 데스크톱 사이드바 (항상 고정, 더 넓은 너비)
  return (
    <div className="fixed top-16 left-0 w-[280px] h-[calc(100vh-4rem)] bg-[#3c3c3d] z-30 hidden lg:block">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col w-full items-start pt-[20px]">
            {/* New Prompt Button */}
            <Button
              variant="ghost"
              className="relative self-stretch w-full h-11 justify-start px-[18px] text-white hover:bg-[#4c4c4d]"
              onClick={handleNewPrompt}
            >
              <PlusCircle className="w-5 h-5 mr-[23px] flex-shrink-0" />
              <span className="font-['Pretendard-Regular',Helvetica] font-normal text-sm tracking-[-0.21px] leading-[22px]">
                New Prompt
              </span>
            </Button>

            {/* Favorites Section */}
            <div className="relative self-stretch w-full border-b border-[#575757] pb-4">
              <h3 className="px-[18px] pt-4 font-['Pretendard-Medium',Helvetica] font-medium text-white text-sm tracking-[-0.21px] leading-[22px]">
                Favorites
              </h3>
              <div className="flex flex-col w-full items-start mt-3">
                {displayedFavoriteItems.length > 0 ? (
                  <>
                    {displayedFavoriteItems.map((item, index) => (
                      <MenuItem key={`favorite-${index}`} name={item.name} section="favorite" />
                    ))}
                    {hasMoreFavorites && (
                      <button
                        onClick={() => setShowAllFavorites(!showAllFavorites)}
                        className="px-[18px] py-2 w-full text-left text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {showAllFavorites ? 'Show less' : `See more (${allFavoriteItems.length - 5})`}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="px-[18px] py-2">
                    <span className="font-['Pretendard-Regular',Helvetica] font-normal text-[#999999] text-[13px] tracking-[-0.20px] leading-[22px]">
                      {currentUser ? 'No favorites yet' : 'Login to see favorites'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* LearnSpace Section */}
            <div className="relative self-stretch w-full border-b border-[#575757] pb-4">
              <h3 className="px-[18px] pt-[15px] font-['Pretendard-Medium',Helvetica] font-medium text-white text-sm tracking-[-0.21px] leading-[22px]">
                LearnSpace
              </h3>
              <div className="flex flex-col w-full items-start mt-3">
                {loadingModules ? (
                  <div className="px-[18px] py-2 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-[#999999] flex-shrink-0" />
                    <span className="font-['Pretendard-Regular',Helvetica] font-normal text-[#999999] text-[13px] tracking-[-0.20px] leading-[22px]">
                      Loading...
                    </span>
                  </div>
                ) : learnSpaceItems.length > 0 ? (
                  learnSpaceItems.map((item, index) => (
                    <MenuItem key={`learn-${index}`} name={item.name} section="learn" />
                  ))
                ) : (
                  <div className="px-[18px] py-2">
                    <span className="font-['Pretendard-Regular',Helvetica] font-normal text-[#999999] text-[13px] tracking-[-0.20px] leading-[22px]">
                      {currentUser ? 'No modules yet' : 'Login to see modules'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Prompt History Section */}
            <div className="relative self-stretch w-full pb-4">
              <h3 className="px-[18px] pt-[15px] font-['Pretendard-Medium',Helvetica] font-medium text-white text-sm tracking-[-0.21px] leading-[22px]">
                Prompt History
              </h3>
              <div className="flex flex-col w-full items-start mt-3">
                {loadingPrompts ? (
                  <div className="px-[18px] py-2 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-[#999999] flex-shrink-0" />
                    <span className="font-['Pretendard-Regular',Helvetica] font-normal text-[#999999] text-[13px] tracking-[-0.20px] leading-[22px]">
                      Loading...
                    </span>
                  </div>
                ) : promptSessions.length > 0 ? (
                  promptSessions.map((session) => (
                    <MenuItem 
                      key={`prompt-${session.id}`} 
                      name={session.title} 
                      section="prompt" 
                      sessionId={session.id}
                    />
                  ))
                ) : (
                  <div className="px-[18px] py-2">
                    <span className="font-['Pretendard-Regular',Helvetica] font-normal text-[#999999] text-[13px] tracking-[-0.20px] leading-[22px]">
                      {currentUser ? 'No conversations yet' : 'Login to see history'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Points Display - Fixed at bottom */}
        <div className="p-2.5 pb-[46px]">
          <div 
            className="w-full h-[38px] bg-[#222222] rounded-[40px] overflow-hidden flex items-center justify-between px-3 cursor-pointer hover:bg-[#333333] transition-colors"
            onClick={onUpgradeClick}
          >
            <Wallet className="w-5 h-5 text-white flex-shrink-0" />
            <span className="font-['Pretendard-Medium',Helvetica] font-medium text-white text-sm text-right tracking-[-0.21px] leading-[22px] truncate">
              {userTokens.toLocaleString()}pt
            </span>
          </div>
        </div>

        {/* Copyright - Fixed at bottom */}
        <div className="px-[18px] pb-[17px] font-['Pretendard-Regular',Helvetica] font-normal text-[#999999] text-[10px] tracking-[-0.15px] leading-[normal]">
          © 2025 AI Sapiens. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default SideBar;