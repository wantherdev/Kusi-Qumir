import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-tour-card-skeleton',
  templateUrl: './tour-card-skeleton.component.html',
  styleUrl: './tour-card-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourCardSkeletonComponent {}
