import type { ViewContent } from "@/lib/views/schemas";
import { ProgramacionGeneralView } from "./ProgramacionGeneralView";
import { AgendaView } from "./AgendaView";
import { ProgramaDestacadoView } from "./ProgramaDestacadoView";
import { NoticiasView } from "./NoticiasView";
import { ComunicadoView } from "./ComunicadoView";
import {
  SincronizacionView,
  SinConexionView,
} from "./SincronizacionView";
import { ProximosIniciosView } from "./ProximosIniciosView";
import { GaleriaView } from "./GaleriaView";
import { MantenimientoView } from "./MantenimientoView";
import { EmergenciaView } from "./EmergenciaView";
import { BackupView } from "./BackupView";
import { HomenajeView } from "./HomenajeView";
import {
  BienvenidaView,
  ReconocimientosView,
  EventoVivoView,
  TestimonioView,
  MensajeView,
} from "./ExtraViews";

/**
 * Selecciona la plantilla institucional según el tipo de contenido. Ante un
 * tipo desconocido muestra el respaldo institucional (nunca pantalla negra).
 */
export function ViewRenderer({
  content,
  onComplete,
}: {
  content: ViewContent;
  /** La vista avisa cuando agotó su cola interna o terminó su medio. */
  onComplete?: () => void;
}) {
  switch (content.kind) {
    case "programacion_general":
      return <ProgramacionGeneralView content={content} onComplete={onComplete} />;
    case "agenda":
      return <AgendaView content={content} />;
    case "programa_destacado":
      return <ProgramaDestacadoView content={content} />;
    case "noticias":
      return <NoticiasView content={content} onComplete={onComplete} />;
    case "comunicado":
      return <ComunicadoView content={content} />;
    case "proximos_inicios":
      return <ProximosIniciosView content={content} />;
    case "mantenimiento":
      return <MantenimientoView content={content} />;
    case "sin_conexion":
      return <SinConexionView content={content} />;
    case "bienvenida":
      return <BienvenidaView content={content} />;
    case "reconocimientos":
      return <ReconocimientosView content={content} />;
    case "evento_vivo":
      return <EventoVivoView content={content} />;
    case "testimonio":
      return <TestimonioView content={content} />;
    case "mensaje":
      return <MensajeView content={content} />;
    case "homenaje":
      return <HomenajeView content={content} />;
    case "galeria":
      return <GaleriaView content={content} />;
    case "sincronizacion":
      return <SincronizacionView content={content} />;
    case "emergencia":
      return <EmergenciaView content={content} />;
    default:
      return <BackupView />;
  }
}

/**
 * Cómo debe montarse la vista dentro del marco institucional.
 *
 *  - `emergency`: paleta roja en cabecera y pie; la vista ocupa todo el centro.
 *  - `bare`: sin rejilla de 12 columnas ni rótulo (pantallas a sangre).
 *
 * La cabecera y el pie NUNCA se ocultan: la identidad institucional debe
 * seguir visible incluso en una emergencia.
 */
export function screenModeFor(content: ViewContent): {
  bare: boolean;
  emergency: boolean;
} {
  const emergency = content.kind === "emergencia";
  // La galería ocupa todo el centro (a sangre), sin la rejilla de 12 columnas.
  const bare = emergency || content.kind === "galeria";
  return { bare, emergency };
}
