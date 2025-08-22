import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Sun, Sunset, Moon, MapPin, RefreshCw } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { prayerTimesService } from '../services/prayerTimesApi';
import { PrayerTimes } from '../types/quran';
import { QiblaCompass } from '../components/prayer/QiblaCompass';
import { useLanguage } from '../context/LanguageContext';

export function PrayerTimesPage() {
  const { latitude, longitude, error: geoError, loading: geoLoading, requestLocation } = useGeolocation();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (latitude && longitude) {
      const fetchPrayerData = async () => {
        setLoading(true);
        const timesPromise = prayerTimesService.getPrayerTimes(latitude, longitude);
        const qiblaPromise = prayerTimesService.getQiblaDirection(latitude, longitude);
        
        try {
          const [times, qibla] = await Promise.all([timesPromise, qiblaPromise]);
          setPrayerTimes(times);
          setQiblaDirection(qibla);
        } catch (error) {
          console.error("Failed to fetch prayer data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPrayerData();
    } else if (!geoLoading) {
      setLoading(false);
    }
  }, [latitude, longitude, geoLoading]);

  const prayerIcons = {
    fajr: <Sunrise size={24} className="text-blue-400" />,
    dhuhr: <Sun size={24} className="text-yellow-400" />,
    asr: <Sun size={24} className="text-orange-400" />,
    maghrib: <Sunset size={24} className="text-purple-400" />,
    isha: <Moon size={24} className="text-indigo-400" />,
  };

  const prayerKeys: (keyof typeof prayerIcons)[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  const renderContent = () => {
    if (loading || geoLoading) {
      return (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-light mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">{t('getting_location')}</p>
        </div>
      );
    }

    if (geoError) {
      return (
        <div className="text-center py-16 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-xl">
          <MapPin className="text-red-500 dark:text-red-400 mx-auto" size={64} />
          <h2 className="mt-6 text-2xl font-semibold text-red-800 dark:text-red-300">
            {t('location_error')}
          </h2>
          <p className="mt-2 text-red-600 dark:text-red-400 max-w-md mx-auto px-4">
            {geoError}
          </p>
          <button
            onClick={requestLocation}
            className="mt-6 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            <span>{t('try_again')}</span>
          </button>
        </div>
      );
    }

    if (!prayerTimes) {
      return (
        <div className="text-center py-16 bg-gray-100 dark:bg-space-200/50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-300">
            {t('loading_prayer_times')}
          </h2>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-space-200/30 dark:backdrop-blur-sm border border-gray-200 dark:border-space-100/50 rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-arabic">
            {t('prayer_times_for_today')}
          </h3>
          <p className="text-primary-dark dark:text-primary-light mb-6">{prayerTimes.hijriDate}</p>
          <div className="space-y-4">
            {prayerKeys.map((key) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-100 dark:bg-space-300/50 border border-gray-200/50 dark:border-space-100/30 rounded-lg">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    {prayerIcons[key]}
                    <span className="text-lg font-semibold text-gray-800 dark:text-gray-200 font-sans-arabic">
                      {t(key)}
                    </span>
                  </div>
                  <span className="text-xl font-bold text-accent-dark dark:text-accent-light font-mono tracking-wider">{prayerTimes[key] as string}</span>
                </div>
              ))}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-space-200/30 dark:backdrop-blur-sm border border-gray-200 dark:border-space-100/50 rounded-xl p-8"
        >
          <QiblaCompass direction={qiblaDirection} />
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-arabic">
            {t('prayer_page_title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('prayer_page_subtitle')}
          </p>
        </motion.div>
        {renderContent()}
      </div>
    </div>
  );
}
