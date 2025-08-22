import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/common/Header';
import { SearchModal } from './components/common/SearchModal';
import { HomePage } from './pages/HomePage';
import { SurahsPage } from './pages/SurahsPage';
import { SurahPage } from './pages/SurahPage';
import { JuzsPage } from './pages/JuzsPage';
import { JuzPage } from './pages/JuzPage';
import { RecitersPage } from './pages/RecitersPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { BottomNav } from './components/common/BottomNav';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Onboarding } from './components/onboarding/Onboarding';
import { NotificationPrompt } from './components/common/NotificationPrompt';

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage('hasCompletedOnboarding', false);

  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={() => setHasCompletedOnboarding(true)} />;
  }

  return (
    <Router>
      <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-space-300">
        <Header onSearchToggle={() => setIsSearchOpen(true)} />
        
        <main className="pb-24 pt-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/surahs" element={<SurahsPage />} />
            <Route path="/surah/:id" element={<SurahPage />} />
            <Route path="/juzs" element={<JuzsPage />} />
            <Route path="/juz/:id" element={<JuzPage />} />
            <Route path="/reciters" element={<RecitersPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
          </Routes>
        </main>

        <BottomNav />

        <SearchModal 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />

        <NotificationPrompt />
      </div>
    </Router>
  );
}

export default App;
