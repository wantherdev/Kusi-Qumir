import {
  Tour,
  TourDifficulty,
  TourGroupType,
  TourOperationType,
  TourServiceType,
} from '../../tours/domain/tour.model';

export type TourDayDraft = {
  title: string;
  activities: { time: string; title: string; description: string; duration: number }[];
};

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
  itinerary: TourDayDraft[];
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
    draft.itinerary.length > 30 ||
    draft.itinerary.some(
      (day) =>
        !day.title.trim() ||
        day.title.length > 150 ||
        !day.activities.length ||
        day.activities.length > 60 ||
        day.activities.some(
          (activity) =>
            !activity.title.trim() ||
            activity.title.length > 200 ||
            activity.time.length > 80 ||
            activity.description.length > 6000 ||
            !Number.isFinite(activity.duration) ||
            activity.duration < 0,
        ),
    )
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
      title: day.title.trim(),
      activities: day.activities.map((activity, sortOrder) => ({
        title: activity.title.trim(),
        ...(activity.time.trim() ? { time: activity.time.trim() } : {}),
        description: activity.description.trim(),
        duration: activity.duration,
        sortOrder,
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

export function tourToDraft(tour: Tour): TourDraft {
  const image = tour.images.find((item) => item.featured) ?? tour.images[0];
  return {
    title: tour.title,
    slug: tour.slug,
    code: tour.code,
    subtitle: tour.subtitle ?? '',
    shortDescription: tour.shortDescription,
    description: tour.description,
    durationHours: tour.durationHours,
    difficulty: tour.difficulty,
    groupType: tour.groupType,
    serviceType: tour.serviceType,
    operationType: tour.operationType,
    categorySlug: tour.categorySlug,
    featured: tour.featured,
    adult: tour.prices[0]?.adult ?? 0,
    child: tour.prices[0]?.child ?? null,
    imageUrl: image?.url ?? '',
    imageAlt: image?.alt ?? '',
    includes: tour.includes.map((item) => item.title).join('\n'),
    excludes: tour.excludes.map((item) => item.title).join('\n'),
    requirements: tour.requirements.map((item) => item.requirement).join('\n'),
    recommendations: tour.recommendations.map((item) => item.title).join('\n'),
    itinerary: tour.itineraryDays.map((day) => ({
      title: day.title,
      activities: day.activities.map((activity) => ({
        title: activity.title,
        time: activity.time ?? '',
        description: activity.description,
        duration: activity.duration,
      })),
    })),
  };
}

// Only changed form fields are patched. Rich details and additional tariffs/images survive edits.
export function buildTourUpdate(original: Tour, draft: TourDraft): Partial<Tour> {
  const before = tourToDraft(original);
  const next = buildTourDraft(draft);
  const patch: Partial<Tour> = {};
  const scalarFields = [
    'title',
    'slug',
    'code',
    'subtitle',
    'shortDescription',
    'description',
    'durationHours',
    'difficulty',
    'groupType',
    'serviceType',
    'operationType',
    'categorySlug',
    'featured',
  ] as const;
  for (const field of scalarFields) {
    if (draft[field] !== before[field]) Object.assign(patch, { [field]: next[field] });
  }
  if (draft.adult !== before.adult || draft.child !== before.child) {
    if (original.prices[0]?.currency !== 'PEN')
      throw new Error(
        'La tarifa existente no está en soles. Conserva su precio y consulta la conversión antes de editarlo.',
      );
    const first = { ...original.prices[0], adult: draft.adult };
    if (draft.child === null) delete first.child;
    else first.child = draft.child;
    patch.prices = [first, ...original.prices.slice(1)];
  }
  if (draft.imageUrl !== before.imageUrl || draft.imageAlt !== before.imageAlt) {
    const selected = original.images.findIndex((image) => image.featured);
    const index = selected < 0 ? 0 : selected;
    patch.images = original.images.length
      ? original.images.map((image, i) =>
          i === index
            ? { ...image, url: draft.imageUrl.trim(), alt: draft.imageAlt.trim() }
            : image,
        )
      : next.images;
  }
  for (const field of ['includes', 'excludes', 'recommendations'] as const) {
    if (draft[field] !== before[field]) {
      const entries = lines(draft[field]).map((title, index, titles) => {
        const previous =
          original[field].find((item) => item.title === title) ??
          (original[field].length === titles.length ? original[field][index] : undefined);
        return { ...previous, title };
      });
      if (field === 'recommendations')
        patch.recommendations = entries.map((entry) => ({
          ...entry,
          description: entry.description ?? '',
        }));
      else patch[field] = entries;
    }
  }
  if (draft.requirements !== before.requirements) patch.requirements = next.requirements;
  if (JSON.stringify(next.itineraryDays) !== JSON.stringify(buildTourDraft(before).itineraryDays)) {
    patch.durationDays = draft.itinerary.length;
    patch.itineraryDays = next.itineraryDays;
  }
  return patch;
}
