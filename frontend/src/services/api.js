const API_BASE = '/api';

export const api = {
  // Public Tourism Endpoints
  async getPlaces(params = {}) {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.is_nearby !== undefined) query.append('is_nearby', params.is_nearby);
    if (params.featured !== undefined) query.append('featured', params.featured);
    if (params.sort_by) query.append('sort_by', params.sort_by);
    
    const res = await fetch(`${API_BASE}/places?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch places');
    return res.json();
  },

  async getPlaceBySlug(slug) {
    const res = await fetch(`${API_BASE}/places/${slug}`);
    if (!res.ok) throw new Error('Failed to load destination details');
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getNearbyPlaces() {
    const res = await fetch(`${API_BASE}/places/nearby`);
    if (!res.ok) throw new Error('Failed to fetch nearby attractions');
    return res.json();
  },

  async getHotels(params = {}) {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    const res = await fetch(`${API_BASE}/hotels?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch hotels');
    return res.json();
  },

  async getRestaurants(params = {}) {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.is_pure_veg !== undefined) query.append('is_pure_veg', params.is_pure_veg);
    if (params.search) query.append('search', params.search);
    const res = await fetch(`${API_BASE}/restaurants?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch restaurants');
    return res.json();
  },

  async getItineraries() {
    const res = await fetch(`${API_BASE}/itineraries`);
    if (!res.ok) throw new Error('Failed to fetch itineraries');
    return res.json();
  },

  async getItineraryBySlug(slug) {
    const res = await fetch(`${API_BASE}/itineraries/${slug}`);
    if (!res.ok) throw new Error('Failed to load itinerary');
    return res.json();
  },

  async getGallery(category) {
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`${API_BASE}/gallery${query}`);
    if (!res.ok) throw new Error('Failed to fetch gallery images');
    return res.json();
  },

  async submitContact(data) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to submit contact message');
    }
    return res.json();
  },

  async submitFeedback(data) {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to submit visitor feedback');
    }
    return res.json();
  },

  // Admin Endpoints
  async adminLogin(username, password) {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Authentication failed');
    }
    return res.json();
  },

  // Helper for parsing JSON with status preservation
  async _handleAdminRes(res, defaultMsg) {
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const error = new Error(err.detail || defaultMsg);
      error.status = res.status;
      throw error;
    }
    return res.json();
  },

  async getAdminStats(token) {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return this._handleAdminRes(res, 'Failed to fetch admin stats');
  },

  async getAdminPlaces(token) {
    const res = await fetch(`${API_BASE}/admin/places`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return this._handleAdminRes(res, 'Failed to fetch admin destinations');
  },

  async getAdminPlaceById(id, token) {
    const res = await fetch(`${API_BASE}/admin/places/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return this._handleAdminRes(res, 'Failed to fetch destination details');
  },

  async adminCreatePlace(data, token) {
    const res = await fetch(`${API_BASE}/admin/places`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return this._handleAdminRes(res, 'Failed to create destination');
  },

  async adminUpdatePlace(id, data, token) {
    const res = await fetch(`${API_BASE}/admin/places/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return this._handleAdminRes(res, 'Failed to update destination');
  },

  async adminDeletePlace(id, token) {
    const res = await fetch(`${API_BASE}/admin/places/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return this._handleAdminRes(res, 'Failed to delete destination');
  },

  async getAdminMessages(token) {
    const res = await fetch(`${API_BASE}/admin/contact-messages`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return this._handleAdminRes(res, 'Failed to fetch contact inquiries');
  },

  async markMessageRead(id, token) {
    const res = await fetch(`${API_BASE}/admin/contact-messages/${id}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    return this._handleAdminRes(res, 'Failed to update message status');
  },

  async getAdminFeedback(token) {
    const res = await fetch(`${API_BASE}/admin/feedback`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return this._handleAdminRes(res, 'Failed to fetch feedback entries');
  },

  async deleteAdminFeedback(id, token) {
    const res = await fetch(`${API_BASE}/admin/feedback/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return this._handleAdminRes(res, 'Failed to delete feedback');
  }
};
