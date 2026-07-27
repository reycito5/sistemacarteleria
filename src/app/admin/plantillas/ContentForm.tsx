"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ScreenFrame } from "@/components/institutional/ScreenFrame";
import { ViewRenderer, isBareView } from "@/components/views/ViewRenderer";
import { viewContentSchema } from "@/lib/views/schemas";
import { FORM_SCHEMAS, type EditableKind } from "@/lib/views/formSchema";
import { createContentItem, updateContentItem } from "@/lib/actions/content";
import type { MediaOption } from "@/lib/data/admin";

interface ContentFormProps {
  kind: EditableKind;
  mediaOptions: MediaOption[];
  /** Datos iniciales (modo edición) */
  initial?: Record<string, unknown>;
  /** Id del contenido (modo edición) */
  contentId?: string;
}

type Values = Record<string, unknown>;

function defaultsFor(kind: EditableKind): Values {
  const values: Values = {};
  for (const f of FORM_SCHEMAS[kind].fields) {
    if (f.type === "list") values[f.key] = [];
    else if (f.type === "media") values[f.key] = undefined;
    else values[f.key] = "";
  }
  return values;
}

export function ContentForm({
  kind,
  mediaOptions,
  initial,
  contentId,
}: ContentFormProps) {
  const router = useRouter();
  const schema = FORM_SCHEMAS[kind];
  const [values, setValues] = useState<Values>({
    ...defaultsFor(kind),
    ...(initial ?? {}),
  });
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const setField = (key: string, value: unknown) =>
    setValues((v) => ({ ...v, [key]: value }));

  const setListItem = (key: string, idx: number, itemKey: string, value: string) =>
    setValues((v) => {
      const list = [...((v[key] as Record<string, string>[]) ?? [])];
      list[idx] = { ...list[idx], [itemKey]: value };
      return { ...v, [key]: list };
    });

  const addListItem = (key: string) =>
    setValues((v) => {
      const list = [...((v[key] as Record<string, string>[]) ?? [])];
      list.push({});
      return { ...v, [key]: list };
    });

  const removeListItem = (key: string, idx: number) =>
    setValues((v) => {
      const list = [...((v[key] as Record<string, string>[]) ?? [])];
      list.splice(idx, 1);
      return { ...v, [key]: list };
    });

  // Vista previa en vivo (nunca rompe: si es inválida, muestra aviso).
  const preview = useMemo(() => viewContentSchema.safeParse({ ...values, kind }), [values, kind]);

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const res = contentId
        ? await updateContentItem(contentId, kind, values)
        : await createContentItem(kind, values);
      if (!res.ok) setError(res.error);
      else router.push("/admin/plantillas");
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Editor */}
      <div>
        <div className="space-y-4">
          {schema.fields.map((f) => {
            if (f.type === "text") {
              return (
                <Field key={f.key} label={f.label}>
                  <input
                    value={(values[f.key] as string) ?? ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                    className="w-full rounded border px-3 py-2 text-sm"
                    style={{ borderColor: "var(--color-panel-border)" }}
                  />
                </Field>
              );
            }
            if (f.type === "textarea") {
              return (
                <Field key={f.key} label={f.label}>
                  <textarea
                    value={(values[f.key] as string) ?? ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                    rows={2}
                    className="w-full rounded border px-3 py-2 text-sm"
                    style={{ borderColor: "var(--color-panel-border)" }}
                  />
                </Field>
              );
            }
            if (f.type === "media") {
              const current = values[f.key] as { assetId?: string } | undefined;
              return (
                <Field key={f.key} label={f.label}>
                  <select
                    value={current?.assetId ?? ""}
                    onChange={(e) => {
                      const opt = mediaOptions.find((m) => m.id === e.target.value);
                      setField(
                        f.key,
                        opt
                          ? { assetId: opt.id, path: opt.path, src: opt.url, muted: true }
                          : undefined,
                      );
                    }}
                    className="w-full rounded border px-3 py-2 text-sm"
                    style={{ borderColor: "var(--color-panel-border)" }}
                  >
                    <option value="">— Sin medio —</option>
                    {mediaOptions.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.type === "video" ? "🎬" : "🖼"} {m.title}
                      </option>
                    ))}
                  </select>
                  {mediaOptions.length === 0 && (
                    <p className="mt-1 text-xs text-panel-muted">
                      No hay archivos. Suba videos o imágenes en la biblioteca.
                    </p>
                  )}
                </Field>
              );
            }
            if (f.type !== "list") return null;
            const list = (values[f.key] as Record<string, string>[]) ?? [];
            return (
              <div key={f.key}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-panel-ink">{f.label}</span>
                  <button
                    type="button"
                    onClick={() => addListItem(f.key)}
                    disabled={list.length >= f.max}
                    className="text-xs font-bold text-inst-blue-top disabled:opacity-40"
                  >
                    + Añadir ({list.length}/{f.max})
                  </button>
                </div>
                <div className="mt-2 space-y-3">
                  {list.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded border p-3"
                      style={{ borderColor: "var(--color-panel-border)" }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-panel-muted">
                          #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeListItem(f.key, idx)}
                          className="text-xs font-bold text-inst-red"
                        >
                          Quitar
                        </button>
                      </div>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        {f.itemFields.map((itf) => (
                          <label key={itf.key} className="block">
                            <span className="block text-xs text-panel-muted">
                              {itf.label}
                            </span>
                            <input
                              value={item[itf.key] ?? ""}
                              onChange={(e) =>
                                setListItem(f.key, idx, itf.key, e.target.value)
                              }
                              className="mt-0.5 w-full rounded border px-2 py-1 text-sm"
                              style={{ borderColor: "var(--color-panel-border)" }}
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {error && <p className="mt-4 text-sm text-inst-red">{error}</p>}
        {!preview.success && (
          <p className="mt-4 text-xs text-panel-muted">
            Complete los campos obligatorios para habilitar el guardado.
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={submit}
            disabled={pending || !preview.success}
            className="rounded px-5 py-2.5 text-sm font-bold text-inst-white disabled:opacity-50"
            style={{ background: "var(--color-inst-blue-bottom)" }}
          >
            {pending ? "Guardando…" : contentId ? "Guardar cambios" : "Crear contenido"}
          </button>
          <button
            onClick={() => router.push("/admin/plantillas")}
            className="rounded px-5 py-2.5 text-sm font-bold text-panel-ink"
            style={{ border: "1px solid var(--color-panel-border)" }}
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Vista previa en vivo */}
      <div>
        <p className="mb-2 text-sm font-bold text-panel-ink">Vista previa</p>
        <div
          className="aspect-video w-full overflow-hidden rounded-md border shadow-sm"
          style={{ borderColor: "var(--color-panel-border)" }}
        >
          {preview.success ? (
            <ScreenFrame bare={isBareView(preview.data)}>
              <ViewRenderer content={preview.data} />
            </ScreenFrame>
          ) : (
            <div className="grid h-full place-items-center bg-panel-bg text-sm text-panel-muted">
              Vista previa disponible al completar los campos.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-panel-ink">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
