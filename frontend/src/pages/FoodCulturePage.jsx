import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Utensils, Heart, Sparkles, AlertCircle, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FoodCulturePage = () => {
  const { lang, t } = useLanguage();

  const dishes = [
    {
      id: 'jowar-bhakri',
      title: t.foodPage.jowarTitle,
      desc: t.foodPage.jowarDesc,
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
      tag: lang === 'mr' ? 'प्रमुख पारंपरिक आहार' : 'Regional Staple'
    },
    {
      id: 'pithla-zunka',
      title: t.foodPage.pithlaTitle,
      desc: t.foodPage.pithlaDesc,
      image: '/assets/food/pithla-zunka.jpg',
      tag: lang === 'mr' ? 'झणझणीत मराठवाडी चव' : 'Classic Comfort'
    },
    {
      id: 'thecha-kharda',
      title: t.foodPage.thechaTitle,
      desc: t.foodPage.thechaDesc,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
      tag: lang === 'mr' ? 'अस्सल खर्डा' : 'Stone Pounded Relish'
    },
    {
      id: 'misal-pav',
      title: t.foodPage.misalTitle,
      desc: t.foodPage.misalDesc,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
      tag: lang === 'mr' ? 'सकाळचा लोकप्रिय नाष्टा' : 'Breakfast Favorite'
    },
    {
      id: 'puran-poli',
      title: t.foodPage.puranTitle,
      desc: t.foodPage.puranDesc,
      image: '/assets/food/puran-poli.jpg',
      tag: lang === 'mr' ? 'सणासुदीचा गोड नैवेद्य' : 'Festive Sweet'
    }
  ];

  return (
    <div style={{ padding: '60px 0 100px 0' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="section-tag">{lang === 'mr' ? 'खाद्य व परंपरा' : 'Gastronomy & Living Heritage'}</span>
          <h1 className="section-title">{t.foodPage.pageTitle}</h1>
          <p className="section-subtitle">{t.foodPage.pageSubtitle}</p>
        </div>

        {/* Fact-Checking Food Note */}
        <div style={{
          background: 'var(--white)',
          padding: '24px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          borderLeft: '4px solid var(--golden-accent)',
          marginBottom: '48px',
          display: 'flex',
          gap: '14px',
          alignItems: 'center'
        }}>
          <AlertCircle size={22} color="var(--golden-hover)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.92rem', color: 'var(--text-dark)', lineHeight: 1.6 }}>
            <strong>{lang === 'mr' ? 'वस्तुनिष्ठ नोंद:' : 'Culinary Accuracy Note:'}</strong>{' '}
            {lang === 'mr'
              ? 'उदगीरची खाद्यसंस्कृती ही विस्तीर्ण मराठवाडा पठाराच्या कृषी-परंपरेशी जोडलेली आहे. ज्वारीची भाकरी आणि पिठले हे पदार्थ संपूर्ण महाराष्ट्रात प्रिय असले तरी, येथील काळ्या मातीत पिकणाऱ्या ज्वारीची चव आणि अस्सल लसणी खर्डा-शेंगदाणा चटणीचे संयोजन हे स्थानिक आदरातिथ्याचे वैशिष्ट्य आहे.'
              : 'Traditional Maharashtrian dishes such as Jowar Bhakri, Pithla, and Zunka are regional staples shared across the Marathwada and Deccan agricultural belts. While widely savored throughout Maharashtra, their preparation with locally harvested sorghum, stone-ground garlic thecha, and cold-pressed peanut oil reflects Udgir’s authentic rural hospitality.'}
          </div>
        </div>

        {/* Traditional Dishes Grid */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ color: 'var(--forest-green)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '28px' }}>
            {t.foodPage.dishesTitle}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '24px'
          }}>
            {dishes.map((dish) => (
              <div
                key={dish.id}
                style={{
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ position: 'relative', height: '180px' }}>
                  <img
                    src={dish.image}
                    alt={dish.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/hotels/placeholder-restaurant.svg';
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(16, 47, 41, 0.85)',
                    color: 'var(--warm-cream)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    backdropFilter: 'blur(6px)'
                  }}>
                    {dish.tag}
                  </span>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ color: 'var(--forest-green)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
                    {dish.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, flex: 1 }}>
                    {dish.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Culture, Festivals & Kannada-Marathi Confluence */}
        <article style={{
          background: 'var(--white)',
          padding: '40px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '50px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--forest-green)', marginBottom: '16px' }}>
            <Sparkles size={24} color="var(--golden-accent)" />
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t.foodPage.traditionsTitle}</h2>
          </div>

          <p style={{ fontSize: '1.02rem', lineHeight: '1.8', color: 'var(--text-dark)', marginBottom: '24px' }}>
            {t.foodPage.traditionsDesc}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            <div style={{ background: 'var(--warm-cream)', padding: '20px', borderRadius: 'var(--radius-sm)' }}>
              <h4 style={{ color: 'var(--forest-green)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                {lang === 'mr' ? 'बैल पोळा (Bail Pola)' : 'Bail Pola Festival'}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                {lang === 'mr'
                  ? 'शेतकऱ्यांचे सर्जा-राजावरील प्रेम व्यक्त करणारा सण. बैलांना सजवून मिरवणुका काढल्या जातात आणि त्यांना पुरणपोळीचा घास भरवला जातो.'
                  : 'An agrarian celebration honoring agricultural bullocks with vibrant decorations, public processions, and traditional Puran Poli feasts.'}
              </p>
            </div>

            <div style={{ background: 'var(--warm-cream)', padding: '20px', borderRadius: 'var(--radius-sm)' }}>
              <h4 style={{ color: 'var(--forest-green)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                {lang === 'mr' ? 'मराठी व कानडी सांस्कृतिक संगम' : 'Marathi & Kannada Confluence'}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                {lang === 'mr'
                  ? 'उदगीर हे कर्नाटकच्या सीमेपासून अवघ्या २५ किमी अंतरावर असल्याने येथे वीरशैव लिंगायत संतांची परंपरा, मराठी व कानडी भाषेची देवाणघेवाण आणि दोन्ही संस्कृतींचा सुंदर मिलाफ पाहायला मिळतो.'
                  : 'Located just ~25 km from the Karnataka border, Udgir features a unique bilingual cultural heritage where Marathi and Kannada traditions, Lingayat maths, and shared festivals blend harmoniously.'}
              </p>
            </div>

            <div style={{ background: 'var(--warm-cream)', padding: '20px', borderRadius: 'var(--radius-sm)' }}>
              <h4 style={{ color: 'var(--forest-green)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>
                {lang === 'mr' ? 'हत्तीबेट पौर्णिमा यात्रा' : 'Hattibet Purnima Gatherings'}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                {lang === 'mr'
                  ? 'दर पौर्णिमेला हत्तीबेटवर संत गंगाराम महाराजांच्या समाधीसमोर आणि औदुंबर कुंजात भजन-कीर्तनासाठी हजारो भाविकांची जत्रा भरते.'
                  : 'On every full moon night, hundreds of devotees ascend Hattibet to participate in devotional satsangs, kirtans, and community meals.'}
              </p>
            </div>
          </div>
        </article>

        {/* CTA to Dining Directory */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/hotels" className="btn-primary">
            <Utensils size={18} />
            <span>{lang === 'mr' ? 'स्थानिक भोजनालये व हॉटेल्स शोधा' : 'Find Local Restaurants & Bhojnalayas'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
