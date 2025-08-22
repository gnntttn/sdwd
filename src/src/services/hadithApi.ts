import axios from 'axios';
import { Hadith } from '../types/hadith';

const API_BASE_URL = 'https://hadith-api.onrender.com/api';

interface RawHadithApiResponse {
  hadith: {
    hadith_id: string;
    book_slug: string;
    book_name: string;
    chapter_id: string;
    chapter_title: string;
    hadith_narrated: string;
    hadith_text_en: string;
    hadith_text_ar: string;
    hadith_url: string;
  };
}

class HadithApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  async getRandomBukhariHadith(): Promise<Hadith | null> {
    try {
      const response = await this.api.get<RawHadithApiResponse>('/hadiths/random/en/bukhari');
      const rawData = response.data.hadith;

      if (rawData && rawData.hadith_text_ar) {
        return {
          id: rawData.hadith_id,
          hadith_english: rawData.hadith_text_en,
          hadith_arabic: rawData.hadith_text_ar,
          chapter_english: rawData.chapter_title.replace(/^Chapter: /, ''),
          chapter_arabic: '', // Arabic chapter name is not available from this API
          book_english: rawData.book_name,
          book_arabic: 'صحيح البخاري', // Hardcode Arabic book name
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching or processing random hadith:', error);
      return null;
    }
  }
}

export const hadithApi = new HadithApiService();
