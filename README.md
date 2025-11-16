# 📚 Curso Angular - De cero a experto

Repositorio de proyectos desarrollados durante el curso **"Angular: De cero a experto edición 2025"** de Fernando Herrera. Esta colección contiene ejercicios prácticos y aplicaciones que cubren los conceptos fundamentales y avanzados de Angular.

## 🎯 ¿Qué es Angular?

Angular es un framework de desarrollo web de código abierto mantenido por Google. Permite crear aplicaciones web de una sola página (SPA) dinámicas, escalables y mantenibles utilizando TypeScript como lenguaje principal.

### Características principales

- **Basado en componentes**: La interfaz se divide en componentes reutilizables e independientes
- **TypeScript**: Proporciona tipado estático, mejorando la detección de errores y la mantenibilidad
- **Two-way data binding**: Sincronización automática entre el modelo y la vista
- **Inyección de dependencias**: Sistema robusto para gestionar servicios y dependencias
- **Routing**: Sistema de navegación integrado para crear aplicaciones SPA
- **Reactive programming**: Soporte nativo para RxJS y programación reactiva
- **CLI potente**: Herramientas de línea de comandos para automatizar tareas

## 🛠️ Instalación

### Requisitos previos

- **Node.js** (versión LTS recomendada): [Descargar Node.js](https://nodejs.org/)
- **npm** (se instala automáticamente con Node.js)

### Instalar Angular CLI

Angular CLI (Command Line Interface) es una herramienta de línea de comandos que facilita la creación, desarrollo y mantenimiento de aplicaciones Angular. Permite generar proyectos, componentes, servicios, módulos y más con comandos simples.

Para instalar Angular CLI globalmente en tu sistema:

```bash
npm install -g @angular/cli
```

Verifica la instalación:

```bash
ng version
```

## 🚀 Crear un nuevo proyecto

Para crear un nuevo proyecto Angular:

```bash
ng new nombre-proyecto
```

El CLI te preguntará:
- Si deseas agregar Angular routing (recomendado: sí)
- Qué formato de estilos prefieres (CSS, SCSS, SASS, LESS)

Navega al directorio del proyecto:

```bash
cd nombre-proyecto
```

Inicia el servidor de desarrollo:

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200/`

## 📂 Comandos útiles del CLI

| Comando | Descripción |
|---------|-------------|
| `ng new <nombre>` | Crea un nuevo proyecto Angular |
| `ng serve` | Inicia el servidor de desarrollo |
| `ng generate component <nombre>` | Genera un nuevo componente |
| `ng generate service <nombre>` | Genera un nuevo servicio |
| `ng generate module <nombre>` | Genera un nuevo módulo |
| `ng build` | Compila la aplicación para producción |
| `ng test` | Ejecuta las pruebas unitarias |

## 📖 Estructura de un proyecto Angular

```
proyecto-angular/
├── src/
│   ├── app/              # Componentes y lógica de la aplicación
│   │   ├── components/   # Componentes reutilizables
│   │   ├── services/     # Servicios (lógica de negocio)
│   │   ├── models/       # Interfaces y modelos de datos
│   │   └── app.component.ts
│   ├── assets/           # Recursos estáticos (imágenes, fonts)
│   ├── environments/     # Configuraciones por entorno
│   └── index.html        # Página HTML principal
├── angular.json          # Configuración del proyecto
├── package.json          # Dependencias del proyecto
└── tsconfig.json         # Configuración de TypeScript
```

## 🎓 Sobre el curso

Este repositorio contiene los proyectos desarrollados siguiendo el curso de **Fernando Herrera**, que cubre desde los conceptos básicos hasta técnicas avanzadas de Angular, incluyendo:

- Fundamentos de TypeScript y Angular
- Componentes, directivas y pipes
- Servicios e inyección de dependencias
- Routing y navegación
- Formularios (template-driven y reactive)
- Consumo de APIs REST
- State management
- Optimización y buenas prácticas

## 📝 Licencia

Este repositorio es de carácter educativo y los proyectos están desarrollados con fines de aprendizaje.

---

⭐ Si este repositorio te resulta útil, no olvides darle una estrella
