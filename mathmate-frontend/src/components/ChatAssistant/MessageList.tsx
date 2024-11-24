import React from 'react';
import { Message } from '../../types';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import LoadingIndicator from './LoadingIndicator';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  loadingStartTime?: number;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, loadingStartTime }) => {
  return (
    <div className="space-y-4 p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-4 ${
              message.type === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800'
            }`}
          >
            {message.imageUrl && (
              <img
                src={message.imageUrl}
                alt="User upload"
                className="max-w-full rounded-lg mb-2"
              />
            )}
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3">{children}</p>
                  ),
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const isMatch = match && match[1] === 'math';
                    
                    if (isMatch) {
                      return (
                        <div className="my-4 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded">
                          <code className="text-lg">{children}</code>
                        </div>
                      );
                    }
                    
                    return inline ? (
                      <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                        {children}
                      </code>
                    ) : (
                      <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded overflow-x-auto">
                        <code {...props}>{children}</code>
                      </pre>
                    );
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      ))}
      {isLoading && <LoadingIndicator startTime={loadingStartTime} />}
    </div>
  );
};

export default MessageList;