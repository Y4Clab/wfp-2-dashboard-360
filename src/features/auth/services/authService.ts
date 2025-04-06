import axios from 'axios';
import { LoginRequest, LoginResponse, UserProfile } from '../types/auth';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.0.13:8000/';

const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/accounts/token/`,
        credentials
      );
      
      // Store the token and role
      const { access, role } = response.data;
      localStorage.setItem('token', access);
      localStorage.setItem('role', role);
      
      // Set default Authorization header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Network error occurred');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    delete axios.defaults.headers.common['Authorization'];
  },

  // Initialize auth state from localStorage
  initializeAuth: (): { token: string | null; role: string | null } => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    return { token, role };
  },

  // Fetch user profile
  getUserProfile: async (): Promise<UserProfile> => {
    try {
      const response = await axios.get<UserProfile>(
        `${API_URL}/accounts/users/me`,
        {
          headers: {
            'accept': 'application/json',
            'Authorization': axios.defaults.headers.common['Authorization']

          }
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch user profile');
      }
      throw new Error('Network error occurred while fetching profile');
    }
  }
};

export default authApi; 