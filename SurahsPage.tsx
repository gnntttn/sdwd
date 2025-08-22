import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { quranApi } from '../services/quranApi';
import { Surah } from '../types/quran';
import { SurahCard } from '../components/quran/SurahCard';
import { useLanguage } from '../context/LanguageContext';

export function SurahsPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'meccan' | 'medinan'>('all');
  const { t } = useLanguage();

  useEffect(() => {
    loadSurahs();
  }, []);

  useEffect(() => {
    filterSurahs();
  }, [searchQuery, filterType, surahs]);

  const loadSurahs = async () => {
    try {
      const data = await quranApi.getSurahs();
      setSurahs(data);
      setFilteredSurahs(data);
    } catch (error) {
      console.error('Error loading surahs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSurahs = () => {
    let filtered = surahs;

    if (filterType !== 'all') {
      filtered = filtered.filter(surah => surah.type === filterType);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(surah => 
        surah.nameArabic.includes(searchQuery) ||
        surah.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.id.toString() === searchQuery
      );
    }

    setFilteredSurahs(filtered);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t('search_surah_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 dark:border-space-100 bg-white dark:bg-space-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 dark:text-gray-200 font-sans-arabic"
            />
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={() => setFilterType('all')} className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${filterType === 'all' ? 'bg-primary text-white shadow-md dark:shadow-glow-sm' : 'bg-gray-200 dark:bg-space-200/50 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-space-100/50'}`}>{t('filter_all')}</button>
            <button onClick={() => setFilterType('meccan')} className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${filterType === 'meccan' ? 'bg-primary text-white shadow-md dark:shadow-glow-sm' : 'bg-gray-200 dark:bg-space-200/50 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-space-100/50'}`}>{t('filter_meccan')}</button>
            <button onClick={() => setFilterType('medinan')} className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${filterType === 'medinan' ? 'bg-primary text-white shadow-md dark:shadow-glow-sm' : 'bg-gray-200 dark:bg-space-200/50 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-space-100/50'}`}>{t('filter_medinan')}</button>
          </div>
        </motion.div>

        <div className="space-y-3">
          {filteredSurahs.map((surah, index) => (
            <SurahCard key={surah.id} surah={surah} index={index} />
          ))}
        </div>

        {filteredSurahs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg font-sans-arabic">
              {t('no_results_found')}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
