import { Tour, TourSummary } from './tour.model';

const categoryImages: Record<string, string> = {
  cultural: '/assets/images/experience-cusco-city.webp',
  historia: '/assets/images/experience-sacred-valley.webp',
  naturaleza: '/assets/images/experience-high-andes.webp',
  aventura: '/assets/images/experience-high-andes.webp',
};

const difficultyLabels = {
  Facil: 'Fácil',
  Moderada: 'Moderada',
  Exigente: 'Exigente',
} as const;

const categoryLabels: Record<string, string> = {
  aventura: 'Aventura',
  cultural: 'Cultura',
  historia: 'Historia',
  naturaleza: 'Naturaleza',
};

function featuredTourImage(tour: TourSummary) {
  return tour.images.find((image) => image.featured) ?? tour.images[0];
}

export function tourImage(tour: TourSummary): string {
  return (
    featuredTourImage(tour)?.url ?? categoryImages[tour.categorySlug] ?? categoryImages['cultural']
  );
}

export function tourImageAlt(tour: TourSummary): string {
  return featuredTourImage(tour)?.alt || `Ilustración editorial para ${tour.title}`;
}

export function tourCategory(tour: TourSummary): string {
  return categoryLabels[tour.categorySlug] ?? 'Experiencia';
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

export function formatTourPrice(amount: number, currency: string): string {
  const currencyLabel = currency === 'PEN' ? 'S/' : currency;
  const formattedAmount = new Intl.NumberFormat('es-PE', {
    maximumFractionDigits: 0,
  }).format(amount);

  return `${currencyLabel} ${formattedAmount}`;
}
