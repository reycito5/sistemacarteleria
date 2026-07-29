"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, FileVideo, ImageIcon, LibraryBig, Search, X } from "lucide-react";
import type { MediaOption } from "@/lib/data/admin";
import { Input } from "@/components/ui/Field";

export interface SelectedMedia {
  assetId: string;
  path: string;
  src: string;
  subtitlePath?: string;
  muted: boolean;
}

interface MediaPickerProps {
  options: MediaOption[];
  value?: { assetId?: string };
  onChange: (media: SelectedMedia | undefined) => void;
}

/**
 * Selector visual de medios: en lugar de una lista desplegable de nombres,
 * muestra las miniaturas reales de la biblioteca. Así se ve qué se está
 * eligiendo antes de asignarlo a la pantalla.
 */
export function MediaPicker({ options, value, onChange }: MediaPickerProps) {
  const [query, setQuery] = useState("");

  if (options.length === 0) {
    return (
      <div className="rounded-[12px] border border-dashed border-ui-border-strong bg-ui-raised px-4 py-6 text-center">
        <LibraryBig size={24} className="mx-auto text-ui-faint" aria-hidden />
        <p className="mt-2 text-sm font-semibold text-ui-ink">
          La biblioteca está vacía
        </p>
        <p className="mt-1 text-xs leading-relaxed text-ui-muted">
          Primero suba el video o la imagen en{" "}
          <Link
            href="/admin/biblioteca"
            className="font-bold text-brand-red hover:underline"
          >
            Biblioteca multimedia
          </Link>
          . Después vuelva aquí y aparecerá en esta lista.
        </p>
      </div>
    );
  }

  const visible = options.filter((m) =>
    m.title.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const select = (option: MediaOption) => {
    if (value?.assetId === option.id) {
      onChange(undefined); // volver a pulsar lo deselecciona
      return;
    }
    onChange({
      assetId: option.id,
      path: option.path,
      src: option.url,
      subtitlePath: option.subtitlePath ?? undefined,
      muted: true,
    });
  };

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Search
            size={14}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ui-faint"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en la biblioteca…"
            aria-label="Buscar archivo"
            className="h-9 pl-8 text-xs"
          />
        </div>
        {value?.assetId && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[10px] border border-ui-border-strong px-3 text-xs font-bold text-ui-muted transition hover:border-brand-red/40 hover:text-brand-red"
          >
            <X size={13} aria-hidden />
            Quitar
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="py-4 text-center text-xs text-ui-muted">
          Ningún archivo coincide con «{query}».
        </p>
      ) : (
        <ul className="ui-scroll grid max-h-64 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
          {visible.map((m) => {
            const selected = value?.assetId === m.id;
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => select(m)}
                  aria-pressed={selected}
                  className={[
                    "group relative block w-full overflow-hidden rounded-[10px] border-2 text-left transition",
                    selected
                      ? "border-brand-ink-soft shadow-[var(--shadow-ui)]"
                      : "border-ui-border hover:border-brand-ink-soft/40",
                  ].join(" ")}
                >
                  <span className="block aspect-video bg-brand-ink-deep">
                    {m.type === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <video
                        src={m.url}
                        muted
                        preload="metadata"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </span>

                  {selected && (
                    <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-brand-ink-soft text-brand-white">
                      <Check size={12} strokeWidth={3} aria-hidden />
                    </span>
                  )}

                  <span className="flex items-center gap-1.5 bg-ui-surface px-2 py-1.5">
                    {m.type === "video" ? (
                      <FileVideo size={11} className="shrink-0 text-ui-faint" aria-hidden />
                    ) : (
                      <ImageIcon size={11} className="shrink-0 text-ui-faint" aria-hidden />
                    )}
                    <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-ui-ink">
                      {m.title}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
