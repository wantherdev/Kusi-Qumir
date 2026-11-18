import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PhuyuComponent } from '../../shared/ui/phuyu/phuyu.component';
import { RouterLink } from '@angular/router';

import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SiteFooterComponent } from '../../shared/ui/site-footer/site-footer.component';

@Component({
  selector: 'app-not-found',
  imports: [PageHeaderComponent, RouterLink, SiteFooterComponent, PhuyuComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}
