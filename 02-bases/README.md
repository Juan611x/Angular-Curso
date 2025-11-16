# 02-bases - Proyecto de Bases de Angular

Este es el primer proyecto del curso de Angular donde se cubren las bases fundamentales del framework.

## 🔍 Diferencias con Versiones Anteriores de Angular

Este proyecto utiliza **Angular 20** (versión actual) que introduce cambios importantes respecto a versiones anteriores:

### Cambio en la Nomenclatura de Archivos

**Antes (Angular < 19):**

- `app.component.ts`
- `app.component.html`
- `app.component.css`
- `app.component.spec.ts`

**Ahora (Angular >= 19):**

- `app.ts` ← Componente principal
- `app.html` ← Template
- `app.css` ← Estilos
- `app.spec.ts` ← Pruebas

Angular CLI ahora genera archivos con nombres más cortos y simples, eliminando el sufijo `.component` para mejorar la legibilidad.

### Standalone Components por Defecto

Angular 20 utiliza **Standalone Components** por defecto, eliminando la necesidad de módulos (NgModule) para proyectos simples.

## 📁 Estructura del Proyecto

### Archivos de Configuración Raíz

- **`angular.json`**: Configuración principal del workspace de Angular. Define cómo se construye y ejecuta el proyecto.
- **`package.json`**: Dependencias del proyecto y scripts npm.
- **`tsconfig.json`**: Configuración base de TypeScript para todo el proyecto.
- **`tsconfig.app.json`**: Configuración específica de TypeScript para la aplicación.
- **`tsconfig.spec.json`**: Configuración de TypeScript para las pruebas.

### Carpeta `src/`

#### Archivos Principales

- **`main.ts`**: Punto de entrada de la aplicación. Aquí se inicializa (bootstrap) el componente raíz.
- **`index.html`**: HTML principal donde se monta la aplicación Angular.
- **`styles.css`**: Estilos globales de la aplicación.

#### Carpeta `src/app/`

Esta carpeta contiene el componente principal de la aplicación:

- **`app.ts`**: Componente raíz de la aplicación (equivalente al antiguo `app.component.ts`)
  - Define el selector `app-root`
  - Es un Standalone Component (no requiere NgModule)
  - Utiliza Signals de Angular para el manejo de estado reactivo

- **`app.html`**: Template HTML del componente raíz (equivalente al antiguo `app.component.html`)
  - Contiene la estructura visual del componente

- **`app.css`**: Estilos específicos del componente raíz (equivalente al antiguo `app.component.css`)

- **`app.config.ts`**: Configuración de la aplicación
  - Define los providers globales
  - Configura la detección de cambios (zoneless)
  - Configura el router y otros servicios

- **`app.routes.ts`**: Definición de rutas de la aplicación
  - Aquí se configuran las rutas del router

- **`app.spec.ts`**: Archivo de pruebas unitarias para el componente raíz

### Carpeta `public/`

Archivos estáticos que se copian tal cual al build (imágenes, favicon, etc.)

## 🆕 Características de Angular 20

1. **Standalone Components**: No se necesitan NgModules para componentes simples
2. **Signals**: Sistema reactivo mejorado para manejo de estado
3. **Zoneless Change Detection**: Mejor rendimiento sin Zone.js
4. **Nomenclatura Simplificada**: Archivos con nombres más cortos y directos

## 📚 Notas para el Curso

Los conceptos fundamentales que aprenderás son los mismos:

- Componentes
- Templates
- Data Binding
- Directivas
- Servicios
- Dependency Injection

La sintaxis y estructura del código dentro de los archivos es compatible, simplemente Angular CLI ahora genera archivos con nombres más concisos.

## 🧩 Anatomía de un Componente de Angular

Los componentes son los bloques fundamentales de construcción en Angular. Cada componente combina lógica (TypeScript), vista (HTML) y estilos (CSS) para crear una parte reutilizable de la interfaz de usuario.

### Estructura Básica: Decorador + Clase

Un componente de Angular tiene dos partes principales:

```typescript
// Archivo: src/app/pages/counter/counter.ts
import { Component } from '@angular/core';

@Component({
  // 👈 DECORADOR
  selector: 'app-counter-page',
  templateUrl: './counter.html',
  styleUrls: ['./counter.css'],
})
export class CounterPageComponent {
  // 👈 CLASE
  private initialCounter = 10;
  counter = this.initialCounter;

  increment(value: number = 1) {
    this.counter += value;
  }

  reset() {
    this.counter = this.initialCounter;
  }
}
```

### 1️⃣ El Decorador `@Component`

El **decorador** es una función especial de TypeScript que añade metadatos a una clase para convertirla en un componente de Angular. Va justo antes de la declaración de la clase y usa el símbolo `@`.

#### Propiedades del Decorador:

- **`selector`**: El nombre de la etiqueta HTML que representa este componente

  ```typescript
  selector: 'app-root'; // Se usa como: <app-root></app-root>
  ```

- **`imports`**: Array de otros componentes, directivas o pipes que este componente necesita usar

  ```typescript
  imports: [RouterOutlet, CommonModule, MiOtroComponente];
  ```

  > ⚠️ Solo en Standalone Components (Angular 14+)

- **`templateUrl`**: Ruta al archivo HTML del template
  ```typescript
  templateUrl: './app.html';
  ```
- **`template`**: (Alternativa) HTML inline directamente en el decorador

  ```typescript
  template: '<h1>{{ title }}</h1>';
  ```

- **`styleUrl`**: Ruta al archivo de estilos

  ```typescript
  styleUrl: './app.css';
  ```

- **`styles`**: (Alternativa) Estilos inline
  ```typescript
  styles: ['h1 { color: blue; }'];
  ```

### 2️⃣ La Clase del Componente

La **clase** contiene la lógica del componente: propiedades, métodos y el ciclo de vida del componente.

```typescript
// Archivo: src/app/pages/counter/counter.ts
export class CounterPageComponent {
  // Propiedades (datos del componente)
  private initialCounter = 10; // Solo accesible dentro de la clase
  counter = this.initialCounter; // Pública por defecto

  // Métodos (funcionalidad del componente)
  increment(value: number = 1) {
    this.counter += value;
  }

  reset() {
    this.counter = this.initialCounter;
  }
}
```

#### Tipos de Propiedades en la Clase:

- **`public`**: Accesible desde cualquier parte (default si no se especifica)
- **`protected`**: Accesible desde la clase y el template
- **`private`**: Solo accesible dentro de la clase
- **`readonly`**: No se puede modificar después de la inicialización

### 3️⃣ Manejo de Estado: Propiedades vs Signals

Angular ofrece dos formas de manejar el estado en los componentes:

#### Opción 1: Propiedades Normales (Enfoque Tradicional)

```typescript
// Archivo: src/app/pages/counter/counter.ts
export class CounterPageComponent {
  private readonly initialCounter = 10;
  counter = this.initialCounter; // Propiedad normal

  increment(value: number = 1) {
    this.counter += value; // Modificación directa
  }

  reset() {
    this.counter = this.initialCounter;
  }
}
```

```html
<!-- Archivo: src/app/pages/counter/counter.html -->
<h1>Counter {{ counter }}</h1>
<!-- Se accede directamente -->
<button (click)="increment()">Incrementar</button>
```

