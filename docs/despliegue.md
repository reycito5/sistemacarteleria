# Despliegue y validación end-to-end

Guía para poner el sistema en producción con datos reales. Los pasos de este
documento requieren infraestructura externa (proyecto Supabase, cuenta Vercel,
mini PC físicos) y no forman parte del código del repositorio.

---

## 1. Proyecto Supabase

1. Cree un proyecto en [supabase.com](https://supabase.com).
2. **Aplique las migraciones** en orden (SQL Editor o CLI), desde
   `supabase/migrations/`:
   - `0001_init_schema.sql` — esquema y enums
   - `0002_rls_policies.sql` — RLS y funciones
   - `0003_seed.sql` — grupo general, 16 plantillas, 4 pantallas
   - `0004_storage.sql` — bucket de medios
   - `0005_realtime.sql` — Realtime del monitoreo
   - `0006_private_media.sql` — bucket privado + URLs firmadas
   - `0007_bootstrap_admin.sql` — primer usuario = superadmin + ayudante
   Con la CLI: `supabase db push` (o `supabase migration up`).
3. **Autenticación**: habilite el proveedor de correo/contraseña. La verificación
   en dos pasos (TOTP) ya está soportada por la app en `/admin/seguridad`.
4. **Realtime**: la migración `0005` publica `screens` y `screen_heartbeats`;
   confirme que Realtime está habilitado en el proyecto.
5. **Primer administrador**: con la migración `0007`, el **primer usuario que se
   registre** se convierte automáticamente en `superadmin`. Cree ese usuario en
   Auth (o desde `/admin/login`), inicie sesión y ya tendrá control total.
   - Para promover a otros usuarios más adelante, ejecute en el editor SQL:
     `select promote_to_superadmin('correo@dominio');`
   - Si su base ya tenía usuarios antes de aplicar `0007`, use ese mismo
     ayudante para designar al administrador.

## 2. Variables de entorno

Copie `.env.example` a `.env.local` (local) o configúrelas en Vercel:

| Variable | Ámbito | Uso |
| -------- | ------ | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | pública | Cliente y reproductores |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | pública | Cliente (RLS aplica seguridad) |
| `SUPABASE_SERVICE_ROLE_KEY` | **privada** | Telemetría, manifiesto, activación |
| `OFERTA_PORTAL_URL` | privada (opcional) | Portal de oferta |

> La clave de servicio **nunca** debe exponerse a los reproductores ni al cliente.

## 3. Despliegue en Vercel

1. Importe el repositorio en Vercel.
2. Configure las variables de entorno anteriores.
3. Framework: Next.js (detección automática). Build: `next build`.
4. Dominio sugerido: `carteleria-posgrado.vercel.app` o
   `carteleria.posgrado.uabjb.edu.bo`.

## 4. Alta de las pantallas

1. En cada mini PC, abra `/player/activar` (ver
   [`instalacion-mini-pc.md`](instalacion-mini-pc.md)).
2. En el panel, **Centro de pantallas → Activar una pantalla**, introduzca el
   código y asigne nombre/ubicación.
3. Repita para las cuatro pantallas. Todas quedan en el grupo
   `PANTALLAS GENERALES POSGRADO`.

## 5. Carga de contenido y publicación

1. **Biblioteca**: suba los dos videos institucionales y las imágenes.
2. **Plantillas**: cree los contenidos (o impórtelos desde el **Portal de
   oferta**) y muévalos a **Aprobado** en el flujo de aprobación.
3. **Playlist general**: añada los contenidos, ordene, ajuste duraciones y
   **publique en las cuatro pantallas**.
4. **Calendario** (opcional): programe franjas y prioridades.

## 6. Pruebas obligatorias (sección 32 del prompt maestro)

Marque cada prueba en la puesta en marcha:

- [ ] Encendido de las cuatro pantallas en horarios distintos.
- [ ] Sincronización automática (diferencia 1–3 s).
- [ ] Reproducción del mismo contenido en las cuatro.
- [ ] Dos videos en secuencia, sin audio simultáneo.
- [ ] Subtítulos visibles en videos informativos.
- [ ] Pérdida de Internet → continúa reproduciendo (offline).
- [ ] Recuperación de Internet → vuelve a sincronizar.
- [ ] Reinicio de una sola pantalla sin afectar las demás.
- [ ] Archivo dañado → salta al siguiente, sin pantalla negra.
- [ ] Emergencia simultánea en las cuatro pantallas.
- [ ] Mantenimiento individual.
- [ ] Actualización remota de la playlist.
- [ ] Reproducción continua durante toda la jornada.
- [ ] Legibilidad a distancia y lectura del código QR.

## 7. CI/CD automático (GitHub Actions)

El repositorio incluye tres flujos en `.github/workflows/`:

| Flujo | Disparo | Qué hace |
| ----- | ------- | -------- |
| `ci.yml` | push / PR | Lint, typecheck, pruebas y build |
| `deploy.yml` | push a `main` (o manual) | Despliega a Vercel (producción) |
| `migrate.yml` | manual | Aplica las migraciones a Supabase |

### Secretos a configurar (Settings → Secrets and variables → Actions)

Añádalos en GitHub; **nunca** se muestran en logs ni en el código:

Para el despliegue en Vercel:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Para las migraciones de Supabase:
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_DB_PASSWORD`

> `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` se obtienen ejecutando `vercel link`
> una vez en local (quedan en `.vercel/project.json`). El `SUPABASE_PROJECT_REF`
> es el identificador del proyecto en su URL de Supabase.

Además, configure en **Vercel** las variables de entorno de la sección 2
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, opcional `OFERTA_PORTAL_URL`).

### Secuencia de primer despliegue

1. Añada los secretos de Supabase → ejecute `migrate.yml` (pestaña Actions →
   Run workflow) para crear el esquema.
2. Configure las variables de entorno en Vercel.
3. Añada los secretos de Vercel → al hacer merge a `main` (o Run workflow),
   `deploy.yml` publica el sitio.

## 8. Verificación local del código

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```
