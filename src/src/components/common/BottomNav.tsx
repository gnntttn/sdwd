import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookCopy, Bookmark, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function BottomNav() {
  const { t } = useLanguage();

  const navLinks = [
    { to: '/', text: t('home'), icon: Home },
    { to: '/surahs', text: t('surahs'), icon: BookCopy },
    { to: '/bookmarks', text: t('bookmarks'), icon: Bookmark },
    { to: '/prayer-times', text: t('prayerTimes'), icon: Clock },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 w-16 ${
      isActive ? 'text-accent-light' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-50/80 dark:bg-space-300/80 backdrop-blur-lg border-t border-gray-200 dark:border-space-200/50 z-40 md:hidden">
      <div className="container mx-auto px-4 h-16 flex items-center justify-around">
        {navLinks.map(link => {
          const Icon = link.icon;
          return (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              <Icon size={24} />
              <span className="text-xs font-medium">{link.text}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
