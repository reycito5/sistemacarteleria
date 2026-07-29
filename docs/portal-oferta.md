# Conectar el sistema con el portal de oferta académica

Esta guía explica cómo hacer que la cartelería lea los programas directamente
del portal de oferta (por ejemplo `https://ofertaposgrado.vercel.app`), de modo
que no haya que reescribir a mano ninguna maestría ni diplomado.

---

## 1. Qué hace la conexión

Cuando está configurada:

- La pantalla **Portal de oferta** del panel lista los programas reales y
  permite importarlos con un clic. Cada importación crea —o actualiza— una
  pantalla «Programa destacado» en estado borrador.
- La página pública **/oferta** muestra los mismos programas.

Si la conexión falla, el sistema usa una oferta de muestra interna: la
cartelería nunca se queda sin contenido por un problema del portal.

---

## 2. Configuración mínima

Defina una sola variable de entorno:

```bash
OFERTA_PORTAL_URL=https://ofertaposgrado.vercel.app
```

En Vercel: **Project → Settings → Environment Variables**, y vuelva a
desplegar para que el valor se aplique.

No hace falta indicar la ruta exacta. El sistema prueba por su cuenta, en este
orden:

| # | Ruta probada        |
| - | ------------------- |
| 1 | `/api/programas`    |
| 2 | `/api/programs`     |
| 3 | `/api/oferta`       |
| 4 | `/api/ofertas`      |
| 5 | `/programas.json`   |
| 6 | `/oferta.json`      |
| 7 | La propia página, buscando datos incrustados en el HTML |

También acepta una ruta concreta si prefiere fijarla:

```bash
OFERTA_PORTAL_URL=https://ofertaposgrado.vercel.app/api/programas
```

El panel muestra el resultado de cada intento en **Portal de oferta →
Conexión con el portal → Detalle de los intentos**. Ahí se ve exactamente qué
ruta respondió y cuál falló.

---

## 3. Formato que espera el sistema

Cualquiera de estas tres formas es válida:

```jsonc
[ { "nombre": "..." } ]                    // lista suelta
{ "programs": [ { "name": "..." } ] }      // envuelta en programs
{ "data":     [ { "nombre": "..." } ] }    // envuelta en data
```

También reconoce los envoltorios `programas`, `items`, `results`, `oferta` y
`ofertas`.

### Campos de cada programa

Se admiten nombres en español o en inglés. Sólo **el nombre es obligatorio**;
el resto es opcional y se omite si falta.

| Dato          | Claves admitidas                                                     |
| ------------- | -------------------------------------------------------------------- |
| Nombre        | `name`, `nombre`, `titulo`, `title`, `programa`, `program`            |
| Identificador | `id`, `slug`, `codigo`, `code`                                       |
| Nivel         | `level`, `nivel`, `tipo`, `type`, `grado`, `categoria`               |
| Área          | `area`, `areaConocimiento`, `facultad`, `unidad`, `category`         |
| Modalidad     | `modality`, `modalidad`, `mode`                                      |
| Estado        | `status`, `estado`, `situacion`, `state`                             |
| Inicio        | `startDate`, `inicio`, `fechaInicio`, `fecha_inicio`, `start`        |
| Duración      | `durationMonths`, `duracion`, `duracionMeses`, `meses`, `duration`   |
| Créditos      | `credits`, `creditos`                                                |
| Horas         | `hours`, `horas`, `cargaHoraria`, `carga_horaria`                    |
| Lema o resumen| `slogan`, `lema`, `descripcion`, `description`, `resumen`            |
| Imagen        | `imageUrl`, `imagen`, `image`, `portada`, `cover`, `foto`            |
| Enlace        | `enrollmentUrl`, `inscripcionUrl`, `url`, `link`, `href`             |
| Inscripciones | `enrollmentOpen`, `inscripcionesAbiertas`, `abierto`, `activo`       |

**Estado del programa.** Se interpreta el texto tal como lo escribe el portal:

| Texto del portal        | Estado reconocido | Cómo se ve en la tarjeta      |
| ----------------------- | ----------------- | ----------------------------- |
| «Inscripción abierta»   | `abierta`         | Etiqueta roja                 |
| «Inscripción cerrada»   | `cerrada`         | Etiqueta azul                 |
| «En ejecución», «En curso» | `ejecucion`    | Etiqueta azul                 |
| «Próximamente»          | `proximo`         | Etiqueta dorada               |