**Características:**

- ✅ Sintaxis simple y familiar
- ✅ Acceso directo a la propiedad
- ⚠️ Detección de cambios menos eficiente (usa Zone.js)

#### Opción 2: Signals (Enfoque Moderno - Angular 16+)

**Signals** es el nuevo sistema reactivo de Angular que mejora el rendimiento y la predictibilidad:

```typescript
// Archivo: src/app/pages/counter/counter.ts
import { Component, signal } from '@angular/core';

export class CounterPageComponent {
  private readonly initialCounter = 10;
  counterSignal = signal(this.initialCounter); // Signal

  increment(value: number = 1) {
    // Opción A: .update() - actualizar basado en valor actual
    this.counterSignal.update((current) => current + value);

    // Opción B: .set() - establecer valor directamente
    // this.counterSignal.set(15);
  }

  reset() {
    this.counterSignal.set(this.initialCounter); // Establecer nuevo valor
  }
}
```

```html
<!-- Archivo: src/app/pages/counter/counter.html -->
<h1>Counter {{ counterSignal() }}</h1>
<!-- Se accede con () -->
<button (click)="increment()">Incrementar</button>
```

**Operaciones con Signals:**

```typescript
// Crear un signal
const contador = signal(0);
const nombre = signal('Juan');
const readonly titulo = signal('Mi App');  // Signal de solo lectura

// Leer el valor (siempre con paréntesis)
const valor = contador();  // 0
const miNombre = nombre();  // 'Juan'

// Establecer un valor nuevo
contador.set(10);  // Establece directamente a 10
nombre.set('Pedro');

// Actualizar basado en el valor actual
contador.update(actual => actual + 1);  // Incrementa en 1
contador.update(actual => actual * 2);  // Duplica el valor
```

**Ventajas de Signals:**

- ✅ Detección de cambios más eficiente y granular
- ✅ No depende de Zone.js (mejor rendimiento)
- ✅ Código más predecible y fácil de rastrear
- ✅ Mejor soporte para futuras optimizaciones de Angular
- ✅ Actualizaciones más precisas (solo re-renderiza lo necesario)

#### Comparación Lado a Lado

| Aspecto                  | Propiedades Normales | Signals                           |
| ------------------------ | -------------------- | --------------------------------- |
| **Declaración**          | `counter = 10`       | `counter = signal(10)`            |
| **Lectura**              | `{{ counter }}`      | `{{ counter() }}`                 |
| **Escritura**            | `this.counter = 5`   | `this.counter.set(5)`             |
| **Actualización**        | `this.counter += 1`  | `this.counter.update(n => n + 1)` |
| **Rendimiento**          | Bueno                | Excelente                         |
| **Detección de cambios** | Zone.js (global)     | Granular (solo lo necesario)      |
| **Recomendado para**     | Proyectos legacy     | Nuevos proyectos (Angular 16+)    |

### 4️⃣ Data Binding: Conectando Template y Clase

Angular proporciona diferentes formas de conectar el template (HTML) con la clase (TypeScript):

#### 🔹 Interpolación `{{ }}` - Mostrar Datos

Muestra el valor de una propiedad o expresión en el template:

```html
<!-- Archivo: src/app/pages/counter/counter.html -->
<h1>Counter {{ counter }}</h1>
```

Angular evalúa la expresión dentro de `{{ }}` y muestra el resultado en el HTML. Cada vez que `counter` cambia, la vista se actualiza automáticamente.

```typescript
// Archivo: src/app/pages/counter/counter.ts
counter = 10; // Este valor se mostrará en el template
```

**Puedes usar:**

- Variables: `{{ counter }}`
- Operaciones: `{{ counter + 5 }}`
- Métodos: `{{ obtenerNombre() }}`
- Expresiones: `{{ counter > 0 ? 'Positivo' : 'Negativo' }}`

#### 🔹 Event Binding `()` - Responder a Eventos

Escucha eventos del DOM (clicks, cambios, etc.) y ejecuta métodos de la clase:

```html
<!-- Archivo: src/app/pages/counter/counter.html -->
<button (click)="increment()">Incrementar</button>
<button (click)="increment(-1)">Decrementar</button>
<button (click)="reset()">Reset</button>
```

```typescript
// Archivo: src/app/pages/counter/counter.ts
increment(value: number = 1) {
  this.counter += value;  // Se ejecuta cuando se hace click
}

reset() {
  this.counter = this.initialCounter;
}
```

**Eventos comunes:**

- `(click)="metodo()"` - Click en elemento
- `(input)="metodo($event)"` - Cambio en input
- `(submit)="metodo()"` - Envío de formulario
- `(keyup.enter)="metodo()"` - Presionar Enter
- `(mouseenter)="metodo()"` - Mouse sobre elemento

**Pasar el evento:**

```html
<input (input)="onInput($event)" />
```

```typescript
onInput(event: Event) {
  const valor = (event.target as HTMLInputElement).value;
}
```

#### 🔹 Property Binding `[]` - Establecer Propiedades

Establece propiedades de elementos HTML desde la clase:

```html
<button [disabled]="counter === 0">No puedes hacer click</button>
<img [src]="imagenUrl" [alt]="descripcion" />
<div [class.active]="isActive"></div>
<p [style.color]="color">Texto con color dinámico</p>
```

#### 🔹 Two-way Binding `[()]` - Sincronización Bidireccional

Combina property binding y event binding para sincronización en ambas direcciones:

```html
<input [(ngModel)]="nombre" />
<p>Hola {{ nombre }}</p>
```

### 5️⃣ Comunicación entre Template y Clase: Ejemplo Completo

Así es cómo se conectan el template y la clase en nuestro componente Counter:

**Template HTML:**

```html
<!-- Archivo: src/app/pages/counter/counter.html -->
<h1>Counter {{ counter }}</h1>
<!-- Interpolación: muestra el valor -->
<button (click)="increment()">Incrementar</button>
<!-- Event binding: ejecuta método -->
<button (click)="increment(-1)">Decrementar</button>
<!-- Event binding con parámetro -->
<button (click)="reset()">Reset</button>
<!-- Event binding -->
```

**Clase TypeScript:**

```typescript
// Archivo: src/app/pages/counter/counter.ts
export class CounterPageComponent {
  private initialCounter = 10;
  counter = this.initialCounter; // Dato que se muestra en {{ counter }}

  increment(value: number = 1) {
    // Método ejecutado por (click)
    this.counter += value;
  }

  reset() {
    // Método ejecutado por (click)
    this.counter = this.initialCounter;
  }
}
```

**Flujo de datos:**

1. 💾 `counter` en la clase → 📺 `{{ counter }}` en el template (Interpolación)
2. 🖱️ Click en botón → ⚡ `(click)` ejecuta método → 🔄 método modifica `counter` → 📺 vista se actualiza

### 6️⃣ Pipes - Transformación de Datos en el Template

Los **pipes** son funciones que transforman datos en el template sin modificar el valor original. Se usan con el símbolo `|` (pipe).

#### ¿Qué son los Pipes?

Los pipes permiten formatear y transformar datos directamente en el HTML de forma declarativa:

```html
<!-- Archivo: src/app/pages/hero/hero.html -->
<dd>{{ name() | uppercase }}</dd>
<!-- Convierte a mayúsculas -->
```

