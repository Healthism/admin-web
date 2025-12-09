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
    PROFILE: 'admin/profile',

  },
  DASHBOARD:{
    GET_DASHBOARD_DATA: 'admin/dashboard',
  },
  USERS:{
    GET_USERS: 'admin/users',
    EXPORT_USERS: 'admin/export-users',
    SUSPEND_USERS: 'subscription',
  },
  TRANSACTIONS:{
    GET_TRANSACTIONS: 'admin/payment-history',
    EXPORT: 'admin/payment-history/export-excel',
    GET_INVOICE: 'admin/payment',
    GET_TRANSACTION_GRAPH: 'admin/analytics/revenue',
  },
  PROMO_CODES:{
    GET_PROMO_CODES: 'admin/get-all',
    CREATE_PROMO_CODE: 'admin/create-promo',
    GET_PROMO_CODE_BY_ID: 'admin/promo',
    DELETE_PROMO_CODE: 'admin/delete',
    UPDATE_PROMO_CODE: 'admin/update',
  },
};
export const apiRequest = async (endpoint: string, options: any = {}) => {
  const requestId = Math.random().toString(36).substring(2, 6);

  const cleanEndpoint = endpoint.replace(/^\/+/, "");
  const url = API_BASE_URL
    ? `${cleanBaseUrl}/${cleanEndpoint}`
    : `/api/${cleanEndpoint}`;

  const isBinary = options.isBinary === true; // 🔥 detect binary mode

  const config: RequestInit = {
    method: options.method || "GET",
    headers: {
      ...options.headers,
    },
    body: options.body,
    credentials: isProduction ? "omit" : "include",
    mode: isProduction ? "cors" : "cors",
  };

  try {
    const response = await fetch(url, config);

    if (isBinary) {
      if (!response.ok) {
        throw new Error("File download failed");
      }
      return await response.blob(); // <-- Return Blob instead of JSON
    }
    const responseText = await response.text();

    let responseData;

    try {
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch {
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

      let errorMessage = "An error occurred";

      if (responseData?.error) errorMessage = responseData.error;
      else if (responseData?.message) errorMessage = responseData.message;
      else if (responseData?.errors) {
        errorMessage = Array.isArray(responseData.errors)
          ? responseData.errors
              .map((e: any) => e.message || e)
              .join(", ")
          : responseData.errors;
      } else if (response.statusText) errorMessage = response.statusText;

      const error: any = new Error(errorMessage);
      error.status = response.status;
      error.data = responseData;
      throw error;
    }

    return responseData;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }

    console.error("API request failed:", error);
    const networkError: any = new Error(
      error.message || "Network error occurred"
    );
    networkError.original = error;
    throw networkError;
  }
};


export default API_ENDPOINTS;