"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { changeContentStatus } from "@/lib/actions/content";
import { nextStatuses, statusLabel } from "@/lib/views/workflow";
import type { ContentStatus } from "@/lib/supabase/database.types";
import { Badge, type BadgeTone } from "@/components/ui/Badge";

const STATUS_TONE: Record<string, BadgeTone> = {
  borrador: "neutral",
  en_revision: "warn",
  aprobado: "ok",
  programado: "info",
  publicado: "ok",
  finalizado: "neutral",
  archivado: "neutral",
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
      <Badge tone={STATUS_TONE[status] ?? "neutral"} dot>
        {statusLabel(status)}
      </Badge>

      {nextStatuses(status).map((t) => (
        <button
          key={t.to}
          type="button"
          onClick={() => move(t.to)}
          disabled={pending}
          className={[
            "rounded-[8px] border px-2.5 py-1 text-xs font-bold transition disabled:opacity-50",
            t.emphasis === "danger"
              ? "border-danger/25 text-inst-red hover:bg-danger-soft"
              : "border-ui-border-strong text-inst-blue-top hover:border-inst-blue/45 hover:bg-info-soft",
          ].join(" ")}
        >
          {t.label}
        </button>
      ))}

      {error && (
        <span role="alert" className="text-xs font-semibold text-inst-red">
          {error}
        </span>
      )}
    </div>
  );
}
