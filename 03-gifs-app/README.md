# Gifs App - Angular

Aplicación de búsqueda y visualización de GIFs utilizando la API de Giphy. Este proyecto sirve como guía de aprendizaje para conceptos fundamentales de Angular.

## Conceptos Implementados

### 1. Configuración de Aplicación (app.config.ts)

#### ¿Qué es app.config.ts?

En Angular moderno (standalone), `app.config.ts` es el archivo donde se configura toda la aplicación. Reemplaza al antiguo `app.module.ts` y permite una configuración más funcional y modular.

**¿Por qué inyectamos dependencias aquí?**

- **Configuración centralizada**: Todos los providers están en un solo lugar
- **Disponibilidad global**: Los servicios configurados aquí están disponibles en toda la app
- **Tree-shaking mejorado**: Angular puede eliminar código no utilizado más eficientemente
- **Composición**: Podemos agregar o quitar features fácilmente

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    // Manejo de errores globales
    provideBrowserGlobalErrorListeners(),

    // Sistema de detección de cambios sin Zone.js (más eficiente)
    provideZonelessChangeDetection(),

    // Sistema de rutas
    provideRouter(routes),

    // Cliente HTTP con Fetch API (más moderno que XMLHttpRequest)
    provideHttpClient(withFetch()),
  ],
};
```

**Flujo de inyección:**

1. Se define en `app.config.ts`
2. Se pasa a `bootstrapApplication()` en `main.ts`
3. Está disponible en toda la aplicación vía inyección de dependencias

### 2. HTTP Client en Angular

#### Configuración

El `HttpClient` es el servicio de Angular para realizar peticiones HTTP. Debe ser configurado a nivel de aplicación.

```typescript
// En app.config.ts
provideHttpClient(withFetch());
```

**`withFetch()`**: Usa la API `fetch()` nativa del navegador en lugar de `XMLHttpRequest`. Beneficios:

- Más moderno y estándar
- Mejor soporte para características modernas (streams, service workers)
- Mejor rendimiento en algunos escenarios

#### Uso en Servicios

```typescript
@Injectable({ providedIn: 'root' })
export class GifService {
  private httpClient = inject(HttpClient);

  loadTrendingGifs() {
    this.httpClient.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: '25',
      },
    });
  }
}
```

**Tipado con TypeScript:**

- `get<GiphyResponse>`: TypeScript sabe exactamente qué estructura tendrá la respuesta
- Autocompletado y verificación de tipos en tiempo de desarrollo
- Menos errores en producción

### 3. Lazy Loading (Carga Diferida)

#### ¿Qué es Lazy Loading?

Es una técnica que carga partes de la aplicación **solo cuando se necesitan**, en lugar de cargar todo al inicio.

#### Comparación: Lazy Loading vs Carga Normal

**Carga Normal (Eager Loading):**

```typescript
import { DashboardPage } from './pages/dashboard-page';

export const routes: Routes = [{ path: 'dashboard', component: DashboardPage }];
```

- ✅ Navegación instantánea (ya está cargado)
- ❌ Bundle inicial grande
- ❌ Tiempo de carga inicial lento
- ❌ Descarga código que quizás nunca se use

**Lazy Loading:**

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./gifs/pages/dashboard-page/dashboard-page'),
  },
];
```

- ✅ Bundle inicial pequeño (~70% más pequeño típicamente)
- ✅ Carga inicial rápida
- ✅ Solo descarga lo que se usa
- ❌ Pequeño delay en primera navegación (milisegundos)

