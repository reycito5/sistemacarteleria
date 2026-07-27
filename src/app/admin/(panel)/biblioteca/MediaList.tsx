"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteMediaAsset } from "@/lib/actions/media";
import type { MediaAssetSummary } from "@/lib/data/admin";

function humanSize(bytes: number | null): string {
  if (!bytes) return "—";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

const STATUS_COLOR: Record<string, string> = {
  validado: "#137333",
  pendiente: "#B06000",
  rechazado: "#C52322",
  archivado: "#5b6172",
};

export function MediaList({ assets }: { assets: MediaAssetSummary[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const remove = (id: string) => {
    setError(null);
    startTransition(async () => {
      const res = await deleteMediaAsset(id);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  };

  if (assets.length === 0) {
    return (
      <p className="text-sm text-ui-muted">
        La biblioteca está vacía. Suba el primer video o imagen.
      </p>
    );
  }

  return (
    <div>
      {error && <p className="mb-3 text-sm text-inst-red">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((a) => (
          <div
            key={a.id}
            className="overflow-hidden rounded-md border bg-white"
            style={{ borderColor: "var(--color-ui-border)" }}
          >
            <div className="aspect-video bg-inst-blue-bottom">
              {a.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.url} alt={a.title} className="h-full w-full object-cover" />
              ) : (
                <video src={a.url} className="h-full w-full object-cover" muted />
              )}
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-bold text-inst-blue-top">{a.title}</p>
              <p className="mt-1 flex items-center gap-2 text-xs text-ui-muted">
                <span
                  className="font-bold"
                  style={{ color: STATUS_COLOR[a.status] ?? "#5b6172" }}
                >
                  {a.status}
                </span>
                · {a.type} · {a.width && a.height ? `${a.width}×${a.height}` : "—"} ·{" "}
                {humanSize(a.fileSize)}
              </p>
              <button
                onClick={() => remove(a.id)}
                disabled={pending}
                className="mt-3 text-xs font-bold text-inst-red disabled:opacity-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
