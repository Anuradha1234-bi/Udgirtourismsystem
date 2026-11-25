import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { VerificationBadge } from '../components/VerificationBadge';
import {
  MapPin, Clock, Ticket, Accessibility, Sparkles,
  Info, ExternalLink, Calendar, ShieldCheck, Compass,
  ArrowLeft, CheckCircle2, AlertCircle, Share2
} from 'lucide-react';

export const PlaceDetailPage = () => {
  const { slug } = useParams();
  const { lang, t } = useLanguage();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPlace() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getPlaceBySlug(slug);
        setPlace(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPlace();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0', color: 'var(--text-muted)' }}>
        {lang === 'mr' ? 'माहिती लोड होत आहे...' : 'Loading destination details...'}
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2 style={{ color: 'var(--forest-green)', marginBottom: '16px' }}>
          {lang === 'mr' ? 'पर्यटन स्थळ आढळले नाही' : 'Destination Not Found'}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          {lang === 'mr' ? 'विनंती केलेले पर्यटन स्थळ उपलब्ध नाही.' : 'The requested destination could not be found or has been moved.'}
        </p>
        <Link to="/places" className="btn-secondary">
          {t.placeDetail.backToPlaces}
        </Link>
      </div>
    );
  }

  const title = lang === 'mr' ? place.name_mr : place.name_en;
  const subtitle = lang === 'mr' ? place.tagline_mr : place.tagline_en;
  const description = lang === 'mr' ? place.description_mr : place.description_en;
  const history = lang === 'mr' ? place.history_mr : place.history_en;
  const culture = lang === 'mr' ? place.culture_mr : place.culture_en;
  const highlights = lang === 'mr' ? place.highlights_mr : place.highlights_en;
  const address = lang === 'mr' ? place.address_mr : place.address_en;
  const openingHours = lang === 'mr' ? place.opening_hours_mr : place.opening_hours_en;
  const entryFee = lang === 'mr' ? place.entry_fee_mr : place.entry_fee_en;
  const facilities = lang === 'mr' ? place.facilities_mr : place.facilities_en;
  const accessibility = lang === 'mr' ? place.accessibility_info_mr : place.accessibility_info_en;
  const travelTips = lang === 'mr' ? place.travel_tips_mr : place.travel_tips_en;

  const googleMapsUrl = place.google_maps_url || (place.latitude && place.longitude ? `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}` : null);

  return (
    <div style={{ paddingBottom: '100px' }}>
      {/* Breadcrumb & Hero Header */}
      <div style={{
        position: 'relative',
        minHeight: '440px',
        display: 'flex',
        alignItems: 'flex-end',
        background: `linear-gradient(rgba(16, 47, 41, 0.4), rgba(16, 47, 41, 0.9)), url(${place.hero_image}) center/cover no-repeat`,
        color: 'var(--white)',
        padding: '60px 0'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <Link
            to="/places"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--golden-accent)',
              fontSize: '0.88rem',
              fontWeight: 600,
              marginBottom: '20px'
            }}
          >
            <ArrowLeft size={16} />
            <span>{t.placeDetail.backToPlaces}</span>
          </Link>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
            <VerificationBadge status={place.verification_status} />
            <span style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              📍 {place.distance_from_udgir_km === 0 ? (lang === 'mr' ? 'उदगीर शहर' : 'Udgir City Center') : `${place.distance_from_udgir_km} km ${lang === 'mr' ? 'उदगीरहून' : 'from Udgir'}`}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, marginBottom: '8px', lineHeight: 1.2 }}>
            {title}
          </h1>

          {/* Bilingual alternative sub-heading */}
          <div style={{ fontSize: '1.25rem', color: 'var(--golden-accent)', fontWeight: 600, marginBottom: '12px' }}>
            {lang === 'mr' ? place.name_en : place.name_mr}
          </div>

          {subtitle && (
            <p style={{ color: 'rgba(247, 243, 233, 0.9)', fontSize: '1.05rem', maxWidth: '780px' }}>
              {subtitle}
            </p>
          )}

          {place.hero_image && place.hero_image.includes('placeholder-monument') && (
            <div style={{
              marginTop: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(198, 161, 91, 0.2)',
              border: '1px solid var(--golden-accent)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              color: 'var(--golden-accent)',
              fontWeight: 600
            }}>
              <span>📷 {lang === 'mr' ? 'अस्सल छायाचित्र लवकरच उपलब्ध होईल (असंबंधीत किंवा बनावट छायाचित्रे न वापरण्याचे धोरण)' : 'Authentic photograph coming soon (Strict anti-stock truth policy)'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container" style={{ marginTop: '50px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Left Column: Descriptions, History, Highlights, Sources */}
          <div>
            {/* Overview */}
            <div style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              padding: '36px',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-light)',
              marginBottom: '32px'
            }}>
              <h2 style={{ color: 'var(--forest-green)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>
                {t.placeDetail.overview}
              </h2>
              <p style={{ color: 'var(--text-dark)', fontSize: '1rem', lineHeight: 1.8 }}>
                {description}
              </p>
            </div>

            {/* Historical Background */}
            {history && (
              <div style={{
                background: 'var(--white)',
                borderRadius: 'var(--radius-md)',
                padding: '36px',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)',
                marginBottom: '32px'
              }}>
                <h2 style={{ color: 'var(--forest-green)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>
                  {t.placeDetail.history}
                </h2>
                <p style={{ color: 'var(--text-dark)', fontSize: '1rem', lineHeight: 1.8 }}>
                  {history}
                </p>
              </div>
            )}

            {/* Cultural Context */}
            {culture && (
              <div style={{
                background: 'var(--white)',
                borderRadius: 'var(--radius-md)',
                padding: '36px',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)',
                marginBottom: '32px'
              }}>
                <h2 style={{ color: 'var(--forest-green)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>
                  {t.placeDetail.culture}
                </h2>
                <p style={{ color: 'var(--text-dark)', fontSize: '1rem', lineHeight: 1.8 }}>
                  {culture}
                </p>
              </div>
            )}

            {/* Key Highlights */}
            {highlights && (
              <div style={{
                background: 'var(--surface-alt)',
                borderRadius: 'var(--radius-md)',
                padding: '36px',
                border: '1px solid var(--border-light)',
                marginBottom: '32px'
              }}>
                <h2 style={{ color: 'var(--forest-green)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>
                  {t.placeDetail.highlights}
                </h2>
                <div style={{ color: 'var(--text-dark)', fontSize: '0.98rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {highlights}
                </div>
              </div>
            )}

            {/* Image Gallery */}
            {place.images && place.images.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ color: 'var(--forest-green)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px' }}>
                  {lang === 'mr' ? 'छायाचित्र दालन' : 'Photo Gallery'}
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '16px'
                }}>
                  {place.images.map((img) => (
                    <div key={img.id} style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                      <img src={img.image_url} alt={img.caption_en} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                      <div style={{ padding: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <div>{lang === 'mr' ? img.caption_mr : img.caption_en}</div>
                        {img.attribution && <div style={{ fontSize: '0.72rem', fontStyle: 'italic', marginTop: '4px' }}>© {img.attribution} ({img.license})</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Source References & Audit Trail */}
            <div style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              padding: '30px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--forest-green)' }}>
                <ShieldCheck size={20} color="var(--golden-accent)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{t.placeDetail.sources}</h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {lang === 'mr'
                  ? 'एक्सप्लोर उदगीर केवळ अधिकृत शासकीय गॅझेटिअर, पुरातत्व नोंदी आणि प्रत्यक्ष पडताळणीवर आधारित माहिती प्रकाशित करते.'
                  : 'Every factual assertion in Explore Udgir is audited against authentic public registers, archaeological publications, and field verifications.'}
              </p>

              {place.source_references && place.source_references.length > 0 ? (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {place.source_references.map((src) => (
                    <li key={src.id} style={{ padding: '10px 14px', background: 'var(--warm-cream)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--forest-green)' }}>{src.source_name} ({src.source_type})</div>
                      {src.verification_notes && <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>{src.verification_notes}</div>}
                      {src.source_url && (
                        <a href={src.source_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--golden-hover)', marginTop: '4px', fontWeight: 600 }}>
                          <span>{lang === 'mr' ? 'मूळ संदर्भ पाहा' : 'View Source'}</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {place.source_name || (lang === 'mr' ? 'जिल्हा पर्यटन व स्थानिक नोंद' : 'District Administration Tourism Records')}
                </div>
              )}

              {place.last_verified_at && (
                <div style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                  {t.placeDetail.lastVerified}: <strong>{place.last_verified_at}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Practical Details Card */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              padding: '28px',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-light)'
            }}>
              <h3 style={{ color: 'var(--forest-green)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                {t.placeDetail.practicalInfo}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '0.9rem' }}>
                {/* Address */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--golden-hover)', fontWeight: 700, marginBottom: '4px' }}>
                    <MapPin size={16} />
                    <span>{t.placeDetail.address}</span>
                  </div>
                  <div style={{ color: 'var(--text-dark)' }}>{address}</div>
                </div>

                {/* Distance */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--golden-hover)', fontWeight: 700, marginBottom: '4px' }}>
                    <Compass size={16} />
                    <span>{t.placeDetail.distance}</span>
                  </div>
                  <div style={{ color: 'var(--text-dark)' }}>
                    {place.distance_from_udgir_km === 0
                      ? (lang === 'mr' ? 'उदगीर शहर केंद्र' : 'Within Udgir City')
                      : `${place.distance_from_udgir_km} km`}
                  </div>
                </div>

                {/* Opening Hours */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--golden-hover)', fontWeight: 700, marginBottom: '4px' }}>
                    <Clock size={16} />
                    <span>{t.placeDetail.openingHours}</span>
                  </div>
                  {openingHours ? (
                    <div style={{ color: 'var(--text-dark)' }}>{openingHours}</div>
                  ) : (
                    <span className="badge-unverified">{t.badges.notVerified}</span>
                  )}
                </div>

                {/* Entry Fee */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--golden-hover)', fontWeight: 700, marginBottom: '4px' }}>
                    <Ticket size={16} />
                    <span>{t.placeDetail.entryFee}</span>
                  </div>
                  {entryFee ? (
                    <div style={{ color: 'var(--text-dark)' }}>{entryFee}</div>
                  ) : (
                    <span className="badge-unverified">{t.badges.notVerified}</span>
                  )}
                </div>

                {/* Facilities */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--golden-hover)', fontWeight: 700, marginBottom: '4px' }}>
                    <Info size={16} />
                    <span>{t.placeDetail.facilities}</span>
                  </div>
                  {facilities ? (
                    <div style={{ color: 'var(--text-dark)' }}>{facilities}</div>
                  ) : (
                    <span className="badge-unverified">{t.badges.notVerified}</span>
                  )}
                </div>

                {/* Accessibility */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--golden-hover)', fontWeight: 700, marginBottom: '4px' }}>
                    <Accessibility size={16} />
                    <span>{t.placeDetail.accessibility}</span>
                  </div>
                  {accessibility ? (
                    <div style={{ color: 'var(--text-dark)' }}>{accessibility}</div>
                  ) : (
                    <span className="badge-unverified">{t.badges.notVerified}</span>
                  )}
                </div>

                {/* Coordinates */}
                {place.latitude && place.longitude && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--golden-hover)', fontWeight: 700, marginBottom: '4px' }}>
                      <MapPin size={16} />
                      <span>GPS Coordinates</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {place.latitude.toFixed(4)}° N, {place.longitude.toFixed(4)}° E
                      {place.is_coordinates_approximate && (
                        <div style={{ color: '#C62828', fontSize: '0.78rem', marginTop: '2px' }}>
                          * {t.badges.approxCoordinates}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Travel Tips */}
                {travelTips && (
                  <div style={{ background: 'var(--warm-cream)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--forest-green)', marginBottom: '6px', fontSize: '0.85rem' }}>
                      💡 {t.placeDetail.travelTips}
                    </div>
                    <div style={{ color: 'var(--text-dark)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                      {travelTips}
                    </div>
                  </div>
                )}

                {/* Google Maps Directions Button */}
                {googleMapsUrl && (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ width: '100%', padding: '12px', marginTop: '8px' }}
                  >
                    <ExternalLink size={16} />
                    <span>{t.placeDetail.getDirections}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
