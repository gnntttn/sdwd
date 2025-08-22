import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Headphones, Compass, Settings, ArrowRight, ArrowLeft, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../lib/i18n';

interface OnboardingProps {
  onComplete: () => void;
}

const onboardingSlides = [
  {
    icon: BookOpen,
    titleKey: 'onboarding_welcome_title',
    descriptionKey: 'onboarding_welcome_desc',
  },
  {
    icon: Headphones,
    titleKey: 'onboarding_read_title',
    descriptionKey: 'onboarding_read_desc',
  },
  {
    icon: Compass,
    titleKey: 'onboarding_explore_title',
    descriptionKey: 'onboarding_explore_desc',
  },
  {
    icon: Settings,
    titleKey: 'onboarding_personalize_title',
    descriptionKey: 'onboarding_personalize_desc',
  },
] as const;


export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const { t, dir, setLanguage } = useLanguage();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const nextStep = () => {
    if (step < onboardingSlides.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  };

  const handleDragEnd = (event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    const swipeThreshold = 50;
    const velocityThreshold = 500;

    if (dir === 'ltr') {
        if (offset < -swipeThreshold || velocity < -velocityThreshold) {
            if (step < onboardingSlides.length - 1) setStep(step + 1);
        } else if (offset > swipeThreshold || velocity > velocityThreshold) {
            if (step > 0) setStep(step - 1);
        }
    } else { // RTL
        if (offset > swipeThreshold || velocity > velocityThreshold) {
            if (step < onboardingSlides.length - 1) setStep(step + 1);
        } else if (offset < -swipeThreshold || velocity < -velocityThreshold) {
            if (step > 0) setStep(step - 1);
        }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-space-300 z-50 flex flex-col justify-between p-8" dir={dir}>
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <div className="relative">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-accent-light hover:bg-gray-200 dark:hover:bg-space-200/50 rounded-full transition-all"
            title="Change Language"
          >
            <Globe size={20} />
          </button>
          <AnimatePresence>
            {isLangMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className={`absolute top-full mt-2 w-32 bg-white dark:bg-space-200 border border-gray-200 dark:border-space-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 text-gray-800 dark:text-gray-200 ${dir === 'rtl' ? 'right-0' : 'left-0'}`}
              >
                <button onClick={() => changeLanguage('ar')} className="block w-full text-right px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-space-100/50">العربية</button>
                <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-space-100/50">English</button>
                <button onClick={() => changeLanguage('fr')} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-space-100/50">Français</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <button
          onClick={onComplete}
          className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-accent-light transition-colors rounded-full"
        >
          {t('onboarding_skip')}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          className="flex w-full h-full"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.5}
          onDragEnd={handleDragEnd}
          animate={{ x: `${dir === 'rtl' ? '' : '-'}${step * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {onboardingSlides.map((slide, index) => {
            const Icon = slide.icon;
            return (
              <motion.div key={index} className="w-full h-full flex-shrink-0 flex flex-col items-center justify-center text-center px-4">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-8 p-6 bg-primary/10 dark:bg-primary/20 rounded-full"
                >
                  <Icon className="text-primary dark:text-accent-light" size={48} />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t(slide.titleKey)}</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-sm">{t(slide.descriptionKey)}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {onboardingSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setStep(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                step === index ? 'bg-primary dark:bg-accent-light w-6' : 'bg-gray-300 dark:bg-space-100'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextStep}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full shadow-lg dark:shadow-glow-md hover:bg-primary-dark dark:bg-accent-light dark:text-space-300 dark:hover:bg-white transition-all"
        >
          <span>{step === onboardingSlides.length - 1 ? t('onboarding_start') : t('onboarding_next')}</span>
          <ArrowIcon size={20} />
        </button>
      </div>
    </div>
  );
}
