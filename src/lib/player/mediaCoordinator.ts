/**
 * Coordinador global del reproductor.
 *
 * Hay dos niveles de exclusividad:
 *  - dentro de la pestaña, sólo un <video> puede permanecer reproduciéndose;
 *  - entre pestañas del reproductor, la última que reclama el audio silencia y
 *    detiene a las demás mediante BroadcastChannel.
 */

const CHANNEL_NAME = "sicd-exclusive-media";
const instanceId =
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const registered = new Set<HTMLVideoElement>();
let channel: BroadcastChannel | null = null;

function stop(element: HTMLVideoElement) {
  element.pause();
  element.muted = true;
}

function stopAllExcept(active?: HTMLVideoElement) {
  registered.forEach((element) => {
    if (element !== active) stop(element);
  });

  // Defensa adicional para reproductores auxiliares o vistas previas que no
  // usan SignageMedia.
  document.querySelectorAll("video").forEach((element) => {
    if (element !== active) stop(element);
  });
}

function getChannel() {
  if (channel || typeof BroadcastChannel === "undefined") return channel;
  channel = new BroadcastChannel(CHANNEL_NAME);
  channel.addEventListener("message", (event: MessageEvent<{ owner?: string }>) => {
    if (event.data?.owner !== instanceId) stopAllExcept();
  });
  return channel;
}

export function registerMediaElement(element: HTMLVideoElement) {
  registered.add(element);
  getChannel();
  return () => {
    stop(element);
    registered.delete(element);
  };
}

export function claimExclusivePlayback(
  element: HTMLVideoElement,
  claimAcrossTabs: boolean,
) {
  stopAllExcept(element);
  if (claimAcrossTabs) getChannel()?.postMessage({ owner: instanceId });
}

export function releaseMediaElement(element: HTMLVideoElement) {
  stop(element);
}
