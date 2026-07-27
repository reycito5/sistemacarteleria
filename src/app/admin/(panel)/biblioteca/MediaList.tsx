"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  FileVideo,
  ImageIcon,
  LibraryBig,
  Play,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { deleteMediaAsset } from "@/lib/actions/media";
import type { MediaAssetSummary } from "@/lib/data/admin";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Field";

function humanSize(bytes: number | null): string {
  if (!bytes) return "—";
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

function humanDuration(seconds: number | null): string | null {
  if (!seconds || !Number.isFinite(seconds)) return null;
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

const STATUS_TONE: Record<string, BadgeTone> = {
  validado: "ok",
  pendiente: "warn",
  rechazado: "danger",
  archivado: "neutral",
};

type Filter = "todos" | "video" | "image";

export function MediaList({ assets }: { assets: MediaAssetSummary[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const [preview, setPreview] = useState<MediaAssetSummary | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const remove = (id: string) => {
    setError(null);
    startTransition(async () => {
      const res = await deleteMediaAsset(id);
      setConfirmId(null);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  };

  const visible = assets.filter((a) => {
    const matchesType = filter === "todos" || a.type === filter;
    const matchesQuery = a.title.toLowerCase().includes(query.trim().toLowerCase());
    return matchesType && matchesQuery;
  });

  if (assets.length === 0) {
    return (
      <EmptyState
        icon={<LibraryBig size={26} />}
        title="La biblioteca está vacía"
        description="Suba el primer video o imagen con el formulario de arriba. Después podrá usarlo al armar una plantilla."
      />
    );
  }

  const FILTERS: { value: Filter; label: string }[] = [
    { value: "todos", label: `Todos (${assets.length})` },
    {
      value: "video",
      label: `Videos (${assets.filter((a) => a.type === "video").length})`,
    },
    {
      value: "image",
      label: `Imágenes (${assets.filter((a) => a.type === "image").length})`,
    },
  ];

  return (
    <div>
      {error && (
        <Alert tone="danger" className="mb-4" title="No se pudo eliminar">
          {error}
        </Alert>
      )}

      {/* Filtros y búsqueda */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-[10px] border border-ui-border bg-ui-raised p-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={[
                "rounded-[7px] px-3 py-1.5 text-xs font-bold transition",
                filter === f.value
                  ? "bg-ui-surface text-inst-blue-top shadow-[var(--shadow-ui-sm)]"
                  : "text-ui-muted hover:text-ui-ink",
              ].join(" ")}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative ml-auto w-full sm:w-64">
          <Search
            size={15}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ui-faint"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título…"
            aria-label="Buscar en la biblioteca"
            className="pl-9"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<Search size={26} />}
          title="Ningún archivo coincide"
          description="Pruebe con otro término de búsqueda o cambie el filtro."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((a) => {
            const duration = humanDuration(a.durationSeconds);
            const confirming = confirmId === a.id;
            return (
              <li
                key={a.id}
                className="group overflow-hidden rounded-[14px] border border-ui-border bg-ui-surface transition hover:border-inst-blue/30 hover:shadow-[var(--shadow-ui)]"
              >
                <button
                  type="button"
                  onClick={() => setPreview(a)}
                  className="relative block aspect-video w-full bg-inst-blue-bottom"
                  aria-label={`Previsualizar ${a.title}`}
                >
                  {a.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.url}
                      alt={a.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <video
                      src={a.url}
                      poster={a.thumbnailUrl ?? undefined}
                      className="h-full w-full object-cover"
                      muted
                      preload="metadata"
                    />
                  )}

                  <span className="absolute inset-0 grid place-items-center bg-black/25 opacity-0 transition group-hover:opacity-100">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-white/95 text-inst-blue-bottom">
                      <Play size={20} className="ml-0.5" fill="currentColor" />
                    </span>
                  </span>

                  {duration && (
                    <span className="ui-tnum absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-bold text-white">
                      {duration}
                    </span>
                  )}
                </button>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 flex-1 truncate text-sm font-bold text-inst-blue-top">
                      {a.title}
                    </p>
                    <Badge tone={STATUS_TONE[a.status] ?? "neutral"}>
                      {a.status}
                    </Badge>
                  </div>

                  <p className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-ui-muted">
                    <span className="flex items-center gap-1">
                      {a.type === "video" ? (
                        <FileVideo size={12} aria-hidden />
                      ) : (
                        <ImageIcon size={12} aria-hidden />
                      )}
                      {a.type === "video" ? "Video" : "Imagen"}
                    </span>
                    <span>
                      {a.width && a.height ? `${a.width}×${a.height}` : "—"}
                    </span>
                    <span>{humanSize(a.fileSize)}</span>
                  </p>

                  {confirming ? (
                    <div className="mt-3 flex items-center gap-2 rounded-[10px] bg-danger-soft p-2.5">
                      <p className="flex-1 text-xs font-semibold text-danger">
                        ¿Eliminar definitivamente?
                      </p>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => remove(a.id)}
                        disabled={pending}
                      >
                        Sí, eliminar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setConfirmId(null)}
                        disabled={pending}
                      >
                        No
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmId(a.id)}
                      disabled={pending}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-inst-red transition hover:underline disabled:opacity-50"
                    >
                      <Trash2 size={13} aria-hidden />
                      Eliminar
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Vista previa a tamaño grande */}
      {preview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Vista previa de ${preview.title}`}
          className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <div
            className="ui-animate-in w-full max-w-3xl overflow-hidden rounded-[16px] bg-ui-surface"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-ui-border px-5 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-inst-blue-top">
                  {preview.title}
                </p>
                <p className="text-xs text-ui-muted">
                  {preview.width && preview.height
                    ? `${preview.width}×${preview.height}`
                    : "Resolución desconocida"}{" "}
                  · {humanSize(preview.fileSize)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                aria-label="Cerrar vista previa"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-ui-muted transition hover:bg-ui-canvas hover:text-ui-ink"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-black">
              {preview.type === "video" ? (
                <VideoPlayer
                  src={preview.url}
                  poster={preview.thumbnailUrl ?? undefined}
                  title={preview.title}
                  className="rounded-none"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.url}
                  alt={preview.title}
                  className="aspect-video w-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
