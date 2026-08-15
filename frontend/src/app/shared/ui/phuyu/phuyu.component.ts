import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

import { PHUYU_ASSETS, PhuyuPose, PhuyuSize } from './phuyu.types';

@Component({
  selector: 'app-phuyu',
  templateUrl: './phuyu.component.html',
  styleUrl: './phuyu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhuyuComponent {
  readonly pose = input.required<PhuyuPose>();
  readonly size = input<PhuyuSize>('md');
  readonly alt = input('');
  readonly decorative = input(true, { transform: booleanAttribute });
  readonly priority = input(false, { transform: booleanAttribute });

  protected readonly asset = computed(() => PHUYU_ASSETS[this.pose()]);
  protected readonly resolvedAlt = computed(() => (this.decorative() ? '' : this.alt().trim()));
}
