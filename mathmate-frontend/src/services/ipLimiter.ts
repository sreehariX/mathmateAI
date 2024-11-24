import { v4 as uuidv4 } from 'uuid';

interface RequestLimit {
  id: string;
  count: number;
  timestamp: number;
  nextAllowedTime: number;
}

export class IPLimiterService {
  private static readonly STORAGE_KEY = 'request_limit';
  private static readonly LIMIT_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly FREE_REQUESTS = 3;

  static getLimit(): RequestLimit | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return null;
    
    const limit = JSON.parse(stored);
    const now = Date.now();
    
    if (now >= limit.nextAllowedTime) {
      this.resetLimit();
      return null;
    }
    
    return limit;
  }

  static initializeLimit(): RequestLimit {
    const limit = {
      id: uuidv4(),
      count: this.FREE_REQUESTS,
      timestamp: Date.now(),
      nextAllowedTime: Date.now() + this.LIMIT_DURATION
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limit));
    return limit;
  }

  static resetLimit(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static decrementCount(): void {
    const limit = this.getLimit();
    if (limit && limit.count > 0) {
      limit.count--;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limit));
    }
  }

  static formatNextAllowedTime(nextAllowedTime: number): string {
    return new Date(nextAllowedTime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }
}