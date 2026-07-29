"use client";

import { useRef, useState } from "react";
import { ImageIcon, Trash2, UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { buildStoragePath } from "@/lib/media/validation";
import { Button } from "@/components/ui/Button";

interface LogoUploaderProps {
  label: string;
  hint: string;
  /** URL firmada del logo actual, si lo hay. */
  currentUrl: string | null;
  /** Ruta actual en el bucket; se propaga al guardar. */
  value: string | null;
  onChange: (path: string | null) => void;
}

const ACCEPT = "image/png,image/webp,image/jpeg,image/svg+xml";
const MAX_BYTES = 3 * 1024 * 1024;

/**
 * Carga de un logo institucional al bucket `media`.
 *
 * Sube el archivo de inmediato y devuelve su ruta; el guardado definitivo de
 * la identidad ocurre al enviar el formulario.
 */
export function LogoUploader({
  label,
  hint,
  currentUrl,
  value,
  onChange,
}: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shownUrl = preview ?? (value ? currentUrl : null);

  const upload = async (file: File) => {
    setError(null);

    if (!ACCEPT.split(",").includes(file.type)) {
      setError("Use PNG, WebP, JPG o SVG.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("El logo no debe superar los 3 MB.");
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      const path = `logo/${buildStoragePath("image", file.name).replace(/^image\//, "")}`;
      const { error: upErr } = await supabase.storage
        .from("media")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;

      setPreview(URL.createObjectURL(file));
      onChange(path);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo subir el logo.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="text-sm font-semibold text-ui-ink">{label}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-ui-muted">{hint}</p>

      <div className="mt-3 flex items-center gap-4">
        <div className="grid h-[72px] w-[120px] shrink-0 place-items-center overflow-hidden rounded-[10px] border border-ui-border bg-brand-ink-deep">
          {shownUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={shownUrl}
              alt=""
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <ImageIcon size={22} className="text-white/40" aria-hidden />
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            <UploadCloud size={15} aria-hidden />
            {busy ? "Subiendo…" : value ? "Cambiar" : "Subir logo"}
          </Button>
          {value && (
            <Button
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={() => {
                setPreview(null);
                onChange(null);
              }}
            >
              <Trash2 size={15} aria-hidden />
              Quitar
            </Button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
        }}
      />

      {error && (
        <p role="alert" className="mt-2 text-xs font-semibold text-brand-red">
          {error}
        </p>
      )}
    </div>
  );
}
