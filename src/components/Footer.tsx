import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12" style={{ backgroundColor: '#181818', borderTop: '1px solid #374151' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
              <img 
                src="/logo.png" 
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
            <p className="text-gray-400 text-sm">
              Enhance your productivity with AI tools.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
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