import { ModuleScaffold } from "@/components/admin/ModuleScaffold";

export default function PlaylistPage() {
  return (
    <ModuleScaffold
      title="Playlist general"
      phase="Fase 4"
      description="Una sola playlist institucional activa que se publica al grupo general y llega a las cuatro pantallas."
      features={[
        "Añadir y eliminar contenidos",
        "Cambiar orden y definir duración",
        "Silenciar videos y repetir elementos",
        "Vista previa",
        "Publicar en las cuatro pantallas",
        "Versionado y hora oficial de inicio",
      ]}
    />
  );
}
