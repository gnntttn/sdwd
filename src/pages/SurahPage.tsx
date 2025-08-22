import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Settings } from 'lucide-react';
import { quranApi } from '../services/quranApi';
import { Surah, Verse, Reciter } from '../types/quran';
import { VerseCard } from '../components/quran/VerseCard';
import { AudioPlayer } from '../components/audio/AudioPlayer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SurahSettingsPanel } from '../components/quran/SurahSettingsPanel';
import { useLanguage } from '../context/LanguageContext';
import { TAFSIR_RESOURCE_ID, translationMap } from '../lib/i18n';

const AUDIO_BASE_URL = 'https://verses.quran.com/';

export function SurahPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const highlightVerse = searchParams.get('verse');
  const { t, language, dir } = useLanguage();

  const [surah, setSurah] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [selectedReciter, setSelectedReciter] = useLocalStorage<string>('selected-reciter-id', '7');
  const [showTranslations, setShowTranslations] = useLocalStorage('show-translations', true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [currentPlayingVerse, setCurrentPlayingVerse] = useState<number | null>(null);
  const [audioSrc, setAudioSrc] = useState<string>('');

  useEffect(() => {
    const fetchInitialData = async () => {
      const recitersData = await quranApi.getReciters();
      setReciters(recitersData);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (id) {
      loadSurahData(parseInt(id));
    }
  }, [id, selectedReciter, language]);

  useEffect(() => {
    if (highlightVerse && !loading) {
      setTimeout(() => {
        const element = document.getElementById(`verse-${highlightVerse}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [highlightVerse, loading]);

  const loadSurahData = async (surahId: number) => {
    setLoading(true);
    setCurrentPlayingVerse(null);
    setAudioSrc('');
    try {
      const surahData = await quranApi.getSurah(surahId);
      setSurah(surahData);

      const translationIds = [translationMap[language], TAFSIR_RESOURCE_ID.toString()].filter(Boolean).join(',');

      const versesData = await quranApi.getAllVersesBySurah(surahId, {
        translations: translationIds,
        audio: selectedReciter,
      });
      setVerses(versesData);
    } catch (error) {
      console.error('Error loading surah data:', error);
    } finally {
      setLoading(false);
    }
  };

  const playVerseAudio = (verse: Verse) => {
    if (verse.audio?.url) {
      setCurrentPlayingVerse(verse.verseNumber);
      setAudioSrc(`${AUDIO_BASE_URL}${verse.audio.url}`);
    } else {
      console.warn(`Audio not available for Surah ${surah?.id}, Verse ${verse.verseNumber} with selected reciter.`);
    }
  };
  
  const handleVersePlay = (verse: Verse) => {
    if (currentPlayingVerse === verse.verseNumber) {
      setCurrentPlayingVerse(null);
      setAudioSrc('');
    } else {
      playVerseAudio(verse);
    }
  };

  const handleNextVerse = () => {
    if (!currentPlayingVerse || !verses.length) return;
    const currentIndex = verses.findIndex(v => v.verseNumber === currentPlayingVerse);
    const nextIndex = currentIndex + 1;
    if (nextIndex < verses.length) {
      playVerseAudio(verses[nextIndex]);
    } else {
      setCurrentPlayingVerse(null);
      setAudioSrc('');
    }
  };

  const handlePreviousVerse = () => {
    if (!currentPlayingVerse || !verses.length) return;
    const currentIndex = verses.findIndex(v => v.verseNumber === currentPlayingVerse);
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      playVerseAudio(verses[prevIndex]);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-light mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">{t('loading_surah')}</p>
        </div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">{t('surah_not_found')}</p>
      </div>
    );
  }

  const ArrowIcon = dir === 'rtl' ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen pb-32">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-space-200/50 backdrop-blur-lg border border-gray-200 dark:border-space-100/50 rounded-xl shadow-lg p-4 mb-6 sticky top-20 z-30"
        >
          <div className="flex items-center justify-between">
            <Link
              to="/surahs"
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-accent-light hover:bg-gray-200 dark:hover:bg-space-100/50 rounded-full transition-colors"
            >
              <ArrowIcon size={20} />
            </Link>
            
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 font-arabic">
                سورة {surah.nameArabic}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {surah.versesCount} {t('verse')}
              </p>
            </div>
            
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-accent-light hover:bg-gray-200 dark:hover:bg-space-100/50 rounded-full transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
        </motion.div>

        {surah.id !== 1 && surah.id !== 9 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-6"
          >
            <p className="text-2xl font-arabic text-gray-800 dark:text-gray-200">
              {t('bismillah')}
            </p>
          </motion.div>
        )}

        <div className="space-y-4">
          {verses.map((verse, index) => (
            <div
              key={verse.id}
              id={`verse-${verse.verseNumber}`}
              className={`rounded-xl transition-all duration-300 ${highlightVerse === verse.verseNumber.toString() ? 'ring-2 ring-accent-light shadow-lg dark:shadow-glow-md' : ''}`}
            >
              <VerseCard
                verse={verse}
                surah={surah}
                index={index}
                isPlaying={currentPlayingVerse === verse.verseNumber}
                onPlay={() => handleVersePlay(verse)}
                showTranslation={showTranslations && language !== 'ar'}
              />
            </div>
          ))}
        </div>
      </div>

      <SurahSettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        reciters={reciters}
        selectedReciter={selectedReciter}
        onReciterChange={setSelectedReciter}
        showTranslations={showTranslations}
        onShowTranslationsChange={setShowTranslations}
      />

      {audioSrc && currentPlayingVerse && (
        <AudioPlayer
          src={audioSrc}
          title={`${t('surah')} ${surah.nameArabic} - ${t('verse')} ${currentPlayingVerse}`}
          onNext={handleNextVerse}
          onPrevious={handlePreviousVerse}
          onEnded={handleNextVerse}
          autoPlay
        />
      )}
    </div>
  );
}
