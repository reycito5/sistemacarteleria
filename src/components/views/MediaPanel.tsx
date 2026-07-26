import type { MediaRef } from "@/lib/views/schemas";

interface MediaPanelProps {
  media?: MediaRef;
  /** Muestra la barra de controles institucional (decorativa) */
  showControls?: boolean;
  className?: string;
  /** Segundo de inicio para sincronización de video */
  startAt?: number;
}

/**
 * Panel de medios institucional: reproduce video silenciado en bucle o muestra
 * una imagen 16:9. Nunca deja el panel en negro: si no hay medio, muestra un
 * respaldo institucional sólido (sección 28).
 */
export function MediaPanel({
  media,
  showControls = true,
  className = "",
}: MediaPanelProps) {
  const hasVideo = Boolean(media?.src && /\.(mp4|webm|m4v)(\?|$)/i.test(media.src));

  return (
    <div className={`relative h-full w-full overflow-hidden bg-inst-blue-bottom ${className}`}>
      {hasVideo ? (
        <video
          className="h-full w-full object-cover"
          src={media?.src}
          poster={media?.poster}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : media?.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="h-full w-full object-cover"
          src={media.src}
          alt=""
        />
      ) : (
        <div className="grid h-full w-full place-items-center">
          <span className="text-[28px] font-bold tracking-wide text-inst-white/70">
            UABJB · POSGRADO
          </span>
        </div>
      )}

      {showControls && (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 bg-black/45 px-6 py-3">
          <span className="text-[20px] text-inst-white" aria-hidden>▶</span>
          <span className="text-[20px] text-inst-white" aria-hidden>❚❚</span>
          <div className="relative h-1.5 flex-1 rounded-full bg-white/35">
            <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-inst-red" />
            <div className="absolute left-1/3 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-inst-red" />
          </div>
          <span className="text-[18px] text-inst-white" aria-hidden>🔊</span>
          <span className="text-[18px] text-inst-white" aria-hidden>⚙</span>
          <span className="text-[18px] text-inst-white" aria-hidden>⛶</span>
        </div>
      )}
    </div>
  );
}
