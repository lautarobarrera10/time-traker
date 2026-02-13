# Time Tracker

Aplicación web para registrar y hacer seguimiento de horas trabajadas, organizada por categorías y tareas.

## Funcionalidades

- **Gestión de categorías** — Crear y seleccionar categorías de trabajo.
- **Gestión de tareas** — Crear tareas dentro de cada categoría.
- **Temporizador** — Iniciar/detener un cronómetro con visualización en HH:MM:SS.
- **Registro de tiempo** — Guardar entradas con categoría, tarea, horas y fecha.
- **Totales acumulados** — Ver horas totales por categoría y tarea.
- **Historial reciente** — Lista de entradas recientes con opción de eliminar.
- **Autenticación con Google** — Inicio de sesión con cuenta de Google.

## Tecnologías

- **Next.js 16** (App Router)
- **React 19** + **TypeScript 5**
- **Tailwind CSS 4**
- **NextAuth.js** (Google OAuth, estrategia JWT)

## Inicio rápido

```bash
npm install
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Crear un archivo `.env.local` con:

```
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secret
```

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Ejecutar ESLint |
