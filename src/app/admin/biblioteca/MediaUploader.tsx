"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { registerMediaAsset } from "@/lib/actions/media";
import {
  buildStoragePath,
  is16by9,
  validateFile,
} from "@/lib/media/validation";

interface Dimensions {
  width: number;
  height: number;
  durationSeconds?: number;
}

/** Lee dimensiones (y duración de video) del archivo en el navegador. */
function readDimensions(file: File, kind: "video" | "image"): Promise<Dimensions> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    if (kind === "image") {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("No se pudo leer la imagen."));
      };
      img.src = url;
    } else {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        resolve({
          width: video.videoWidth,
          height: video.videoHeight,
          durationSeconds: video.duration,
        });
        URL.revokeObjectURL(url);
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("No se pudo leer el video."));
      };
      video.src = url;
    }
  });
}

export function MediaUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleUpload = async () => {
    setError(null);
    setStatus(null);
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Seleccione un archivo.");
      return;
    }

    const check = validateFile({ name: file.name, type: file.type, size: file.size });
    if (!check.ok || !check.mediaType) {
      setError(check.error ?? "Archivo no válido.");
      return;
    }
    const mediaType = check.mediaType;

    let dims: Dimensions | null = null;
    try {
      dims = await readDimensions(file, mediaType);
    } catch {
      dims = null; // se registra como pendiente si no se pudo medir
    }

    if (dims && !is16by9(dims.width, dims.height)) {
      setError(
        `Resolución ${dims.width}×${dims.height} no es 16:9. Use 1920×1080. ` +
          "Se puede subir igualmente, pero quedará pendiente de revisión.",
      );
    }

    let supabase;
    try {
      supabase = createClient();
    } catch {
      setError("Supabase no configurado. Configure el entorno para subir archivos.");
      return;
    }

    const path = buildStoragePath(mediaType, file.name);
    setStatus("Subiendo archivo…");

    const { error: upErr } = await supabase.storage
      .from("media")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (upErr) {
      setError(`Error al subir: ${upErr.message}`);
      setStatus(null);
      return;
    }

    setStatus("Registrando en la biblioteca…");
    startTransition(async () => {
      const res = await registerMediaAsset({
        title: title.trim() || file.name,
        storagePath: path,
        mediaType,
        mimeType: file.type,
        fileSize: file.size,
        width: dims?.width ?? null,
        height: dims?.height ?? null,
        durationSeconds: dims?.durationSeconds ?? null,
      });
      if (!res.ok) {
        setError(res.error);
        setStatus(null);
        return;
      }
      setStatus("Archivo añadido a la biblioteca.");
      setTitle("");
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    });
  };

  return (
    <div
      className="max-w-xl rounded-md border bg-white p-5"
      style={{ borderColor: "var(--color-panel-border)" }}
    >
      <h2 className="text-sm font-bold text-panel-ink">Subir archivo</h2>
      <p className="mt-1 text-xs text-panel-muted">
        Videos MP4 (H.264), imágenes JPG/PNG/WebP. Resolución recomendada 1920×1080 (16:9).
      </p>

      <label className="mt-4 block">
        <span className="block text-sm font-semibold text-panel-ink">Título</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Opcional (por defecto, el nombre del archivo)"
          className="mt-1 w-full rounded border px-3 py-2 text-sm"
          style={{ borderColor: "var(--color-panel-border)" }}
        />
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,image/jpeg,image/png,image/webp"
        className="mt-3 block w-full text-sm"
      />

      {error && <p className="mt-3 text-sm text-inst-red">{error}</p>}
      {status && <p className="mt-3 text-sm text-inst-blue-top">{status}</p>}

      <button
        onClick={handleUpload}
        disabled={pending}
        className="mt-4 rounded px-5 py-2.5 text-sm font-bold text-inst-white disabled:opacity-60"
        style={{ background: "var(--color-inst-blue-bottom)" }}
      >
        {pending ? "Procesando…" : "Subir a la biblioteca"}
      </button>
    </div>
  );
}
