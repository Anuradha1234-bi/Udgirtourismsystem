import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage = () => {
  const { lang, t } = useLanguage();

  return (
    <div style={{ textAlign: 'center', padding: '120px 20px', minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: 'rgba(198, 161, 91, 0.2)',
        color: 'var(--forest-green)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <Compass size={36} />
      </div>

      <h1 style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--forest-green)', lineHeight: 1 }}>
        404
      </h1>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark)', margin: '12px 0 16px 0' }}>
        {lang === 'mr' ? 'पृष्ठ आढळले नाही' : 'Page Not Found'}
      </h2>

      <p style={{ color: 'var(--text-muted)', maxWidth: '440px', lineHeight: 1.6, marginBottom: '28px' }}>
        {lang === 'mr'
          ? 'आपण शोधत असलेले पृष्ठ उपलब्ध नाही किंवा बदलण्यात आले आहे. मुख्यपृष्ठावर परत जाण्यासाठी खालील बटणावर क्लिक करा.'
          : 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'}
      </p>

      <Link to="/" className="btn-primary">
        <Home size={16} />
        <span>{lang === 'mr' ? 'मुख्यपृष्ठावर जा' : 'Return to Home'}</span>
      </Link>
    </div>
  );
};
