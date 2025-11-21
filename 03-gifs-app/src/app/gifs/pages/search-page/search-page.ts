import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GifList } from '../../components/gif-list/gif-list';
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  imports: [GifList],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SearchPage {
  private gifService = inject(GifService);
  gifs = signal<Gif[]>([]);

  onSearch(query: string): void {
    this.gifService.loadSearchGifs(query).subscribe((gifs) => {
      this.gifs.set(gifs);
    });
  }
}
