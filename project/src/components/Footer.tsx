import React from 'react';

interface FooterProps {
  language: 'ko' | 'en';
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-gray-900">
              {language === 'ko' ? '리버의 AI 툴 모음' : "River's AI Tools Collection"}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {language === 'ko' 
                ? 'AI 툴을 활용해 생산성을 높여보세요.' 
                : 'Enhance your productivity with AI tools.'}
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <p className="text-gray-600 text-sm">
              © {currentYear} {language === 'ko' ? '리버의 AI 툴 모음' : "River's AI Tools"}. 
              {language === 'ko' ? ' All rights reserved.' : ' All rights reserved.'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer