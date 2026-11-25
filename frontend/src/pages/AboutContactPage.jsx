import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { siteConfig } from '../config/siteConfig';
import {
  ShieldAlert, Send, Star, CheckCircle2,
  Phone, Mail, MapPin, AlertCircle, MessageSquare,
  MessageCircle, User
} from 'lucide-react';

export const AboutContactPage = () => {
  const { lang, t } = useLanguage();

  // Contact Form State
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState(null);

  // Feedback Form State
  const [feedbackData, setFeedbackData] = useState({
    name: '',
    email: '',
    rating: 5,
    visit_purpose: 'Family Vacation',
    destination_visited: 'Udgir Fort',
    comments: ''
  });
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactError(null);
    try {
      await api.submitContact(contactData);
      setContactSuccess(true);
      setContactData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setContactError(err.message);
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackSubmitting(true);
    setFeedbackError(null);
    try {
      await api.submitFeedback(feedbackData);
      setFeedbackSuccess(true);
      setFeedbackData({
        name: '',
        email: '',
        rating: 5,
        visit_purpose: 'Family Vacation',
        destination_visited: 'Udgir Fort',
        comments: ''
      });
    } catch (err) {
      setFeedbackError(err.message);
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '60px 0 100px 0' }}>
      <div className="container" style={{ maxWidth: '1040px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="section-tag">{lang === 'mr' ? 'माहिती व संपर्क' : 'About & Inquiries'}</span>
          <h1 className="section-title">{t.contactPage.pageTitle}</h1>
          <p className="section-subtitle">{t.contactPage.pageSubtitle}</p>
        </div>

        {/* About Section & Disclaimer */}
        <div style={{
          background: 'var(--white)',
          padding: '40px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '40px'
        }}>
          <h2 style={{ color: 'var(--forest-green)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '16px' }}>
            {lang === 'mr' ? 'एक्सप्लोर उदगीर उपक्रमाविषयी' : 'About Explore Udgir Initiative'}
          </h2>
          <p style={{ color: 'var(--text-dark)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '16px' }}>
            {t.contactPage.aboutText1}
          </p>
          <p style={{ color: 'var(--text-dark)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '28px' }}>
            {t.contactPage.aboutText2}
          </p>

          {/* Official Disclaimer */}
          <div style={{
            background: '#FFF3E0',
            padding: '20px 24px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #FFE0B2',
            display: 'flex',
            gap: '14px',
            alignItems: 'flex-start'
          }}>
            <ShieldAlert size={22} color="#E65100" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ color: '#E65100', fontSize: '0.98rem', fontWeight: 800, marginBottom: '6px' }}>
                {t.contactPage.disclaimerTitle}
              </h4>
              <p style={{ color: '#5D4037', fontSize: '0.88rem', lineHeight: 1.6 }}>
                {t.contactPage.disclaimerText}
              </p>
            </div>
          </div>
        </div>

        {/* Dedicated Guide & Webmaster Card: Anuradha Biradar */}
        <div id="visitor-guide" style={{
          background: 'linear-gradient(135deg, #1B3B2B 0%, #0E2319 100%)',
          color: 'var(--white)',
          padding: '36px 40px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid rgba(198, 161, 91, 0.4)',
          marginBottom: '40px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px',
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(198, 161, 91, 0.2)',
                color: 'var(--golden-accent)',
                padding: '4px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginBottom: '14px'
              }}>
                <User size={14} />
                <span>{lang === 'mr' ? 'वेबसाईट व्यवस्थापक व पर्यटक सहाय्य' : 'Website Manager & Visitor Guide'}</span>
              </div>

              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--white)', marginBottom: '4px' }}>
                {lang === 'mr' ? siteConfig.guide.nameMr : siteConfig.guide.name}
              </h2>
              <div style={{ color: 'var(--golden-accent)', fontWeight: 600, fontSize: '1rem', marginBottom: '14px' }}>
                {lang === 'mr' ? siteConfig.guide.roleMr : siteConfig.guide.roleEn}
              </div>

              <p style={{ color: 'rgba(247, 243, 233, 0.85)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '18px' }}>
                {lang === 'mr' ? siteConfig.guide.bioMr : siteConfig.guide.bioEn}
              </p>

              {/* Truth Disclosure */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                color: 'rgba(247, 243, 233, 0.75)',
                borderLeft: '3px solid var(--golden-accent)'
              }}>
                <strong>{lang === 'mr' ? 'पारदर्शकता टीप:' : 'Transparency Note:'}</strong>{' '}
                {lang === 'mr'
                  ? 'अनुराधा बिरादार या \'एक्सप्लोर उदगीर\' पोर्टलचे व्यवस्थापन करतात. त्या शासकीय अधिकारी किंवा एमटीडीसी अधिकारी नसून पर्यटकांसाठी माहिती सहाय्यक म्हणून कार्यरत आहेत.'
                  : 'Anuradha Biradar manages this independent tourism directory. She is not an official government representative or certified MTDC officer.'}
              </div>
            </div>

            {/* Direct Contact Actions */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '28px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(198, 161, 91, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--golden-accent)' }}>
                {lang === 'mr' ? 'थेट संपर्क पर्याय' : 'Direct Assistance Channels'}
              </h3>

              <a
                href={siteConfig.guide.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#25D366',
                  color: '#FFFFFF',
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(37, 211, 102, 0.35)'
                }}
              >
                <MessageCircle size={20} />
                <div>
                  <div>{lang === 'mr' ? 'व्हॉट्सॲपवर त्वरित चॅट करा' : 'Instant WhatsApp Assistance'}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.9 }}>+91 {siteConfig.guide.phoneRaw}</div>
                </div>
              </a>

              <a
                href={`tel:${siteConfig.guide.phoneTel}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--white)',
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Phone size={18} color="var(--golden-accent)" />
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(247, 243, 233, 0.7)' }}>{lang === 'mr' ? 'थेट कॉल' : 'Click to Call'}</div>
                  <div>{siteConfig.guide.phoneDisplay}</div>
                </div>
              </a>

              <a
                href={`mailto:${siteConfig.guide.email}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--white)',
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Mail size={18} color="var(--golden-accent)" />
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(247, 243, 233, 0.7)' }}>{lang === 'mr' ? 'ईमेल' : 'Email Inquiry'}</div>
                  <div style={{ wordBreak: 'break-all' }}>{siteConfig.guide.email}</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Public & Emergency Contacts */}
        <div style={{
          background: 'var(--surface-alt)',
          padding: '36px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          marginBottom: '50px'
        }}>
          <h3 style={{ color: 'var(--forest-green)', fontSize: '1.35rem', fontWeight: 800, marginBottom: '20px' }}>
            {t.contactPage.emergencyTitle}
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px'
          }}>
            <div style={{ background: 'var(--white)', padding: '18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ color: 'var(--golden-hover)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                {t.contactPage.policeUdgirCity}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--forest-green)' }}>
                02385 - 256133 / 112
              </div>
            </div>

            <div style={{ background: 'var(--white)', padding: '18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ color: 'var(--golden-hover)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                {t.contactPage.policeUdgirRural}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--forest-green)' }}>
                02385 - 256134 / 112
              </div>
            </div>

            <div style={{ background: 'var(--white)', padding: '18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ color: 'var(--golden-hover)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                {t.contactPage.ambulance}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--forest-green)' }}>
                108 / 102
              </div>
            </div>

            <div style={{ background: 'var(--white)', padding: '18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
              <div style={{ color: 'var(--golden-hover)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
                {t.contactPage.busStand}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--forest-green)' }}>
                02385 - 256102
              </div>
            </div>
          </div>
        </div>

        {/* Forms Grid: Contact Form & Visitor Feedback Form */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '40px'
        }}>
          {/* Contact Inquiry Form */}
          <div style={{
            background: 'var(--white)',
            padding: '36px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--forest-green)', marginBottom: '18px' }}>
              <MessageSquare size={22} color="var(--golden-accent)" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{t.contactPage.formTitle}</h3>
            </div>

            {contactSuccess && (
              <div style={{ padding: '14px', background: '#E8F5E9', color: '#1B5E20', borderRadius: 'var(--radius-sm)', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <CheckCircle2 size={18} />
                <span>{t.contactPage.successMsg}</span>
              </div>
            )}

            {contactError && (
              <div style={{ padding: '14px', background: '#FFEBEE', color: '#C62828', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                {contactError}
              </div>
            )}

            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
                  {t.contactPage.nameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={contactData.name}
                  onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'inherit', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
                  {t.contactPage.emailLabel} *
                </label>
                <input
                  type="email"
                  required
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'inherit', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
                  {t.contactPage.phoneLabel}
                </label>
                <input
                  type="text"
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'inherit', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
                  {t.contactPage.subjectLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={contactData.subject}
                  onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'inherit', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
                  {t.contactPage.messageLabel} *
                </label>
                <textarea
                  required
                  rows={4}
                  value={contactData.message}
                  onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'inherit', fontSize: '0.9rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={contactSubmitting}
                className="btn-primary"
                style={{ width: '100%', padding: '12px', marginTop: '6px' }}
              >
                <Send size={16} />
                <span>{contactSubmitting ? (lang === 'mr' ? 'पाठवत आहे...' : 'Sending...') : t.contactPage.submitBtn}</span>
              </button>
            </form>
          </div>

          {/* Visitor Feedback Form */}
          <div style={{
            background: 'var(--white)',
            padding: '36px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--forest-green)', marginBottom: '18px' }}>
              <Star size={22} color="var(--golden-accent)" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{t.contactPage.feedbackTitle}</h3>
            </div>

            {feedbackSuccess && (
              <div style={{ padding: '14px', background: '#E8F5E9', color: '#1B5E20', borderRadius: 'var(--radius-sm)', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <CheckCircle2 size={18} />
                <span>{t.contactPage.feedbackSuccess}</span>
              </div>
            )}

            {feedbackError && (
              <div style={{ padding: '14px', background: '#FFEBEE', color: '#C62828', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                {feedbackError}
              </div>
            )}

            <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
                  {t.contactPage.nameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={feedbackData.name}
                  onChange={(e) => setFeedbackData({ ...feedbackData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'inherit', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
                  {t.contactPage.emailLabel} *
                </label>
                <input
                  type="email"
                  required
                  value={feedbackData.email}
                  onChange={(e) => setFeedbackData({ ...feedbackData, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'inherit', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
                  {t.contactPage.ratingLabel}
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                      style={{ color: star <= feedbackData.rating ? '#F59E0B' : '#D1D5DB' }}
                    >
                      <Star size={26} fill={star <= feedbackData.rating ? '#F59E0B' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
                  {t.contactPage.destinationLabel}
                </label>
                <select
                  value={feedbackData.destination_visited}
                  onChange={(e) => setFeedbackData({ ...feedbackData, destination_visited: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'inherit', fontSize: '0.9rem', background: '#fff' }}
                >
                  <option value="Udgir Fort">{lang === 'mr' ? 'उदगीर किल्ला' : 'Udgir Fort'}</option>
                  <option value="Hattibet-Devarjan">{lang === 'mr' ? 'हत्तीबेट देवर्जन' : 'Hattibet-Devarjan'}</option>
                  <option value="Vishwashanti Buddha Vihar">{lang === 'mr' ? 'विश्वशांती बुद्ध विहार' : 'Vishwashanti Buddha Vihar'}</option>
                  <option value="Havagi Swami Math">{lang === 'mr' ? 'हावगीस्वामी मठ' : 'Havagi Swami Math'}</option>
                  <option value="Dudhiya Hanuman Temple">{lang === 'mr' ? 'दुधिया हनुमान मंदिर' : 'Dudhiya Hanuman Temple'}</option>
                  <option value="General Tourism">{lang === 'mr' ? 'एकूण उदगीर पर्यटन' : 'General Tourism Experience'}</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '6px' }}>
                  {t.contactPage.commentsLabel} *
                </label>
                <textarea
                  required
                  rows={4}
                  value={feedbackData.comments}
                  onChange={(e) => setFeedbackData({ ...feedbackData, comments: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontFamily: 'inherit', fontSize: '0.9rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={feedbackSubmitting}
                className="btn-secondary"
                style={{ width: '100%', padding: '12px', marginTop: '6px' }}
              >
                <span>{feedbackSubmitting ? (lang === 'mr' ? 'नोंदवत आहे...' : 'Submitting...') : t.contactPage.submitFeedbackBtn}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
