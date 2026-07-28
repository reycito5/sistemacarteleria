import { StatusLayout } from "@/components/signage/layouts";

/**
 * Respaldo institucional (sección 28): se muestra cuando el contenido no se
 * puede interpretar. Garantiza que el televisor nunca quede en negro.
 */
export function BackupView() {
  return (
    <StatusLayout
      kicker="Vicerrectorado de Posgrado"
      title="Universidad Autónoma del Beni «José Ballivián»"
      sub="La programación institucional se reanudará en unos instantes."
    />
  );
}
