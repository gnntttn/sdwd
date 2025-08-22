import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookText, AlertTriangle } from 'lucide-react';
import { hadithApi } from '../../services/hadithApi';
import { Hadith } from '../../types/hadith';
import { useLanguage } from '../../context/LanguageContext';

const HadithSkeleton = () => (
  <div className="bg-gray-100 dark:bg-space-200/50 border border-gray-200 dark:border-space-100 rounded-2xl p-6 animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-space-100 rounded w-1/3 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-space-100 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-space-100 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 dark:bg-space-100 rounded w-full"></div>
    </div>
    <div className="h-4 bg-gray-200 dark:bg-space-100 rounded w-1/2 mt-6"></div>
  </div>
);

export function HadithOfTheDay() {
  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, language, dir } = useLanguage();

  useEffect(() => {
    const fetchHadith = async () => {
      setLoading(true);
      setError(null);
      try {
        const today = new Date().toISOString().split('T')[0];
        const cachedHadith = localStorage.getItem('hadith-of-the-day');
        const cachedDate = localStorage.getItem('hadith-date');

        if (cachedHadith && cachedDate === today) {
          setHadith(JSON.parse(cachedHadith));
        } else {
          const newHadith = await hadithApi.getRandomBukhariHadith();
          if (newHadith) {
            setHadith(newHadith);
            localStorage.setItem('hadith-of-the-day', JSON.stringify(newHadith));
            localStorage.setItem('hadith-date', today);
          } else {
            throw new Error('Failed to fetch Hadith');
          }
        }
      } catch (err) {
        setError(t('hadith_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchHadith();
  }, [t]);

  if (loading) {
    return <HadithSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-xl p-4 flex items-center gap-4 border border-red-300 dark:border-red-700">
        <p>{error}</p>
        <AlertTriangle size={24} />
      </div>
    );
  }

  if (!hadith) {
    return null;
  }

  const hadithText = language === 'ar' ? hadith.hadith_arabic : hadith.hadith_english;
  const sourceBook = language === 'ar' ? hadith.book_arabic : hadith.book_english;
  const sourceChapter = hadith.chapter_english;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/50 dark:bg-space-200/30 dark:backdrop-blur-sm border border-gray-200 dark:border-space-100/50 rounded-2xl p-6 transition-all duration-300 hover:border-primary-light dark:hover:border-accent-dark hover:shadow-lg dark:hover:shadow-glow-sm"
    >
      <div className="flex items-center gap-3 mb-4">
        <BookText className="text-primary-dark dark:text-primary-light" size={24} />
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('hadith_of_the_day')}</h2>
      </div>
      
      <p className={`text-gray-700 dark:text-gray-300 leading-relaxed mb-4 ${language === 'ar' ? 'font-sans-arabic text-lg' : 'font-sans'}`} dir={dir}>
        {hadithText}
      </p>

      <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-space-100/50 pt-3">
        <p>
          <span className="font-semibold text-gray-700 dark:text-gray-300">{t('source')}:</span> {sourceBook}
        </p>
        {sourceChapter && <p>{sourceChapter}</p>}
      </div>
    </motion.div>
  );
}