#### Ejemplo Real en este Proyecto

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    // Este componente se carga solo cuando el usuario navega a /dashboard
    loadComponent: () => import('./gifs/pages/dashboard-page/dashboard-page'),
    children: [
      {
        path: 'trending',
        // Este se carga solo al ir a /dashboard/trending
        loadComponent: () => import('./gifs/pages/trending-page/trending-page'),
      },
      {
        path: 'search',
        // Este se carga solo al ir a /dashboard/search
        loadComponent: () => import('./gifs/pages/search-page/search-page'),
      },
    ],
  },
];
```

**Ventajas en nuestra app:**

- El usuario que solo ve trending NO descarga el código de search
- Aplicación carga en ~1 segundo en lugar de ~3 segundos
- Mejor experiencia en conexiones lentas

### 4. Rutas Hijas (Child Routes)

#### ¿Para qué sirven?

Las rutas hijas permiten crear **layouts anidados** donde un componente padre envuelve a componentes hijos que cambian según la ruta.

#### Estructura en este Proyecto

```
/dashboard                    → DashboardPage (padre)
├── /dashboard/trending       → TrendingPage (hijo)
├── /dashboard/search         → SearchPage (hijo)
```

**Componente Padre (DashboardPage):**

```html
<!-- dashboard-page.html -->
<div class="layout">
  <gifs-side-menu></gifs-side-menu>
  <main>
    <!-- Aquí se renderizan los componentes hijos -->
    <router-outlet></router-outlet>
  </main>
</div>
```

**¿Qué se mantiene y qué cambia?**

- **Se mantiene**: `<gifs-side-menu>` (visible en todas las rutas hijas)
- **Cambia**: El contenido del `<router-outlet>` (trending o search)

**Beneficios:**

- No duplicar código (el sidebar está una sola vez)
- Transiciones suaves entre vistas
- Estructura clara y mantenible

### 5. Path Alias de TypeScript

#### ¿Qué problema resuelve?

Sin alias, las importaciones se vuelven difíciles de leer y mantener:

```typescript
// ❌ Sin alias - frágil y difícil de leer
import { environment } from '../../../environments/environment.development';
import { environment } from '../../environments/environment.development';
```

Si mueves el archivo, todas las rutas se rompen.

#### Configuración

**En tsconfig.app.json:**

```json
{
  "compilerOptions": {
    "paths": {
      "@environments/*": ["./src/environments/*"]
    }
  }
}
```

#### Uso

```typescript
// ✅ Con alias - claro y consistente desde cualquier archivo
import { environment } from '@environments/environment.development';
```

**Ventajas:**

- Independiente de la ubicación del archivo
- Más legible y mantenible
- Refactoring más fácil (puedes mover archivos sin romper imports)
- Convención clara para el equipo

### 6. Servicios e Inyección de Dependencias

#### ¿Qué es un Servicio?

Un servicio es una clase que contiene lógica de negocio reutilizable. En Angular, los servicios se inyectan (no se instancian con `new`).

```typescript
@Injectable({ providedIn: 'root' })
export class GifService {
  private httpClient = inject(HttpClient);

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() { ... }
}
```

#### `providedIn: 'root'` - Singleton Pattern

**¿Qué significa?**

- Se crea **UNA SOLA INSTANCIA** del servicio para toda la aplicación
- Angular la crea automáticamente cuando alguien la solicita
- Se destruye cuando se cierra la aplicación

**Ventajas:**

- Compartir estado entre componentes
- Memoria eficiente (no se crean múltiples instancias)
- Tree-shakeable (si no se usa, no se incluye en el bundle)

**Ejemplo de uso:**

```typescript
export default class TrendingPage {
  // Angular inyecta automáticamente la misma instancia
  private gifService = inject(GifService);
}
```

### 7. Interfaces TypeScript para APIs

#### ¿Por qué crear interfaces?

Las APIs externas (como Giphy) retornan JSON. TypeScript no sabe qué estructura tiene ese JSON hasta que creamos una interfaz.

```typescript
export interface GiphyResponse {
  data: GiphyItem[];
  meta: Meta;
  pagination: Pagination;
}

export interface GiphyItem {
  id: string;
  title: string;
  images: Images;
  url: string;
  // ... más propiedades
}
```

#### Beneficios

**1. Autocompletado:**

```typescript
this.httpClient.get<GiphyResponse>(`${url}/trending`)
  .subscribe(response => {
    response.data. // ← IDE sugiere: forEach, map, filter, length...
    response.data[0]. // ← IDE sugiere: id, title, images, url...
  });
