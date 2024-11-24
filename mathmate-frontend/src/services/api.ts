import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const chatService = {
  async solveTextEquation(prompt: string) {
    try {
      const response = await axios.post(`${API_BASE_URL}/solve-text/`, {
        prompt: prompt
      });
      return response.data;
    } catch (error) {
      console.error('Error solving text equation:', error);
      throw error;
    }
  },

  async solveEquationWithImage(image: Blob) {
    try {
      const formData = new FormData();
      formData.append('file', image);

      const response = await axios.post(`${API_BASE_URL}/solve-equation/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error solving equation with image:', error);
      throw error;
    }
  }
};