# Country App - Notas del Curso de Angular

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Configuración Inicial](#configuración-inicial)
3. [Arquitectura de la Aplicación](#arquitectura-de-la-aplicación)
4. [Sistema de Rutas](#sistema-de-rutas)
5. [Componentes y Comunicación](#componentes-y-comunicación)
6. [Servicios y HTTP](#servicios-y-http)
7. [Optimizaciones Avanzadas](#optimizaciones-avanzadas) 🆕
   - [Debouncing en búsquedas](#debouncing-en-búsquedas)
   - [Caching simple](#caching-simple)
   - [LinkedSignal - Sincronización de Rutas](#linkedsignal---sincronización-de-rutas)
8. [Resources API - Enfoque Moderno de Angular](#resources-api---enfoque-moderno-de-angular)
9. [Manejo de Errores](#manejo-de-errores)
10. [Patrones de Diseño](#patrones-de-diseño)
11. [Conceptos Clave de Angular](#conceptos-clave-de-angular)

---

## Introducción

**Country App** es una aplicación web desarrollada con **Angular 20** que permite buscar información sobre países mediante tres criterios diferentes: por capital, por nombre de país y por región. Este proyecto está diseñado como parte de un curso de Angular y cubre conceptos fundamentales y avanzados del framework.

### Características principales:

- 🔍 Búsqueda de países por capital, nombre o región
- 🌐 Consumo de API REST (REST Countries API)
- 🎨 Interfaz moderna con TailwindCSS y DaisyUI
- 🚀 Angular standalone components
- 📡 Manejo de peticiones HTTP con RxJS
- 🆕 **Resources API** (Angular 19+) - Enfoque moderno y declarativo
- 🗺️ Sistema de rutas anidadas y rutas dinámicas
- 🎯 Arquitectura modular y escalable

> **💡 Nota importante:** Este proyecto incluye **dos enfoques** para el manejo de datos asíncronos:
>
> 1. **Enfoque Clásico**: Observable + Subscribe (código comentado)
> 2. **Enfoque Moderno**: Resources API (implementación activa)
>
> Ambos enfoques están documentados para fines educativos, mostrando la evolución de Angular hacia un desarrollo más simple y reactivo.

### Tecnologías utilizadas:

- **Angular 20.3.0** (última versión)
- **TypeScript 5.9.2**
- **RxJS 7.8.0** (Programación reactiva)
- **TailwindCSS 4.1.17** (Estilos)
- **DaisyUI 5.5.5** (Componentes UI)
- **REST Countries API** (Fuente de datos)

---

## Configuración Inicial

### 1. Instalación de TailwindCSS

TailwindCSS es un framework de CSS utility-first que permite crear interfaces modernas sin escribir CSS personalizado.

**Guía oficial:** https://tailwindcss.com/docs/installation/framework-guides/angular

#### Pasos de instalación:

```bash
# Instalar TailwindCSS y PostCSS
npm install -D tailwindcss postcss @tailwindcss/postcss

# Generar archivo de configuración
npx tailwindcss init
```

#### Configuración en `tailwind.config.js`:

```javascript
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

#### Agregar directivas en `src/styles.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 2. Instalación de DaisyUI

DaisyUI es una biblioteca de componentes construida sobre TailwindCSS que proporciona componentes pre-diseñados como botones, menús, tarjetas, etc.

**Guía oficial:** https://daisyui.com/docs/install/

```bash
npm install -D daisyui
```

#### Configuración de temas en `tailwind.config.js`:

```javascript
module.exports = {
  // ...
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light', 'dark', 'cupcake'], // Temas disponibles
  },
};
```

**💡 Nota sobre temas:** DaisyUI permite cambiar fácilmente entre temas predefinidos o crear temas personalizados. Los temas controlan colores, sombras y estilos de componentes de manera consistente en toda la aplicación.

---

## Arquitectura de la Aplicación

### Estructura de Carpetas

```
src/app/
├── app.ts                    # Componente raíz de la aplicación
├── app.config.ts             # Configuración global (providers)
├── app.routes.ts             # Rutas principales
├── country/                  # Módulo de países (feature module)
│   ├── country.routes.ts     # Rutas del módulo country
│   ├── components/           # Componentes reutilizables
│   │   ├── country-list/     # Lista de países
│   │   ├── country-search-input/  # Input de búsqueda
│   │   └── top-menu/         # Menú de navegación
│   ├── interfaces/           # Tipos e interfaces TypeScript
│   │   ├── country.interface.ts
│   │   └── res-countries.ts
│   ├── layouts/              # Componentes de layout
│   │   └── country-layout/
│   ├── mappers/              # Transformadores de datos
│   │   └── country.mapper.ts
│   ├── pages/                # Páginas/vistas
│   │   ├── by-capital-page/
│   │   ├── by-country-page/
│   │   ├── by-region-page/
│   │   └── country-page/
│   └── services/             # Servicios (lógica de negocio)
│       └── country.service.ts
└── shared/                   # Código compartido entre módulos
    ├── components/
    │   └── footer/
    └── pages/
        └── home-page/
```

### Concepto: Feature Modules

En Angular, es común organizar la aplicación en **módulos por característica** (feature modules). En este caso:

- **`country/`**: Contiene toda la funcionalidad relacionada con países
- **`shared/`**: Contiene componentes y código reutilizable en toda la app

**Ventajas:**

- ✅ Código organizado y fácil de mantener
- ✅ Separación de responsabilidades
- ✅ Lazy loading (carga perezosa) del módulo
- ✅ Escalabilidad

---

## Sistema de Rutas

### 1. Rutas Principales (`app.routes.ts`)

```typescript
export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'country',
    loadChildren: () => import('./country/country.routes'),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
```

#### Conceptos clave:

**a) Ruta por defecto (`path: ''`)**

- Cuando visitas `http://localhost:4200/`, Angular carga el componente `HomePage`

**b) Lazy Loading (`loadChildren`)**

```typescript
loadChildren: () => import('./country/country.routes');
```

- **¿Qué es?**: Carga diferida de módulos. El código del módulo `country` NO se carga al inicio de la aplicación
- **¿Cuándo se carga?**: Solo cuando el usuario navega a `/country`
- **Ventaja**: Reduce el tamaño del bundle inicial → carga más rápida
- **Nota importante**: Se usa `import()` dinámico de ES6

**c) Ruta wildcard (`path: '**'`)\*\*

- Captura cualquier ruta no definida
- **Debe estar SIEMPRE al final** de la configuración de rutas
- Útil para páginas 404 o redirecciones

### 2. Rutas Anidadas (`country.routes.ts`)

```typescript
export const countryRoutes: Routes = [
  {
    path: '',
    component: CountryLayout,
    children: [
      {
        path: 'by-capital',
        component: ByCapitalPage,
      },
      {
        path: 'by-country',
        component: ByCountryPage,
      },
      {
        path: 'by-region',
        component: ByRegionPage,
      },
      {
        path: 'by/:code',
        component: CountryPage,
      },
      {
        path: '**',
        redirectTo: 'by-capital',
      },
    ],
  },
];

export default countryRoutes; // ⚠️ Exportación por defecto
```

#### Conceptos importantes:

**a) Rutas hijas (children)**

- El `CountryLayout` es el componente padre que contiene un `<router-outlet>`
- Las rutas hijas se renderizan DENTRO del `<router-outlet>` del padre
- Ejemplo de URL completa: `http://localhost:4200/country/by-capital`

**Estructura visual:**

```
App Component
└── <router-outlet>          // Primer outlet (en app.ts)
    └── CountryLayout
        └── <router-outlet>  // Segundo outlet (en country-layout.ts)
            └── ByCapitalPage
```

**b) Rutas dinámicas (`path: 'by/:code'`)**

```typescript
path: 'by/:code';
```

- El **`:code`** es un **parámetro de ruta**
- Ejemplos de URLs válidas:
  - `/country/by/ARG` (código de Argentina)
  - `/country/by/USA` (código de Estados Unidos)
  - `/country/by/ESP` (código de España)

**Capturar el parámetro en el componente:**

```typescript
import { ActivatedRoute } from '@angular/router';

export class CountryPage {
  private route = inject(ActivatedRoute);

  ngOnInit() {
    // Opción 1: Snapshot (valor actual)
    const code = this.route.snapshot.params['code'];

    // Opción 2: Observable (reactivo a cambios)
    this.route.params.subscribe((params) => {
      const code = params['code'];
    });
  }
}
```

**🔍 Diferencia Snapshot vs Observable:**

- **Snapshot**: Obtiene el valor actual (una sola vez)
- **Observable**: Se actualiza si el parámetro cambia sin recargar el componente

**c) Exportación por defecto**

```typescript
export default countryRoutes;
```

- Permite importar las rutas sin usar llaves: `import('./country/country.routes')`
- Compatible con lazy loading de Angular
- **Patrón recomendado** para archivos de rutas que se cargan dinámicamente

### 3. Layout Pattern

#### ¿Qué es un Layout?

Un **Layout** es un componente que define la estructura visual común de una sección de la aplicación.

**`country-layout.ts`:**

```typescript
@Component({
  selector: 'app-country-layout',
  imports: [RouterOutlet, TopMenu],
  templateUrl: './country-layout.html',
})
export class CountryLayout {}
```

**`country-layout.html`:**

```html
<div class="container mx-auto">
  <app-top-menu></app-top-menu>
  <!-- Siempre visible -->
  <router-outlet></router-outlet>
  <!-- Contenido dinámico -->
</div>
```

**Ventajas del patrón Layout:**

- ✅ El menú de navegación (`TopMenu`) se muestra en TODAS las páginas de country
- ✅ Evita repetir código en cada página
- ✅ Centraliza elementos comunes (headers, sidebars, footers)
- ✅ Facilita cambios globales

---

## Componentes y Comunicación

### 1. Standalone Components

A partir de **Angular 15+**, los componentes pueden ser **standalone** (independientes), sin necesidad de `NgModule`.

```typescript
@Component({
  selector: 'app-country-search-input',
  imports: [], // ⚠️ Aquí se importan otros componentes/directivas
  templateUrl: './country-search-input.html',
})
export class CountrySearchInput {
  // ...
}
```

**Ventajas:**

- ✅ Menos código boilerplate (no necesitas NgModule)
- ✅ Más simple y directo
- ✅ Tree-shaking más efectivo (elimina código no usado)
- ✅ Futuro de Angular (recomendado oficialmente)

### 2. Comunicación Padre → Hijo (Input Signals)

#### Antes (Angular < 16):

```typescript
@Input() placeHolderText!: string;
```

#### Ahora (Angular 16+): Input Signals

```typescript
placeHolderText = input.required<string>();
```

**Ejemplo completo:**

**`country-search-input.ts`:**

```typescript
export class CountrySearchInput {
  placeHolderText = input.required<string>(); // Input requerido
}
```

**`by-capital-page.html`:**

```html
<app-country-search-input
  [placeHolderText]="'Search by capital...'"
  (searchValue)="onSearchCapital($event)"
>
</app-country-search-input>
```

**Ventajas de Input Signals:**

- ✅ **Reactivo por defecto**: Detecta cambios automáticamente
- ✅ **Mejor rendimiento**: Change detection más eficiente
- ✅ **Type-safe**: TypeScript verifica los tipos
- ✅ **`required`**: Fuerza a que el padre pase el valor (evita bugs)

### 3. Comunicación Hijo → Padre (Output Signals)

#### Antes:

```typescript
@Output() searchValue = new EventEmitter<string>();
```

#### Ahora: Output Signals

```typescript
searchValue = output<string>();
```

**Ejemplo completo:**

**`country-search-input.ts`:**

```typescript
export class CountrySearchInput {
  searchValue = output<string>(); // Emisor de eventos

  handleSearchCapital(value: string) {
    this.searchValue.emit(value); // Emite el valor al padre
  }
}
```

**`country-search-input.html`:**

```html
<input type="text" (keyup.enter)="handleSearchCapital(searchInput.value)" #searchInput />
```

**`by-capital-page.ts`:**

```typescript
export class ByCapitalPage {
  onSearchCapital(value: string): void {
    console.log('Búsqueda recibida:', value);
    // Lógica de búsqueda...
  }
}
```

**`by-capital-page.html`:**

```html
<app-country-search-input (searchValue)="onSearchCapital($event)"> </app-country-search-input>
```

**🔄 Flujo de datos completo:**

1. Usuario escribe en el input y presiona Enter
2. Se ejecuta `handleSearchCapital(value)` en el componente hijo
3. El hijo emite el valor con `this.searchValue.emit(value)`
4. El padre recibe el valor en `onSearchCapital($event)`
5. El padre ejecuta la lógica de búsqueda

### 4. Signals (Estado Reactivo)

**Signals** son una nueva forma de manejar estado reactivo en Angular 16+.

```typescript
export class ByCapitalPage {
  isLoading = signal(false);
  isError = signal<string | null>(null);
  countries = signal<Country[]>([]);
}
```

#### Métodos de Signals:

**a) Leer valor:**

```typescript
if (this.isLoading()) {
  // ⚠️ Nota los paréntesis
  console.log('Cargando...');
}
```

**b) Actualizar valor:**

```typescript
this.isLoading.set(true); // Establece nuevo valor
this.countries.set([...newData]); // Reemplaza array
```

**c) En templates:**

```html
<div *ngIf="isLoading()">Cargando...</div>
<div *ngIf="isError()">{{ isError() }}</div>
```

**Ventajas de Signals:**

- ✅ **Rendimiento**: Solo actualiza lo necesario (change detection granular)
- ✅ **Más simple**: No necesitas `ChangeDetectorRef`
- ✅ **Composable**: Puedes crear signals derivados
- ✅ **Tipo seguro**: TypeScript valida los tipos

**🆚 Signals vs Observables:**

- **Signals**: Estado síncrono y local (variables del componente)
- **Observables**: Operaciones asíncronas (HTTP, eventos)
- **Puedes combinarlos**: Recibir datos vía Observable y guardarlos en Signal

### 5. Change Detection Strategy

```typescript
@Component({
  selector: 'app-country-list',
  imports: [DecimalPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryList {
  countries = input.required<Country[]>();

  // Inputs opcionales para manejar estados
  errorMessage = input<string | unknown>();
  isLoading = input<boolean>(false);
  isEmpty = input<boolean>(false);
}
```

**ChangeDetectionStrategy.OnPush:**

- Angular **solo** revisa cambios cuando:
  - Los `@Input` cambian (incluyendo signals)
  - Un evento del template se dispara
  - Un Observable emite (con async pipe)
- **Ventaja**: Mejor rendimiento en aplicaciones grandes
- **Recomendación**: Usa `OnPush` siempre que sea posible con Signals

**💡 Nota sobre este componente:**
Aunque es un componente presentacional, acepta inputs adicionales (`errorMessage`, `isLoading`, `isEmpty`) para manejar estados internamente en la tabla. Esto lo hace más flexible y autocontenido.

---

## Servicios y HTTP

### 1. Injectable Service

Los **servicios** contienen lógica de negocio y son inyectables en componentes.

```typescript
@Injectable({
  providedIn: 'root', // ⚠️ Singleton global
})
export class CountryService {
  private httpClient = inject(HttpClient);
  // ...
}
```

**`providedIn: 'root'`:**

- El servicio es un **singleton** (una sola instancia en toda la app)
- Se registra automáticamente en el root injector
- No necesitas agregarlo en `providers: []` de ningún módulo

### 2. HttpClient Configuration

**`app.config.ts`:**

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()), // ⚠️ Importante
    // ...
  ],
};
```

**`withFetch()`:**

- Usa la API nativa `fetch()` del navegador en lugar de `XMLHttpRequest`
- **Ventaja**: Mejor rendimiento y compatibilidad con Server-Side Rendering (SSR)
- **Recomendado** en Angular moderno

### 3. Peticiones HTTP con RxJS

```typescript
searchByCapital(query: string): Observable<Country[]> {
  query = query.trim().toLowerCase();

  return this.httpClient.get<RESTCountry[]>(`${APU_URL}/capital/${query}`).pipe(
    map((countries) => CountryMapper.RESTCountriesToCountries(countries)),
    catchError((error) => {
      console.log(error);
      return throwError(() => new Error('Error searching countries by capital'));
    })
  );
}
```

#### Conceptos de RxJS:

**a) Observable:**

- Representa una secuencia de valores futuros (asíncrono)
- Es **lazy**: No se ejecuta hasta que alguien se suscriba
- Retorna `Observable<Country[]>` (promesa de array de países)

**b) pipe():**

- Permite encadenar **operadores de RxJS**
- Transforma el flujo de datos

**c) map():**

```typescript
map((countries) => CountryMapper.RESTCountriesToCountries(countries));
```

- **Transforma** los datos
- Convierte `RESTCountry[]` → `Country[]`
- Similar al `.map()` de arrays

**d) catchError():**

```typescript
catchError((error) => {
  console.log(error);
  return throwError(() => new Error('Mensaje personalizado'));
});
```

- **Captura errores** de la petición HTTP
- **Importante**: Debe retornar un Observable (por eso `throwError()`)
- Se ejecuta si:
  - La API retorna un error (404, 500, etc.)
  - Hay un problema de red
  - La transformación de datos falla

**🔍 ¿Por qué throwError()?**

- `catchError` espera que devuelvas un **Observable**
- `throwError()` crea un Observable que emite un error
- Esto permite que el componente maneje el error en `subscribe()`

### 4. Consumir el servicio en el componente

```typescript
export class ByCapitalPage {
  countryService = inject(CountryService);

  isLoading = signal(false);
  isError = signal<string | null>(null);
  countries = signal<Country[]>([]);

  onSearchCapital(value: string): void {
    if (this.isLoading()) return; // Evita búsquedas duplicadas

    this.isLoading.set(true);
    this.isError.set(null);

    this.countryService.searchByCapital(value).subscribe({
      next: (countries) => {
        this.isLoading.set(false);
        this.countries.set(countries);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.isError.set(`Error buscando países con capital "${value}"`);
        this.countries.set([]);
      },
    });
  }
}
```

#### Desglose del código:

**a) Inyección de dependencias:**

```typescript
countryService = inject(CountryService);
```

- `inject()` es la forma moderna de inyectar servicios (Angular 14+)
- Alternativa al constructor tradicional

**b) Estado de la búsqueda:**

- `isLoading`: Indica si la petición está en curso
- `isError`: Almacena mensajes de error
- `countries`: Almacena los resultados

**c) Validación:**

```typescript
if (this.isLoading()) return;
```

- Evita hacer múltiples peticiones simultáneas
- Mejora UX y rendimiento

**d) Subscribe con objeto:**

```typescript
.subscribe({
  next: (data) => { /* éxito */ },
  error: (err) => { /* error */ },
  complete: () => { /* opcional */ }
})
```

- **`next`**: Se ejecuta cuando la petición es exitosa
- **`error`**: Se ejecuta si hay un error
- **`complete`**: Se ejecuta al finalizar (opcional)

---

## Optimizaciones Avanzadas

### Debouncing en búsquedas

**¿Qué es Debouncing?**

El debouncing es una técnica que **retrasa la ejecución de una función** hasta que el usuario deja de disparar eventos. Perfecto para búsquedas donde cada pulsación de tecla no debería disparar una petición HTTP.

**Problema sin debouncing:**

```
Usuario escribe: "S" (petición 1)
Usuario escribe: "Sa" (petición 2)
Usuario escribe: "San" (petición 3)
Usuario escribe: "Sant" (petición 4)
Usuario escribe: "Santi" (petición 5)
Usuario escribe: "Santiago" (petición 6)
→ 6 peticiones innecesarias 😱
```

**Solución con debouncing (300ms):**

```
Usuario escribe: "S"
Usuario escribe: "Sa"
Usuario escribe: "San"
Usuario escribe: "Sant"
Usuario escribe: "Santi"
Usuario escribe: "Santiago"
→ Usuario deja de escribir → [espera 300ms] → petición 1 ✅
```

**Implementación en el componente:**

En `country-search-input.ts`:

```typescript
import { effect } from '@angular/core';

@Component({
  selector: 'app-country-search-input',
})
export class CountrySearchInput {
  placeHolderText = input.required<string>();
  debounceTime = input<number>(300); // Configurable
  initialValue = input<string>('');

  searchValue = output<string>();
  inputValue = linkedSignal<string>(() => this.initialValue());

  // ⚠️ Effect que implementa el debouncing
  debounceEffect = effect((onCleanup) => {
    const value = this.inputValue();
    const timeout = setTimeout(() => {
      this.handleSearchCapital(value); // Se emite después del delay
    }, this.debounceTime());

    // Limpiar timeout si el effect se ejecuta nuevamente
    onCleanup(() => clearTimeout(timeout));
  });

  handleSearchCapital(value: string) {
    this.searchValue.emit(value);
  }
}
```

**En el template:**

```html
<input
  type="text"
  [placeholder]="placeHolderText()"
  (keyup)="inputValue.set(txtSearchCapital.value)"
  [value]="initialValue()"
  #txtSearchCapital
/>
<button (click)="handleSearchCapital(txtSearchCapital.value)">Search</button>
```

**¿Cómo funciona?**

1. Usuario escribe → `(keyup)` actualiza `inputValue`
2. `inputValue` está siendo "observado" por el `effect`
3. Cada cambio en `inputValue` cancela el `setTimeout` anterior (vía `onCleanup`)
4. Un nuevo `setTimeout` comienza (300ms)
5. Si el usuario deja de escribir → se ejecuta `handleSearchCapital`

**Ventajas:**

- ✅ Reduce llamadas HTTP drásticamente
- ✅ Mejora rendimiento y UX
- ✅ Reduce carga en el servidor
- ✅ Fácil de configurar (`debounceTime` es input)

---

### Caching simple

**¿Qué es Caching?**

Es una técnica que **almacena resultados anteriores** para evitar hacer la misma petición HTTP dos veces.

**Problema sin caching:**

```
Búsqueda 1: "Madrid" → petición HTTP → 500ms
Búsqueda 2: Otro país → petición HTTP
Búsqueda 1 nuevamente: "Madrid" → petición HTTP OTRA VEZ ❌
```

**Solución con caching:**

```
Búsqueda 1: "Madrid" → petición HTTP → guarda resultado en cache
Búsqueda 2: Otro país → petición HTTP
Búsqueda 1 nuevamente: "Madrid" → devuelve del cache al instante ✅
```

**Implementación en el servicio:**

En `country.service.ts`:

```typescript
@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private httpClient = inject(HttpClient);

  // Tres caches separados para cada tipo de búsqueda
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<Region, Country[]>();

  searchByCapital(query: string): Observable<Country[]> {
    query = query.trim().toLowerCase();

    // ✅ Verificar si ya existe en cache
    if (this.queryCacheCapital.has(query)) {
      console.log('🎯 Resultado del cache:', query);
      return of(this.queryCacheCapital.get(query)!); // Retorna del cache
    }

    // Si no está en cache, hacer petición HTTP
    return this.httpClient.get<RESTCountry[]>(`${APU_URL}/capital/${query}`).pipe(
      map((countries) => CountryMapper.RESTCountriesToCountries(countries)),
      tap((countries) => {
        // ✅ Guardar en cache después de éxito
        this.queryCacheCapital.set(query, countries);
      }),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error('Error searching countries by capital'));
      })
    );
  }

  searchByCountry(query: string): Observable<Country[]> {
    query = query.trim().toLowerCase();

    if (this.queryCacheCountry.has(query)) {
      return of(this.queryCacheCountry.get(query)!);
    }

    return this.httpClient.get<RESTCountry[]>(`${APU_URL}/name/${query}`).pipe(
      map((countries) => CountryMapper.RESTCountriesToCountries(countries)),
      tap((countries) => this.queryCacheCountry.set(query, countries)),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error('Error searching countries by name'));
      })
    );
  }

  searchByRegion(region: Region): Observable<Country[]> {
    if (this.queryCacheRegion.has(region)) {
      return of(this.queryCacheRegion.get(region)!);
    }

    return this.httpClient.get<RESTCountry[]>(`${APU_URL}/region/${region}`).pipe(
      map((countries) => CountryMapper.RESTCountriesToCountries(countries)),
      tap((countries) => this.queryCacheRegion.set(region, countries)),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error('Error searching countries by region'));
      })
    );
  }
}
```

**Conceptos clave:**

**a) `Map<K, V>` - Estructura de datos:**

```typescript
const cache = new Map<string, Country[]>();
cache.set('madrid', [...]); // Guardar
cache.has('madrid');         // Verificar si existe
cache.get('madrid');         // Obtener valor
```

**b) `of()` operador de RxJS:**

```typescript
return of(cachedData); // Convierte valor en Observable que emite al instante
```

**c) `tap()` operador (side effect):**

```typescript
.pipe(
  map(...),
  tap((data) => cache.set(query, data)),  // Ejecuta código, NO transforma
  catchError(...)
)
```

**Ventajas:**

- ✅ Respuestas instantáneas para búsquedas repetidas
- ✅ Reduce tráfico de red
- ✅ Mejora rendimiento percibido
- ✅ Reduce carga del servidor

**⚠️ Consideraciones:**

- El cache está en memoria (se pierde al recargar)
- Para cache persistente, usar `localStorage` o una DB
- Para invalidar cache después de cierto tiempo, agregar timestamp

---

### LinkedSignal - Sincronización de Rutas

**¿Qué es linkedSignal?**

`linkedSignal` es una función de Angular que **crea un signal derivado** que **sincroniza automáticamente** con otro signal. Es perfecta para conectar el estado del componente con parámetros de ruta.

**Problema sin linkedSignal:**

```typescript
// ❌ Enfoque manual problemático
export class ByCapitalPage {
  activatedRoute = inject(ActivatedRoute);
  query = signal('');

