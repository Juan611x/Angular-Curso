import { ChangeDetectionStrategy, Component, input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-title',
  imports: [],
  templateUrl: './title.html',
  styleUrl: './title.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Title implements OnChanges {
  titulo = input.required<string>();

  ngOnChanges(changes: SimpleChanges) {
    console.log('Title Component - ngOnChanges llamado...', changes);

    for (const inputName in changes) {
      const inputValues = changes[inputName];
      console.log(`Previous: ${inputValues.previousValue}`);
      console.log(`Current: ${inputValues.currentValue}`);
      console.log(`Is first change: ${inputValues.firstChange}`);
    }
  }
}
