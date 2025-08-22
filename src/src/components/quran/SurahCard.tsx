import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Surah } from '../../types/quran';
import { useLanguage } from '../../context/LanguageContext';

interface SurahCardProps {
  surah: Surah;
  index: number;
}

export function SurahCard({ surah, index }: SurahCardProps) {
  const { language } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link 
        to={`/surah/${surah.id}`} 
        className="block bg-white dark:bg-space-200/30 dark:backdrop-blur-sm border border-gray-200 dark:border-space-100/50 rounded-xl p-4 transition-all duration-300 hover:border-primary-light dark:hover:border-accent-dark hover:shadow-lg dark:hover:shadow-glow-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-10 h-10 border-2 border-primary-light dark:border-primary-dark text-primary-dark dark:text-primary-light rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-300">
              {surah.id}
            </div>
            <div>
              <h3 className="text-md font-bold font-arabic text-gray-900 dark:text-gray-100">
                {surah.nameArabic}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">
                {surah.nameEnglish}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-lg font-arabic text-gray-800 dark:text-gray-200">
              {language === 'ar' ? surah.nameArabic : surah.nameEnglish}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {surah.versesCount} {language === 'ar' ? 'آيات' : 'verses'}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
