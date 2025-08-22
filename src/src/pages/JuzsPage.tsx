import React from 'react';
import { motion } from 'framer-motion';
import { JuzCard } from '../components/quran/JuzCard';
import { useLanguage } from '../context/LanguageContext';

export function JuzsPage() {
  const { t } = useLanguage();
  const juzCount = 30;
  const juzs = Array.from({ length: juzCount }, (_, i) => i + 1);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-arabic">
            {t('juzs_page_title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('juzs_page_subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {juzs.map((juzNumber, index) => (
            <JuzCard key={juzNumber} juzNumber={juzNumber} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
