import axios from 'axios';
import { Mission, MissionFilters } from '../types/mission.types';

const baseUrl = import.meta.env.VITE_APP_API_URL;

//get all missions


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

      // Validate mission objects
      const validMissions = response.data.filter((item: any): item is Mission => {
        return (
          item &&
          typeof item.id === 'number' &&
          typeof item.mission_id === 'string' &&
          typeof item.title === 'string' &&
          typeof item.type === 'string' &&
          typeof item.number_of_beneficiaries === 'number' &&
          typeof item.description === 'string' &&
          typeof item.dept_location === 'string' &&
          typeof item.destination_location === 'string' &&
          typeof item.start_date === 'string' &&
          typeof item.end_date === 'string' &&
          typeof item.status === 'string'
        );
      });

      if (validMissions.length < response.data.length) {
        console.warn('Some missions were filtered out due to invalid data');
      }

      return validMissions;
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