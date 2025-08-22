import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Settings } from 'lucide-react';
import { quranApi } from '../services/quranApi';
import { Surah, Verse } from '../types/quran';
import { VerseCard } from '../components/quran/VerseCard';
import { AudioPlayer } from '../components/audio/AudioPlayer';
import { useLanguage } from '../context/LanguageContext';
import { TAFSIR_RESOURCE_ID, translationMap } from '../lib/i18n';

const AUDIO_BASE_URL = 'https://verses.quran.com/';

export function JuzPage() {
  const { id } = useParams<{ id: string }>();
  const juzId = id ? parseInt(id, 10) : 0;
  const { t, language } = useLanguage();

  const [verses, setVerses] = useState<Verse[]>([]);
  const [surahMap, setSurahMap] = useState<Map<number, Surah>>(new Map());
  const [loading, setLoading] = useState(true);
  const [showTranslations, setShowTranslations] = useState(true);
  const [currentPlayingVerse, setCurrentPlayingVerse] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string>('');

  useEffect(() => {
    const fetchSurahMap = async () => {
      const surahs = await quranApi.getSurahs();
      const map = new Map<number, Surah>();
      surahs.forEach(s => map.set(s.id, s));
      setSurahMap(map);
    };
    fetchSurahMap();
  }, []);

  useEffect(() => {
    if (juzId > 0) {
      loadJuzData(juzId);
    }
  }, [juzId, language]);

  const loadJuzData = async (juzId: number) => {
    setLoading(true);
    try {
      const translationIds = [translationMap[language], TAFSIR_RESOURCE_ID.toString()].filter(Boolean).join(',');
      const versesData = await quranApi.getVersesByJuz(juzId, {
        translations: translationIds,
        audio: '7',
      });
      setVerses(versesData);
    } catch (error) {
      console.error(`Error loading juz ${juzId} data:`, error);
    } finally {
      setLoading(false);
    }
  };

  const playVerseAudio = (verse: Verse) => {
    if (verse.audio?.url) {
      setCurrentPlayingVerse(verse.verseKey);
      setAudioSrc(`${AUDIO_BASE_URL}${verse.audio.url}`);
    }
  };

  const handleVersePlay = (verse: Verse) => {
    if (currentPlayingVerse === verse.verseKey) {
      setCurrentPlayingVerse(null);
      setAudioSrc('');
    } else {
      playVerseAudio(verse);
    }
  };

  const handleNextVerse = () => {
    if (!currentPlayingVerse || !verses.length) return;
    const currentIndex = verses.findIndex(v => v.verseKey === currentPlayingVerse);
    const nextIndex = currentIndex + 1;
    if (nextIndex < verses.length) playVerseAudio(verses[nextIndex]);
  };

  const handlePreviousVerse = () => {
    if (!currentPlayingVerse || !verses.length) return;
    const currentIndex = verses.findIndex(v => v.verseKey === currentPlayingVerse);
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) playVerseAudio(verses[prevIndex]);
  };

  const getSurahFromVerse = (verse: Verse): Surah | undefined => {
    const surahId = parseInt(verse.verseKey.split(':')[0], 10);
    return surahMap.get(surahId);
  };

  if (loading || surahMap.size === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-light mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">{t('loading_juz')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-space-200/30 dark:backdrop-blur-sm border border-gray-200 dark:border-space-100/50 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <Link to="/juzs" className="flex items-center text-primary dark:text-primary-light hover:text-accent-light transition-colors">
              <ArrowRight size={20} className="ml-2" />
              {t('back_to_juzs')}
            </Link>
            <button
              onClick={() => setShowTranslations(!showTranslations)}
              className="flex items-center text-gray-700 dark:text-gray-300 hover:text-accent-light transition-colors"
            >
              <Settings size={20} className="ml-2" />
              {t(showTranslations ? 'hide_translation_label' : 'show_translation_label')}
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-arabic">
              {t('juz_title', { number: juzId })}
            </h1>
          </div>
        </motion.div>

        <div className="space-y-6">
          {verses.map((verse, index) => {
            const surah = getSurahFromVerse(verse);
            if (!surah) return null;
            return (
              <VerseCard
                key={verse.id}
                verse={verse}
                surah={surah}
                index={index}
                isPlaying={currentPlayingVerse === verse.verseKey}
                onPlay={() => handleVersePlay(verse)}
                showTranslation={showTranslations && language !== 'ar'}
              />
            );
          })}
        </div>
      </div>

      {audioSrc && currentPlayingVerse && (
        <AudioPlayer
          src={audioSrc}
          title={`${t('juz_title', { number: juzId })} - ${t('verse')} ${currentPlayingVerse.split(':')[1]}`}
          onNext={handleNextVerse}
          onPrevious={handlePreviousVerse}
          onEnded={handleNextVerse}
          autoPlay
        />
      )}
    </div>
  );
}
