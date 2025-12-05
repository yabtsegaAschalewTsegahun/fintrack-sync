// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-api-url.com';

// Token Management
const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');
const setTokens = (access: string, refresh: string) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};
const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// API Client
const apiClient = async (
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = true
): Promise<any> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (requiresAuth) {
    const token = getAccessToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle token refresh if needed
  if (response.status === 401 && requiresAuth) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      const refreshResponse = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (refreshResponse.ok) {
        const { access, refresh } = await refreshResponse.json();
        setTokens(access, refresh);
        
        // Retry original request
        (headers as Record<string, string>)['Authorization'] = `Bearer ${access}`;
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });
        return retryResponse.json();
      } else {
        clearTokens();
        window.location.href = '/login';
        throw new Error('Session expired');
      }
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.detail || 'Request failed');
  }

  return response.json();
};

// Auth API
export const authApi = {
  login: async (username: string, password: string) => {
    const data = await apiClient('/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }, false);
    setTokens(data.access, data.refresh);
    return data;
  },

  signup: async (userData: {
    email: string;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string;
  }) => {
    return apiClient('/sign-up/', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, false);
  },

  resetPassword: async (email: string) => {
    return apiClient('/reset-password/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }, false);
  },

  changePassword: async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    return apiClient('/change-password/', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });
  },

  logout: () => {
    clearTokens();
    window.location.href = '/login';
  },

  isAuthenticated: () => !!getAccessToken(),
};

// Dashboard API
export const dashboardApi = {
  getMetrics: () => apiClient('/dashboard/metrics/'),
  getQuickStats: () => apiClient('/dashboard/quick-stats/'),
};

// Budget API
export const budgetApi = {
  getAll: () => apiClient('/create-budget/'),
  create: (data: { category: number; amount: number; due_date?: string; transaction?: number }) => 
    apiClient('/create-budget/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Transaction API
export const transactionApi = {
  getAll: () => apiClient('/get-transaction/'),
  create: (data: { 
    category: number; 
    amount: number; 
    description: string; 
    tx_ref: string;
    status: string;
  }) => apiClient('/create-transaction/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Banks API
export const banksApi = {
  getAll: () => apiClient('/get-bank/'),
};

// Payment API
export const paymentApi = {
  initiate: () => apiClient('/pay/', { method: 'POST' }),
  bankTransfer: (bankId: number, data: { budget_id: number; account_number: string; amount: string }) =>
    apiClient(`/chapa-bank-transfer/${bankId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  ussdPayment: (data: { budget_id: number; phone_number: string; amount: string }) =>
    apiClient('/ussd-payment/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export { clearTokens, getAccessToken };
