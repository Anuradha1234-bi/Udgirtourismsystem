import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { PlaceCard } from '../components/PlaceCard';
import { InteractiveMap } from '../components/InteractiveMap';
import { siteConfig } from '../config/siteConfig';
import {
  Compass, ShieldCheck, MapPin, ArrowRight,
  Landmark, Trees, BookOpen, Utensils, Calendar,
  Sparkles, CheckCircle2, ChevronRight, Phone, Mail,
  MessageCircle, User
} from 'lucide-react';

export const HomePage = () => {
  const { lang, t } = useLanguage();
  const [featuredPlaces, setFeaturedPlaces] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [itineraries, setItineraries] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [placesRes, catsRes, itinRes, galRes] = await Promise.all([
          api.getPlaces(),
          api.getCategories(),
          api.getItineraries(),
          api.getGallery()
        ]);
        setAllPlaces(placesRes);
        setFeaturedPlaces(placesRes.filter((p) => p.is_featured));
        setCategories(catsRes);
        setItineraries(itinRes);
        setGalleryImages(galRes.slice(0, 4));
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(rgba(16, 47, 41, 0.75), rgba(16, 47, 41, 0.85)), url(https://upload.wikimedia.org/wikipedia/commons/2/29/Udgir_Fort.jpg) center/cover no-repeat',
        color: 'var(--white)',
        padding: '80px 0'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '860px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(198, 161, 91, 0.2)',
            border: '1px solid rgba(198, 161, 91, 0.5)',
            padding: '6px 18px',
            borderRadius: 'var(--radius-full)',
            color: 'var(--golden-accent)',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '24px'
          }}>
            <ShieldCheck size={16} />
            {t.hero.verifiedNote}
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '20px',
            textShadow: '0 4px 20px rgba(0,0,0,0.4)'
          }}>
            {t.hero.title}
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(247, 243, 233, 0.9)',
            lineHeight: 1.6,
            marginBottom: '36px',
            maxWidth: '740px',
            margin: '0 auto 36px auto'
          }}>
            {t.hero.subtitle}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            <Link to="/places" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              <Compass size={18} />
              <span>{t.hero.exploreBtn}</span>
            </Link>
            <Link to="/itineraries" className="btn-outline-white" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              <Calendar size={18} />
              <span>{t.hero.planBtn}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section style={{ padding: '80px 0', background: 'var(--warm-cream)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{lang === 'mr' ? 'प्रमुख पर्यटन स्थळे' : 'Iconic Landmarks'}</span>
            <h2 className="section-title">{t.sections.featuredTitle}</h2>
            <p className="section-subtitle">{t.sections.featuredSubtitle}</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            marginBottom: '40px'
          }}>
            {featuredPlaces.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/places" className="btn-secondary">
              <span>{t.sections.viewAllPlaces}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Explore by Category */}
      <section style={{ padding: '80px 0', background: 'var(--white)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{lang === 'mr' ? 'पर्यटन प्रकार' : 'Categories'}</span>
            <h2 className="section-title">{t.sections.categoriesTitle}</h2>
            <p className="section-subtitle">{t.sections.categoriesSubtitle}</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px'
          }}>
            {categories.filter((c) => c.slug !== 'nearby' && c.slug !== 'other').map((cat) => {
              const catTitle = lang === 'mr' ? cat.name_mr : cat.name_en;
              const catDesc = lang === 'mr' ? cat.description_mr : cat.description_en;
              return (
                <Link
                  key={cat.id}
                  to={`/places?category=${cat.slug}`}
                  style={{
                    background: 'var(--warm-cream)',
                    borderRadius: 'var(--radius-md)',
                    padding: '30px 24px',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'var(--golden-accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                  }}
                >
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: 'var(--forest-green)',
                    color: 'var(--golden-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {cat.slug === 'historical' && <Landmark size={24} />}
                    {cat.slug === 'nature' && <Trees size={24} />}
                    {cat.slug === 'religious' && <Compass size={24} />}
                    {cat.slug === 'cultural' && <BookOpen size={24} />}
                  </div>
                  <h3 style={{ color: 'var(--forest-green)', fontSize: '1.2rem', fontWeight: 700 }}>{catTitle}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>{catDesc}</p>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--golden-accent)', fontWeight: 600, fontSize: '0.85rem' }}>
                    <span>{lang === 'mr' ? 'पहा' : 'Explore'}</span>
                    <ChevronRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* About & Why Visit Udgir */}
      <section style={{ padding: '90px 0', background: 'var(--warm-cream)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '50px',
            alignItems: 'center'
          }}>
            <div>
              <span className="section-tag">{t.sections.aboutTitle}</span>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--forest-green)', fontWeight: 800, marginBottom: '20px', lineHeight: 1.25 }}>
                {lang === 'mr' ? 'दख्खनच्या शौर्य आणि अध्यात्माची ऐतिहासिक भूमी' : 'Where Deccan History Meets Serene Living Heritage'}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '16px' }}>
                {lang === 'mr'
                  ? 'उदगीर हे लातूर जिल्ह्यातील एक ऐतिहासिक शहर असून ते प्राचीन काळापासून राजकीय, सांस्कृतिक आणि व्यापारी केंद्र राहिले आहे. संत उदयगिरी महाराजांच्या वास्तव्याने पावन झालेल्या या भूमीला १७६० च्या ऐतिहासिक उदगीर लढाईमुळे मराठ्यांच्या लष्करी वैभवाचे सर्वोच्च स्थान प्राप्त झाले.'
                  : 'Udgir is a historically renowned city situated on the Balaghat plateau in Latur District, Maharashtra. Named after the revered 12th-century ascetic Saint Udaygiri Baba, Udgir achieved legendary status in 1760 when the Maratha forces led by Sadashivrao Bhau triumphed over the Nizam in the decisive Battle of Udgir.'}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '28px' }}>
                {lang === 'mr'
                  ? 'आज उदगीर हे ऐतिहासिक किल्ले, हत्तीबेटचे समृद्ध पर्यावरण संवर्धन आणि राष्ट्रपतींच्या हस्ते उद्घाटन झालेल्या विश्वशांती बुद्ध विहारासह सर्वसमावेशक पर्यटनाचा आदर्श नमुना बनले आहे.'
                  : 'Today, Udgir seamlessly integrates medieval fortification, community-led ecological regeneration at Hattibet, and contemporary spiritual peace with the landmark Vishwashanti Buddha Vihar.'}
              </p>
              <Link to="/history" className="btn-secondary">
                <span>{lang === 'mr' ? 'सविस्तर इतिहास वाचा' : 'Read Full History'}</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Why Visit Feature Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                background: 'var(--white)',
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                gap: '16px'
              }}>
                <div style={{ color: 'var(--golden-accent)', marginTop: '2px' }}><CheckCircle2 size={24} /></div>
                <div>
                  <h4 style={{ color: 'var(--forest-green)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                    {lang === 'mr' ? 'ऐतिहासिक वारसा व अद्वितीय भुईकोट किल्ला' : 'Authentic Medieval Fortification'}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                    {lang === 'mr'
                      ? '४० फूट खोल खंदक आणि ६० फूट खोल भुयारी समाधी असणारा वैशिष्ट्यपूर्ण भुईकोट किल्ला.'
                      : 'Explore a unique 40-foot defensive moat and descend 60 feet into the underground rock cavern.'}
                  </p>
                </div>
              </div>

              <div style={{
                background: 'var(--white)',
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                gap: '16px'
              }}>
                <div style={{ color: 'var(--golden-accent)', marginTop: '2px' }}><CheckCircle2 size={24} /></div>
                <div>
                  <h4 style={{ color: 'var(--forest-green)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                    {lang === 'mr' ? 'हत्तीबेट - लोकसहभागातून निसर्ग संवर्धन' : 'Hattibet - Eco-Tourism & Ancient Caves'}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                    {lang === 'mr'
                      ? 'एकेकाळी उजाड असणारी ४१ हेक्टरची टेकडी लोकसहभागाने हरित वनात परावर्तित - उदगीरचे मिनी माथेरान.'
                      : '41 hectares of community-reforested slopes, natural springs, and caves in the Balaghat range.'}
                  </p>
                </div>
              </div>

              <div style={{
                background: 'var(--white)',
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                gap: '16px'
              }}>
                <div style={{ color: 'var(--golden-accent)', marginTop: '2px' }}><CheckCircle2 size={24} /></div>
                <div>
                  <h4 style={{ color: 'var(--forest-green)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                    {lang === 'mr' ? 'विश्वशांती बुद्ध विहार - आधुनिक शांततेचे प्रतीक' : 'Vishwashanti Buddha Vihar (2024)'}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                    {lang === 'mr'
                      ? 'सांची स्तूपाच्या तोरणावर आधारित प्रवेशद्वार आणि १०.५ फुटांची भगवान बुद्धांची कांस्यमूर्ती.'
                      : 'Inaugurated by President Droupadi Murmu, featuring a Sanchi gateway and 10.5 ft Buddha statue.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Teaser */}
      <section style={{ padding: '80px 0', background: 'var(--white)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{lang === 'mr' ? 'भौगोलिक दर्शन' : 'Interactive Map'}</span>
            <h2 className="section-title">{t.sections.mapTitle}</h2>
            <p className="section-subtitle">{t.sections.mapSubtitle}</p>
          </div>

          <InteractiveMap places={allPlaces} height="480px" showControls={true} />

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <Link to="/map" className="btn-secondary">
              <span>{t.sections.openFullMap}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Suggested Itineraries Preview */}
      <section style={{ padding: '80px 0', background: 'var(--warm-cream)', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{lang === 'mr' ? 'सफर नियोजन' : 'Trip Planning'}</span>
            <h2 className="section-title">{t.sections.itinerariesTitle}</h2>
            <p className="section-subtitle">{t.sections.itinerariesSubtitle}</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {itineraries.slice(0, 3).map((it) => (
              <div
                key={it.id}
                style={{
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  padding: '30px',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                <div style={{
                  display: 'inline-block',
                  alignSelf: 'flex-start',
                  background: 'rgba(198, 161, 91, 0.15)',
                  color: 'var(--golden-hover)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  {it.duration_type === '1_day' ? (lang === 'mr' ? '१-दिवस' : '1 Day') : (lang === 'mr' ? '२-दिवस' : '2 Days')}
                </div>
                <h3 style={{ color: 'var(--forest-green)', fontSize: '1.25rem', fontWeight: 700 }}>
                  {lang === 'mr' ? it.title_mr : it.title_en}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, flex: 1 }}>
                  {lang === 'mr' ? it.description_mr : it.description_en}
                </p>
                <Link
                  to="/itineraries"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--forest-green)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    marginTop: 'auto'
                  }}
                >
                  <span>{lang === 'mr' ? 'आराखडा पाहा' : 'View Schedule'}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/itineraries" className="btn-primary">
              <span>{t.sections.viewAllItineraries}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Visitor Assistance / Trip Coordinator Callout */}
      <section style={{ padding: '70px 0', background: 'var(--surface-alt)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-light)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '36px',
            alignItems: 'center'
          }}>
            <div>
              <span className="section-tag">{lang === 'mr' ? 'अभ्यागत सहाय्य' : 'Visitor Assistance'}</span>
              <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 800, color: 'var(--forest-green)', marginBottom: '12px' }}>
                {lang === 'mr' ? 'उदगीर पर्यटन नियोजनात सहाय्य हवे आहे का?' : 'Need Help Planning Your Udgir Trip?'}
              </h2>
              <p style={{ color: 'var(--text-dark)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '20px' }}>
                {lang === 'mr'
                  ? 'आमच्या अभ्यागत सहाय्य समन्वयकांशी थेट संपर्क साधा. उदगीर किल्ला, हत्तीबेट आणि विश्वशांती बुद्ध विहाराच्या भेटीचे नियोजन, स्थानिक रस्ते व प्रवासाच्या वेळेबद्दल विनामूल्य मार्गदर्शन मिळवा.'
                  : 'Get in touch with our visitor coordinator for factual guidance, itinerary planning, local route directions, and temple/monument timings in Udgir.'}
              </p>
              <div style={{
                background: 'var(--warm-cream)',
                padding: '12px 18px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                borderLeft: '3px solid var(--golden-accent)'
              }}>
                <strong>{lang === 'mr' ? 'महत्त्वाची नोंद:' : 'Truth Disclosure:'}</strong>{' '}
                {lang === 'mr'
                  ? 'अनुराधा बिरादार या \'एक्सप्लोर उदगीर\' संकेतस्थळाचे व्यवस्थापन करतात. त्या शासकीय अधिकारी किंवा एमटीडीसी प्रमाणित गाईड नसून माहिती सहाय्य पुरवतात.'
                  : 'Anuradha Biradar manages the Explore Udgir portal as an independent visitor coordinator. She is not a government officer or certified MTDC tour guide.'}
              </div>
            </div>

            {/* Profile Card */}
            <div style={{
              background: 'var(--surface-alt)',
              padding: '28px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(198, 161, 91, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'var(--forest-green)',
                  color: 'var(--golden-accent)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--forest-green)' }}>
                    {lang === 'mr' ? siteConfig.guide.nameMr : siteConfig.guide.name}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--golden-hover)', fontWeight: 600 }}>
                    {lang === 'mr' ? siteConfig.guide.roleMr : siteConfig.guide.roleEn}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {lang === 'mr' ? siteConfig.guide.capacityMr : siteConfig.guide.capacityEn}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-dark)', marginTop: '8px' }}>
                <a
                  href={`tel:${siteConfig.guide.phoneTel}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--forest-green)', fontWeight: 600, textDecoration: 'none' }}
                >
                  <Phone size={16} color="var(--golden-accent)" />
                  <span>{siteConfig.guide.phoneDisplay}</span>
                </a>
                <a
                  href={`mailto:${siteConfig.guide.email}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: 'var(--forest-green)', fontWeight: 600, textDecoration: 'none' }}
                >
                  <Mail size={16} color="var(--golden-accent)" />
                  <span>{siteConfig.guide.email}</span>
                </a>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px' }}>
                <a
                  href={siteConfig.guide.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{
                    background: '#25D366',
                    borderColor: '#25D366',
                    color: '#FFFFFF',
                    padding: '10px 20px',
                    fontSize: '0.88rem'
                  }}
                >
                  <MessageCircle size={16} />
                  <span>{lang === 'mr' ? 'व्हॉट्सॲपवर चॅट करा' : 'Chat on WhatsApp'}</span>
                </a>

                <a
                  href={`tel:${siteConfig.guide.phoneTel}`}
                  className="btn-secondary"
                  style={{ padding: '10px 20px', fontSize: '0.88rem' }}
                >
                  <Phone size={15} />
                  <span>{lang === 'mr' ? 'कॉल करा' : 'Call Now'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Preview */}
      <section style={{ padding: '80px 0', background: 'var(--white)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{lang === 'mr' ? 'छायाचित्रे' : 'Photo Gallery'}</span>
            <h2 className="section-title">{t.sections.galleryTitle}</h2>
            <p className="section-subtitle">{t.sections.gallerySubtitle}</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            marginBottom: '36px'
          }}>
            {galleryImages.map((img) => (
              <div
                key={img.id}
                style={{
                  position: 'relative',
                  height: '240px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)'
                }}
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
                  background: 'linear-gradient(transparent 50%, rgba(16, 47, 41, 0.9))',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '16px',
                  color: 'var(--white)'
                }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                    {lang === 'mr' ? img.title_mr : img.title_en}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/gallery" className="btn-secondary">
              <span>{lang === 'mr' ? 'सर्व छायाचित्रे पाहा' : 'Browse Full Gallery'}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
