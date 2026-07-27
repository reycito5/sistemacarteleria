import { MfaSetup } from "./MfaSetup";

export const metadata = { title: "Seguridad — UABJB Posgrado Digital" };

export default function SeguridadPage() {
  return (
    <div>
      <h1 className="text-2xl font-black text-inst-blue-top">Seguridad</h1>
      <p className="mt-1 max-w-2xl text-sm text-panel-muted">
        Verificación en dos pasos (TOTP) para su cuenta. Use una aplicación como
        Google Authenticator, Authy o 1Password.
      </p>
      <div className="mt-6">
        <MfaSetup />
      </div>
    </div>
  );
}
