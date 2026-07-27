import Link from "next/link";
import { INSTITUTION } from "@/lib/design/tokens";
import { listScreensStatus, getActiveEmergency, type ScreenStatusView } from "@/lib/data/admin";
import { AutoRefresh } from "@/components/admin/AutoRefresh";
import { RealtimeScreens } from "@/components/admin/RealtimeScreens";

export const dynamic = "force-dynamic";

interface DashboardData {
  screens: ScreenStatusView[];
  emergencyTitle: string | null;
}

async function loadDashboard(): Promise<DashboardData | null> {
  try {
    const [screens, emergency] = await Promise.all([
      listScreensStatus(),
      getActiveEmergency(),
    ]);
    return { screens, emergencyTitle: emergency?.title ?? null };
  } catch {
    return null;
  }
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-white px-5 py-4" style={{ borderColor: "var(--color-panel-border)" }}>
      <p className="text-xs font-semibold uppercase tracking-wide text-panel-muted">{label}</p>
      <p className="mt-1 text-2xl font-black text-inst-blue-top">{value}</p>
    </div>
  );
}

export default async function AdminDashboard() {
  const data = await loadDashboard();

  const online = data?.screens.filter((s) => s.online).length ?? 0;
  const total = data?.screens.length ?? 0;

  return (
    <div>
      <AutoRefresh seconds={30} />
      <RealtimeScreens />
      <h1 className="text-2xl font-black text-inst-blue-top">Dashboard</h1>
      <p className="mt-1 text-sm text-panel-muted">
        Grupo {INSTITUTION.generalGroup} · programación institucional única.
      </p>

      {data === null && (
        <div className="mt-4 rounded-md border-l-4 bg-white px-4 py-3 text-sm" style={{ borderColor: "var(--color-inst-gold)" }}>
          <strong>Supabase no configurado.</strong> Defina las variables de entorno e
          inicie sesión para ver datos reales.
        </div>
      )}

      {data?.emergencyTitle && (
        <Link
          href="/admin/comunicados"
          className="mt-4 flex items-center gap-3 rounded-md px-4 py-3 text-sm font-bold text-inst-white"
          style={{ background: "var(--color-inst-red)" }}
        >
          ⚠ Emergencia activa: {data.emergencyTitle} — gestionar
        </Link>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pantallas registradas" value={String(total)} />
        <StatCard label="Conectadas" value={String(online)} />
        <StatCard label="Desconectadas" value={String(total - online)} />
        <StatCard label="Emergencia" value={data?.emergencyTitle ? "Activa" : "—"} />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-inst-blue-top">Centro de pantallas</h2>
        <Link href="/admin/pantallas" className="text-sm font-bold text-inst-red">
          Ver detalle →
        </Link>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(data?.screens ?? []).map((s) => (
          <div key={s.id} className="rounded-md border bg-white p-4" style={{ borderColor: "var(--color-panel-border)" }}>
            <div className="flex items-center justify-between">
              <p className="font-extrabold uppercase text-inst-blue-top">
                {s.location || s.name}
              </p>
              <span
                className="flex items-center gap-1.5 text-xs font-bold"
                style={{ color: s.online ? "#137333" : "#C52322" }}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.online ? "#34a853" : "#C52322" }} />
                {s.online ? "En línea" : "Desconectada"}
              </span>
            </div>
            <p className="mt-3 text-xs text-panel-muted">Reproduciendo</p>
            <p className="text-sm font-semibold">{s.currentContentTitle ?? "—"}</p>
            <p className="mt-2 text-xs text-panel-muted">{s.code}</p>
          </div>
        ))}
        {data && data.screens.length === 0 && (
          <p className="text-sm text-panel-muted">No hay pantallas registradas.</p>
        )}
      </div>
    </div>
  );
}
