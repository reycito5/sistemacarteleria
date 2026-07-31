import { describe, expect, it } from "vitest";
import {
  categoryFromStoragePath,
  categoryLabel,
  normalizeMediaCategory,
} from "./categories";

describe("categorías de la biblioteca", () => {
  it("recupera la plantilla desde la ruta de Storage", () => {
    expect(
      categoryFromStoragePath(
        "plantillas/programa_destacado/image/afiche-educacion.png",
      ),
    ).toBe("programa_destacado");
  });

  it("envía categorías antiguas o desconocidas a uso general", () => {
    expect(categoryFromStoragePath("image/archivo-antiguo.png")).toBe("general");
    expect(normalizeMediaCategory("inventada")).toBe("general");
  });

  it("presenta etiquetas comprensibles", () => {
    expect(categoryLabel("noticias")).toContain("Noticias");
  });
});
