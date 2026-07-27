"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addPlaylistItem,
  createWorkingPlaylist,
  movePlaylistItem,
  publishPlaylist,
  removePlaylistItem,
  seedSampleContent,
  updatePlaylistItemDuration,
} from "@/lib/actions/playlist";
import type { ActionResult } from "@/lib/actions/helpers";

export interface EditorItem {
  id: string;
  contentTitle: string;
  durationSeconds: number;
}
export interface EditorContent {
  id: string;
  title: string;
  label: string;
}
export interface EditorPlaylist {
  id: string;
  name: string;
  status: string;
  version: number;
}

interface PlaylistEditorProps {
  playlist: EditorPlaylist | null;
  items: EditorItem[];
  available: EditorContent[];
}

export function PlaylistEditor({ playlist, items, available }: PlaylistEditorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<ActionResult<unknown>>) => {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  };

  const total = items.reduce((a, i) => a + i.durationSeconds, 0);

  return (
    <div className="space-y-6">
      {error && (
        <div
          className="rounded-md border-l-4 bg-white px-4 py-3 text-sm text-inst-red"
          style={{ borderColor: "var(--color-inst-red)" }}
        >
          {error}
        </div>
      )}

      {!playlist ? (
        <div
          className="rounded-md border bg-white p-6"
          style={{ borderColor: "var(--color-ui-border)" }}
        >
          <p className="text-sm text-ui-muted">
            Aún no existe una playlist institucional. Cree una para empezar.
          </p>
          <button
            onClick={() => run(createWorkingPlaylist)}
            disabled={pending}
            className="mt-4 rounded px-4 py-2 text-sm font-bold text-inst-white disabled:opacity-60"
            style={{ background: "var(--color-inst-blue-bottom)" }}
          >
            Crear playlist institucional
          </button>
        </div>
      ) : (
        <>
          <div
            className="flex flex-wrap items-center justify-between gap-4 rounded-md border bg-white p-5"
            style={{ borderColor: "var(--color-ui-border)" }}
          >
            <div>
              <p className="font-extrabold text-inst-blue-top">{playlist.name}</p>
              <p className="text-xs text-ui-muted">
                Estado: <strong>{playlist.status}</strong> · versión {playlist.version} ·{" "}
                {items.length} contenidos · {total}s por ciclo
              </p>
            </div>
            <button
              onClick={() => run(() => publishPlaylist(playlist.id))}
              disabled={pending || items.length === 0}
              className="rounded px-5 py-2.5 text-sm font-bold text-inst-white disabled:opacity-50"
              style={{ background: "var(--color-inst-red)" }}
            >
              Publicar en las 4 pantallas
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Contenidos en la playlist */}
            <section
              className="rounded-md border bg-white p-5"
              style={{ borderColor: "var(--color-ui-border)" }}
            >
              <h2 className="text-sm font-bold text-ui-ink">Orden de reproducción</h2>
              {items.length === 0 ? (
                <p className="mt-3 text-sm text-ui-muted">
                  Vacía. Añada contenidos desde la derecha.
                </p>
              ) : (
                <ol className="mt-3 space-y-2">
                  {items.map((it, i) => (
                    <li
                      key={it.id}
                      className="flex items-center gap-2 rounded border px-3 py-2"
                      style={{ borderColor: "var(--color-ui-border)" }}
                    >
                      <span className="w-6 text-sm font-bold text-ui-muted">
                        {i + 1}
                      </span>
                      <span className="flex-1 text-sm font-semibold">{it.contentTitle}</span>
                      <input
                        type="number"
                        min={1}
                        defaultValue={it.durationSeconds}
                        onBlur={(e) =>
                          run(() =>
                            updatePlaylistItemDuration(it.id, Number(e.target.value)),
                          )
                        }
                        className="w-16 rounded border px-2 py-1 text-sm"
                        style={{ borderColor: "var(--color-ui-border)" }}
                        aria-label="Duración en segundos"
                      />
                      <span className="text-xs text-ui-muted">s</span>
                      <button
                        onClick={() => run(() => movePlaylistItem(playlist.id, it.id, "up"))}
                        disabled={pending || i === 0}
                        className="px-1.5 text-ui-muted disabled:opacity-30"
                        aria-label="Subir"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => run(() => movePlaylistItem(playlist.id, it.id, "down"))}
                        disabled={pending || i === items.length - 1}
                        className="px-1.5 text-ui-muted disabled:opacity-30"
                        aria-label="Bajar"
                      >
                        ▼
                      </button>
                      <button
                        onClick={() => run(() => removePlaylistItem(it.id))}
                        disabled={pending}
                        className="px-1.5 font-bold text-inst-red"
                        aria-label="Quitar"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            {/* Biblioteca de contenidos disponibles */}
            <section
              className="rounded-md border bg-white p-5"
              style={{ borderColor: "var(--color-ui-border)" }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-ui-ink">Contenidos disponibles</h2>
                <button
                  onClick={() => run(seedSampleContent)}
                  disabled={pending}
                  className="rounded px-3 py-1.5 text-xs font-bold text-inst-blue-top"
                  style={{ border: "1px solid var(--color-ui-border)" }}
                >
                  Cargar ejemplos
                </button>
              </div>
              {available.length === 0 ? (
                <p className="mt-3 text-sm text-ui-muted">
                  No hay contenidos. Use «Cargar ejemplos» para generarlos desde las
                  plantillas.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {available.map((c) => (
                    <li
                      key={c.id}
                      className="flex items-center gap-2 rounded border px-3 py-2"
                      style={{ borderColor: "var(--color-ui-border)" }}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{c.title}</p>
                        <p className="text-xs text-ui-muted">{c.label}</p>
                      </div>
                      <button
                        onClick={() => run(() => addPlaylistItem(playlist.id, c.id))}
                        disabled={pending}
                        className="rounded px-3 py-1.5 text-xs font-bold text-inst-white disabled:opacity-60"
                        style={{ background: "var(--color-inst-blue-bottom)" }}
                      >
                        Añadir
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
