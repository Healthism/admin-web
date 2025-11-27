const runtimeMode = (typeof import.meta !== 'undefined' && (import.meta as any).env?.MODE) ||
  (typeof process !== 'undefined' && process.env?.NODE_ENV) || 'development';
const isProduction = runtimeMode === 'production';

const envViteBase = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) || '';
const envViteReactBase = (typeof import.meta !== 'undefined' && (import.meta as any).env?.REACT_APP_API_BASE_URL) || '';
const envProcessReactBase = (typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE_URL) || '';

const envBase = envViteBase || envViteReactBase || envProcessReactBase || '';

const useDirectBackend = isProduction || ((typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_USE_DIRECT === 'true') || (typeof process !== 'undefined' && process.env?.VITE_USE_DIRECT === 'true'));
const API_BASE_URL = useDirectBackend ? (envBase || (isProduction ? 'https://test.healthizm.in' : '')) : '';

const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'admin/login',

  },
  USERS:{
    GET_USERS: 'admin/users',
  }
};
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const requestId = Math.random().toString(36).substring(2, 6);

  const cleanEndpoint = endpoint.replace(/^\/+/, '');

  const url = API_BASE_URL ? `${cleanBaseUrl}/${cleanEndpoint}` : `/api/${cleanEndpoint}`;
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && (options.method === 'POST' || options.method === 'PUT')) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.body) {
    try {
      const bodyObj = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
    } catch (e) {
      console.error(`🌐 [${requestId}] Request Body (raw):`, options.body);
    }
  }

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    mode: 'cors',
    ...options,
  };

  try {
    const response = await fetch(url, config);

    const responseText = await response.text();
    const responseHeaders = Object.fromEntries(response.headers.entries());

    let responseData;
    try {
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch (e) {
      console.error(`🌐 [${requestId}] Response Body (raw):`, responseText);
      responseData = responseText;
    }

    if (!response.ok) {
      console.error(`🌐 [${requestId}] API Error:`, {
        status: response.status,
        statusText: response.statusText,
        url,
        response: responseData || responseText,
      });

      // Extract error message from the parsed response data
      let errorMessage = 'An error occurred';
      
      if (responseData?.error) {
        errorMessage = responseData.error;
      } else if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (responseData?.errors) {
        // Handle validation errors array
        errorMessage = Array.isArray(responseData.errors) 
          ? responseData.errors.map((e: any) => e.message || e).join(', ')
          : responseData.errors;
      } else if (response.statusText) {
        errorMessage = response.statusText;
      }

      // Create error object with the message
      const error: any = new Error(errorMessage);
      error.status = response.status;
      error.statusText = response.statusText;
      error.data = responseData;
      error.response = responseData;
      
      throw error;
    }

    return responseData;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    // For network errors or other issues
    console.error('API request failed:', error);
    const networkError: any = new Error(error.message || 'Network error occurred');
    networkError.original = error;
    throw networkError;
  }
};

export default API_ENDPOINTS;