  constructor() {
    // Debes sincronizar manualmente
    const queryParam = this.activatedRoute.snapshot.queryParamMap.get('query');
    this.query.set(queryParam || '');
  }
}
```

**Problemas:**

- ❌ Si la ruta cambia, el signal NO se actualiza
- ❌ Si cambias el signal, la ruta NO se actualiza
- ❌ Desincronización entre ruta e input

**Solución con linkedSignal:**

```typescript
export class ByCapitalPage {
  activatedRoute = inject(ActivatedRoute);
  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') || '';
  router = inject(Router);

  // ✅ linkedSignal crea un signal derivado y sincronizado
  query = linkedSignal<string>(() => this.queryParam);

  onSearchCapital = (value: string) => {
    this.query.set(value); // Actualiza el signal
  };

  countryResource = resource({
    params: () => ({ query: this.query() }),
    loader: async ({ params }) => {
      // ✅ Actualiza la ruta cuando query cambia
      this.router.navigate(['/country/by-capital'], {
        queryParams: { query: params.query },
      });
      if (params.query === '') return [];
      return await firstValueFrom(this.countryService.searchByCapital(params.query));
    },
  });
}
```

**¿Cómo funciona linkedSignal?**

1. **`linkedSignal<T>(fn)` crea un signal derivado**

   - El signal inicial se establece evaluando `fn()`
   - En este caso: `() => this.queryParam` (el parámetro de ruta)

2. **Sincronización bidireccional:**
   - Cuando el usuario busca → `query.set(value)` actualiza el signal
   - Cuando el signal cambia → `resource` se recarga con los nuevos params
   - Dentro del loader → se actualiza la ruta con `router.navigate()`
   - Resultado: **Ruta ↔ Input ↔ Búsqueda sincronizados**

**En `by-region-page.ts` con función helper:**

```typescript
// Función auxiliar para parsear región desde string
export function parseRegion(input: string): Region {
  input = input.toLowerCase().trim();
  const validRegions: Record<string, Region> = {
    africa: 'Africa',
    americas: 'Americas',
    asia: 'Asia',
    europe: 'Europe',
    oceania: 'Oceania',
    antarctic: 'Antarctic',
  };
  return validRegions[input] || 'Americas';
}

