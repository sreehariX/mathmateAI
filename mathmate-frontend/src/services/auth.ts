import { GoogleCredentialResponse } from '@react-oauth/google';
import { User } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL;

export const authService = {
  async googleLogin(response: GoogleCredentialResponse): Promise<User> {
    const res = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_token: response.credential }),
    });

    if (!res.ok) {
      throw new Error('Authentication failed');
    }

    const data = await res.json();
    return data.user;
  }
};