import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { InteractiveMap } from '../components/InteractiveMap';
import { MapPin, Navigation, Info, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MapPage = () => {
  const { lang, t } = useLanguage();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlaces() {
      try {
        const data = await api.getPlaces();
        setPlaces(data);
      } catch (err) {
        console.error('Failed to load map places:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlaces();
  }, []);

  return (
    <div style={{ padding: '60px 0 100px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px auto' }}>
          <span className="section-tag">{lang === 'mr' ? 'नकाशा दर्शन' : 'Geographic Explorer'}</span>
          <h1 className="section-title">{t.mapPage.pageTitle}</h1>
          <p className="section-subtitle">{t.mapPage.pageSubtitle}</p>
        </div>

        {/* Map Notice */}
        <div style={{
          background: 'var(--white)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-light)',
          marginBottom: '24px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          fontSize: '0.88rem',
          color: 'var(--text-muted)'
        }}>
          <Info size={18} color="var(--golden-hover)" style={{ flexShrink: 0 }} />
          <div>{t.mapPage.gpsNote}</div>
        </div>

        {/* Full Map Component */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
            {lang === 'mr' ? 'नकाशा लोड होत आहे...' : 'Loading interactive map...'}
          </div>
        ) : (
          <InteractiveMap places={places} height="650px" showControls={true} />
        )}

        {/* Legend Card */}
        <div style={{
          marginTop: '36px',
          background: 'var(--white)',
          padding: '24px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h4 style={{ color: 'var(--forest-green)', fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>
              {t.mapPage.legend}
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#C6A15B' }}></span>
                <span>{lang === 'mr' ? 'ऐतिहासिक स्थळे' : 'Historical Places'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#2E7D32' }}></span>
                <span>{lang === 'mr' ? 'निसर्ग व टेकड्या' : 'Nature & Hills'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#E65100' }}></span>
                <span>{lang === 'mr' ? 'धार्मिक स्थळे' : 'Religious Places'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#6A1B9A' }}></span>
                <span>{lang === 'mr' ? 'सांस्कृतिक स्थळे' : 'Cultural Attractions'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#1565C0' }}></span>
                <span>{lang === 'mr' ? 'परिसरातील आकर्षणे' : 'Nearby Regional Attractions'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} color="var(--forest-green)" />
            <span>{lang === 'mr' ? 'ओपनस्ट्रीटमॅप व शासकीय नकाशा पडताळणी' : 'OpenStreetMap & Official Survey Verified'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