```

**2. Detección de errores:**

```typescript
// ❌ TypeScript detecta el error antes de ejecutar
const title = response.data[0].titulo; // Error: 'titulo' no existe en GiphyItem

// ✅ Correcto
const title = response.data[0].title;
```

**3. Documentación:**
La interfaz sirve como documentación de qué datos esperar de la API.

### 8. Variables de Entorno

#### ¿Para qué sirven?

Separar configuraciones según el entorno (desarrollo, producción, testing).

**Archivo: environment.development.ts**

```typescript
export const environment = {
  production: false,
  giphyApiKey: '3xEEWbtohDTUmPod3dVpWRbIlEjkvRF7',
  giphyUrl: 'https://api.giphy.com/v1',
};
```

**Archivo: environment.ts (producción)**

```typescript
export const environment = {
  production: true,
  giphyApiKey: process.env['GIPHY_API_KEY'], // Variable segura
  giphyUrl: 'https://api.giphy.com/v1',
};
```

#### Uso en el Código

```typescript
import { environment } from '@environments/environment.development';

this.httpClient.get(`${environment.giphyUrl}/gifs/trending`, {
  params: { api_key: environment.giphyApiKey },
});
```

**Ventajas:**

- Diferentes configuraciones por entorno
- No exponer credenciales en producción
- Cambiar configuración sin modificar código

### 9. Comunicación entre Componentes: Inputs

#### Patrón Padre → Hijo

En Angular moderno usamos `input()` para recibir datos del componente padre.

**Componente Hijo (GifList):**

```typescript
export class GifList {
  // input.required: Este componente DEBE recibir un array de strings
  gifs = input.required<string[]>();
}
```

**Template del Hijo:**

```html
<div class="grid">
  @for(item of gifs(); track item) {
  <gif-list-item [url]="item" />
  }
</div>
```

**Componente Padre (TrendingPage):**

```typescript
export default class TrendingPage {
  gifs: string[] = [
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image.jpg',
    'https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg',
    // ...
  ];
}
```

**Template del Padre:**

```html
<gif-list [gifs]="gifs" />
```

**Flujo de datos:**

```
TrendingPage (gifs array)
    ↓ [gifs]="gifs"
GifList (recibe via input)
    ↓ @for (itera)
GifListItem (recibe cada URL via [url]="item")
```

**Ventajas:**

- Componentes reutilizables (GifList puede usarse en trending, search, etc.)
- Flujo de datos claro y unidireccional
- Fácil de testear (pasas datos de prueba)

### 10. RxJS: Observables, Pipe y Subscribe

#### ¿Qué son los Observables?

Los Observables son **streams de datos** que pueden emitir valores a lo largo del tiempo. Son la base de la programación reactiva en Angular.

**Analogía:**

- Una promesa es como pedir una pizza (un solo valor)
- Un Observable es como una suscripción de Netflix (múltiples valores en el tiempo)

#### Subscribe: Consumir un Observable

Para recibir los datos de un Observable, necesitas **suscribirte** a él.

```typescript
onSearch(query: string): void {
  this.gifService.loadSearchGifs(query).subscribe((gifs) => {
    // Este callback se ejecuta cuando el Observable emite datos
    this.gifs.set(gifs);
  });
}
```

**¿Cuándo se ejecuta el callback?**
Solo cuando la petición HTTP termina y hay datos disponibles.

#### Pipe: Transformar datos antes de suscribirse

El operador `pipe()` permite **encadenar operadores RxJS** para transformar, filtrar o manipular los datos antes de recibirlos.

```typescript
loadSearchGifs(query: string) {
  return this.httpClient
    .get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: { api_key: environment.giphyApiKey, q: query, limit: '25' }
    })
    .pipe(
      // Operador 1: Extraer solo el array 'data' de la respuesta
      map(({ data }) => data),

      // Operador 2: Transformar cada item usando el mapper
      map((items) => GifMapper.mapGiphyListToGifList(items)),

      // Operador 3: Efecto secundario (guardar en historial)
      tap((items) => {
        this.searchHistory.update((history) => ({
          ...history,
          [query.toLowerCase()]: items,
        }));
      })
    );
}
```

#### Operadores RxJS Comunes

**`map`** - Transforma cada valor emitido:

```typescript
// Entrada: { data: [...], meta: {...} }
map(({ data }) => data);
// Salida: [...]
```

**`tap`** - Ejecuta efectos secundarios SIN modificar el valor:

```typescript
tap((items) => {
  console.log('Datos recibidos:', items);
  // Guardar en localStorage, actualizar estado, etc.
});
// El valor pasa sin cambios al siguiente operador
```

**Flujo completo:**

```
HttpClient.get()
    ↓ emite { data: [...], meta: {...} }
