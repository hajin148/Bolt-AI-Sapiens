import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 w-full overflow-x-hidden" style={{ backgroundColor: '#181818', borderTop: '1px solid #374151' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
          <div className="mb-6 md:mb-0 text-left w-full md:w-auto">
            <div className="flex items-center gap-3 justify-start mb-2">
              <img 
                src="https://cdn.jsdelivr.net/gh/hajin148/Bolt-AI-Sapiens@5492ed01ad294aebffa564b566ca04d1d36a7cd1/public/logo.png" 
                alt="AI Sapiens Logo" 
                className="h-8 w-auto"
                onError={(e) => {
                  // Fallback to gradient logo if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            </div>
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
          
          <div className="flex flex-col items-start md:items-end w-full md:w-auto">
            <p className="text-gray-400 text-sm">
              © {currentYear} AI Sapiens. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;