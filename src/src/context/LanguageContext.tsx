import React, { createContext, useState, useContext, ReactNode } from 'react';
import { translations, Language, TranslationKey } from '../lib/i18n';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, replacements?: { [key: string]: string | number }) => string;
  dir: 'ltr' | 'rtl';
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ar');

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const t = (key: TranslationKey, replacements?: { [key: string]: string | number }): string => {
    let translation = translations[language][key] || translations['en'][key] || key;
    
    if (replacements) {
      Object.keys(replacements).forEach((replacementKey) => {
        const value = replacements[replacementKey];
        const regex = new RegExp(`{${replacementKey}}`, 'g');
        translation = translation.replace(regex, String(value));
      });
    }
    
    return translation;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
