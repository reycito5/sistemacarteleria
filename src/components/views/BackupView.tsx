import { TechScreen } from "@/components/signage/primitives";

/**
 * Respaldo institucional (sección 28): se muestra cuando el contenido no se
 * puede interpretar. Garantiza que el televisor nunca quede en negro.
 */
export function BackupView() {
  return (
    <TechScreen
      glyph="◈"
      title="Vicerrectorado de Posgrado"
      sub="La programación institucional se reanudará en unos instantes."
    />
  );
}
