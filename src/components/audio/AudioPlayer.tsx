import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioPlayerProps {
  src?: string;
  title?: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onEnded?: () => void;
  autoPlay?: boolean;
}

export function AudioPlayer({ 
  src, 
  title, 
  onNext, 
  onPrevious, 
  onEnded,
  autoPlay = false 
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onEnded]);

  useEffect(() => {
    if (src && autoPlay) {
      handlePlay();
    }
    if(!src) {
      setIsPlaying(false);
    }
  }, [src, autoPlay]);

  const handlePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio play error:', error);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!src) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white/80 dark:bg-space-300/80 backdrop-blur-lg border-t border-gray-200 dark:border-space-100/50 shadow-lg dark:shadow-glow-lg z-40"
      >
        <audio ref={audioRef} src={src} preload="metadata" />
        
        <div className="container mx-auto p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={onPrevious}
                disabled={!onPrevious}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-accent-light disabled:text-gray-300 dark:disabled:text-space-100 transition-colors rounded-full"
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={handlePlay}
                className="p-3 bg-accent-light text-space-300 rounded-full hover:bg-white transition-colors shadow-md dark:shadow-glow-md"
              >
                {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current" />}
              </button>

              <button
                onClick={onNext}
                disabled={!onNext}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-accent-light disabled:text-gray-300 dark:disabled:text-space-100 transition-colors rounded-full"
              >
                <SkipForward size={20} />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              {title && (
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate mb-1 text-center">{title}</p>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono w-10 text-center">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer slider"
                  style={{'--progress': `${(currentTime / duration) * 100}%`} as React.CSSProperties}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono w-10 text-center">{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
