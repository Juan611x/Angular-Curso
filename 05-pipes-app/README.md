# 📝 Pipes en Angular - Notas del Curso

## 📚 Índice

1. [Introducción](#introducción)
2. [¿Qué son los Pipes?](#qué-son-los-pipes)
3. [Configuración del Proyecto](#configuración-del-proyecto)
4. [Pipes Básicos](#pipes-básicos)
5. [Pipes de Números y Moneda](#pipes-de-números-y-moneda)
6. [Pipes Poco Comunes](#pipes-poco-comunes)
7. [Internacionalización (i18n)](#internacionalización-i18n)
8. [Pipes Personalizados](#pipes-personalizados)
9. [Conceptos Clave](#conceptos-clave)

---

## Introducción

Este proyecto es parte del curso de Angular y se enfoca en el aprendizaje y aplicación de **Pipes** en Angular 20. Los Pipes son una característica fundamental de Angular que permite transformar datos en las plantillas de forma declarativa y reutilizable.

**Tecnologías utilizadas:**

- Angular 20.3.0
- TypeScript 5.9.2
- Tailwind CSS 4.1.17
- DaisyUI 5.5.8
- RxJS 7.8.0

---

## ¿Qué son los Pipes?

Los **Pipes** son funciones de transformación que se aplican a valores en las plantillas de Angular. Permiten formatear, filtrar y transformar datos antes de mostrarlos en la vista sin modificar el valor original en el componente.

### Sintaxis básica:

```html
{{ valor | nombreDelPipe }} {{ valor | nombreDelPipe : 'parametro1' : 'parametro2' }}
```

### Características importantes:

- **Puros por defecto**: Solo se ejecutan cuando detectan cambios en el valor de entrada o en los parámetros
- **Encadenables**: Se pueden combinar múltiples pipes usando el operador `|`
- **Reutilizables**: Un mismo pipe se puede usar en múltiples componentes
- **No mutan datos**: Devuelven un nuevo valor sin modificar el original

---

## Configuración del Proyecto

### Estructura del proyecto:

```
src/
├── app/
│   ├── app.config.ts          # Configuración principal de la app
│   ├── app.routes.ts          # Definición de rutas
│   ├── components/
│   │   ├── card/              # Componente reutilizable para mostrar ejemplos
│   │   └── navbar/            # Barra de navegación
│   ├── pages/
│   │   ├── basic-page/        # Ejemplos de pipes básicos
│   │   ├── numbers-page/      # Ejemplos de pipes numéricos
│   │   ├── uncommon-page/     # Pipes menos comunes
│   │   └── custom-page/       # Para pipes personalizados
│   └── services/
│       └── local.service.ts   # Servicio de internacionalización
```

### Instalación y ejecución:

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Compilar para producción
npm run build
```

---

## Pipes Básicos

Los pipes básicos son los más utilizados y vienen incluidos en Angular. Se encuentran en el módulo `@angular/common`.

### Archivos relacionados:

- `src/app/pages/basic-page/basic-page.ts`
- `src/app/pages/basic-page/basic-page.html`

### 1. **UpperCasePipe** - Convertir a mayúsculas

**Importación:**

```typescript
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-basic-page',
  imports: [UpperCasePipe],
  // ...
})
```

**Uso en plantilla:**

```html
{{ nameLower() | uppercase }}
<!-- Resultado: "JUAN IGNACIO" -->
```

**Explicación:** Convierte todo el texto a mayúsculas. Es útil para nombres de títulos, encabezados o cuando necesitas uniformidad en mayúsculas.

---

### 2. **LowerCasePipe** - Convertir a minúsculas

**Importación:**

```typescript
import { LowerCasePipe } from '@angular/common';

@Component({
  imports: [LowerCasePipe],
  // ...
})
```

**Uso en plantilla:**

```html
{{ nameUpper() | lowercase }}
<!-- Resultado: "juan ignacio" -->
```

**Explicación:** Convierte todo el texto a minúsculas. Útil para emails, nombres de usuario o normalización de datos.

---

### 3. **TitleCasePipe** - Formato de título

**Importación:**

```typescript
import { TitleCasePipe } from '@angular/common';
```

**Uso en plantilla:**

```html
{{ fullName() | titlecase }}
<!-- Input: "JuAn IQNaCiO" -->
<!-- Resultado: "Juan Iqnacio" -->
```

**Explicación:** Convierte la primera letra de cada palabra a mayúscula y el resto a minúsculas. Ideal para nombres propios y títulos.

---

### 4. **DatePipe** - Formato de fechas

**Importación:**

```typescript
import { DatePipe } from '@angular/common';
```

El **DatePipe** es uno de los pipes más potentes y versátiles de Angular. Permite formatear fechas de múltiples maneras.

#### Uso básico:

```html
{{ customDate() | date }}
<!-- Resultado: "Dec 7, 2025" (formato por defecto) -->
```

#### Formatos predefinidos:

```html
<!-- Formato largo -->
{{ customDate() | date : 'long' }}
<!-- Resultado: "December 7, 2025 at 10:30:45 AM GMT-5" -->

<!-- Formato corto -->
{{ customDate() | date : 'short' }}
<!-- Resultado: "12/7/25, 10:30 AM" -->

<!-- Formato medio -->
{{ customDate() | date : 'medium' }}
<!-- Resultado: "Dec 7, 2025, 10:30:45 AM" -->
```

#### Formatos personalizados:

```html
<!-- Solo año y mes -->
{{ customDate() | date : 'yyyy MM' }}
<!-- Resultado: "2025 12" -->

<!-- Formato día/mes/año -->
{{ customDate() | date : 'dd/MM/yyyy' }}
<!-- Resultado: "07/12/2025" -->

<!-- Solo hora -->
{{ customDate() | date : 'HH:mm:ss' }}
<!-- Resultado: "10:30:45" -->

<!-- Día de la semana y fecha -->
{{ customDate() | date : 'EEEE d, MMMM' }}
<!-- Resultado: "Saturday 7, December" -->
```

#### Parámetro de zona horaria:

```html
{{ customDate() | date : 'long' : 'GMT-6' }}
<!-- Ajusta la hora a la zona horaria GMT-6 -->

{{ customDate() | date : 'short' : 'GMT-4' }}
<!-- Ajusta la hora a la zona horaria GMT-4 -->
```

#### Símbolos de formato comunes:

- `yyyy`: Año completo (2025)
- `yy`: Año corto (25)
- `MM`: Mes con ceros (01-12)
- `M`: Mes sin ceros (1-12)
- `MMMM`: Nombre del mes completo (December)
- `MMM`: Nombre del mes abreviado (Dec)
- `dd`: Día con ceros (01-31)
- `d`: Día sin ceros (1-31)
- `EEEE`: Nombre del día completo (Saturday)
- `EEE`: Nombre del día abreviado (Sat)
- `HH`: Hora en formato 24h con ceros (00-23)
- `H`: Hora en formato 24h sin ceros (0-23)
- `hh`: Hora en formato 12h con ceros (01-12)
- `h`: Hora en formato 12h sin ceros (1-12)
- `mm`: Minutos con ceros (00-59)
- `ss`: Segundos con ceros (00-59)
- `a`: AM/PM

#### Implementación de fecha en tiempo real:

En `src/app/pages/basic-page/basic-page.ts`:

```typescript
import { Component, effect, signal } from '@angular/core';

export default class BasicPage {
  customDate = signal(new Date());

  // Effect que actualiza la fecha cada segundo
  tickingDateEffect = effect((onCleanup) => {
    const interval = setInterval(() => {
      this.customDate.set(new Date());
      console.log('tick');
    }, 1000);

    // Limpieza cuando el componente se destruye
    onCleanup(() => {
      clearInterval(interval);
    });
  });
}
```

**Explicación del effect:**

- `effect()` crea un efecto reactivo que se ejecuta automáticamente
- `onCleanup()` permite limpiar recursos cuando el componente se destruye
- Actualizamos el signal `customDate` cada segundo para simular un reloj

---

## Pipes de Números y Moneda

Estos pipes permiten formatear valores numéricos, porcentajes y monedas de manera profesional y adaptada a diferentes locales.

### Archivos relacionados:

- `src/app/pages/numbers-page/numbers-page.ts`
- `src/app/pages/numbers-page/numbers-page.html`

### 1. **DecimalPipe (number)** - Formato de números decimales

**Importación:**

```typescript
import { DecimalPipe } from '@angular/common';
```

**Sintaxis:**

```
{{ valor | number : 'enteroMin.decimalMin-decimalMax' }}
```

**Ejemplo:**

```html
{{ totalSales() | number : '1.1-2' }}
<!-- Input: 2433232.5567 -->
<!-- Resultado: "2,433,232.56" -->
```

**Explicación del formato `'1.1-2'`:**

- `1`: Mínimo 1 dígito antes del punto decimal
- `1`: Mínimo 1 dígito después del punto decimal
- `2`: Máximo 2 dígitos después del punto decimal

**Características:**

- Añade separadores de miles automáticamente
- Redondea los decimales al máximo especificado
- Se adapta al locale configurado (comas vs puntos)

---

### 2. **PercentPipe** - Formato de porcentajes

**Importación:**

```typescript
import { PercentPipe } from '@angular/common';
```

**Uso:**

```html
{{ percentage() | percent : '1.1-1' }}
<!-- Input: 0.4856 -->
<!-- Resultado: "48.6%" -->
```

**Explicación:**

- Multiplica el valor por 100 automáticamente
- Añade el símbolo de porcentaje
- Aplica el formato decimal especificado
- `0.4856` se convierte en `48.56%` y se redondea a `48.6%`

---

### 3. **CurrencyPipe** - Formato de moneda

**Importación:**

```typescript
import { CurrencyPipe } from '@angular/common';
```

**Sintaxis completa:**

```
{{ valor | currency : 'código' : 'display' : 'formato' : 'locale' }}
```

**Ejemplo:**

```html
{{ totalSales() | currency : 'COP' : 'symbol-narrow' : '1.4-4' }}
<!-- Input: 2433232.5567 -->
<!-- Resultado: "$2,433,232.5567" (símbolo del peso colombiano) -->
```

**Parámetros:**

- **código**: Código de moneda ISO 4217 (`'USD'`, `'EUR'`, `'COP'`, etc.)
- **display**:
  - `'symbol'`: Muestra el símbolo completo (`US$`)
  - `'symbol-narrow'`: Muestra el símbolo corto (`$`)
  - `'code'`: Muestra el código (`USD`)
  - `'nombre'`: Muestra el nombre (`dollar`)
- **formato**: Igual que DecimalPipe (`'1.2-2'`)
- **locale**: Opcional, usa el locale configurado por defecto

**Ejemplos con diferentes monedas:**

```html
{{ value | currency : 'USD' : 'symbol' }}
<!-- Resultado: "US$2,433,232.56" -->

{{ value | currency : 'EUR' : 'symbol-narrow' }}
<!-- Resultado: "€2.433.232,56" (formato europeo) -->

{{ value | currency : 'COP' : 'code' }}
<!-- Resultado: "COP 2,433,232.56" -->
```

---

## Pipes Poco Comunes

Estos pipes son menos utilizados pero muy útiles en casos específicos.

### Archivos relacionados:

- `src/app/pages/uncommon-page/uncommon-page.ts`
- `src/app/pages/uncommon-page/uncommon-page.html`

### 1. **I18nSelectPipe** - Selección basada en valor

**Importación:**

```typescript
import { I18nSelectPipe } from '@angular/common';
```

**Uso:**

```typescript
// En el componente
invitationMap = {
  male: 'invitarlo',
  female: 'invitarla',
};

client = signal({
  name: 'Juan Ignacio',
  gender: 'male',
});
```

```html
<!-- En la plantilla -->
<p>
  Saludos {{ client().name }}, es un placer {{ client().gender | i18nSelect : invitationMap }} a
  nuestro evento
</p>
<!-- Resultado: "Saludos Juan Ignacio, es un placer invitarlo a nuestro evento" -->
```

**Explicación:**

- Selecciona una cadena de texto basándose en un valor
- Útil para textos que varían según género, estado, tipo, etc.
- El mapa debe tener claves que coincidan con los posibles valores

---

### 2. **I18nPluralPipe** - Pluralización

**Importación:**

```typescript
import { I18nPluralPipe } from '@angular/common';
```

**Uso:**

```typescript
// En el componente
clients = signal(['Juan', 'Maria', 'Jose', 'Ana']);

clientsMap = signal({
  '=0': 'no tenemos clientes',
  '=1': 'tenemos un cliente',
  other: 'tenemos # clientes',
});
```

```html
<!-- En la plantilla -->
<p>Actualmente hay {{ clients().length | i18nPlural : clientsMap() }} esperando.</p>
<!-- Con 4 clientes: "Actualmente hay tenemos 4 clientes esperando." -->
<!-- Con 1 cliente: "Actualmente hay tenemos un cliente esperando." -->
<!-- Con 0 clientes: "Actualmente hay no tenemos clientes esperando." -->
```

**Sintaxis del mapa:**

- `'=0'`, `'=1'`, `'=2'`: Casos exactos
- `'other'`: Caso por defecto
- `#`: Se reemplaza con el número actual

**Casos especiales según el idioma:**

```typescript
// En inglés, por ejemplo:
clientsMapEn = {
  '=0': 'no clients waiting',
  '=1': 'one client waiting',
  other: '# clients waiting',
};
```

---

### 3. **SlicePipe** - Extraer porciones de arrays o strings

**Importación:**

```typescript
import { SlicePipe } from '@angular/common';
```

**Uso con arrays:**

```html
<!-- Array original -->
{{ clients() }}
<!-- ['Juan Ignacio', 'Maria Fernanda', 'Jose Luis', 'Ana Maria'] -->

<!-- Primeros 2 elementos -->
{{ clients() | slice : 0 : 2 }}
<!-- ['Juan Ignacio', 'Maria Fernanda'] -->

<!-- Del índice 1 al 3 -->
{{ clients() | slice : 1 : 3 }}
<!-- ['Maria Fernanda', 'Jose Luis'] -->

<!-- Desde el índice 1 hasta el penúltimo -->
{{ clients() | slice : 1 : -1 }}
<!-- ['Maria Fernanda', 'Jose Luis'] -->

<!-- Últimos 4 elementos (índices negativos desde el final) -->
{{ clients() | slice : -4 }}
<!-- Todos los elementos si hay 4 o menos -->
```

**Uso con strings:**

```html
{{ 'Hello World' | slice : 0 : 5 }}
<!-- Resultado: "Hello" -->
```

**Sintaxis:**

- `slice : inicio : fin`
- `inicio`: Índice de inicio (inclusivo)
- `fin`: Índice de fin (exclusivo)
- Índices negativos cuentan desde el final

---

### 4. **JsonPipe** - Convertir objetos a JSON

**Importación:**

```typescript
import { JsonPipe } from '@angular/common';
```

**Uso:**

```html
<pre>{{ client() | json }}</pre>
```

**Resultado:**

```json
{
  "name": "Juan Ignacio",
  "gender": "male",
  "age": 22,
  "address": "cali, Colombia"
}
```

**Usos principales:**

- **Debugging**: Ver la estructura de objetos en la vista
- **Desarrollo**: Verificar datos durante el desarrollo
- **Inspección**: Mostrar datos complejos de forma legible

**Consejos:**

- Usar con la etiqueta `<pre>` para mantener el formato
- No usar en producción para datos sensibles
- Útil para desarrollo pero costoso en términos de rendimiento

---

### 5. **KeyValuePipe** - Iterar sobre objetos

**Importación:**

```typescript
import { KeyValuePipe } from '@angular/common';
```

**Uso:**

```typescript
// En el componente
profile = {
  name: 'Juan Ignacio',
  age: 22,
  address: 'Cali, Colombia',
  occupation: 'Software Developer',
};
```

```html
<!-- En la plantilla -->
<ul>
  @for(item of profile | keyvalue; track $index) {
  <li>
    <strong>{{ item.key }}: </strong>
    <span>{{ item.value }}</span>
  </li>
  }
</ul>
```

**Resultado:**

```
- name: Juan Ignacio
- age: 22
- address: Cali, Colombia
- occupation: Software Developer
```

**Características:**

- Convierte un objeto en un array de pares `{key, value}`
- Mantiene el orden de las propiedades
- Funciona con objetos y Maps
- Útil para iterar sobre objetos dinámicos

**Estructura del item:**

```typescript
interface KeyValue<K, V> {
  key: K;
  value: V;
}
```

---

### 6. **AsyncPipe** - Manejar Promises y Observables

**Importación:**

```typescript
import { AsyncPipe } from '@angular/common';
```

Este es uno de los pipes más importantes en Angular para programación asíncrona.

#### Uso con Promises:

```typescript
// En el componente
promiseValue = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Tenemos data de promesa');
  }, 3500);
});
```

```html
<!-- En la plantilla -->
<p>{{ promiseValue | async }}</p>
<!-- Muestra: (vacío por 3.5 segundos) -->
<!-- Después muestra: "Tenemos data de promesa" -->

<!-- Uso con @if para evitar valores null -->
@if(promiseValue | async; as data) {
<p>{{ data }}</p>
}
```

#### Uso con Observables:

```typescript
// En el componente
import { interval } from 'rxjs';

myObservableTimer = interval(2000).pipe(tap((value) => console.log('tick', value)));
```

```html
<!-- En la plantilla -->
<p>{{ myObservableTimer | async }}</p>
<!-- Muestra: 0, 1, 2, 3, 4... (incrementa cada 2 segundos) -->
```

**Ventajas del AsyncPipe:**

1. **Gestión automática de suscripciones:**

   - Se suscribe automáticamente al Observable/Promise
   - Se desuscribe automáticamente cuando el componente se destruye
   - Previene memory leaks

2. **Simplifica el código:**

   ```typescript
   // ❌ Sin AsyncPipe (más código)
   export class MiComponente implements OnInit, OnDestroy {
     datos: any;
     subscription: Subscription;

     ngOnInit() {
       this.subscription = this.servicio.getDatos().subscribe((data) => (this.datos = data));
     }

     ngOnDestroy() {
       this.subscription.unsubscribe();
     }
   }
   ```

   ```typescript
   // ✅ Con AsyncPipe (menos código)
   export class MiComponente {
     datos$ = this.servicio.getDatos();
   }
   ```

   ```html
   <p>{{ datos$ | async }}</p>
   ```

3. **Mejor rendimiento:**
   - Activa la detección de cambios solo cuando hay nuevos valores
   - Funciona perfectamente con OnPush change detection

**Convención de nomenclatura:**

- Añadir `$` al final de las variables que son Observables: `datos$`, `usuario$`
- Ayuda a identificar visualmente qué variables son streams

---

## Internacionalización (i18n)

La internacionalización permite que tu aplicación se adapte a diferentes idiomas y regiones, afectando formatos de fechas, números y monedas.

### Archivos relacionados:

- `src/app/app.config.ts` (configuración principal)
- `src/app/services/local.service.ts` (servicio de gestión)
- `src/app/pages/basic-page/basic-page.ts` (implementación)

### 1. Configuración básica en `app.config.ts`

```typescript
import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { registerLocaleData } from '@angular/common';

// Importar datos de locales
import localEs from '@angular/common/locales/es';
import localFr from '@angular/common/locales/fr';

// Registrar los locales
registerLocaleData(localEs, 'es');
registerLocaleData(localFr, 'fr');

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
    {
      provide: LOCALE_ID,
      useValue: 'es', // Locale por defecto
    },
  ],
};
```

**Explicación:**

1. **`registerLocaleData()`**: Registra los datos de localización

   - Debe llamarse antes de usar el locale
   - Incluye información de formato de fechas, números, monedas, etc.

2. **`LOCALE_ID`**: Token de inyección de dependencias

   - Define el locale activo en toda la aplicación
   - Afecta a todos los pipes de formato

3. **Locales disponibles**: Angular incluye muchos locales
   - `@angular/common/locales/es` - Español
   - `@angular/common/locales/fr` - Francés
   - `@angular/common/locales/en` - Inglés (por defecto)
   - `@angular/common/locales/de` - Alemán
   - Y muchos más...

---

### 2. Configuración dinámica con Factory

Para cambiar el locale dinámicamente, usamos un factory provider:

```typescript
// En app.config.ts
import { LocalService } from './services/local.service';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
    {
      provide: LOCALE_ID,
      deps: [LocalService],
      useFactory: (localService: LocalService) => localService.getLocale,
    },
  ],
};
```

**Explicación:**

- `deps`: Array de dependencias que se inyectan en la función factory
- `useFactory`: Función que retorna el valor del provider
- Permite que el locale sea dinámico basándose en el servicio

---

### 3. Servicio de gestión de locales

Archivo: `src/app/services/local.service.ts`

```typescript
import { Injectable, signal } from '@angular/core';

export type avalibleLocales = 'es' | 'fr' | 'en';

@Injectable({ providedIn: 'root' })
export class LocalService {
  private currentLocale = signal<avalibleLocales>('es');

  constructor() {
    // Cargar locale guardado en localStorage
    this.currentLocale.set((localStorage.getItem('locale') as avalibleLocales) || 'es');
  }

  get getLocale() {
    return this.currentLocale();
  }

  changeLocale(locale: avalibleLocales) {
    // Guardar en localStorage
    localStorage.setItem('locale', locale);

    // Actualizar signal
    this.currentLocale.set(locale);

    // Recargar la página para aplicar cambios
    window.location.reload();
  }
}
```

**Características del servicio:**

1. **Tipo seguro**: Define los locales disponibles con TypeScript
2. **Persistencia**: Guarda la preferencia en localStorage
3. **Reactivo**: Usa signals para reactividad
4. **Recarga necesaria**: `window.location.reload()` es necesario porque Angular carga el locale al inicio

---

### 4. Implementación en componentes

Archivo: `src/app/pages/basic-page/basic-page.ts`

```typescript
import { Component, effect, inject, LOCALE_ID, signal } from '@angular/core';
import { LocalService, avalibleLocales } from '../../services/local.service';

export default class BasicPage {
  localeService = inject(LocalService);
  currentLocale = signal(inject(LOCALE_ID));

  changeLocal(locale: avalibleLocales) {
    this.localeService.changeLocale(locale);
  }
}
```

Archivo: `src/app/pages/basic-page/basic-page.html`

```html
<h1>
  Current Local:
  <span class="badge badge-secondary">{{ currentLocale() }}</span>
</h1>

<button (click)="changeLocal('es')">Español</button>
<button (click)="changeLocal('fr')">Français</button>
<button (click)="changeLocal('en')">English</button>
```

---

### 5. Impacto del locale en los pipes

El locale afecta cómo se formatean diferentes tipos de datos:

#### Fechas:

```html
{{ fecha | date : 'long' }}

<!-- Locale 'es': "7 de diciembre de 2025, 10:30:45 GMT-5" -->
<!-- Locale 'en': "December 7, 2025 at 10:30:45 AM GMT-5" -->
<!-- Locale 'fr': "7 décembre 2025 à 10:30:45 GMT-5" -->
```

#### Números:

```html
{{ 1234.56 | number }}

<!-- Locale 'es': "1.234,56" (punto para miles, coma para decimales) -->
<!-- Locale 'en': "1,234.56" (coma para miles, punto para decimales) -->
<!-- Locale 'fr': "1 234,56" (espacio para miles, coma para decimales) -->
```

#### Monedas:

```html
{{ 1000 | currency : 'USD' }}

<!-- Locale 'es': "1.000,00 US$" -->
<!-- Locale 'en': "US$1,000.00" -->
<!-- Locale 'fr': "1 000,00 $US" -->
```

---

### 6. Pasos para añadir un nuevo locale

1. **Importar el locale en `app.config.ts`:**

   ```typescript
   import localDe from '@angular/common/locales/de';
   ```

2. **Registrar el locale:**

   ```typescript
   registerLocaleData(localDe, 'de');
   ```

3. **Añadir al tipo del servicio:**

   ```typescript
   export type avalibleLocales = 'es' | 'fr' | 'en' | 'de';
   ```

4. **Crear botón en la interfaz:**
   ```html
   <button (click)="changeLocal('de')">Deutsch</button>
   ```

---

## Pipes Personalizados

Los pipes personalizados te permiten crear tus propias transformaciones reutilizables.

### Cómo crear un pipe personalizado:

1. **Generar con Angular CLI:**

   ```bash
   ng generate pipe pipes/miPipe
   # o abreviado:
   ng g p pipes/miPipe
   ```

2. **Estructura básica de un pipe:**

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'miPipe',
  standalone: true, // Importante en Angular 20
})
export class MiPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    // Lógica de transformación
    return valorTransformado;
  }
}
```

### Ejemplo completo de implementación

Esta sección muestra la página completa `custom-page` que integra todos los pipes personalizados.

**Componente:** `src/app/pages/custom-page/custom-page.ts`

```typescript
import { Component, signal } from '@angular/core';
import { ToggleCasePipe } from '../../pipes/toggle-case.pipe';
import { heroes } from '../../data/heros.data';
import { CanFlyPipe } from '../../pipes/can-fly.pipe';
import { HeroColorPipe } from '../../pipes/hero-color.pipe';
import { HeroTextColorPipe } from '../../pipes/heto-text-color.pipe';
import { TitleCasePipe } from '@angular/common';
import { HeroCreatorPipe } from '../../pipes/hero-creator.pipe';
import { HeroSortByPipe } from '../../pipes/hero-sort-by.pipe';
import { Hero } from '../../interfaces/hero.interface';
import { HeroFilterPipe } from '../../pipes/hero-filter.pipe';

@Component({
  selector: 'app-custom-page',
  imports: [
    ToggleCasePipe,
    CanFlyPipe,
    HeroColorPipe,
    HeroTextColorPipe,
    TitleCasePipe,
    HeroCreatorPipe,
    HeroSortByPipe,
    HeroFilterPipe,
  ],
  templateUrl: './custom-page.html',
  styleUrl: './custom-page.css',
})
export default class CustomPage {
  // Nombre para demostrar toggleCase
  name = signal('Angular');
  upperCase = signal(true);

  // Datos de héroes
  heroes = signal(heroes);

  // Control de ordenamiento
  sortBy = signal<keyof Hero | null>('name');

  // Control de búsqueda
  searchQuery = signal('');

  toggleCase() {
    this.upperCase.set(!this.upperCase());
  }
}
```

**Plantilla:** `src/app/pages/custom-page/custom-page.html`

```html
<section class="text-center my-8">
  <h1 class="text-2xl font-bold">Custom Page</h1>
  <p class="text-xl font-thin">This is a custom page with some example content.</p>
</section>

<!-- Demostración de ToggleCasePipe -->
<div class="stats shadow">
  <div class="stat">
    <div class="stat-title">Toggle Case Pipe</div>
    <div class="stat-value">{{ name() | toggleCase : upperCase() }}</div>
    <div class="stat-desc">{{ name() }}</div>
    <button class="btn btn-primary btn-sm mt-2" (click)="toggleCase()">Toggle Case</button>
  </div>
</div>

<div class="divider"></div>

<!-- Controles de búsqueda y ordenamiento -->
<section class="my-4">
  <h1 class="text-2xl font-bold">Sort Heroes by: {{ sortBy() }}</h1>
  <div class="flex gap-2 justify-end w-full">
    <input
      type="text"
      class="input input-bordered w-full max-w-xs"
      placeholder="Search heroes..."
      (input)="searchQuery.set(searchInput.value)"
      #searchInput
    />

    <button (click)="sortBy.set('name')" class="btn btn-primary">By Name</button>
    <button (click)="sortBy.set('canFly')" class="btn btn-secondary">By Can Fly</button>
    <button (click)="sortBy.set('color')" class="btn btn-accent">By Color</button>
    <button (click)="sortBy.set('creator')" class="btn btn-info">By Creator</button>
  </div>
</section>

<!-- Tabla con todos los pipes aplicados -->
<div class="overflow-x-auto w-full">
  <table class="table w-full">
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Can Fly</th>
        <th>Color</th>
        <th>Creator</th>
      </tr>
    </thead>
    <tbody>
      <!-- Aplicar heroFilter y heroSortBy al array -->
      @for(hero of heroes() | heroFilter:searchQuery() | heroSortBy:sortBy(); track hero.id) {
      <tr>
        <th>{{ hero.id }}</th>
        <td>{{ hero.name }}</td>
        <td>
          <!-- CanFlyPipe con estilos condicionales -->
          <span
            class="text-xs w-44"
            [class.text-success]="hero.canFly"
            [class.text-error]="!hero.canFly"
          >
            {{ hero.canFly | canFly }}
          </span>
        </td>
        <td>
          <!-- HeroTextColorPipe y HeroColorPipe encadenados -->
          <span class="text-xs w-44" [style.color]="hero.color | heroTextColor">
            {{ hero.color | heroColor | titlecase }}
          </span>
        </td>
        <td>{{ hero.creator | heroCreator }}</td>
      </tr>
      }
    </tbody>
  </table>
</div>
```

**Características destacadas de esta implementación:**

1. **Búsqueda en tiempo real**: El input actualiza el signal `searchQuery` que filtra los héroes
2. **Ordenamiento dinámico**: Botones que cambian la propiedad de ordenamiento
3. **Encadenamiento de pipes**: `heroFilter` → `heroSortBy` en el `@for`
4. **Property binding**: `[style.color]` con el resultado de `heroTextColor`
5. **Class binding condicional**: Aplica estilos según el valor de `canFly`
6. **Múltiples transformaciones**: Cada columna usa diferentes pipes personalizados

---

### Ejemplo básico: Pipe para capitalizar palabras

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
  standalone: true,
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    return value
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
```

**Uso:**

```typescript
// Importar en el componente
@Component({
  imports: [CapitalizePipe],
  // ...
})
```

```html
{{ 'hola mundo' | capitalize }}
<!-- Resultado: "Hola Mundo" -->
```

### Ejemplo: Pipe con parámetros

```typescript
@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50, ellipsis: string = '...'): string {
    if (!value) return value;

    if (value.length <= limit) {
      return value;
    }

    return value.substring(0, limit) + ellipsis;
  }
}
```

**Uso:**

```html
{{ longText | truncate : 20 : '…' }}
<!-- Trunca el texto a 20 caracteres y añade '…' -->
```

---

## Pipes Personalizados Implementados en el Proyecto

En este proyecto hemos creado 7 pipes personalizados para trabajar con datos de superhéroes. Cada uno demuestra diferentes patrones y técnicas.

### Archivos relacionados:

- `src/app/pipes/` (directorio con todos los pipes personalizados)
- `src/app/pages/custom-page/custom-page.ts` (implementación)
- `src/app/pages/custom-page/custom-page.html` (uso en plantilla)
- `src/app/interfaces/hero.interface.ts` (definición de tipos)
- `src/app/data/heros.data.ts` (datos de ejemplo)

---

### 1. **ToggleCasePipe** - Alternar entre mayúsculas y minúsculas

**Archivo:** `src/app/pipes/toggle-case.pipe.ts`

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toggleCase',
})
export class ToggleCasePipe implements PipeTransform {
  transform(value: string, upper: boolean = true): string {
    return upper ? value.toUpperCase() : value.toLowerCase();
  }
}
```

**Uso en el componente:**

```typescript
// src/app/pages/custom-page/custom-page.ts
export default class CustomPage {
  name = signal('Angular');
  upperCase = signal(true);

  toggleCase() {
    this.upperCase.set(!this.upperCase());
  }
}
```

**Uso en la plantilla:**

```html
{{ name() | toggleCase : upperCase() }}
<button (click)="toggleCase()">Toggle Case</button>

<!-- upperCase = true: "ANGULAR" -->
<!-- upperCase = false: "angular" -->
```

**Explicación:**

- Acepta un parámetro booleano `upper`
- Si `upper` es `true`, convierte a mayúsculas
- Si `upper` es `false`, convierte a minúsculas
- Útil para interfaces interactivas donde el usuario puede cambiar el formato

---

### 2. **CanFlyPipe** - Transformar boolean a texto descriptivo

**Archivo:** `src/app/pipes/can-fly.pipe.ts`

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'canFly',
})
export class CanFlyPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'Can Fly' : 'Cannot Fly';
  }
}
```

**Uso en la plantilla:**

```html
<td>
  <span [class.text-success]="hero.canFly" [class.text-error]="!hero.canFly">
    {{ hero.canFly | canFly }}
  </span>
</td>

<!-- true: "Can Fly" -->
<!-- false: "Cannot Fly" -->
```

**Explicación:**

- Convierte un valor booleano en texto legible
- Más descriptivo que mostrar "true" o "false"
- Se puede combinar con estilos condicionales para mejorar la UI
- Patrón útil para cualquier propiedad booleana que necesite mostrarse al usuario

---

### 3. **HeroColorPipe** - Convertir enum a nombre legible

**Archivo:** `src/app/pipes/hero-color.pipe.ts`

```typescript
import { Pipe, PipeTransform } from '@angular/core';
import { Color } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroColor',
})
export class HeroColorPipe implements PipeTransform {
  transform(value: Color): string {
    return Color[value];
  }
}
```

**Definición del enum:**

```typescript
// src/app/interfaces/hero.interface.ts
export enum Color {
  red,
  black,
  blue,
  green,
}
```

**Uso en la plantilla:**

```html
{{ hero.color | heroColor | titlecase }}

<!-- Color.red (0) → "red" → "Red" -->
<!-- Color.black (1) → "black" → "Black" -->
<!-- Color.blue (2) → "blue" → "Blue" -->
```

**Explicación:**

- Los enums en TypeScript son números por defecto
- `Color.red` = 0, `Color.black` = 1, etc.
- Este pipe convierte el valor numérico a su nombre string
- Se puede encadenar con `titlecase` para mejor presentación
- Útil para mostrar enums de forma legible sin código condicional

---

### 4. **HeroTextColorPipe** - Mapear enum a código de color

**Archivo:** `src/app/pipes/heto-text-color.pipe.ts`

```typescript
import { Pipe, PipeTransform } from '@angular/core';
import { Color, ColorMap } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroTextColor',
})
export class HeroTextColorPipe implements PipeTransform {
  transform(value: Color): string {
    return ColorMap[value];
  }
}
```

**Definición del ColorMap:**

```typescript
// src/app/interfaces/hero.interface.ts
export const ColorMap = {
  [Color.red]: '#E57373',
  [Color.black]: '#424242',
  [Color.blue]: '#64B5F6',
  [Color.green]: '#81C784',
};
```

**Uso en la plantilla:**

```html
<span [style.color]="hero.color | heroTextColor"> {{ hero.color | heroColor | titlecase }} </span>

<!-- Color.red → style="color: #E57373" → texto en rojo -->
<!-- Color.blue → style="color: #64B5F6" → texto en azul -->
```

**Explicación:**

- Convierte un enum a un código de color hexadecimal
- Utiliza un mapa de traducción `ColorMap`
- Perfecto para aplicar estilos dinámicos basados en datos
- Combina bien con property binding `[style.color]`
- Separa la lógica de presentación de los datos

---

### 5. **HeroCreatorPipe** - Convertir enum de creador a string

**Archivo:** `src/app/pipes/hero-creator.pipe.ts`

```typescript
import { Pipe, PipeTransform } from '@angular/core';
import { Creator } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroCreator',
})
export class HeroCreatorPipe implements PipeTransform {
  transform(value: Creator): string {
    return Creator[value];
  }
}
```

**Definición del enum:**

```typescript
// src/app/interfaces/hero.interface.ts
export enum Creator {
  DC,
  Marvel,
}
```

**Uso en la plantilla:**

```html
<td>{{ hero.creator | heroCreator }}</td>

<!-- Creator.DC (0) → "DC" -->
<!-- Creator.Marvel (1) → "Marvel" -->
```

**Explicación:**

- Similar a `HeroColorPipe` pero para el creador del héroe
- Convierte el valor numérico del enum a su nombre
- Facilita el trabajo con enums en las plantillas
- Mantiene el código TypeScript type-safe

---

### 6. **HeroSortByPipe** - Ordenar array de objetos (⚠️ Pipe Impuro)

**Archivo:** `src/app/pipes/hero-sort-by.pipe.ts`

```typescript
import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroSortBy',
})
export class HeroSortByPipe implements PipeTransform {
  transform(value: Hero[], sortBy: keyof Hero | null): Hero[] {
    if (!sortBy) return value;

    return value.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });
  }
}
```

**Uso en el componente:**

```typescript
// src/app/pages/custom-page/custom-page.ts
export default class CustomPage {
  heroes = signal(heroes);
  sortBy = signal<keyof Hero | null>('name');
}
```

**Uso en la plantilla:**

```html
<button (click)="sortBy.set('name')">By Name</button>
<button (click)="sortBy.set('canFly')">By Can Fly</button>
<button (click)="sortBy.set('color')">By Color</button>

@for(hero of heroes() | heroSortBy:sortBy(); track hero.id) {
<tr>
  <td>{{ hero.name }}</td>
  <td>{{ hero.canFly | canFly }}</td>
</tr>
}
```

**Explicación:**

- Ordena un array de héroes por una propiedad específica
- Usa `keyof Hero` para type safety - solo permite propiedades válidas
- Maneja el caso `null` devolviendo el array sin ordenar
- **⚠️ Importante:** Este es un pipe **impuro** implícitamente porque modifica el array
- Funciona con cualquier tipo de dato (strings, números, booleanos)

**Consideraciones:**

```typescript
// ⚠️ Mejor práctica: Hacer una copia del array
transform(value: Hero[], sortBy: keyof Hero | null): Hero[] {
  if (!sortBy) return value;

  return [...value].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    if (aValue < bValue) return -1;
    if (aValue > bValue) return 1;
    return 0;
  });
}
```

---

### 7. **HeroFilterPipe** - Filtrar array por búsqueda de texto (⚠️ Pipe Impuro)

**Archivo:** `src/app/pipes/hero-filter.pipe.ts`

```typescript
import { Pipe, PipeTransform } from '@angular/core';
import { Hero } from '../interfaces/hero.interface';

@Pipe({
  name: 'heroFilter',
})
export class HeroFilterPipe implements PipeTransform {
  transform(value: Hero[], searchQuery: string): Hero[] {
    if (!searchQuery) return value;

    return value.filter((hero) => hero.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }
}
```

**Uso en el componente:**

```typescript
// src/app/pages/custom-page/custom-page.ts
export default class CustomPage {
  heroes = signal(heroes);
  searchQuery = signal('');
}
```

**Uso en la plantilla:**

```html
<input
  type="text"
  class="input input-bordered"
  placeholder="Search heroes..."
  (input)="searchQuery.set(searchInput.value)"
  #searchInput
/>

@for(hero of heroes() | heroFilter:searchQuery(); track hero.id) {
<tr>
  <td>{{ hero.name }}</td>
</tr>
}
```

**Explicación:**

- Filtra el array de héroes basándose en el nombre
- Case-insensitive: convierte todo a minúsculas para comparar
- Si no hay búsqueda (`searchQuery` está vacío), devuelve todos los héroes
- **⚠️ Importante:** Este debe ser un pipe **impuro** si quieres que reaccione a cambios en el array

**Versión impura recomendada:**

```typescript
@Pipe({
  name: 'heroFilter',
  pure: false, // Reacciona a cambios en el array
})
export class HeroFilterPipe implements PipeTransform {
  transform(value: Hero[], searchQuery: string): Hero[] {
    if (!searchQuery) return value;

    return value.filter((hero) => hero.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }
}
```

---

### Encadenamiento de Pipes Personalizados

Puedes encadenar múltiples pipes para transformaciones complejas:

```html
@for(hero of heroes() | heroFilter:searchQuery() | heroSortBy:sortBy(); track hero.id) {
<tr>
  <td>{{ hero.name }}</td>
  <td>
    <span [style.color]="hero.color | heroTextColor">
      {{ hero.color | heroColor | titlecase }}
    </span>
  </td>
  <td>{{ hero.creator | heroCreator }}</td>
</tr>
}
```

**Orden de ejecución:**

1. `heroFilter` - Filtra por búsqueda
2. `heroSortBy` - Ordena los resultados filtrados
3. El `@for` itera sobre el resultado final
4. Dentro del loop, cada valor se transforma individualmente

---

### Datos de Ejemplo

**Interfaz Hero:** `src/app/interfaces/hero.interface.ts`

```typescript
export enum Color {
  red,
  black,
  blue,
  green,
}

export enum Creator {
  DC,
  Marvel,
}

export interface Hero {
  id: number;
  name: string;
  canFly: boolean;
  color: Color;
  creator: Creator;
}

export const ColorMap = {
  [Color.red]: '#E57373',
  [Color.black]: '#424242',
  [Color.blue]: '#64B5F6',
  [Color.green]: '#81C784',
};
```

**Datos de héroes:** `src/app/data/heros.data.ts`

```typescript
import { Hero, Color, Creator } from '../interfaces/hero.interface';

export const heroes: Hero[] = [
  {
    id: 1,
    name: 'Superman',
    canFly: true,
    color: Color.blue,
    creator: Creator.DC,
  },
  {
    id: 2,
    name: 'Batman',
    canFly: false,
    color: Color.black,
    creator: Creator.DC,
  },
  {
    id: 3,
    name: 'Daredevil',
    canFly: false,
    color: Color.red,
    creator: Creator.Marvel,
  },
  // ... más héroes
];
```

---

### Pipes Puros vs Impuros

#### **Pipe Puro (por defecto):**

```typescript
@Pipe({
  name: 'miPipe',
  pure: true, // Valor por defecto
})
```

**Características:**

- Solo se ejecuta cuando cambia el valor de entrada o los parámetros
- **No** detecta cambios dentro de objetos o arrays (cambios por referencia)
- Mejor rendimiento
- Recomendado para la mayoría de casos

**Ejemplo:**

```typescript
@Pipe({ name: 'pureExample' })
export class PureExamplePipe implements PipeTransform {
  transform(value: string): string {
    console.log('Ejecutando pipe puro');
    return value.toUpperCase();
  }
}
```

```html
{{ nombre | pureExample }}
<!-- Solo se ejecuta cuando 'nombre' cambia -->
```

---

#### **Pipe Impuro:**

```typescript
@Pipe({
  name: 'miPipe',
  pure: false, // Se ejecuta en cada detección de cambios
})
```

**Características:**

- Se ejecuta en **cada ciclo** de detección de cambios
- Detecta cambios dentro de objetos y arrays
- Útil para filtros y ordenamiento
- ⚠️ Puede afectar el rendimiento si se usa excesivamente

**Ejemplo:**

```typescript
@Pipe({
  name: 'impureFilter',
  pure: false, // Importante para arrays
})
export class ImpureFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) return items;

    return items.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
  }
}
```

**Cuándo usar cada uno:**

| Situación                                 | Tipo de Pipe                 |
| ----------------------------------------- | ---------------------------- |
| Transformar strings, números, fechas      | **Puro**                     |
| Formatear datos simples                   | **Puro**                     |
| Filtrar arrays                            | **Impuro**                   |
| Ordenar arrays                            | **Impuro**                   |
| Transformar que depende de estado externo | **Impuro**                   |
| Operaciones costosas                      | **Puro** (mejor rendimiento) |

---

### Buenas Prácticas para Pipes Personalizados

#### 1. **Mantenerlos puros cuando sea posible**

```typescript
// ✅ Bueno - Pipe puro para transformación simple
@Pipe({ name: 'formatName' })
export class FormatNamePipe implements PipeTransform {
  transform(name: string): string {
    return name.trim().toUpperCase();
  }
}
```

#### 2. **Manejar casos edge (null/undefined)**

```typescript
// ✅ Bueno - Maneja valores nulos
transform(value: string | null | undefined): string {
  if (!value) return '';
  return value.toUpperCase();
}

// ❌ Malo - Puede causar errores
transform(value: string): string {
  return value.toUpperCase(); // Error si value es null
}
```

#### 3. **Usar tipos específicos**

```typescript
// ✅ Bueno - Type-safe
transform(value: Hero[], sortBy: keyof Hero): Hero[] {
  // TypeScript previene errores
}

// ❌ Malo - Pierde type safety
transform(value: any[], sortBy: string): any[] {
  // Propenso a errores
}
```

#### 4. **No mutar el input**

```typescript
// ✅ Bueno - Crea una copia
transform(heroes: Hero[]): Hero[] {
  return [...heroes].sort((a, b) => a.name.localeCompare(b.name));
}

// ❌ Malo - Muta el array original
transform(heroes: Hero[]): Hero[] {
  return heroes.sort((a, b) => a.name.localeCompare(b.name));
}
```

#### 5. **No hacer operaciones costosas o asíncronas**

```typescript
// ❌ Malo - HTTP en un pipe
transform(id: number): Observable<User> {
  return this.http.get<User>(`/api/users/${id}`);
}

// ✅ Bueno - Usar AsyncPipe con Observable del componente
// En el componente:
user$ = this.http.get<User>(`/api/users/${id}`);
// En la plantilla:
{{ user$ | async }}
```

#### 6. **Documentar con JSDoc**

```typescript
/**
 * Convierte un enum Color a su representación en string
 * @param value - Valor numérico del enum Color
 * @returns Nombre del color como string
 * @example
 * {{ Color.red | heroColor }} // "red"
 */
@Pipe({ name: 'heroColor' })
export class HeroColorPipe implements PipeTransform {
  transform(value: Color): string {
    return Color[value];
  }
}
```

#### 7. **Testing unitario**

```typescript
describe('HeroColorPipe', () => {
  let pipe: HeroColorPipe;

  beforeEach(() => {
    pipe = new HeroColorPipe();
  });

  it('should convert Color enum to string', () => {
    expect(pipe.transform(Color.red)).toBe('red');
    expect(pipe.transform(Color.blue)).toBe('blue');
  });

  it('should handle all color values', () => {
    expect(pipe.transform(Color.black)).toBe('black');
    expect(pipe.transform(Color.green)).toBe('green');
  });
});
```

---

### Cuándo Crear un Custom Pipe

✅ **Crear un pipe cuando:**

- La transformación se usa en múltiples lugares
- Es una operación de presentación (no lógica de negocio)
- Necesitas transformar datos en la plantilla
- Quieres mantener las plantillas limpias y legibles

❌ **No crear un pipe cuando:**

- La transformación incluye llamadas HTTP
- La lógica es específica de un solo componente
- Necesitas mutar datos (hacerlo en el componente)
- La operación es extremadamente costosa

---

## Conceptos Clave

### 1. **Signals en Angular**

Los signals son una nueva característica de Angular para manejo reactivo de estado:

```typescript
import { signal } from '@angular/core';

// Crear un signal
const nombre = signal('Juan');

// Leer el valor (se llama como función)
console.log(nombre()); // "Juan"

// Actualizar el valor
nombre.set('Maria');

// Actualizar basándose en el valor anterior
nombre.update((valorActual) => valorActual.toUpperCase());
```

**Ventajas:**

- Mejor rendimiento que change detection tradicional
- Más explícito y predecible
- Mejor experiencia de debugging

---

### 2. **Effects en Angular**

Los effects permiten ejecutar código cuando cambian signals:

```typescript
import { effect, signal } from '@angular/core';

const contador = signal(0);

effect(() => {
  console.log('El contador cambió:', contador());
});

contador.set(1); // Console: "El contador cambió: 1"
```

**Effect con limpieza:**

```typescript
effect((onCleanup) => {
  const interval = setInterval(() => {
    console.log('tick');
  }, 1000);

  // Limpiar cuando el effect se destruye
  onCleanup(() => {
    clearInterval(interval);
  });
});
```

---

### 3. **Componentes Standalone**

Angular 20 usa componentes standalone por defecto:

```typescript
@Component({
  selector: 'app-ejemplo',
  standalone: true, // No necesita módulo
  imports: [CommonModule, DatePipe, MiComponente], // Importaciones directas
  templateUrl: './ejemplo.html',
})
export class EjemploComponent {}
```

**Ventajas:**

- Menos boilerplate (no hay NgModules)
- Mejor tree-shaking
- Más fácil de entender y mantener
- Importaciones explícitas

---

### 4. **Inyección de dependencias con inject()**

Nueva forma de inyectar servicios sin constructor:

```typescript
// ❌ Forma antigua
export class MiComponente {
  constructor(private miServicio: MiServicio, private http: HttpClient) {}
}

// ✅ Forma nueva
export class MiComponente {
  private miServicio = inject(MiServicio);
  private http = inject(HttpClient);
}
```

**Ventajas:**

- Menos verboso
- Funciona en cualquier contexto de inyección
- Mejor inferencia de tipos

---

### 5. **Control flow syntax (@if, @for)**

Angular 20 introduce nueva sintaxis de control de flujo:

```html
<!-- ❌ Sintaxis antigua -->
<div *ngIf="condicion">Contenido</div>
<div *ngFor="let item of items">{{ item }}</div>

<!-- ✅ Sintaxis nueva -->
@if (condicion) {
<div>Contenido</div>
} @for (item of items; track item.id) {
<div>{{ item }}</div>
}
```

**Ventajas:**

- Más legible y parecido a TypeScript
- Mejor rendimiento
- Mejor soporte del editor

---

### 6. **Detección de cambios**

Angular detecta cambios de diferentes maneras:

1. **Default**: Revisa todo el árbol de componentes
2. **OnPush**: Solo revisa cuando:
   - Cambian inputs (@Input)
   - Se dispara un evento
   - Se emite un Observable suscrito con async pipe
   - Se llama manualmente a markForCheck()

```typescript
@Component({
  selector: 'app-ejemplo',
  changeDetection: ChangeDetectionStrategy.OnPush, // Mejor rendimiento
})
```

---

### 7. **RxJS y Observables**

Los Observables son streams de datos asíncronos:

```typescript
import { Observable, interval } from 'rxjs';
import { map, filter } from 'rxjs/operators';

// Crear un Observable
const numeros$ = interval(1000); // Emite 0, 1, 2, 3...

// Transformar con operadores
const pares$ = numeros$.pipe(
  filter((n) => n % 2 === 0), // Solo números pares
  map((n) => n * 10) // Multiplicar por 10
);

// Suscribirse (sin async pipe)
pares$.subscribe((valor) => console.log(valor));
// Output: 0, 20, 40, 60...
```

**Convención:** Añadir `$` al final de variables Observable

---

## 📋 Resumen de Pipes Utilizados

### Pipes Built-in de Angular

| Pipe         | Uso Principal           | Ejemplo                        |
| ------------ | ----------------------- | ------------------------------ |
| `uppercase`  | Texto en mayúsculas     | `{{ texto \| uppercase }}`     |
| `lowercase`  | Texto en minúsculas     | `{{ texto \| lowercase }}`     |
| `titlecase`  | Primera letra mayúscula | `{{ texto \| titlecase }}`     |
| `date`       | Formatear fechas        | `{{ fecha \| date:'short' }}`  |
| `number`     | Formatear números       | `{{ num \| number:'1.2-2' }}`  |
| `percent`    | Formatear porcentajes   | `{{ val \| percent:'1.0-0' }}` |
| `currency`   | Formatear moneda        | `{{ val \| currency:'USD' }}`  |
| `i18nSelect` | Selección por valor     | `{{ gen \| i18nSelect:map }}`  |
| `i18nPlural` | Pluralización           | `{{ num \| i18nPlural:map }}`  |
| `slice`      | Extraer porción         | `{{ arr \| slice:0:3 }}`       |
| `json`       | Convertir a JSON        | `{{ obj \| json }}`            |
| `keyvalue`   | Iterar objeto           | `{{ obj \| keyvalue }}`        |

### Pipes Personalizados Creados

| Pipe            | Tipo                   | Uso Principal                  | Ejemplo                          |
| --------------- | ---------------------- | ------------------------------ | -------------------------------- |
| `toggleCase`    | Puro                   | Alternar mayúsculas/minúsculas | `{{ txt \| toggleCase:true }}`   |
| `canFly`        | Puro                   | Boolean a texto descriptivo    | `{{ bool \| canFly }}`           |
| `heroColor`     | Puro                   | Enum Color a string            | `{{ color \| heroColor }}`       |
| `heroTextColor` | Puro                   | Enum Color a código hex        | `{{ color \| heroTextColor }}`   |
| `heroCreator`   | Puro                   | Enum Creator a string          | `{{ creator \| heroCreator }}`   |
| `heroSortBy`    | Impuro                 | Ordenar array por propiedad    | `{{ arr \| heroSortBy:'name' }}` |
| `heroFilter`    | Impuro                 | Filtrar array por búsqueda     | `{{ arr \| heroFilter:query }}`  |
| `async`         | Suscripción automática | `{{ obs$ \| async }}`          |

---

## 🎯 Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm start

# Compilar para producción
npm run build

# Ejecutar tests
npm test

# Generar un nuevo pipe
ng generate pipe pipes/nombrePipe

# Generar un nuevo componente
ng generate component components/nombre

# Generar un nuevo servicio
ng generate service services/nombre
```

---

## 📖 Recursos Adicionales

- [Documentación oficial de Angular](https://angular.dev)
- [Guía de Pipes](https://angular.dev/guide/pipes)
- [Angular Common Pipes API](https://angular.dev/api/common#pipes)
- [Internacionalización en Angular](https://angular.dev/guide/i18n)
- [RxJS Documentation](https://rxjs.dev/)

---

## 🏆 Mejores Prácticas

1. **Usar pipes puros siempre que sea posible** para mejor rendimiento
2. **Aprovechar el AsyncPipe** para manejar Observables y Promises
3. **Configurar internacionalización** desde el inicio del proyecto
4. **Encadenar pipes** para transformaciones complejas
5. **Crear pipes personalizados** para lógica de transformación reutilizable
6. **Usar signals** para manejo de estado reactivo
7. **Implementar OnPush** change detection cuando sea apropiado
8. **Documentar custom pipes** con JSDoc y ejemplos

---

## 🔍 Notas de Aprendizaje

### ¿Cuándo usar qué pipe?

- **DatePipe**: Siempre que muestres fechas
- **CurrencyPipe**: Para valores monetarios
- **DecimalPipe**: Para números con decimales
- **PercentPipe**: Para tasas y porcentajes
- **AsyncPipe**: Para Observables y Promises
- **JsonPipe**: Para debugging durante desarrollo
- **SlicePipe**: Para paginación o limitación de elementos

### Consideraciones de rendimiento:

- Los pipes puros son más eficientes
- AsyncPipe gestiona automáticamente las suscripciones
- Evitar pipes impuros en listas grandes
- Los pipes se ejecutan cada vez que Angular detecta cambios

### Internacionalización:

- Configurar desde `app.config.ts`
- Registrar todos los locales necesarios al inicio
- El locale afecta fecha, números y monedas
- Considerar persistencia con localStorage

---

**Autor**: Juan Ignacio  
**Proyecto**: Curso de Angular - Sección Pipes  
**Versión Angular**: 20.3.0  
**Última actualización**: Diciembre 2025
