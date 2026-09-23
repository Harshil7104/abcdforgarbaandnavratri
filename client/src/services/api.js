const API_BASE_URL = '/api';

/**
 * Authentication & Storage Utilities
 */
export const storage = {
  getToken: () => localStorage.getItem('garba_auth_token'),
  setToken: (token) => localStorage.setItem('garba_auth_token', token),
  removeToken: () => localStorage.removeItem('garba_auth_token'),
  
  getUser: () => {
    try {
      const data = localStorage.getItem('garba_user_data');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem('garba_user_data', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('garba_user_data'),
  
  clearAuth: () => {
    localStorage.removeItem('garba_auth_token');
    localStorage.removeItem('garba_user_data');
  }
};

/**
 * Handle API responses & parse JSON error messages
 */
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({
    success: false,
    message: 'Unexpected response from server',
  }));

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
};

/**
 * API Service Methods
 */
export const api = {
  /**
   * Register a new user
   */
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await handleResponse(response);
    
    if (result.success && result.data?.token) {
      storage.setToken(result.data.token);
      storage.setUser(result.data.user);
    }
    
    return result;
  },

  /**
   * Log in an existing user
   */
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const result = await handleResponse(response);
    
    if (result.success && result.data?.token) {
      storage.setToken(result.data.token);
      storage.setUser(result.data.user);
    }

    return result;
  },

  /**
   * Fetch current authenticated user's profile
   */
  getProfile: async () => {
    const token = storage.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await handleResponse(response);
    if (result.success && result.data) {
      storage.setUser(result.data);
    }
    return result;
  },

  /**
   * Get messages for a match
   */
  getMessages: async (matchId) => {
    const token = storage.getToken();
    const response = await fetch(`${API_BASE_URL}/messages/${matchId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  /**
   * Send a message
   */
  sendMessage: async ({ receiverId, matchId, text }) => {
    const token = storage.getToken();
    const response = await fetch(`${API_BASE_URL}/messages/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ receiverId, matchId, text }),
    });
    return handleResponse(response);
  },

  /**
   * Report/Block user
   */
  reportUser: async ({ targetUserId, reason, blockUser }) => {
    const token = storage.getToken();
    const response = await fetch(`${API_BASE_URL}/messages/report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ targetUserId, reason, blockUser }),
    });
    return handleResponse(response);
  },

  /**
   * Admin: Run Batch Matching
   */
  runBatchMatch: async (mode = 'hybrid') => {
    const token = storage.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ mode }),
    });
    return handleResponse(response);
  },

  /**
   * Admin: Get statistics
   */
  getAdminStats: async () => {
    const token = storage.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return handleResponse(response);
  },

  /**
   * Admin: Get users list with filters
   */
  getAdminUsers: async (filters = {}) => {
    const token = storage.getToken();
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/admin/users?${query}`, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return handleResponse(response);
  },

  /**
   * Admin: Block a user
   */
  blockAdminUser: async ({ userId, reason }) => {
    const token = storage.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/block`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ userId, reason }),
    });
    return handleResponse(response);
  },

  /**
   * Admin: Unblock a user
   */
  unblockAdminUser: async (userId) => {
    const token = storage.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/unblock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ userId }),
    });
    return handleResponse(response);
  },

  /**
   * Admin: Get safety reports
   */
  getAdminReports: async () => {
    const token = storage.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/reports`, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return handleResponse(response);
  },

  /**
   * Admin: Get notification dispatch logs
   */
  getNotificationLogs: async () => {
    const token = storage.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/notifications`, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return handleResponse(response);
  },

  /**
   * Admin: Trigger test notification
   */
  triggerTestNotification: async ({ phone, fullName, city }) => {
    const token = storage.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/test-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ phone, fullName, city }),
    });
    return handleResponse(response);
  },

  /**
   * Admin: Seed demo Gujarati partners
   */
  seedDemoPartners: async () => {
    const token = storage.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/seed-demo`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return handleResponse(response);
  },

  /**
   * Admin: Reset all users to pending
   */
  resetMatching: async () => {
    const token = storage.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/reset-matching`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return handleResponse(response);
  },

  /**
   * Privacy-Preserving Analytics: Track client event
   */
  trackEvent: async (eventType, payload = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,
          ...payload,
        }),
      });
      return await response.json();
    } catch {
      // Fire-and-forget: fail silently to never block user flow
      return { success: false };
    }
  },

  /**
   * Submit User Feedback
   */
  submitFeedback: async ({ category, message }) => {
    const token = storage.getToken();
    const response = await fetch(`${API_BASE_URL}/user/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ category, message }),
    });
    return handleResponse(response);
  },

  /**
   * Admin: Get Growth & Funnel Analytics
   */
  getAdminAnalytics: async () => {
    const token = storage.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/analytics`, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return handleResponse(response);
  },

  /**
   * Admin: Get User Feedbacks
   */
  getAdminFeedback: async (status = '') => {
    const token = storage.getToken();
    const query = status ? `?status=${status}` : '';
    const response = await fetch(`${API_BASE_URL}/admin/feedback${query}`, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return handleResponse(response);
  },

  /**
   * Admin: Get Detailed Match Overview Pairs & Groups
   */
  getMatchesOverview: async (filters = {}) => {
    const token = storage.getToken();
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/admin/matches-overview?${query}`, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return handleResponse(response);
  },

  /**
   * Admin: Manual Unmatch / Break Pair
   */
  manualUnmatch: async ({ userAId, userBId }) => {
    const token = storage.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/manual-unmatch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ userAId, userBId }),
    });
    return handleResponse(response);
  },

  /**
   * Admin: Manual Match / Pair two pending users
   */
  manualMatch: async ({ userAId, userBId }) => {
    const token = storage.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/manual-match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ userAId, userBId }),
    });
    return handleResponse(response);
  },

  /**
   * Admin: Export all matches as CSV download
   */
  exportMatchesCsv: async () => {
    const token = storage.getToken();
    const response = await fetch(`${API_BASE_URL}/admin/export-matches`, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) throw new Error('Failed to export CSV');
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `garba_matches_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
    return { success: true };
  },
};


