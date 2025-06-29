import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 w-full overflow-x-hidden" style={{ backgroundColor: '#181818', borderTop: '1px solid #374151' }}>
      <div className="max-w-6xl mx-auto px-4 w-full">
        <div className="w-full">
          <div className="text-left">
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
            <p className="text-gray-400 text-sm">
              Enhance your productivity with AI tools.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              © {currentYear} AI Sapiens. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;