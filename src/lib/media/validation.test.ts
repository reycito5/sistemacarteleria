import { describe, expect, it } from "vitest";
import {
  buildStoragePath,
  classifyMediaType,
  is16by9,
  validateFile,
} from "./validation";

describe("classifyMediaType", () => {
  it("reconoce video e imagen", () => {
    expect(classifyMediaType("video/mp4")).toBe("video");
    expect(classifyMediaType("image/png")).toBe("image");
    expect(classifyMediaType("application/pdf")).toBeNull();
  });
});

describe("validateFile", () => {
  it("acepta un MP4 válido", () => {
    const r = validateFile({ name: "spot.mp4", type: "video/mp4", size: 10_000 });
    expect(r.ok).toBe(true);
    expect(r.mediaType).toBe("video");
  });

  it("rechaza ejecutables y formatos no admitidos", () => {
    const r = validateFile({ name: "virus.exe", type: "application/x-msdownload", size: 100 });
    expect(r.ok).toBe(false);
    expect(r.mediaType).toBeNull();
  });

  it("rechaza extensión que no coincide con el tipo", () => {
    const r = validateFile({ name: "foto.mov", type: "video/mp4", size: 100 });
    expect(r.ok).toBe(false);
  });

  it("rechaza archivos vacíos y demasiado grandes", () => {
    expect(validateFile({ name: "a.png", type: "image/png", size: 0 }).ok).toBe(false);
    expect(
      validateFile({ name: "a.png", type: "image/png", size: 999 * 1024 * 1024 }).ok,
    ).toBe(false);
  });
});

describe("is16by9", () => {
  it("valida 1920x1080 y rechaza vertical", () => {
    expect(is16by9(1920, 1080)).toBe(true);
    expect(is16by9(1080, 1920)).toBe(false);
  });
});

describe("buildStoragePath", () => {
  it("genera rutas seguras con prefijo por tipo", () => {
    const path = buildStoragePath("video", "Spot Institucional 2026.mp4");
    expect(path.startsWith("video/")).toBe(true);
    expect(path.endsWith(".mp4")).toBe(true);
    expect(path).toMatch(/spot-institucional-2026/);
  });

  it("normaliza acentos y caracteres especiales", () => {
    const path = buildStoragePath("image", "Comunicación Ñoño!.png");
    expect(path).toMatch(/comunicacion-nono/);
    expect(path.endsWith(".png")).toBe(true);
  });
});
