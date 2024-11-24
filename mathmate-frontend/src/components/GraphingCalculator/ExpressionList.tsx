import React from 'react';
import { Plus } from 'lucide-react';

interface ExpressionListProps {
  expressions: string[];
  onExpressionChange: (index: number, expression: string) => void;
  onAddExpression: () => void;
}

const ExpressionList: React.FC<ExpressionListProps> = ({
  expressions,
  onExpressionChange,
  onAddExpression,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Expressions</h2>
        <button
          onClick={onAddExpression}
          className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-2">
        {expressions.map((expr, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={expr}
              onChange={(e) => onExpressionChange(index, e.target.value)}
              placeholder="Enter expression..."
              className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpressionList;