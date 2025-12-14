# 🔄 Lifecycle Hooks App - Notas del Curso de Angular

> **Sección 7**: Hooks del Ciclo de Vida en Angular  
> Este proyecto es una aplicación educativa que demuestra todos los lifecycle hooks disponibles en Angular, así como los efectos y la detección de cambios.

---

## 📚 Tabla de Contenidos

1. [¿Qué son los Lifecycle Hooks?](#-qué-son-los-lifecycle-hooks)
2. [Lista Completa de Lifecycle Hooks](#-lista-completa-de-lifecycle-hooks)
3. [Orden de Ejecución](#-orden-de-ejecución)
4. [Effects y Render Hooks](#-effects-y-render-hooks)
5. [Change Detection Strategy](#-change-detection-strategy)
6. [Signals vs Propiedades Tradicionales](#-signals-vs-propiedades-tradicionales)
7. [Implementación en el Proyecto](#-implementación-en-el-proyecto)
8. [Comandos de Desarrollo](#-comandos-de-desarrollo)

---

## 🎯 ¿Qué son los Lifecycle Hooks?

Los **Lifecycle Hooks** son métodos especiales que Angular ejecuta en momentos específicos del ciclo de vida de un componente. Nos permiten ejecutar código en momentos clave como:

- Cuando el componente se crea
- Cuando cambian los inputs
- Cuando se renderiza la vista
- Cuando el componente se destruye

Estos hooks nos dan **control total** sobre el comportamiento de nuestros componentes en cada etapa de su existencia.

### ¿Por qué son importantes?

- **Inicialización**: Configurar datos cuando el componente se crea
- **Limpieza**: Liberar recursos cuando el componente se destruye (subscripciones, timers, etc.)
- **Optimización**: Detectar cambios y responder de manera eficiente
- **Sincronización**: Trabajar con el DOM después de que se renderiza
- **Debug**: Entender el flujo de ejecución de la aplicación

---

## 📋 Lista Completa de Lifecycle Hooks

### 1️⃣ **Constructor**

```typescript
constructor() {
  console.log('Constructor llamado...');
}
```

- **¿Cuándo se ejecuta?**: Una vez, después de que Angular inicializa todos los inputs del componente
- **Uso común**: Inyección de dependencias, inicialización de propiedades básicas
- **⚠️ Precaución**: Los `@Input()` aún no están disponibles aquí

### 2️⃣ **ngOnChanges**

```typescript
ngOnChanges(changes: SimpleChanges) {
  console.log('ngOnChanges llamado...', changes);
}
```

- **¿Cuándo se ejecuta?**: Cada vez que cambia un `@Input()` o `input()` signal
- **Parámetro**: Recibe un objeto `SimpleChanges` con los valores anteriores y actuales
- **Uso común**: Reaccionar a cambios en propiedades de entrada
- **📝 Importante**: NO se ejecuta si el componente no tiene inputs

**Ejemplo práctico en `Title` component**:

```typescript
ngOnChanges(changes: SimpleChanges) {
  for (const inputName in changes) {
    const inputValues = changes[inputName];
    console.log(`Previous: ${inputValues.previousValue}`);
    console.log(`Current: ${inputValues.currentValue}`);
    console.log(`Is first change: ${inputValues.firstChange}`);
  }
}
```

### 3️⃣ **ngOnInit**

```typescript
ngOnInit() {
  console.log('ngOnInit llamado...');
}
```

- **¿Cuándo se ejecuta?**: Una vez, después del primer `ngOnChanges`
- **Uso común**: Inicialización del componente, llamadas a servicios, subscripciones
- **✅ Recomendado**: Este es el lugar ideal para la mayor parte de la lógica de inicialización

### 4️⃣ **ngDoCheck**

```typescript
ngDoCheck() {
  console.log('ngDoCheck llamado...');
}
```

- **¿Cuándo se ejecuta?**: En cada ciclo de detección de cambios
- **Uso común**: Detectar cambios que Angular no puede detectar automáticamente
- **⚠️ Cuidado**: Se ejecuta MUY frecuentemente, puede afectar el rendimiento

### 5️⃣ **ngAfterContentInit**

```typescript
ngAfterContentInit() {
  console.log('ngAfterContentInit llamado...');
}
```

- **¿Cuándo se ejecuta?**: Una vez, después de proyectar el contenido externo (`<ng-content>`)
- **Uso común**: Trabajar con contenido proyectado
- **Relacionado con**: `@ContentChild`, `@ContentChildren`

### 6️⃣ **ngAfterContentChecked**

```typescript
ngAfterContentChecked() {
  console.log('ngAfterContentChecked llamado...');
}
```

- **¿Cuándo se ejecuta?**: Después de cada verificación del contenido proyectado
- **Uso común**: Responder a cambios en el contenido proyectado

### 7️⃣ **ngAfterViewInit**

```typescript
ngAfterViewInit() {
  console.log('ngAfterViewInit llamado...');
}
```

- **¿Cuándo se ejecuta?**: Una vez, después de inicializar la vista del componente y sus hijos
- **Uso común**: Manipulación del DOM, inicialización de librerías externas
- **Relacionado con**: `@ViewChild`, `@ViewChildren`
- **📝 Nota**: Aquí ya puedes acceder de forma segura a elementos del DOM

### 8️⃣ **ngAfterViewChecked**

```typescript
ngAfterViewChecked() {
  console.log('ngAfterViewChecked llamado...');
}
```

- **¿Cuándo se ejecuta?**: Después de cada verificación de la vista del componente
- **⚠️ Cuidado**: Se ejecuta frecuentemente, usar con precaución

### 9️⃣ **ngOnDestroy**

```typescript
ngOnDestroy() {
  console.log('ngOnDestroy llamado...');
}
```

- **¿Cuándo se ejecuta?**: Justo antes de que Angular destruya el componente
- **Uso común**: **MUY IMPORTANTE** - Limpieza de recursos
  - Cancelar subscripciones
  - Detener timers/intervals
  - Remover event listeners
  - Limpiar referencias para evitar memory leaks

**Ejemplo de limpieza**:

```typescript
ngOnDestroy() {
  this.subscription.unsubscribe();
  clearInterval(this.intervalId);
}
```

---

## ⏱️ Orden de Ejecución

Cuando un componente se crea y renderiza, los hooks se ejecutan en este orden:

```
1. Constructor
2. ngOnChanges (si tiene @Input)
3. ngOnInit
4. ngDoCheck
5. ngAfterContentInit
6. ngAfterContentChecked
7. ngAfterViewInit
8. ngAfterViewChecked
   ↓
   [El componente está activo]
   ↓
9. ngDoCheck (en cada detección de cambios)
10. ngAfterContentChecked (en cada detección de cambios)
11. ngAfterViewChecked (en cada detección de cambios)
    ↓
    [Cuando el componente se destruye]
    ↓
12. ngOnDestroy
```

**🔍 Para ver esto en acción**: Abre la consola del navegador y navega por la aplicación. Verás los logs mostrando el orden exacto de ejecución.

---

## ⚡ Effects y Render Hooks

Angular moderno introduce nuevos conceptos para trabajar con signals y el renderizado:

### **effect()** - Efectos Reactivos

```typescript
bassicEffect = effect((onCleanup) => {
  console.log('Effect ejecutado...');

  // Se ejecuta automáticamente cuando cambia una signal usada aquí
  console.log(this.signalProperty());

  // Cleanup se ejecuta antes de la próxima ejecución
  onCleanup(() => {
    console.log('Limpiando...');
  });
});
```

**Características**:

- Se ejecuta inmediatamente después de la creación
- Se re-ejecuta cuando cambia cualquier signal que use
- Es **reactivo** - Angular trackea automáticamente las signals
- Incluye un callback `onCleanup` para limpieza

### **afterNextRender()** - Después del Siguiente Render

```typescript
afterNextRenderEffect = afterNextRender(() => {
  console.log('afterNextRender ejecutado...');
  // Acceso seguro al DOM
  const element = document.querySelector('.my-element');
});
```

**Características**:

- Se ejecuta **UNA VEZ** la próxima vez que todos los componentes se rendericen al DOM
- Útil para operaciones únicas que necesitan el DOM completo
- Similar a `ngAfterViewInit` pero más específico

### **afterEveryRender()** - Después de Cada Render

```typescript
afterEveryRenderEffect = afterEveryRender(() => {
  console.log('afterEveryRender ejecutado...');
});
```

**Características**:

- Se ejecuta **CADA VEZ** que todos los componentes se renderizan
- ⚠️ Cuidado: Puede afectar el rendimiento
- Útil para sincronización continua con el DOM

**📊 Comparación**:
| Hook | Frecuencia | Uso Principal |
|------|-----------|---------------|
| `effect()` | Cuando cambian signals | Reactividad con signals |
| `afterNextRender()` | Una vez | Inicialización del DOM |
| `afterEveryRender()` | Cada render | Sincronización continua |

---

## 🎨 Change Detection Strategy

### ¿Qué es Change Detection?

Angular necesita saber cuándo actualizar la vista (el HTML) cuando cambian los datos. Este proceso se llama **Change Detection**.

### Estrategias Disponibles

#### 1. **Default** (Por defecto)

```typescript
@Component({
  selector: 'app-example',
  // No se especifica changeDetection
})
```

- Angular verifica el componente en cada ciclo de detección de cambios
- Más seguro pero menos eficiente
- Verifica todos los componentes del árbol

#### 2. **OnPush** (Optimizado)

```typescript
@Component({
  selector: 'app-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

- Angular solo verifica el componente cuando:
  - Cambia un `@Input()`
  - Se dispara un evento en el componente
  - Un observable emite (con async pipe)
  - Se llama manualmente a `markForCheck()`
- **Mucho más eficiente** para aplicaciones grandes
- Requiere inmutabilidad en los datos

**En este proyecto**: Usamos `OnPush` en `Title` y `NavBar` porque son componentes que solo cambian cuando cambian sus inputs.

### ¿Cuándo usar OnPush?

✅ **Usar OnPush cuando**:

- El componente solo depende de sus inputs
- Trabajas con signals o observables
- Quieres optimizar el rendimiento

❌ **No usar OnPush cuando**:

- El componente modifica datos internos frecuentemente
- Usas variables globales o servicios sin observables
- Estás aprendiendo (empezar con Default es más fácil)

---

## 💡 Signals vs Propiedades Tradicionales

Este proyecto demuestra la diferencia entre las dos formas de manejar datos en Angular:

### Propiedades Tradicionales

```typescript
tradicionalProperty = 'Valor inicial';

changeTradicionalProperty() {
  this.tradicionalProperty = 'Nuevo valor';
  // Angular detecta el cambio en el siguiente ciclo
}
```

**Características**:

- No son reactivas por sí mismas
- Angular detecta cambios mediante Zone.js
- Pueden causar verificaciones innecesarias

### Signals (Nuevo en Angular 16+)

```typescript
signalProperty = signal('Valor inicial');

changeSignalProperty() {
  this.signalProperty.set('Nuevo valor');
  // Angular sabe exactamente qué cambió
}
```

**Características**:

- Son **primitivas reactivas**
- Angular trackea automáticamente las dependencias
- Mejor rendimiento
- Más explícitas y predecibles

**En el template**:

```html
<!-- Tradicional -->
<h3>{{ tradicionalProperty }}</h3>

<!-- Signal (nota los paréntesis) -->
<h3>{{ signalProperty() }}</h3>
```

### Input Signals

```typescript
// Forma tradicional
@Input() titulo: string = '';

// Forma moderna con signals
titulo = input.required<string>();
```

**Ventajas de input signals**:

- Type-safety mejorado
- `required` es explícito en el código
- Se integra mejor con `effect()`
- Más consistente con el modelo reactivo

---

## 🏗️ Implementación en el Proyecto

### Estructura del Proyecto

```
src/app/
├── components/
│   ├── nav-bar/          # Navegación (OnPush)
│   └── title/            # Título con ngOnChanges (OnPush)
├── pages/
│   ├── home-page/        # Página principal con TODOS los hooks
│   ├── about-page/       # Página simple
│   └── contact-page/     # Página simple
├── app.ts                # Componente raíz
└── app.routes.ts         # Configuración de rutas
```

### HomePage - El Laboratorio de Hooks

El componente `HomePage` es donde se implementan TODOS los lifecycle hooks para propósitos educativos:

```typescript
export class HomePage {
  // Constructor
  constructor() {}

  // Propiedades para demostrar signals
  tradicionalProperty = 'Valor inicial';
  signalProperty = signal('Valor inicial');

  // Todos los lifecycle hooks
  ngOnInit() {}
  ngOnChanges() {}
  ngDoCheck() {}
  ngAfterContentInit() {}
  ngAfterContentChecked() {}
  ngAfterViewInit() {}
  ngAfterViewChecked() {}
  ngOnDestroy() {}

  // Effects modernos
  bassicEffect = effect(() => {});
  afterNextRenderEffect = afterNextRender(() => {});
  afterEveryRenderEffect = afterEveryRender(() => {});
}
```

### Title Component - Detectando Cambios en Inputs

```typescript
export class Title implements OnChanges {
  titulo = input.required<string>();

  ngOnChanges(changes: SimpleChanges) {
    // Muestra información detallada sobre los cambios
    for (const inputName in changes) {
      const inputValues = changes[inputName];
      console.log(`Previous: ${inputValues.previousValue}`);
      console.log(`Current: ${inputValues.currentValue}`);
      console.log(`Is first change: ${inputValues.firstChange}`);
    }
  }
}
```

### Función Helper para Logs

```typescript
const log = (...messages: string[]) => {
  console.log(
    `${messages[0]} %c ${messages.slice(1).join(', ')}`,
    'color: #bada55; font-weight: bold;'
  );
};
```

Esta función crea logs con estilo en la consola, facilitando la identificación de cada hook.

---

## 🧪 Experimentos para Aprender

### 1. Observar el Orden de Ejecución

1. Abre la aplicación
2. Abre DevTools (F12)
3. Observa la consola
4. Navega entre páginas
5. Nota el orden de los hooks

### 2. Comparar Signals vs Tradicional

1. En HomePage, haz click en "Update Traditional Property"
2. Observa los logs
3. Haz click en "Update Signal Property"
4. Compara los ciclos de detección de cambios

### 3. Ver ngOnChanges en Acción

1. En HomePage, cambia el signal property
2. Observa cómo `Title` component detecta el cambio
3. Revisa el objeto `SimpleChanges` en la consola

### 4. OnPush vs Default

1. Cambia `changeDetection: ChangeDetectionStrategy.OnPush` a Default en Title
2. Observa la diferencia en los ciclos de detección

---

## 📝 Conceptos Clave para Recordar

### ✅ Mejores Prácticas

1. **Usa ngOnInit para inicialización**, no el constructor
2. **SIEMPRE limpia en ngOnDestroy** (subscripciones, timers, etc.)
3. **Usa OnPush cuando sea posible** para mejor rendimiento
4. **Prefiere Signals** sobre propiedades tradicionales
5. **ngDoCheck y ngAfterViewChecked son costosos**, úsalos con cuidado

### ⚠️ Errores Comunes

1. **No cancelar subscripciones** → Memory leaks
2. **Modificar datos en ngAfterViewChecked** → Bucles infinitos
3. **Acceder al DOM antes de ngAfterViewInit** → Elementos undefined
4. **Confiar en el orden entre componentes hermanos** → No está garantizado
5. **Usar ngDoCheck para todo** → Problemas de rendimiento

### 🎓 Cuándo Usar Cada Hook

| Necesito...                      | Usa...                    |
| -------------------------------- | ------------------------- |
| Inicializar el componente        | `ngOnInit`                |
| Reaccionar a cambios en @Input   | `ngOnChanges`             |
| Acceder al DOM                   | `ngAfterViewInit`         |
| Limpiar recursos                 | `ngOnDestroy`             |
| Trabajar con signals             | `effect()`                |
| Manipular DOM después del render | `afterNextRender()`       |
| Detección custom de cambios      | `ngDoCheck` (con cuidado) |

---

## 🚀 Comandos de Desarrollo

### Iniciar servidor de desarrollo

```bash
ng serve
```

Abre `http://localhost:4200/` - La aplicación se recarga automáticamente con los cambios.

### Generar componente

```bash
ng generate component components/nombre-componente
```

### Build de producción

```bash
ng build
```

Los archivos se generan en `dist/` optimizados para producción.

### Tests

```bash
ng test
```

---

## 🔗 Recursos Adicionales

- [Angular Lifecycle Hooks - Documentación Oficial](https://angular.dev/guide/components/lifecycle)
- [Signals en Angular](https://angular.dev/guide/signals)
- [Change Detection en Profundidad](https://angular.dev/best-practices/runtime-performance)
- [Angular CLI](https://angular.dev/tools/cli)

---

## 📌 Notas Finales

Este proyecto es una **herramienta de aprendizaje**. Los componentes implementan deliberadamente TODOS los hooks para propósitos educativos, aunque en una aplicación real solo usarías los que necesitas.

**Siguiente paso recomendado**: Experimenta modificando el código, agrega nuevos componentes, prueba diferentes estrategias de change detection, y observa cómo cambia el comportamiento de los lifecycle hooks.

---

**Generado con**: Angular CLI version 20.3.10  
**Autor**: Curso de Angular - Sección 7  
**Propósito**: Material educativo sobre Lifecycle Hooks
