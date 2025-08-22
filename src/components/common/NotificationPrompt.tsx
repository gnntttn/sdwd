import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { usePushNotifications } from '../../hooks/usePushNotifications';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export function NotificationPrompt() {
  const { isSubscribed, requestPermissionAndSubscribe, permissionStatus, loading } = usePushNotifications();
  const [isDismissed, setIsDismissed] = useLocalStorage('notification-prompt-dismissed', false);

  const handleEnable = () => {
    requestPermissionAndSubscribe();
    setIsDismissed(true);
  };
  
  const handleDismiss = () => {
    setIsDismissed(true);
  };

  const shouldShow = !loading && !isSubscribed && !isDismissed && permissionStatus === 'default';

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 md:bottom-4 right-4 left-4 md:left-auto max-w-sm bg-white/80 dark:bg-space-200/80 backdrop-blur-lg border border-gray-200 dark:border-space-100/50 rounded-2xl shadow-lg dark:shadow-glow-lg z-50 p-4"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-full mt-1">
              <Bell className="text-primary dark:text-accent-light" size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 dark:text-gray-100">تفعيل الإشعارات اليومية</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                هل تود استقبال آية أو تسبيحة يومياً لتكون على صلة دائمة بالقرآن؟
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleEnable}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-sm font-semibold"
                >
                  نعم، تفعيل
                </button>
                <button
                  onClick={handleDismiss}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-space-100 dark:hover:bg-space-100/50 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm"
                >
                  لاحقاً
                </button>
              </div>
            </div>
            <button onClick={handleDismiss} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
