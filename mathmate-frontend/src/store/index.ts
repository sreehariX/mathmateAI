import { create } from 'zustand';
import { Message, Graph, Theme } from '../types';
import { IPLimiterService } from '../services/ipLimiter';

interface AppState {
  messages: Message[];
  graphs: Graph[];
  theme: Theme;
  freeRequestsLeft: number;
  nextAllowedTime: number | null;
  initializeFreeRequests: () => void;
  setFreeRequestsLeft: (count: number) => void;
  addMessage: (message: Message) => void;
  addGraph: (graph: Graph) => void;
  toggleTheme: () => void;
}

export const useStore = create<AppState>((set) => ({
  messages: [],
  graphs: [],
  theme: {
    isDark: false,
    colors: {
      primary: '#3B82F6',
      secondary: '#6366F1',
      background: '#FFFFFF',
      text: '#1F2937',
    },
  },
  freeRequestsLeft: 3,
  nextAllowedTime: null,

  initializeFreeRequests: () => {
    const limit = IPLimiterService.getLimit();
    if (limit) {
      set({ 
        freeRequestsLeft: limit.count,
        nextAllowedTime: limit.nextAllowedTime 
      });
    } else {
      const newLimit = IPLimiterService.initializeLimit();
      set({ 
        freeRequestsLeft: newLimit.count,
        nextAllowedTime: null 
      });
    }
  },

  setFreeRequestsLeft: (count) => {
    set({ freeRequestsLeft: count });
    IPLimiterService.decrementCount();
  },
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  addGraph: (graph) =>
    set((state) => ({ graphs: [...state.graphs, graph] })),
  toggleTheme: () =>
    set((state) => ({
      theme: {
        ...state.theme,
        isDark: !state.theme.isDark,
        colors: state.theme.isDark
          ? {
              primary: '#3B82F6',
              secondary: '#6366F1',
              background: '#FFFFFF',
              text: '#1F2937',
            }
          : {
              primary: '#60A5FA',
              secondary: '#818CF8',
              background: '#111827',
              text: '#F9FAFB',
            },
      },
    })),
}));