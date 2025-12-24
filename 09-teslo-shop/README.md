# 🛍️ Teslo Shop - Proyecto Angular

## 📋 Introducción

Este proyecto es una aplicación de e-commerce desarrollada en Angular que implementa conceptos avanzados del framework. La aplicación simula una tienda online con autenticación de usuarios, gestión de productos, paginación y rutas protegidas. Este README sirve como guía de estudio detallada de todos los conceptos implementados.

## 🎯 Conceptos Principales

### 1. **Guards (Guardias de Rutas)**

Los Guards son funciones que permiten proteger rutas y controlar el acceso a diferentes secciones de la aplicación.

#### CanMatchFn - NotAuthenticatedGuard

El guard `NotAuthenticatedGuard` evita que usuarios autenticados accedan a las rutas de autenticación (login/register):

```typescript
export const NotAuthenticatedGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authService.checkAuthStatus());
  if (isAuthenticated) {
    await router.navigateByUrl('/');
    return false;
  }
  return true;
};
```

**Puntos clave:**

- Utiliza `CanMatchFn` que es la nueva forma funcional de guards en Angular
- Es **asíncrono** (`async`) para poder esperar la verificación del estado de autenticación
- Usa `inject()` para inyectar dependencias (patrón funcional)
- `firstValueFrom()` convierte un Observable en una Promise
- Si el usuario está autenticado, redirige a la página principal y retorna `false` (bloquea la ruta)
- Se aplica con `canMatch` en las rutas:

```typescript
{
  path: 'auth',
  loadChildren: () => import('./auth/auth.routes').then((m) => m.default),
  canMatch: [NotAuthenticatedGuard],
}
```

### 2. **HTTP Interceptors**

Los interceptores permiten interceptar y modificar las peticiones HTTP antes de enviarlas al servidor.

#### logginInterceptor

Este interceptor añade automáticamente el token de autenticación a todas las peticiones HTTP:

```typescript
export function logginInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): ReturnType<HttpHandlerFn> {
  const token = inject(AuthService).token();

  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });

  return next(newReq);
}
```

**Puntos clave:**

- Usa el patrón funcional nuevo de Angular (no es una clase)
- `HttpRequest` es **inmutable**, por eso se debe clonar con `.clone()`
- Añade el header `Authorization` con el formato Bearer Token
- Se registra en `app.config.ts`:

```typescript
provideHttpClient(withFetch(), withInterceptors([logginInterceptor]));
```

### 3. **Layouts y Rutas Lazy Loading**

La aplicación utiliza diferentes layouts para separar la interfaz de autenticación de la tienda.

#### Estructura de Rutas

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.default),
    canMatch: [NotAuthenticatedGuard],
  },
  {
    path: '',
    loadChildren: () => import('./store-front/store-front.routes').then((m) => m.default),
  },
];
```

**Rutas de Autenticación:**

```typescript
// auth.routes.ts
export const authRoutes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: LoginPage },
      { path: 'register', component: RegisterPage },
      { path: '**', redirectTo: 'login' },
    ],
  },
];
```

**Rutas de la Tienda:**

```typescript
// store-front.routes.ts
export const storeFrontRoutes: Routes = [
  {
    path: '',
    component: StoreFrontLayout,
    children: [
      { path: '', component: HomePage },
      { path: 'gender/:gender', component: GenderPage },
      { path: 'product/:idSlug', component: ProductPage },
      { path: '**', component: NotFoundPage },
    ],
  },
];
```

**Puntos clave:**

- **Lazy Loading**: Las rutas se cargan solo cuando se necesitan (`loadChildren`)
- **Layouts**: Componentes que envuelven las páginas hijas (`RouterOutlet`)
- **Rutas hijas**: Se definen con la propiedad `children`
- **Rutas catch-all**: `**` captura rutas no definidas

#### Componentes Layout

Los layouts son componentes simples que contienen un `RouterOutlet`:

```typescript
@Component({
  selector: 'app-store-front-layout',
  imports: [RouterOutlet, FrontNavbar],
  templateUrl: './store-front-layout.html',
})
export class StoreFrontLayout {}
```

### 4. **Sistema de Autenticación**

#### AuthService

Servicio central que maneja todo el estado de autenticación usando **Signals**.

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  authStatus = computed(() => {
    if (this._authStatus() === 'checking') return 'checking';
    return this._user() ? 'authenticated' : 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(() => this._token());
```

**Puntos clave:**

- Usa **Signals** (`signal()`) para manejo de estado reactivo
- Signals privados (`_`) para encapsular el estado interno
- **Computed signals** para valores derivados (solo lectura)
- Estados de autenticación: `'checking'`, `'authenticated'`, `'not-authenticated'`

