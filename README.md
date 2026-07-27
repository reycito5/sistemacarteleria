# SICD UABJB POSGRADO — UABJB Posgrado Digital

Sistema Institucional de Cartelería Digital del **Vicerrectorado de Posgrado**
de la Universidad Autónoma del Beni "José Ballivián".

Cuatro pantallas independientes que muestran una **única programación
institucional sincronizada**, administradas desde un solo panel web.

---

## Estado del desarrollo

Construcción por fases (sección 31 del prompt maestro).

| Fase | Descripción | Estado |
| ---- | ----------- | ------ |
| 1 | Base técnica: Next.js 16 + Supabase + Auth + RLS + diseño V11.6 | ✅ |
| 2 | Biblioteca multimedia | ✅ subida a Storage + validación + biblioteca |
| 3 | Plantillas (vistas 1–16) | ✅ plantillas + editor de contenido con vista previa |
| — | Flujo de aprobación (sección 20) | ✅ borrador→revisión→aprobado→archivado |
| 4 | Playlist general | ✅ editor + orden + duraciones + publicación real |
| 5 | Reproductor (kiosco, autoplay, repetición) | ✅ consume manifiesto real |
| 6 | Sincronización por hora oficial | ✅ motor + pruebas |
| 7 | Offline (Service Worker + caché) | ✅ SW, precarga de medios y caché de manifiesto |
| 8 | Monitoreo (heartbeats) | ✅ centro en vivo por Realtime + dashboard real |
| — | Calendario de programación | ✅ programaciones por días/franja/prioridad |
| 11 | Activación de pantallas por código | ✅ código temporal + confirmación en panel |
| 9 | Emergencias | ✅ vista + prioridad + activación desde el panel |
| 10 | Integración portal de oferta | ✅ importación de programas → plantillas |
| 11 | Instalación mini PC | ✅ documentación |

---

## Tecnologías

- **Next.js 16** (App Router, Server Actions, Route Handlers)
- **React 19** + **TypeScript estricto**
- **Tailwind CSS v4**
- **Supabase**: PostgreSQL, Auth, Storage, Realtime, Row Level Security
- **Zod** + **React Hook Form** (validación)
- **Vitest** (pruebas del motor de sincronización)

---

## Puesta en marcha

```bash
# 1. Dependencias
npm install

# 2. Variables de entorno
cp .env.example .env.local   # y complete los valores de Supabase

# 3. Base de datos (aplique las migraciones a su proyecto Supabase)
#    supabase/migrations/0001_init_schema.sql
#    supabase/migrations/0002_rls_policies.sql
#    supabase/migrations/0003_seed.sql
#    supabase/migrations/0004_storage.sql

# 4. Desarrollo
npm run dev
```

Rutas principales:

| Ruta | Descripción |
| ---- | ----------- |
| `/` | Portada y accesos |
| `/player?screen=REC-01` | Reproductor a pantalla completa (modo kiosco) |
| `/player/activar` | Activación de la pantalla por código (sección 22) |
| `/preview` | Galería de plantillas institucionales |
| `/admin` | Panel de administración |
| `/admin/login` | Acceso |
| `/api/player/manifest` | Manifiesto de la playlist activa para las pantallas (GET) |
| `/api/heartbeat` | Telemetría de reproductores (POST) |

---

## Verificación

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript estricto
npm run test        # Pruebas del motor de sincronización
npm run build       # Build de producción
```

---

## Línea gráfica institucional V11.6

Cabecera, pie, colores y tipografía están **bloqueados** y centralizados en
`src/lib/design/tokens.ts` y `src/app/globals.css`. No se modifican desde el
panel ni desde plantillas.

## Sincronización

El motor (`src/lib/player/sync.ts`) calcula la posición de cada pantalla a
partir de una única **hora oficial de inicio** y la hora actual, no del momento
de encendido. Diferencia esperada entre pantallas: 1–3 s.

## Instalación de los mini PC

Ver [`docs/instalacion-mini-pc.md`](docs/instalacion-mini-pc.md).
