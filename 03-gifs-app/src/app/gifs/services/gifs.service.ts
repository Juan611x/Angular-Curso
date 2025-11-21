import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment.development';
import { GiphyResponse } from '../interfaces/giphy.interface';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, tap } from 'rxjs';

const GIF_KEYS = 'searchHistory-gifs';

const loadFromLocalStorage = (): Record<string, Gif[]> => {
  const historyString = localStorage.getItem(GIF_KEYS) ?? '{}';
  const gifs = JSON.parse(historyString);
  return gifs;
};

@Injectable({ providedIn: 'root' })
export class GifService {
  private httpClient = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  isTrendingLoading = signal(false);
  private trendingPage = signal(0);
  trendingGifsGroups = computed<Gif[][]>(() => {
    const group: Gif[][] = [];
    for (let i = 0; i < this.trendingGifs().length; i += 3) {
      group.push(this.trendingGifs().slice(i, i + 3));
    }
    return group;
  });

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {
    this.loadTrendingGifs();
  }

  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEYS, historyString);
  });

  loadTrendingGifs() {
    if (this.isTrendingLoading()) return;
    this.isTrendingLoading.set(true);

    // Lógica para cargar GIFs de tendencia usando la API de Giphy
    this.httpClient
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: '25',
          offset: (this.trendingPage() * 25).toString(),
        },
      })
      .subscribe((response) => {
        const gifs: Gif[] = GifMapper.mapGiphyListToGifList(response.data);
        this.trendingGifs.update((currentGifs) => [...currentGifs, ...gifs]);
        this.isTrendingLoading.set(false);
        this.trendingPage.update((page) => page + 1);
      });
  }

  loadSearchGifs(query: string) {
    // Lógica para buscar GIFs usando la API de Giphy
    return this.httpClient
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
        params: {
          api_key: environment.giphyApiKey,
          q: query,
          limit: '25',
          // rating: 'G',
        },
      })
      .pipe(
        map(({ data }) => data),
        map((items) => GifMapper.mapGiphyListToGifList(items)),

        //MANEJO DEL HISTORIAL
        tap((items) => {
          this.searchHistory.update((history) => ({
            ...history,
            [query.toLowerCase()]: items,
          }));
        })
      );
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query.toLowerCase()] || [];
  }
}
