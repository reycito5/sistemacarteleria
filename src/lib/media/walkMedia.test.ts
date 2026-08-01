import { describe, expect, it } from "vitest";
import { collectStoredMediaRefs } from "./walkMedia";

describe("collectStoredMediaRefs", () => {
  it("encuentra el medio principal y los medios dentro de listas", () => {
    const content = {
      media: { path: "noticias/portada.mp4" },
      entries: [
        { title: "Uno", media: { path: "noticias/uno.mp4" } },
        { title: "Dos", media: { path: "noticias/dos.jpg" } },
      ],
    };

    expect(collectStoredMediaRefs(content).map((media) => media.path)).toEqual([
      "noticias/portada.mp4",
      "noticias/uno.mp4",
      "noticias/dos.jpg",
    ]);
  });

  it("tolera estructuras circulares sin duplicarse", () => {
    const content: Record<string, unknown> = { media: { path: "uno.mp4" } };
    content.self = content;
    expect(collectStoredMediaRefs(content)).toHaveLength(1);
  });
});
