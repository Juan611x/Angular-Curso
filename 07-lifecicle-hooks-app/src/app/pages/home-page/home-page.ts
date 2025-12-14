import { signal } from '@angular/core';
import {
  afterEveryRender,
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  effect,
} from '@angular/core';
import { Title } from '../../components/title/title';

const log = (...messages: string[]) => {
  console.log(
    `${messages[0]} %c ${messages.slice(1).join(', ')}`,
    'color: #bada55; font-weight: bold;'
  );
};

@Component({
  selector: 'app-home-page',
  imports: [Title],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  //El implement es opcional
  constructor() {
    log(
      'Constructor llamado...',
      "Runs once after Angular has initialized all the component's inputs."
    );
  }

  tradicionalProperty = 'Valor inicial';
  signalProperty = signal('Valor inicial');

  changeTradicionalProperty() {
    this.tradicionalProperty = 'Nuevo valor tradicional';
  }
  changeSignalProperty() {
    this.signalProperty.set('Nuevo valor signal');
  }

  bassicEffect = effect((onCleanup) => {
    log(
      'Basic effect ejecutado...',
      'Runs once immediately after creation and re-runs whenever any tracked reactive state changes.'
    );

    onCleanup(() => {
      log(
        'Basic effect cleanup ejecutado...',
        'Runs whenever the effect is re-executed or destroyed.'
      );
    });
  });

  ngOnInit() {
    log('ngOnInit llamado...', "Runs every time the component's inputs have changed.");
  }

  ngOnChanges() {
    log('ngOnChanges llamado...', 'Runs every time this component is checked for changes.');
  }

  ngDoCheck() {
    log('ngDoCheck llamado...', "Runs once after the component's content has been initialized.");
  }

  ngAfterContentInit() {
    log(
      'ngAfterContentInit llamado...',
      'Runs every time this component content has been checked for changes.'
    );
  }

  ngAfterContentChecked() {
    log(
      'ngAfterContentChecked llamado...',
      'Runs every time this component content has been checked for changes.'
    );
  }

  ngAfterViewInit() {
    log('ngAfterViewInit llamado...', "Runs once after the component's view has been initialized.");
  }

  ngAfterViewChecked() {
    log(
      'ngAfterViewChecked llamado...',
      "Runs every time the component's view has been checked for changes."
    );
  }

  ngOnDestroy() {
    log('ngOnDestroy llamado...', 'Runs just before Angular destroys the component.');
  }

  afterNextRenderEffect = afterNextRender(() => {
    log(
      'afterNextRender effect ejecutado...',
      'Runs once the next time that all components have been rendered to the DOM.'
    );
  });

  afterEveryRenderEffect = afterEveryRender(() => {
    log(
      'afterEveryRender effect ejecutado por evento...',
      'Runs every time all components have been rendered to the DOM.'
    );
  });
}
