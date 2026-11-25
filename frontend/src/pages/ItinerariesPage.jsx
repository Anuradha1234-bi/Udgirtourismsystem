import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Calendar, Clock, MapPin, Compass, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ItinerariesPage = () => {
  const { lang, t } = useLanguage();
  const [itineraries, setItineraries] = useState([]);
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItineraries() {
      try {
        const data = await api.getItineraries();
        setItineraries(data);
        if (data.length > 0) {
          setSelectedItineraryId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load itineraries:', err);
      } finally {
        setLoading(false);
      }
    }
    loadItineraries();
  }, []);

  const activeItinerary = itineraries.find((it) => it.id === selectedItineraryId);

  return (
    <div style={{ padding: '60px 0 100px 0' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="section-tag">{lang === 'mr' ? 'प्रवास नियोजन' : 'Trip Itineraries'}</span>
          <h1 className="section-title">{t.itinerariesPage.pageTitle}</h1>
          <p className="section-subtitle">{t.itinerariesPage.pageSubtitle}</p>
        </div>

        {/* Disclaimer Callout */}
        <div style={{
          background: '#FFF8E1',
          padding: '16px 20px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid #FFE082',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          marginBottom: '36px',
          fontSize: '0.88rem',
          color: '#5D4037'
        }}>
          <AlertCircle size={20} color="#E65100" style={{ flexShrink: 0 }} />
          <div>{t.itinerariesPage.disclaimer}</div>
        </div>

        {/* Tabs for Itineraries */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '40px',
          justifyContent: 'center'
        }}>
          {itineraries.map((it) => (
            <button
              key={it.id}
              onClick={() => setSelectedItineraryId(it.id)}
              style={{
                padding: '12px 24px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.92rem',
                border: '1.5px solid',
                borderColor: selectedItineraryId === it.id ? 'var(--forest-green)' : 'var(--border-light)',
                background: selectedItineraryId === it.id ? 'var(--forest-green)' : 'var(--white)',
                color: selectedItineraryId === it.id ? 'var(--white)' : 'var(--text-dark)',
                boxShadow: selectedItineraryId === it.id ? 'var(--shadow-md)' : 'none',
                transition: 'var(--transition)'
              }}
            >
              {lang === 'mr' ? it.title_mr : it.title_en}
            </button>
          ))}
        </div>

        {/* Active Itinerary Details */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            {lang === 'mr' ? 'आराखडा लोड होत आहे...' : 'Loading itineraries...'}
          </div>
        ) : activeItinerary ? (
          <div>
            {/* Overview Card */}
            <div style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              padding: '36px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '40px'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                <span style={{
                  background: 'rgba(198, 161, 91, 0.2)',
                  color: 'var(--golden-hover)',
                  padding: '4px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 800
                }}>
                  {activeItinerary.duration_type === '1_day'
                    ? (lang === 'mr' ? '१-दिवसीय आराखडा' : '1-Day Itinerary')
                    : activeItinerary.duration_type === '2_days'
                    ? (lang === 'mr' ? '२-दिवसीय परिपूर्ण आराखडा' : '2-Day Itinerary')
                    : (lang === 'mr' ? 'संकल्पना सफर' : 'Themed Circuit')}
                </span>
              </div>

              <h2 style={{ color: 'var(--forest-green)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '14px' }}>
                {lang === 'mr' ? activeItinerary.title_mr : activeItinerary.title_en}
              </h2>

              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '20px' }}>
                {lang === 'mr' ? activeItinerary.description_mr : activeItinerary.description_en}
              </p>

              {activeItinerary.overview_en && (
                <div style={{
                  background: 'var(--warm-cream)',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  color: 'var(--text-dark)',
                  fontWeight: 600
                }}>
                  📌 {lang === 'mr' ? activeItinerary.overview_mr : activeItinerary.overview_en}
                </div>
              )}
            </div>

            {/* Timeline Steps */}
            <div style={{ position: 'relative', paddingLeft: '28px' }}>
              {/* Vertical connector line */}
              <div style={{
                position: 'absolute',
                left: '11px',
                top: '20px',
                bottom: '20px',
                width: '2px',
                background: 'var(--golden-accent)'
              }}></div>

              {activeItinerary.items.map((step, idx) => (
                <div key={step.id} style={{ position: 'relative', marginBottom: '32px' }}>
                  {/* Step Marker Dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-28px',
                    top: '6px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'var(--forest-green)',
                    color: 'var(--golden-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    boxShadow: '0 0 0 4px var(--warm-cream)'
                  }}>
                    {idx + 1}
                  </div>

                  {/* Step Card */}
                  <div style={{
                    background: 'var(--white)',
                    borderRadius: 'var(--radius-md)',
                    padding: '28px',
                    border: '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--golden-hover)',
                        fontSize: '0.85rem',
                        fontWeight: 700
                      }}>
                        <Clock size={14} />
                        <span>{lang === 'mr' ? step.time_slot_mr : step.time_slot_en}</span>
                      </span>

                      {step.day_number > 1 && (
                        <span style={{
                          background: 'var(--warm-cream)',
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: 'var(--forest-green)'
                        }}>
                          {lang === 'mr' ? `दिवस ${step.day_number}` : `Day ${step.day_number}`}
                        </span>
                      )}
                    </div>

                    <h3 style={{ color: 'var(--forest-green)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px' }}>
                      {lang === 'mr' ? step.activity_title_mr : step.activity_title_en}
                    </h3>

                    <p style={{ color: 'var(--text-dark)', fontSize: '0.94rem', lineHeight: 1.7, marginBottom: '16px' }}>
                      {lang === 'mr' ? step.description_mr : step.description_en}
                    </p>

                    {step.travel_tips_en && (
                      <div style={{
                        background: 'var(--surface-alt)',
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)'
                      }}>
                        💡 <strong>{t.itinerariesPage.tipsHeader}:</strong> {lang === 'mr' ? step.travel_tips_mr : step.travel_tips_en}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