**Sintaxis:** `{{ valor | nombreDelPipe }}`

#### Pipes Built-in (Incluidos en Angular)

Angular incluye pipes predefinidos para casos comunes:

```html
<!-- UpperCase & LowerCase -->
{{ 'hola mundo' | uppercase }}
<!-- HOLA MUNDO -->
{{ 'HOLA MUNDO' | lowercase }}
<!-- hola mundo -->

<!-- Date -->
{{ fechaActual | date }}
<!-- Nov 15, 2025 -->
{{ fechaActual | date:'short' }}
<!-- 11/15/25, 3:45 PM -->
{{ fechaActual | date:'dd/MM/yyyy' }}
<!-- 15/11/2025 -->

<!-- Currency -->
{{ 1234.56 | currency }}
<!-- $1,234.56 -->
{{ 1234.56 | currency:'EUR' }}
<!-- €1,234.56 -->
{{ 1234.56 | currency:'MXN':'symbol':'1.0-0' }}
<!-- $1,235 -->

<!-- Number -->
{{ 3.14159265 | number:'1.2-2' }}
<!-- 3.14 -->
{{ 1000000 | number }}
<!-- 1,000,000 -->

<!-- Percent -->
{{ 0.259 | percent }}
<!-- 26% -->

<!-- JSON (útil para debugging) -->
{{ objetoComplejo | json }}

<!-- Slice (arrays y strings) -->
{{ [1,2,3,4,5] | slice:0:3 }}
<!-- [1,2,3] -->
{{ 'Angular' | slice:0:3 }}
<!-- Ang -->
```

#### Uso de Pipes en Componentes

Para usar pipes en componentes standalone, debes importarlos:

```typescript
// Archivo: src/app/pages/hero/hero.ts
import { UpperCasePipe } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrls: ['./hero.css'],
  imports: [UpperCasePipe], // 👈 Importar el pipe
})
export class HeroComponent {
  name = signal('Superman');
}
```

```html
<!-- Archivo: src/app/pages/hero/hero.html -->
<h1>{{ name() }}</h1>
<!-- Superman -->
<h1>{{ name() | uppercase }}</h1>
<!-- SUPERMAN -->
```

#### Encadenar Múltiples Pipes

Puedes aplicar varios pipes consecutivamente:

```html
{{ fechaNacimiento | date:'fullDate' | uppercase }}
<!-- SUNDAY, NOVEMBER 15, 2025 -->

{{ precio | currency:'USD' | uppercase }}
<!-- $1,234.56 -->
```

#### Pipes con Parámetros

Algunos pipes aceptan parámetros separados por `:`:

```html
{{ fecha | date:'dd/MM/yyyy' }}
<!--        ↑    ↑
         pipe  parámetro -->

{{ numero | number:'1.2-4' }}
<!--              ↑
         min.minDecimal-maxDecimal -->
```

### 7️⃣ Computed Signals - Valores Derivados Reactivos

Los **computed signals** son valores que se calculan automáticamente a partir de otros signals. Cuando los signals de origen cambian, el computed se recalcula automáticamente.

#### ¿Qué es un Computed Signal?

Un computed es un signal de solo lectura que deriva su valor de otros signals:

```typescript
// Archivo: src/app/pages/hero/hero.ts
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrls: ['./hero.css'],
})
export class HeroComponent {
  name = signal('Superman');
  age = signal(30);

  // Computed: se recalcula automáticamente cuando name o age cambian
  heroDescription = computed(() => {
    return `${this.name()} tiene ${this.age()} años.`;
  });

  changeAge() {
    this.age.set(60);
    // heroDescription se actualiza automáticamente a "Superman tiene 60 años."
  }
}
```

```html
<!-- Archivo: src/app/pages/hero/hero.html -->
<dl>
  <td>Nombre:</td>
  <dd>{{ name() }}</dd>

  <td>Edad:</td>
  <dd>{{ age() }}</dd>

  <td>Descripción Computed:</td>
  <dd>{{ heroDescription() }}</dd>
  <!-- Se actualiza automáticamente -->
</dl>

<button (click)="changeAge()">Cambiar edad</button>
```

#### Ejemplo Completo del Componente Hero

```typescript
// Archivo: src/app/pages/hero/hero.ts
import { UpperCasePipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrls: ['./hero.css'],
  imports: [UpperCasePipe],
})
export class HeroComponent {
  private readonly initialName = 'Superman';
  private readonly initialAge = 30;

  // Signals básicos
  name = signal(this.initialName);
  age = signal(this.initialAge);

  // Computed signal: se recalcula cuando name o age cambian
  heroDescription = computed(() => {
    return `${this.name()} tiene ${this.age()} años.`;
  });

  changeHero() {
    this.name.set('Batman');
    this.age.set(35);
    // heroDescription se actualiza automáticamente
  }

  changeAge() {
    this.age.set(60);
    // heroDescription se actualiza automáticamente
  }

  resetForm() {
    this.name.set(this.initialName);
    this.age.set(this.initialAge);
  }
}
```

```html
<!-- Archivo: src/app/pages/hero/hero.html -->
<h1>{{ name() }}</h1>

<dl>
  <td>Nombre:</td>
  <dd>{{ name() }}</dd>

  <td>Edad:</td>
  <dd>{{ age() }}</dd>

  <td>Computed Description:</td>
  <dd>{{ heroDescription() }}</dd>

  <td>Capitalizado con Pipe:</td>
  <dd>{{ name() | uppercase }}</dd>
</dl>

<button (click)="changeHero()" class="btn btn-primary mx-2">Cambiar nombre</button>

<button (click)="changeAge()" class="btn btn-primary">Cambiar edad</button>

<button (click)="resetForm()" class="btn btn-primary mx-2">Reset</button>
```

#### Ventajas de Computed Signals

✅ **Reactividad Automática**: Se recalculan solo cuando sus dependencias cambian
✅ **Eficiencia**: Angular optimiza los cálculos (memoization)
✅ **Legibilidad**: Lógica derivada clara y declarativa
✅ **Sin Efectos Secundarios**: Son funciones puras de solo lectura

#### Computed vs Métodos en el Template

**❌ Método en el template (Mala práctica):**

```typescript
getDescription() {
  return `${this.name()} tiene ${this.age()} años.`;
}
```

```html
<dd>{{ getDescription() }}</dd>
<!-- Se ejecuta en CADA detección de cambios -->
```

**✅ Computed signal (Mejor práctica):**

```typescript
heroDescription = computed(() => {
  return `${this.name()} tiene ${this.age()} años.`;
});
```

```html
<dd>{{ heroDescription() }}</dd>
<!-- Solo se recalcula cuando cambian name o age -->
```

#### Comparación: Pipes vs Computed

| Aspecto          | Pipes                                      | Computed Signals                      |
| ---------------- | ------------------------------------------ | ------------------------------------- |
| **Dónde se usa** | En el template (HTML)                      | En la clase (TypeScript)              |
| **Propósito**    | Transformar/formatear datos                | Derivar valores de otros signals      |
| **Sintaxis**     | `{{ valor \| pipe }}`                      | `computed(() => ...)`                 |
| **Ejemplo**      | `{{ name \| uppercase }}`                  | `fullName = computed(() => ...)`      |
| **Cuándo usar**  | Formateo visual (fechas, monedas, etc.)    | Lógica de negocio, cálculos complejos |
| **Reusabilidad** | Alto (se puede usar en cualquier template) | Local al componente                   |