map(extract data)
    ↓ transforma a [GiphyItem, GiphyItem, ...]
map(transform)
    ↓ transforma a [Gif, Gif, ...]
tap(save to history)
    ↓ efecto secundario (sin cambiar el valor)
subscribe()
    ↓ recibe [Gif, Gif, ...]
```

**Ventajas de usar pipe:**

- Código más limpio y declarativo
- Fácil agregar/quitar transformaciones
- Composición de operaciones complejas
- Inmutabilidad (cada operador retorna un nuevo Observable)

### 11. Signals: Estado Reactivo Moderno

#### ¿Qué son los Signals?

Signals son el nuevo sistema de reactividad de Angular que **reemplaza gran parte de RxJS** para el manejo de estado. Son más simples y eficientes.

**Definición básica:**

```typescript
trendingGifs = signal<Gif[]>([]);
```

#### Diferencia: Signals vs Variables Normales

```typescript
// ❌ Variable normal - Angular NO detecta cambios
gifs: Gif[] = [];
this.gifs.push(newGif); // UI no se actualiza

// ✅ Signal - Angular detecta cambios automáticamente
gifs = signal<Gif[]>([]);
this.gifs.set([...this.gifs(), newGif]); // UI se actualiza
```

#### Operaciones con Signals

**Leer un Signal:** Usa `()`

```typescript
const gifs = this.trendingGifs(); // Devuelve el valor actual
```

**Actualizar un Signal:**

1. **`set()`** - Reemplaza completamente:

```typescript
this.trendingGifs.set([gif1, gif2, gif3]);
```

2. **`update()`** - Actualiza basándose en el valor anterior:

```typescript
this.searchHistory.update((history) => ({
  ...history,
  [query]: newGifs,
}));
```

#### Computed Signals: Valores Derivados

Un `computed` es un signal que se calcula **automáticamente** a partir de otros signals.

```typescript
searchHistory = signal<Record<string, Gif[]>>({
  /* ... */
});

// Se recalcula automáticamente cuando searchHistory cambia
searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));
```

**Analogía con Excel:**

- `signal` = Celda con valor (A1 = 5)
- `computed` = Celda con fórmula (B1 = A1 \* 2)
- Si A1 cambia a 10, B1 se actualiza automáticamente a 20

**Ventajas:**

- Lazy evaluation (solo se calcula cuando se lee)
- Memoización (cachea el resultado si las dependencias no cambian)
- No necesitas gestionar suscripciones manualmente

#### Effect: Reaccionar a Cambios

Un `effect` ejecuta código cuando los signals que usa cambian.

```typescript
saveGifsToLocalStorage = effect(() => {
  // Se ejecuta automáticamente cuando searchHistory cambia
  const historyString = JSON.stringify(this.searchHistory());
  localStorage.setItem(GIF_KEYS, historyString);
});
```

**¿Cuándo se ejecuta?**

- Al crear el componente/servicio (primera vez)
- Cada vez que `searchHistory()` cambia

**Casos de uso:**

- Sincronizar con localStorage
- Llamadas a APIs cuando cambia un filtro
- Logging y debugging

### 12. toSignal: Convertir Observables a Signals

#### ¿Para qué sirve?

`toSignal()` convierte un Observable en un Signal, permitiendo usar la API moderna de signals con datos reactivos existentes.

#### Ejemplo: Parámetros de Ruta

```typescript
// ❌ Forma antigua con subscribe (necesitas gestionar la suscripción)
query: string = '';
constructor() {
  inject(ActivatedRoute).params.subscribe((params) => {
    this.query = params['query'];
  });
}

