import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

type LegalDocument = 'privacy' | 'terms' | 'responsibleTourism';

@Component({
  selector: 'app-legal',
  imports: [RouterLink],
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly document = this.route.snapshot.data['document'] as LegalDocument;
}