@Component({...})
export class ByRegionPage {
  activatedRoute = inject(ActivatedRoute);
  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') || '';
  router = inject(Router);

  regions: Region[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctic'];

  // ✅ linkedSignal con transformación
  selectedRegion = linkedSignal<Region | null>(() => parseRegion(this.queryParam));

  selectRegion(region: Region) {
    this.selectedRegion.set(region);
    this.router.navigate(['/country/by-region'], {
      queryParams: { query: region },
    });
  }

  countryResource = resource({
    params: () => ({ region: this.selectedRegion() }),
    loader: async ({ params }) => {
      if (!params.region) return [];
      return await firstValueFrom(this.countryService.searchByRegion(params.region));
    },
  });
}
```

**🔑 Ventajas de linkedSignal:**

- ✅ **Sincronización automática**: Ruta ↔ Signal ↔ Input sincronizados
- ✅ **Reactividad**: Cambios en ruta actualizan el signal automáticamente
- ✅ **Bookmarkeable**: El usuario puede compartir URLs con búsquedas
- ✅ **Back/Forward**: El botón atrás restaura la búsqueda anterior
- ✅ **Estado persistente**: La ruta es el source of truth

**📊 Comparativa: Enfoque manual vs linkedSignal**

| Aspecto                 | Sin linkedSignal | Con linkedSignal |
| ----------------------- | ---------------- | ---------------- |
| **Sincronización ruta** | Manual ❌        | Automática ✅    |
| **Bookmarkeable**       | ❌               | ✅               |
| **Back/Forward**        | ❌               | ✅               |
| **Código**              | ~15 líneas       | ~5 líneas        |
| **Mantenimiento**       | Difícil          | Fácil            |
| **Bugs potenciales**    | Muchos           | Pocos            |

**💡 Cuándo usar linkedSignal:**

✅ Usar `linkedSignal` cuando:

- Necesitas sincronizar estado con parámetros de ruta
- Quieres que los cambios en componentes actualicen la URL
- Necesitas que la búsqueda sea bookmarkeable
- Requieres que back/forward funcione correctamente

❌ No necesitas `linkedSignal` cuando:

- El estado es puramente local (sin relación con URL)
- No quieres cambios de URL (e.g., formularios internos)

---

## Resources API - Enfoque Moderno de Angular

### 🆕 ¿Qué son los Resources?

**Resources** es una API introducida en **Angular 19** que simplifica el manejo de datos asíncronos, combinando lo mejor de Signals y Observables en una sola abstracción. Es la forma **moderna y recomendada** de manejar peticiones HTTP en Angular.

### Comparativa: Enfoque Clásico vs Resources

#### ❌ Enfoque Clásico (Observable + Subscribe)

```typescript
export class ByCapitalPage {
  countryService = inject(CountryService);

