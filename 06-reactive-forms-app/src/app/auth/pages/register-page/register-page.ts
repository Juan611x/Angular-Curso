import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-register-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  formUtiles = FormUtils;

  myForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.pattern(FormUtils.namePattern)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.pattern(FormUtils.emailPattern)],
        [FormUtils.checkingServerResponse],
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(FormUtils.notOnlySpacesPattern),
          FormUtils.notStrider,
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(FormUtils.notOnlySpacesPattern),
        ],
      ],
      password2: ['', Validators.required],
    },
    {
      validators: [FormUtils.isFieldOneEqualFieldTwo('password', 'password2')], //Validaciones a nivel formulario.
    }
  );

  onSubmit() {
    this.myForm.markAllAsTouched();
    if (this.myForm.invalid) return;

    this.myForm.reset();
  }
}
