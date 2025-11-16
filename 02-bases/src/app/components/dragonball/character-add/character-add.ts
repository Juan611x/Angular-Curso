import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Character } from '../../../interfaces/character.interface';

@Component({
  selector: 'dragonball-character-add',
  imports: [],
  templateUrl: './character-add.html',
  styleUrl: './character-add.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterAdd {
  name = signal<string>('');
  power = signal<number>(0);

  newCharacter = output<Character>();

  addCharacter() {
    if (!this.name() || !this.power() || this.power() <= 0) return;

    const character: Character = {
      id: Math.floor(Math.random() * 10000),
      name: this.name(),
      power: this.power(),
    };

    // this.characters.update((characters) => [...characters, character]);
    this.newCharacter.emit(character);
    this.name.set('');
    this.power.set(0);
  }
}