  // ⚠️ Necesitas manejar múltiples signals manualmente
  isLoading = signal(false);
  isError = signal<string | null>(null);
  countries = signal<Country[]>([]);

  onSearchCapital(value: string): void {
    // ⚠️ Validación manual de estado
    if (this.isLoading()) return;

    // ⚠️ Debes actualizar cada signal manualmente
    this.isLoading.set(true);
    this.isError.set(null);

    this.countryService.searchByCapital(value).subscribe({
      next: (countries) => {
        this.isLoading.set(false);
        this.countries.set(countries);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.isError.set(`Error buscando países con capital "${value}"`);
        this.countries.set([]);
      },
    });
  }
}
```

**Problemas del enfoque clásico:**

- ❌ **Boilerplate**: Mucho código repetitivo
- ❌ **Gestión manual**: Debes actualizar `isLoading`, `isError`, `countries` manualmente
- ❌ **Propenso a errores**: Fácil olvidar actualizar un estado
- ❌ **No cancelable**: Si el usuario hace varias búsquedas rápidas, no se cancelan las peticiones anteriores
- ❌ **Memoria**: Debes recordar desuscribirte (aunque en este caso Angular lo hace automáticamente)

#### ✅ Enfoque Moderno (Resources API)

```typescript
export class ByCapitalPage {
  countryService = inject(CountryService);

  // 1️⃣ Signal que controla el parámetro de búsqueda
  query = signal('');

  // 2️⃣ Función simple que actualiza el query
  onSearchCapital = (value: string) => {
    this.query.set(value); // ¡Solo esto! El resource se actualiza automáticamente
  };

  // 3️⃣ Resource que se recarga automáticamente cuando cambia query
  countryResource = resource({
    // Los parámetros reactivos que activan la recarga
    params: () => ({ query: this.query() }),

    // La función loader que ejecuta la petición
    loader: async ({ params }) => {
      if (params.query === '') return [];
      return await firstValueFrom(this.countryService.searchByCapital(params.query));
    },
  });
}
```

**Ventajas del enfoque con Resources:**

- ✅ **Menos código**: ~10 líneas vs ~30 líneas
- ✅ **Declarativo**: Describes QUÉ quieres, no CÓMO hacerlo
- ✅ **Gestión automática**: Estados de loading/error manejados automáticamente
- ✅ **Cancelación automática**: Si `query` cambia, la petición anterior se cancela
- ✅ **Reactivo**: Se actualiza automáticamente cuando cambian los parámetros
- ✅ **Sin memory leaks**: No necesitas desuscribirte manualmente

### Desglose del Resource

#### 1. Signal de parámetros

```typescript
query = signal('');
```

- Es el **trigger** (disparador) del resource
- Cuando `query` cambia, el resource se recarga automáticamente
- Puedes tener múltiples signals como parámetros

#### 2. Función params

```typescript
params: () => ({ query: this.query() });
```

- **Función reactiva** que retorna los parámetros del loader
- Se ejecuta automáticamente cuando `query()` cambia
- El `resource` "observa" los signals usados dentro de esta función

#### 3. Función loader

```typescript
loader: async ({ params }) => {
  if (params.query === '') return [];
  return await firstValueFrom(this.countryService.searchByCapital(params.query));
};
```

**Desglose:**

**a) Async function:**

- Permite usar `await` para convertir Observables a Promises
- Más limpio que `.subscribe()`

**b) firstValueFrom():**

```typescript
import { firstValueFrom } from 'rxjs';
```

- Convierte un `Observable` en una `Promise`
- Toma el **primer valor** emitido y completa
- Perfecto para peticiones HTTP (que emiten un solo valor)

**🆚 Alternativas:**

```typescript
// ❌ No uses subscribe en un loader
loader: ({ params }) => {
  this.countryService.searchByCapital(params.query).subscribe(...); // ¡Mal!
}

// ✅ Usa firstValueFrom
loader: async ({ params }) => {
  return await firstValueFrom(this.countryService.searchByCapital(params.query));
}

// ✅ O directamente retorna el Observable (también funciona)
loader: ({ params }) => {
  return this.countryService.searchByCapital(params.query);
}
```

**c) Validación temprana:**

```typescript
if (params.query === '') return [];
```

- Evita hacer peticiones innecesarias
- Retorna un valor por defecto (array vacío)

### Propiedades del Resource

El `countryResource` expone automáticamente estas propiedades reactivas:

#### a) value()

```typescript
countryResource.value(); // Country[] | undefined
```

- Los **datos cargados** exitosamente
- `undefined` mientras no haya terminado de cargar por primera vez

#### b) error()

```typescript
countryResource.error(); // Error | undefined
```

- El **error** si la petición falló
- `undefined` si no hay error

#### c) isLoading()

```typescript
countryResource.isLoading(); // boolean
```

- `true` mientras la petición está en curso
- `false` cuando termina (éxito o error)

#### d) hasValue()

```typescript
countryResource.hasValue(); // boolean
```

- `true` si ya se cargó al menos un valor exitosamente
- `false` si aún no hay datos

#### e) status()

```typescript
countryResource.status(); // 'idle' | 'loading' | 'error' | 'resolved' | 'reloading'
```

- Estado detallado del resource:
  - **`idle`**: No ha cargado nada aún
  - **`loading`**: Primera carga
  - **`reloading`**: Recargando con nuevos parámetros
  - **`resolved`**: Carga exitosa
  - **`error`**: Falló la carga

### Uso en el Template

#### Enfoque Clásico:

```html
<!-- ⚠️ Múltiples validaciones manuales -->
@if (isLoading()) {
<span class="loading loading-spinner"></span>
} @if (isError()) {
<div class="alert alert-error">{{ isError() }}</div>
} @if (!isLoading() && !isError() && countries().length > 0) {
<app-country-list [countries]="countries()" />
}
```

#### Con Resources:

```html
<!-- ✅ Más limpio y expresivo -->
@if (countryResource.error()) {
<h3>{{ countryResource.error() }}</h3>
} @if (countryResource.hasValue()) {
<app-country-list [countries]="countryResource.value()" />
}
```

**💡 Puedes agregar más estados si necesitas:**

```html
@if (countryResource.isLoading()) {
<span class="loading loading-spinner"></span>
} @if (countryResource.error()) {
<div class="alert alert-error">
  <p>{{ countryResource.error()?.message }}</p>
  <button (click)="countryResource.reload()">Reintentar</button>
</div>
} @if (countryResource.hasValue()) { @if (countryResource.value()!.length === 0) {
<p>No se encontraron países</p>
} @else {
<app-country-list [countries]="countryResource.value()!" />
} }
```

### Métodos adicionales del Resource

#### reload()

```typescript
countryResource.reload();
```

- Fuerza una recarga con los mismos parámetros
- Útil para botones de "Reintentar"

#### update()

```typescript
countryResource.update((currentValue) => [...currentValue, newCountry]);
```

- Actualiza el valor manualmente sin hacer una petición
- Útil para optimistic updates

### Casos de uso avanzados

#### 1. Múltiples parámetros

```typescript
searchQuery = signal('');
region = signal('');
sortBy = signal('name');

countryResource = resource({
  params: () => ({
    query: this.searchQuery(),
    region: this.region(),
    sort: this.sortBy(),
  }),
  loader: async ({ params }) => {
    // Se recarga cuando CUALQUIERA de los signals cambia
    return await firstValueFrom(
      this.countryService.search(params.query, params.region, params.sort)
    );
  },
});
```

#### 2. Dependencias entre Resources

```typescript
countryCode = signal('');

// Resource 1: Obtiene el país
countryResource = resource({
  params: () => ({ code: this.countryCode() }),
  loader: async ({ params }) => {
    return await firstValueFrom(this.countryService.getByCode(params.code));
  },
});

// Resource 2: Obtiene países vecinos (depende del Resource 1)
neighborsResource = resource({
  params: () => {
    const country = this.countryResource.value();
    return { borders: country?.borders || [] };
  },
  loader: async ({ params }) => {
    if (params.borders.length === 0) return [];
    return await firstValueFrom(this.countryService.getByBorders(params.borders));
  },
});
```

#### 3. Debounce (retrasar peticiones)

```typescript
import { debounce } from '@angular/core';

searchQuery = signal('');

// Espera 300ms antes de hacer la petición
debouncedQuery = debounce(this.searchQuery, () => 300);

countryResource = resource({
  params: () => ({ query: this.debouncedQuery() }),
  loader: async ({ params }) => {
    if (!params.query) return [];
    return await firstValueFrom(this.countryService.search(params.query));
  },
});
```

### 🎯 Cuándo usar Resources vs Observable + Subscribe

#### ✅ Usa Resources cuando:

- Necesitas cargar datos basados en parámetros reactivos (signals)
- Quieres cancelación automática de peticiones
- Prefieres código declarativo sobre imperativo
- Necesitas estados de loading/error automáticos
- Trabajas con Angular 19+

#### ⚠️ Usa Observable + Subscribe cuando:

- Necesitas control muy fino sobre el flujo de datos
- Trabajas con Observables complejos (múltiples operadores RxJS)
- Necesitas ejecutar efectos secundarios específicos
- Mantienes código legacy que ya funciona bien

### 📊 Tabla Comparativa

| Aspecto                  | Observable + Subscribe | Resources API |
| ------------------------ | ---------------------- | ------------- |
| **Código**               | ~30 líneas             | ~10 líneas    |
| **Boilerplate**          | Alto                   | Bajo          |
| **Gestión de estado**    | Manual                 | Automática    |
| **Cancelación**          | Manual                 | Automática    |
| **Reactividad**          | Manual                 | Automática    |
| **Curva de aprendizaje** | Media                  | Baja          |
| **Debugging**            | Complejo               | Simple        |
| **Type safety**          | Bueno                  | Excelente     |
| **Soporte**              | Todas las versiones    | Angular 19+   |

### 💡 Recomendación

Para aplicaciones nuevas con **Angular 19+**, usa **Resources API** como enfoque principal. Es más simple, menos propenso a errores y sigue la dirección futura de Angular hacia Signals.

El enfoque clásico con Observables sigue siendo válido y lo encontrarás en código legacy o cuando necesites operadores RxJS avanzados.

### 📝 Ejemplo Completo: Ambos Enfoques Lado a Lado

Para que veas claramente la diferencia, aquí está el mismo componente implementado con ambos enfoques:

#### 🔷 Componente con Enfoque Clásico (Observable + Subscribe)

```typescript
import { Component, inject, signal } from '@angular/core';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-by-capital-page',
  imports: [CountrySearchInput, CountryList],
  templateUrl: './by-capital-page.html',
})
export class ByCapitalPage {
  countryService = inject(CountryService);

  // 📦 Tres signals separados para gestionar el estado
  isLoading = signal(false);
  isError = signal<string | null>(null);
  countries = signal<Country[]>([]);

  onSearchCapital(value: string): void {
    // ⚠️ Validación manual
    if (this.isLoading()) return;

    // 📝 Actualización manual de estados (inicio)
    this.isLoading.set(true);
    this.isError.set(null);

    // 🔄 Subscribe al Observable
    this.countryService.searchByCapital(value).subscribe({
      next: (countries) => {
        // 📝 Actualización manual de estados (éxito)
        this.isLoading.set(false);
        this.countries.set(countries);
      },
      error: (err) => {
        // 📝 Actualización manual de estados (error)
        this.isLoading.set(false);
        this.isError.set(`Error buscando países con capital "${value}"`);
        this.countries.set([]);
      },
    });
  }
}
```

**Template:**

```html
<app-country-search-input
  placeHolderText="Search by capital..."
  (searchValue)="onSearchCapital($event)"
/>

@if (isLoading()) {
<span class="loading loading-spinner"></span>
} @if (isError()) {
<div class="alert alert-error">{{ isError() }}</div>
} @if (!isLoading() && !isError() && countries().length > 0) {
<app-country-list [countries]="countries()" />
}
```

#### 🔶 Componente con Enfoque Moderno (Resources API)

```typescript
import { Component, inject, resource, signal } from '@angular/core';
import { CountryService } from '../../services/country.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-by-capital-page',
  imports: [CountrySearchInput, CountryList],
  templateUrl: './by-capital-page.html',
})
export class ByCapitalPage {
  countryService = inject(CountryService);

  // 🎯 Un solo signal para el parámetro de búsqueda
  query = signal('');

  // ✅ Función simple que actualiza el query
  onSearchCapital = (value: string) => {
    this.query.set(value); // ¡Eso es todo!
  };

  // 🚀 Resource que gestiona automáticamente loading/error/value
  countryResource = resource({
    params: () => ({ query: this.query() }),
    loader: async ({ params }) => {
      if (params.query === '') return [];
      return await firstValueFrom(this.countryService.searchByCapital(params.query));
    },
  });
}
```

**Template:**

```html
<app-country-search-input
  placeHolderText="Search by capital..."
  (searchValue)="onSearchCapital($event)"
/>

