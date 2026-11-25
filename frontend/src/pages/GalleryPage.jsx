import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { X, ExternalLink, ShieldCheck, Image as ImageIcon } from 'lucide-react';

export const GalleryPage = () => {
  const { lang, t } = useLanguage();
  const [images, setImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeModalImage, setActiveModalImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      setLoading(true);
      try {
        const data = await api.getGallery(activeCategory);
        setImages(data);
      } catch (err) {
        console.error('Failed to load gallery images:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, [activeCategory]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveModalImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories = [
    { id: 'All', label: t.galleryPage.filterAll },
    { id: 'Fort', label: t.galleryPage.filterFort },
    { id: 'Nature', label: t.galleryPage.filterNature },
    { id: 'Religious', label: t.galleryPage.filterReligious },
    { id: 'Culture', label: t.galleryPage.filterCulture }
  ];

  return (
    <div style={{ padding: '60px 0 100px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px auto' }}>
          <span className="section-tag">{lang === 'mr' ? 'छायाचित्र दालन' : 'Photo Gallery'}</span>
          <h1 className="section-title">{t.galleryPage.pageTitle}</h1>
          <p className="section-subtitle">{t.galleryPage.pageSubtitle}</p>
        </div>

        {/* Filter Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '40px'
        }}>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.88rem',
                border: '1px solid',
                borderColor: activeCategory === c.id ? 'var(--forest-green)' : 'var(--border-light)',
                background: activeCategory === c.id ? 'var(--forest-green)' : 'var(--white)',
                color: activeCategory === c.id ? 'var(--white)' : 'var(--text-dark)',
                boxShadow: activeCategory === c.id ? 'var(--shadow-sm)' : 'none',
                transition: 'var(--transition)'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            {lang === 'mr' ? 'छायाचित्रे लोड होत आहेत...' : 'Loading images...'}
          </div>
        ) : images.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            {lang === 'mr' ? 'या विभागात कोणतीही छायाचित्रे उपलब्ध नाहीत.' : 'No images found in this category.'}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => setActiveModalImage(img)}
                style={{
                  position: 'relative',
                  height: '260px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src={img.image_url}
                  alt={lang === 'mr' ? img.title_mr : img.title_en}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(transparent 40%, rgba(16, 47, 41, 0.95))',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '20px',
                  color: 'var(--white)'
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--golden-accent)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                    {img.category}
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3 }}>
                    {lang === 'mr' ? img.title_mr : img.title_en}
                  </h3>
                  {img.attribution && (
                    <div style={{ fontSize: '0.72rem', color: 'rgba(247, 243, 233, 0.75)', marginTop: '4px', fontStyle: 'italic' }}>
                      © {img.attribution}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {activeModalImage && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 2000,
              background: 'rgba(16, 47, 41, 0.92)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
            onClick={() => setActiveModalImage(null)}
          >
            <div
              style={{
                background: 'var(--white)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalImage(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  zIndex: 10,
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ maxHeight: '60vh', overflow: 'hidden', background: '#000' }}>
                <img
                  src={activeModalImage.image_url}
                  alt={lang === 'mr' ? activeModalImage.title_mr : activeModalImage.title_en}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              <div style={{ padding: '24px', overflowY: 'auto' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--golden-hover)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {activeModalImage.category}
                </span>
                <h3 style={{ color: 'var(--forest-green)', fontSize: '1.4rem', fontWeight: 700, margin: '6px 0 10px 0' }}>
                  {lang === 'mr' ? activeModalImage.title_mr : activeModalImage.title_en}
                </h3>
                <p style={{ color: 'var(--text-dark)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '16px' }}>
                  {lang === 'mr' ? activeModalImage.description_mr : activeModalImage.description_en}
                </p>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '20px',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '12px'
                }}>
                  {activeModalImage.attribution && (
                    <div>
                      <strong>{t.galleryPage.attributionLabel}:</strong> {activeModalImage.attribution}
                    </div>
                  )}
                  {activeModalImage.license && (
                    <div>
                      <strong>{t.galleryPage.licenseLabel}:</strong> {activeModalImage.license}
                    </div>
                  )}
                  {activeModalImage.source_url && (
                    <a
                      href={activeModalImage.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--golden-hover)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                    >
                      <span>{lang === 'mr' ? 'मूळ फाईल पहा' : 'View Source'}</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
