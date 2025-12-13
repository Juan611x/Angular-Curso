import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormUtils } from '../../../utils/form-utils';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-basic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './basic-page.html',
  styleUrl: './basic-page.css',
})
export class BasicPage {
  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    //Formulario Reactivo con FormBuilder
    name: [
      '', //Valor por defecto
      [Validators.required, Validators.minLength(3)] /*Validadores sincronos*/,
      [] /*Validadores asincronos*/,
    ],
    price: [0, [Validators.required, Validators.min(10)]],
    inStorage: [0, [Validators.required, Validators.min(0)]],
  });

  myForm2 = new FormGroup({
    //Formulario Reactivo con FormGroup
    name: new FormControl(
      '', //Valor por defecto
      [
        /*Validadores sincronos*/
      ],
      [
        /*Validadores asincronos*/
      ]
    ),
    price: new FormControl(0),
    inStorage: new FormControl(0),
  });

  onSave() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.myForm.reset();
  }
}