@if (countryResource.isLoading()) {
<span class="loading loading-spinner"></span>
} @if (countryResource.error()) {
<div class="alert alert-error">{{ countryResource.error()?.message }}</div>
} @if (countryResource.hasValue()) {
<app-country-list [countries]="countryResource.value()!" />
}
```

#### 📊 Análisis de diferencias

| Aspecto                       | Enfoque Clásico                   | Enfoque Moderno                 |
| ----------------------------- | --------------------------------- | ------------------------------- |
| **Líneas de código**          | ~35 líneas                        | ~15 líneas                      |
| **Signals de estado**         | 3 (isLoading, isError, countries) | 1 (query) + resource automático |
| **Actualizaciones manuales**  | 6 llamadas a `.set()`             | 1 llamada a `.set()`            |
| **Lógica de validación**      | Manual                            | Automática                      |
| **Cancelación de peticiones** | ❌ No                             | ✅ Automática                   |
| **Propenso a errores**        | ⚠️ Alto                           | ✅ Bajo                         |
| **Código en el template**     | Complejo                          | Simple                          |
| **Reactividad**               | Manual                            | Automática                      |

#### 🎓 ¿Qué aprendes con cada enfoque?

**Enfoque Clásico:**

- ✅ Entiendes el flujo completo de datos asíncronos
- ✅ Aprendes manejo de estados manuales
- ✅ Practicas RxJS y Observables
- ✅ Fundamental para código legacy

**Enfoque Moderno:**

- ✅ Aprendes el futuro de Angular
- ✅ Código más limpio y mantenible
- ✅ Mejor rendimiento
- ✅ Menos bugs

**💡 Recomendación para estudiantes:** Aprende **ambos enfoques**. Comienza con el clásico para entender los fundamentos, luego migra al moderno para apreciar sus ventajas.

---

## Manejo de Errores

### 1. Dos niveles de manejo de errores

En este proyecto, los errores se manejan en **DOS lugares**:

#### a) En el Servicio (con catchError)

```typescript
searchByCapital(query: string): Observable<Country[]> {
  return this.httpClient.get<RESTCountry[]>(`${APU_URL}/capital/${query}`).pipe(
    map((countries) => CountryMapper.RESTCountriesToCountries(countries)),
    catchError((error) => {
      console.log(error);  // Log para debugging
      return throwError(() => new Error('Error searching countries by capital'));
    })
  );
}
```

**Propósito:**

- Logging centralizado
- Transformar errores técnicos en errores de negocio
- Añadir contexto al error

#### b) En el Componente (en subscribe)

```typescript
this.countryService.searchByCapital(value).subscribe({
  next: (countries) => {
    this.countries.set(countries);
  },
  error: (err) => {
    this.isError.set(`Error buscando países con capital "${value}"`);
    this.countries.set([]);
  },
});
```

**Propósito:**

- Mostrar mensajes al usuario
- Actualizar el estado de la UI
- Manejar errores específicos de la vista

### 2. Manejo de errores con Resources

Con **Resources API**, el manejo de errores es **automático** y más simple:

```typescript
countryResource = resource({
  params: () => ({ query: this.query() }),
  loader: async ({ params }) => {
    if (params.query === '') return [];
    // ⚠️ Si el Observable emite un error, el resource lo captura automáticamente
    return await firstValueFrom(this.countryService.searchByCapital(params.query));
  },
});
```

**En el template:**

```html
<!-- El error se maneja automáticamente -->
@if (countryResource.error()) {
<div class="alert alert-error">{{ countryResource.error()?.message }}</div>
}
```

**Ventajas:**

- ✅ No necesitas try-catch en el loader
- ✅ El resource captura automáticamente errores de Promises/Observables
- ✅ El estado de error se actualiza automáticamente
- ✅ No necesitas signals separados para `isLoading` e `isError`

**Si quieres transformar el error:**

```typescript
loader: async ({ params }) => {
  try {
    return await firstValueFrom(this.countryService.searchByCapital(params.query));
  } catch (error) {
    // Lanza un error personalizado
    throw new Error(`No se encontraron países con capital "${params.query}"`);
  }
};
```

### 3. Patrón de manejo de errores (Enfoque Clásico)

**✅ Buena práctica (usada en este proyecto):**

```typescript
// Servicio: Transforma y propaga el error
catchError((error) => {
  console.log(error);
  return throwError(() => new Error('Mensaje descriptivo'));
})
  // Componente: Maneja el error en la UI
  .subscribe({
    error: (err) => {
      this.isError.set('Mensaje para el usuario');
    },
  });
```

**❌ Anti-patrón (evitar):**

```typescript
// NO hagas esto: "tragar" el error
catchError((error) => {
  return of([]); // Retorna array vacío (esconde el error)
});
```

**¿Por qué es malo?**

- El componente NO sabe que hubo un error
- No puedes mostrar mensajes al usuario
- Dificulta el debugging

### 4. Estados de la petición HTTP (Enfoque Clásico)

Con el enfoque clásico, debes manejar 3 estados manualmente:

```typescript
// Estado inicial
isLoading = signal(false);
isError = signal<string | null>(null);
countries = signal<Country[]>([]);

// Antes de la petición
this.isLoading.set(true);
this.isError.set(null);

// En caso de éxito
this.isLoading.set(false);
this.countries.set(countries);

// En caso de error
this.isLoading.set(false);
this.isError.set('Mensaje de error');
this.countries.set([]);
```

**En el template:**

```html
<!-- Mostrar spinner -->
<div *ngIf="isLoading()">
  <span class="loading loading-spinner"></span>
</div>

<!-- Mostrar error -->
<div *ngIf="isError()" class="alert alert-error">{{ isError() }}</div>

<!-- Mostrar resultados -->
<app-country-list [countries]="countries()" />
```

### 5. Estados con Resources (Enfoque Moderno)

Con **Resources**, los estados se manejan automáticamente:

```typescript
countryResource = resource({
  params: () => ({ query: this.query() }),
  loader: async ({ params }) => {
    if (params.query === '') return [];
    return await firstValueFrom(this.countryService.searchByCapital(params.query));
  },
});

// ✅ No necesitas signals adicionales para isLoading, isError, countries
// Todo está incluido en el resource
```

**En el template:**

```html
<!-- Mostrar spinner -->
@if (countryResource.isLoading()) {
<span class="loading loading-spinner"></span>
}

<!-- Mostrar error -->
@if (countryResource.error()) {
<div class="alert alert-error">{{ countryResource.error()?.message }}</div>
}

<!-- Mostrar resultados -->
@if (countryResource.hasValue()) {
<app-country-list [countries]="countryResource.value()!" />
}
```

**📊 Comparación de estados:**

| Estado               | Enfoque Clásico                          | Resources API                 |
| -------------------- | ---------------------------------------- | ----------------------------- |
| **Cargando**         | `isLoading = signal(false)`              | `countryResource.isLoading()` |
| **Error**            | `isError = signal<string \| null>(null)` | `countryResource.error()`     |
| **Datos**            | `countries = signal<Country[]>([])`      | `countryResource.value()`     |
| **Tiene valor**      | `countries().length > 0`                 | `countryResource.hasValue()`  |
| **Estado detallado** | ❌ No disponible                         | `countryResource.status()`    |
| **Actualización**    | Manual con `.set()`                      | Automática                    |

---

## Patrones de Diseño

### 1. Mapper Pattern

El **Mapper** transforma datos de una forma a otra. Es útil para:

- Convertir respuestas de API a modelos de la aplicación
- Renombrar propiedades
- Calcular valores derivados
- Filtrar datos innecesarios

**`country.mapper.ts`:**

```typescript
export class CountryMapper {
  static RESTCountryToCountry(restCountry: RESTCountry): Country {
    return {
      cca2: restCountry.cca2,
      flag: restCountry.flag,
      flagSVG: restCountry.flags.svg,
      name: restCountry.name.common,
      capital: restCountry.capital ? restCountry.capital[0] : 'N/A',
      population: restCountry.population,
      // Nuevos campos añadidos en la interfaz Country
      region: restCountry.region,
      subRegion: restCountry.subregion,
    };
  }

  static RESTCountriesToCountries(restCountries: RESTCountry[]): Country[] {
    return restCountries.map(this.RESTCountryToCountry);
  }
}
```

#### ¿Por qué usar Mappers?

**Modelo de la API (RESTCountry):**

```typescript
interface RESTCountry {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
  };
  capital: string[];
  // ... muchas propiedades más
}
```

**Modelo de nuestra aplicación (Country):**

```typescript
interface Country {
  cca2: string;
  flag: string;
  flagSVG: string;
  name: string;
  capital: string;
  population: number;
  // Campos adicionales mapeados desde la API
  region: string;
  subRegion: string;
}
```

### Country Page (Detalle) — `country-informaction.html`

Este proyecto incluye una página de detalle de país que muestra información enriquecida y una sección visual de "stats".

- `this.country()` : Se asume un `Signal<Country>` con la entidad completa del país.
- `currentYear()` : Signal auxiliar usado en la vista para mostrar año dinámico en las descripciones.

Elementos clave en la plantilla `country-informaction.html`:

- Encabezados con nombre y población formateada:

  - `<h1 class="text-3xl">{{ this.country().name }}</h1>`
  - `<h1 class="text-xl font-thin">Population: {{ this.country().population | number }}</h1>`

- Bloque de estadísticas (`.stats`): tarjetas con valores como `Population`, `Name`, `Sub Region`.
  - Usa `this.country().region` y `this.country().subRegion` (mapeados desde la API).
  - Ejemplo de uso dentro de la plantilla:

```html
<section class="stats shadow flex my-5">
  <div class="stat place-items-center">
    <div class="stat-title">Population</div>
    <div class="stat-value">{{ this.country().population }}</div>
    <div class="stat-desc">Since {{ currentYear() }}</div>
  </div>
  <!-- Más tarjetas para Name, Sub Region, etc. -->
</section>
```

- Figura principal con efecto tipo "diff" entre dos capas de la misma imagen:
  - Se muestran dos `img` con la misma `src` (`country.flagSVG`), una con clase `blur brightness-75` para efecto visual.
  - `alt` dinámico con `this.country().name` para accesibilidad.

```html
<figure class="diff aspect-16/9" tabindex="0">
  <div class="diff-item-1" role="img" tabindex="0">
    <img [alt]="this.country().name" [src]="this.country().flagSVG" />
  </div>
  <div class="diff-item-2" role="img">
    <img class="blur brightness-75" [alt]="this.country().name" [src]="this.country().flagSVG" />
  </div>
  <div class="diff-resizer"></div>
