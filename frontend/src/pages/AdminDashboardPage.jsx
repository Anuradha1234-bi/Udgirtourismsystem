import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { VerificationBadge } from '../components/VerificationBadge';
import {
  ShieldCheck, Landmark, MessageSquare, Star,
  Plus, Trash2, Eye, EyeOff, LogOut, RefreshCw, X, Check,
  Edit, AlertCircle, MapPin, Sparkles, Image, Info, ExternalLink
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const { lang, t } = useLanguage();
  const { token, username, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [activeTab, setActiveTab] = useState('places'); // 'places' | 'messages' | 'feedback'
  const [loading, setLoading] = useState(true);

  // Destination Modal & Form State
  const emptyPlaceForm = {
    slug: '',
    name_en: '',
    name_mr: '',
    tagline_en: '',
    tagline_mr: '',
    category_id: 1,
    description_en: '',
    description_mr: '',
    history_en: '',
    history_mr: '',
    culture_en: '',
    culture_mr: '',
    highlights_en: '',
    highlights_mr: '',
    address_en: '',
    address_mr: '',
    distance_from_udgir_km: 0.0,
    is_nearby_attraction: false,
    latitude: 18.3942,
    longitude: 77.1172,
    is_coordinates_approximate: false,
    google_maps_url: '',
    opening_hours_en: '',
    opening_hours_mr: '',
    entry_fee_en: '',
    entry_fee_mr: '',
    facilities_en: '',
    facilities_mr: '',
    accessibility_info_en: '',
    accessibility_info_mr: '',
    travel_tips_en: '',
    travel_tips_mr: '',
    hero_image: '/assets/destinations/placeholder-monument.svg',
    gallery_images_text: '',
    verification_status: 'officially_verified',
    source_name: '',
    source_url: '',
    source_type: '',
    last_verified_at: '',
    is_published: true,
    is_featured: false
  };

  const [placeModalOpen, setPlaceModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [editingPlaceId, setEditingPlaceId] = useState(null);
  const [placeForm, setPlaceForm] = useState(emptyPlaceForm);
  const [modalTab, setModalTab] = useState('basic'); // 'basic' | 'content' | 'location' | 'practical' | 'media'
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [modalSuccess, setModalSuccess] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    loadDashboardData();
  }, [isAuthenticated, token]);

  const handleAuthError = (err) => {
    if (err.status === 401 || err.message?.includes('token') || err.message?.includes('401') || err.message?.includes('Unauthorized')) {
      logout();
      navigate('/admin/login');
      return true;
    }
    return false;
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Prefer getAdminPlaces to include draft/unpublished places; fallback to getPlaces
      let placesPromise;
      if (typeof api.getAdminPlaces === 'function') {
        placesPromise = api.getAdminPlaces(token).catch(() => api.getPlaces());
      } else {
        placesPromise = api.getPlaces();
      }

      const [statsRes, placesRes, catsRes, msgsRes, feedRes] = await Promise.all([
        api.getAdminStats(token),
        placesPromise,
        api.getCategories(),
        api.getAdminMessages(token),
        api.getAdminFeedback(token)
      ]);
      setStats(statsRes);
      setPlaces(placesRes);
      setCategories(catsRes);
      setMessages(msgsRes);
      setFeedback(feedRes);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      if (!handleAuthError(err)) {
        // Other non-auth errors
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    setEditingPlaceId(null);
    setPlaceForm({
      ...emptyPlaceForm,
      category_id: categories.length > 0 ? categories[0].id : 1
    });
    setModalTab('basic');
    setModalError(null);
    setModalSuccess(null);
    setPlaceModalOpen(true);
  };

  const handleOpenEditModal = async (place) => {
    setModalMode('edit');
    setEditingPlaceId(place.id);
    setModalTab('basic');
    setModalError(null);
    setModalSuccess(null);
    setPlaceModalOpen(true);
    setModalLoading(true);

    try {
      let fullPlace = place;
      if (typeof api.getAdminPlaceById === 'function') {
        try {
          fullPlace = await api.getAdminPlaceById(place.id, token);
        } catch {
          // Fallback to place object from table
        }
      }

      setPlaceForm({
        slug: fullPlace.slug || '',
        name_en: fullPlace.name_en || '',
        name_mr: fullPlace.name_mr || '',
        tagline_en: fullPlace.tagline_en || '',
        tagline_mr: fullPlace.tagline_mr || '',
        category_id: fullPlace.category_id || (fullPlace.category ? fullPlace.category.id : 1),
        description_en: fullPlace.description_en || '',
        description_mr: fullPlace.description_mr || '',
        history_en: fullPlace.history_en || '',
        history_mr: fullPlace.history_mr || '',
        culture_en: fullPlace.culture_en || '',
        culture_mr: fullPlace.culture_mr || '',
        highlights_en: fullPlace.highlights_en || '',
        highlights_mr: fullPlace.highlights_mr || '',
        address_en: fullPlace.address_en || '',
        address_mr: fullPlace.address_mr || '',
        distance_from_udgir_km: fullPlace.distance_from_udgir_km !== undefined ? fullPlace.distance_from_udgir_km : 0.0,
        is_nearby_attraction: Boolean(fullPlace.is_nearby_attraction),
        latitude: fullPlace.latitude !== null && fullPlace.latitude !== undefined ? fullPlace.latitude : '',
        longitude: fullPlace.longitude !== null && fullPlace.longitude !== undefined ? fullPlace.longitude : '',
        is_coordinates_approximate: Boolean(fullPlace.is_coordinates_approximate),
        google_maps_url: fullPlace.google_maps_url || '',
        opening_hours_en: fullPlace.opening_hours_en || '',
        opening_hours_mr: fullPlace.opening_hours_mr || '',
        entry_fee_en: fullPlace.entry_fee_en || '',
        entry_fee_mr: fullPlace.entry_fee_mr || '',
        facilities_en: fullPlace.facilities_en || '',
        facilities_mr: fullPlace.facilities_mr || '',
        accessibility_info_en: fullPlace.accessibility_info_en || '',
        accessibility_info_mr: fullPlace.accessibility_info_mr || '',
        travel_tips_en: fullPlace.travel_tips_en || '',
        travel_tips_mr: fullPlace.travel_tips_mr || '',
        hero_image: fullPlace.hero_image || '/assets/destinations/placeholder-monument.svg',
        gallery_images_text: (fullPlace.images || []).map((img) => img.image_url).join('\n'),
        verification_status: fullPlace.verification_status || 'officially_verified',
        source_name: fullPlace.source_name || '',
        source_url: fullPlace.source_url || '',
        source_type: fullPlace.source_type || '',
        last_verified_at: fullPlace.last_verified_at || '',
        is_published: fullPlace.is_published !== undefined ? Boolean(fullPlace.is_published) : true,
        is_featured: Boolean(fullPlace.is_featured)
      });
    } catch (err) {
      if (!handleAuthError(err)) {
        setModalError(err.message || 'Failed to load destination details');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const isValidUrlOrPath = (str) => {
    if (!str || typeof str !== 'string') return false;
    const trimmed = str.trim();
    if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true;
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handlePlaceFormSubmit = async (e) => {
    e.preventDefault();
    if (modalSubmitting) return;

    setModalError(null);
    setModalSuccess(null);

    // Required field validation
    if (!placeForm.slug.trim()) {
      setModalError('Slug is required.');
      return;
    }
    if (!/^[a-z0-9_-]+$/.test(placeForm.slug.trim())) {
      setModalError('Slug can only contain lowercase letters, numbers, hyphens, and underscores.');
      return;
    }
    if (!placeForm.name_en.trim() || !placeForm.name_mr.trim()) {
      setModalError('Both English and Marathi destination names are required.');
      return;
    }
    if (!placeForm.description_en.trim() || !placeForm.description_mr.trim()) {
      setModalError('Both English and Marathi descriptions are required.');
      return;
    }
    if (!placeForm.address_en.trim() || !placeForm.address_mr.trim()) {
      setModalError('Both English and Marathi addresses are required.');
      return;
    }
    if (!placeForm.hero_image.trim()) {
      setModalError('Hero image URL is required.');
      return;
    }
    if (!isValidUrlOrPath(placeForm.hero_image.trim())) {
      setModalError('Hero image URL must be a valid HTTP/HTTPS URL or root-relative path (e.g. /assets/...).');
      return;
    }
    if (placeForm.google_maps_url && placeForm.google_maps_url.trim() && !isValidUrlOrPath(placeForm.google_maps_url.trim())) {
      setModalError('Google Maps URL must be a valid HTTP or HTTPS URL.');
      return;
    }
    if (placeForm.source_url && placeForm.source_url.trim() && !isValidUrlOrPath(placeForm.source_url.trim())) {
      setModalError('Source reference URL must be a valid HTTP or HTTPS URL.');
      return;
    }

    // Validate coordinates
    const parsedLat = placeForm.latitude === '' || placeForm.latitude === null ? null : parseFloat(placeForm.latitude);
    const parsedLng = placeForm.longitude === '' || placeForm.longitude === null ? null : parseFloat(placeForm.longitude);
    if (parsedLat !== null && (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90)) {
      setModalError('Latitude must be a valid number between -90 and 90.');
      return;
    }
    if (parsedLng !== null && (isNaN(parsedLng) || parsedLng < -180 || parsedLng > 180)) {
      setModalError('Longitude must be a valid number between -180 and 180.');
      return;
    }

    // Process gallery images
    const galleryLines = placeForm.gallery_images_text
      ? placeForm.gallery_images_text.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];
    for (const url of galleryLines) {
      if (!isValidUrlOrPath(url)) {
        setModalError(`Invalid gallery image URL: "${url}". Must be a valid HTTP/HTTPS URL or root-relative path.`);
        return;
      }
    }

    const payload = {
      slug: placeForm.slug.trim(),
      name_en: placeForm.name_en.trim(),
      name_mr: placeForm.name_mr.trim(),
      tagline_en: placeForm.tagline_en ? placeForm.tagline_en.trim() : null,
      tagline_mr: placeForm.tagline_mr ? placeForm.tagline_mr.trim() : null,
      category_id: parseInt(placeForm.category_id, 10),
      description_en: placeForm.description_en.trim(),
      description_mr: placeForm.description_mr.trim(),
      history_en: placeForm.history_en ? placeForm.history_en.trim() : null,
      history_mr: placeForm.history_mr ? placeForm.history_mr.trim() : null,
      culture_en: placeForm.culture_en ? placeForm.culture_en.trim() : null,
      culture_mr: placeForm.culture_mr ? placeForm.culture_mr.trim() : null,
      highlights_en: placeForm.highlights_en ? placeForm.highlights_en.trim() : null,
      highlights_mr: placeForm.highlights_mr ? placeForm.highlights_mr.trim() : null,
      address_en: placeForm.address_en.trim(),
      address_mr: placeForm.address_mr.trim(),
      distance_from_udgir_km: parseFloat(placeForm.distance_from_udgir_km) || 0.0,
      is_nearby_attraction: Boolean(placeForm.is_nearby_attraction),
      latitude: parsedLat,
      longitude: parsedLng,
      is_coordinates_approximate: Boolean(placeForm.is_coordinates_approximate),
      google_maps_url: placeForm.google_maps_url ? placeForm.google_maps_url.trim() : null,
      opening_hours_en: placeForm.opening_hours_en ? placeForm.opening_hours_en.trim() : null,
      opening_hours_mr: placeForm.opening_hours_mr ? placeForm.opening_hours_mr.trim() : null,
      entry_fee_en: placeForm.entry_fee_en ? placeForm.entry_fee_en.trim() : null,
      entry_fee_mr: placeForm.entry_fee_mr ? placeForm.entry_fee_mr.trim() : null,
      facilities_en: placeForm.facilities_en ? placeForm.facilities_en.trim() : null,
      facilities_mr: placeForm.facilities_mr ? placeForm.facilities_mr.trim() : null,
      accessibility_info_en: placeForm.accessibility_info_en ? placeForm.accessibility_info_en.trim() : null,
      accessibility_info_mr: placeForm.accessibility_info_mr ? placeForm.accessibility_info_mr.trim() : null,
      travel_tips_en: placeForm.travel_tips_en ? placeForm.travel_tips_en.trim() : null,
      travel_tips_mr: placeForm.travel_tips_mr ? placeForm.travel_tips_mr.trim() : null,
      hero_image: placeForm.hero_image.trim(),
      gallery_images: galleryLines,
      verification_status: placeForm.verification_status,
      source_name: placeForm.source_name ? placeForm.source_name.trim() : null,
      source_url: placeForm.source_url ? placeForm.source_url.trim() : null,
      source_type: placeForm.source_type ? placeForm.source_type.trim() : null,
      last_verified_at: placeForm.last_verified_at ? placeForm.last_verified_at.trim() : null,
      is_published: Boolean(placeForm.is_published),
      is_featured: Boolean(placeForm.is_featured)
    };

    setModalSubmitting(true);
    try {
      if (modalMode === 'add') {
        await api.adminCreatePlace(payload, token);
        setModalSuccess('Destination created and published successfully!');
      } else {
        await api.adminUpdatePlace(editingPlaceId, payload, token);
        setModalSuccess('Destination updated successfully!');
      }

      await loadDashboardData();
      setTimeout(() => {
        setPlaceModalOpen(false);
        setModalSuccess(null);
      }, 700);
    } catch (err) {
      if (!handleAuthError(err)) {
        setModalError(err.message || 'Error saving destination');
      }
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleTogglePublish = async (place) => {
    try {
      await api.adminUpdatePlace(place.id, { is_published: !place.is_published }, token);
      setPlaces(places.map((p) => (p.id === place.id ? { ...p, is_published: !p.is_published } : p)));
    } catch (err) {
      if (!handleAuthError(err)) {
        alert('Error updating publication status: ' + err.message);
      }
    }
  };

  const handleChangeVerification = async (placeId, newStatus) => {
    try {
      await api.adminUpdatePlace(placeId, { verification_status: newStatus }, token);
      setPlaces(places.map((p) => (p.id === placeId ? { ...p, verification_status: newStatus } : p)));
    } catch (err) {
      if (!handleAuthError(err)) {
        alert('Error updating status: ' + err.message);
      }
    }
  };

  const handleDeletePlace = async (placeId) => {
    try {
      await api.adminDeletePlace(placeId, token);
      setPlaces(places.filter((p) => p.id !== placeId));
      setDeleteConfirmId(null);
    } catch (err) {
      if (!handleAuthError(err)) {
        alert('Error deleting destination: ' + err.message);
      }
    }
  };

  const handleMarkRead = async (msgId) => {
    try {
      await api.markMessageRead(msgId, token);
      setMessages(messages.map((m) => (m.id === msgId ? { ...m, is_read: true } : m)));
    } catch (err) {
      if (!handleAuthError(err)) {
        alert('Error: ' + err.message);
      }
    }
  };

  const handleDeleteFeedback = async (feedId) => {
    try {
      await api.deleteAdminFeedback(feedId, token);
      setFeedback(feedback.filter((f) => f.id !== feedId));
    } catch (err) {
      if (!handleAuthError(err)) {
        alert('Error: ' + err.message);
      }
    }
  };

  // Immediate defense-in-depth guard: never render admin UI if unauthenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ padding: '40px 0 100px 0' }}>
      <div className="container">
        {/* Top Header & Actions */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          background: 'var(--white)',
          padding: '24px 30px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-light)',
          marginBottom: '36px'
        }}>
          <div>
            <span className="section-tag">
              {lang === 'mr' ? 'प्रशासकीय नियंत्रण कक्ष' : 'Admin Control Center'}
            </span>
            <h1 style={{ color: 'var(--forest-green)', fontSize: '1.6rem', fontWeight: 800 }}>
              {t.admin.dashboard}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Logged in as: <strong>{username}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleOpenAddModal}
              className="btn-primary"
              style={{ padding: '9px 18px', fontSize: '0.88rem' }}
            >
              <Plus size={16} />
              <span>{t.admin.addNewPlace}</span>
            </button>

            <button
              onClick={logout}
              className="btn-secondary"
              style={{ padding: '9px 18px', fontSize: '0.88rem' }}
            >
              <LogOut size={16} />
              <span>{t.admin.logout}</span>
            </button>
          </div>
        </div>

        {/* Stats Metrics Grid */}
        {stats && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '36px'
          }}>
            <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.admin.totalPlaces}</span>
                <Landmark size={20} color="var(--golden-hover)" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--forest-green)', marginTop: '8px' }}>
                {stats.total_places}
              </div>
            </div>

            <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.admin.verifiedPlaces}</span>
                <ShieldCheck size={20} color="#1B5E20" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1B5E20', marginTop: '8px' }}>
                {stats.verified_places}
              </div>
            </div>

            <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.admin.unreadMessages}</span>
                <MessageSquare size={20} color="#E65100" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#E65100', marginTop: '8px' }}>
                {stats.unread_messages}
              </div>
            </div>

            <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.admin.totalFeedback}</span>
                <Star size={20} color="#F59E0B" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--forest-green)', marginTop: '8px' }}>
                {stats.total_feedback}
              </div>
            </div>
          </div>
        )}

        {/* Section Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('places')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: '1px solid',
              borderColor: activeTab === 'places' ? 'var(--forest-green)' : 'var(--border-light)',
              background: activeTab === 'places' ? 'var(--forest-green)' : 'var(--white)',
              color: activeTab === 'places' ? 'var(--white)' : 'var(--text-dark)',
              cursor: 'pointer'
            }}
          >
            {t.admin.managePlaces} ({places.length})
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: '1px solid',
              borderColor: activeTab === 'messages' ? 'var(--forest-green)' : 'var(--border-light)',
              background: activeTab === 'messages' ? 'var(--forest-green)' : 'var(--white)',
              color: activeTab === 'messages' ? 'var(--white)' : 'var(--text-dark)',
              cursor: 'pointer'
            }}
          >
            {lang === 'mr' ? 'चौकशी संदेश' : 'Contact Inquiries'} ({messages.length})
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: '1px solid',
              borderColor: activeTab === 'feedback' ? 'var(--forest-green)' : 'var(--border-light)',
              background: activeTab === 'feedback' ? 'var(--forest-green)' : 'var(--white)',
              color: activeTab === 'feedback' ? 'var(--white)' : 'var(--text-dark)',
              cursor: 'pointer'
            }}
          >
            {lang === 'mr' ? 'पर्यटक अभिप्राय' : 'Visitor Feedback'} ({feedback.length})
          </button>
        </div>

        {/* Places Table */}
        {activeTab === 'places' && (
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-light)',
            overflowX: 'auto'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'var(--warm-cream)', borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '14px 18px' }}>Destination</th>
                  <th style={{ padding: '14px 18px' }}>Category</th>
                  <th style={{ padding: '14px 18px' }}>Verification Status</th>
                  <th style={{ padding: '14px 18px' }}>Published</th>
                  <th style={{ padding: '14px 18px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {places.map((place) => (
                  <tr key={place.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--forest-green)' }}>{place.name_en}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{place.name_mr}</div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ fontSize: '0.82rem', background: 'var(--warm-cream)', padding: '3px 8px', borderRadius: '4px' }}>
                        {place.category?.name_en || 'General'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <select
                        value={place.verification_status}
                        onChange={(e) => handleChangeVerification(place.id, e.target.value)}
                        style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid var(--border-light)' }}
                      >
                        <option value="officially_verified">Officially Verified</option>
                        <option value="cross_verified">Cross-Verified</option>
                        <option value="locally_reported">Locally Reported</option>
                        <option value="pending_verification">Pending Verification</option>
                        <option value="disputed_information">Disputed Information</option>
                      </select>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <button
                        onClick={() => handleTogglePublish(place)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          background: place.is_published ? '#E8F5E9' : '#ECEFF1',
                          color: place.is_published ? '#1B5E20' : '#546E7A'
                        }}
                      >
                        {place.is_published ? <Eye size={13} /> : <EyeOff size={13} />}
                        <span>{place.is_published ? 'Published' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenEditModal(place)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#E8F5E9',
                            color: '#1B5E20',
                            border: '1px solid #A5D6A7',
                            borderRadius: '4px',
                            padding: '5px 9px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                          title={t.admin.editPlace}
                        >
                          <Edit size={13} />
                          <span>{lang === 'mr' ? 'संपादित करा' : 'Edit'}</span>
                        </button>

                        {deleteConfirmId === place.id ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => handleDeletePlace(place.id)}
                              style={{ background: '#C62828', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', border: 'none' }}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              style={{ background: '#ECEFF1', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', border: 'none' }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(place.id)}
                            style={{ color: '#C62828', padding: '5px 7px', borderRadius: '4px', background: '#FFEBEE', border: '1px solid #FFCDD2', cursor: 'pointer' }}
                            title="Delete destination"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Contact Messages Table */}
        {activeTab === 'messages' && (
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '24px', border: '1px solid var(--border-light)' }}>
            {messages.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No contact inquiries received yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.map((msg) => (
                  <div key={msg.id} style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    background: msg.is_read ? 'var(--white)' : 'var(--warm-cream)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <strong>{msg.name}</strong> ({msg.email}) {msg.phone && `| ${msg.phone}`}
                      </div>
                      {!msg.is_read && (
                        <button
                          onClick={() => handleMarkRead(msg.id)}
                          className="btn-secondary"
                          style={{ padding: '3px 10px', fontSize: '0.75rem' }}
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                    <div style={{ fontWeight: 600, color: 'var(--forest-green)', marginBottom: '4px' }}>
                      Subject: {msg.subject}
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-dark)' }}>{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Feedback List */}
        {activeTab === 'feedback' && (
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '24px', border: '1px solid var(--border-light)' }}>
            {feedback.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No feedback recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {feedback.map((item) => (
                  <div key={item.id} style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <strong>{item.name}</strong>
                        <span style={{ color: '#F59E0B', fontWeight: 700 }}>★ {item.rating}/5</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({item.destination_visited || 'General'})</span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-dark)' }}>{item.comments}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteFeedback(item.id)}
                      style={{ color: '#C62828', padding: '6px' }}
                      title="Delete feedback"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Destination Modal */}
        {placeModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 3000,
            background: 'rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(2px)'
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 'var(--radius-md)',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden'
            }}>
              {/* Modal Header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--warm-cream)'
              }}>
                <div>
                  <h3 style={{ color: 'var(--forest-green)', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                    {modalMode === 'add'
                      ? (lang === 'mr' ? 'नवीन पर्यटन स्थळ जोडा' : 'Add New Destination')
                      : (lang === 'mr' ? 'पर्यटन स्थळ संपादित करा' : 'Edit Destination')}
                  </h3>
                  {modalMode === 'edit' && placeForm.name_en && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {placeForm.name_en} ({placeForm.name_mr})
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setPlaceModalOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    padding: '4px'
                  }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Modal Tabs Navigation */}
              <div style={{
                display: 'flex',
                gap: '4px',
                padding: '10px 24px 0 24px',
                borderBottom: '1px solid var(--border-light)',
                background: '#FAFAF7',
                overflowX: 'auto'
              }}>
                {[
                  { id: 'basic', labelEn: '1. Basic Info', labelMr: '१. मूलभूत माहिती' },
                  { id: 'content', labelEn: '2. Descriptions & Culture', labelMr: '२. वर्णन व इतिहास' },
                  { id: 'location', labelEn: '3. Location & Coordinates', labelMr: '३. स्थान व नकाशे' },
                  { id: 'practical', labelEn: '4. Practical Info', labelMr: '४. सुविधा व वेळा' },
                  { id: 'media', labelEn: '5. Media & Verification', labelMr: '५. छायाचित्रे व संदर्भ' }
                ].map((tItem) => (
                  <button
                    key={tItem.id}
                    type="button"
                    onClick={() => setModalTab(tItem.id)}
                    style={{
                      padding: '8px 14px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      border: 'none',
                      borderBottom: modalTab === tItem.id ? '2px solid var(--forest-green)' : '2px solid transparent',
                      background: 'transparent',
                      color: modalTab === tItem.id ? 'var(--forest-green)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {lang === 'mr' ? tItem.labelMr : tItem.labelEn}
                  </button>
                ))}
              </div>

              {/* Status Alerts */}
              <div style={{ padding: '0 24px', marginTop: modalError || modalSuccess ? '14px' : '0' }}>
                {modalError && (
                  <div style={{
                    padding: '10px 14px',
                    background: '#FFEBEE',
                    color: '#C62828',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <AlertCircle size={16} />
                    <span>{modalError}</span>
                  </div>
                )}
                {modalSuccess && (
                  <div style={{
                    padding: '10px 14px',
                    background: '#E8F5E9',
                    color: '#1B5E20',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Check size={16} />
                    <span>{modalSuccess}</span>
                  </div>
                )}
              </div>

              {/* Modal Body / Form */}
              <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
                {modalLoading ? (
                  <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                    {lang === 'mr' ? 'माहिती लोड होत आहे...' : 'Loading destination details...'}
                  </div>
                ) : (
                  <form id="place-form" onSubmit={handlePlaceFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* TAB 1: BASIC INFO */}
                    {modalTab === 'basic' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Slug / URL Identifier *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. udgir-fort"
                              value={placeForm.slug}
                              onChange={(e) => setPlaceForm({ ...placeForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Accessible at /places/[slug]</span>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Category *
                            </label>
                            <select
                              value={placeForm.category_id}
                              onChange={(e) => setPlaceForm({ ...placeForm, category_id: parseInt(e.target.value, 10) })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            >
                              {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {lang === 'mr' ? c.name_mr : c.name_en} ({c.name_en})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              English Name *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Udgir Fort"
                              value={placeForm.name_en}
                              onChange={(e) => setPlaceForm({ ...placeForm, name_en: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Marathi Name (मराठी नाव) *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="उदा. उदगीर किल्ला"
                              value={placeForm.name_mr}
                              onChange={(e) => setPlaceForm({ ...placeForm, name_mr: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              English Tagline
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Historic land fort associated with the 1760 battle"
                              value={placeForm.tagline_en}
                              onChange={(e) => setPlaceForm({ ...placeForm, tagline_en: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Marathi Tagline (मराठी घोषवाक्य)
                            </label>
                            <input
                              type="text"
                              placeholder="उदा. १७६० च्या ऐतिहासिक लढाईचा साक्षीदार भुईकोट किल्ला"
                              value={placeForm.tagline_mr}
                              onChange={(e) => setPlaceForm({ ...placeForm, tagline_mr: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', alignItems: 'center', marginTop: '6px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Verification Status
                            </label>
                            <select
                              value={placeForm.verification_status}
                              onChange={(e) => setPlaceForm({ ...placeForm, verification_status: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            >
                              <option value="officially_verified">Officially Verified (शासकीय)</option>
                              <option value="cross_verified">Cross-Verified (पडताळणीकृत)</option>
                              <option value="locally_reported">Locally Reported (स्थानिक)</option>
                              <option value="pending_verification">Pending Verification (प्रलंबित)</option>
                              <option value="disputed_information">Disputed Information (वादग्रस्त)</option>
                            </select>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '18px' }}>
                            <input
                              type="checkbox"
                              id="is_published"
                              checked={placeForm.is_published}
                              onChange={(e) => setPlaceForm({ ...placeForm, is_published: e.target.checked })}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="is_published" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                              Published (सार्वजनिक दृश्य)
                            </label>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '18px' }}>
                            <input
                              type="checkbox"
                              id="is_featured"
                              checked={placeForm.is_featured}
                              onChange={(e) => setPlaceForm({ ...placeForm, is_featured: e.target.checked })}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="is_featured" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                              Featured (मुख्य आकर्षण)
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: CONTENT & DESCRIPTIONS */}
                    {modalTab === 'content' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                            English Overview & Description *
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={placeForm.description_en}
                            onChange={(e) => setPlaceForm({ ...placeForm, description_en: e.target.value })}
                            placeholder="Comprehensive description of the destination in English..."
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                            Marathi Overview & Description (मराठी सविस्तर वर्णन) *
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={placeForm.description_mr}
                            onChange={(e) => setPlaceForm({ ...placeForm, description_mr: e.target.value })}
                            placeholder="पर्यटन स्थळाचे मराठीतील विस्तृत वर्णन..."
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Historical Significance (English)
                            </label>
                            <textarea
                              rows={3}
                              value={placeForm.history_en}
                              onChange={(e) => setPlaceForm({ ...placeForm, history_en: e.target.value })}
                              placeholder="Historical background, architectural notes, rulers..."
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Historical Significance (मराठी ऐतिहासिक पार्श्वभूमी)
                            </label>
                            <textarea
                              rows={3}
                              value={placeForm.history_mr}
                              onChange={(e) => setPlaceForm({ ...placeForm, history_mr: e.target.value })}
                              placeholder="ऐतिहासिक महत्त्व, मराठा-निजाम लढाई संदर्भ, वास्तुशिल्प..."
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Cultural Significance (English)
                            </label>
                            <textarea
                              rows={2}
                              value={placeForm.culture_en}
                              onChange={(e) => setPlaceForm({ ...placeForm, culture_en: e.target.value })}
                              placeholder="Festivals, traditions, community customs..."
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Cultural Significance (मराठी सांस्कृतिक महत्त्व)
                            </label>
                            <textarea
                              rows={2}
                              value={placeForm.culture_mr}
                              onChange={(e) => setPlaceForm({ ...placeForm, culture_mr: e.target.value })}
                              placeholder="उत्सव, यात्रा, परंपरा, स्थानिक संस्कृती..."
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Key Highlights (English)
                            </label>
                            <textarea
                              rows={2}
                              value={placeForm.highlights_en}
                              onChange={(e) => setPlaceForm({ ...placeForm, highlights_en: e.target.value })}
                              placeholder="Bullet points or newline-separated key features"
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Key Highlights (मराठी प्रमुख वैशिष्ट्ये)
                            </label>
                            <textarea
                              rows={2}
                              value={placeForm.highlights_mr}
                              onChange={(e) => setPlaceForm({ ...placeForm, highlights_mr: e.target.value })}
                              placeholder="प्रमुख वैशिष्ट्ये, पाहण्यासारखी ठिकाणे"
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: LOCATION & COORDINATES */}
                    {modalTab === 'location' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Address in English *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Fort Road, Near Gandhi Chowk, Udgir - 413517"
                              value={placeForm.address_en}
                              onChange={(e) => setPlaceForm({ ...placeForm, address_en: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Address in Marathi (पत्ता) *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="उदा. किल्ला रस्ता, गांधी चौकाजवळ, उदगीर - ४१३५१७"
                              value={placeForm.address_mr}
                              onChange={(e) => setPlaceForm({ ...placeForm, address_mr: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Distance from Udgir Center (km)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              placeholder="0.0 for city center"
                              value={placeForm.distance_from_udgir_km}
                              onChange={(e) => setPlaceForm({ ...placeForm, distance_from_udgir_km: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '22px' }}>
                            <input
                              type="checkbox"
                              id="is_nearby_attraction"
                              checked={placeForm.is_nearby_attraction}
                              onChange={(e) => setPlaceForm({ ...placeForm, is_nearby_attraction: e.target.checked })}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="is_nearby_attraction" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                              Nearby Attraction (उदा. औसा, देवराजन, खरोसा)
                            </label>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Latitude (-90 to 90)
                            </label>
                            <input
                              type="number"
                              step="any"
                              placeholder="e.g. 18.3970"
                              value={placeForm.latitude}
                              onChange={(e) => setPlaceForm({ ...placeForm, latitude: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Longitude (-180 to 180)
                            </label>
                            <input
                              type="number"
                              step="any"
                              placeholder="e.g. 77.1190"
                              value={placeForm.longitude}
                              onChange={(e) => setPlaceForm({ ...placeForm, longitude: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '22px' }}>
                            <input
                              type="checkbox"
                              id="is_coordinates_approximate"
                              checked={placeForm.is_coordinates_approximate}
                              onChange={(e) => setPlaceForm({ ...placeForm, is_coordinates_approximate: e.target.checked })}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="is_coordinates_approximate" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                              Approximate Coordinates (अंदाजे स्थान)
                            </label>
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                            Google Maps Directions URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://www.google.com/maps/dir/?api=1&destination=..."
                            value={placeForm.google_maps_url}
                            onChange={(e) => setPlaceForm({ ...placeForm, google_maps_url: e.target.value })}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                          />
                        </div>
                      </div>
                    )}

                    {/* TAB 4: PRACTICAL TOURISM INFO */}
                    {modalTab === 'practical' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Opening Hours (EN)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 6:00 AM - 6:30 PM, Open Daily"
                              value={placeForm.opening_hours_en}
                              onChange={(e) => setPlaceForm({ ...placeForm, opening_hours_en: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Opening Hours (मराठी वेळ)
                            </label>
                            <input
                              type="text"
                              placeholder="उदा. सकाळी ६:०० ते सायंकाळी ६:३० (दररोज)"
                              value={placeForm.opening_hours_mr}
                              onChange={(e) => setPlaceForm({ ...placeForm, opening_hours_mr: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Entry Fee (EN)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Free Entry / ₹25 per adult"
                              value={placeForm.entry_fee_en}
                              onChange={(e) => setPlaceForm({ ...placeForm, entry_fee_en: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Entry Fee (मराठी प्रवेश शुल्क)
                            </label>
                            <input
                              type="text"
                              placeholder="उदा. विनामूल्य प्रवेश"
                              value={placeForm.entry_fee_mr}
                              onChange={(e) => setPlaceForm({ ...placeForm, entry_fee_mr: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Facilities Available (EN)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Parking, Restrooms, Drinking Water"
                              value={placeForm.facilities_en}
                              onChange={(e) => setPlaceForm({ ...placeForm, facilities_en: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Facilities Available (मराठी उपलब्ध सुविधा)
                            </label>
                            <input
                              type="text"
                              placeholder="उदा. वाहनतळ, पिण्याचे पाणी, माहिती फलक"
                              value={placeForm.facilities_mr}
                              onChange={(e) => setPlaceForm({ ...placeForm, facilities_mr: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Accessibility Info (EN)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Wheelchair accessible ramp at main entrance"
                              value={placeForm.accessibility_info_en}
                              onChange={(e) => setPlaceForm({ ...placeForm, accessibility_info_en: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Accessibility Info (मराठी सुलभता)
                            </label>
                            <input
                              type="text"
                              placeholder="उदा. मुख्य प्रवेशद्वाराजवळ व्हीलचेअर रॅम्प उपलब्ध"
                              value={placeForm.accessibility_info_mr}
                              onChange={(e) => setPlaceForm({ ...placeForm, accessibility_info_mr: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Travel Tips (EN)
                            </label>
                            <textarea
                              rows={2}
                              value={placeForm.travel_tips_en}
                              onChange={(e) => setPlaceForm({ ...placeForm, travel_tips_en: e.target.value })}
                              placeholder="e.g. Best visited during early morning or sunset"
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Travel Tips (मराठी उपयुक्त सूचना)
                            </label>
                            <textarea
                              rows={2}
                              value={placeForm.travel_tips_mr}
                              onChange={(e) => setPlaceForm({ ...placeForm, travel_tips_mr: e.target.value })}
                              placeholder="उदा. सकाळच्या किंवा संध्याकाळच्या वेळी भेट देणे उत्तम"
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 5: MEDIA & VERIFICATION */}
                    {modalTab === 'media' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                            Hero Image URL *
                          </label>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                              type="text"
                              required
                              placeholder="e.g. /assets/destinations/udgir-fort.png or https://..."
                              value={placeForm.hero_image}
                              onChange={(e) => setPlaceForm({ ...placeForm, hero_image: e.target.value })}
                              style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                            {placeForm.hero_image && (
                              <img
                                src={placeForm.hero_image}
                                alt="Hero preview"
                                style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Must be a root-relative path (e.g. /assets/destinations/...) or an absolute HTTP/HTTPS URL.
                          </span>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                            Gallery Image URLs (One URL per line)
                          </label>
                          <textarea
                            rows={3}
                            placeholder="https://example.com/photo1.jpg&#10;/assets/destinations/photo2.jpg"
                            value={placeForm.gallery_images_text}
                            onChange={(e) => setPlaceForm({ ...placeForm, gallery_images_text: e.target.value })}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem', fontFamily: 'monospace' }}
                          />
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            Separate multiple photo URLs with line breaks.
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Primary Source / Citation Name
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Maharashtra Tourism Gazetteer / ASI Report"
                              value={placeForm.source_name}
                              onChange={(e) => setPlaceForm({ ...placeForm, source_name: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Source Verification URL
                            </label>
                            <input
                              type="url"
                              placeholder="https://asi.nic.in/..."
                              value={placeForm.source_url}
                              onChange={(e) => setPlaceForm({ ...placeForm, source_url: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Source Category / Type
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Official Gazetteer / Field Survey"
                              value={placeForm.source_type}
                              onChange={(e) => setPlaceForm({ ...placeForm, source_type: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                              Last Verified Date
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 2025-01-15"
                              value={placeForm.last_verified_at}
                              onChange={(e) => setPlaceForm({ ...placeForm, last_verified_at: e.target.value })}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.88rem' }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                )}
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#FAFAF7'
              }}>
                <button
                  type="button"
                  onClick={() => setPlaceModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  {lang === 'mr' ? 'रद्द करा' : 'Cancel'}
                </button>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {/* Step buttons */}
                  {modalTab !== 'basic' && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs = ['basic', 'content', 'location', 'practical', 'media'];
                        const idx = tabs.indexOf(modalTab);
                        if (idx > 0) setModalTab(tabs[idx - 1]);
                      }}
                      style={{
                        padding: '8px 14px',
                        fontSize: '0.82rem',
                        border: '1px solid var(--border-light)',
                        borderRadius: '4px',
                        background: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      ← {lang === 'mr' ? 'मागे' : 'Back'}
                    </button>
                  )}

                  {modalTab !== 'media' && (
                    <button
                      type="button"
                      onClick={() => {
                        const tabs = ['basic', 'content', 'location', 'practical', 'media'];
                        const idx = tabs.indexOf(modalTab);
                        if (idx < tabs.length - 1) setModalTab(tabs[idx + 1]);
                      }}
                      style={{
                        padding: '8px 14px',
                        fontSize: '0.82rem',
                        border: '1px solid var(--border-light)',
                        borderRadius: '4px',
                        background: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      {lang === 'mr' ? 'पुढे' : 'Next'} →
                    </button>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    form="place-form"
                    disabled={modalSubmitting || modalLoading}
                    className="btn-primary"
                    style={{
                      padding: '9px 20px',
                      fontSize: '0.88rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      opacity: modalSubmitting || modalLoading ? 0.7 : 1,
                      cursor: modalSubmitting || modalLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Check size={16} />
                    <span>
                      {modalSubmitting
                        ? (lang === 'mr' ? 'जतन करत आहे...' : 'Saving...')
                        : (modalMode === 'add'
                          ? (lang === 'mr' ? 'स्थळ जतन व प्रकाशित करा' : 'Save & Publish Destination')
                          : (lang === 'mr' ? 'बदल जतन करा' : 'Save Changes'))}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
