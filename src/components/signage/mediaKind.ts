import type { MediaRef } from "@/lib/views/schemas";

const VIDEO_EXT = /\.(mp4|webm|m4v|mov)(\?|$)/i;

/**
 * ¿La referencia apunta a un video?
 *
 * Vive en su propio módulo (sin `"use client"`) porque lo consultan tanto las
 * primitivas que se renderizan en el servidor como el reproductor de cliente.
 */
export function isVideoRef(media?: MediaRef): boolean {
  return Boolean(media?.src && VIDEO_EXT.test(media.src));
}
