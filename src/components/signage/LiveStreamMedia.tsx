"use client";

import type { MediaRef } from "@/lib/views/schemas";
import { SignageMedia } from "./SignageMedia";

function safeUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

/** Convierte enlaces compartidos de YouTube en una URL incrustable. */
export function streamEmbedUrl(value: string): string | null {
  const url = safeUrl(value);
  if (!url) return null;
  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
  }

  if (host === "youtube.com" || host === "m.youtube.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    const id =
      url.searchParams.get("v") ||
      (parts[0] === "live" || parts[0] === "embed" || parts[0] === "shorts"
        ? parts[1]
        : null);
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
  }

  if (host === "vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean).find((part) => /^\d+$/.test(part));
    return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : value;
  }

  return /\.(mp4|webm|m4v|mov)(\?|$)/i.test(value) ? null : value;
}

export function LiveStreamMedia({
  streamUrl,
  fallback,
}: {
  streamUrl: string;
  fallback?: MediaRef;
}) {
  const embedUrl = streamEmbedUrl(streamUrl);
  const directVideo =
    Boolean(safeUrl(streamUrl)) && /\.(mp4|webm|m4v|mov)(\?|$)/i.test(streamUrl);

  if (embedUrl) {
    return (
      <iframe
        className="h-full w-full border-0 bg-black"
        src={embedUrl}
        title="Transmisión en vivo"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  if (directVideo) {
    return (
      <div className="relative h-full w-full">
        <SignageMedia
          media={{ src: streamUrl, muted: false, silent: false }}
          fallbackLabel="TRANSMISIÓN NO DISPONIBLE"
          loop={false}
          fit="contain"
        />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <SignageMedia media={fallback} fallbackLabel="EN ESPERA DE TRANSMISIÓN" />
    </div>
  );
}
