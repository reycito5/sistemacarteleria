import { LoginForm } from "./LoginForm";
import { INSTITUTION } from "@/lib/design/tokens";

export const metadata = {
  title: "Acceso — UABJB Posgrado Digital",
};

export default function LoginPage() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-2 py-6">
      <div className="w-full max-w-sm rounded-2xl border border-panel-border bg-white p-8 shadow-lg shadow-black/5">
        <div
          className="mb-6 h-1.5 w-12 rounded-full"
          style={{ background: "var(--color-inst-gold)" }}
        />
        <p className="text-[11px] font-semibold tracking-[0.25em] text-inst-gold">
          {INSTITUTION.systemName}
        </p>
        <h1 className="mt-1 text-2xl font-black text-inst-blue-top">
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
