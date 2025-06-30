import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 w-full overflow-x-hidden" style={{ backgroundColor: '#181818', borderTop: '1px solid #374151' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
          <div className="mb-6 md:mb-0 text-left w-full md:w-auto">
            <img 
              src="https://cdn.jsdelivr.net/gh/hajin148/Bolt-AI-Sapiens@5492ed01ad294aebffa564b566ca04d1d36a7cd1/public/logo.png" 
              alt="AI Sapiens Logo" 
              className="h-6 w-auto mb-2"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <p className="text-gray-400 text-sm text-left">
              Enhance your productivity with AI tools.
            </p>
          </div>
          
          <div className="flex flex-col items-start md:items-end w-full md:w-auto space-y-3">
            <p className="text-gray-400 text-sm">
              © {currentYear} AI Sapiens. All rights reserved.
            </p>
            
            {/* Built with Bolt.new badge */}
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-medium rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <svg 
                className="w-4 h-4" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M13 3L4 14h7l-1 8 9-11h-7l1-8z"/>
              </svg>
              Built with Bolt.new
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;