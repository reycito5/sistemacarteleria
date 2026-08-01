"use client";

import { Plus, Trash2 } from "lucide-react";
import type { FormField } from "@/lib/views/formSchema";
import type { MediaOption } from "@/lib/data/admin";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { MediaPicker, type SelectedMedia } from "./MediaPicker";

type Values = Record<string, unknown>;
type ListItem = Record<string, unknown>;

interface FieldRendererProps {
  field: FormField;
  values: Values;
  mediaOptions: MediaOption[];
  onChange: (key: string, value: unknown) => void;
  contentKind: string;
}

/**
 * Dibuja un campo del descriptor de plantilla.
 *
 * Soporta texto, área de texto, selección, interruptor, medio (video o imagen)
 * y listas cuyos elementos pueden a su vez tener su propio medio o selección.
 */
export function FieldRenderer({
  field,
  values,
  mediaOptions,
  onChange,
  contentKind,
}: FieldRendererProps) {
  const id = `f-${field.key}`;

  if (field.type === "text") {
    return (
      <Field label={field.label} hint={field.hint} htmlFor={id}>
        <Input
          id={id}
          value={(values[field.key] as string) ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      </Field>
    );
  }

  if (field.type === "textarea") {
    return (
      <Field label={field.label} hint={field.hint} htmlFor={id}>
        <Textarea
          id={id}
          rows={3}
          value={(values[field.key] as string) ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      </Field>
    );
  }

  if (field.type === "select") {
    return (
      <Field label={field.label} hint={field.hint} htmlFor={id}>
        <Select
          id={id}
          value={(values[field.key] as string) ?? field.options[0]?.value ?? ""}
          onChange={(e) => onChange(field.key, e.target.value)}
        >
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </Field>
    );
  }

  if (field.type === "boolean") {
    const checked = values[field.key] !== false;
    return (
      <label className="flex cursor-pointer items-start gap-3 rounded-[12px] border border-ui-border bg-ui-raised p-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(field.key, e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-brand-ink-deep)]"
        />
        <span>
          <span className="block text-sm font-semibold text-ui-ink">
            {field.label}
          </span>
          {field.hint && (
            <span className="mt-0.5 block text-xs leading-relaxed text-ui-muted">
              {field.hint}
            </span>
          )}
        </span>
      </label>
    );
  }

  if (field.type === "media") {
    return (
      <Field
        label={field.label}
        hint={
          field.hint ??
          "Elija un archivo de la biblioteca. Sirve tanto un video como una imagen."
        }
      >
        <MediaPicker
          options={mediaOptions}
          expectedCategory={contentKind}
          value={values[field.key] as { assetId?: string } | undefined}
          onChange={(media: SelectedMedia | undefined) =>
            onChange(field.key, media)
          }
        />
      </Field>
    );
  }

  // --- Lista ---------------------------------------------------------------
  if (field.type !== "list") return null;

  const list = (values[field.key] as ListItem[]) ?? [];

  const setItem = (idx: number, key: string, value: unknown) => {
    const next = [...list];
    next[idx] = { ...next[idx], [key]: value };
    onChange(field.key, next);
  };

  const addItem = () => onChange(field.key, [...list, {}]);

  const removeItem = (idx: number) =>
    onChange(
      field.key,
      list.filter((_, i) => i !== idx),
    );

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ui-ink">{field.label}</p>
          {field.hint && (
            <p className="mt-0.5 text-xs text-ui-muted">{field.hint}</p>
          )}
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={addItem}
          disabled={list.length >= field.max}
        >
          <Plus size={14} aria-hidden />
          Añadir ({list.length}/{field.max})
        </Button>
      </div>

      {list.length === 0 ? (
        <p className="mt-2 rounded-[10px] border border-dashed border-ui-border-strong bg-ui-raised px-3 py-3 text-xs text-ui-muted">
          Sin elementos. Pulse «Añadir» para crear el primero.
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          {list.map((item, idx) => (
            <div
              key={idx}
              className="rounded-[12px] border border-ui-border bg-ui-raised p-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-info-soft text-[11px] font-black text-brand-ink">
                  {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="inline-flex items-center gap-1.5 rounded-[8px] px-2 py-1 text-xs font-bold text-brand-red transition hover:bg-danger-soft"
                >
                  <Trash2 size={12} aria-hidden />
                  Quitar
                </button>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {field.itemFields.map((itf) => {
                  const itemId = `f-${field.key}-${idx}-${itf.key}`;

                  if (itf.type === "media") {
                    return (
                      <div key={itf.key} className="sm:col-span-2">
                        <Field label={itf.label}>
                          <MediaPicker
                            options={mediaOptions}
                            expectedCategory={contentKind}
                            value={
                              item[itf.key] as { assetId?: string } | undefined
                            }
                            onChange={(media) => setItem(idx, itf.key, media)}
                          />
                        </Field>
                      </div>
                    );
                  }

                  if (itf.type === "select") {
                    const options = itf.options ?? [];
                    return (
                      <Field key={itf.key} label={itf.label} htmlFor={itemId}>
                        <Select
                          id={itemId}
                          value={
                            (item[itf.key] as string) ??
                            options[0]?.value ??
                            ""
                          }
                          onChange={(e) =>
                            setItem(idx, itf.key, e.target.value)
                          }
                        >
                          {options.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    );
                  }

                  return (
                    <Field key={itf.key} label={itf.label} htmlFor={itemId}>
                      <Input
                        id={itemId}
                        value={(item[itf.key] as string) ?? ""}
                        onChange={(e) => setItem(idx, itf.key, e.target.value)}
                      />
                    </Field>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
