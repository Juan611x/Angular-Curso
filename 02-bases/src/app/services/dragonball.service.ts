import { effect, Injectable, signal } from '@angular/core';
import { Character } from '../interfaces/character.interface';

const loadFromLocalStorage = (): Character[] => {
  const data = localStorage.getItem('dragonball-characters');
  return data ? JSON.parse(data) : [];
};

@Injectable({ providedIn: 'root' })
export class DragonballService {
  saveToLocalStorage = effect(() => {
    //cada que cambia characters se guarda en localstorage porque se dispara el effect
    localStorage.setItem('dragonball-characters', JSON.stringify(this.characters()));
  });

  characters = signal<Character[]>(loadFromLocalStorage());

  adddCharacter(character: Character) {
    this.characters.update((characters) => [...characters, character]);
  }
}
