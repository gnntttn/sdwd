import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Play, Share2, MessageCircle } from 'lucide-react';
import { Verse, Surah } from '../../types/quran';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useLanguage } from '../../context/LanguageContext';
import { ShareModal } from '../common/ShareModal';

interface VerseCardProps {
  verse: Verse;
  surah: Surah;
  index: number;
  isPlaying?: boolean;
  onPlay?: () => void;
  showTranslation?: boolean;
}

export function VerseCard({ 
  verse, 
  surah, 
  index, 
  isPlaying, 
  onPlay,
  showTranslation = true 
}: VerseCardProps) {
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>('quran-bookmarks', []);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useLocalStorage(`note-${verse.verseKey}`, '');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState({ text: '', url: '' });
  const { t, language, dir } = useLanguage();
  
  const isBookmarked = bookmarks.includes(verse.verseKey);

  const toggleBookmark = () => {
    if (isBookmarked) {
      setBookmarks(bookmarks.filter(b => b !== verse.verseKey));
    } else {
      setBookmarks([...bookmarks, verse.verseKey]);
    }
  };

  const shareVerse = async () => {
    const surahName = language === 'ar' ? surah.nameArabic : surah.nameEnglish;
    const text = `${verse.textUthmani}\n\n${t('surah')} ${surahName} - ${t('verse')} ${verse.verseNumber}`;
    const url = `${window.location.origin}/surah/${surah.id}?verse=${verse.verseNumber}`;
    
    if (navigator.share) {
      try {
        const shareTitle = t('share_verse_title').replace('{surahName}', surahName);
        await navigator.share({ title: shareTitle, text, url });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      setShareData({ text, url });
      setIsShareModalOpen(true);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.02 }}
        className={`bg-white/30 dark:bg-space-200/20 dark:backdrop-blur-sm rounded-xl transition-all duration-300 ${
          isPlaying ? 'ring-2 ring-accent-light shadow-lg dark:shadow-glow-md' : 'border border-gray-200 dark:border-space-100/50'
        }`}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300 ${
              isPlaying ? 'bg-accent-light text-space-300 shadow-md dark:shadow-glow-sm' : 'bg-primary/10 dark:bg-primary/20 text-primary-dark dark:text-primary-light border border-primary/20 dark:border-primary/50'
            }`}>
              {verse.verseNumber}
            </div>
            
            <p className="flex-1 text-2xl lg:text-3xl leading-loose text-right font-arabic text-gray-900 dark:text-gray-100 selection:bg-primary/20 dark:selection:bg-primary/30 px-4">
              {verse.textUthmani}
            </p>
          </div>

          {showTranslation && verse.translations && verse.translations.length > 0 && (
            <div className="border-t border-gray-200 dark:border-space-100/50 pt-3 mt-3">
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {verse.translations[0].text}
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-1 mt-3">
              <button
                onClick={() => setShowNote(!showNote)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-accent-light hover:bg-gray-200 dark:hover:bg-space-100/50 transition-colors rounded-full"
                title={t('note_placeholder')}
              >
                <MessageCircle size={18} />
              </button>
              
              <button
                onClick={shareVerse}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-accent-light hover:bg-gray-200 dark:hover:bg-space-100/50 transition-colors rounded-full"
                title={t('share')}
              >
                <Share2 size={18} />
              </button>
              
              <button
                onClick={toggleBookmark}
                className={`p-2 transition-colors rounded-full ${
                  isBookmarked ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-500 dark:text-gray-400 hover:text-yellow-400'
                }`}
                title={isBookmarked ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
              >
                {isBookmarked ? <Bookmark className="fill-current" size={18} /> : <Bookmark size={18} />}
              </button>
              
              {onPlay && (
                <button
                  onClick={onPlay}
                  className={`p-2 transition-colors rounded-full ${
                    isPlaying ? 'text-accent-light' : 'text-gray-500 dark:text-gray-400 hover:text-accent-light'
                  }`}
                  title="تشغيل"
                >
                  <Play size={18} />
                </button>
              )}
            </div>

          <AnimatePresence>
          {showNote && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="border-t border-gray-200 dark:border-space-100/50 pt-4"
            >
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t('note_placeholder')}
                className="w-full p-3 border border-gray-300 dark:border-space-100 bg-gray-100 dark:bg-space-200/50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm text-gray-800 dark:text-gray-200"
                rows={3}
              />
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </motion.div>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        textToShare={shareData.text}
        urlToShare={shareData.url}
        title={t('share_modal_title')}
      />
    </>
  );
}
