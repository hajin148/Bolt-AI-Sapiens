import React from 'react';
import { ContentItem } from '../../types/Learning';
import { Card, CardContent } from '@/components/ui/card';
import { Code, BookOpen, CheckSquare } from 'lucide-react';

interface ContentRendererProps {
  content: ContentItem[];
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ content }) => {
  const renderContentItem = (item: ContentItem, index: number) => {
    switch (item.type) {
      case 'text':
        return (
          <div key={index} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">설명</span>
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {item.value}
              </p>
            </div>
          </div>
        );

      case 'code':
        return (
          <div key={index} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Code className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">
                코드 {item.language && `(${item.language})`}
              </span>
            </div>
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4">
                <pre className="text-sm text-gray-100 overflow-x-auto">
                  <code className={item.language ? `language-${item.language}` : ''}>
                    {item.value}
                  </code>
                </pre>
              </CardContent>
            </Card>
          </div>
        );

      case 'exercise':
        return (
          <div key={index} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <CheckSquare className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">연습문제</span>
            </div>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-medium text-purple-600">!</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-purple-800 font-medium mb-2">실습 과제</p>
                    <p className="text-purple-700 whitespace-pre-wrap">
                      {item.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (!content || content.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">아직 콘텐츠가 준비되지 않았습니다.</p>
        <p className="text-gray-400 text-sm mt-2">AI가 생성한 새로운 모듈에서 상세 콘텐츠를 확인할 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {content.map((item, index) => renderContentItem(item, index))}
    </div>
  );
};

export default ContentRenderer;