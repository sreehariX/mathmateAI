export interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: number;
  latex?: string;
  imageUrl?: string;
  error?: boolean;
}

export interface ChatInputProps {
  onSendMessage: (content: string, imageUrl?: string) => void;
  isLoading: boolean;
}

export interface MessageListProps {
  messages: Message[];
}

export interface Graph {
  id: string;
  name: string;
  expressions: string[];
}

export interface Theme {
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

export interface ApiResponse {
  success: boolean;
  equation?: {
    latex?: string;
    text?: string;
    original_filename?: string;
  };
  solution: {
    steps: string;
    model: string;
  };
}