import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative py-16 w-full overflow-x-hidden bg-gradient-to-t from-[#0A0A0A] via-[#121212] to-[#181818] border-t border-gray-800/50">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
          {/* Left: Logo + Description */}
          <div className="mb-8 md:mb-0 w-full md:w-auto">
            <div className="flex items-center gap-3 justify-start mb-4">
              <img 
                src="https://cdn.jsdelivr.net/gh/hajin148/Bolt-AI-Sapiens@5492ed01ad294aebffa564b566ca04d1d36a7cd1/public/logo.png" 
                alt="AI Sapiens Logo" 
                className="h-10 w-auto filter brightness-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="text-xl font-bold text-white tracking-wide">
                AI Sapiens
              </div>
            </div>
            <p className="text-gray-400 text-base leading-relaxed max-w-md">
              Enhance your productivity with AI tools.
              <br />
              <span className="text-gray-500 text-sm">Discover, explore, and master the future of artificial intelligence.</span>
            </p>
            
            {/* Social links or additional info */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live & Updated Daily</span>
              </div>
            </div>
          </div>

          {/* Right: Copyright and additional info */}
          <div className="flex flex-col items-start md:items-end w-full md:w-auto space-y-3">
            <div className="text-right">
              <p className="text-white font-medium text-base mb-1">
                © {currentYear} AI Sapiens
              </p>
              <p className="text-gray-400 text-sm">
                All rights reserved.
              </p>
            </div>
            
            {/* Additional footer links */}
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors duration-200">
                Contact
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom divider with subtle glow */}
        <div className="mt-12 pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
            <div className="mb-2 md:mb-0">
              Built with ❤️ for the AI community
            </div>
            <div className="flex items-center gap-4">
              <span>Version 2.0</span>
              <span>•</span>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;