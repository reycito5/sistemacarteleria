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
    <div className="min-h-full bg-panel-bg text-panel-ink">
      <header
        className="px-10 py-8 text-inst-white"
        style={{ background: "var(--color-inst-blue-bottom)" }}
      >
        <p className="text-[13px] font-semibold tracking-[0.3em] text-inst-gold">
          {INSTITUTION.systemName}
        </p>
        <h1 className="mt-1 text-4xl font-black">{INSTITUTION.commercialName}</h1>
        <p className="mt-2 max-w-3xl text-white/80">
          {INSTITUTION.university} · {INSTITUTION.vicerrectorate}. Sistema de
          cartelería digital para cuatro pantallas con una única programación
          institucional sincronizada.
        </p>
      </header>
      <div className="inst-rule-gold" />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-5 sm:grid-cols-3">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-md border bg-white p-6 transition hover:shadow-md"
              style={{ borderColor: "var(--color-panel-border)" }}
            >
              <h2 className="text-xl font-extrabold text-inst-blue-top">
                {link.title}
              </h2>
              <p className="mt-2 text-sm text-panel-muted">{link.desc}</p>
              <span className="mt-4 inline-block text-sm font-bold text-inst-red">
                Abrir →
              </span>
            </Link>
          ))}
        </div>

        <section
          className="mt-10 rounded-md border bg-white p-6"
          style={{ borderColor: "var(--color-panel-border)" }}
        >
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
