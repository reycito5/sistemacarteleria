"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ListPlus, ListVideo, Radio, Sparkles, Trash2 } from "lucide-react";
import {
  addPlaylistItem,
  createWorkingPlaylist,
  publishPlaylist,
  removePlaylistItem,
  reorderPlaylist,
  seedSampleContent,
  updatePlaylistItemDuration,
} from "@/lib/actions/playlist";
import type { ActionResult } from "@/lib/actions/helpers";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";
import { SortablePlaylist } from "./SortablePlaylist";

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

/** «3 min 20 s» a partir de un total de segundos. */
function humanCycle(seconds: number): string {
  if (seconds < 60) return `${seconds} s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m} min` : `${m} min ${s} s`;
}

export function PlaylistEditor({
  playlist,
  items,
  available,
}: PlaylistEditorProps) {
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
  const published = playlist?.status === "publicada";

  if (!playlist) {
    return (
      <Card>
        <EmptyState
          icon={<ListVideo size={26} />}
          title="Todavía no existe la playlist institucional"
          description="Créela una sola vez: a partir de entonces se edita y se vuelve a publicar cuantas veces haga falta."
          action={
            <Button onClick={() => run(createWorkingPlaylist)} disabled={pending} size="lg">
              <ListPlus size={17} aria-hidden />
              Crear playlist institucional
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert tone="danger" title="No se pudo completar la operación">
          {error}
        </Alert>
      )}

      {/* Cabecera de la playlist */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black text-inst-blue-top">
                {playlist.name}
              </h2>
              <Badge tone={published ? "ok" : "warn"} dot>
                {published ? "Publicada" : playlist.status}
              </Badge>
              <Badge tone="neutral">v{playlist.version}</Badge>
            </div>
            <p className="mt-1.5 text-sm text-ui-muted">
              {items.length} contenido{items.length === 1 ? "" : "s"} ·{" "}
              {humanCycle(total)} por ciclo completo
            </p>
          </div>

          <Button
            variant="danger"
            size="lg"
            onClick={() => run(() => publishPlaylist(playlist.id))}
            disabled={pending || items.length === 0}
          >
            <Radio size={17} aria-hidden />
            Publicar en las 4 pantallas
          </Button>
        </div>

        {items.length === 0 && (
          <Alert tone="warn" className="mt-4">
            Una playlist vacía no puede publicarse. Añada al menos un contenido
            desde la columna de la derecha.
          </Alert>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Orden de reproducción */}
        <Card>
          <CardHeader
            icon={<ListVideo size={18} />}
            title="Orden de reproducción"
            description="El ciclo se repite indefinidamente. Arrastre para reordenar; la duración se mide en segundos."
          />

          {items.length === 0 ? (
            <p className="mt-5 rounded-[12px] border border-dashed border-ui-border-strong bg-ui-raised px-4 py-6 text-center text-sm text-ui-muted">
              La playlist está vacía.
            </p>
          ) : (
            <div className="mt-5">
              <SortablePlaylist
                items={items}
                disabled={pending}
                onReorder={(ids) => run(() => reorderPlaylist(playlist.id, ids))}
                onDurationChange={(id, seconds) =>
                  run(() => updatePlaylistItemDuration(id, seconds))
                }
                onRemove={(id) => run(() => removePlaylistItem(id))}
              />
              <p className="mt-3 text-xs text-ui-muted">
                Arrastre por el asa de la izquierda para cambiar el orden, o use
                las flechas.
              </p>
            </div>
          )}
        </Card>

        {/* Contenidos disponibles */}
        <Card>
          <CardHeader
            icon={<ListPlus size={18} />}
            title="Contenidos aprobados"
            description="Sólo aparecen aquí los contenidos aprobados en «Plantillas»."
            actions={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => run(seedSampleContent)}
                disabled={pending}
              >
                <Sparkles size={14} aria-hidden />
                Cargar ejemplos
              </Button>
            }
          />

          {available.length === 0 ? (
            <p className="mt-5 rounded-[12px] border border-dashed border-ui-border-strong bg-ui-raised px-4 py-6 text-center text-sm leading-relaxed text-ui-muted">
              No hay contenidos aprobados. Créelos en «Plantillas y contenidos» y
              apruébelos, o pulse «Cargar ejemplos» para generar un conjunto de
              prueba.
            </p>
          ) : (
            <ul className="mt-5 space-y-2">
              {available.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center gap-3 rounded-[10px] border border-ui-border bg-ui-raised px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ui-ink">
                      {c.title}
                    </p>
                    <p className="text-xs text-ui-muted">{c.label}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => run(() => addPlaylistItem(playlist.id, c.id))}
                    disabled={pending}
                  >
                    Añadir
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <p className="flex items-center gap-2 text-xs text-ui-muted">
        <Trash2 size={13} aria-hidden />
        Quitar un contenido de la playlist no lo elimina: sigue disponible en
        «Plantillas y contenidos».
      </p>
    </div>
  );
}