### 📊 Resumen Visual: Pipes y Computed

```
┌─────────────────────────────────────────────────────┐
│                  COMPONENTE HERO                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Signals (Estado):                                  │
│    name = signal("Superman")                        │
│    age = signal(30)                                 │
│                                                     │
│  Computed (Valor Derivado):                         │
│    heroDescription = computed(() =>                 │
│      `${name()} tiene ${age()} años`                │
│    )                                                │
│                   ↓                                 │
│  Cuando cambia name o age,                          │
│  heroDescription se recalcula automáticamente       │
│                                                     │
├─────────────────────────────────────────────────────┤
│                   TEMPLATE                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  {{ name() }}              → Superman               │
│  {{ name() | uppercase }}  → SUPERMAN (Pipe)        │
│  {{ heroDescription() }}   → Superman tiene 30...   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 8️⃣ Template Reference Variables y Formularios

Las **Template Reference Variables** (`#variable`) permiten acceder a elementos HTML del DOM y sus valores directamente en el template.

#### ¿Qué son las Template Reference Variables?

Son referencias a elementos HTML que puedes usar en el mismo template o acceder desde el componente. Se declaran con el símbolo `#`.

```html
<!-- Archivo: src/app/pages/dragonball/dragonball.html -->
<input
  type="text"
  class="form-control mt-2"
  placeholder="Nombre"
  [value]="name()"
  (input)="name.set(txtName.value)"
  #txtName  <!-- 👈 Template Reference Variable -->
/>
```

#### Ejemplo Completo: Formulario de Dragonball

Este formulario permite agregar personajes a una lista usando signals y template reference variables:

```typescript
// Archivo: src/app/pages/dragonball/dragonball.ts
import { Component, signal } from '@angular/core';
import { CharacterList } from '../../components/dragonball/character-list/character-list/character-list';
import { Character } from '../../interfaces/character.interface';

@Component({
  selector: 'app-dragonball',
  imports: [CharacterList],
  templateUrl: './dragonball.html',
  styleUrl: './dragonball.css',
})
export class DragonballComponent {
  name = signal<string>('');
  power = signal<number>(0);

  characters = signal<Character[]>([
    { id: 1, name: 'Goku', power: 9001 },
    { id: 2, name: 'Vegeta', power: 8500 },
    { id: 3, name: 'Gohan', power: 7000 },
    { id: 4, name: 'Piccolo', power: 6000 },
    { id: 5, name: 'Frieza', power: 12000 },
    { id: 6, name: 'Yamcha', power: 4000 },
  ]);

  addCharacter() {
    const newCharacter: Character = {
      id: this.characters().length + 1,
      name: this.name(),
      power: this.power(),
    };

    // Actualizar el signal con el nuevo array
    this.characters.update((characters) => [...characters, newCharacter]);

    // Limpiar el formulario
    this.name.set('');
    this.power.set(0);
  }
}
```

```html
<!-- Archivo: src/app/pages/dragonball/dragonball.html -->
<h1>Dragonball Page</h1>
<hr />
<section class="row">
  <div class="col-12 col-sm-6">
    <h3>Agregar {{ name() }}</h3>

    <!-- Input con Template Reference Variable -->
    <input
      type="text"
      class="form-control mt-2"
      placeholder="Nombre"
      [value]="name()"
      (input)="name.set(txtName.value)"
      #txtName  <!-- 👈 Variable de referencia -->
    />

    <input
      type="number"
      class="form-control mt-2"
      placeholder="Poder"
      [value]="power()"
      (input)="power.set(+txtPower.value)"  <!-- 👈 El + convierte a número -->
      #txtPower
    />

    <button (click)="addCharacter()" class="btn btn-primary mt-2">
      Agregar
    </button>
  </div>
  <div class="col-12 col-sm-6">
    <dragonball-character-list [characters]="characters()" />
  </div>
</section>
```

#### Conceptos Clave del Ejemplo:

1. **`#txtName` y `#txtPower`**: Referencias a los inputs HTML
2. **`[value]="name()"`**: Property binding para mostrar el valor del signal en el input
3. **`(input)="name.set(txtName.value)"`**: Actualiza el signal cuando el usuario escribe
4. **`+txtPower.value`**: El operador `+` convierte el string a número
5. **`.update((characters) => [...characters, newCharacter])`**: Agrega un elemento al array inmutablemente

#### Ventajas de Template Reference Variables:

✅ **Acceso directo al DOM**: No necesitas `document.getElementById()`
✅ **Código más limpio**: Evitas crear propiedades en el componente solo para el formulario
✅ **Integración con signals**: Perfecta combinación para formularios reactivos

### 9️⃣ Control Flow - Directivas de Flujo de Control

Angular 17+ introduce una nueva sintaxis de **Control Flow** más limpia y eficiente que las directivas estructurales anteriores (`*ngIf`, `*ngFor`).

#### `@for` - Iteración sobre Arrays

La directiva `@for` reemplaza a `*ngFor` con una sintaxis más legible:

```html
<!-- Archivo: src/app/components/dragonball/character-list/character-list/character-list.html -->
<h3>Personajes Fuertes</h3>
<ul>
  @for (character of characters(); track character.name; let i = $index) { @if (character.power >
  6000) {
  <li>
    <span>{{ i + 1 }}: {{ character.name }}</span>
    <strong
      [class.text-danger]="character.power > 9000"
      [class.text-primary]="character.power < 9000"
    >
      ({{ character.power }})
    </strong>
  </li>
  } }
</ul>
```

**Sintaxis de `@for`:**

```typescript
@for (item of items; track item.id; let index = $index) {
  // Contenido
}
```

**Propiedades importantes:**

- **`track`**: Especifica qué propiedad usar para identificar cada elemento (obligatorio para rendimiento)
- **`let i = $index`**: Variable que contiene el índice actual
- **`$first`**: `true` si es el primer elemento
- **`$last`**: `true` si es el último elemento
- **`$even`**: `true` si el índice es par
- **`$odd`**: `true` si el índice es impar
- **`$count`**: Total de elementos

#### `@if` - Renderizado Condicional

La directiva `@if` reemplaza a `*ngIf`:

```html
@if (character.power > 6000) {
<li>Solo muestra personajes con poder > 6000</li>
}
```

**Con `@else`:**

```html
@if (characters().length > 0) {
<ul>
  Lista de personajes
</ul>
} @else {
<p>No hay personajes</p>
}
```

**Con `@else if`:**

```html
@if (power > 9000) {
<span class="text-danger">¡SUPER PODEROSO!</span>
} @else if (power > 5000) {
<span class="text-warning">Poderoso</span>
} @else {
<span class="text-muted">Débil</span>
}
```

#### `@switch` - Múltiples Condiciones

```html
@switch (estado) { @case ('activo') {
<span class="badge bg-success">Activo</span>
} @case ('inactivo') {
<span class="badge bg-danger">Inactivo</span>
} @default {
<span class="badge bg-secondary">Desconocido</span>
} }
```

