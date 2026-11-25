import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { PlaceCard } from '../components/PlaceCard';
import { Search, Filter, SlidersHorizontal, MapPin, RefreshCw } from 'lucide-react';

export const PlacesPage = () => {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeCategory = searchParams.get('category') || '';
  const activeSearch = searchParams.get('search') || '';
  const activeLocation = searchParams.get('location') || 'all'; // all, udgir, nearby
  const activeSort = searchParams.get('sort') || 'default';

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [catsRes] = await Promise.all([api.getCategories()]);
        setCategories(catsRes);

        const params = {};
        if (activeCategory) params.category = activeCategory;
        if (activeSearch) params.search = activeSearch;
        if (activeLocation === 'udgir') params.is_nearby = false;
        if (activeLocation === 'nearby') params.is_nearby = true;
        if (activeSort) params.sort_by = activeSort;

        const placesRes = await api.getPlaces(params);
        setPlaces(placesRes);
      } catch (err) {
        console.error('Error fetching places:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeCategory, activeSearch, activeLocation, activeSort]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  return (
    <div style={{ padding: '60px 0 100px 0' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px auto' }}>
          <span className="section-tag">{lang === 'mr' ? 'पर्यटन स्थळे' : 'Tourist Destinations'}</span>
          <h1 className="section-title">
            {lang === 'mr' ? 'उदगीर आणि परिसरातील पर्यटन स्थळे' : 'Discover Destinations in Udgir'}
          </h1>
          <p className="section-subtitle">
            {lang === 'mr'
              ? 'ऐतिहासिक किल्ले, निसर्गरम्य हत्तीबेट, अध्यात्मिक मंदिरे आणि परिसरातील वारसा स्थळांची पडताळणीकृत माहिती'
              : 'Verified tourism guide to forts, nature hills, spiritual centers, and regional heritage across Udgir'}
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div style={{
          background: 'var(--white)',
          padding: '24px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--border-light)',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            alignItems: 'center'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={activeSearch}
                onChange={(e) => updateParam('search', e.target.value)}
                placeholder={t.filters.searchPlaceholder}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <select
                value={activeCategory}
                onChange={(e) => updateParam('category', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  background: 'var(--white)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">{t.filters.allCategories}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {lang === 'mr' ? c.name_mr : c.name_en}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <select
                value={activeLocation}
                onChange={(e) => updateParam('location', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  background: 'var(--white)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="all">{t.filters.allLocations}</option>
                <option value="udgir">{t.filters.udgirOnly}</option>
                <option value="nearby">{t.filters.nearbyOnly}</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                value={activeSort}
                onChange={(e) => updateParam('sort', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  background: 'var(--white)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="default">{t.filters.sortDefault}</option>
                <option value="name">{t.filters.sortName}</option>
                <option value="distance">{t.filters.sortDistance}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontWeight: 600 }}>
            {lang === 'mr' ? `एकूण ${places.length} पर्यटन स्थळे सापडली` : `Showing ${places.length} destinations`}
          </div>
          {(activeCategory || activeSearch || activeLocation !== 'all' || activeSort !== 'default') && (
            <button
              onClick={handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--golden-hover)',
                fontSize: '0.88rem',
                fontWeight: 600
              }}
            >
              <RefreshCw size={14} />
              <span>{t.filters.resetFilters}</span>
            </button>
          )}
        </div>

        {/* Grid or Empty State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            {lang === 'mr' ? 'पर्यटन स्थळे लोड होत आहेत...' : 'Loading destinations...'}
          </div>
        ) : places.length === 0 ? (
          <div style={{
            background: 'var(--white)',
            padding: '60px 20px',
            textAlign: 'center',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)'
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '20px' }}>
              {t.filters.noResults}
            </p>
            <button onClick={handleReset} className="btn-secondary">
              {t.filters.resetFilters}
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
