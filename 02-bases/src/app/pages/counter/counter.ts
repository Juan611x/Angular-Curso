import { Component, signal } from "@angular/core";


@Component({
  selector: 'app-counter-page',
  templateUrl: './counter.html',
  styleUrls: ['./counter.css']
})
export class CounterPageComponent {

  private readonly initialCounter = 10;

  counter = this.initialCounter;

  counterSignal = signal(this.initialCounter);

  increment(value: number = 1) {
    this.counter += value;
    this.counterSignal.update(current => current + value);
  }

  reset() {
    this.counter = this.initialCounter;
    this.counterSignal.set(this.initialCounter);
  }

}