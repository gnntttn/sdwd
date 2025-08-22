export interface Surah {
  id: number;
  name: string;
  nameArabic: string;
  nameEnglish: string;
  versesCount: number;
  type: 'meccan' | 'medinan';
  bismillahPre?: boolean;
}

export interface Verse {
  id: number;
  verseKey: string;
  verseNumber: number;
  textUthmani: string;
  textSimple: string;
  translations?: Translation[];
  audio?: VerseAudio;
  page?: number;
  juz?: number;
  hizb?: number;
}

export interface Translation {
  id?: number;
  resource_id?: number;
  text: string;
  resourceName: string;
  languageName?: string;
}

export interface VerseAudio {
  url: string;
  duration?: number;
}

export interface Reciter {
  id: number;
  name: string;
  nameArabic: string;
  style?: string;
  qiraat?: string;
}

export interface SearchResult {
  verse: Verse;
  surah: Surah;
  highlights: string[];
}
