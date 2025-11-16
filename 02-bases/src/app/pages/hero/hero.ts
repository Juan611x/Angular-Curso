import { UpperCasePipe } from "@angular/common";
import { Component, computed, signal } from "@angular/core";

@Component({
  selector: "app-hero",
  templateUrl: "./hero.html",
  styleUrls: ["./hero.css"],
  imports: [UpperCasePipe],
})
export class HeroComponent {

  private readonly initialName = "Superman";
  private readonly initialAge = 30;

  name = signal(this.initialName);
  age = signal(this.initialAge);

  heroDescription = computed(() => {
    return `${this.name()} tiene ${this.age()} años.`;
  });

  // capitalizerName = computed(() => this.name().toUpperCase());

  changeHero() {
    this.name.set("Batman");
    this.age.set(35);
  }

  changeAge() {
    this.age.set(60);
  }

  resetForm() {
    this.name.set(this.initialName);
    this.age.set(this.initialAge);
  }
}