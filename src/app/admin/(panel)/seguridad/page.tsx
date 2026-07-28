import { KeyRound, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { MfaSetup } from "./MfaSetup";

export const metadata = { title: "Seguridad — UABJB Posgrado Digital" };

const STEPS = [
  "Instale una aplicación de autenticación en su teléfono (Google Authenticator, Authy o 1Password).",
  "Pulse «Activar» y escanee el código QR que aparece con esa aplicación.",
  "Escriba el código de 6 dígitos que muestra la aplicación para confirmar.",
  "A partir de entonces, cada vez que ingrese al panel se le pedirá ese código.",
];

export default function SeguridadPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="3 · Operación"
        title="Seguridad de la cuenta"
        description="Verificación en dos pasos para su cuenta del panel. Añade un código temporal además de la contraseña."
      />

      <Alert tone="info" title="Por qué conviene activarla">
        Con la verificación en dos pasos, conocer la contraseña no basta para
        entrar al panel ni para publicar contenido en las pantallas del
        Vicerrectorado.
      </Alert>

      <Card>
        <CardHeader
          icon={<KeyRound size={18} />}
          title="Cómo se activa"
          description="Cuatro pasos, una sola vez."
        />
        <ol className="mt-5 space-y-3">
          {STEPS.map((text, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-info-soft text-[11px] font-black text-inst-blue-top">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-ui-muted">{text}</p>
            </li>
          ))}
        </ol>
      </Card>

      <Card>
        <CardHeader
          icon={<ShieldCheck size={18} />}
          title="Verificación en dos pasos"
          description="Estado actual de su cuenta."
        />
        <div className="mt-5">
          <MfaSetup />
        </div>
      </Card>
    </div>
  );
}
