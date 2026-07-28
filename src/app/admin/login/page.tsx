import Link from "next/link";
import { ArrowLeft, MonitorPlay, ShieldCheck, Zap } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { INSTITUTION } from "@/lib/design/tokens";

export const metadata = {
  title: "Acceso — UABJB Posgrado Digital",
  description:
    "Acceso al panel de administración del sistema de cartelería digital del Vicerrectorado de Posgrado.",
};

const HIGHLIGHTS = [
  {
    icon: MonitorPlay,
    title: "Cuatro pantallas, una programación",
    text: "Recepción, Pasillo, Auditorio y Administración emiten lo mismo, sincronizado al segundo.",
  },
  {
    icon: Zap,
    title: "Publicación inmediata",
    text: "Lo que se publica en la playlist llega a los televisores en menos de un minuto.",
  },
  {
    icon: ShieldCheck,
    title: "Acceso verificado",
    text: "Cuentas institucionales con verificación en dos pasos y registro de auditoría.",
  },
];

/**
 * Acceso al panel. Vive FUERA del grupo `(panel)`, por lo que no arrastra la
 * barra lateral ni la barra superior: es una pantalla independiente.
 */
export default function LoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Columna institucional (se oculta en móvil para dejar sitio al formulario) */}
      <aside className="ui-gradient-inst-mesh relative hidden flex-col justify-between p-10 text-inst-white lg:flex xl:p-14">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-[12px] border border-inst-gold/50 bg-white/10 text-base font-black text-inst-gold">
              UB
            </span>
            <div>
              <p className="text-[11px] font-bold tracking-[0.24em] text-inst-gold">
                {INSTITUTION.systemName}
              </p>
              <p className="text-lg font-black leading-tight">
                {INSTITUTION.commercialName}
              </p>
            </div>
          </div>

          <h2 className="mt-14 max-w-md text-[38px] font-black leading-[1.08] xl:text-[44px]">
            Cartelería digital del Vicerrectorado de Posgrado
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
            {INSTITUTION.university}
          </p>
        </div>

        <ul className="mt-12 space-y-5">
          {HIGHLIGHTS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-white/15 bg-white/10 text-inst-gold">
                <Icon size={18} aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold">{title}</p>
                <p className="mt-0.5 max-w-sm text-[13px] leading-relaxed text-white/60">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <p className="text-[11px] text-white/40">
          {INSTITUTION.vicerrectorate} · Línea gráfica institucional V11.6
        </p>
      </aside>

      {/* Columna del formulario */}
      <main className="flex flex-col justify-center bg-ui-canvas px-5 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-[400px]">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ui-muted transition hover:text-inst-blue-top"
          >
            <ArrowLeft size={15} aria-hidden />
            Volver al portal
          </Link>

          {/* Marca compacta, sólo en móvil (la columna azul está oculta). */}
          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-[12px] bg-inst-blue-bottom text-sm font-black text-inst-gold">
              UB
            </span>
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-inst-gold">
                {INSTITUTION.systemName}
              </p>
              <p className="text-[15px] font-black leading-tight text-inst-blue-top">
                {INSTITUTION.commercialName}
              </p>
            </div>
          </div>

          <div className="ui-card p-7 sm:p-8">
            <h1 className="text-[26px] font-black leading-tight text-inst-blue-top">
              Acceso al panel
            </h1>
            <p className="mt-1.5 text-sm text-ui-muted">
              Ingrese con su cuenta institucional para administrar la
              programación de las pantallas.
            </p>
            <div className="mt-7">
              <LoginForm />
            </div>
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-ui-muted">
            ¿Problemas para ingresar? Comuníquese con el soporte técnico del
            Vicerrectorado de Posgrado.
          </p>
        </div>
      </main>
    </div>
  );
}
