import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { VerificationBadge } from './VerificationBadge';
import { MapPin, ArrowRight, Camera } from 'lucide-react';

export const PlaceCard = ({ place }) => {
  const { lang, t } = useLanguage();

  const title = lang === 'mr' ? place.name_mr : place.name_en;
  const description = lang === 'mr' ? place.description_mr : place.description_en;
  const categoryName = place.category
    ? (lang === 'mr' ? place.category.name_mr : place.category.name_en)
    : '';

  const isPendingPhoto = place.hero_image && place.hero_image.includes('placeholder-monument');

  return (
    <div className="place-card">
      <div className="place-card-image-wrap">
        <img
          src={place.hero_image}
          alt={title}
          className="place-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/assets/destinations/placeholder-monument.svg';
          }}
        />
        <div className="place-card-badge">
          <VerificationBadge status={place.verification_status} />
        </div>

        {isPendingPhoto && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'rgba(14, 35, 25, 0.92)',
            color: 'var(--golden-accent)',
            fontSize: '0.68rem',
            fontWeight: 700,
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(198, 161, 91, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Camera size={11} />
            <span>{lang === 'mr' ? 'अस्सल छायाचित्र लवकरच' : 'Authentic photo coming soon'}</span>
          </div>
        )}

        <div className="place-card-dist">
          <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />
          {place.distance_from_udgir_km === 0
            ? (lang === 'mr' ? 'उदगीर शहर' : 'Udgir City')
            : `${place.distance_from_udgir_km} km`}
        </div>
      </div>

      <div className="place-card-body">
        {categoryName && <div className="place-card-category">{categoryName}</div>}
        <h3 className="place-card-title">{title}</h3>
        <p className="place-card-desc">{description}</p>

        <Link
          to={`/places/${place.slug}`}
          className="btn-secondary"
          style={{ marginTop: 'auto', alignSelf: 'flex-start', fontSize: '0.88rem', padding: '8px 18px' }}
        >
          <span>{t.placeDetail.viewDetails}</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};