#### Resource API para Check de Status

```typescript
checkStatusResource = resource({
  loader: async () => lastValueFrom(this.checkAuthStatus()),
});
```

**Puntos clave:**

- **Resource API**: Nueva característica de Angular para manejo de datos asíncronos
- Se ejecuta automáticamente al inyectar el servicio
- `lastValueFrom()` convierte Observable a Promise (similar a firstValueFrom pero espera a que complete)

#### Método Login

```typescript
login(email: string, password: string): Observable<boolean> {
  return this.http.post<AuthResponse>(`${BASE_URL}/auth/login`, { email, password }).pipe(
    tap(({ user, token }) => {
      this.handleLoginSuccess({ user, token });
    }),
    map(() => true),
    catchError((error) => this.handleLoginFailure(error))
  );
}
```

**Puntos clave:**

- Retorna `Observable<boolean>` para facilitar el manejo en el componente
- `tap()` para efectos secundarios (guardar usuario y token)
- `map()` para transformar la respuesta a boolean
- `catchError()` para manejo de errores

### 5. **Paginación**

La paginación se implementa usando un servicio compartido y signals.

#### PaginationService

```typescript
@Injectable({ providedIn: 'root' })
export class PaginationService {
  private activatedRoute = inject(ActivatedRoute);

  currentPage = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map((params) => (params.get('page') ? Number(params.get('page')) : 1)),
      map((page) => (isNaN(page) || page < 1 ? 1 : page))
    ),
    { initialValue: 1 }
  );
}
```

**Puntos clave:**

- `toSignal()` convierte un Observable en Signal
- Lee el parámetro de query `?page=X` de la URL
- Validación: Si no es número o es menor a 1, usa 1 como valor por defecto
- `initialValue` evita que el signal sea `undefined` inicialmente

#### Componente de Paginación

```typescript
export class Pagination {
  currentPage = input<number>(1);
  pages = input<number>(0);
  activePage = linkedSignal(this.currentPage);

  getPagesList = computed(() => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  });
}
```

**Puntos clave:**

- `input()` para propiedades de entrada (nueva sintaxis de Angular)
- `linkedSignal()` crea un signal que se sincroniza con un input signal
- `computed()` para calcular la lista de páginas dinámicamente
- `Array.from()` genera array de números [1, 2, 3, ..., n]

### 6. **Gestión de Productos**

#### ProductsService

Servicio con sistema de caché para optimizar peticiones HTTP.

```typescript
@Injectable({ providedIn: 'root' })
export class ProductsService {
  private http = inject(HttpClient);
  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;
    const key = `${limit}-${offset}-${gender}`;

    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(`${BASE_URL}/products`, {
        params: { limit, offset, gender },
      })
      .pipe(tap((response) => this.productsCache.set(key, response)));
  }
}
```

**Puntos clave:**

- **Map** para almacenar caché de productos
- Clave de caché compuesta: `${limit}-${offset}-${gender}`
- Si existe en caché, retorna `of()` (Observable que emite inmediatamente)
- `tap()` para guardar en caché después de la petición
- **Parámetros HTTP** se pasan como objeto `params`

#### Resource API en Páginas

```typescript
export class GenderPage {
  productResource = resource({
    params: () => ({ gender: this.gender(), page: this.currentPage() - 1 }),
    loader: async ({ params }) => {
      return await firstValueFrom(
        this.productsService.getProducts({
          gender: params.gender,
          offset: params.page * 9,
        })
      );
    },
  });
}
```

**Puntos clave:**

- **Resource API** con parámetros reactivos
- La función `params` se ejecuta cuando cambian los signals
- `loader` se re-ejecuta automáticamente cuando cambian los parámetros
- Convierte Observable a Promise con `firstValueFrom()`

### 7. **Pipes Personalizados**

#### ProductImagePipe

```typescript
@Pipe({ name: 'productImage' })
export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[]): any {
    if (Array.isArray(value)) {
      return value.length > 0 ? `${IMAGE_BASE_URL}${value[0]}` : './assets/images/place-holder.jpg';
    }
    return `${IMAGE_BASE_URL}${value}`;
  }
}
```

**Puntos clave:**

- Maneja tanto strings como arrays de strings
- Si es array, toma la primera imagen
- Fallback a placeholder si no hay imágenes
- Concatena la URL base configurada en environment

### 8. **Reactive Forms**

Implementación en el componente de Login:

```typescript
export class LoginPage {
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => this.hasError.set(false), 3000);
      return;
    }

    const { email = '', password = '' } = this.loginForm.value;
    // ... lógica de login
  }
}
```

**Puntos clave:**

