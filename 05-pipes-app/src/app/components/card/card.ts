import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  title = input.required<string>();
}
