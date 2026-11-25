import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { siteConfig } from '../config/siteConfig';
import {
  Compass,
  Menu,
  X,
  UserCheck,
  MessageCircle,
  ChevronRight,
  Landmark,
  UtensilsCrossed,
  Building2,
  Map as MapIcon,
  CalendarRange,
  Images,
  PhoneCall
} from 'lucide-react';

export const Navbar = () => {
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(() => {
    try {
      return (
        window.location.hash === '#menu' ||
        new URLSearchParams(window.location.search).get('menu') === 'open'
      );
    } catch (e) {
      return false;
    }
  });

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  // Close mobile drawer on route change (skip initial mount)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close on Escape key for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    {
      path: '/',
      label: t.nav.home,
      shortLabel: lang === 'mr' ? 'मुख्यपृष्ठ' : 'Home',
      icon: Compass,
    },
    {
      path: '/places',
      label: t.nav.places,
      shortLabel: lang === 'mr' ? 'पर्यटन स्थळे' : 'Places',
      icon: Landmark,
    },
    {
      path: '/history',
      label: t.nav.history,
      shortLabel: lang === 'mr' ? 'इतिहास' : 'History',
      icon: CalendarRange,
    },
    {
      path: '/food-culture',
      label: t.nav.food,
      shortLabel: lang === 'mr' ? 'खाद्यसंस्कृती' : 'Food & Culture',
      icon: UtensilsCrossed,
    },
    {
      path: '/hotels',
      label: t.nav.hotels,
      shortLabel: lang === 'mr' ? 'हॉटेल्स' : 'Hotels',
      icon: Building2,
    },
    {
      path: '/map',
      label: t.nav.map,
      shortLabel: lang === 'mr' ? 'नकाशा' : 'Map',
      icon: MapIcon,
    },
    {
      path: '/itineraries',
      label: t.nav.itineraries,
      shortLabel: lang === 'mr' ? 'सफर नियोजन' : 'Itineraries',
      icon: CalendarRange,
    },
    {
      path: '/gallery',
      label: t.nav.gallery,
      shortLabel: lang === 'mr' ? 'छायाचित्रे' : 'Gallery',
      icon: Images,
    },
    {
      path: '/about-contact',
      label: t.nav.contact,
      shortLabel: lang === 'mr' ? 'संपर्क' : 'Contact',
      icon: PhoneCall,
    },
  ];

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main Navigation">
        <div className="nav-container">
          {/* Brand Logo & Location Subtitle */}
          <Link to="/" className="brand-logo" onClick={closeMenu} aria-label="Explore Udgir Home">
            <div className="logo-mark" aria-hidden="true">
              <Compass size={20} />
            </div>
            <div className="brand-text">
              <span className="brand-name">{t.brand.name}</span>
              <span className="brand-location">
                {lang === 'mr' ? 'लातूर, महाराष्ट्र' : 'Udgir, Maharashtra'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={closeMenu}
                  title={item.label}
                >
                  {item.shortLabel || item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Nav Actions: Trip Help, Language Toggle, Admin & Mobile Hamburger */}
          <div className="nav-actions">
            {/* Quick WhatsApp Assistance */}
            <a
              href={siteConfig.guide.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-btn-trip-help"
              title={`${lang === 'mr' ? siteConfig.guide.roleMr : siteConfig.guide.roleEn}: ${siteConfig.guide.name} (${siteConfig.guide.phoneDisplay})`}
              aria-label={lang === 'mr' ? 'व्हॉट्सॲप पर्यटक सहाय्य' : 'WhatsApp Trip Help'}
            >
              <MessageCircle size={15} />
              <span>{lang === 'mr' ? 'सहाय्य' : 'Trip Help'}</span>
            </a>

            {/* Language Switcher */}
            <div className="lang-toggle desktop-lang" role="group" aria-label="Language Selector">
              <button
                type="button"
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
              >
                EN
              </button>
              <button
                type="button"
                className={`lang-btn ${lang === 'mr' ? 'active' : ''}`}
                onClick={() => setLang('mr')}
                aria-pressed={lang === 'mr'}
              >
                मराठी
              </button>
            </div>

            {/* Admin Portal Link */}
            <Link
              to="/admin/login"
              className="nav-admin-link"
              title={t.nav.admin}
              aria-label={t.nav.admin}
              onClick={closeMenu}
            >
              <UserCheck size={17} />
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer & Backdrop */}
      {mobileMenuOpen && (
        <>
          <div
            className="nav-backdrop"
            onClick={closeMenu}
            aria-hidden="true"
          />

          <div
            className="nav-drawer open"
            role="dialog"
            aria-label="Mobile Navigation"
          >
            <div className="drawer-header">
              <div className="drawer-title">
                {lang === 'mr' ? 'मार्गदर्शन मेनू' : 'Explore Menu'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="lang-toggle mobile-drawer-lang" role="group" aria-label="Language Selector">
                  <button
                    type="button"
                    className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                    onClick={() => setLang('en')}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    className={`lang-btn ${lang === 'mr' ? 'active' : ''}`}
                    onClick={() => setLang('mr')}
                  >
                    मराठी
                  </button>
                </div>
                <button
                  type="button"
                  className="drawer-close-btn"
                  onClick={closeMenu}
                  aria-label="Close navigation menu"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <ul className="drawer-links">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`drawer-link ${active ? 'active' : ''}`}
                      onClick={closeMenu}
                    >
                      <div className="drawer-link-content">
                        <Icon size={18} className="drawer-link-icon" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight size={16} className="drawer-link-arrow" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="drawer-footer">
              <a
                href={siteConfig.guide.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="drawer-btn-help"
                onClick={closeMenu}
              >
                <MessageCircle size={18} />
                <div className="drawer-btn-help-text">
                  <span className="drawer-btn-help-title">
                    {lang === 'mr' ? 'पर्यटक सहाय्य (व्हॉट्सॲप)' : 'WhatsApp Trip Help'}
                  </span>
                  <span className="drawer-btn-help-sub">
                    {siteConfig.guide.name} • {siteConfig.guide.phoneDisplay}
                  </span>
                </div>
              </a>

              <Link
                to="/admin/login"
                className="drawer-admin-link"
                onClick={closeMenu}
              >
                <UserCheck size={16} />
                <span>{t.nav.admin}</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};
