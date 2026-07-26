import { LoginForm } from "./LoginForm";
import { INSTITUTION } from "@/lib/design/tokens";

export const metadata = {
  title: "Acceso — UABJB Posgrado Digital",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-full place-items-center bg-panel-bg px-4">
      <div
        className="w-full max-w-sm rounded-md border bg-white p-8 shadow-sm"
        style={{ borderColor: "var(--color-panel-border)" }}
      >
        <p className="text-[11px] font-semibold tracking-[0.25em] text-inst-gold">
          {INSTITUTION.systemName}
        </p>
        <h1 className="mt-1 text-xl font-black text-inst-blue-top">
          Acceso al panel
        </h1>
        <p className="mt-1 text-sm text-panel-muted">
          Ingrese con sus credenciales institucionales.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