#### Comparación: Sintaxis Antigua vs Nueva

| Antigua (< Angular 17)       | Nueva (>= Angular 17)                 |
| ---------------------------- | ------------------------------------- |
| `*ngFor="let item of items"` | `@for (item of items; track item.id)` |
| `*ngIf="condition"`          | `@if (condition)`                     |
| `*ngSwitch`, `*ngSwitchCase` | `@switch`, `@case`                    |

**Ventajas del nuevo Control Flow:**

- ✅ Sintaxis más clara y legible
- ✅ Mejor rendimiento (compilación más eficiente)
- ✅ TypeScript type checking más estricto
- ✅ No necesitas importar directivas
- ✅ Más fácil de entender para desarrolladores nuevos

### 🔟 Input Properties - Comunicación entre Componentes

Los **Input Properties** permiten pasar datos de un componente padre a un componente hijo. Angular 17+ introduce `input.required<>` para inputs obligatorios.

#### Ejemplo: Componente CharacterList

El componente `DragonballComponent` (padre) pasa datos al componente `CharacterList` (hijo):

```typescript
// Archivo: src/app/components/dragonball/character-list/character-list/character-list.ts
import { Component, input } from '@angular/core';
import { Character } from '../../../../interfaces/character.interface';

@Component({
  selector: 'dragonball-character-list',
  imports: [],
  templateUrl: './character-list.html',
  styleUrl: './character-list.css',
})
export class CharacterList {
  // Input obligatorio: El componente padre DEBE pasar este dato
  characters = input.required<Character[]>();
}
```

```html
<!-- Archivo: Componente PADRE (dragonball.html) -->
<dragonball-character-list [characters]="characters()" />
<!--                       ↑                ↑
                     Input del hijo    Signal del padre -->
```

```html
<!-- Archivo: Componente HIJO (character-list.html) -->
<h3>Personajes Fuertes</h3>
<ul>
  @for (character of characters(); track character.name; let i = $index) { @if (character.power >
  6000) {
  <li>
    <span>{{ i + 1 }}: {{ character.name }}</span>
    <strong
      [class.text-danger]="character.power > 9000"
      [class.text-primary]="character.power < 9000"
    >
      ({{ character.power }})
    </strong>
  </li>
  } }
</ul>
```

#### Tipos de Inputs

**1. Input Requerido (Obligatorio):**

```typescript
characters = input.required<Character[]>();
// El padre DEBE pasar este dato
```

**2. Input Opcional (con valor por defecto):**

```typescript
title = input<string>('Título por defecto');
// El padre puede o no pasar este dato
```

**3. Input con Transformación:**

```typescript
// Convierte automáticamente string a número
age = input<number, string>(0, {
  transform: (value: string) => parseInt(value, 10),
});
```

#### Flujo de Datos: Padre → Hijo

```
┌──────────────────────────────────────┐
│    DragonballComponent (Padre)       │
│                                      │
│  characters = signal<Character[]>([  │
│    { name: 'Goku', power: 9001 }     │
│  ]);                                 │
│                                      │
│  <dragonball-character-list          │
│    [characters]="characters()" />    │ ← Pasa datos al hijo
└────────────┬─────────────────────────┘
             │
             ↓
┌────────────▼─────────────────────────┐
│    CharacterList (Hijo)              │
│                                      │
│  characters = input.required<...>(); │ ← Recibe datos del padre
│                                      │
│  @for (character of characters())    │
└──────────────────────────────────────┘
```

#### Ventajas de `input.required<>()`

✅ **Type-safe**: TypeScript verifica los tipos automáticamente
✅ **Obligatorio**: Angular lanza error si falta el input
✅ **Signal-based**: Se integra perfectamente con signals
✅ **Sin decoradores**: Más limpio que `@Input()`
✅ **Mejor rendimiento**: Optimizado para la nueva arquitectura de Angular

### 1️⃣1️⃣ Interfaces de TypeScript en Angular

Las **interfaces** definen la estructura y tipo de datos de objetos. Son fundamentales para el desarrollo con TypeScript y Angular.

#### Definición de Interface

```typescript
// Archivo: src/app/interfaces/character.interface.ts
export interface Character {
  id: number;
  name: string;
  power: number;
}
```

#### Uso en Componentes

```typescript
// Tipar un signal con la interface
characters = signal<Character[]>([
  { id: 1, name: 'Goku', power: 9001 },
  { id: 2, name: 'Vegeta', power: 8500 },
]);

// Tipar un parámetro
addCharacter() {
  const newCharacter: Character = {  // 👈 TypeScript verifica la estructura
    id: this.characters().length + 1,
    name: this.name(),
    power: this.power(),
  };
}

// Tipar un input
characters = input.required<Character[]>();  // 👈 Array de Character
```

### 1️⃣2️⃣ Output Properties - Comunicación de Hijo a Padre

Los **Output Properties** permiten que un componente hijo envíe datos o notifique eventos al componente padre. Es el flujo inverso a los Inputs.

#### ¿Qué son los Outputs?

Mientras los **Inputs** permiten que el padre pase datos al hijo, los **Outputs** permiten que el hijo envíe datos de vuelta al padre.

```
Padre ─[input]──> Hijo    (Enviar datos al hijo)
Padre <─[output]─ Hijo    (Recibir eventos/datos del hijo)
```

#### Ejemplo: CharacterAdd Component

El componente `CharacterAdd` (hijo) notifica al componente `DragonballComponent` (padre) cuando se agrega un nuevo personaje:

```typescript
// Archivo: src/app/components/dragonball/character-add/character-add.ts
import { Component, output, signal } from '@angular/core';
import { Character } from '../../../interfaces/character.interface';

@Component({
  selector: 'dragonball-character-add',
  imports: [],
  templateUrl: './character-add.html',
  styleUrl: './character-add.css',
})
export class CharacterAdd {
  name = signal<string>('');
  power = signal<number>(0);

  // Output: Emite un evento con un objeto Character
  newCharacter = output<Character>();

  addCharacter() {
    if (!this.name() || !this.power() || this.power() <= 0) return;

    const character: Character = {
      id: Math.floor(Math.random() * 10000),
      name: this.name(),
      power: this.power(),
    };

    // Emitir el evento al componente padre
    this.newCharacter.emit(character);

    // Limpiar el formulario
    this.name.set('');
    this.power.set(0);
  }
}
```

```html
<!-- Archivo: src/app/components/dragonball/character-add/character-add.html -->
<h3>Agregar {{ name() }}</h3>
<input
  type="text"
  class="form-control mt-2"
  placeholder="Nombre"
  [value]="name()"
  (input)="name.set(txtName.value)"
  #txtName
/>
<input
  type="number"
  class="form-control mt-2"
  placeholder="Poder"
  [value]="power()"
  (input)="power.set(+txtPower.value)"
  #txtPower
/>

<button (click)="addCharacter()" class="btn btn-primary mt-2">Agregar</button>
```

#### Componente Padre Recibiendo el Evento

```typescript
// Archivo: src/app/pages/dragonball/dragonball.ts
import { Component, inject } from '@angular/core';
import { CharacterAdd } from '../../components/dragonball/character-add/character-add';
import { Character } from '../../interfaces/character.interface';
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

  // Método que recibe el evento del hijo
  adddCharacter(character: Character) {
    this.dragonballService.adddCharacter(character);
  }
}
```

