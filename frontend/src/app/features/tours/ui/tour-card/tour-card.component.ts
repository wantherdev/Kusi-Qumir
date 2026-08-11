import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TourSummary } from '../../domain/tour.model';
import {
  formatTourPrice,
  tourDifficulty,
  tourDuration,
  tourImage,
  tourImageAlt,
  tourStartingPrice,
} from '../../domain/tour-view';

@Component({
  selector: 'app-tour-card',
  imports: [RouterLink],
  templateUrl: './tour-card.component.html',
  styleUrl: './tour-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourCardComponent {
  readonly tour = input.required<TourSummary>();
  readonly sequence = input<number>();

  protected readonly imageFor = tourImage;
  protected readonly imageAltFor = tourImageAlt;
  protected readonly durationFor = tourDuration;
  protected readonly difficultyFor = tourDifficulty;
  protected readonly startingPriceFor = tourStartingPrice;
  protected readonly priceFor = formatTourPrice;

  protected cardNumber(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
