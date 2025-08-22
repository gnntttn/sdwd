import axios from 'axios';
import { Surah, Verse, Reciter, SearchResult } from '../types/quran';

const API_BASE_URL = 'https://api.quran.com/api/v4';

class QuranApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  async getSurahs(): Promise<Surah[]> {
    try {
      const response = await this.api.get('/chapters?language=ar');
      return response.data.chapters.map((chapter: any) => ({
        id: chapter.id,
        name: chapter.name_simple,
        nameArabic: chapter.name_arabic,
        nameEnglish: chapter.name_simple,
        versesCount: chapter.verses_count,
        type: chapter.revelation_place === 'makkah' ? 'meccan' : 'medinan',
        bismillahPre: chapter.bismillah_pre,
      }));
    } catch (error) {
      console.error('Error fetching surahs:', error);
      return this.getFallbackSurahs();
    }
  }

  async getSurah(surahId: number): Promise<Surah | null> {
    try {
        const response = await this.api.get(`/chapters/${surahId}?language=ar`);
        const chapter = response.data.chapter;
        return {
            id: chapter.id,
            name: chapter.name_simple,
            nameArabic: chapter.name_arabic,
            nameEnglish: chapter.name_simple,
            versesCount: chapter.verses_count,
            type: chapter.revelation_place === 'makkah' ? 'meccan' : 'medinan',
            bismillahPre: chapter.bismillah_pre,
        };
    } catch (error) {
        console.error(`Error fetching surah ${surahId}:`, error);
        return null;
    }
  }

  private mapVerse(verse: any): Verse {
    return {
      id: verse.id,
      verseKey: verse.verse_key,
      verseNumber: verse.verse_number,
      textUthmani: verse.text_uthmani,
      textSimple: verse.text_simple,
      translations: verse.translations?.map((t: any) => ({
        id: t.id,
        resource_id: parseInt(t.resource_id, 10),
        text: t.text,
        resourceName: t.resource_name,
        languageName: t.language_name,
      })),
      audio: verse.audio ? {
        url: verse.audio.url,
        duration: verse.audio.duration,
      } : undefined,
      page: verse.page_number,
      juz: verse.juz_number,
      hizb: verse.hizb_number,
    };
  }

  async getAllVersesBySurah(surahId: number, options?: { translations?: string; audio?: string; }): Promise<Verse[]> {
    let allVerses: Verse[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      try {
        const params = new URLSearchParams();
        if (options?.translations) params.append('translations', options.translations);
        if (options?.audio) params.append('audio', options.audio);
        params.append('fields', 'text_uthmani,text_simple');
        params.append('per_page', '50');
        params.append('page', currentPage.toString());

        const response = await this.api.get(`/verses/by_chapter/${surahId}?${params.toString()}`);
        
        const fetchedVerses = response.data.verses.map(this.mapVerse);

        allVerses = [...allVerses, ...fetchedVerses];

        if (response.data.pagination.next_page) {
          currentPage = response.data.pagination.next_page;
        } else {
          hasMorePages = false;
        }
      } catch (error) {
        console.error(`Error fetching page ${currentPage} for surah ${surahId}:`, error);
        hasMorePages = false;
      }
    }
    return allVerses;
  }

  async getVersesByJuz(juzId: number, options?: { translations?: string; audio?: string; }): Promise<Verse[]> {
    try {
        const params = new URLSearchParams();
        if (options?.translations) params.append('translations', options.translations);
        if (options?.audio) params.append('audio', options.audio);
        params.append('fields', 'text_uthmani,text_simple');

        const response = await this.api.get(`/verses/by_juz/${juzId}?${params}`);
        
        return response.data.verses.map(this.mapVerse);
    } catch (error) {
        console.error(`Error fetching verses for Juz ${juzId}:`, error);
        return [];
    }
  }

  async getVerseByKey(verseKey: string, options?: { translations?: string; audio?: string; }): Promise<{ verse: Verse } | null> {
    try {
        const params = new URLSearchParams();
        if (options?.translations) params.append('translations', options.translations);
        if (options?.audio) params.append('audio', options.audio);
        params.append('fields', 'text_uthmani,text_simple');

        const response = await this.api.get(`/verses/by_key/${verseKey}?${params}`);
        const verseData = response.data.verse;
        return {
            verse: this.mapVerse(verseData)
        };
    } catch (error) {
        console.error(`Error fetching verse by key ${verseKey}:`, error);
        return null;
    }
  }

  async getReciters(): Promise<Reciter[]> {
    let allReciters: Reciter[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      try {
        const response = await this.api.get('/resources/recitations', {
          params: {
            language: 'ar',
            page: currentPage,
            per_page: 50
          }
        });
        
        const fetchedReciters = response.data.recitations.map((reciter: any) => ({
          id: reciter.id,
          name: reciter.reciter_name,
          nameArabic: reciter.translated_name.name,
          style: reciter.style,
        }));
        allReciters = [...allReciters, ...fetchedReciters];

        if (response.data.pagination && response.data.pagination.next_page) {
          currentPage = response.data.pagination.next_page;
        } else {
          hasMorePages = false;
        }
      } catch (error) {
        console.error(`Error fetching page ${currentPage} for reciters:`, error);
        hasMorePages = false;
        if (currentPage === 1) {
            return this.getFallbackReciters();
        }
      }
    }
    return allReciters.length > 0 ? allReciters : this.getFallbackReciters();
  }

  async searchVerses(query: string, options?: {
    size?: number;
    page?: number;
    translation?: string;
  }): Promise<SearchResult[]> {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      if (options?.size) params.append('size', options.size.toString());
      if (options?.page) params.append('page', options.page.toString());
      if (options?.translation) params.append('translation', options.translation);

      const response = await this.api.get(`/search?${params}`);
      
      return response.data.search.results.map((result: any) => ({
        verse: {
          id: result.verse_id,
          verseKey: result.verse_key,
          verseNumber: parseInt(result.verse_key.split(':')[1]),
          textUthmani: result.text,
          textSimple: result.text,
          translations: result.translations?.map((t: any) => ({ text: t.text, resourceName: t.name })),
        },
        surah: {
          id: parseInt(result.verse_key.split(':')[0]),
          name: result.chapter_name,
          nameArabic: result.chapter_name,
        },
        highlights: result.highlighted || [],
      }));
    } catch (error) {
      console.error('Error searching verses:', error);
      return [];
    }
  }

  private getFallbackSurahs(): Surah[] {
    return [
      { id: 1, name: 'الفاتحة', nameArabic: 'الفاتحة', nameEnglish: 'Al-Fatihah', versesCount: 7, type: 'meccan' },
      { id: 2, name: 'البقرة', nameArabic: 'البقرة', nameEnglish: 'Al-Baqarah', versesCount: 286, type: 'medinan' },
      { id: 3, name: 'آل عمران', nameArabic: 'آل عمران', nameEnglish: 'Aal-E-Imran', versesCount: 200, type: 'medinan' },
    ];
  }

  private getFallbackReciters(): Reciter[] {
    return [
      { id: 7, name: 'Mishari Rashid al-`Afasy', nameArabic: 'مشاري راشد العفاسي', style: 'Murattal' },
      { id: 4, name: 'Mahmud Khalil Al-Husary', nameArabic: 'محمود خليل الحصري', style: 'Murattal' },
      { id: 1, name: 'AbdulBaset AbdulSamad', nameArabic: 'عبد الباسط عبد الصمد', style: 'Murattal' },
    ];
  }
}

export const quranApi = new QuranApiService();
