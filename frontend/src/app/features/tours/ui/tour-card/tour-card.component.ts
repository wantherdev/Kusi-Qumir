import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TourSummary } from '../../domain/tour.model';
import { tourDifficulty, tourDuration, tourImage, tourStartingPrice } from '../../domain/tour-view';

@Component({
  selector: 'app-tour-card',
  imports: [RouterLink],
  templateUrl: './tour-card.component.html',
  styleUrl: './tour-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourCardComponent {
  readonly tour = input.required<TourSummary>();

  protected readonly imageFor = tourImage;
  protected readonly durationFor = tourDuration;
  protected readonly difficultyFor = tourDifficulty;
  protected readonly startingPriceFor = tourStartingPrice;
}
