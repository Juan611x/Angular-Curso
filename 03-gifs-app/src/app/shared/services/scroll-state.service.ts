import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollStateService {
  private trendingScrollState = signal(0);

  setTrendingScrollState(position: number) {
    this.trendingScrollState.set(position);
  }
  getTrendingScrollState() {
    return this.trendingScrollState();
  }
}
