import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { GifService } from '../../services/gifs.service';
import { ScrollStateService } from '../../../shared/services/scroll-state.service';

@Component({
  selector: 'app-trending-page',
  templateUrl: './trending-page.html',
  styleUrl: './trending-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TrendingPage implements AfterViewInit {
  gifService = inject(GifService);
  scrollStateService = inject(ScrollStateService);

  scrollDivRef = viewChild<ElementRef>('goupDiv');

  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (scrollDiv) {
      const savedPosition = this.scrollStateService.getTrendingScrollState();
      scrollDiv.scrollTop = savedPosition;
    }
  }

  onScroll($event: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollDiv;
    this.scrollStateService.setTrendingScrollState(scrollTop);

    if (scrollTop + clientHeight >= scrollHeight - 300) {
      this.gifService.loadTrendingGifs();
    }
  }
}
