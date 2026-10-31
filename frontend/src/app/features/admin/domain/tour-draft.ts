import {
  Tour,
  TourDifficulty,
  TourGroupType,
  TourOperationType,
  TourServiceType,
} from '../../tours/domain/tour.model';

export type TourDraft = {
  title: string;
  slug: string;
  code: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  durationHours: number;
  difficulty: TourDifficulty;
  groupType: TourGroupType;
  serviceType: TourServiceType;
  operationType: TourOperationType;
  categorySlug: string;
  featured: boolean;
  adult: number;
  child: number | null;
  imageUrl: string;
  imageAlt: string;
  includes: string;
  excludes: string;
  requirements: string;
  recommendations: string;
  itinerary: string[];
};

export function slugFromTitle(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
}
export function safeImageUrl(value: string): boolean {
  if (
    /^\/assets\/images\/[a-zA-Z0-9_./-]+\.(webp|png|jpe?g|avif)$/i.test(value) &&
    !value.includes('..')
  )
    return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}
const lines = (value: string): string[] =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

export function buildTourDraft(draft: TourDraft): Tour & { active: false } {
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug) ||
    !draft.title.trim() ||
    !draft.code.trim() ||
    !draft.shortDescription.trim() ||
    !draft.description.trim() ||
    !draft.imageAlt.trim() ||
    !safeImageUrl(draft.imageUrl.trim()) ||
    !Number.isFinite(draft.adult) ||
    draft.adult <= 0 ||
    !Number.isInteger(draft.durationHours) ||
    draft.durationHours < 1 ||
    (draft.child !== null && (!Number.isFinite(draft.child) || draft.child < 0)) ||
    !draft.itinerary.length ||
    draft.itinerary.some((day) => !day.trim())
  ) {
    throw new Error('Revisa los campos obligatorios, la imagen, el precio y el itinerario.');
  }
  return {
    title: draft.title.trim(),
    slug: draft.slug,
    code: draft.code.trim().toUpperCase(),
    subtitle: draft.subtitle.trim() || null,
    shortDescription: draft.shortDescription.trim(),
    description: draft.description.trim(),
    durationHours: draft.durationHours,
    durationDays: draft.itinerary.length,
    difficulty: draft.difficulty,
    groupType: draft.groupType,
    serviceType: draft.serviceType,
    operationType: draft.operationType,
    categorySlug: draft.categorySlug,
    featured: draft.featured,
    active: false,
    prices: [
      {
        name: 'Tarifa referencial',
        currency: 'PEN',
        adult: draft.adult,
        ...(draft.child !== null ? { child: draft.child } : {}),
      },
    ],
    images: [
      { url: draft.imageUrl.trim(), alt: draft.imageAlt.trim(), featured: true, sortOrder: 0 },
    ],
    itineraryDays: draft.itinerary.map((day, index) => ({
      day: index + 1,
      title: `Día ${index + 1}`,
      activities: lines(day).map((title, sortOrder) => ({
        title,
        description: '',
        sortOrder,
        duration: 0,
      })),
    })),
    includes: lines(draft.includes).map((title) => ({ title })),
    excludes: lines(draft.excludes).map((title) => ({ title })),
    requirements: lines(draft.requirements).map((requirement) => ({ requirement })),
    recommendations: lines(draft.recommendations).map((title) => ({ title, description: '' })),
    recommendedFor: [],
    faqs: [],
    destinations: [],
    seo: null,
  };
}