```html
<!-- Archivo: src/app/pages/dragonball/dragonball.html -->
<h1>Dragonball Page</h1>
<hr />
<section class="row">
  <div class="col-12 col-sm-6">
    <!-- Escuchar el output del hijo -->
    <dragonball-character-add (newCharacter)="adddCharacter($event)" />
    <!--                       ↑               ↑           ↑
                            output         método     datos emitidos -->
  </div>
  <div class="col-12 col-sm-6">
    <dragonball-character-list [characters]="characters()" listName="Personajes Fuertes" />
  </div>
</section>
```

#### Flujo Completo: Input + Output

```
┌───────────────────────────────────────────────────┐
│    DragonballComponent (Padre)                    │
│                                                   │
│  adddCharacter(character: Character) {            │
│    // Recibe el personaje del hijo                │
│    this.service.adddCharacter(character);         │
│  }                                                │
│                                                   │
│  <dragonball-character-add                        │
│    (newCharacter)="adddCharacter($event)" />      │ ← Escucha output
└────────────┬──────────────────────────────────────┘
             │
             ↓ (cuando se emite)
┌────────────▼──────────────────────────────────────┐
│    CharacterAdd (Hijo)                            │
│                                                   │
│  newCharacter = output<Character>();              │
│                                                   │
│  addCharacter() {                                 │
│    this.newCharacter.emit(character); ────────┐   │ ← Emite evento
│  }                                            │   │
└───────────────────────────────────────────────┼───┘
                                                │
                                                └─> Evento enviado al padre
```

#### Comparación: Input vs Output

| Aspecto            | Input                    | Output                         |
| ------------------ | ------------------------ | ------------------------------ |
| **Dirección**      | Padre → Hijo             | Hijo → Padre                   |
| **Propósito**      | Pasar datos al hijo      | Notificar eventos al padre     |
| **Declaración**    | `input.required<T>()`    | `output<T>()`                  |
| **Uso en Padre**   | `[propiedad]="dato"`     | `(evento)="metodo($event)"`    |
| **Acción en Hijo** | Leer el dato             | Emitir con `.emit()`           |
| **Ejemplo**        | `[characters]="chars()"` | `(newCharacter)="add($event)"` |

#### Ventajas de `output<>()`

✅ **Type-safe**: TypeScript verifica los tipos automáticamente
✅ **Signal-based**: Se integra perfectamente con signals
✅ **Sin decoradores**: Más limpio que `@Output()`
✅ **Mejor rendimiento**: Optimizado para la nueva arquitectura de Angular
✅ **Desacoplamiento**: El hijo no necesita conocer la lógica del padre

### 1️⃣3️⃣ Servicios - Compartir Datos y Lógica entre Componentes

Los **servicios** son clases que contienen lógica de negocio y datos que pueden ser compartidos entre múltiples componentes. Son fundamentales para mantener el código organizado y reutilizable.

#### ¿Qué son los Servicios?

Los servicios permiten:

- ✅ Compartir datos entre componentes
- ✅ Centralizar lógica de negocio
- ✅ Mantener datos persistentes mientras la aplicación está activa
- ✅ Comunicar componentes que no tienen relación padre-hijo
- ⚠️ **Los datos se pierden al recargar la página del navegador**

#### Creación de un Servicio

```typescript
// Archivo: src/app/services/dragonball.service.ts
import { Injectable, signal } from '@angular/core';
import { Character } from '../interfaces/character.interface';

@Injectable({ providedIn: 'root' }) // 👈 Singleton en toda la aplicación
export class DragonballService {
  // Estado compartido usando signals
  characters = signal<Character[]>([
    { id: 1, name: 'Goku', power: 9001 },
    { id: 2, name: 'Vegeta', power: 8500 },
    { id: 3, name: 'Gohan', power: 7000 },
    { id: 4, name: 'Piccolo', power: 6000 },
    { id: 5, name: 'Frieza', power: 12000 },
    { id: 6, name: 'Yamcha', power: 4000 },
  ]);

  // Método para agregar un personaje
  adddCharacter(character: Character) {
    this.characters.update((characters) => [...characters, character]);
  }
}
```

#### Inyección de Dependencias con `inject()`

Angular 17+ introduce `inject()` como la forma moderna de inyectar servicios:

```typescript
// Archivo: src/app/pages/dragonball/dragonball.ts
import { Component, inject } from '@angular/core';
import { DragonballService } from '../../services/dragonball.service';

@Component({
  selector: 'app-dragonball',
  imports: [CharacterList, CharacterAdd],
  templateUrl: './dragonball.html',
  styleUrl: './dragonball.css',
})
export class DragonballComponent {
  // Inyectar el servicio con inject()
  public dragonballService = inject(DragonballService);

  // Acceder a los datos del servicio
  public characters = this.dragonballService.characters;

  adddCharacter(character: Character) {
    // Usar métodos del servicio
    this.dragonballService.adddCharacter(character);
  }
}
```

#### Persistencia de Datos

**✅ Los datos persisten:**

- Al navegar entre rutas/componentes
- Al destruir y crear componentes
- Mientras la aplicación Angular esté cargada

**❌ Los datos NO persisten:**

- Al recargar la página (F5)
- Al cerrar y reabrir el navegador
- Al limpiar la caché del navegador

#### Ejemplo de Persistencia entre Componentes

```
┌─────────────────────────────────────────────────┐
│         DragonballService (Singleton)           │
│                                                 │
│  characters = signal([...])                     │
│  ↑                                       ↑      │
│  │                                       │      │
│  │ Comparten el mismo servicio           │      │
│  │                                       │      │
└──┼───────────────────────────────────────┼──────┘
   │                                       │
   ↓                                       ↓
┌──────────────────┐              ┌──────────────────┐
│ DragonballComp   │              │  Otro Componente │
│                  │  Navegación  │                  │
│ Se destruye  ────┼──────────────→  Se crea         │
│                  │              │                  │
│ Los datos        │              │  Los datos       │
│ persisten en     │              │  siguen          │
│ el servicio      │              │  disponibles     │
└──────────────────┘              └──────────────────┘
```

#### Ventajas de los Servicios

✅ **Singleton**: Una sola instancia compartida en toda la app (`providedIn: 'root'`)
✅ **Separación de responsabilidades**: La lógica de negocio no está en los componentes
✅ **Reutilización**: Múltiples componentes pueden usar el mismo servicio
✅ **Testeable**: Más fácil de probar que la lógica mezclada con componentes
✅ **Mantenibilidad**: Cambios en un solo lugar afectan a todos los componentes

#### Comparación: Forma Antigua vs Nueva

**Forma Antigua (< Angular 14):**

```typescript
export class DragonballComponent {
  // Constructor injection
  constructor(private dragonballService: DragonballService) {}
}
```

**Forma Nueva (>= Angular 14):**

```typescript
export class DragonballComponent {
  // Function-based injection
  public dragonballService = inject(DragonballService);
}
```

**Ventajas de `inject()`:**

- ✅ Código más corto y legible
- ✅ Puede usarse fuera del constructor
- ✅ Mejor para composition API
- ✅ Más flexible y funcional

