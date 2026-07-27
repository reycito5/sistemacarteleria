import Link from "next/link";
import { INSTITUTION } from "@/lib/design/tokens";

const LINKS = [
  {
    href: "/player",
    title: "Reproductor (kiosco)",
    desc: "Vista a pantalla completa sincronizada por hora oficial. Cada mini PC abre esta ruta.",
  },
  {
    href: "/preview",
    title: "Vista previa de plantillas",
    desc: "Las plantillas institucionales de las vistas del catálogo con la línea gráfica V11.6.",
  },
  {
    href: "/admin",
    title: "Panel de administración",
    desc: "Dashboard, biblioteca, playlist, comunicados y centro de pantallas.",
  },
];

export default function Home() {
  return (
    <div className="min-h-dvh bg-panel-bg text-panel-ink">
      <header
        className="px-6 py-10 text-inst-white sm:px-10 sm:py-14"
        style={{
          background:
            "linear-gradient(135deg, var(--color-inst-blue-bottom), var(--color-inst-blue-top))",
        }}
      >
        <div className="mx-auto max-w-5xl">
          <p className="text-[12px] font-semibold tracking-[0.3em] text-inst-gold sm:text-[13px]">
            {INSTITUTION.systemName}
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight sm:text-5xl">
            {INSTITUTION.commercialName}
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-white/80 sm:text-base">
            {INSTITUTION.university} · {INSTITUTION.vicerrectorate}. Sistema de
            cartelería digital para cuatro pantallas con una única programación
            institucional sincronizada.
          </p>
        </div>
      </header>
      <div className="inst-rule-gold" />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col rounded-2xl border border-panel-border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-inst-blue/30 hover:shadow-lg hover:shadow-black/5"
            >
              <h2 className="text-lg font-extrabold text-inst-blue-top sm:text-xl">
                {link.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-panel-muted">{link.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-inst-red transition group-hover:gap-2">
                Abrir <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-panel-border bg-white p-6 shadow-sm sm:mt-10">
          <h3 className="text-lg font-extrabold text-inst-blue-top">
            Grupo institucional
          </h3>
          <p className="mt-1 text-sm text-panel-muted">
            Las cuatro pantallas (Recepción, Pasillo, Auditorio y Administración)
            pertenecen al grupo{" "}
            <strong className="text-panel-ink">{INSTITUTION.generalGroup}</strong>{" "}
            y comparten exactamente la misma programación.
          </p>
        </section>
      </main>
    </div>
  );
}
