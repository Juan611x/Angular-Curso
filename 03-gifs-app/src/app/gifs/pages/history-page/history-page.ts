import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { GifService } from '../../services/gifs.service';
import { GifList } from "../../components/gif-list/gif-list";

@Component({
  selector: 'history-page',
  imports: [GifList],
  templateUrl: './history-page.html',
  styleUrl: './history-page.css',
})
export default class HistoryPage {
  private gifService = inject(GifService);

  // query = inject(ActivatedRoute).params.subscribe((params) => {
  //   console.log(params['query']);
  // });

  query = toSignal(inject(ActivatedRoute).params.pipe(map((params) => params['query'])));

  gifsByKey = computed(() => {
    return this.gifService.getHistoryGifs(this.query());
  });
}
