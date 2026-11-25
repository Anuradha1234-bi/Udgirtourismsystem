import React, { useEffect, useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { VerificationBadge } from '../components/VerificationBadge';
import {
  Hotel as HotelIcon, Utensils, MapPin, Phone,
  Clock, ExternalLink, Leaf, AlertCircle, Search,
  Star, Filter, ArrowUpDown, ShieldCheck, CheckCircle, Info
} from 'lucide-react';

export const HotelsPage = () => {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('restaurants'); // default to restaurants directory
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [pureVegOnly, setPureVegOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating_desc'); // rating_desc | reviews_desc | name_asc
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [hotelsRes, restRes] = await Promise.all([
          api.getHotels({ search: searchQuery }),
          api.getRestaurants({ search: searchQuery })
        ]);
        setHotels(hotelsRes);
        setRestaurants(restRes);
      } catch (err) {
        console.error('Error loading hotels and dining:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [searchQuery]);

  // Categories for restaurants
  const restaurantCategories = useMemo(() => {
    const cats = new Set(restaurants.map((r) => r.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [restaurants]);

  // Filtered and sorted restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter((r) => {
        if (pureVegOnly && !r.is_pure_veg) return false;
        if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = r.name_en.toLowerCase().includes(q) || r.name_mr.toLowerCase().includes(q);
          const matchCuisine = r.cuisine_type_en.toLowerCase().includes(q) || r.cuisine_type_mr.toLowerCase().includes(q);
          const matchAddress = r.address_en.toLowerCase().includes(q) || r.address_mr.toLowerCase().includes(q);
          if (!matchName && !matchCuisine && !matchAddress) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating_desc') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'reviews_desc') {
          return (b.review_count || 0) - (a.review_count || 0);
        }
        if (sortBy === 'name_asc') {
          return a.name_en.localeCompare(b.name_en);
        }
        return 0;
      });
  }, [restaurants, pureVegOnly, selectedCategory, sortBy, searchQuery]);

  // Filtered and sorted hotels
  const filteredHotels = useMemo(() => {
    return hotels
      .filter((h) => {
        if (selectedCategory !== 'all' && h.category !== selectedCategory) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = h.name_en.toLowerCase().includes(q) || h.name_mr.toLowerCase().includes(q);
          const matchAddress = h.address_en.toLowerCase().includes(q) || h.address_mr.toLowerCase().includes(q);
          if (!matchName && !matchAddress) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating_desc') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'name_asc') {
          return a.name_en.localeCompare(b.name_en);
        }
        return 0;
      });
  }, [hotels, selectedCategory, sortBy, searchQuery]);

  const hotelCategories = useMemo(() => {
    const cats = new Set(hotels.map((h) => h.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [hotels]);

  return (
    <div style={{ padding: '60px 0 100px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 30px auto' }}>
          <span className="section-tag">{lang === 'mr' ? 'निवास व भोजन मार्गदर्शक' : 'Dining & Accommodation Guide'}</span>
          <h1 className="section-title">
            {lang === 'mr' ? 'उदगीरमधील रेस्टॉरंट्स व हॉटेल्स' : 'Restaurants & Hotels in Udgir'}
          </h1>
          <p className="section-subtitle">
            {lang === 'mr'
              ? 'उदगीर शहरातील १६ प्रमुख भोजनालये आणि निवास व्यवस्थेची सत्यनिष्ठ पडताळणी सूची. सर्व रेटिंग्स व पुनरावलोकने सार्वजनिक नोंदीनुसार (नोव्हेंबर २०२४).'
              : 'Verified 16-restaurant dining directory and accommodation guide in Udgir. All rating figures and review counts captured from user-supplied public listings.'}
          </p>
        </div>

        {/* Verification Policy Alert */}
        <div style={{
          background: 'var(--warm-cream)',
          border: '1px solid var(--golden-accent)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 22px',
          marginBottom: '36px',
          display: 'flex',
          gap: '14px',
          alignItems: 'center'
        }}>
          <ShieldCheck size={24} color="var(--forest-green)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)', lineHeight: 1.6 }}>
            <strong>{lang === 'mr' ? 'वस्तुनिष्ठता व शून्य बनावट माहिती धोरण:' : 'Zero-Fabrication Truth Policy:'}</strong>{' '}
            {lang === 'mr'
              ? 'येथील रेटिंग आणि पुनरावलोकने युझर-सप्लाय नोंदीनुसार दर्शवली असून त्यांची प्रत्यक्ष पडताळणी प्रलंबित आहे (Needs verification). ज्या ठिकाणांचे अधिकृत फोन नंबर किंवा दर उपलब्ध नाहीत, तिथे काल्पनिक आकडे न टाकता \'माहिती असत्यापित\' असे स्पष्ट नमूद केले आहे.'
              : 'Ratings and review counts are based on captured user-supplied listings (Nov 2024 / Needs verification). Unverified phone numbers, menus, and prices are strictly labeled \'Information not verified\' rather than fabricated.'}
          </div>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div style={{
          background: 'var(--white)',
          padding: '24px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-light)',
          marginBottom: '32px'
        }}>
          {/* Main Tabs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setActiveTab('restaurants'); setSelectedCategory('all'); }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: '1px solid',
                  borderColor: activeTab === 'restaurants' ? 'var(--forest-green)' : 'var(--border-light)',
                  background: activeTab === 'restaurants' ? 'var(--forest-green)' : 'transparent',
                  color: activeTab === 'restaurants' ? 'var(--white)' : 'var(--text-dark)',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <Utensils size={18} />
                <span>{lang === 'mr' ? 'रेस्टॉरंट्स (१६)' : 'Restaurants (16)'}</span>
                <span style={{
                  background: activeTab === 'restaurants' ? 'var(--golden-accent)' : 'var(--warm-cream)',
                  color: activeTab === 'restaurants' ? 'var(--deep-green)' : 'var(--text-muted)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  {restaurants.length}
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('hotels'); setSelectedCategory('all'); }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: '1px solid',
                  borderColor: activeTab === 'hotels' ? 'var(--forest-green)' : 'var(--border-light)',
                  background: activeTab === 'hotels' ? 'var(--forest-green)' : 'transparent',
                  color: activeTab === 'hotels' ? 'var(--white)' : 'var(--text-dark)',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <HotelIcon size={18} />
                <span>{lang === 'mr' ? 'हॉटेल्स व लॉजेस' : 'Hotels & Lodges'}</span>
                <span style={{
                  background: activeTab === 'hotels' ? 'var(--golden-accent)' : 'var(--warm-cream)',
                  color: activeTab === 'hotels' ? 'var(--deep-green)' : 'var(--text-muted)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  {hotels.length}
                </span>
              </button>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '260px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'mr' ? 'नाव, ठिकाण किंवा पदार्थ शोधा...' : 'Search by name, cuisine or address...'}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  fontFamily: 'inherit',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Secondary Filters Bar: Category, Veg Toggle & Sort */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            {/* Category Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Filter size={14} />
                {lang === 'mr' ? 'श्रेणी:' : 'Category:'}
              </span>

              {(activeTab === 'restaurants' ? restaurantCategories : hotelCategories).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: selectedCategory === cat ? 'var(--forest-green)' : 'var(--border-light)',
                    background: selectedCategory === cat ? 'var(--forest-green)' : 'var(--surface-alt)',
                    color: selectedCategory === cat ? 'var(--white)' : 'var(--text-dark)',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  {cat === 'all'
                    ? (lang === 'mr' ? 'सर्व' : 'All')
                    : cat}
                </button>
              ))}
            </div>

            {/* Right side controls: Veg Filter & Sort */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
              {activeTab === 'restaurants' && (
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#1B5E20',
                  background: '#E8F5E9',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid #C8E6C9'
                }}>
                  <input
                    type="checkbox"
                    checked={pureVegOnly}
                    onChange={(e) => setPureVegOnly(e.target.checked)}
                    style={{ accentColor: '#1B5E20', width: '16px', height: '16px' }}
                  />
                  <Leaf size={15} />
                  <span>{lang === 'mr' ? 'केवळ शुद्ध शाकाहारी' : 'Pure Veg Only'}</span>
                </label>
              )}

              {/* Sort By Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowUpDown size={14} color="var(--golden-hover)" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.82rem',
                    fontFamily: 'inherit',
                    background: 'var(--white)',
                    outline: 'none',
                    fontWeight: 600,
                    color: 'var(--text-dark)'
                  }}
                >
                  <option value="rating_desc">{lang === 'mr' ? 'रेटिंग (उच्च ते कमी)' : 'Highest Rated (★)'}</option>
                  {activeTab === 'restaurants' && (
                    <option value="reviews_desc">{lang === 'mr' ? 'सर्वाधिक पुनरावलोकने' : 'Most Reviews'}</option>
                  )}
                  <option value="name_asc">{lang === 'mr' ? 'नाव (A ते Z)' : 'Name (A-Z)'}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content Listings */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            {lang === 'mr' ? 'माहिती लोड होत आहे...' : 'Loading listings...'}
          </div>
        ) : activeTab === 'restaurants' ? (
          <div>
            <div style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {lang === 'mr'
                ? `एकूण ${filteredRestaurants.length} रेस्टॉरंट्स दाखवत आहे`
                : `Showing ${filteredRestaurants.length} restaurants matching filters`}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '26px' }}>
              {filteredRestaurants.map((rest) => (
                <div
                  key={rest.id}
                  style={{
                    background: 'var(--white)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'var(--transition)'
                  }}
                >
                  {/* Card Header & Banner */}
                  <div style={{ position: 'relative', height: '170px' }}>
                    <img
                      src={rest.image_url || '/assets/hotels/placeholder-restaurant.svg'}
                      alt={lang === 'mr' ? rest.name_mr : rest.name_en}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/hotels/placeholder-restaurant.svg';
                      }}
                    />

                    {/* Veg / Non-Veg Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: rest.is_pure_veg ? '#1B5E20' : '#B71C1C',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.25)'
                    }}>
                      <span>{rest.is_pure_veg ? '🌱 Pure Veg' : '🍗 Non-Veg / Multi'}</span>
                    </div>

                    {/* Category Tag */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(16, 47, 41, 0.9)',
                      color: 'var(--golden-accent)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid rgba(198, 161, 91, 0.4)'
                    }}>
                      {rest.category}
                    </div>

                    {/* Rating Pill overlay */}
                    {rest.rating && (
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        background: '#FFFFFF',
                        color: '#1B5E20',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}>
                        <Star size={14} fill="#FBC02D" color="#FBC02D" />
                        <span>{rest.rating.toFixed(1)}</span>
                        {rest.review_count && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                            ({rest.review_count})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' }}>
                    <div>
                      <h3 style={{ color: 'var(--forest-green)', fontSize: '1.25rem', fontWeight: 800 }}>
                        {lang === 'mr' ? rest.name_mr : rest.name_en}
                      </h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--golden-hover)', fontWeight: 600, marginTop: '2px' }}>
                        {lang === 'mr' ? rest.cuisine_type_mr : rest.cuisine_type_en}
                      </div>
                    </div>

                    {/* Address with location pin */}
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <MapPin size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--golden-hover)' }} />
                      <span>{lang === 'mr' ? rest.address_mr : rest.address_en}</span>
                    </div>

                    {/* Popular dishes if available */}
                    {rest.popular_dishes_en && (
                      <div style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-dark)',
                        background: 'var(--warm-cream)',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        lineHeight: 1.5
                      }}>
                        <strong>{lang === 'mr' ? 'प्रसिद्ध पदार्थ:' : 'Popular Items:'}</strong>{' '}
                        {lang === 'mr' ? rest.popular_dishes_mr : rest.popular_dishes_en}
                      </div>
                    )}

                    {/* Facilities if available */}
                    {rest.facilities_en && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <strong>{lang === 'mr' ? 'सुविधा:' : 'Features:'}</strong>{' '}
                        {lang === 'mr' ? rest.facilities_mr : rest.facilities_en}
                      </div>
                    )}

                    {/* Source & verification disclosure tag */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      background: 'var(--surface-alt)',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      <Info size={12} color="var(--golden-hover)" />
                      <span>{rest.rating_source || 'Captured Nov 2024 (Needs verification)'}</span>
                    </div>

                    {/* Footer Actions: Safe directions & Call button */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.85rem',
                      marginTop: 'auto',
                      paddingTop: '14px',
                      borderTop: '1px solid var(--border-light)'
                    }}>
                      <div>
                        {rest.price_range ? (
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--forest-green)' }}>
                            {rest.price_range}
                          </span>
                        ) : (
                          <span className="badge-unverified" style={{ fontSize: '0.72rem' }}>
                            {t.badges.notVerified}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        {rest.contact_number ? (
                          <a
                            href={`tel:${rest.contact_number}`}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            <Phone size={13} />
                            <span>{t.hotelsPage.callNow}</span>
                          </a>
                        ) : null}

                        {rest.google_maps_url && (
                          <a
                            href={rest.google_maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                          >
                            <ExternalLink size={13} />
                            <span>{t.hotelsPage.mapsLink}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Hotels / Accommodation Directory */
          <div>
            <div style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {lang === 'mr'
                ? `एकूण ${filteredHotels.length} निवास पर्याय दाखवत आहे`
                : `Showing ${filteredHotels.length} accommodation listings matching filters`}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '26px' }}>
              {filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  style={{
                    background: 'var(--white)',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'var(--transition)'
                  }}
                >
                  {/* Card Header Image */}
                  <div style={{ position: 'relative', height: '170px' }}>
                    <img
                      src={hotel.image_url || '/assets/hotels/placeholder-hotel.svg'}
                      alt={lang === 'mr' ? hotel.name_mr : hotel.name_en}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/hotels/placeholder-hotel.svg';
                      }}
                    />

                    {/* Category Tag */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(16, 47, 41, 0.9)',
                      color: 'var(--golden-accent)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid rgba(198, 161, 91, 0.4)'
                    }}>
                      {hotel.category}
                    </div>

                    {/* Verification status badge */}
                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                      <VerificationBadge status={hotel.verification_status} />
                    </div>

                    {/* Rating Pill overlay if present */}
                    {hotel.rating && (
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        background: '#FFFFFF',
                        color: '#1B5E20',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}>
                        <Star size={14} fill="#FBC02D" color="#FBC02D" />
                        <span>{hotel.rating.toFixed(1)}</span>
                        {hotel.review_count && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                            ({hotel.review_count})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, gap: '12px' }}>
                    <div>
                      <h3 style={{ color: 'var(--forest-green)', fontSize: '1.25rem', fontWeight: 800 }}>
                        {lang === 'mr' ? hotel.name_mr : hotel.name_en}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--golden-hover)', fontWeight: 600 }}>
                        {hotel.category === 'Lodge' ? (lang === 'mr' ? 'लॉजिंग व्यवस्था' : 'Lodge Accommodation') : (lang === 'mr' ? 'हॉटेल' : 'Hotel')}
                      </div>
                    </div>

                    {/* Address with location pin */}
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <MapPin size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--golden-hover)' }} />
                      <span>{lang === 'mr' ? hotel.address_mr : hotel.address_en}</span>
                    </div>

                    {/* Facilities if available */}
                    {hotel.facilities_en && (
                      <div style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-dark)',
                        background: 'var(--warm-cream)',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        lineHeight: 1.5
                      }}>
                        <strong>{t.hotelsPage.facilities}:</strong>{' '}
                        {lang === 'mr' ? hotel.facilities_mr : hotel.facilities_en}
                      </div>
                    )}

                    {/* Price Range */}
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <strong>{t.hotelsPage.priceRange}:</strong>{' '}
                      {hotel.price_range && hotel.price_range !== 'Information not verified' ? (
                        <span style={{ fontWeight: 600, color: 'var(--forest-green)' }}>{hotel.price_range}</span>
                      ) : (
                        <span className="badge-unverified" style={{ fontSize: '0.72rem' }}>
                          {t.badges.notVerified}
                        </span>
                      )}
                    </div>

                    {/* Footer Actions: Safe directions & Call button */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.85rem',
                      marginTop: 'auto',
                      paddingTop: '14px',
                      borderTop: '1px solid var(--border-light)'
                    }}>
                      <div>
                        {hotel.contact_number ? (
                          <span style={{ fontSize: '0.78rem', color: 'var(--forest-green)', fontWeight: 600 }}>
                            📞 {hotel.contact_number}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {lang === 'mr' ? 'फोन: उपलब्ध नाही' : 'Phone unverified'}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        {hotel.contact_number ? (
                          <a
                            href={`tel:${hotel.contact_number}`}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            <Phone size={13} />
                            <span>{t.hotelsPage.callNow}</span>
                          </a>
                        ) : null}

                        {hotel.google_maps_url && (
                          <a
                            href={hotel.google_maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary"
                            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                          >
                            <ExternalLink size={13} />
                            <span>{t.hotelsPage.mapsLink}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informational Disclaimer Footer */}
        <div style={{
          marginTop: '60px',
          padding: '24px',
          background: 'var(--white)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start'
        }}>
          <AlertCircle size={22} color="var(--golden-hover)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <strong>{lang === 'mr' ? 'महत्त्वाची सूचना:' : 'Listing Verification Disclaimer:'}</strong>{' '}
            {lang === 'mr'
              ? 'हे संकेतस्थळ कोणत्याही रेस्टॉरंट किंवा लॉजचे व्यावसायिक प्रमोशन करत नाही. ही सूची केवळ उदगीरमध्ये येणाऱ्या पर्यटकांच्या सोयीसाठी संकलित केलेली आहे. हॉटेलचे प्रत्यक्ष दर, रूम उपलब्धता आणि जेवणाची वेळ यांसाठी पर्यटकांनी प्रत्यक्ष चौकशी करावी.'
              : 'Explore Udgir is a non-commercial visitor portal. Business listings are provided for informational orientation. Room availability, tariffs, and food menus should be verified directly with the establishments.'}
          </div>
        </div>
      </div>
    </div>
  );
};
