import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Users, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { TasbeehCarousel } from '../components/home/TasbeehCarousel';

export function HomePage() {
  const { t } = useLanguage();

  const quickActions = [
    { to: '/juzs', text: t('juzs'), icon: BookOpen },
    { to: '/reciters', text: t('reciters'), icon: Users },
    { to: '/prayer-times', text: t('prayerTimes'), icon: Clock },
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/50 text-white rounded-2xl p-8 text-center"
        >
          <h1 className="text-4xl font-bold font-arabic mb-2 text-primary-dark dark:text-white dark:text-shadow-glow-md" style={{ textShadow: '0 0 15px rgba(49, 130, 206, 0.7)' }}>{t('main_title')}</h1>
          <p className="text-primary dark:text-primary-light/80">{t('main_subtitle')}</p>
        </motion.div>

        {/* Tasbeeh Carousel */}
        <TasbeehCarousel />

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.to}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link
                to={action.to}
                className="flex flex-col items-center justify-center bg-white dark:bg-space-200/30 dark:backdrop-blur-sm border border-gray-200 dark:border-space-100/50 rounded-xl p-4 h-24 text-center transition-all duration-300 hover:border-primary-light dark:hover:border-accent-dark hover:shadow-lg dark:hover:shadow-glow-sm"
              >
                <action.icon className="text-primary-dark dark:text-primary-light mb-1" size={24} />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{action.text}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Continue Reading / Last Read */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/surahs"
            className="block bg-white dark:bg-space-200/30 dark:backdrop-blur-sm border border-gray-200 dark:border-space-100/50 rounded-2xl p-6 transition-all duration-300 hover:border-primary-light dark:hover:border-accent-dark hover:shadow-lg dark:hover:shadow-glow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('browse_surahs')}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('browse_surahs_desc')}</p>
              </div>
              <BookOpen className="text-primary-dark dark:text-primary-light" size={32} />
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
