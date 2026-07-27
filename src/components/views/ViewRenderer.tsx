import type { ViewContent } from "@/lib/views/schemas";
import { ProgramacionGeneralView } from "./ProgramacionGeneralView";
import { AgendaView } from "./AgendaView";
import { ProgramaDestacadoView } from "./ProgramaDestacadoView";
import { NoticiasView } from "./NoticiasView";
import { ComunicadoView } from "./ComunicadoView";
import { SincronizacionView } from "./SincronizacionView";
import { EmergenciaView } from "./EmergenciaView";
import { BackupView } from "./BackupView";
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
export function ViewRenderer({ content }: { content: ViewContent }) {
  switch (content.kind) {
    case "programacion_general":
      return <ProgramacionGeneralView content={content} />;
    case "agenda":
      return <AgendaView content={content} />;
    case "programa_destacado":
      return <ProgramaDestacadoView content={content} />;
    case "noticias":
      return <NoticiasView content={content} />;
    case "comunicado":
      return <ComunicadoView content={content} />;
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
    case "sincronizacion":
      return <SincronizacionView content={content} />;
    case "emergencia":
      return <EmergenciaView content={content} />;
    default:
      return <BackupView />;
  }
}

/** Indica si la vista debe renderizarse a sangre completa (sin cabecera/pie). */
export function isBareView(content: ViewContent): boolean {
  return content.kind === "emergencia" || content.kind === "sincronizacion";
}