#### Para Persistir Datos al Recargar la Página

Si necesitas que los datos persistan al recargar la página, debes usar:

1. **LocalStorage**: Para datos simples que persisten en el navegador

```typescript
localStorage.setItem('characters', JSON.stringify(this.characters()));
const saved = localStorage.getItem('characters');
```

2. **SessionStorage**: Para datos que persisten solo durante la sesión

```typescript
sessionStorage.setItem('characters', JSON.stringify(this.characters()));
```

3. **Backend/API**: Para datos que deben persistir en un servidor

```typescript
http.post('/api/characters', character).subscribe();
```

4. **IndexedDB**: Para datos más complejos en el navegador

### 1️⃣4️⃣ Ciclo de Vida del Componente

Los componentes tienen hooks (ganchos) que se ejecutan en diferentes momentos:

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';

export class MiComponente implements OnInit, OnDestroy {
  constructor() {
    // 1. Se ejecuta primero al crear el componente
    console.log('Constructor');
  }

  ngOnInit() {
    // 2. Se ejecuta después de inicializar el componente
    console.log('Componente inicializado');
    // Aquí se suelen cargar datos iniciales
  }

  ngOnDestroy() {
    // 3. Se ejecuta antes de destruir el componente
    console.log('Componente destruido');
    // Aquí se limpian recursos (subscripciones, timers, etc.)
  }
}
```

**Principales Lifecycle Hooks:**

- `ngOnInit()`: Inicialización del componente
- `ngOnChanges()`: Cuando cambian los inputs
- `ngOnDestroy()`: Limpieza antes de destruir el componente
- `ngAfterViewInit()`: Después de inicializar la vista

### 📝 Resumen de Componentes Angular

```
┌─────────────────────────────────────────┐
│         COMPONENTE ANGULAR              │
├─────────────────────────────────────────┤
│                                         │
│  @Component({ ... })  ← Decorador       │
│                        (Metadatos)      │
│                                         │
│  export class App {   ← Clase           │
│                        (Lógica)         │
│    propiedades                          │
│    métodos                              │
│    lifecycle hooks                      │
│  }                                      │
│                                         │
│  +                                      │
│                                         │
│  Template HTML        ← Vista           │
│  Estilos CSS          ← Presentación    │
└─────────────────────────────────────────┘
```

### 🎯 Conceptos Clave sobre Componentes

1. **Decorador `@Component`**: Convierte una clase TypeScript en un componente Angular mediante metadatos
2. **Clase**: Contiene la lógica, propiedades y métodos del componente
3. **Signals**: Forma moderna y eficiente de manejar estado reactivo (Angular 16+)
4. **Interpolación `{{ }}`**: Muestra datos de la clase en el template
5. **Event Binding `()`**: Escucha eventos del DOM y ejecuta métodos de la clase
6. **Property Binding `[]`**: Establece propiedades de elementos HTML desde la clase
7. **Two-way Binding `[()]`**: Sincronización bidireccional entre clase y template
8. **Pipes `|`**: Transforman datos en el template (uppercase, date, currency, etc.)
9. **Computed Signals**: Valores derivados que se recalculan automáticamente
10. **Template Reference Variables `#`**: Referencias a elementos HTML del DOM
11. **Control Flow (`@for`, `@if`)**: Nueva sintaxis para iteración y condicionales
12. **Input Properties**: Comunicación de datos de padre a hijo
13. **Output Properties**: Comunicación de eventos de hijo a padre
14. **Interfaces**: Definición de estructura y tipos de datos en TypeScript
15. **Servicios**: Compartir datos y lógica entre componentes (persisten mientras la app está activa)
16. **Lifecycle Hooks**: Métodos especiales que se ejecutan en momentos específicos del ciclo de vida del componente

## 🧭 Sistema de Rutas (Routing) en Angular

El sistema de routing de Angular permite crear aplicaciones de página única (SPA) donde el contenido cambia sin recargar la página completa. Es como tener múltiples "páginas" dentro de una sola aplicación web.

### ¿Qué es el Routing?

El routing permite:

- ✅ Navegar entre diferentes vistas/páginas sin recargar el navegador
- ✅ Mantener URLs únicas para cada vista (`/home`, `/about`, `/products`)
- ✅ Usar los botones de navegación del navegador (atrás/adelante)
- ✅ Compartir enlaces directos a secciones específicas de la aplicación

### Componentes Clave del Sistema de Rutas

#### 1️⃣ `app.routes.ts` - Definición de Rutas

Este archivo define todas las rutas de tu aplicación. Cada ruta conecta una URL con un componente específico.

```typescript
// Archivo: src/app/app.routes.ts
import { Routes } from '@angular/router';
import { CounterPageComponent } from './pages/counter/counter';
import { HeroComponent } from './pages/hero/hero';
import { DragonballComponent } from './pages/dragonball/dragonball';

export const routes: Routes = [
  {
    path: '', // 👈 URL: http://localhost:4200/
    component: CounterPageComponent, // 👈 Componente que se mostrará
  },
  {
    path: 'hero', // 👈 URL: http://localhost:4200/hero
    component: HeroComponent,
  },
  {
    path: 'dragonball', // 👈 URL: http://localhost:4200/dragonball
    component: DragonballComponent,
  },
];
```

**Estructura de una Ruta:**

```typescript
{
  path: 'ruta',           // La URL (sin el /)
  component: MiComponente // El componente que se renderizará
}
```

**Ejemplos de rutas comunes:**

```typescript
export const routes: Routes = [
  {
    path: '', // Ruta raíz: http://localhost:4200/
    component: HomeComponent,
  },
  {
    path: 'counter', // http://localhost:4200/counter
    component: CounterPageComponent,
  },
  {
    path: 'about', // http://localhost:4200/about
    component: AboutComponent,
  },
  {
    path: 'products/:id', // http://localhost:4200/products/123
    component: ProductDetailComponent, // Ruta con parámetro
  },
  {
    path: '**', // Cualquier ruta no definida (404)
    component: NotFoundComponent,
  },
];
```

#### 2️⃣ `<router-outlet />` - El Contenedor Dinámico

Esta etiqueta especial en el template es donde Angular renderiza dinámicamente los componentes según la ruta activa.

```html
<!-- Archivo: src/app/app.html -->
<router-outlet />
```

**¿Cómo funciona?**

Imagina que `<router-outlet />` es un "espacio reservado" que cambia su contenido según la URL:

```
┌──────────────────────────────────────┐
│  Header (siempre visible)            │
├──────────────────────────────────────┤
│                                      │
│  <router-outlet />                   │
│  ↓                                   │
│  Aquí se renderiza el componente     │
│  según la ruta activa:               │
│                                      │
│  URL: /          → HomeComponent     │
│  URL: /counter   → CounterComponent  │
│  URL: /about     → AboutComponent    │
│                                      │
├──────────────────────────────────────┤
│  Footer (siempre visible)            │
└──────────────────────────────────────┘
```

**Ejemplo con layout completo:**

```html
<!-- Archivo: src/app/app.html -->
<app-navbar />
<section class="mx-5 mt-2">
  <router-outlet />
  <!-- El contenido cambia aquí -->
</section>
```

