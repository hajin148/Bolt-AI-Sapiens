import React from 'react';
import ToolCard from './ToolCard';
import { Tool, CategoryInfo } from '../types/Tool';

interface CategorySectionProps {
  category: CategoryInfo;
  tools: Tool[];
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, tools }) => {
  if (tools.length === 0) return null;

  return (
    <section id={category.id} className="py-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="mr-2">{category.icon}</span>
          {category.title}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {category.description}
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {tools.map((tool) => (
          <ToolCard key={`${category.id}-${tool.name}`} tool={tool} />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;