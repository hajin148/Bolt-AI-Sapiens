import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 w-full overflow-x-hidden border-t border-gray-800" style={{ backgroundColor: '#181818' }}>
      <div className="max-w-6xl mx-auto px-4 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://cdn.jsdelivr.net/gh/hajin148/Bolt-AI-Sapiens@5492ed01ad294aebffa564b566ca04d1d36a7cd1/public/logo.png" 
              alt="AI Sapiens Logo" 
              className="h-6 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <span className="text-gray-400 text-sm">
              Enhance your productivity with AI tools.
            </span>
          </div>
          
          <div className="text-gray-500 text-sm">
            © {currentYear} AI Sapiens. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;