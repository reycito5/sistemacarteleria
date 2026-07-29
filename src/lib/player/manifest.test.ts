import { describe, expect, it } from "vitest";
import {
  buildManifest,
  manifestFromViews,
  startOfUtcDay,
  type PlaylistItemLike,
  type PlaylistLike,
} from "./manifest";
import { SAMPLE_VIEWS } from "@/lib/views/samples";

const playlist: PlaylistLike = {
  id: "pl-1",
  version: 3,
  official_start_at: "2026-07-26T10:00:00.000Z",
};

function item(id: string, content_data: unknown): PlaylistItemLike {
  return { id, content_item_id: id, duration_seconds: 15, muted: true, content_data };
}

describe("buildManifest", () => {
  it("resuelve contenido válido y respeta la hora oficial", () => {
    const m = buildManifest(playlist, [
      item("a", { kind: "comunicado", title: "Aviso" }),
    ]);
    expect(m.playlistId).toBe("pl-1");
    expect(m.version).toBe(3);
    expect(m.officialStartAt).toBe(Date.parse("2026-07-26T10:00:00.000Z"));
    expect(m.items).toHaveLength(1);
    expect(m.items[0].content.kind).toBe("comunicado");
  });

  it("descarta contenido inválido sin romper el resto", () => {
    const m = buildManifest(playlist, [
      item("bad", { kind: "inexistente" }),
      item("ok", { kind: "comunicado", title: "Aviso" }),
    ]);
    expect(m.items).toHaveLength(1);
    expect(m.items[0].id).toBe("ok");
  });

  it("usa inicio de día UTC si no hay hora oficial", () => {
    const now = Date.parse("2026-07-26T13:30:00.000Z");
    const m = buildManifest(
      { ...playlist, official_start_at: null },
      [item("a", { kind: "comunicado", title: "X" })],
      null,
      now,
    );
    expect(m.officialStartAt).toBe(startOfUtcDay(now));
  });

  it("adjunta la emergencia activa", () => {
    const m = buildManifest(
      playlist,
      [],
      { kind: "emergencia", title: "Evacuación", message: "", instructions: "" },
    );
    expect(m.emergency?.title).toBe("Evacuación");
  });

  it("fuerza duración mínima de 1 segundo", () => {
    const m = buildManifest(playlist, [
      { ...item("a", { kind: "comunicado", title: "X" }), duration_seconds: 0 },
    ]);
    expect(m.items[0].durationSeconds).toBe(1);
  });
});

describe("manifestFromViews", () => {
  it("construye un manifiesto de demostración con todas las vistas", () => {
    const m = manifestFromViews(SAMPLE_VIEWS);
    expect(m.items).toHaveLength(SAMPLE_VIEWS.length);
    expect(m.items.every((i) => i.durationSeconds === 12)).toBe(true);
  });
});
