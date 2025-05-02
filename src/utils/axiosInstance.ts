import axios, { 
    AxiosInstance, 
    AxiosResponse, 
    AxiosError, 
    InternalAxiosRequestConfig,
    AxiosRequestConfig 
  } from 'axios';
  
  interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
  }
  
  // Konfigurasi dasar untuk axios
  const API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';
  const REFRESH_TOKEN_URL = `${API_URL}/auth/refresh-token`;
  
  const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Fungsi untuk mengambil token dari local storage
  const getAccessToken = (): string => {
    return localStorage.getItem('accessToken') || '';
  };
  
  // Fungsi untuk mengambil refresh token dari local storage
  const getRefreshToken = (): string => {
    return localStorage.getItem('refreshToken') || '';
  };
  
  // Fungsi untuk menyimpan token baru ke local storage
  const saveTokens = (accessToken: string, refreshToken?: string): void => {
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  };
  
  // Fungsi untuk refresh token
  const refreshAuthToken = async (): Promise<string> => {
    try {
      const refreshToken = getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await axios.post<{accessToken: string; refreshToken: string}>(
        REFRESH_TOKEN_URL,
        { refreshToken },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      // Simpan token baru
      saveTokens(accessToken, newRefreshToken);
      
      return accessToken;
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      throw new Error('Failed to refresh token');
    }
  };
  
  // Konfigurasi interceptor untuk request
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
  
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      if (!error.config) {
        return Promise.reject(error);
      }
  
      const originalRequest = error.config as CustomAxiosRequestConfig;
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        
        try {
          const newAccessToken = await refreshAuthToken();
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );
  
  // Fungsi helper untuk GET 
  export const fetchGet = async <T = any>(
    url: string,
    params?: object,
    additionalConfig?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const config: AxiosRequestConfig = {
        ...additionalConfig,
        params,
      };
      
      const response = await api.get<T>(url, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };
  
  // Fungsi helper untuk POST request
  export const fetchPost = async <T = any>(
    url: string,
    data?: any,
    additionalConfig?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await api.post<T>(url, data, additionalConfig);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };
  
  // Fungsi helper untuk PUT request
  export const fetchPut = async <T = any>(
    url: string,
    data?: any,
    additionalConfig?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await api.put<T>(url, data, additionalConfig);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };
  
  // Fungsi helper untuk DELETE request
  export const fetchDelete = async <T = any>(
    url: string,
    additionalConfig?: AxiosRequestConfig
  ): Promise<T> => {
    try {
      const response = await api.delete<T>(url, additionalConfig);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };
  
  // Fungsi untuk menangani error api secara konsisten
  const handleApiError = (error: unknown): void => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      // Log specific error details
      console.error('API Error:', {
        status: axiosError.response?.status,
        url: axiosError.config?.url,
        message: axiosError.response?.data || axiosError.message,
      });
      
      // Handle specific status codes if needed
      if (axiosError.response?.status === 404) {
        console.error('Resource not found');
      } else if (axiosError.response?.status === 500) {
        console.error('Server error');
      }
    } else {
      console.error('Unknown error:', error);
    }
  };
  
  export default {
    fetchGet,
    fetchPost,
    fetchPut,
    fetchDelete,
  };