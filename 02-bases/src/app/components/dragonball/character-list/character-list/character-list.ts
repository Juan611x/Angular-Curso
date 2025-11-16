import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Character } from '../../../../interfaces/character.interface';

@Component({
  selector: 'dragonball-character-list',
  imports: [],
  templateUrl: './character-list.html',
  styleUrl: './character-list.css',
})
export class CharacterList {
  characters = input.required<Character[]>();
  listName = input.required<string>();
}
