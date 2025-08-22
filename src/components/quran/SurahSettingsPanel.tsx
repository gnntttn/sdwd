import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Reciter } from '../../types/quran';
import { useLanguage } from '../../context/LanguageContext';

interface SurahSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  reciters: Reciter[];
  selectedReciter: string;
  onReciterChange: (id: string) => void;
  showTranslations: boolean;
  onShowTranslationsChange: (show: boolean) => void;
}

export function SurahSettingsPanel({
  isOpen,
  onClose,
  reciters,
  selectedReciter,
  onReciterChange,
  showTranslations,
  onShowTranslationsChange,
}: SurahSettingsPanelProps) {
  const { t, language, dir } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-50/80 dark:bg-space-300/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white/80 dark:bg-space-200/80 backdrop-blur-lg border border-gray-200 dark:border-space-100/50 rounded-2xl shadow-lg dark:shadow-glow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
            dir={dir}
          >
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-space-100/50 p-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {t('view_settings')}
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-accent-light hover:bg-gray-200 dark:hover:bg-space-100/50 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="reciter-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('reciter_select_label')}
                </label>
                <select
                  id="reciter-select"
                  value={selectedReciter}
                  onChange={(e) => onReciterChange(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-space-100 bg-gray-100 dark:bg-space-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 dark:text-gray-200"
                >
                  {reciters.map((reciter) => (
                    <option key={reciter.id} value={reciter.id} className="bg-white dark:bg-space-200 text-gray-800 dark:text-gray-200">
                      {language === 'ar' ? reciter.nameArabic : reciter.name}
                    </option>
                  ))}
                </select>
              </div>

              {language !== 'ar' && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('show_translation_label')}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showTranslations}
                      onChange={(e) => onShowTranslationsChange(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-space-100 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
