import { PortfolioData, ContactMessage } from '../types.js';

export const api = {
  // Public portfolio
  async getPortfolio(): Promise<PortfolioData> {
    const res = await fetch('/api/portfolio');
    if (!res.ok) throw new Error('Failed to load portfolio');
    return res.json();
  },

  // Contact submission
  async submitContact(data: { name: string; email: string; project_type: string; message: string }) {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to submit contact');
    return json;
  },

  // Admin login
  async adminLogin(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Login failed');
    return json;
  },

  // Admin get all CMS state
  async getAdminAll(token: string) {
    const res = await fetch('/api/admin/all', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch admin state');
    return res.json();
  },

  // Admin update profile
  async updateProfile(token: string, data: any) {
    const res = await fetch('/api/admin/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Admin update settings
  async updateSettings(token: string, data: any) {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  // Admin generic entity CRUD
  async createEntity(token: string, entityPath: string, data: any) {
    const res = await fetch(`/api/admin/${entityPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to create ${entityPath}`);
    return res.json();
  },

  async updateEntity(token: string, entityPath: string, id: string, data: any) {
    const res = await fetch(`/api/admin/${entityPath}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Failed to update ${entityPath}`);
    return res.json();
  },

  async deleteEntity(token: string, entityPath: string, id: string) {
    const res = await fetch(`/api/admin/${entityPath}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Failed to delete ${entityPath}`);
    return res.json();
  },

  async reorderEntities(token: string, entityPath: string, ids: string[]) {
    const res = await fetch(`/api/admin/${entityPath}/reorder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error(`Failed to reorder ${entityPath}`);
    return res.json();
  },

  // Admin Messages
  async getMessages(token: string) {
    const res = await fetch('/api/admin/messages', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async updateMessage(token: string, id: string, data: Partial<ContactMessage>) {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update message');
    return res.json();
  },

  async deleteMessage(token: string, id: string) {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete message');
    return res.json();
  },

  // Admin Upload
  async uploadImage(token: string, dataUrl: string, filename?: string) {
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ dataUrl, filename }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Upload failed');
    return json;
  },

  // Admin Account Credentials
  async updateCredentials(token: string, data: { current_password?: string; new_password?: string; email?: string; name?: string }) {
    const res = await fetch('/api/auth/update-credentials', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update credentials');
    return json;
  },
};
