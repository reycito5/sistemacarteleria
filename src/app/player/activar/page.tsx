import { ActivationClient } from "@/components/player/ActivationClient";

export const metadata = {
  title: "Activar pantalla — UABJB Posgrado Digital",
};

export const dynamic = "force-dynamic";

/**
 * Ruta de activación del reproductor (sección 22). Cada mini PC la abre una vez
 * durante la instalación para obtener su identidad.
 */
export default function ActivarPage() {
  return <ActivationClient />;
}
