import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';

export class FormUtils {
  private static getTextError(errors: ValidationErrors): string | null {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es obligatorio';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
        case 'min':
          return `El valor mínimo es ${errors['min'].min}`;
        case 'email':
          return 'El valor ingresado no es un email válido';
        case 'pattern':
          if (errors['pattern'].requiredPattern === this.emailPattern)
            return 'El valor ingresado no es un email válido';

          if (errors['pattern'].requiredPattern === this.namePattern)
            return 'El formato requerido es Nombre Apellido';
          break;
        case 'emailTaken':
          return 'El email ya está en uso';
        case 'notStrider':
          return 'El valor no puede ser "strider"';
      }
    }

    return null;
  }

  static isInvalidField(form: FormGroup, field: string): boolean | null {
    return !!form.controls[field].errors && form.controls[field].touched;
  }

  static isInvalidFieldInArray(formArray: FormArray, index: number): boolean | null {
    return formArray.controls[index].errors && formArray.controls[index].touched;
  }

  static getFieldError(form: FormGroup, field: string): string | null {
    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};

    return this.getTextError(errors);
  }

  static getFieldErrorInArray(formArray: FormArray, index: number): string | null {
    if (!formArray.controls[index]) return null;

    const errors = formArray.controls[index].errors || {};

    return this.getTextError(errors);
  }

  static isFieldOneEqualFieldTwo(fieldOne: string, fieldTwo: string) {
    return (formGroup: AbstractControl) => {
      const fieldOneControl = formGroup.get(fieldOne);
      const fieldTwoControl = formGroup.get(fieldTwo);

      return fieldOneControl?.value === fieldTwoControl?.value ? null : { notEqual: true };
    };
  }

  static namePattern = '^([a-zA-Z]+) ([a-zA-Z]+)$';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';

  static async checkingServerResponse(control: AbstractControl): Promise<ValidationErrors | null> {
    await sleep();

    const formValue = control.value;

    if (formValue === 'hola@mundo.com') {
      return {
        emailTaken: true,
      };
    }

    return null;
  }

  static notStrider(control: AbstractControl): ValidationErrors | null {
    const formValue = control.value?.toLowerCase().trim();
    if (formValue === 'strider') {
      return {
        notStrider: true,
      };
    }
    return null;
  }
}

async function sleep() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}
