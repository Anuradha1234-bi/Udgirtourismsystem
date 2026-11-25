import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { siteConfig } from '../config/siteConfig';
import { Compass, Phone, ShieldCheck, Mail, MessageCircle, User } from 'lucide-react';

export const Footer = () => {
  const { lang, t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px', height: '36px', background: 'var(--golden-accent)',
                borderRadius: '6px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'var(--deep-green)'
              }}>
                <Compass size={20} />
              </div>
              <h3 style={{ color: 'var(--white)', fontSize: '1.25rem', fontWeight: 800 }}>{t.brand.name}</h3>
            </div>
            <p style={{ color: 'rgba(247, 243, 233, 0.75)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
              {t.brand.subtagline}
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(198, 161, 91, 0.25)',
              fontSize: '0.8rem',
              color: 'var(--golden-accent)'
            }}>
              <ShieldCheck size={16} />
              {lang === 'mr' ? 'वस्तुनिष्ठ व पडताळणीकृत माहिती' : 'Zero Synthetic Data Policy'}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-title">{t.footer.quickLinks}</h4>
            <ul className="footer-links">
              <li><Link to="/">{t.nav.home}</Link></li>
              <li><Link to="/places">{t.nav.places}</Link></li>
              <li><Link to="/history">{t.nav.history}</Link></li>
              <li><Link to="/food-culture">{t.nav.food}</Link></li>
              <li><Link to="/hotels">{t.nav.hotels}</Link></li>
              <li><Link to="/map">{t.nav.map}</Link></li>
              <li><Link to="/itineraries">{t.nav.itineraries}</Link></li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="footer-title">{t.footer.destinations}</h4>
            <ul className="footer-links">
              <li><Link to="/places/udgir-fort">{lang === 'mr' ? 'उदगीर किल्ला' : 'Udgir Fort'}</Link></li>
              <li><Link to="/places/hattibet-devarjan">{lang === 'mr' ? 'हत्तीबेट देवर्जन' : 'Hattibet-Devarjan'}</Link></li>
              <li><Link to="/places/vishwashanti-buddha-vihar">{lang === 'mr' ? 'विश्वशांती बुद्ध विहार' : 'Vishwashanti Buddha Vihar'}</Link></li>
              <li><Link to="/places/havagi-swami-math">{lang === 'mr' ? 'हावगीस्वामी मठ' : 'Havagi Swami Math'}</Link></li>
              <li><Link to="/places/dudhiya-hanuman-temple">{lang === 'mr' ? 'दुधिया हनुमान' : 'Dudhiya Hanuman'}</Link></li>
              <li><Link to="/places/ausa-fort">{lang === 'mr' ? 'औसा किल्ला' : 'Ausa Fort'}</Link></li>
            </ul>
          </div>

          {/* Guide & Visitor Assistance (Anuradha Biradar) */}
          <div>
            <h4 className="footer-title">{lang === 'mr' ? 'पर्यटक सहाय्य व मार्गदर्शन' : 'Visitor Assistance & Guide'}</h4>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(198, 161, 91, 0.3)',
              marginBottom: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--golden-accent)', fontWeight: 700, fontSize: '0.92rem', marginBottom: '4px' }}>
                <User size={15} />
                <span>{lang === 'mr' ? siteConfig.guide.nameMr : siteConfig.guide.name}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(247, 243, 233, 0.8)', marginBottom: '10px' }}>
                {lang === 'mr' ? siteConfig.guide.capacityMr : siteConfig.guide.capacityEn}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'rgba(247, 243, 233, 0.9)' }}>
                <a href={`tel:${siteConfig.guide.phoneTel}`} style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={12} color="var(--golden-accent)" />
                  <span>{siteConfig.guide.phoneDisplay}</span>
                </a>
                <a href={`mailto:${siteConfig.guide.email}`} style={{ color: 'inherit', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={12} color="var(--golden-accent)" />
                  <span>{siteConfig.guide.email}</span>
                </a>
              </div>

              <a
                href={siteConfig.guide.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#25D366',
                  color: '#FFFFFF',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  marginTop: '10px',
                  textDecoration: 'none'
                }}
              >
                <MessageCircle size={14} />
                <span>{lang === 'mr' ? 'व्हॉट्सॲपवर संपर्क' : 'Chat on WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Emergency Helplines Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          background: 'rgba(0, 0, 0, 0.25)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.82rem',
          color: 'rgba(247, 243, 233, 0.85)',
          marginBottom: '20px'
        }}>
          <div>
            <strong style={{ color: 'var(--golden-accent)' }}>{lang === 'mr' ? 'आपत्कालीन संपर्क:' : 'Emergency:'}</strong>{' '}
            {lang === 'mr' ? 'पोलीस: ११२ | रुग्णवाहिका: १०८ | बस स्थानक: ०२३८५-२५६१०२ | आपत्ती कक्ष: १०७७' : 'Police: 112 | Ambulance: 108 | Bus Stand: 02385-256102 | Disaster: 1077'}
          </div>
          <Link to="/about-contact" style={{ color: 'var(--golden-accent)', fontWeight: 600 }}>
            {lang === 'mr' ? 'सर्व संपर्क आणि अभिप्राय →' : 'All Contacts & Feedback →'}
          </Link>
        </div>

        {/* Legal Disclaimer & Bottom Bar */}
        <div style={{
          padding: '16px 20px',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem',
          color: 'rgba(247, 243, 233, 0.65)',
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          <strong>{t.contactPage.disclaimerTitle}:</strong> {t.contactPage.disclaimerText}
        </div>

        <div className="footer-bottom">
          <div>{t.footer.rights}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{t.footer.builtWith}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
