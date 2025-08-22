import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  requestLocation: () => void;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  const requestLocation = useCallback(() => {
    setState({
      latitude: null,
      longitude: null,
      error: null,
      loading: true,
    });

    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'الموقع الجغرافي غير مدعوم في هذا المتصفح.',
        loading: false,
      }));
      return;
    }
    
    if (typeof window !== 'undefined' && !window.isSecureContext) {
       setState(prev => ({
        ...prev,
        error: 'يجب استخدام الموقع عبر اتصال آمن (HTTPS) لتفعيل خدمة تحديد الموقع.',
        loading: false,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let errorMessage = 'لم نتمكن من الوصول إلى موقعك. يرجى التحقق من أذونات المتصفح.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'لقد رفضت الإذن بالوصول إلى موقعك. يرجى تمكينه من إعدادات المتصفح والمحاولة مرة أخرى.';
        }
        setState(prev => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { ...state, requestLocation };
}
