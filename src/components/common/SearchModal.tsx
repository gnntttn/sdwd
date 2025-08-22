import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowLeft } from 'lucide-react';
import { quranApi } from '../../services/quranApi';
import { SearchResult } from '../../types/quran';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { t, dir } = useLanguage();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const searchDebounce = setTimeout(() => {
      if (query.trim().length >= 2) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(searchDebounce);
  }, [query]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const searchResults = await quranApi.searchVerses(query, { size: 10 });
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(`/surah/${result.surah.id}?verse=${result.verse.verseNumber}`);
    onClose();
  };

  const highlightText = (text: string, highlights: string[]) => {
    if (!highlights || highlights.length === 0) return text;
    
    let highlightedText = text;
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-primary/20 dark:bg-primary/30 text-accent-light rounded-sm px-1">$1</mark>');
    });
    
    return highlightedText;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-50/80 dark:bg-space-300/80 backdrop-blur-md z-50 flex items-start justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white/80 dark:bg-space-200/80 backdrop-blur-lg border border-gray-200 dark:border-space-100/50 rounded-2xl shadow-lg dark:shadow-glow-lg w-full max-w-2xl mt-20"
            onClick={(e) => e.stopPropagation()}
            dir={dir}
          >
            {/* Header */}
            <div className="flex items-center border-b border-gray-200 dark:border-space-100/50 p-4">
              <div className="flex-1 relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t('search_placeholder')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pr-12 pl-4 py-3 border border-gray-300 dark:border-space-100 bg-gray-100/50 dark:bg-space-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 dark:text-gray-200"
                />
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-accent-light hover:bg-gray-200 dark:hover:bg-space-100/50 rounded-full transition-colors mx-2"
              >
                <X size={24} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-light mx-auto"></div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">جاري البحث...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="p-4 space-y-3">
                  {results.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 border border-gray-200 dark:border-space-100/50 bg-white/30 dark:bg-space-200/30 rounded-lg hover:border-primary-light dark:hover:border-accent-dark hover:shadow-md dark:hover:shadow-glow-sm cursor-pointer transition-all"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-primary-dark dark:text-primary-light font-sans-arabic">
                          سورة {result.surah.nameArabic} - آية {result.verse.verseNumber}
                        </span>
                        <ArrowLeft size={16} className="text-gray-400" />
                      </div>
                      <div 
                        className="text-lg leading-relaxed text-right font-arabic text-gray-800 dark:text-gray-200"
                        dangerouslySetInnerHTML={{ 
                          __html: highlightText(result.verse.textUthmani, result.highlights) 
                        }}
                      />
                      {result.verse.translations && result.verse.translations[0] && (
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          {result.verse.translations[0].text}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : query.trim().length >= 2 ? (
                <div className="p-8 text-center text-gray-500">
                  {t('no_results_found')}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  اكتب كلمتين على الأقل للبحث
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
