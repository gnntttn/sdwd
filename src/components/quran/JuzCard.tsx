import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookCopy } from 'lucide-react';

interface JuzCardProps {
  juzNumber: number;
  index: number;
}

export function JuzCard({ juzNumber, index }: JuzCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link 
        to={`/juz/${juzNumber}`}
        className="block bg-white dark:bg-space-200/30 dark:backdrop-blur-sm border border-gray-200 dark:border-space-100/50 rounded-xl p-6 text-center transition-all duration-300 hover:border-primary-light dark:hover:border-accent-dark hover:shadow-lg dark:hover:shadow-glow-sm"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <BookCopy className="text-primary-dark dark:text-primary-light" size={28} />
          <h3 className="text-lg font-bold font-arabic text-gray-900 dark:text-gray-100">
            الجزء {juzNumber}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}
