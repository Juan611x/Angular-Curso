import { Component, computed, inject, signal } from '@angular/core';
import { CharacterList } from '../../components/dragonball/character-list/character-list/character-list';
import { Character } from '../../interfaces/character.interface';
import { CharacterAdd } from '../../components/dragonball/character-add/character-add';
import { DragonballService } from '../../services/dragonball.service';

@Component({
  selector: 'app-dragonball',
  imports: [CharacterList, CharacterAdd],
  templateUrl: './dragonball.html',
  styleUrl: './dragonball.css',
})
export class DragonballComponent {
  public dragonballService = inject(DragonballService);
  public characters = this.dragonballService.characters;

  adddCharacter(character: Character) {
    this.dragonballService.adddCharacter(character);
  }
}
