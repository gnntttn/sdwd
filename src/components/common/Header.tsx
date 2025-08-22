import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Globe, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Language } from '../../lib/i18n';

interface HeaderProps {
  onSearchToggle: () => void;
}

export function Header({ onSearchToggle }: HeaderProps) {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { t, language, setLanguage, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  return (
    <header className="sticky top-0 bg-gray-50/80 dark:bg-space-300/80 backdrop-blur-lg z-40 border-b border-gray-200 dark:border-space-200/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md dark:shadow-glow-sm">
              <span className="text-white font-bold text-lg font-arabic">
                {language === 'ar' ? 'آ' : 'A'}
              </span>
            </div>
            <h1 className={`text-xl font-bold text-gray-900 dark:text-gray-100 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
              {t('main_title')}
            </h1>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
             <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-accent-light hover:bg-gray-200 dark:hover:bg-space-200/50 rounded-full transition-all"
                title="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-accent-light hover:bg-gray-200 dark:hover:bg-space-200/50 rounded-full transition-all"
                title="Change Language"
              >
                <Globe size={20} />
              </button>
              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className={`absolute top-full mt-2 w-32 bg-white dark:bg-space-200 border border-gray-200 dark:border-space-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 text-gray-800 dark:text-gray-200 ${dir === 'rtl' ? 'left-0' : 'right-0'}`}
                  >
                    <button onClick={() => changeLanguage('ar')} className="block w-full text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-space-100/50">العربية</button>
                    <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-space-100/50">English</button>
                    <button onClick={() => changeLanguage('fr')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-space-100/50">Français</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button
              onClick={onSearchToggle}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-accent-light hover:bg-gray-200 dark:hover:bg-space-200/50 rounded-full transition-all"
              title={t('search')}
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
