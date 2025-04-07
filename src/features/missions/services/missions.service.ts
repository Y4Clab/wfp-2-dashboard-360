import axios from 'axios';
import { Mission, MissionFilters } from '../types/mission.types';

const baseUrl = import.meta.env.VITE_APP_API_URL;



const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};

const handleApiError = (error: any): never => {
  console.error('API Error:', error);
  const message = error.response?.data?.message || error.message || 'An error occurred';
  throw new Error(message);
};
//vendor 
export const missionsService = {
  getVendorMissions: async (filters?: MissionFilters): Promise<Mission[]> => {
    try {
      const response = await axios.get(`${baseUrl}/api/vendor/missions`, {
        params: {
          status: filters?.status !== 'all' ? filters?.status : undefined
        },
        headers: getAuthHeaders(),
        transformResponse: [(data) => {
          try {
            if (typeof data === 'string' && data.trim().startsWith('<!DOCTYPE html>')) {
              throw new Error('Received HTML instead of JSON. Check the API URL configuration.');
            }
            return JSON.parse(data);
          } catch (error) {
            console.error('Response parsing error:', error);
            console.error('Raw response:', data);
            throw new Error('Invalid response format from server');
          }
        }],
        maxRedirects: 0
      });

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format from server');
      }
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Add other mission-related API calls here
  getMissionById: async (id: string): Promise<Mission> => {
    try {
      const response = await axios.get(`${baseUrl}/api/vendor/missions/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
}; 