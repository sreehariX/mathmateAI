import { Message } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const INITIAL_MESSAGES: Message[] = [
  {
    id: uuidv4(),
    content: "👋 Hello! I'm MathMate AI, your personal math assistant. Please input images with only equations without any text otherwise you will get incorrect responses. Try these example questions:",
    type: 'assistant',
    timestamp: Date.now()
  },
  {
    id: uuidv4(),
    content: "1️⃣ Click to try: solve x^2+6x+2=0",
    type: 'assistant',
    isExample: true,
    exampleText: "solve x^2+6x+2=0",
    timestamp: Date.now()
  },
  {
    id: uuidv4(),
    content: "2️⃣ Click to try this example:",
    type: 'assistant',
    isExample: true,
    imageUrl: '/example-integral.jpg',
    timestamp: Date.now()
  }
];