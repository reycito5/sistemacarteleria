import { ModuleScaffold } from "@/components/admin/ModuleScaffold";

export default function PlantillasPage() {
  return (
    <ModuleScaffold
      title="Plantillas"
      phase="Fase 3"
      description="Las 16 vistas funcionan como plantillas institucionales. Solo se editan textos, fechas, medios y QR; la línea gráfica está bloqueada."
      features={[
        "Editar títulos, textos y fechas",
        "Asignar videos e imágenes",
        "Contactos y códigos QR",
        "Información de programas",
        "Cabecera y pie bloqueados",
        "Colores y tipografía bloqueados",
      ]}
    />
  );
}
