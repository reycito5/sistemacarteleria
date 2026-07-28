"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
  type DragEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  Captions,
  CheckCircle2,
  FileVideo,
  ImageIcon,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { registerMediaAsset } from "@/lib/actions/media";
import {
  MEDIA_LIMITS,
  buildStoragePath,
  is16by9,
  validateFile,
} from "@/lib/media/validation";
import type { MediaType } from "@/lib/supabase/database.types";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";

interface Dimensions {
  width: number;
  height: number;
  durationSeconds?: number;
}

interface Picked {
  file: File;
  mediaType: MediaType;
  previewUrl: string;
  dims: Dimensions | null;
}

const ACCEPT = [...MEDIA_LIMITS.video.mimes, ...MEDIA_LIMITS.image.mimes].join(
  ",",
);

function humanSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

function humanDuration(seconds?: number): string | null {
  if (!seconds || !Number.isFinite(seconds)) return null;
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

/** Lee dimensiones (y duración de video) del archivo en el navegador. */
function readDimensions(file: File, kind: MediaType): Promise<Dimensions> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const done = (value: Dimensions) => {
      URL.revokeObjectURL(url);
      resolve(value);
    };
    const fail = (message: string) => {
      URL.revokeObjectURL(url);
      reject(new Error(message));
    };

    if (kind === "image") {
      const img = new Image();
      img.onload = () =>
        done({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => fail("No se pudo leer la imagen.");
      img.src = url;
    } else {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () =>
        done({
          width: video.videoWidth,
          height: video.videoHeight,
          durationSeconds: video.duration,
        });
      video.onerror = () => fail("No se pudo leer el video.");
      video.src = url;
    }
  });
}

/**
 * Sube el archivo con barra de progreso real.
 *
 * Se pide a Supabase una URL firmada de subida y se envía por XMLHttpRequest,
 * que sí informa del progreso byte a byte (fetch no lo hace al subir).
 */
function uploadWithProgress(
  signedUrl: string,
  file: File,
  onProgress: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signedUrl, true);
    xhr.setRequestHeader("content-type", file.type);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`El servidor respondió ${xhr.status}.`));
    xhr.onerror = () => reject(new Error("Fallo de red durante la subida."));
    xhr.onabort = () => reject(new Error("Subida cancelada."));
    xhr.send(file);
  });
}