</figure>
```

Notas y recomendaciones:

- Asegúrate de que el `Country` tenga los campos `region` y `subRegion` (el mapper ya los añade).
- Usa `DecimalPipe` o el pipe `number` en templates para formatear población y otros números.
- Añade `aria-label` o `role` cuando sea necesario para mejorar accesibilidad (las `div` con `role="img"` ya ayudan).

Este bloque se agregó para documentar los cambios recientes en la plantilla de detalle de país y ayudar a que el README refleje la implementación actual.

**Ventajas:**

- ✅ **Desacoplamiento**: Si la API cambia, solo modificas el mapper
- ✅ **Simplificación**: Tu app solo usa las propiedades que necesita
- ✅ **Seguridad**: Validas y transformas datos externos
- ✅ **Claridad**: El código de tu app es más legible

**Ejemplo de uso:**

```typescript
return this.httpClient.get<RESTCountry[]>(`${API_URL}/capital/${query}`).pipe(
  map((countries) => CountryMapper.RESTCountriesToCountries(countries))
  // Ahora trabajas con Country[], no RESTCountry[]
);
```

### 2. Repository Pattern (implícito en Services)

Aunque no se llama "Repository", el servicio `CountryService` implementa este patrón:

```typescript
export class CountryService {
  searchByCapital(query: string): Observable<Country[]> {}
  searchByCountry(query: string): Observable<Country[]> {}
  searchByRegion(region: string): Observable<Country[]> {}
  getCountryByCode(code: string): Observable<Country> {}
}
```

**Propósito:**

- Abstrae la lógica de acceso a datos
- Los componentes NO saben de dónde vienen los datos (API, localStorage, etc.)
- Facilita testing (puedes crear un mock del servicio)

### 3. Container/Presentational Pattern

**Container Component (Smart):**

```typescript
// by-capital-page.ts - Maneja lógica y estado
export class ByCapitalPage {
  countryService = inject(CountryService);
  countries = signal<Country[]>([]);

  onSearchCapital(value: string) {
    // Lógica de negocio
  }
}
```

**Presentational Component (Dumb):**

```typescript
// country-list.ts - Solo presenta datos
export class CountryList {
  countries = input.required<Country[]>(); // Recibe datos
  errorMessage = input<string | unknown>(); // Estados opcionales
  isLoading = input<boolean>(false);
  isEmpty = input<boolean>(false);
  // No tiene lógica de negocio, solo presenta datos
}
```

**Uso en el template:**

```html
@for (country of countries(); track $index; let i = $index) {
<tr>
  <td>{{ i + 1 }}</td>
  <td>{{ country.flag }}</td>
  <td><img [src]="country.flagSVG" [alt]="country.name" /></td>
  <td>{{ country.name }}</td>
  <td>{{ country.capital }}</td>
  <td>{{ country.population | number }}</td>
  <td>
    <a [routerLink]="['/country/by', country.cca2]"> More info </a>
  </td>
</tr>
} @if (errorMessage()) {
<tr>
  <td colspan="7">{{ errorMessage() }}</td>
</tr>
} @if (isEmpty() && !isLoading()) {
<tr>
  <td colspan="7">No countries found</td>
</tr>
} @if (isLoading()) {
<tr>
  <td colspan="7">Loading...</td>
</tr>
}
```

**Ventajas:**

- ✅ Componentes presentacionales **reutilizables**
- ✅ Testing más fácil (presentational components son puros)
- ✅ Separación clara de responsabilidades
- ✅ Maneja sus propios estados de visualización

---

## Conceptos Clave de Angular

### 1. Zoneless Change Detection

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(), // ⚠️ Nuevo en Angular 18+
  ],
};
```

**¿Qué es?**

- Angular tradicionalmente usa **Zone.js** para detectar cambios
- **Zoneless** elimina Zone.js → mejor rendimiento
- **Requisito**: Debes usar **Signals** para estado reactivo

**Ventajas:**

- ✅ Menor tamaño de bundle
- ✅ Mejor rendimiento
- ✅ Compatible con frameworks como Solid y React

### 2. Template Reference Variables

```html
<input #searchInput type="text" /> <button (click)="search(searchInput.value)">Buscar</button>
```

**`#searchInput`:**

- Crea una referencia al elemento HTML
- Puedes acceder a sus propiedades: `searchInput.value`, `searchInput.focus()`, etc.
- Alternativa a `ngModel` para casos simples

### 3. Control Flow Syntax (@if, @for, @else)

Angular 17+ introdujo una **nueva sintaxis de control de flujo** que reemplaza las directivas estructurales tradicionales.

#### Antes (directivas estructurales):

```html
<div *ngIf="isLoading">Cargando...</div>
<div *ngIf="countries.length > 0">
  <div *ngFor="let country of countries">{{ country.name }}</div>
</div>
```

#### Ahora (control flow syntax):

```html
@if (isLoading()) {
<div>Cargando...</div>
} @if (countries().length > 0) { @for (country of countries(); track country.cca2) {
<div>{{ country.name }}</div>
} }
```

**Ventajas de la nueva sintaxis:**

- ✅ **Más legible**: Se parece a JavaScript/TypeScript
- ✅ **Mejor rendimiento**: Compilación más eficiente
- ✅ **Type safety**: TypeScript valida mejor las expresiones
- ✅ **Menos imports**: No necesitas importar `NgIf`, `NgFor`
- ✅ **Más expresiva**: Soporta `@else`, `@else if` de forma natural

**Ejemplos:**

**a) @if con @else:**

```html
@if (countryResource.hasValue()) {
<app-country-list [countries]="countryResource.value()!" />
} @else {
<p>No hay datos disponibles</p>
}
```

**b) @if con @else if:**

```html
@if (countryResource.isLoading()) {
<span class="loading loading-spinner"></span>
} @else if (countryResource.error()) {
<div class="alert alert-error">{{ countryResource.error() }}</div>
} @else if (countryResource.hasValue()) {
<app-country-list [countries]="countryResource.value()!" />
} @else {
<p>Realiza una búsqueda</p>
}
```

**c) @for con track:**

```html
@for (country of countries(); track country.cca2) {
<div class="card">
  <h3>{{ country.name }}</h3>
  <p>{{ country.capital }}</p>
</div>
}
```

**⚠️ Importante: `track` es obligatorio en @for**

- Ayuda a Angular a identificar qué elementos cambiaron
- Mejora el rendimiento al actualizar listas
- Usa una propiedad única (ID, código, etc.)

**Variables de contexto en @for:**

Angular proporciona variables especiales dentro de los loops:

```html
@for (country of countries(); track country.cca2; let i = $index) {
<tr>
  <td>{{ i + 1 }}</td>
  <!-- Número de fila -->
  <td>{{ country.name }}</td>
</tr>
}
```

**Variables disponibles:**

- **`$index`** - Índice actual (0, 1, 2...) - El más usado
- **`$first`** - `true` si es el primer elemento
- **`$last`** - `true` si es el último elemento
- **`$even`** - `true` si el índice es par (0, 2, 4...)
- **`$odd`** - `true` si el índice es impar (1, 3, 5...)
- **`$count`** - Total de elementos en la lista

**Ejemplo completo con múltiples variables:**

```html
@for (country of countries(); track country.cca2; let i = $index; let isFirst = $first; let isLast =
$last) {
<tr [class.border-t-4]="isFirst" [class.border-b-4]="isLast" [class.bg-gray-50]="i % 2 === 0">
  <td>{{ i + 1 }}</td>
  <td>{{ country.name }}</td>
  @if (isFirst) {
  <td><span class="badge">Top</span></td>
  }
</tr>
}
```

**💡 Uso real en el proyecto:**

En `country-list.html`, usamos `$index` para enumerar las filas:

```html
@for (country of countries(); track $index; let i = $index) {
<tr>
  <td>{{ i + 1 }}</td>
  <!-- Muestra 1, 2, 3... en lugar de 0, 1, 2... -->
  <td>{{ country.flag }}</td>
  <td>{{ country.name }}</td>
</tr>
}
```

**d) @for con @empty:**

```html
@for (country of countries(); track country.cca2) {
<div>{{ country.name }}</div>
} @empty {
<p>No se encontraron países</p>
}
```

**e) @switch (para múltiples condiciones):**

```html
@switch (status()) { @case ('loading') {
<span class="loading"></span>
} @case ('error') {
<div class="alert alert-error">Error</div>
} @case ('success') {
<div>Éxito</div>
} @default {
<p>Estado desconocido</p>
} }
```

### 4. Event Binding

```html
<input (keyup.enter)="handleSearch()" />
```

**`(keyup.enter)`:**

- Escucha eventos del DOM
- `.enter` es un **key filter** (solo se ejecuta si presionas Enter)
- Otros ejemplos: `(click)`, `(input)`, `(keyup.escape)`

### 5. Property Binding

```html
<img [src]="country.flagSVG" [alt]="country.name" />
```

**`[src]`:**

- Enlaza una **propiedad del elemento** con una variable del componente
- Es dinámico (se actualiza automáticamente)

**🆚 Sin corchetes:**

```html
<img src="country.flagSVG" />
<!-- ❌ Busca el archivo literal "country.flagSVG" -->
<img [src]="country.flagSVG" />
<!-- ✅ Usa el valor de la variable -->
```

### 6. RouterLink y RouterLinkActive

**a) RouterLink básico:**

