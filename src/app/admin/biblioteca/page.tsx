import { ModuleScaffold } from "@/components/admin/ModuleScaffold";

export default function BibliotecaPage() {
  return (
    <ModuleScaffold
      title="Biblioteca multimedia"
      phase="Fase 2"
      description="Gestión de videos, imágenes, comunicados, miniaturas y subtítulos con validación de resolución y duración."
      features={[
        "Subir videos (MP4/H.264, 1920×1080, 16:9)",
        "Subir imágenes (JPG/PNG/WebP, 16:9)",
        "Miniaturas obligatorias",
        "Subtítulos para videos informativos",
        "Clasificar, buscar y archivar",
        "Reemplazar y validar archivos",
      ]}
    />
  );
}
