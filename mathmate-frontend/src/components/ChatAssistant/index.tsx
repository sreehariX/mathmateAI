import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import { Message } from '../../types';
import { chatService } from '../../services/api';
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from '../../store/auth';
import { AuthGuard } from '../auth/AuthGuard';

const ChatAssistant: React.FC<{ onProtectedClick: () => void }> = ({ onProtectedClick }) => {
  const { messages, addMessage, freeRequestsLeft, setFreeRequestsLeft } = useStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, imageUrl?: string) => {
    if (!isAuthenticated && freeRequestsLeft === 0) {
      onProtectedClick();
      return;
    }
    
    if (!isAuthenticated && freeRequestsLeft > 0) {
      setFreeRequestsLeft(freeRequestsLeft - 1);
    }
    
    const userMessage: Message = {
      id: uuidv4(),
      content,
      type: 'user',
      timestamp: Date.now(),
      imageUrl,
    };

    addMessage(userMessage);
    setIsLoading(true);
    setLoadingStartTime(Date.now());

    try {
      let response;

      if (imageUrl) {
        const base64Response = await fetch(imageUrl);
        const blob = await base64Response.blob();
        response = await chatService.solveEquationWithImage(blob);
      } else {
        response = await chatService.solveTextEquation(content);
      }

      const formatResponse = (response: any) => {
        const steps = response.solution.steps;
        return steps
          .replace(/###/g, '') // Remove ### markers
          .replace(/\n\s*\n/g, '\n\n') // Remove extra blank lines
          .replace(/\$\$(.*?)\$\$/g, '\n```math\n$1\n```\n') // Convert $$ to math blocks
          .replace(/\$(.*?)\$/g, '$$$1$$'); // Keep inline math with single $
      };

      const assistantMessage: Message = {
        id: uuidv4(),
        content: formatResponse(response),
        type: 'assistant',
        timestamp: Date.now(),
        latex: imageUrl ? response.equation?.latex : undefined,
      };

      addMessage(assistantMessage);
    } catch (error) {
      const errorMessage: Message = {
        id: uuidv4(),
        content: 'Sorry, there was an error processing your request. Please try again.',
        type: 'assistant',
        timestamp: Date.now(),
        error: true,
      };
      addMessage(errorMessage);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setLoadingStartTime(undefined);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto pb-24">
        <MessageList 
          messages={messages} 
          isLoading={isLoading}
          loadingStartTime={loadingStartTime}
        />
        <div ref={messagesEndRef} />
      </div>
      <ChatInput 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
        onProtectedClick={onProtectedClick}
      />
    </div>
  );
};

export default ChatAssistant;