// ✅ Forma moderna con toSignal (sin suscripciones manuales)
query = toSignal(
  inject(ActivatedRoute).params.pipe(
    map((params) => params['query'])
  )
);
```

**Ventajas:**

- No necesitas `.subscribe()` ni `.unsubscribe()`
- Se integra perfectamente con computed y effect
- Código más limpio y menos propenso a memory leaks

#### Uso con Computed

```typescript
query = toSignal(inject(ActivatedRoute).params.pipe(map((p) => p['query'])));

// Se recalcula automáticamente cuando 'query' cambia
gifsByKey = computed(() => {
  return this.gifService.getHistoryGifs(this.query());
});
```

**Flujo:**

```
URL cambia (/history/cats → /history/dogs)
    ↓
ActivatedRoute.params emite nuevo valor
    ↓
toSignal actualiza el signal 'query'
    ↓
computed detecta el cambio y se recalcula
    ↓
UI se actualiza automáticamente
```

### 13. Mapper Pattern: Transformación de Datos

#### ¿Qué es un Mapper?

Un Mapper es una clase que **transforma datos de un formato a otro**. En este proyecto, convierte la respuesta de la API (formato complejo) a un formato simple que usamos en la app.

#### Problema que Resuelve

La API de Giphy retorna MUCHA información que no necesitamos:

```typescript
// API retorna (>50 propiedades):
{
  id: "abc123",
  title: "Cat Dancing",
  images: {
    original: { url: "...", width: 500, height: 500 },
    fixed_height: { url: "...", width: 200, height: 200 },
    fixed_width: { ... },
    // ... 10 tipos más de imágenes
  },
  username: "...",
  rating: "...",
  analytics: { ... },
  // ... muchas más propiedades
}

// Solo necesitamos 3 propiedades:
{
  id: "abc123",
  title: "Cat Dancing",
  url: "..."
}
```

#### Implementación

**Interfaz simplificada:**

```typescript
export interface Gif {
  id: string;
  title: string;
  url: string;
}
```

**Clase Mapper:**

```typescript
export class GifMapper {
  // Transforma un solo item
  static mapGiphyToGif(giphyData: GiphyItem): Gif {
    return {
      id: giphyData.id,
      title: giphyData.title,
      url: giphyData.images.fixed_height.url,
    };
  }

  // Transforma un array de items
  static mapGiphyListToGifList(giphyDataList: GiphyItem[]): Gif[] {
    return giphyDataList.map(this.mapGiphyToGif);
  }
}
```

**Uso en el servicio:**

```typescript
.pipe(
  map(({ data }) => data),
  map((items) => GifMapper.mapGiphyListToGifList(items)),
)
```

#### Ventajas del Mapper Pattern

1. **Separación de responsabilidades**: La lógica de transformación está en un solo lugar
2. **Código más limpio**: El servicio no se llena de transformaciones
3. **Fácil de testear**: Puedes probar el mapper independientemente
4. **Desacoplamiento**: Si la API cambia, solo actualizas el mapper
5. **Type-safe**: TypeScript verifica que la transformación sea correcta

### 14. LocalStorage: Persistencia de Datos

#### ¿Para qué sirve?

LocalStorage permite **guardar datos en el navegador** que persisten incluso después de cerrar la pestaña.

#### Implementación en el Proyecto

**Guardar datos automáticamente:**

```typescript
const GIF_KEYS = 'searchHistory-gifs';

saveGifsToLocalStorage = effect(() => {
  const historyString = JSON.stringify(this.searchHistory());
  localStorage.setItem(GIF_KEYS, historyString);
});
```

**Cargar datos al iniciar:**

```typescript
const loadFromLocalStorage = (): Record<string, Gif[]> => {
  const historyString = localStorage.getItem(GIF_KEYS) ?? '{}';
  const gifs = JSON.parse(historyString);
  return gifs;
};

searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
```

#### Flujo Completo

```
1. Usuario busca "cats"
    ↓
2. loadSearchGifs() obtiene resultados de la API
    ↓
3. tap() actualiza searchHistory signal
    ↓
4. effect() detecta el cambio en searchHistory
    ↓
5. Guarda automáticamente en localStorage
    ↓
6. Usuario cierra el navegador
    ↓
7. Usuario abre la app de nuevo
    ↓
8. loadFromLocalStorage() carga el historial guardado
    ↓
9. searchHistory se inicializa con los datos anteriores
```

**Ventajas:**

- Persistencia sin backend
- Experiencia de usuario mejorada (no pierde su historial)
- Datos disponibles offline

### 15. Parámetros Dinámicos en Rutas

#### ¿Qué son?

Parámetros en la URL que cambian dinámicamente y se usan para cargar contenido específico.

#### Configuración de Ruta

```typescript
{
  path: 'history/:query',
  loadComponent: () => import('./pages/history-page/history-page'),
}
```

`:query` es un parámetro dinámico (puede ser "cats", "dogs", "funny", etc.)

#### Leer Parámetros en el Componente

```typescript
// Inyectar ActivatedRoute
query = toSignal(inject(ActivatedRoute).params.pipe(map((params) => params['query'])));
```

#### Ejemplo de Uso

**URLs:**

- `/history/cats` → `query()` = "cats"
- `/history/dogs` → `query()` = "dogs"
- `/history/funny` → `query()` = "funny"

**Obtener GIFs basados en el parámetro:**

```typescript
gifsByKey = computed(() => {
  return this.gifService.getHistoryGifs(this.query());
});
```

**Navegación programática:**

```typescript
// En el template
<a [routerLink]="['/history', searchTerm]">Ver historial</a>

// Si searchTerm = "cats", navega a /history/cats
```

**Flujo completo:**

```
Usuario hace clic en "Ver búsqueda de cats"
    ↓
Navega a /history/cats
    ↓
ActivatedRoute.params emite { query: 'cats' }
    ↓
toSignal actualiza el signal query()
    ↓
computed recalcula gifsByKey con query() = "cats"
    ↓
Muestra los GIFs de la búsqueda "cats"
```

### 16. Infinite Scroll: Carga Infinita de Contenido

#### ¿Qué es Infinite Scroll?

Es una técnica que **carga más contenido automáticamente** cuando el usuario llega al final de la página, sin necesidad de hacer clic en "Cargar más" o cambiar de página.

**Casos de uso:**

- Feeds de redes sociales (Instagram, Twitter)
- Galerías de imágenes (Pinterest)
- Listas de productos (e-commerce)

#### Componentes del Infinite Scroll

##### 1. viewChild: Referencia a Elementos del DOM

`viewChild` es el equivalente a `useRef` de React. Permite obtener una **referencia directa** a un elemento del DOM o componente hijo.

**En el template:**

```html
<div class="h-screen overflow-y-scroll" (scroll)="onScroll($event)" #goupDiv>
  <!-- Contenido -->
</div>
```

`#goupDiv` es una **template reference variable** (variable de referencia).

**En el componente:**

```typescript
scrollDivRef = viewChild<ElementRef>('goupDiv');
```

**Acceder al elemento nativo:**

```typescript
const scrollDiv = this.scrollDivRef()?.nativeElement;
scrollDiv.scrollTop = 500; // Scroll a posición específica
```

**Diferencias con React:**

```typescript
// React (useRef)
const scrollDivRef = useRef(null);
const element = scrollDivRef.current;

// Angular (viewChild)
scrollDivRef = viewChild<ElementRef>('goupDiv');
const element = this.scrollDivRef()?.nativeElement;
```

##### 2. Event Binding: (scroll)

Los eventos del DOM se pueden escuchar con la sintaxis `(evento)="método($event)"`.

```html
<div (scroll)="onScroll($event)"></div>
```

**`$event`**: Objeto del evento nativo del navegador que contiene información sobre el scroll.

##### 3. Lifecycle Hook: AfterViewInit

