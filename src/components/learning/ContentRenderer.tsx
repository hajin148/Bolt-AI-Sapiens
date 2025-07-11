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
          <div key={index} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-semibold text-blue-400 uppercase tracking-wide">Content</span>
            </div>
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                {item.value}
              </div>
            </div>
          </div>
        );

      case 'code':
        return (
          <div key={index} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-5 w-5 text-green-400" />
              <span className="text-sm font-semibold text-green-400 uppercase tracking-wide">
                Code Example {item.language && `(${item.language})`}
              </span>
            </div>
            <Card className="bg-gray-900 border-gray-700 overflow-hidden">
              <CardContent className="p-6">
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
          <div key={index} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <CheckSquare className="h-5 w-5 text-purple-400" />
              <span className="text-sm font-semibold text-purple-400 uppercase tracking-wide">Practice Exercise</span>
            </div>
            <Card className="bg-purple-600/10 border-purple-500/30 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckSquare className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-purple-300 font-semibold mb-3">Practice Exercise</h4>
                    <div className="text-purple-200 whitespace-pre-wrap leading-relaxed">
                      {item.value}
                    </div>
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
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Content not yet available</h3>
        <p className="text-gray-400">Detailed content will be available in AI-generated modules.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {content.map((item, index) => renderContentItem(item, index))}
    </div>
  );
};

export default ContentRenderer;