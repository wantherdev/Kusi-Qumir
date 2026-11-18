import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { agencyProfile } from '../../config/agency-profile';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SiteFooterComponent } from '../../shared/ui/site-footer/site-footer.component';

@Component({
  selector: 'app-contact',
  imports: [RouterLink, PageHeaderComponent, SiteFooterComponent],
  templateUrl: './contact.component.html',
  styleUrl: '../help-pages.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  protected readonly profile = agencyProfile;
}
