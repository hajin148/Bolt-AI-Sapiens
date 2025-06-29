import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="py-12 w-full overflow-x-hidden"
      style={{ backgroundColor: '#181818', borderTop: '1px solid #374151' }}
    >
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
          {/* 왼쪽: 로고 + 문구 */}
          <div className="mb-6 md:mb-0 w-full md:w-auto">
            <div className="flex items-center gap-3 justify-start mb-2 pl-2">
              <img
                src="https://cdn.jsdelivr.net/gh/hajin148/Bolt-AI-Sapiens@5492ed01ad294aebffa564b566ca04d1d36a7cd1/public/logo.png"
                alt="AI Sapiens Logo"
                className="h-8 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <span className="text-white font-semibold text-lg">AI SAPIENCE</span>
            </div>
            <p className="text-gray-400 text-sm text-left pl-2">
              Enhance your productivity with AI tools.
            </p>
          </div>

          {/* 오른쪽: 카피라이트 */}
          <div className="flex flex-col items-start md:items-end w-full md:w-auto pr-2">
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
