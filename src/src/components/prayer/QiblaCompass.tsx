import React from 'react';
import { motion } from 'framer-motion';

interface QiblaCompassProps {
  direction: number | null;
}

export function QiblaCompass({ direction }: QiblaCompassProps) {
  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-arabic">
        اتجاه القبلة
      </h3>
      <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
        {/* Outer rings */}
        <div className="absolute w-full h-full rounded-full border-2 border-primary/20 animate-spin" style={{ animationDuration: '10s' }}></div>
        <div className="absolute w-3/4 h-3/4 rounded-full border border-primary/30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
        
        {/* Inner static rings and background */}
        <div className="absolute w-full h-full rounded-full bg-gray-100 dark:bg-space-200/30"></div>
        <div className="absolute w-40 h-40 rounded-full border border-gray-200 dark:border-space-100"></div>
        <div className="absolute w-24 h-24 rounded-full border border-gray-200/50 dark:border-space-100/50"></div>

        {/* Cardinal points */}
        <span className="absolute top-2 text-sm font-bold text-primary-dark/70 dark:text-primary-light/70">ش</span>
        <span className="absolute bottom-2 text-sm font-bold text-primary-dark/70 dark:text-primary-light/70">ج</span>
        <span className="absolute left-3 text-sm font-bold text-primary-dark/70 dark:text-primary-light/70">غ</span>
        <span className="absolute right-3 text-sm font-bold text-primary-dark/70 dark:text-primary-light/70">ق</span>
        
        {direction !== null ? (
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: direction }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="absolute w-full h-full"
          >
            <div 
              className="absolute top-1/2 left-1/2 w-0.5 h-1/2 -mt-1/2 bg-accent-light rounded-full"
              style={{ transformOrigin: 'bottom', boxShadow: '0 0 8px #66fcf1' }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl">🕋</div>
            </div>
          </motion.div>
        ) : (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-light"></div>
        )}
      </div>
      {direction !== null && (
        <p className="mt-4 text-lg font-semibold text-accent-light font-mono tracking-widest">
          {direction.toFixed(2)}°
        </p>
      )}
    </div>
  );
}
