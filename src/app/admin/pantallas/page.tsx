import { ModuleScaffold } from "@/components/admin/ModuleScaffold";

export default function PantallasPage() {
  return (
    <ModuleScaffold
      title="Centro de pantallas"
      phase="Fase 8"
      description="Estado y telemetría de las cuatro pantallas: latidos, contenido actual, posición, errores y almacenamiento."
      features={[
        "Estado y última conexión",
        "Contenido actual y segundo aproximado",
        "Playlist instalada y versión del reproductor",
        "Archivos pendientes y espacio disponible",
        "Errores recientes",
        "Reiniciar sincronización / activar mantenimiento",
      ]}
    />
  );
}