- `nonNullable.group()` garantiza que los valores nunca sean null
- **Validadores síncronos**: `Validators.required`, `Validators.email`, `Validators.minLength()`
- `markAllAsTouched()` muestra todos los errores de validación
- Signals para estado de UI (`hasError`, `isPosting`)
- Destructuring con valores por defecto: `{ email = '', password = '' }`

### 9. **Change Detection Strategy**

```typescript
@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {}
```

**Puntos clave:**

- `OnPush` mejora el rendimiento
- Solo detecta cambios cuando:
  - Cambian los `@Input()`
  - Ocurren eventos en el componente
  - Cambian signals o observables suscritos en el template

### 10. **Zoneless Change Detection**

En la configuración de la aplicación:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    // ...
  ],
};
```

**Puntos clave:**

- Angular funciona sin Zone.js
- Mejora significativa de rendimiento
- Requiere uso de Signals o `OnPush` para detección de cambios
- Es el futuro de Angular (modo por defecto en futuras versiones)

## 🏗️ Arquitectura del Proyecto

```
src/app/
├── auth/                    # Módulo de autenticación
│   ├── guards/             # Guards de protección de rutas
│   ├── interfaces/         # Tipos e interfaces
│   ├── layout/            # Layout de autenticación
│   ├── pages/             # Páginas (login, register)
│   └── services/          # AuthService
│
├── products/               # Módulo de productos
│   ├── components/        # Componentes reutilizables
│   ├── interfaces/        # Tipos de productos
│   ├── pipes/            # Pipes personalizados
│   └── services/         # ProductsService
│
├── shared/                # Módulo compartido
│   ├── components/       # Componentes compartidos
│   └── interceptors/     # HTTP Interceptors
│
└── store-front/          # Módulo de la tienda
    ├── components/       # Navbar, etc.
    ├── layout/          # Layout principal
    └── pages/           # Páginas de la tienda
```

## 🔑 Conceptos Clave de Angular Aprendidos

### Signals (Nuevo Sistema Reactivo)

- **Signals básicos**: Estado mutable reactivo
- **Computed signals**: Valores derivados (solo lectura)
- **LinkedSignals**: Signals sincronizados con inputs
- **toSignal()**: Convertir Observables a Signals

### Resource API

- Manejo declarativo de datos asíncronos
- Re-ejecución automática cuando cambian parámetros
- Reemplazo moderno de observables en componentes

### Inyección Funcional

- `inject()` en lugar de constructor
- Permite inyección en funciones (guards, interceptors)
- Código más limpio y funcional

### Formularios Reactivos

- FormBuilder y FormGroups
- Validadores síncronos y asíncronos
- Manejo de estado del formulario

### Optimización

- Lazy Loading de módulos
- Caché de peticiones HTTP
- OnPush Change Detection
- Zoneless Angular

## 📝 Notas Técnicas Importantes

### LocalStorage y Tokens

- El token se guarda en `localStorage` para persistencia
- Se lee automáticamente al iniciar la aplicación
- Se elimina en el logout

### RxJS Operators Utilizados

- `tap()`: Efectos secundarios sin modificar el stream
- `map()`: Transformar valores
- `catchError()`: Manejo de errores
- `pipe()`: Encadenar operadores
- `firstValueFrom()`: Convertir Observable a Promise (toma el primer valor)
- `lastValueFrom()`: Convertir Observable a Promise (espera a que complete)

### Routing Avanzado

- Parámetros de URL: `:gender`, `:idSlug`
- Query params: `?page=2`
- NavigateByUrl con `replaceUrl` para evitar navegación hacia atrás
- Lazy loading de rutas con `loadChildren`

### TypeScript Features

- **Type Aliases**: `type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated'`
- **Interfaces**: Para tipar respuestas de API
- **Destructuring** con valores por defecto
- **Optional parameters** con `?`
- **Non-null assertion** con `!`

## 🚀 Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm start

# Ejecutar tests
npm test

# Build de producción
npm run build
```

## 🎓 Próximos Pasos de Aprendizaje

1. **State Management**: Implementar NgRx o Signal Store
2. **Testing**: Unit tests y E2E tests
3. **Optimización**: Virtual scrolling, imagen lazy loading
4. **PWA**: Convertir la app en Progressive Web App
5. **SSR**: Server-Side Rendering con Angular Universal

## 📚 Recursos Adicionales

- [Angular Documentation](https://angular.dev)
- [RxJS Documentation](https://rxjs.dev)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Angular Resource API](https://angular.dev/guide/experimental/resource)

---

**Nota**: Este proyecto utiliza Angular en modo **Standalone Components** (sin módulos NgModule), que es el enfoque moderno y recomendado.
