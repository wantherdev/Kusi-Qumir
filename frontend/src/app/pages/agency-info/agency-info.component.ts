import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { agencyProfile } from '../../config/agency-profile';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SiteFooterComponent } from '../../shared/ui/site-footer/site-footer.component';

@Component({
  selector: 'app-agency-info',
  imports: [PageHeaderComponent, RouterLink, SiteFooterComponent],
  templateUrl: './agency-info.component.html',
  styleUrl: './agency-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgencyInfoComponent {
  protected readonly profile = agencyProfile;
}
