# 📝 Formularios Reactivos en Angular

Este proyecto forma parte del curso de Angular y está enfocado en el aprendizaje de **Formularios Reactivos (Reactive Forms)**. Los formularios reactivos proporcionan un enfoque basado en modelos para manejar entradas de formulario cuyos valores cambian con el tiempo. Este README sirve como notas detalladas de estudio para comprender todos los conceptos implementados.

## 📚 Tabla de Contenidos

1. [Introducción a Formularios Reactivos](#introducción-a-formularios-reactivos)
2. [Configuración Inicial](#configuración-inicial)
3. [Ejemplos de Formularios](#ejemplos-de-formularios)
   - [Basic Page - Formulario Básico](#1-basic-page---formulario-básico)
   - [Dynamic Page - FormArray](#2-dynamic-page---formarray)
   - [Switches Page - Radio Buttons y Checkboxes](#3-switches-page---radio-buttons-y-checkboxes)
   - [Register Page - Validadores Personalizados](#4-register-page---validadores-personalizados)
   - [Country Page - Selectores Anidados](#5-country-page---selectores-anidados)
4. [Validadores Personalizados](#validadores-personalizados)
5. [Utilidades de Formularios](#utilidades-de-formularios)
6. [Servicios](#servicios)

---

## Introducción a Formularios Reactivos

Los **Formularios Reactivos** en Angular se basan en un enfoque más programático y explícito para manejar formularios. A diferencia de los Template-Driven Forms, toda la lógica del formulario se define en el componente TypeScript.

### Ventajas de Reactive Forms:

- ✅ **Más escalables**: Mejor para formularios complejos
- ✅ **Más fáciles de testear**: La lógica está en TypeScript, no en el template
- ✅ **Inmutabilidad**: Cada cambio retorna un nuevo estado
- ✅ **Validación síncrona y asíncrona**: Control total sobre las validaciones
- ✅ **Observable-based**: Podemos usar RxJS para manejar cambios

### Módulos Necesarios:

```typescript
import { ReactiveFormsModule } from '@angular/forms';
```

---

## Configuración Inicial

Para trabajar con formularios reactivos necesitamos:

1. **ReactiveFormsModule**: Importarlo en el componente standalone o en el módulo
2. **FormBuilder**: Servicio para crear formularios de manera más sencilla
3. **Validators**: Clase con validadores predefinidos

```typescript
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
```

---

## Ejemplos de Formularios

### 1. Basic Page - Formulario Básico

**Ubicación**: [src/app/reactive/pages/basic-page/basic-page.ts](src/app/reactive/pages/basic-page/basic-page.ts)

Este ejemplo muestra las dos formas principales de crear formularios reactivos en Angular:

#### 📖 Conceptos Clave:

##### a) Creación con FormBuilder (Recomendado)

```typescript
myForm: FormGroup = this.fb.group({
  name: [
    '', // Valor inicial
    [Validators.required, Validators.minLength(3)], // Validadores síncronos
    [], // Validadores asíncronos
  ],
  price: [0, [Validators.required, Validators.min(10)]],
  inStorage: [0, [Validators.required, Validators.min(0)]],
});
```

**FormBuilder** es un servicio de Angular que simplifica la creación de formularios. Cada campo se define como un array con tres elementos:

1. **Valor inicial**: El valor por defecto del campo
2. **Validadores síncronos**: Array de validadores que se ejecutan inmediatamente
3. **Validadores asíncronos**: Array de validadores que retornan Promises u Observables

##### b) Creación con FormGroup y FormControl

```typescript
myForm2 = new FormGroup({
  name: new FormControl(
    '',
    [
      /* validadores */
    ],
    [
      /* async validators */
    ]
  ),
  price: new FormControl(0),
  inStorage: new FormControl(0),
});
```

Esta forma es más verbosa pero ofrece el mismo resultado. **FormBuilder** es simplemente azúcar sintáctico sobre esta implementación.

#### 🔍 Validadores Utilizados:

- **Validators.required**: El campo no puede estar vacío
- **Validators.minLength(n)**: Longitud mínima de caracteres
- **Validators.min(n)**: Valor numérico mínimo

#### 🎯 Método onSave()

```typescript
onSave() {
  if (this.myForm.invalid) {
    this.myForm.markAllAsTouched();  // Marca todos los campos como "tocados"
    return;
  }

  this.myForm.reset();  // Resetea el formulario a sus valores iniciales
}
```

**¿Por qué markAllAsTouched()?**

- Los mensajes de error solo se muestran cuando un campo ha sido "tocado" (touched)
- Al hacer submit, queremos mostrar todos los errores, incluso de campos no tocados
- Este método marca todos los campos como tocados para que los errores sean visibles

#### 📋 Template HTML

En el template usamos:

- **[formGroup]**: Enlaza el FormGroup al formulario HTML
- **formControlName**: Enlaza cada input a un control específico
- **Propiedades del formulario**:
  - `myForm.valid`: Boolean que indica si el formulario es válido
  - `myForm.pristine`: True si el formulario no ha sido modificado
  - `myForm.touched`: True si algún campo ha sido tocado
  - `myForm.value`: Objeto con todos los valores del formulario

---

### 2. Dynamic Page - FormArray

**Ubicación**: [src/app/reactive/pages/dinamic-page/dinamic-page.ts](src/app/reactive/pages/dinamic-page/dinamic-page.ts)

Este ejemplo muestra cómo trabajar con **FormArray**, que permite manejar arrays dinámicos de controles de formulario.

#### 📖 Conceptos Clave:

##### FormArray - Array Dinámico de Controles

```typescript
myForm: FormGroup = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
  favoriteGames: this.fb.array(
    [
      ['Metal Gear', Validators.required],
      ['Death Stranding', Validators.required],
    ],
    Validators.minLength(3) // Validador a nivel del array
  ),
});
```

**FormArray** es perfecto para listas dinámicas donde el usuario puede:

- Agregar elementos
- Eliminar elementos
- Modificar elementos existentes

#### 🔑 Getter para Acceder al FormArray

```typescript
get favoriteGames() {
  return this.myForm.get('favoriteGames') as FormArray;
}
```

Este getter facilita el acceso al FormArray en el componente y en el template.

#### ➕ Agregar Elementos al FormArray

```typescript
newFavorite = new FormControl('', Validators.required);

addFavorite() {
  if (this.newFavorite.invalid) return;

  const newGame = this.newFavorite.value;
  this.favoriteGames.push(
    this.fb.control(newGame, Validators.required)
  );
  this.newFavorite.reset();
}
```

**Pasos**:

1. Verificamos que el control temporal `newFavorite` sea válido
2. Obtenemos el valor
3. Creamos un nuevo FormControl con `fb.control()` y lo agregamos al array
4. Reseteamos el control temporal para la siguiente entrada

#### ➖ Eliminar Elementos del FormArray

```typescript
deleteFavorite(index: number) {
  this.favoriteGames.removeAt(index);
}
```

**removeAt(index)** elimina el control en la posición especificada.

#### 🎯 Submit del Formulario

```typescript
onSubmit() {
  this.myForm.markAllAsTouched();
  if (this.myForm.invalid) return;

  console.log(this.myForm.value);
  this.myForm.reset();
  this.favoriteGames.clear();  // Limpia todo el FormArray
}
```

**favoriteGames.clear()** elimina todos los elementos del FormArray.

#### 📋 Template HTML - Iterando sobre FormArray

```html
<div formArrayName="favoriteGames">
  @for(favoriteGame of favoriteGames.controls; track $index; let i = $index){
  <div class="input-group">
    <input class="form-control" [formControlName]="i" />
    <button type="button" (click)="deleteFavorite(i)">Eliminar</button>
  </div>
  }
</div>
```

**Puntos importantes**:

- **formArrayName**: Indica qué FormArray estamos renderizando
- **[formControlName]="i"**: Usa el índice para enlazar cada control
- **track $index**: Ayuda a Angular a identificar qué elementos cambiaron

---

### 3. Switches Page - Radio Buttons y Checkboxes

**Ubicación**: [src/app/reactive/pages/switches-page/switches-page.ts](src/app/reactive/pages/switches-page/switches-page.ts)

Este ejemplo muestra cómo trabajar con elementos de formulario tipo switch/checkbox y radio buttons.

#### 📖 Conceptos Clave:

```typescript
myForm = this.fb.group({
  gender: ['M', Validators.required],
  wantNotifiacations: [true],
  termAnConditions: [false, Validators.requiredTrue],
});
```

##### 🔘 Radio Buttons (gender)

- Se usa para seleccionar **una opción entre varias**
- El valor es un string ('M', 'F', etc.)
- Se requiere que tenga algún valor seleccionado

##### 🔔 Checkboxes Simples (wantNotifications)

- Valores booleanos: true/false
- No tiene validación requerida (puede estar marcado o no)

##### ✅ Checkbox con Validación (termAndConditions)

- **Validators.requiredTrue**: El checkbox DEBE estar marcado (true)
- Útil para términos y condiciones que deben ser aceptados
- Si el valor es `false`, el formulario es inválido

#### 📋 Template HTML

Para radio buttons:

```html
<input type="radio" formControlName="gender" value="M" /> Masculino
<input type="radio" formControlName="gender" value="F" /> Femenino
```

Para checkboxes:

```html
<input type="checkbox" formControlName="wantNotifications" />
<input type="checkbox" formControlName="termAnConditions" />
```

---

### 4. Register Page - Validadores Personalizados

**Ubicación**: [src/app/auth/pages/register-page/register-page.ts](src/app/auth/pages/register-page/register-page.ts)

Este es el ejemplo más completo, mostrando **validadores personalizados síncronos y asíncronos**, además de **validaciones a nivel de formulario**.

#### 📖 Conceptos Clave:

##### Estructura del Formulario

```typescript
myForm = this.fb.group(
  {
    name: ['', [Validators.required, Validators.pattern(FormUtils.namePattern)]],
    email: [
      '',
      [Validators.required, Validators.email, Validators.pattern(FormUtils.emailPattern)],
      [FormUtils.checkingServerResponse], // Validador ASÍNCRONO
    ],
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(FormUtils.notOnlySpacesPattern),
        FormUtils.notStrider, // Validador SÍNCRONO personalizado
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
    validators: [FormUtils.isFieldOneEqualFieldTwo('password', 'password2')],
  }
);
```

#### 🎨 Validador de Patrones (Pattern)

Los patrones permiten validar formatos específicos usando expresiones regulares:

```typescript
// Nombre: Debe ser "Nombre Apellido"
namePattern = '^([a-zA-Z]+) ([a-zA-Z]+)$';

// Email: Formato de email válido
emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

// No solo espacios: Solo caracteres alfanuméricos
notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
```

#### 🔧 Validador Síncrono Personalizado

**Ubicación**: [src/app/utils/form-utils.ts](src/app/utils/form-utils.ts)

```typescript
static notStrider(control: AbstractControl): ValidationErrors | null {
  const formValue = control.value?.toLowerCase().trim();
  if (formValue === 'strider') {
    return {
      notStrider: true  // Retorna un objeto con el error
    };
  }
  return null;  // null significa que es válido
}
```

**Características de validadores síncronos**:

- Reciben un `AbstractControl`
- Retornan `ValidationErrors | null`
- Se ejecutan **inmediatamente** en cada cambio
- `null` = válido, objeto = inválido

**¿Cómo usarlo?**

```typescript
username: ['', [FormUtils.notStrider]];
```

#### ⏱️ Validador Asíncrono Personalizado

```typescript
static async checkingServerResponse(control: AbstractControl): Promise<ValidationErrors | null> {
  await sleep();  // Simula llamada al servidor

  const formValue = control.value;

  if (formValue === 'hola@mundo.com') {
    return {
      emailTaken: true  // Email ya existe
    };
  }

  return null;
}
```

**Características de validadores asíncronos**:

- Retornan `Promise<ValidationErrors | null>` u `Observable<ValidationErrors | null>`
- Se ejecutan **después** de que todos los validadores síncronos pasen
- Útiles para verificaciones con el servidor (email duplicado, username disponible, etc.)
- Angular muestra un estado "pending" mientras se ejecutan

**¿Cómo usarlo?**

```typescript
email: [
  '',
  [
    /* síncronos */
  ],
  [FormUtils.checkingServerResponse],
];
```

#### 🔗 Validador a Nivel de Formulario

Algunos validadores necesitan **comparar múltiples campos**:

```typescript
static isFieldOneEqualFieldTwo(fieldOne: string, fieldTwo: string) {
  return (formGroup: AbstractControl) => {
    const fieldOneControl = formGroup.get(fieldOne);
    const fieldTwoControl = formGroup.get(fieldTwo);

    return fieldOneControl?.value === fieldTwoControl?.value
      ? null
      : { notEqual: true };
  };
}
```

**¿Cómo funciona?**

1. Es una **función que retorna otra función** (Higher Order Function)
2. Recibe los nombres de los campos a comparar
3. Retorna un validador que Angular puede usar
4. Este validador compara los valores de ambos campos

**¿Cómo usarlo?**

```typescript
this.fb.group(
  {
    /* campos */
  },
  {
    validators: [FormUtils.isFieldOneEqualFieldTwo('password', 'password2')],
  }
);
```

**Nota**: Este validador se aplica a nivel de **FormGroup**, no de campo individual.

---

### 5. Country Page - Selectores Anidados

**Ubicación**: [src/app/country/pages/country-page/country-page.ts](src/app/country/pages/country-page/country-page.ts)

Este es uno de los ejemplos más importantes del proyecto. Muestra cómo implementar **selectores dependientes** (cascading selects) usando RxJS y Signals de Angular.

#### 📖 Conceptos Clave:

##### Problema a Resolver

Tenemos 3 selectores donde cada uno depende del anterior:

1. **Región** → Carga países de esa región
2. **País** → Carga fronteras de ese país
3. **Frontera** → Selección final

#### 🎯 Estructura del Formulario

```typescript
myForm = this.fb.group({
  region: ['', [Validators.required]],
  country: ['', [Validators.required]],
  border: ['', [Validators.required]],
});
```

#### 📊 Signals para Manejar Estado

```typescript
regions = signal(this.countryService.regions);
countries = signal<Country[]>([]);
borders = signal<Country[]>([]);
```

**Signals** (Angular 16+) son una forma reactiva de manejar estado:

- Se actualizan de manera eficiente
- Funcionan bien con `OnPush` change detection
- Son fáciles de leer y actualizar

#### 🔄 Suscripciones con Effects

```typescript
onFormChange = effect((onCleanUp) => {
  const regionSuscription = this.onRegionChange();
  const countrySuscription = this.onCountryChange();

  onCleanUp(() => {
    regionSuscription.unsubscribe();
    countrySuscription.unsubscribe();
  });
});
```

**effect()** es una función de Angular Signals que:

- Se ejecuta automáticamente cuando el componente se inicializa
- Recibe una función `onCleanUp` para limpiar recursos
- Es el lugar perfecto para suscripciones a observables

#### 🌍 Manejo del Cambio de Región

```typescript
onRegionChange() {
  return this.myForm
    .get('region')!
    .valueChanges.pipe(
      tap(() => {
        // Limpiar campos dependientes
        this.myForm.get('country')!.reset('');
        this.countries.set([]);
        this.myForm.get('border')!.reset('');
        this.borders.set([]);
      }),
      switchMap((region) => this.countryService.getCountriesByRegion(region!))
    )
    .subscribe((countries) => {
      this.countries.set(countries);
    });
}
```

**Desglose paso a paso**:

1. **`valueChanges`**: Observable que emite cada vez que el valor del campo cambia

2. **`tap()`**: Operador RxJS para efectos secundarios (side effects)

   - Limpia los campos que dependen de este selector
   - Resetea los arrays de opciones
   - **No modifica** el flujo de datos

3. **`switchMap()`**: Operador RxJS crucial para este patrón

   - Cancela la petición HTTP anterior si hay una nueva
   - Evita condiciones de carrera (race conditions)
   - Retorna un nuevo Observable (la petición HTTP)

4. **`subscribe()`**: Actualiza el signal con los nuevos países

**¿Por qué switchMap y no mergeMap?**

- Si el usuario cambia rápidamente de región, solo nos interesa la última selección
- `switchMap` **cancela** las peticiones anteriores
- `mergeMap` ejecutaría **todas** las peticiones, causando problemas

#### 🗺️ Manejo del Cambio de País

```typescript
onCountryChange() {
  return this.myForm
    .get('country')!
    .valueChanges.pipe(
      tap(() => {
        this.myForm.get('border')!.reset('');
        this.borders.set([]);
      }),
      filter((value) => value!.length > 0),  // Solo si hay valor
      switchMap((code) => this.countryService.getCountryByCode(code!))
    )
    .subscribe((country) => {
      const borders = country?.borders || [];
      this.countryService.getCountryBordesByCodes(borders).subscribe((countries) => {
        this.borders.set(countries);
      });
    });
}
```

**Diferencias con onRegionChange**:

1. **`filter()`**: Añade una condición

   - Solo continúa si el valor tiene contenido
   - Evita peticiones innecesarias cuando se resetea el campo

2. **Suscripción anidada**:
   - Primero obtiene el país
   - Luego obtiene las fronteras
   - En producción, esto se podría refactorizar con `switchMap` anidado

#### 📋 Template HTML

```html
<select formControlName="region">
  <option value="">-- Seleccione Continente --</option>
  @for (region of regions(); track $index){
  <option [value]="region">{{ region }}</option>
  }
</select>

<select formControlName="country">
  <option value="">-- Seleccione País --</option>
  @for (country of countries(); track $index) {
  <option [value]="country.cca3">{{ country.name.common }}</option>
  }
</select>

<select formControlName="border">
  <option value="">-- Seleccione la frontera --</option>
  @for (country of borders(); track $index) {
  <option [value]="country.cca3">{{ country.name.common }}</option>
  }
</select>
```

**Puntos importantes**:

- Los signals se invocan como funciones: `regions()`
- Cada select está ligado a su formControlName
- Los valores se actualizan automáticamente cuando cambian los signals

#### 🎓 Lecciones Importantes de este Patrón

1. **Limpieza de Dependencias**: Siempre resetear campos dependientes
2. **switchMap para HTTP**: Evita múltiples peticiones simultáneas
3. **filter para optimización**: No hacer peticiones innecesarias
4. **Signals para estado**: Mejor que variables normales en Angular moderno
5. **Cleanup en effects**: Prevenir memory leaks

---

## Validadores Personalizados

Los validadores personalizados son funciones que implementan lógica de validación específica.

### Validador Síncrono

```typescript
static notStrider(control: AbstractControl): ValidationErrors | null {
  const formValue = control.value?.toLowerCase().trim();
  if (formValue === 'strider') {
    return { notStrider: true };
  }
  return null;
}
```

**Estructura**:

- Recibe: `AbstractControl`
- Retorna: `ValidationErrors | null`
- `null` = válido
- Objeto = inválido (la clave es el nombre del error)

### Validador Asíncrono

```typescript
static async checkingServerResponse(control: AbstractControl): Promise<ValidationErrors | null> {
  await sleep();
  const formValue = control.value;

  if (formValue === 'hola@mundo.com') {
    return { emailTaken: true };
  }

  return null;
}
```

**Estructura**:

- Recibe: `AbstractControl`
- Retorna: `Promise<ValidationErrors | null>` o `Observable<ValidationErrors | null>`
- Se ejecuta **después** de validadores síncronos
- Muestra estado "pending" durante la ejecución

### Validador a Nivel de Formulario

```typescript
static isFieldOneEqualFieldTwo(fieldOne: string, fieldTwo: string) {
  return (formGroup: AbstractControl) => {
    const fieldOneControl = formGroup.get(fieldOne);
    const fieldTwoControl = formGroup.get(fieldTwo);

    return fieldOneControl?.value === fieldTwoControl?.value
      ? null
      : { notEqual: true };
  };
}
```

**Uso**:

```typescript
this.fb.group(
  {
    /* campos */
  },
  { validators: [FormUtils.isFieldOneEqualFieldTwo('password', 'password2')] }
);
```

---

## Utilidades de Formularios

**Ubicación**: [src/app/utils/form-utils.ts](src/app/utils/form-utils.ts)

Esta clase contiene métodos auxiliares para manejar validaciones y mostrar errores de manera consistente.

### Verificar si un Campo es Inválido

```typescript
static isInvalidField(form: FormGroup, field: string): boolean | null {
  return !!form.controls[field].errors && form.controls[field].touched;
}
```

**¿Cuándo se muestra un error?**

- El campo tiene errores (`errors` no es null)
- Y el campo ha sido tocado (`touched` es true)

**Uso en template**:

```html
@if(formUtils.isInvalidField(myForm, 'name')){
<span class="text-danger">{{ formUtils.getFieldError(myForm, 'name') }}</span>
}
```

### Verificar Campo en FormArray

```typescript
static isInvalidFieldInArray(formArray: FormArray, index: number): boolean | null {
  return formArray.controls[index].errors && formArray.controls[index].touched;
}
```

Similar al anterior pero para elementos dentro de un FormArray.

### Obtener Mensaje de Error

```typescript
static getFieldError(form: FormGroup, field: string): string | null {
  if (!form.controls[field]) return null;

  const errors = form.controls[field].errors || {};
  return this.getTextError(errors);
}
```

Retorna un mensaje de error legible para el usuario.

### Traducir Errores a Mensajes

```typescript
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
      case 'emailTaken':
        return 'El email ya está en uso';
      case 'notStrider':
        return 'El valor no puede ser "strider"';
      // ... más casos
    }
  }
  return null;
}
```

**¿Por qué es útil?**

- Centraliza los mensajes de error
- Fácil de mantener y traducir
- Consistencia en toda la aplicación

### Validar Campos Iguales

```typescript
static isFieldOneEqualFieldTwo(fieldOne: string, fieldTwo: string) {
  return (formGroup: AbstractControl) => {
    const fieldOneControl = formGroup.get(fieldOne);
    const fieldTwoControl = formGroup.get(fieldTwo);

    return fieldOneControl?.value === fieldTwoControl?.value
      ? null
      : { notEqual: true };
  };
}
```

Útil para:

- Confirmar contraseñas
- Confirmar email
- Cualquier par de campos que deban coincidir

---

## Servicios

### Country Service

**Ubicación**: [src/app/country/services/country.service.ts](src/app/country/services/country.service.ts)

Este servicio maneja las peticiones HTTP a la API de REST Countries.

#### Estructura del Servicio

```typescript
@Injectable({ providedIn: 'root' })
export class CountrySeviceService {
  private baseURL = 'https://restcountries.com/v3.1/';
  httpClient = inject(HttpClient);

  private _regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regions(): string[] {
    return [...this._regions];  // Retorna copia del array
  }
```

**Puntos importantes**:

- `providedIn: 'root'`: Singleton en toda la aplicación
- Array privado `_regions` con getter público
- Retorna copia del array para evitar modificaciones externas

#### Obtener Países por Región

```typescript
getCountriesByRegion(region: string): Observable<Country[]> {
  if (!region) return of([]);

  const url = `${this.baseURL}region/${region}?fields=cca3,name,borders`;
  return this.httpClient.get<Country[]>(url);
}
```

**Características**:

- Guard clause: Si no hay región, retorna array vacío
- `of([])`: Crea un Observable que emite inmediatamente
- Query params `?fields=...`: Solo solicita los campos necesarios (optimización)

#### Obtener País por Código

```typescript
getCountryByCode(code: string): Observable<Country> {
  const url = `${this.baseURL}alpha/${code}?fields=cca3,name,borders`;
  return this.httpClient.get<Country>(url);
}
```

Busca un país específico por su código alpha-3 (ej: "USA", "MEX").

#### Obtener Países por Múltiples Códigos

```typescript
getCountryBordesByCodes(borders: string[]): Observable<Country[]> {
  if (borders.length === 0) return of([]);

  const codes = borders.join(',');  // "USA,MEX,CAN"
  const url = `${this.baseURL}alpha?codes=${codes}&fields=cca3,name,borders`;
  return this.httpClient.get<Country[]>(url);
}
```

**¿Por qué es necesario?**

- Un país retorna sus fronteras como array de códigos: `["USA", "MEX"]`
- Necesitamos obtener la información completa de esos países
- La API acepta múltiples códigos separados por comas

---

## 🎯 Conceptos Avanzados Aplicados

### 1. OnPush Change Detection

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

**Beneficios**:

- Mejor rendimiento
- Solo re-renderiza cuando cambian inputs, signals o eventos
- Funciona perfectamente con Signals

### 2. RxJS Operators

- **tap()**: Efectos secundarios sin modificar el stream
- **switchMap()**: Cambia a un nuevo Observable, cancelando el anterior
- **filter()**: Solo continúa si se cumple una condición
- **map()**: Transforma los datos

### 3. Signals (Angular 16+)

```typescript
countries = signal<Country[]>([]);
countries.set([...newCountries]); // Actualizar
const currentCountries = countries(); // Leer
```

**Ventajas sobre variables normales**:

- Reactivos automáticamente
- Mejor rendimiento con OnPush
- Sintaxis clara para lectura/escritura

### 4. Standalone Components

Todos los componentes son standalone:

```typescript
@Component({
  selector: 'app-basic-page',
  imports: [JsonPipe, ReactiveFormsModule],  // Importar lo necesario
  standalone: true  // Por defecto en Angular 17+
})
```

---

## 🚀 Comandos Útiles

```bash
# Instalar dependencias
npm install

# Ejecutar aplicación en desarrollo
npm start

# Ejecutar tests
npm test

# Build para producción
npm run build
```

---

## 📝 Resumen de Buenas Prácticas

### ✅ DO's (Hacer)

1. **Usar FormBuilder** para crear formularios (más limpio)
2. **Centralizar validadores** en una clase de utilidades
3. **Limpiar suscripciones** en effects/ngOnDestroy
4. **Usar switchMap** para peticiones HTTP dependientes
5. **Resetear campos dependientes** cuando cambia un selector padre
6. **Usar Signals** para estado reactivo
7. **markAllAsTouched()** antes de validar en submit
8. **Validadores asíncronos** para verificaciones con servidor
9. **OnPush** change detection para mejor rendimiento
10. **Mensajes de error claros** y centralizados

### ❌ DON'Ts (Evitar)

1. **No** olvidar limpiar suscripciones (memory leaks)
2. **No** usar mergeMap para peticiones HTTP dependientes
3. **No** modificar directamente arrays compartidos
4. **No** hacer validaciones complejas en el template
5. **No** olvidar el track en @for loops
6. **No** anidar suscripciones innecesariamente
7. **No** ignorar el estado "pending" de validadores asíncronos
8. **No** usar FormControl sin validación para datos críticos

---

## 🔍 Para Profundizar

### Temas Relacionados:

- **RxJS**: Operadores avanzados (debounceTime, distinctUntilChanged)
- **Signals**: API completa y computed signals
- **FormGroup vs FormRecord**: Cuando usar cada uno
- **Dynamic Forms**: Generación de formularios desde JSON
- **Custom Form Controls**: Implementar ControlValueAccessor
- **Testing**: Testear formularios reactivos con Jest/Jasmine

### Recursos:

- [Angular Reactive Forms Documentation](https://angular.io/guide/reactive-forms)
- [RxJS Operators](https://rxjs.dev/api)
- [Angular Signals Guide](https://angular.io/guide/signals)

---

## 📌 Notas Finales

Este proyecto cubre los aspectos fundamentales y avanzados de los formularios reactivos en Angular:

- ✅ Formularios básicos y complejos
- ✅ Validaciones síncronas y asíncronas
- ✅ FormArrays dinámicos
- ✅ Selectores dependientes con RxJS
- ✅ Servicios HTTP
- ✅ Signals y OnPush
- ✅ Validadores personalizados
- ✅ Utilidades reutilizables

Con estos conocimientos puedes crear cualquier tipo de formulario en Angular, desde un simple login hasta complejos formularios multi-paso con validaciones dinámicas.

---

**Autor**: Estudiante del Curso de Angular  
**Fecha**: 2024  
**Versión de Angular**: 17+
