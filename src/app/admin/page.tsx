import { INSTITUTION } from "@/lib/design/tokens";
import { publicEnv } from "@/lib/env";

/** Cuatro pantallas base (coincide con el seed de la migración 0003). */
const SCREENS = [
  { name: "Recepción", code: "REC-01", status: "En línea", content: "Programación general", position: "00:32" },
  { name: "Pasillo principal", code: "PAS-01", status: "En línea", content: "Programación general", position: "00:33" },
  { name: "Auditorio", code: "AUD-01", status: "En línea", content: "Programación general", position: "00:31" },
  { name: "Administración", code: "ADM-01", status: "En línea", content: "Programación general", position: "00:32" },
];

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-md border bg-white px-5 py-4"
      style={{ borderColor: "var(--color-panel-border)" }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-panel-muted">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black text-inst-blue-top">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const configured =
    Boolean(publicEnv.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return (
    <div>
      <h1 className="text-2xl font-black text-inst-blue-top">Dashboard</h1>
      <p className="mt-1 text-sm text-panel-muted">
        Grupo {INSTITUTION.generalGroup} · programación institucional única.
      </p>

      {!configured && (
        <div
          className="mt-4 rounded-md border-l-4 bg-white px-4 py-3 text-sm"
          style={{ borderColor: "var(--color-inst-gold)" }}
        >
          <strong>Supabase no configurado.</strong> Defina{" "}
          <code>NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> para conectar datos reales.
          Se muestran valores de referencia.
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pantallas registradas" value="4" />
        <StatCard label="Conectadas" value="4" />
        <StatCard label="Desconectadas" value="0" />
        <StatCard label="Alertas" value="0" />
      </div>

      <h2 className="mt-8 text-lg font-extrabold text-inst-blue-top">
        Centro de pantallas
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SCREENS.map((s) => (
          <div
            key={s.code}
            className="rounded-md border bg-white p-4"
            style={{ borderColor: "var(--color-panel-border)" }}
          >
            <div className="flex items-center justify-between">
              <p className="font-extrabold uppercase text-inst-blue-top">
                {s.name}
              </p>
              <span className="flex items-center gap-1.5 text-xs font-bold text-green-700">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                {s.status}
              </span>
            </div>
            <p className="mt-3 text-xs text-panel-muted">Reproduciendo</p>
            <p className="text-sm font-semibold">{s.content}</p>
            <p className="mt-2 text-xs text-panel-muted">
              Posición: <span className="font-mono">{s.position}</span> · {s.code}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
