import { Component, signal } from '@angular/core';
import { Card } from '../../components/card/card';
import {
  AsyncPipe,
  I18nPluralPipe,
  I18nSelectPipe,
  JsonPipe,
  KeyValuePipe,
  SlicePipe,
} from '@angular/common';
import { interval, Observable, tap } from 'rxjs';

const client1 = {
  name: 'Juan Ignacio',
  gender: 'male',
  age: 22,
  address: 'cali, Colombia',
};

const client2 = {
  name: 'Maria Fernanda',
  gender: 'female',
  age: 25,
  address: 'cali, Colombia',
};

@Component({
  selector: 'app-uncommon-page',
  imports: [Card, I18nSelectPipe, I18nPluralPipe, SlicePipe, JsonPipe, KeyValuePipe, AsyncPipe],
  templateUrl: './uncommon-page.html',
  styleUrl: './uncommon-page.css',
})
export default class UncommonPage {
  client = signal(client1);

  //i18nSelect
  invitationMap = {
    male: 'invitarlo',
    female: 'invitarla',
  };

  changeClient() {
    if (this.client() === client1) {
      this.client.set(client2);
    } else {
      this.client.set(client1);
    }
  }

  //i18nPlural
  clients = signal([
    'Juan Ignacio',
    'Maria Fernanda',
    'Jose Luis',
    'Ana Maria',
    'Carlos Alberto',
    'Luisa Fernanda',
    'Andres Felipe',
    'Sofia Isabel',
  ]);

  clientsMap = signal({
    '=0': 'no tenemos clientes',
    '=1': 'tenemos un cliente',
    other: 'tenemos # clientes',
  }); // puede ser un Signal o un objeto normal

  deleteCClient() {
    this.clients.update((clients) => clients.slice(1));
  }

  //keyValue Pipe
  profile = {
    name: 'Juan Ignacio',
    age: 22,
    address: 'Cali, Colombia',
    occupation: 'Software Developer',
  };

  //Async Pipe
  promiseValue = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Tenemos data de promesa');
    }, 3500);
  });

  myObservableTimer = interval(2000).pipe(tap((value) => console.log('tick', value))); //0,1,2,3,4,5...
}
