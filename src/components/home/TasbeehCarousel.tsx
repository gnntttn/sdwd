import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const tasbeehList = [
  "سبحان الله",
  "الحمد لله",
  "لا إله إلا الله",
  "الله أكبر",
  "سبحان الله وبحمده",
  "سبحان الله العظيم",
  "لا حول ولا قوة إلا بالله",
  "أستغفر الله",
  "اللهم صل على محمد",
  "أستغفر الله وأتوب إليه",
  "سبحان الله وبحمده عدد خلقه ورضا نفسه وزنة عرشه ومداد كلماته",
  "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",
  "يا حي يا قيوم برحمتك أستغيث",
  "اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام",
  "لا إله إلا أنت سبحانك إني كنت من الظالمين",
  "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم",
  "اللهم إنك عفو تحب العفو فاعف عنا",
  "رضيت بالله رباً، وبالإسلام ديناً، وبمحمد صلى الله عليه وسلم نبياً",
  "اللهم أعنا على ذكرك وشكرك وحسن عبادتك",
  "اللهم لك الحمد كما ينبغي لجلال وجهك وعظيم سلطانك",
];

export function TasbeehCarousel() {
  const [currentTasbeeh, setCurrentTasbeeh] = useState('');
  const { t } = useLanguage();

  const getRandomTasbeeh = () => {
    const randomIndex = Math.floor(Math.random() * tasbeehList.length);
    setCurrentTasbeeh(tasbeehList[randomIndex]);
  };

  useEffect(() => {
    getRandomTasbeeh();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/50 dark:bg-space-200/30 dark:backdrop-blur-sm border border-gray-200 dark:border-space-100/50 rounded-2xl p-6 transition-all duration-300 hover:border-primary-light dark:hover:border-accent-dark hover:shadow-lg dark:hover:shadow-glow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Heart className="text-primary-dark dark:text-primary-light" size={24} />
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('tasbeeh_title')}</h2>
        </div>
        <button
          onClick={getRandomTasbeeh}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-accent-light hover:bg-gray-200 dark:hover:bg-space-100/50 rounded-full transition-colors"
          title={t('new_tasbeeh')}
        >
          <RefreshCw size={18} />
        </button>
      </div>
      
      <div className="text-center py-4">
        <p className="font-arabic text-4xl font-bold text-gray-900 dark:text-gray-100 dark:text-shadow-glow-sm" style={{ textShadow: '0 0 10px rgba(102, 252, 241, 0.3)' }}>
          {currentTasbeeh}
        </p>
      </div>
    </motion.div>
  );
}
