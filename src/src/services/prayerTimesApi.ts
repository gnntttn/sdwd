import axios from 'axios';
import { PrayerTimes } from '../types/quran';

class PrayerTimesService {
  private api = axios.create({
    baseURL: 'https://api.aladhan.com/v1',
    timeout: 5000,
  });

  async getPrayerTimes(lat: number, lng: number, method: number = 2): Promise<PrayerTimes | null> {
    try {
      const response = await this.api.get(`/timings?latitude=${lat}&longitude=${lng}&method=${method}`);
      const timings = response.data.data.timings;
      const date = response.data.data.date;

      return {
        fajr: timings.Fajr,
        sunrise: timings.Sunrise,
        dhuhr: timings.Dhuhr,
        asr: timings.Asr,
        maghrib: timings.Maghrib,
        isha: timings.Isha,
        date: date.readable,
        hijriDate: date.hijri.date,
      };
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      return null;
    }
  }

  async getQiblaDirection(lat: number, lng: number): Promise<number | null> {
    try {
      const response = await this.api.get(`/qibla/${lat}/${lng}`);
      return response.data.data.direction;
    } catch (error) {
      console.error('Error fetching qibla direction:', error);
      return null;
    }
  }
}

export const prayerTimesService = new PrayerTimesService();
