import { ModuleScaffold } from "@/components/admin/ModuleScaffold";

export default function CalendarioPage() {
  return (
    <ModuleScaffold
      title="Calendario"
      phase="Fase 6"
      description="Programación temporal de la playlist por grupo, con prioridades y repetición."
      features={[
        "Fecha y hora inicial / final",
        "Días de la semana",
        "Franja horaria diaria",
        "Prioridad (0 emergencia … 90 respaldo)",
        "Repetición",
        "Activar / desactivar programaciones",
      ]}
    />
  );
}
