"use client";

import {
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  /** Pista de subtítulos WebVTT (.vtt). */
  subtitleSrc?: string;
  /** Etiqueta accesible del reproductor. */
  title?: string;
  className?: string;
  /** Arranca reproduciendo, silenciado (requisito de autoplay del navegador). */
  autoPlay?: boolean;
  loop?: boolean;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Reproductor de video real para el panel de administración.
 *
 * Controles funcionales de verdad: reproducir/pausar, barra de progreso
 * arrastrable, volumen, silencio, reinicio y pantalla completa. Se usa para
 * revisar el material antes de publicarlo en las pantallas.
 *
 * No es la barra decorativa de las plantillas: aquí cada control opera sobre
 * el elemento <video>.
 */
export function VideoPlayer({
  src,
  poster,
  subtitleSrc,
  title,
  className = "",
  autoPlay = false,
  loop = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const seekId = useId();
  const volumeId = useId();

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(autoPlay);
  const [volume, setVolume] = useState(1);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [failed, setFailed] = useState(false);

  // Sincroniza el estado de la interfaz con los eventos reales del <video>.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setCurrent(video.currentTime);
    const onMeta = () => setDuration(video.duration || 0);
    const onVolume = () => {
      setMuted(video.muted);
      setVolume(video.volume);
    };
    const onError = () => setFailed(true);
    const onEnded = () => setPlaying(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("volumechange", onVolume);
    video.addEventListener("error", onError);
    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("volumechange", onVolume);
      video.removeEventListener("error", onError);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    const onFsChange = () =>
      setFullscreen(document.fullscreenElement === shellRef.current);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      // play() devuelve una promesa que el navegador puede rechazar.
      video.play().catch(() => setFailed(true));
    } else {
      video.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  }, []);

  const restart = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => undefined);
  }, []);

  const seek = (e: ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Number(e.target.value);
    setCurrent(video.currentTime);
  };

  const changeVolume = (e: ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const next = Number(e.target.value);
    video.volume = next;
    video.muted = next === 0;
  };

  const toggleFullscreen = useCallback(async () => {
    const shell = shellRef.current;
    if (!shell) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await shell.requestFullscreen();
    } catch {
      // Algunos navegadores lo bloquean sin gesto directo: se ignora.
    }
  }, []);

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div
      ref={shellRef}
      className={`group relative overflow-hidden rounded-[12px] bg-black ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={autoPlay}
        loop={loop}
        playsInline
        preload="metadata"
        onClick={togglePlay}
        aria-label={title ?? "Reproductor de video"}
        className="aspect-video w-full cursor-pointer bg-black object-contain"
      >
        {subtitleSrc && (
          <track
            default
            kind="subtitles"
            srcLang="es"
            label="Español"
            src={subtitleSrc}
          />
        )}
      </video>

      {failed && (
        <div className="absolute inset-0 grid place-items-center bg-inst-blue-bottom/90 px-6 text-center">
          <p className="text-sm font-bold text-inst-white">
            No se pudo cargar el video.
            <span className="mt-1 block font-normal text-white/70">
              Verifique que el archivo siga en la biblioteca y que el formato sea
              MP4 (H.264).
            </span>
          </p>
        </div>
      )}

      {/* Botón grande de reproducción cuando está pausado. */}
      {!playing && !failed && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Reproducir"
          className="absolute inset-0 grid place-items-center bg-black/25 transition hover:bg-black/35"
        >
          <span className="grid h-16 w-16 place-items-center rounded-full bg-inst-white/95 text-inst-blue-bottom shadow-lg transition group-hover:scale-105">
            <Play size={26} className="ml-1" fill="currentColor" />
          </span>
        </button>
      )}

      {/* Barra de controles real. */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/60 to-transparent px-3 pb-2.5 pt-8">
        <label htmlFor={seekId} className="sr-only">
          Posición del video
        </label>
        <div className="relative flex items-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 h-1 rounded-full bg-white/30"
          >
            <div
              className="h-full rounded-full bg-inst-red"
              style={{ width: `${progress}%` }}
            />
          </div>
          <input
            id={seekId}
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={current}
            onChange={seek}
            disabled={!duration}
            className="relative z-10 h-4 w-full cursor-pointer appearance-none bg-transparent
              [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-inst-red
              [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5
              [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:bg-inst-red"
          />
        </div>

        <div className="mt-1 flex items-center gap-2 text-inst-white">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pausar" : "Reproducir"}
            className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/20"
          >
            {playing ? <Pause size={17} /> : <Play size={17} />}
          </button>

          <button
            type="button"
            onClick={restart}
            aria-label="Reiniciar"
            className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/20"
          >
            <RotateCcw size={15} />
          </button>

          <span className="ui-tnum ml-1 text-xs font-semibold tabular-nums">
            {formatTime(current)} / {formatTime(duration)}
          </span>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Activar sonido" : "Silenciar"}
              className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/20"
            >
              {muted || volume === 0 ? (
                <VolumeX size={16} />
              ) : (
                <Volume2 size={16} />
              )}
            </button>
            <label htmlFor={volumeId} className="sr-only">
              Volumen
            </label>
            <input
              id={volumeId}
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={changeVolume}
              className="hidden h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/35 sm:block
                [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3
                [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0
                [&::-moz-range-thumb]:bg-white"
            />
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={fullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-white/20"
            >
              {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