`ngAfterViewInit` se ejecuta **después de que la vista del componente se haya inicializado completamente**, es decir, cuando los elementos del DOM ya están disponibles.

```typescript
export default class TrendingPage implements AfterViewInit {
  ngAfterViewInit(): void {
    // Ahora podemos acceder de forma segura al DOM
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (scrollDiv) {
      // Restaurar posición de scroll guardada
      const savedPosition = this.scrollStateService.getTrendingScrollState();
      scrollDiv.scrollTop = savedPosition;
    }
  }
}
```

**¿Por qué usar AfterViewInit?**
Si intentas acceder a `viewChild` en el `constructor()` o `ngOnInit()`, el elemento aún no existe en el DOM y obtendrás `undefined`.

#### Implementación Completa del Infinite Scroll

##### Servicio: Gestión del Estado

```typescript
@Injectable({ providedIn: 'root' })
export class GifService {
  trendingGifs = signal<Gif[]>([]);
  isTrendingLoading = signal(false); // Prevenir llamadas duplicadas
  private trendingPage = signal(0); // Paginación

  loadTrendingGifs() {
    // Evitar múltiples peticiones simultáneas
    if (this.isTrendingLoading()) return;
    this.isTrendingLoading.set(true);

    this.httpClient
      .get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
        params: {
          api_key: environment.giphyApiKey,
          limit: '25',
          offset: (this.trendingPage() * 25).toString(), // Paginación
        },
      })
      .subscribe((response) => {
        const gifs = GifMapper.mapGiphyListToGifList(response.data);

        // Agregar nuevos GIFs al array existente (no reemplazar)
        this.trendingGifs.update((currentGifs) => [...currentGifs, ...gifs]);

        this.isTrendingLoading.set(false);
        this.trendingPage.update((page) => page + 1); // Siguiente página
      });
  }
}
```

**Conceptos clave:**

- **offset**: Indica desde qué posición cargar (0, 25, 50, 75...)
- **update() con spread**: Agrega nuevos items sin perder los anteriores
- **isTrendingLoading**: Evita que se disparen múltiples peticiones

##### Componente: Detección del Scroll

```typescript
export default class TrendingPage implements AfterViewInit {
  gifService = inject(GifService);
  scrollStateService = inject(ScrollStateService);
  scrollDivRef = viewChild<ElementRef>('goupDiv');

  onScroll($event: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if (!scrollDiv) return;

    // Propiedades del scroll
    const { scrollTop, scrollHeight, clientHeight } = scrollDiv;

    // Guardar posición actual
    this.scrollStateService.setTrendingScrollState(scrollTop);

    // Detectar si está cerca del final (300px antes del final)
    if (scrollTop + clientHeight >= scrollHeight - 300) {
      this.gifService.loadTrendingGifs(); // Cargar más GIFs
    }
  }
}
```

**Propiedades de scroll:**

- **scrollTop**: Píxeles scrolleados desde el inicio
- **scrollHeight**: Altura total del contenido (incluyendo lo oculto)
- **clientHeight**: Altura visible del contenedor

**Fórmula de detección:**

```typescript
scrollTop + clientHeight >= scrollHeight - 300;
```

```
┌─────────────────┐  ← scrollTop = 0
│                 │
│                 │
│   Contenido     │  ← scrollHeight = 2000px
│    visible      │
│                 │  ← clientHeight = 500px
├─────────────────┤  ← scrollTop = 1500px (posición actual)
│                 │
│   Contenido     │
│    oculto       │
│    (abajo)      │
│                 │
└─────────────────┘  ← scrollHeight = 2000px (final)

Cuando: 1500 + 500 >= 2000 - 300
        2000 >= 1700 ✅ → Cargar más contenido
```

##### Servicio: Persistencia de Posición de Scroll

```typescript
@Injectable({ providedIn: 'root' })
export class ScrollStateService {
  private trendingScrollState = signal(0);

  setTrendingScrollState(position: number) {
    this.trendingScrollState.set(position);
  }

  getTrendingScrollState() {
    return this.trendingScrollState();
  }
}
```

