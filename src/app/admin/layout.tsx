import { AdminNav, type AdminModule } from "@/components/admin/AdminNav";

const MODULES: AdminModule[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/biblioteca", label: "Biblioteca multimedia" },
  { href: "/admin/plantillas", label: "Plantillas" },
  { href: "/admin/playlist", label: "Playlist general" },
  { href: "/admin/calendario", label: "Calendario" },
  { href: "/admin/comunicados", label: "Comunicados urgentes" },
  { href: "/admin/oferta", label: "Portal de oferta" },
  { href: "/admin/pantallas", label: "Centro de pantallas" },
  { href: "/admin/seguridad", label: "Seguridad (2FA)" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-panel-bg text-panel-ink lg:flex-row">
      <AdminNav modules={MODULES} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}
