import { AdminNav } from "@/components/admin/AdminNav";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { createClient } from "@/lib/supabase/server";
import { INSTITUTION } from "@/lib/design/tokens";

/** Correo de la sesión activa; `null` si el entorno aún no está configurado. */
async function currentUserEmail(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.email ?? null;
  } catch {
    return null;
  }
}

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userEmail = await currentUserEmail();

  return (
    <div className="flex min-h-dvh bg-ui-canvas text-ui-ink">
      <AdminNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar userEmail={userEmail} />
        <main className="ui-animate-in min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1180px]">{children}</div>
        </main>
        <footer className="border-t border-ui-border px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-2 text-xs text-ui-muted">
            <p>
              {INSTITUTION.university} · {INSTITUTION.vicerrectorate}
            </p>
            <p>
              {INSTITUTION.systemName} · Grupo {INSTITUTION.generalGroup}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
