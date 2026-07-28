import { getInstitutionIdentity } from "@/lib/data/institution";
import { PageHeader } from "@/components/ui/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { IdentityForm } from "./IdentityForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Identidad institucional — Panel UABJB Posgrado Digital",
};

export default async function IdentidadPage() {
  const identity = await getInstitutionIdentity();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inicio"
        title="Identidad institucional"
        description="Los logos, el nombre de la institución, los contactos y el rótulo que aparecen en la cabecera y el pie de TODAS las pantallas. Se editan una sola vez, aquí."
      />

      <Alert tone="info" title="Afecta a las cuatro pantallas a la vez">
        Lo que cambie aquí se aplica a todas las plantillas. Los colores y la
        tipografía institucionales siguen bloqueados y no se editan.
      </Alert>

      <IdentityForm identity={identity} />
    </div>
  );
}
