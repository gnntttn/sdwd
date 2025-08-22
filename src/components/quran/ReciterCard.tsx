import React from 'react';
import { motion } from 'framer-motion';
import { Mic2, Music4 } from 'lucide-react';
import { Reciter } from '../../types/quran';

interface ReciterCardProps {
  reciter: Reciter;
  index: number;
}

export function ReciterCard({ reciter, index }: ReciterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-space-200/30 dark:backdrop-blur-sm border border-gray-200 dark:border-space-100/50 rounded-xl p-6 transition-all duration-300 hover:border-primary-light dark:hover:border-accent-dark hover:shadow-lg dark:hover:shadow-glow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold font-sans-arabic text-gray-900 dark:text-gray-100 mb-1">
            {reciter.nameArabic}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">
            {reciter.name}
          </p>
        </div>
        <Mic2 className="text-primary-dark dark:text-primary-light flex-shrink-0" size={24} />
      </div>
      {reciter.style && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-space-100/50 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Music4 size={16} className="ml-2 text-accent-dark dark:text-accent-light" />
          <span>{reciter.style}</span>
        </div>
      )}
    </motion.div>
  );
}