En este proyecto, el componente `NavBar` se muestra siempre y el `<router-outlet />` renderiza el componente según la ruta activa (Counter, Hero o Dragonball).

#### 3️⃣ Configuración del Router en `app.config.ts`

El router se configura como un servicio global de la aplicación:

```typescript
// Archivo: src/app/app.config.ts
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), // 👈 Proporciona el router con las rutas definidas
  ],
};
```

**`provideRouter(routes)`**: Inyecta el servicio de routing en toda la aplicación y le pasa las rutas definidas en `app.routes.ts`.

#### 4️⃣ Bootstrap de la Aplicación en `main.ts`

```typescript
// Archivo: src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig) // 👈 Inicia la app con la configuración (incluido el router)
  .catch((err) => console.error(err));
```

### 🔄 Flujo Completo del Routing

```
1. Usuario escribe URL o hace click en enlace
   ↓
2. Angular Router intercepta la navegación
   ↓
3. Router busca la ruta en app.routes.ts
   ↓
4. Router encuentra el componente asociado
   ↓
5. Router renderiza el componente en <router-outlet />
   ↓
6. Usuario ve el nuevo contenido (sin recargar la página)
```

### 🔗 Navegación entre Rutas

Hay varias formas de navegar entre rutas en Angular:

#### Opción 1: Directiva `routerLink` (HTML)

La directiva `routerLink` permite navegar declarativamente en el template. En este proyecto, el componente `NavBar` muestra cómo usarla:

```typescript
// Archivo: src/app/components/shared/navbar/navbar.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive], // 👈 Importar las directivas
  templateUrl: './navbar.html',
})
export class Navbar {}
```

```html
<!-- Archivo: src/app/components/shared/navbar/navbar.html -->
<nav>
  <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
    Counter
  </a>
  <a routerLink="/hero" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
    Hero
  </a>
  <a routerLink="/dragonball" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
    Dragonball
  </a>
</nav>
```

**Directivas de Router:**

- **`routerLink`**: Define la ruta a la que navegará
- **`routerLinkActive="active"`**: Añade la clase CSS `"active"` cuando la ruta está activa
- **`[routerLinkActiveOptions]="{ exact: true }"`**: Solo marca como activo si la ruta coincide exactamente

**Otros ejemplos de routerLink:**

```html
<!-- Navegación con parámetros -->
<a routerLink="/products/123">Producto 123</a>

<!-- Con array de segmentos -->
<a [routerLink]="['/products', productId]">Ver Producto</a>

<!-- Con rutas relativas -->
<button routerLink="../back">Volver</button>
```

#### Opción 2: Router Service (TypeScript)

```typescript
import { Router } from '@angular/router';

export class MiComponente {
  constructor(private router: Router) {}

  navegarACounter() {
    this.router.navigate(['/counter']);
  }

  navegarConParametros() {
    this.router.navigate(['/products', 123]);
  }

  volverAtras() {
    this.router.navigate(['..']);
  }
}
```

### 📌 Características Adicionales del Routing

#### Rutas con Parámetros

```typescript
// Definir ruta con parámetro
{
  path: 'products/:id',
  component: ProductDetailComponent
}

// Leer el parámetro en el componente
import { ActivatedRoute } from '@angular/router';

export class ProductDetailComponent {
  productId: string = '';

  constructor(private route: ActivatedRoute) {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
  }
}
```

#### Rutas Anidadas (Children)

```typescript
{
  path: 'dashboard',
  component: DashboardComponent,
  children: [
    { path: 'stats', component: StatsComponent },
    { path: 'settings', component: SettingsComponent }
  ]
}
// URLs: /dashboard/stats, /dashboard/settings
```

#### Lazy Loading (Carga Perezosa)

Carga componentes solo cuando se necesitan para mejorar el rendimiento:

```typescript
{
  path: 'admin',
  loadComponent: () => import('./admin/admin.component')
    .then(m => m.AdminComponent)
}
```

### 🎯 Resumen Visual del Sistema de Rutas

```
┌─────────────────────────────────────────────────────────┐
│                     main.ts                             │
│  bootstrapApplication(App, appConfig)                   │
│         ↓                     ↓                         │
│    app.html          app.config.ts                      │
│ <router-outlet />   provideRouter(routes) ──────┐       │
│         ↑                                       │       │
│         └───────────────────────────────────────┘       │
│                          ↓                              │
│                   app.routes.ts                         │
│      [                                                  │
│        { path: '', component: CounterComponent },       │
│        { path: 'about', component: AboutComponent }     │
│      ]                                                  │
│                          ↓                              │
│         Usuario navega a /counter                       │
│                          ↓                              │
│   CounterComponent se renderiza en <router-outlet />    │
└─────────────────────────────────────────────────────────┘
```

### ✅ Conceptos Clave del Routing

1. **`app.routes.ts`**: Define el mapa de rutas (URL → Componente)
2. **`<router-outlet />`**: Contenedor donde se renderizan los componentes según la ruta
3. **`provideRouter(routes)`**: Configura el router a nivel de aplicación
4. **`routerLink`**: Directiva para navegar entre rutas desde el template
5. **`Router` service**: Servicio para navegar programáticamente desde TypeScript
6. **SPA (Single Page Application)**: La página no se recarga, solo cambia el contenido
7. **Lazy Loading**: Carga componentes bajo demanda para optimizar el rendimiento

---

## 🔧 Extra: Configurar Prettier para Archivos HTML de Angular

Si tienes problemas con el formato automático de Prettier que reorganiza tus etiquetas HTML y los control flows (`@for`, `@if`) de manera no deseada, aquí está la solución:

### Problema Común

Prettier con el parser de Angular reformatea automáticamente el código HTML, quitando la tabulación personalizada y reorganizando los control flows de forma estricta. Esto puede ser frustrante si vienes de React u otros frameworks donde tienes más control.

### Solución: Cambiar el Parser de Angular a HTML Estándar

#### Paso 1: Instalar Prettier como Dependencia de Desarrollo

Es importante instalar Prettier localmente en el proyecto, ya que el Prettier global puede no funcionar correctamente:

```bash
npm i -D prettier
```

#### Paso 2: Crear/Actualizar el archivo `.prettierrc`

Crea un archivo `.prettierrc` en la raíz de tu proyecto con la siguiente configuración:

```json
{
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "angular"
      }
    }
  ]
}
```

**Nota Importante:** Si pones `"parser": "angular"`, el formateo será muy estricto y reorganizará los control flows automáticamente. Si esto te causa problemas, **cambia a `"parser": "html"`**:

```json
{
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "html"
      }
    }
  ]
}
```

#### Paso 3: Crear el archivo `.vscode/settings.json`

**Importante:** También necesitas configurar VS Code para que use Prettier correctamente. Crea la carpeta `.vscode` en la raíz del proyecto (si no existe) y dentro crea el archivo `settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

Este archivo le indica a VS Code que:

- Use Prettier como formateador por defecto
- Formatee automáticamente al guardar archivos

**Nota:** Asegúrate de tener instalada la extensión de Prettier en VS Code: `Prettier - Code formatter` (esbenp.prettier-vscode)

#### Paso 4: Reiniciar Visual Studio Code

Después de crear/modificar los archivos `.prettierrc` y `.vscode/settings.json`, reinicia VS Code:
