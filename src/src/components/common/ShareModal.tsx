import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  textToShare: string;
  urlToShare: string;
  title: string;
}

export function ShareModal({ isOpen, onClose, textToShare, urlToShare, title }: ShareModalProps) {
  const { t, dir } = useLanguage();
  const [linkCopied, setLinkCopied] = useState(false);
  const [textCopied, setTextCopied] = useState(false);

  const handleCopy = (content: string, type: 'link' | 'text') => {
    navigator.clipboard.writeText(content);
    if (type === 'link') {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } else {
      setTextCopied(true);
      setTimeout(() => setTextCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-50/80 dark:bg-space-300/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white/80 dark:bg-space-200/80 backdrop-blur-lg border border-gray-200 dark:border-space-100/50 rounded-2xl shadow-lg dark:shadow-glow-lg w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
            dir={dir}
          >
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-space-100/50 p-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
              <button onClick={onClose} className="p-2 text-gray-500 dark:text-gray-400 hover:text-accent-light hover:bg-gray-200 dark:hover:bg-space-100/50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('copy_text')}</label>
                <div className="relative">
                  <textarea
                    readOnly
                    value={textToShare}
                    className="w-full p-3 border border-gray-300 dark:border-space-100 bg-gray-100/50 dark:bg-space-300/50 rounded-lg resize-none text-gray-800 dark:text-gray-200 h-32 font-arabic text-lg"
                  />
                  <button
                    onClick={() => handleCopy(textToShare, 'text')}
                    className={`absolute top-2 p-2 bg-gray-200/50 dark:bg-space-100/50 hover:bg-gray-300 dark:hover:bg-space-100 rounded-md text-gray-600 dark:text-gray-300 hover:text-accent-light ${dir === 'rtl' ? 'left-2' : 'right-2'}`}
                  >
                    {textCopied ? <Check size={16} className="text-accent-light" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('copy_link')}</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={urlToShare}
                    className="w-full p-3 border border-gray-300 dark:border-space-100 bg-gray-100/50 dark:bg-space-300/50 rounded-lg text-gray-800 dark:text-gray-200"
                  />
                  <button
                    onClick={() => handleCopy(urlToShare, 'link')}
                    className={`absolute p-2 bg-gray-200/50 dark:bg-space-100/50 hover:bg-gray-300 dark:hover:bg-space-100 rounded-md text-gray-600 dark:text-gray-300 hover:text-accent-light ${dir === 'rtl' ? 'left-2' : 'right-2'}`}
                  >
                    {linkCopied ? <Check size={16} className="text-accent-light" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className={`border-t border-gray-200 dark:border-space-100/50 p-4 flex ${dir === 'rtl' ? 'justify-start' : 'justify-end'}`}>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors"
              >
                {t('close')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
