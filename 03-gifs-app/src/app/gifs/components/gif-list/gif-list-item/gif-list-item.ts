import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'gif-list-item',
  imports: [],
  templateUrl: './gif-list-item.html',
  styleUrl: './gif-list-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GifListItem {
  url = input.required<string>();
}