```html
<a routerLink="/country/by-capital">By Capital</a>
```

**b) RouterLink con array (rutas dinámicas):**

```html
<!-- Forma tradicional: concatenación de string -->
<a [routerLink]="'/country/by/' + country.cca2">More info</a>

<!-- ✅ Forma recomendada: array de segmentos -->
<a [routerLink]="['/country/by', country.cca2]">More info</a>
```

**Ventajas del array:**

- ✅ Más legible
- ✅ Maneja caracteres especiales automáticamente
- ✅ Type-safe (TypeScript puede validar)
- ✅ No necesitas preocuparte por barras (`/`)

**Ejemplo real del proyecto:**

En `country-list.html`, cada país tiene un link a su página de detalles:

```html
@for (country of countries(); track $index; let i = $index) {
<tr>
  <td>{{ country.name }}</td>
  <td>
    <a [routerLink]="['/country/by', country.cca2]" class="link-primary"> More info </a>
  </td>
</tr>
}
```

Esto genera URLs como:

- `/country/by/ARG` (Argentina)
- `/country/by/MEX` (México)
- `/country/by/USA` (Estados Unidos)

**c) RouterLinkActive (resaltar ruta activa):**

```html
<a routerLink="/country/by-capital" routerLinkActive="btn-primary"> By Capital </a>
```

**`routerLinkActive`:**

- Agrega una clase CSS cuando la ruta está activa
- Útil para resaltar el menú activo
- Soporta múltiples clases: `routerLinkActive="active primary"`

**💡 Nota:** Para usar `routerLink`, debes importar `RouterLink` en el componente:

```typescript
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
})
```

### 7. Pipes

```html
<td>{{ country.population | number }}</td>
```

**`| number`:**

- Transforma datos en el template
- `number`: Formatea números con separadores de miles
- Ejemplos:
  - `1234567` → `1,234,567`
  - `{{ date | date:'short' }}` → `12/31/23, 11:59 PM`
  - `{{ text | uppercase }}` → `HELLO WORLD`

**Importación necesaria:**

```typescript
import { DecimalPipe } from '@angular/common';

@Component({
  imports: [DecimalPipe],
})
```

### 8. Effect - Ejecutar código reactivo

**`effect()`** es una función que ejecuta código automáticamente **cuando los signals que usa cambian**.

```typescript
import { effect, signal } from '@angular/core';

export class MyComponent {
  count = signal(0);

  // ✅ El effect se ejecuta cada vez que count cambia
  countEffect = effect(() => {
    console.log('Count ahora es:', this.count());
  });
}
```

**Casos de uso:**

1. **Logging:**

```typescript
debugEffect = effect(() => {
  console.log('El query es:', this.query());
});
```

2. **Guardar en localStorage:**

```typescript
saveEffect = effect(() => {
  localStorage.setItem('search', this.query());
});
```

3. **Debouncing (usado en este proyecto):**

```typescript
debounceEffect = effect((onCleanup) => {
  const value = this.inputValue();
  const timeout = setTimeout(() => {
    this.handleSearch(value);
  }, this.debounceTime());

  // Limpiar timeout anterior si el effect se ejecuta nuevamente
  onCleanup(() => clearTimeout(timeout));
});
```

**Parámetro `onCleanup`:**

El `effect` recibe un parámetro `onCleanup(fn)` que se ejecuta:

- **Antes** de que el effect se ejecute nuevamente
- **Al destruir** el componente

Perfecto para limpiar resources (timeouts, subscripciones, listeners).

**Diferencia entre effect y constructor:**

| Aspecto              | Constructor         | Effect                     |
| -------------------- | ------------------- | -------------------------- |
| **Ejecución**        | Una sola vez (init) | Cada vez que signal cambia |
| **Reactivo**         | ❌ No               | ✅ Sí                      |
| **Acceso a signals** | ⚠️ Cuidado (timing) | ✅ Seguro                  |
| **Cleanup**          | Manual              | `onCleanup` automático     |

---

### 9. firstValueFrom (RxJS)

```typescript
import { firstValueFrom } from 'rxjs';

const result = await firstValueFrom(observable$);
```

**`firstValueFrom()`:**

- Convierte un **Observable** en una **Promise**
- Toma el **primer valor** emitido y completa
- Se usa con `await` en funciones `async`
- Perfecto para peticiones HTTP (que emiten un solo valor)

**🆚 Alternativas en RxJS:**

```typescript
// firstValueFrom - Toma el primer valor
const first = await firstValueFrom(http.get('/api'));

// lastValueFrom - Toma el último valor antes de completar
const last = await lastValueFrom(observable$);

// toPromise() - Deprecado, no usar
const result = await observable$.toPromise(); // ❌ Deprecado
```

**Uso en Resources:**

```typescript
loader: async ({ params }) => {
  // Convierte el Observable del servicio en Promise
  return await firstValueFrom(this.countryService.searchByCapital(params.query));
};
```

**Manejo de errores:**

```typescript
// Si el Observable emite un error, firstValueFrom lanza una excepción
try {
  const data = await firstValueFrom(http.get('/api'));
} catch (error) {
  console.error('Error:', error);
}
```

---

## 🚀 Cómo ejecutar el proyecto

### Instalación:

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# La app estará disponible en http://localhost:4200
```

### Comandos disponibles:

```bash
npm start        # Iniciar servidor de desarrollo
npm run build    # Compilar para producción
npm test         # Ejecutar tests unitarios
npm run watch    # Compilar en modo watch
```

---

## 📚 Recursos Adicionales

### Documentación oficial:

- [Angular Docs](https://angular.dev/)
- [Angular Resources API](https://angular.dev/guide/signals/resource) 🆕
- [RxJS Docs](https://rxjs.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/)
- [DaisyUI Docs](https://daisyui.com/)

### API utilizada:

- [REST Countries API](https://restcountries.com/)

### Conceptos avanzados para estudiar después:

**Signals y reactividad:**

- Signals avanzados (computed, effect)
- linked() para signals relacionados
- rxResource() para integración avanzada con RxJS

**HTTP y servicios:**

- Interceptores HTTP
- Retry strategies
- Caching strategies
- Request/Response transformation

**Routing:**

- Guards de rutas (canActivate, canDeactivate)
- Resolvers (pre-carga de datos)
- Route animations

**Otras características:**

- Directivas personalizadas
- Custom pipes
- Dependency Injection avanzado
- Testing con Jasmine/Karma
- Server-Side Rendering (SSR)
- State Management (NgRx, Signals Store)

---

## 💡 Tips de Estudio

1. **Practica cada concepto por separado**: Crea ejemplos simples de cada patrón
2. **Modifica el código**: Cambia cosas y observa qué sucede
3. **Lee los errores**: Los mensajes de error de Angular son muy descriptivos
4. **Usa Angular DevTools**: Extensión de Chrome para debugging
5. **Explora la API**: Prueba diferentes endpoints de REST Countries
6. **Compara versiones**: Ve cómo evolucionó Angular (@Input vs Signals)

---

## 🎯 Resumen de Conceptos Aprendidos

✅ **Configuración y herramientas**

- TailwindCSS + DaisyUI
- Angular standalone components
- Zoneless change detection

✅ **Arquitectura**

- Feature modules
- Lazy loading
- Layout pattern
- Container/Presentational pattern

✅ **Rutas**

- Rutas principales y anidadas
- Rutas dinámicas con parámetros
- Lazy loading de módulos
- Exportación por defecto
- RouterLink (navegación programática con arrays)
- RouterLinkActive (resaltar rutas activas)

✅ **Componentes**

- Input/Output signals
- Template reference variables
- Event/Property binding
- Change detection strategy
- Control flow syntax (@if, @for, @else) 🆕
- Variables de contexto en @for ($index, $first, $last, $even, $odd, $count)

✅ **Estado**

- Signals (set, update, computed)
- Signals vs Observables
- Estado local del componente
- Estado reactivo con Resources 🆕

✅ **HTTP y Servicios**

- HttpClient con fetch
- Observable + RxJS operators (map, catchError, tap, of)
- Inyección de dependencias
- Patrón Repository

✅ **Optimizaciones Avanzadas** 🆕

- Debouncing con `effect` y `setTimeout`
- Caching simple con `Map<K, V>`
- `linkedSignal` para sincronización ruta ↔ componente
- Mejora de performance y UX

✅ **Signals Avanzados** 🆕

- `linkedSignal()` - Sincronización automática
- `effect()` - Código reactivo con cleanup
- State mutations vs reactivity

✅ **Resources API (Angular 19+)** 🆕

- Resource creation con params y loader
- Gestión automática de estados (loading, error, value)
- Cancelación automática de peticiones
- firstValueFrom para convertir Observable a Promise
- Enfoque declarativo vs imperativo
- Comparativa con enfoque clásico (Observable + Subscribe)

✅ **Manejo de errores**

- catchError en servicios (enfoque clásico)
- Error handling en subscribe (enfoque clásico)
- Gestión automática de errores con Resources (enfoque moderno)
- Estados de carga (loading, error, success) en ambos enfoques

✅ **Patrones de diseño**

- Mapper pattern
- Singleton services
- Reactive programming con RxJS

---