**¿Para qué sirve?**
Cuando navegas a otra página y regresas, el scroll vuelve al inicio. Este servicio **guarda la posición** para restaurarla.

#### Flujo Completo del Infinite Scroll

```
1. Usuario hace scroll hacia abajo
    ↓
2. Evento (scroll) dispara onScroll($event)
    ↓
3. Calcula: scrollTop + clientHeight >= scrollHeight - 300
    ↓
4. Si está cerca del final → loadTrendingGifs()
    ↓
5. Verifica: if (isTrendingLoading()) return; (evitar duplicados)
    ↓
6. Hace petición HTTP con offset = page * 25
    ↓
7. Recibe nuevos 25 GIFs
    ↓
8. update((current) => [...current, ...newGifs])
    ↓
9. UI se actualiza automáticamente (signals)
    ↓
10. Usuario sigue scrolleando → repite el ciclo
```

#### Optimizaciones Implementadas

**1. Prevenir llamadas duplicadas:**

```typescript
if (this.isTrendingLoading()) return;
```

**2. Pre-cargar antes del final:**

```typescript
scrollHeight - 300; // Carga 300px antes de llegar al final
```

**3. Guardar estado del scroll:**

```typescript
ngAfterViewInit() {
  const savedPosition = this.scrollStateService.getTrendingScrollState();
  scrollDiv.scrollTop = savedPosition;
}
```

**4. Computed para organizar en columnas:**

```typescript
trendingGifsGroups = computed<Gif[][]>(() => {
  const group: Gif[][] = [];
  for (let i = 0; i < this.trendingGifs().length; i += 3) {
    group.push(this.trendingGifs().slice(i, i + 3));
  }
  return group;
});
```

Organiza los GIFs en grupos de 3 para un grid responsivo tipo Masonry.

#### Ventajas del Infinite Scroll

✅ **Mejor UX**: No interrumpe el flujo del usuario
✅ **Carga progresiva**: No descarga todo de golpe
✅ **Responsivo**: Funciona en móviles con scroll táctil
✅ **Eficiente**: Solo carga cuando es necesario

#### Consideraciones

⚠️ **Accesibilidad**: Dificulta llegar al footer
⚠️ **Performance**: Con muchos elementos, puede volverse lento
⚠️ **SEO**: Contenido cargado dinámicamente no es indexado
⚠️ **Historial**: El botón "atrás" puede ser confuso

### 17. Arquitectura de Componentes

Estructura modular organizada por features:

```
app/
├── gifs/                          # Feature module - GIFs
│   ├── components/                # Componentes reutilizables
│   │   ├── gif-list/             # Lista de GIFs
│   │   ├── gif-list-item/        # Item individual
│   │   └── side-menu/            # Menú lateral
│   ├── pages/                     # Componentes de página (rutas)
│   │   ├── dashboard-page/       # Layout principal
│   │   ├── trending-page/        # GIFs trending (con infinite scroll)
│   │   ├── search-page/          # Búsqueda de GIFs
│   │   └── history-page/         # Historial de búsquedas
│   ├── services/                  # Lógica de negocio
│   │   └── gifs.service.ts       # Peticiones HTTP y estado de GIFs
│   ├── interfaces/                # Tipos TypeScript
│   │   ├── giphy.interface.ts    # Respuesta de API de Giphy
│   │   └── gif.interface.ts      # Modelo simplificado
│   └── mapper/                    # Transformación de datos
│       └── gif.mapper.ts         # Giphy → Gif
│
└── shared/                        # Código compartido
    └── services/
        └── scroll-state.service.ts  # Persistencia de scroll
```

**Principios aplicados:**

- **Separación de responsabilidades**: Pages, components, services tienen roles distintos
- **Reusabilidad**: Components pueden usarse en múltiples pages
- **Escalabilidad**: Fácil agregar nuevas features sin afectar las existentes
- **Shared**: Código reutilizable entre diferentes features

---

## Ejecutar el Proyecto

```bash
npm install
npm start
```

La aplicación estará disponible en `http://localhost:4200`
