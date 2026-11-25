import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../translations/en';
import { mr } from '../translations/mr';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get('lang');
      if (urlLang === 'mr' || urlLang === 'en') {
        return urlLang;
      }
    } catch (e) {
      // ignore
    }
    return localStorage.getItem('udgir_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('udgir_lang', lang);
    if (lang === 'mr') {
      document.body.classList.add('lang-mr');
    } else {
      document.body.classList.remove('lang-mr');
    }
  }, [lang]);

  const t = lang === 'mr' ? mr : en;

  const toggleLanguage = (selectedLang) => {
    if (selectedLang) {
      setLang(selectedLang);
    } else {
      setLang((prev) => (prev === 'en' ? 'mr' : 'en'));
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