export function MediaUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const subInputRef = useRef<HTMLInputElement>(null);

  const [picked, setPicked] = useState<Picked | null>(null);
  const [subtitleName, setSubtitleName] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const busy = progress !== null || pending;

  // Libera la URL de vista previa al cambiar de archivo o al desmontar.
  useEffect(() => {
    const url = picked?.previewUrl;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [picked?.previewUrl]);

  const reset = useCallback(() => {
    setPicked(null);
    setSubtitleName(null);
    setTitle("");
    setProgress(null);
    setStatus(null);
    setWarning(null);
    if (inputRef.current) inputRef.current.value = "";
    if (subInputRef.current) subInputRef.current.value = "";
  }, []);

  /** Valida el archivo elegido y prepara la vista previa. */
  const acceptFile = useCallback(async (file: File) => {
    setError(null);
    setSuccess(null);
    setWarning(null);

    const check = validateFile({
      name: file.name,
      type: file.type,
      size: file.size,
    });
    if (!check.ok || !check.mediaType) {
      setError(check.error ?? "Archivo no válido.");
      return;
    }

    let dims: Dimensions | null = null;
    try {
      dims = await readDimensions(file, check.mediaType);
    } catch {
      dims = null; // se registrará como pendiente de revisión
    }

    if (dims && !is16by9(dims.width, dims.height)) {
      setWarning(
        `La resolución ${dims.width}×${dims.height} no es 16:9. Se puede subir, ` +
          "pero quedará marcada como pendiente de revisión: en el televisor " +
          "aparecerán franjas o se recortará. Lo recomendado es 1920×1080.",
      );
    }

    setPicked({
      file,
      mediaType: check.mediaType,
      previewUrl: URL.createObjectURL(file),
      dims,
    });
    setTitle((t) => t || file.name.replace(/\.[^.]+$/, ""));
  }, []);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void acceptFile(file);
  };

  const handleUpload = async () => {
    if (!picked) {
      setError("Seleccione un archivo.");
      return;
    }
    setError(null);
    setSuccess(null);

    const { file, mediaType, dims } = picked;

    let supabase;
    try {
      supabase = createClient();
    } catch {
      setError(
        "Supabase no está configurado. Defina las variables de entorno para poder subir archivos.",
      );
      return;
    }

    const path = buildStoragePath(mediaType, file.name);
    setStatus("Subiendo archivo…");
    setProgress(0);

    // 1) Subida del archivo principal, con progreso real.
    try {
      const { data: signed, error: signErr } = await supabase.storage
        .from("media")
        .createSignedUploadUrl(path);

      if (signErr || !signed) throw signErr ?? new Error("Sin URL de subida.");
      await uploadWithProgress(signed.signedUrl, file, setProgress);
    } catch (err) {
      setError(
        `No se pudo subir el archivo: ${
          err instanceof Error ? err.message : "error desconocido"
        }`,
      );
      setProgress(null);
      setStatus(null);
      return;
    }

    // 2) Subtítulos opcionales (.vtt) para videos.
    let subtitlePath: string | null = null;
    const subFile = subInputRef.current?.files?.[0];
    if (mediaType === "video" && subFile) {
      if (!/\.vtt$/i.test(subFile.name)) {
        setError("Los subtítulos deben ser un archivo .vtt");
        setProgress(null);
        setStatus(null);
        return;
      }
      setStatus("Subiendo subtítulos…");
      const sp = `subtitle/${path
        .replace(/^video\//, "")
        .replace(/\.\w+$/, "")}.vtt`;
      const { error: subErr } = await supabase.storage
        .from("media")
        .upload(sp, subFile, { contentType: "text/vtt", upsert: false });
      if (subErr) {
        setError(`Error al subir los subtítulos: ${subErr.message}`);
        setProgress(null);
        setStatus(null);
        return;
      }
      subtitlePath = sp;
    }

    // 3) Registro en la biblioteca.
    setStatus("Registrando en la biblioteca…");
    const finalTitle = title.trim() || file.name;
    startTransition(async () => {
      const res = await registerMediaAsset({
        title: finalTitle,
        storagePath: path,
        mediaType,
        mimeType: file.type,
        fileSize: file.size,
        width: dims?.width ?? null,
        height: dims?.height ?? null,
        durationSeconds: dims?.durationSeconds ?? null,
        subtitlePath,
      });
      if (!res.ok) {
        setError(res.error);
        setProgress(null);
        setStatus(null);
        return;
      }
      setSuccess(
        `«${finalTitle}» ya está en la biblioteca. El siguiente paso es usarlo ` +
          "en una plantilla para que llegue a las pantallas.",
      );
      reset();
      router.refresh();
    });
  };

  const duration = humanDuration(picked?.dims?.durationSeconds);

  return (
    <div className="ui-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-info-soft text-brand-ink">
          <UploadCloud size={18} aria-hidden />
        </span>
        <div>
          <h2 className="text-base font-extrabold text-brand-ink">
            Subir video o imagen
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-ui-muted">
            Videos MP4 (H.264) hasta 500 MB e imágenes JPG, PNG o WebP hasta
            15 MB. Resolución recomendada: <strong>1920×1080 (16:9)</strong>.
          </p>
        </div>
      </div>

      {/* Zona de arrastre / selección */}
      {!picked ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={[
            "mt-5 rounded-[14px] border-2 border-dashed px-6 py-10 text-center transition",
            dragging
              ? "border-brand-ink-soft bg-info-soft"
              : "border-ui-border-strong bg-ui-raised hover:border-brand-ink-soft/45",
          ].join(" ")}
        >
          <UploadCloud
            size={34}
            className="mx-auto text-brand-ink/60"
            aria-hidden
          />
          <p className="mt-3 text-sm font-bold text-brand-ink">
            Arrastre el archivo aquí
          </p>
          <p className="mt-1 text-xs text-ui-muted">
            o selecciónelo desde su equipo
          </p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => inputRef.current?.click()}
          >
            <UploadCloud size={16} aria-hidden />
            Elegir archivo
          </Button>
        </div>
      ) : (
        /* Vista previa del archivo elegido */
        <div className="mt-5 overflow-hidden rounded-[14px] border border-ui-border">
          <div className="relative aspect-video bg-brand-ink-deep">
            {picked.mediaType === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={picked.previewUrl}
                alt=""
                className="h-full w-full object-contain"
              />
            ) : (
              <video
                src={picked.previewUrl}
                controls
                muted
                className="h-full w-full object-contain"
              />
            )}
            <Badge
              tone={picked.mediaType === "video" ? "info" : "gold"}
              className="absolute left-3 top-3 bg-white/95"
            >
              {picked.mediaType === "video" ? "Video" : "Imagen"}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-ui-border bg-ui-raised px-4 py-3 text-xs text-ui-muted">
            <span className="flex items-center gap-1.5 font-semibold text-ui-ink">
              {picked.mediaType === "video" ? (
                <FileVideo size={14} aria-hidden />
              ) : (
                <ImageIcon size={14} aria-hidden />
              )}
              {picked.file.name}
            </span>
            <span>{humanSize(picked.file.size)}</span>
            {picked.dims && (
              <span>
                {picked.dims.width}×{picked.dims.height}
              </span>
            )}
            {duration && <span>{duration}</span>}
            <button
              type="button"
              onClick={reset}
              disabled={busy}
              className="ml-auto inline-flex items-center gap-1.5 font-semibold text-brand-red transition hover:underline disabled:opacity-50"
            >
              <Trash2 size={14} aria-hidden />
              Quitar
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void acceptFile(file);
        }}
      />

      {/* Metadatos */}
      {picked && (
        <div className="mt-5 space-y-4">
          <Field
            label="Título en la biblioteca"
            htmlFor="media-title"
            hint="Con este nombre lo encontrará al armar una plantilla."
          >
            <Input
              id="media-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={picked.file.name}
              disabled={busy}
            />
          </Field>

          {picked.mediaType === "video" && (
            <Field
              label="Subtítulos (.vtt)"
              hint="Opcional, pero recomendable: en el televisor el video va sin sonido."
            >
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={busy}
                  onClick={() => subInputRef.current?.click()}
                >
                  <Captions size={15} aria-hidden />
                  {subtitleName ? "Cambiar archivo" : "Añadir subtítulos"}
                </Button>
                {subtitleName && (
                  <span className="text-xs font-semibold text-ui-ink">
                    {subtitleName}
                  </span>
                )}
              </div>
              <input
                ref={subInputRef}
                type="file"
                accept=".vtt,text/vtt"
                className="sr-only"
                onChange={(e) =>
                  setSubtitleName(e.target.files?.[0]?.name ?? null)
                }
              />
            </Field>
          )}
        </div>
      )}

      {/* Progreso real de la subida */}
      {progress !== null && (
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-semibold text-ui-ink">
            <span>{status}</span>
            <span className="ui-tnum">{progress}%</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ui-border">
            <div
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-full rounded-full bg-brand-ink-deep transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {warning && (
        <Alert tone="warn" className="mt-4" title="Revise la resolución">
          {warning}
        </Alert>
      )}
      {error && (
        <Alert tone="danger" className="mt-4" title="No se pudo subir">
          {error}
        </Alert>
      )}
      {success && (
        <Alert tone="ok" className="mt-4" title="Archivo subido">
          {success}
        </Alert>
      )}

      {picked && (
        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={handleUpload} disabled={busy} size="lg">
            {busy ? (
              <>
                <UploadCloud size={17} aria-hidden />
                {status ?? "Procesando…"}
              </>
            ) : (
              <>
                <CheckCircle2 size={17} aria-hidden />
                Subir a la biblioteca
              </>
            )}
          </Button>
          <Button variant="ghost" onClick={reset} disabled={busy}>
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
}
