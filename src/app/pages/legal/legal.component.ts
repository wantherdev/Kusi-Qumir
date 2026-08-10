import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';

type LegalDocument = 'privacy' | 'terms' | 'responsibleTourism';

function isLegalDocument(value: unknown): value is LegalDocument {
  return value === 'privacy' || value === 'terms' || value === 'responsibleTourism';
}

@Component({
  selector: 'app-legal',
  imports: [PageHeaderComponent, RouterLink],
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly document = this.resolveDocument();

  private resolveDocument(): LegalDocument {
    const document: unknown = this.route.snapshot.data['document'];
    return isLegalDocument(document) ? document : 'privacy';
  }
}
