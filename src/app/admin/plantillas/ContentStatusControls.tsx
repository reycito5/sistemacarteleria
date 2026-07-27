"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { changeContentStatus } from "@/lib/actions/content";
import { nextStatuses, statusLabel } from "@/lib/views/workflow";
import type { ContentStatus } from "@/lib/supabase/database.types";

const STATUS_COLOR: Record<string, string> = {
  borrador: "#5b6172",
  en_revision: "#B06000",
  aprobado: "#137333",
  programado: "#0505FD",
  publicado: "#137333",
  finalizado: "#5b6172",
  archivado: "#5b6172",
};

export function ContentStatusControls({
  id,
  status,
}: {
  id: string;
  status: ContentStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const move = (to: ContentStatus) => {
    setError(null);
    startTransition(async () => {
      const res = await changeContentStatus(id, to);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white"
        style={{ background: STATUS_COLOR[status] ?? "#5b6172" }}
      >
        {statusLabel(status)}
      </span>
      {nextStatuses(status).map((t) => (
        <button
          key={t.to}
          onClick={() => move(t.to)}
          disabled={pending}
          className="text-xs font-bold disabled:opacity-50"
          style={{ color: t.emphasis === "danger" ? "#C52322" : "#03037A" }}
        >
          {t.label}
        </button>
      ))}
      {error && <span className="text-xs text-inst-red">{error}</span>}
    </div>
  );
}
