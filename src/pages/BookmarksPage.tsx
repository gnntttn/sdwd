import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookmarkX, Loader } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { quranApi } from '../services/quranApi';
import { Verse, Surah } from '../types/quran';
import { VerseCard } from '../components/quran/VerseCard';
import { useLanguage } from '../context/LanguageContext';

type BookmarkedVerse = Verse & { surah: Surah };

export function BookmarksPage() {
  const { t } = useLanguage();
  const [bookmarks] = useLocalStorage<string[]>('quran-bookmarks', []);
  const [bookmarkedVerses, setBookmarkedVerses] = useState<BookmarkedVerse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      const promises = bookmarks.map(async (key) => {
        const [surahIdStr] = key.split(':');
        const surahId = parseInt(surahIdStr, 10);
        
        const versePromise = quranApi.getVerseByKey(key, { translations: '131' });
        const surahPromise = quranApi.getSurah(surahId);

        const [verseResult, surahResult] = await Promise.all([versePromise, surahPromise]);

        if (verseResult && surahResult) {
          return { ...verseResult.verse, surah: surahResult };
        }
        return null;
      });

      const results = (await Promise.all(promises)).filter(Boolean) as BookmarkedVerse[];
      setBookmarkedVerses(results.reverse());
      setLoading(false);
    };

    if (bookmarks.length > 0) {
      fetchBookmarks();
    } else {
      setLoading(false);
      setBookmarkedVerses([]);
    }
  }, [bookmarks]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-accent-light mx-auto" size={48} />
          <p className="mt-4 text-gray-700 dark:text-gray-300">{t('loading_bookmarks')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-arabic">
            {t('bookmarks_page_title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('bookmarks_page_subtitle')}
          </p>
        </motion.div>

        {bookmarkedVerses.length > 0 ? (
          <div className="space-y-6">
            {bookmarkedVerses.map((item, index) => (
              <VerseCard
                key={item.verseKey}
                verse={item}
                surah={item.surah}
                index={index}
                showTranslation={true}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-gray-100 dark:bg-space-200/30 dark:backdrop-blur-sm border border-gray-200 dark:border-space-100/50 rounded-xl"
          >
            <BookmarkX className="text-gray-400 dark:text-gray-500 mx-auto" size={64} />
            <h2 className="mt-6 text-2xl font-semibold text-gray-800 dark:text-gray-200">
              {t('no_bookmarks')}
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {t('no_bookmarks_desc')}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
