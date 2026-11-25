import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, BookOpen, Swords, Landmark, Flag, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HistoryPage = () => {
  const { lang, t } = useLanguage();

  return (
    <div style={{ padding: '60px 0 100px 0' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span className="section-tag">{lang === 'mr' ? 'ऐतिहासिक वारसा' : 'Historical Chronicle'}</span>
          <h1 className="section-title">{t.historyPage.pageTitle}</h1>
          <p className="section-subtitle">{t.historyPage.pageSubtitle}</p>
        </div>

        {/* Hero Artwork Banner */}
        <div style={{
          position: 'relative',
          height: '340px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          marginBottom: '50px',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-light)'
        }}>
          <img
            src="/assets/history/battle-of-udgir-1760.jpg"
            alt={lang === 'mr' ? 'उदगीरची प्रसिद्ध लढाई (१७६०)' : 'Historic Battle of Udgir (1760)'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://sc0.blr1.digitaloceanspaces.com/large/722510-f49a1db4-9c02-4fad-8f0e-36215ad86356.jpg';
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(transparent 30%, rgba(14, 77, 67, 0.92))',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '24px',
            color: 'var(--white)'
          }}>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '4px' }}>
                {lang === 'mr' ? 'उदगीरची ऐतिहासिक लढाई (१७६०) व मराठा विजय' : 'Battle of Udgir (1760) & Maratha Triumph'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(250, 248, 245, 0.85)' }}>
                {lang === 'mr' ? 'सदाशिवराव भाऊ व निजाम यांच्यातील ऐतिहासिक तह दर्शवणारे चित्र' : '18th-century chronicle painting illustrating negotiations after the Battle of Udgir'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: The Battle of Udgir (1760) */}
        <article style={{
          background: 'var(--white)',
          padding: '40px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '36px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--forest-green)', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(198, 161, 91, 0.2)', padding: '10px', borderRadius: '10px', color: 'var(--golden-hover)' }}>
              <Swords size={26} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t.historyPage.battleTitle}</h2>
          </div>

          <p style={{ fontSize: '1.02rem', lineHeight: '1.8', color: 'var(--text-dark)', marginBottom: '20px' }}>
            {t.historyPage.battleDesc}
          </p>

          <div style={{
            background: 'var(--warm-cream)',
            padding: '20px 24px',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '4px solid var(--golden-accent)',
            marginBottom: '20px'
          }}>
            <h4 style={{ color: 'var(--forest-green)', fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px' }}>
              {lang === 'mr' ? 'लढाईचे महत्त्वाचे पैलू आणि सेनापती' : 'Key Commanders and Military Strategy'}
            </h4>
            <ul style={{ paddingLeft: '20px', lineHeight: 1.8, fontSize: '0.92rem', color: 'var(--text-dark)' }}>
              <li>
                <strong>{lang === 'mr' ? 'मराठा सेनापती:' : 'Maratha Leadership:'}</strong>{' '}
                {lang === 'mr'
                  ? 'सदाशिवराव भाऊ (मुख्य सेनापती), रघुनाथराव, समशेर बहादूर आणि तोफखाना प्रमुख इब्राहिम खान गारदी.'
                  : 'Sadashivrao Bhau (Supreme Commander), assisted by Raghunathrao, Shamsher Bahadur, and French-trained artillery general Ibrahim Khan Gardi.'}
              </li>
              <li>
                <strong>{lang === 'mr' ? 'निजाम सैन्याची स्थिती:' : 'Nizam Opposition:'}</strong>{' '}
                {lang === 'mr'
                  ? 'निजाम सलाबत जंग व निजाम अली खान यांच्या फौजांना मराठ्यांच्या गतिशील घोडदळाने उदगीर परिसरात पूर्णपणे वेढले.'
                  : 'Nizam Salabat Jung and Nizam Ali Khan were encircled and cut off from all provisions and drinking water.'}
              </li>
              <li>
                <strong>{lang === 'mr' ? 'उदगीरचा तह (फेब्रुवारी १७६०):' : 'Treaty of Udgir (Feb 1760):'}</strong>{' '}
                {lang === 'mr'
                  ? 'निजामाने वार्षिक ६० लाख उत्पन्नाचा सुपीक मुलूख आणि दौलताबाद, अहमदनगर, विजापूर, बुरहानपूर यांसारखे ऐतिहासिक किल्ले मराठ्यांच्या हवाली केले.'
                  : 'The Nizam surrendered territories yielding ₹60 lakh annual revenue along with premier historical fortresses: Ahmednagar, Daulatabad, Burhanpur, and Bijapur.'}
              </li>
            </ul>
          </div>
        </article>

        {/* Section 2: Udgir Fort & Dating Dispute */}
        <article style={{
          background: 'var(--white)',
          padding: '40px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '36px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--forest-green)', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(198, 161, 91, 0.2)', padding: '10px', borderRadius: '10px', color: 'var(--golden-hover)' }}>
              <Landmark size={26} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t.historyPage.fortTitle}</h2>
          </div>

          <p style={{ fontSize: '1.02rem', lineHeight: '1.8', color: 'var(--text-dark)', marginBottom: '20px' }}>
            {t.historyPage.fortDesc}
          </p>

          {/* Historical Dating Transparency Callout */}
          <div style={{
            background: '#FFF8E1',
            padding: '20px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #FFE082',
            display: 'flex',
            gap: '14px',
            alignItems: 'flex-start',
            marginBottom: '20px'
          }}>
            <AlertTriangle size={22} color="#E65100" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.9rem', color: '#5D4037', lineHeight: '1.6' }}>
              <strong>{lang === 'mr' ? 'ऐतिहासिक नोंद व मतांतरे:' : 'Documented Historical Divergence:'}</strong>{' '}
              {lang === 'mr'
                ? 'लातूर जिल्हा गॅझेटिअरनुसार या किल्ल्याची निर्मिती १२ व्या शतकातील देवगिरीच्या यादव राजवटीत झाली असल्याचे मानले जाते. तथापि, पुरातत्वीय संरचना, पर्शियन शिलालेख आणि बुरुजांची बांधणी १४ व्या व १५ व्या शतकातील बहामनी व नंतरच्या आदिलशाही कालखंडातील विस्ताराची साक्ष देतात. दोन्ही संदर्भ वस्तुनिष्ठतेसाठी या पोर्टलवर नोंदवण्यात आले आहेत.'
                : 'Latur District gazetteers attribute the fort foundation to the 12th-century Yadava dynasty of Devagiri. However, existing masonry, Persian epigraphs, and defense ramparts reflect composite Bahmani (14th-15th century) and Adil Shahi construction. Rather than selecting one unsupported absolute date, both documented records are acknowledged.'}
            </div>
          </div>
        </article>

        {/* Section 3: Saint Udaygiri Baba's Samadhi */}
        <article style={{
          background: 'var(--white)',
          padding: '40px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '36px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--forest-green)', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(198, 161, 91, 0.2)', padding: '10px', borderRadius: '10px', color: 'var(--golden-hover)' }}>
              <BookOpen size={26} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t.historyPage.samadhiTitle}</h2>
          </div>

          <p style={{ fontSize: '1.02rem', lineHeight: '1.8', color: 'var(--text-dark)', marginBottom: '16px' }}>
            {t.historyPage.samadhiDesc}
          </p>

          <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>
            {lang === 'mr'
              ? 'स्थानिक श्रद्धेनुसार, किल्ल्याच्या दक्षिण भागातून उतरणाऱ्या अरुंद पायऱ्या ६० फूट खोल भुयारात नेतात. येथे अखंड पाषाणात कोरलेली समाधी, शिवलिंग आणि प्राचीन पादुका आजही भक्तांच्या श्रद्धेचे केंद्र आहेत.'
              : 'Local tradition recounts that narrow steps carved into the subterranean bedrock descend 60 feet below ground level. The hermitage preserves stone padukas (footprints) and a rock-cut Shivalinga where pilgrims continue to pay homage.'}
          </p>
        </article>

        {/* Section 4: Hyderabad Mukti Sangram (1947–1948) */}
        <article style={{
          background: 'var(--white)',
          padding: '40px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--forest-green)', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(198, 161, 91, 0.2)', padding: '10px', borderRadius: '10px', color: 'var(--golden-hover)' }}>
              <Flag size={26} />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{t.historyPage.liberationTitle}</h2>
          </div>

          <p style={{ fontSize: '1.02rem', lineHeight: '1.8', color: 'var(--text-dark)', marginBottom: '20px' }}>
            {t.historyPage.liberationDesc}
          </p>

          <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>
            {lang === 'mr'
              ? '१५ ऑगस्ट १९४७ रोजी भारत स्वतंत्र झाल्यानंतरही हैदराबाद संस्थानातील जनता पारतंत्र्यात होती. रझाकारांच्या अत्याचाराविरुद्ध स्वामी रामानंद तीर्थ यांच्या नेतृत्वाखाली झालेल्या जनआंदोलनात उदगीर, देवर्जन आणि हत्तीबेटच्या डोंगररांगांचा वापर स्वातंत्र्यसैनिकांनी भूमिगत छावण्या म्हणून केला. १७ सप्टेंबर १९४८ रोजी हैदराबाद संस्थानाचे भारतात विलीनीकरण झाले.'
              : 'Following India’s independence on August 15, 1947, the Hyderabad princely state remained under autocratic rule until the historic liberation on September 17, 1948. Led by Swami Ramanand Teerth, local freedom fighters resisted the Razakar militia, using the rugged caves of Hattibet as clandestine communication posts.'}
          </p>
        </article>

        {/* CTA to Explore Destinations */}
        <div style={{ textAlign: 'center', padding: '40px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <h3 style={{ color: 'var(--forest-green)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>
            {lang === 'mr' ? 'उदगीरचा जिवंत इतिहास प्रत्यक्ष अनुभवा' : 'Experience Udgir’s Living History in Person'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
            {lang === 'mr' ? 'उदगीर किल्ला आणि हत्तीबेटच्या ऐतिहासिक ठिकाणांना भेट द्या.' : 'Visit Udgir Fort, underground shrines, and the eco-slopes of Hattibet.'}
          </p>
          <Link to="/places" className="btn-primary">
            <span>{lang === 'mr' ? 'पर्यटन स्थळे पाहा' : 'Explore Historic Places'}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
