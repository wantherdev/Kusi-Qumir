export type TourDifficulty = 'Facil' | 'Moderada' | 'Exigente';
export type TourGroupType = 'Compartido' | 'Privado';
export type TourServiceType = 'MedioDia' | 'DiaCompleto' | 'VariosDias';
export type TourOperationType = 'PROPIO' | 'TERCERO';

export type TourPrice = {
  name: string;
  currency: string;
  adult: number;
  child?: number;
  private?: number;
};

export type TourActivity = {
  sortOrder: number;
  time?: string;
  title: string;
  description: string;
  duration: number;
};

export type TourItineraryDay = {
  day: number;
  title: string;
  activities: TourActivity[];
};

export type TourItem = {
  title: string;
  description?: string;
};

export type TourFaq = {
  question: string;
  answer: string;
  sortOrder: number;
};

export type TourRecommendation = {
  title: string;
  description: string;
};

export type TourRequirement = {
  requirement: string;
};

export type TourImage = {
  url: string;
  alt: string;
  featured: boolean;
  sortOrder: number;
};

export type TourSeo = {
  title: string;
  description: string;
  keywords: string[];
};

export type TourDestination = {
  key: string;
  sortOrder: number;
};

export type Tour = {
  slug: string;
  code: string;
  title: string;
  subtitle: string | null;
  shortDescription: string;
  description: string;
  durationHours: number;
  durationDays: number;
  difficulty: TourDifficulty;
  groupType: TourGroupType;
  serviceType: TourServiceType;
  operationType: TourOperationType;
  featured: boolean;
  categorySlug: string;
  recommendedFor: string[];
  prices: TourPrice[];
  itineraryDays: TourItineraryDay[];
  includes: TourItem[];
  excludes: TourItem[];
  faqs: TourFaq[];
  recommendations: TourRecommendation[];
  requirements: TourRequirement[];
  images: TourImage[];
  seo: TourSeo | null;
  destinations: TourDestination[];
};

export type TourSummary = Pick<
  Tour,
  | 'slug'
  | 'code'
  | 'title'
  | 'subtitle'
  | 'shortDescription'
  | 'durationHours'
  | 'durationDays'
  | 'difficulty'
  | 'groupType'
  | 'serviceType'
  | 'operationType'
  | 'featured'
  | 'categorySlug'
  | 'prices'
  | 'images'
>;
