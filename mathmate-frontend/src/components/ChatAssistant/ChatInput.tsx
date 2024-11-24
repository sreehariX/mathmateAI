import React, { useState, useRef } from 'react';
import { Send, Image, Mic, X } from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import { useStore } from '../../store/index';
import { IPLimiterService } from '../../services/ipLimiter';

interface ChatInputProps {
  onSendMessage: (content: string, imageUrl?: string) => void;
  isLoading: boolean;
  onProtectedClick: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, onProtectedClick }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const freeRequestsLeft = useStore((state) => state.freeRequestsLeft);
  const nextAllowedTime = useStore((state) => state.nextAllowedTime);
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState<string>();
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    if (!isAuthenticated && freeRequestsLeft === 0) {
      onProtectedClick();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated && freeRequestsLeft === 0) {
      onProtectedClick();
      return;
    }
    if (message.trim() || imageUrl) {
      onSendMessage(message.trim(), imageUrl);
      setMessage('');
      setImageUrl(undefined);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAuthenticated && freeRequestsLeft === 0) {
      onProtectedClick();
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceInput = () => {
    if (!isAuthenticated && freeRequestsLeft === 0) {
      onProtectedClick();
      return;
    }
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessage((prev) => prev + ' ' + transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    }
  };
  return (
    <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 lg:static border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
      {!isAuthenticated && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {freeRequestsLeft > 0 ? (
            `${freeRequestsLeft} free ${freeRequestsLeft === 1 ? 'request' : 'requests'} remaining`
          ) : (
            `Free requests available after ${IPLimiterService.formatNextAllowedTime(nextAllowedTime!)}`
          )}
        </div>
      )}
      {imageUrl && (
        <div className="mb-2 relative inline-block">
          <img src={imageUrl} alt="Upload preview" className="h-20 rounded" />
          <button
            type="button"
            onClick={() => setImageUrl(undefined)}
            className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          disabled={isLoading}
        >
          <Image className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleVoiceInput}
          className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${
            isRecording ? 'text-red-500' : ''
          }`}
          disabled={isLoading}
        >
          <Mic className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={handleFocus}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-800 
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            focus:ring-blue-500 dark:focus:ring-blue-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;