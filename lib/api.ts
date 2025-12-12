// API client for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

// Helper function to get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

// Helper function to make authenticated requests
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  async login(email: string, password: string) {
    const data = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    
    return data;
  },

  async verify() {
    return fetchWithAuth('/auth/verify');
  },

  logout() {
    localStorage.removeItem('authToken');
  },
};

// Content API
export const contentAPI = {
  async getAll() {
    return fetchWithAuth('/content');
  },

  async getByKey(key: string) {
    return fetchWithAuth(`/content/${key}`);
  },

  async update(key: string, data: any) {
    return fetchWithAuth(`/content/${key}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Events API
export const eventsAPI = {
  async getAll() {
    return fetchWithAuth('/events');
  },

  async getById(id: string) {
    return fetchWithAuth(`/events/${id}`);
  },

  async create(event: any) {
    return fetchWithAuth('/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
  },

  async update(id: string, event: any) {
    return fetchWithAuth(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(event),
    });
  },

  async delete(id: string) {
    return fetchWithAuth(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};

// Upload API (Backblaze B2)
export const uploadAPI = {
  async uploadImage(base64Image: string, fileName?: string) {
    try {
      return await fetchWithAuth('/upload/image', {
        method: 'POST',
        body: JSON.stringify({ image: base64Image, fileName }),
      });
    } catch (error: any) {
      // Fallback to base64 if B2 is not configured
      if (error.message.includes('not configured') || error.message.includes('fallback')) {
        console.warn('Backblaze B2 not configured, using base64 storage');
        return { url: base64Image, fallback: true };
      }
      throw error;
    }
  },

  async uploadMultipleImages(base64Images: string[]) {
    try {
      return await fetchWithAuth('/upload/images', {
        method: 'POST',
        body: JSON.stringify({ images: base64Images }),
      });
    } catch (error: any) {
      // Fallback to base64 if B2 is not configured
      if (error.message.includes('not configured') || error.message.includes('fallback')) {
        console.warn('Backblaze B2 not configured, using base64 storage');
        return { urls: base64Images, fallback: true };
      }
      throw error;
    }
  },

  async deleteImage(url: string) {
    return fetchWithAuth('/upload/image', {
      method: 'DELETE',
      body: JSON.stringify({ url }),
    });
  },

  async getStatus() {
    return fetchWithAuth('/upload/status');
  },

  // Get proxied image URL for secure access to private B2 files
  getProxiedImageUrl(b2Url: string): string {
    if (b2Url.startsWith('data:')) {
      // Base64 image, return as-is
      return b2Url;
    }
    // Return proxied URL that will be served through our backend with authorization
    return `${API_BASE_URL}/upload/proxy?url=${encodeURIComponent(b2Url)}`;
  },

  // Get authorized URL for direct B2 access (alternative to proxy)
  async getAuthorizedUrl(b2Url: string, duration?: number): Promise<string> {
    if (b2Url.startsWith('data:')) {
      return b2Url;
    }
    const response = await fetchWithAuth('/upload/authorize', {
      method: 'POST',
      body: JSON.stringify({ url: b2Url, duration }),
    });
    return response.url || response.authorizedUrl;
  },
};