Si no se publica ningún estado, se deduce del indicador de inscripciones.

Detalles útiles:

- Los números toleran texto alrededor: `"5 meses"` se lee como `5`, y
  `"800 horas"` como `800`.
- Las inscripciones aceptan texto: `"sí"`, `"no"`, `"abierto"`, `"cerrado"`.
  Si no se indica nada, se asume abierto.
- Un enlace relativo (`/inscripcion`) se resuelve contra el dominio del portal.

---

## 4. Opción recomendada: publicar una ruta JSON en el portal

Leer el HTML funciona, pero se rompe cada vez que se cambia el maquetado del
portal. Lo estable es exponer una ruta JSON. Si el portal es un proyecto
Next.js con App Router, cree el archivo `app/api/programas/route.ts`:

```ts
import { NextResponse } from "next/server";

// Sustituya esta constante por la consulta a su base de datos o CMS.
const PROGRAMAS = [
  {
    id: "mae-edu-sup",
    nombre: "Maestría en Educación Superior",
    nivel: "Maestría",
    area: "Educación",
    modalidad: "Virtual",
    estado: "Inscripción abierta",
    inicio: "17 de agosto de 2026",
    duracion: 18,
    creditos: 80,
    horas: 3200,
    descripcion: "Forma a los formadores del Beni",
    imagen: "/img/programas/maestria-educacion.jpg",
    url: "/oferta/maestria-en-educacion-superior",
  },
  {
    id: "dip-auditoria",
    nombre: "Diplomado en Auditoría y Control Gubernamental",
    nivel: "Diplomado",
    area: "Ciencias Económicas",
    modalidad: "Virtual",
    estado: "En ejecución",
    inicio: "1 de septiembre de 2025",
    duracion: 4,
    imagen: "/img/programas/auditoria.jpg",
    url: "/oferta/diplomado-en-auditoria",
  },
];

export async function GET() {
  return NextResponse.json(
    { programas: PROGRAMAS },
    {
      headers: {
        // Permite que la cartelería lea la ruta desde otro dominio.
        "access-control-allow-origin": "*",
        // Respuesta fresca: el panel consulta en cada carga.
        "cache-control": "no-store",
      },
    },
  );
}
```

Verifique que responde antes de configurar nada:

```bash
curl -s https://ofertaposgrado.vercel.app/api/programas | head
```

---

## 5. Cómo saber si funcionó

En el panel, entre en **Portal de oferta**. Arriba a la derecha verá una de
estas dos etiquetas:

- **Conectado al portal** — los programas listados son los reales.
- **Datos de muestra** — la conexión falló; abra «Detalle de los intentos»
  para ver el motivo de cada ruta probada.

Los fallos más habituales:

| Mensaje                                          | Causa probable                                              |
| ------------------------------------------------ | ----------------------------------------------------------- |
| `HTTP 404` en todas las rutas                    | El portal no expone ninguna ruta JSON. Cree la del punto 4.  |
| `Respondió JSON, pero sin programas reconocibles`| Ningún registro tiene un campo de nombre reconocible.        |
| `Respondió HTML, sin datos de programas`         | La página genera el contenido en el navegador. Cree la ruta JSON. |
| `Sin respuesta en 8 s`                           | El portal tardó demasiado o está caído.                      |
| `La dirección configurada no es una URL válida`  | Falta `https://` en `OFERTA_PORTAL_URL`.                    |

---

## 6. Qué se ve con estos datos

Con nivel, área, estado e imagen, la cartelería aprovecha todo:

- La página pública `/oferta` reproduce las tarjetas del portal (portada,
  nivel, estado, modalidad, área y ficha breve) y añade filtros por nivel y
  por área.
- Al importar un programa, la pantalla «Programa destacado» usa el **nivel**
  como distintivo (MAESTRÍA, DIPLOMADO…) y añade el **área** a la ficha.

Sin esos campos todo sigue funcionando: simplemente se omiten.

---

## 7. Del portal a la pantalla

Importar un programa **no lo pone en el televisor**. El recorrido completo es:

1. **Portal de oferta** → importar el programa (queda en borrador).
2. **Plantillas y contenidos** → revisar los textos y aprobarlo.
3. **Playlist general** → añadirlo, fijar su duración y publicar.
4. Los televisores recogen la nueva versión en menos de un minuto.
