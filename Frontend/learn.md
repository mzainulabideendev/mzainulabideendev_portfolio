# 📚 Learning Guide — Portfolio UI

Welcome to the **Portfolio UI** learning guide! This document will help you understand the technologies, architecture, and concepts used in this project so you can contribute confidently or use it as a reference for your own work.

---

## 🧰 Technology Stack

| Technology | Version | Why It's Used |
|-----------|---------|---------------|
| [Angular](https://angular.io/) | 17.3.0 | Core SPA framework with standalone components |
| [TypeScript](https://www.typescriptlang.org/) | 5.4.5 | Typed superset of JavaScript |
| [RxJS](https://rxjs.dev/) | 7.8.0 | Reactive state and async data streams |
| [GSAP](https://greensock.com/gsap/) | 3.12.5 | High-performance animations |
| [Three.js](https://threejs.org/) | 0.162.0 | 3D graphics and particle effects |
| [SCSS](https://sass-lang.com/) | — | Maintainable and modular CSS |

---

## 🏗️ Core Concepts

### 1. Angular Standalone Components (Angular 17)
This project uses Angular's modern standalone component API — no `NgModule` required.

```typescript
@Component({
  standalone: true,
  selector: 'app-hero',
  imports: [CommonModule],
  templateUrl: './hero.component.html',
})
export class HeroComponent { }
```

📖 Learn more: https://angular.io/guide/standalone-components

---

### 2. Lazy Loading Routes
Feature modules are loaded on demand to reduce the initial bundle size.

```typescript
// app.routes.ts
{
  path: 'projects',
  loadComponent: () =>
    import('./features/projects/projects.component')
      .then(m => m.ProjectsComponent)
}
```

📖 Learn more: https://angular.io/guide/lazy-loading-ngmodules

---

### 3. HTTP Interceptor (JWT Auth)
The `HttpInterceptor` automatically attaches the JWT token to outgoing requests so admin routes are protected.

```typescript
intercept(req: HttpRequest<any>, next: HttpHandler) {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next.handle(req);
}
```

📖 Learn more: https://angular.io/guide/http-intercept-requests-and-responses

---

### 4. Route Guards
The `AuthGuard` prevents unauthenticated users from accessing admin pages.

```typescript
canActivate(): boolean {
  if (this.authService.isLoggedIn()) return true;
  this.router.navigate(['/login']);
  return false;
}
```

📖 Learn more: https://angular.io/guide/router#preventing-unauthorized-access

---

### 5. Animations with GSAP
GSAP is used for smooth, timeline-based animations.

```typescript
import { gsap } from 'gsap';

ngAfterViewInit() {
  gsap.from('.hero-title', {
    opacity: 0,
    y: 60,
    duration: 1,
    ease: 'power3.out',
  });
}
```

📖 Learn more: https://greensock.com/docs/

---

### 6. 3D Graphics with Three.js
Three.js is used in the Hero section for interactive 3D particle effects.

```typescript
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
```

📖 Learn more: https://threejs.org/docs/

---

### 7. Theme Service
A shared `ThemeService` manages light/dark mode and persists the user's preference.

```typescript
// Toggle between themes
themeService.toggleTheme();

// Set a specific theme
themeService.setTheme('dark');
```

---

### 8. Proxy Configuration
During development, API requests are proxied through `proxy.conf.json` to avoid CORS issues.

```json
{
  "/api": {
    "target": "http://zainportfilo.runasp.net",
    "secure": false,
    "changeOrigin": true
  }
}
```

---

## 📁 Project Structure Overview

```
src/app/
├── core/           # Guards, interceptors, services, models
├── features/       # Page-level components (hero, projects, contact, admin…)
├── shared/         # Reusable components, animations, directives
├── app.routes.ts   # Centralised route definitions
└── app.config.ts   # App-level providers
```

---

## 🚀 Recommended Learning Path

1. **Angular Basics** → [angular.io/tutorial](https://angular.io/tutorial)
2. **TypeScript Fundamentals** → [typescriptlang.org/docs](https://www.typescriptlang.org/docs/)
3. **RxJS Essentials** → [rxjs.dev/guide/overview](https://rxjs.dev/guide/overview)
4. **GSAP Getting Started** → [greensock.com/get-started](https://greensock.com/get-started/)
5. **Three.js Fundamentals** → [threejsfundamentals.org](https://threejsfundamentals.org/)
6. **SCSS Guide** → [sass-lang.com/guide](https://sass-lang.com/guide)

---

## 🛠️ Local Development Quick Start

```bash
# Install dependencies
npm install

# Start the development server (http://localhost:4200)
npm start

# Build for production
npm run build:prod

# Run unit tests
npm test
```

---

## 💡 Tips for New Contributors

- Read the [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.
- Prefer standalone components and lazy-loaded routes.
- Use the `ThemeService` variables for colours so both themes are supported.
- Keep animations subtle — performance matters on mobile devices.
- When adding a new feature section, mirror the structure of an existing feature (e.g., `features/bio`).

---

Happy learning! 🎉
