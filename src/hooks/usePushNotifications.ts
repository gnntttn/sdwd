import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        setPermissionStatus(Notification.permission);
    }
    
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setLoading(false);
      return;
    }

    navigator.serviceWorker.ready.then(registration => {
      registration.pushManager.getSubscription().then(sub => {
        if (sub) {
          setIsSubscribed(true);
        }
        setLoading(false);
      });
    });
  }, []);

  const requestPermissionAndSubscribe = async () => {
    if (permissionStatus === 'denied') {
      alert('لقد قمت بحظر الإشعارات. يرجى تمكينها من إعدادات المتصفح.');
      return;
    }

    const permission = await Notification.requestPermission();
    setPermissionStatus(permission);

    if (permission === 'granted') {
      await subscribeUser();
    }
  };

  const subscribeUser = async () => {
    if (!VAPID_PUBLIC_KEY) {
      console.error('VAPID public key not found.');
      return;
    }
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const { error } = await supabase
        .from('push_subscriptions')
        .insert({ subscription_data: sub.toJSON() });

      if (error) {
        console.error('Error saving subscription:', error);
        await sub.unsubscribe();
        return;
      }

      setIsSubscribed(true);
    } catch (error) {
      console.error('Failed to subscribe the user: ', error);
    }
  };

  return {
    isSubscribed,
    requestPermissionAndSubscribe,
    permissionStatus,
    loading,
  };
}
