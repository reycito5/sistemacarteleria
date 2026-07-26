import { ModuleScaffold } from "@/components/admin/ModuleScaffold";

export default function ComunicadosPage() {
  return (
    <ModuleScaffold
      title="Comunicados urgentes"
      phase="Fase 9"
      description="Formulario rápido de comunicados y emergencias con prioridad absoluta y confirmación especial. Se publican simultáneamente en las cuatro pantallas."
      features={[
        "Tipo de aviso y título",
        "Mensaje e instrucciones",
        "Fecha, hora y duración",
        "Nivel de prioridad / severidad",
        "Confirmación especial para emergencias",
        "Registro en auditoría",
      ]}
    />
  );
}
