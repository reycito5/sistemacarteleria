import { describe, expect, it } from "vitest";
import { streamEmbedUrl } from "./LiveStreamMedia";

describe("streamEmbedUrl", () => {
  it("convierte un enlace compartido de YouTube Live", () => {
    expect(streamEmbedUrl("https://www.youtube.com/live/abc123?feature=share"))
      .toBe("https://www.youtube.com/embed/abc123?autoplay=1&rel=0");
  });

  it("convierte enlaces cortos de YouTube", () => {
    expect(streamEmbedUrl("https://youtu.be/xyz789"))
      .toBe("https://www.youtube.com/embed/xyz789?autoplay=1&rel=0");
  });

  it("deja los archivos directos para el reproductor nativo", () => {
    expect(streamEmbedUrl("https://media.example.edu/vivo.mp4")).toBeNull();
  });

  it("rechaza protocolos inseguros", () => {
    expect(streamEmbedUrl("javascript:alert(1)")).toBeNull();
  });
});
