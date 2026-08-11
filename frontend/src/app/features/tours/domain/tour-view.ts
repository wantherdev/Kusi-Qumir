import { Tour, TourSummary } from './tour.model';

const categoryImages: Record<string, string> = {
  cultural: '/assets/images/experience-cusco-city.webp',
  historia: '/assets/images/experience-sacred-valley.webp',
  naturaleza: '/assets/images/experience-high-andes.webp',
  aventura: '/assets/images/experience-high-andes.webp',
};

const difficultyLabels = {
  Easy: 'Fácil',
  Moderate: 'Moderada',
  Challenging: 'Exigente',
} as const;

export function tourImage(tour: TourSummary): string {
  const featuredImage = tour.images.find((image) => image.featured) ?? tour.images[0];
  return featuredImage?.url ?? categoryImages[tour.categorySlug] ?? categoryImages['cultural'];
}

export function tourDifficulty(tour: TourSummary): string {
  return difficultyLabels[tour.difficulty];
}

export function tourDuration(tour: TourSummary): string {
  return tour.durationDays > 1
    ? `${tour.durationDays} días`
    : `${tour.durationHours} ${tour.durationHours === 1 ? 'hora' : 'horas'}`;
}

export function tourStartingPrice(tour: TourSummary): Tour['prices'][number] | null {
  return tour.prices.reduce<Tour['prices'][number] | null>(
    (lowest, price) => (!lowest || price.adult < lowest.adult ? price : lowest),
    null,
  );
}
