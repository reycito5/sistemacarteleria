import { describe, expect, it } from "vitest";
import { collectMediaUrls } from "./serviceWorker";
import { manifestFromViews } from "./manifest";
import { viewContentSchema, type ViewContentInput } from "@/lib/views/schemas";

describe("collectMediaUrls", () => {
  it("recoge URLs de medios de distintas vistas y campos", () => {
    const views: ViewContentInput[] = [
      {
        kind: "programacion_general",
        sectionTitle: "X",
        offers: [],
        nextLabel: "A CONTINUACIÓN",
        strapline: "",
        media: { src: "https://cdn.test/storage/v1/object/public/media/video/a.mp4", muted: true },
        nextThumb: "https://cdn.test/thumb.jpg",
      },
      {
        kind: "comunicado",
        badge: "B",
        title: "T",
        subtitle: "",
        highlight: "",
        specs: [],
        qrCaption: "Q",
        imageSrc: "https://cdn.test/foto.png",
      },
    ];
    const manifest = manifestFromViews(views.map((v) => viewContentSchema.parse(v)));
    const urls = collectMediaUrls(manifest);
    expect(urls).toContain("https://cdn.test/storage/v1/object/public/media/video/a.mp4");
    expect(urls).toContain("https://cdn.test/thumb.jpg");
    expect(urls).toContain("https://cdn.test/foto.png");
  });

  it("ignora textos que no son URLs de medios", () => {
    const manifest = manifestFromViews([
      viewContentSchema.parse({ kind: "comunicado", title: "Sin medios" }),
    ]);
    expect(collectMediaUrls(manifest)).toHaveLength(0);
  });
});
