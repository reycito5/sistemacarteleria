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

### Endurecimiento (sección 29)

| Área | Estado |
| ---- | ------ |
| URLs firmadas para Storage (bucket privado) | ✅ firma en servidor + caché SW por ruta |
| Token de dispositivo verificado en heartbeats | ✅ hash SHA-256, comparación en tiempo constante |
| Verificación en dos pasos (TOTP) | ✅ enrolamiento + reto en el acceso |
| Vistas del catálogo | ✅ 12 vistas + editores; subtítulos (.vtt) |

Pendiente (infraestructura externa, ver [`docs/despliegue.md`](docs/despliegue.md)):
conexión a un Supabase de producción, despliegue en Vercel y validación E2E
con las cuatro pantallas físicas (sección 32).

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

### Portal público

| Ruta | Descripción |
| ---- | ----------- |
| `/` | Portada institucional: qué es el sistema y cómo funciona |
| `/oferta` | Oferta académica del portal, con filtros por nivel y área |
| `/agenda` | Actividades publicadas desde el panel, agrupadas por fecha |
| `/pantallas` | Las cuatro pantallas y cómo se sincronizan |
| `/preview` | Catálogo de las plantillas institucionales |
| `/contacto` | Canales de atención y soporte del sistema |

Todas comparten cabecera con menú y pie institucional.

### Panel de administración

| Ruta | Descripción |
| ---- | ----------- |
| `/admin/login` | Acceso — pantalla independiente, sin el marco del panel |
| `/admin` | Panel general: estado de las pantallas y del contenido |
| `/admin/ayuda` | Cómo funciona el sistema, paso a paso |
| `/admin/biblioteca` | Paso 1 — subir videos e imágenes |
| `/admin/plantillas` | Paso 2 — armar cada pantalla sobre una plantilla |
| `/admin/oferta` | Importar programas del portal de oferta |
| `/admin/playlist` | Paso 3 — ordenar y publicar la programación |
| `/admin/calendario` | Programación por días y franjas horarias |
| `/admin/comunicados` | Comunicados urgentes (prioridad absoluta) |
| `/admin/pantallas` | Paso 4 — registrar y vigilar los televisores |
| `/admin/seguridad` | Verificación en dos pasos |

### Reproductor y servicios

| Ruta | Descripción |
| ---- | ----------- |
| `/player?screen=REC-01` | Reproductor a pantalla completa (modo kiosco) |
| `/player/activar` | Activación de la pantalla por código (sección 22) |
| `/api/player/manifest` | Manifiesto de la playlist activa para las pantallas (GET) |
| `/api/heartbeat` | Telemetría de reproductores (POST) |

---

## El recorrido del contenido

Un archivo llega al televisor sólo si recorre los cuatro pasos:

```
Biblioteca  →  Plantilla  →  Playlist  →  Televisores
 (subir)      (armar y       (ordenar y    (emiten en
              aprobar)       publicar)     menos de 1 min)
```

Saltarse un paso es la causa más común de que algo no aparezca en pantalla.
La pantalla `/admin/ayuda` explica el flujo completo dentro del propio panel.

---

## Portal de oferta académica

Basta con definir el dominio del portal:

```bash
OFERTA_PORTAL_URL=https://ofertaposgrado.vercel.app
```

El sistema prueba solo las rutas JSON habituales, acepta campos en español o
en inglés y, si nada responde, lee los datos incrustados en el HTML. El panel
muestra el diagnóstico de cada intento.

De cada programa se aprovechan nombre, **nivel** (Diplomado, Maestría…),
**área**, modalidad, **estado** («Inscripción abierta», «En ejecución»…),
inicio, duración, créditos, horas, lema, imagen y enlace.

- Guía completa: [`docs/portal-oferta.md`](docs/portal-oferta.md)
- Ruta JSON lista para copiar al portal:
  [`docs/ejemplos/api-programas.route.ts`](docs/ejemplos/api-programas.route.ts)

---

## Verificación

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript estricto
npm run test        # Pruebas del motor de sincronización
npm run build       # Build de producción
```

---

## Sistema visual

Dos capas bien separadas, ambas en `src/app/globals.css`:

1. **Línea gráfica institucional V11.6** (`--color-inst-*`): lo que se ve en el
   televisor. Cabecera, pie, colores y tipografía están **bloqueados** y
   centralizados también en `src/lib/design/tokens.ts`. No se modifican desde
   el panel ni desde plantillas.
2. **Interfaz de gestión** (`--color-ui-*`): el panel y el portal web. Usa los
   mismos colores institucionales sobre superficies, sombras y estados propios
   de una aplicación web. Las primitivas compartidas están en
   `src/components/ui/`. El portal público añade una serif académica
   (`--font-serif`) para los nombres de programa, en línea con el portal de
   oferta; el televisor no la usa.

## Reproducción de video

- En el televisor, `components/views/MediaPanel` reproduce el video de verdad
  (autoplay silenciado con reintento y bucle) y muestra las imágenes limpias,
  sin ninguna barra de controles encima.
- En el panel, `components/media/VideoPlayer` ofrece controles funcionales
  (reproducir, barra de posición arrastrable, volumen, reinicio y pantalla
  completa) para revisar el material antes de publicarlo.

## Sincronización

El motor (`src/lib/player/sync.ts`) calcula la posición de cada pantalla a
partir de una única **hora oficial de inicio** y la hora actual, no del momento
de encendido. Diferencia esperada entre pantallas: 1–3 s.

## Instalación de los mini PC

Ver [`docs/instalacion-mini-pc.md`](docs/instalacion-mini-pc.md).

## Despliegue en producción

Ver [`docs/despliegue.md`](docs/despliegue.md): Supabase, migraciones, variables,
Vercel y la lista de pruebas obligatorias (sección 32).
