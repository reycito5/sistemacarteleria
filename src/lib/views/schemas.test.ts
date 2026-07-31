import { describe, expect, it } from "vitest";
import { FORM_SCHEMAS } from "./formSchema";
import { viewNumberForKind } from "./registry";
import { viewContentSchema } from "./schemas";

describe("plantillas extensas y homenaje", () => {
  it("acepta hasta doce noticias y conserva todas las entradas", () => {
    const entries = Array.from({ length: 12 }, (_, index) => ({
      title: `Noticia ${index + 1}`,
      kind: index % 2 ? ("video" as const) : ("noticia" as const),
    }));

    const parsed = viewContentSchema.parse({ kind: "noticias", entries });
    expect(parsed.kind).toBe("noticias");
    if (parsed.kind === "noticias") expect(parsed.entries).toHaveLength(12);
  });

  it("registra y normaliza una fecha especial con video opcional", () => {
    const parsed = viewContentSchema.parse({
      kind: "homenaje",
      title: "Día del Trabajador",
      message: "Gracias por construir nuestra Universidad.",
    });

    expect(parsed.kind).toBe("homenaje");
    expect(viewNumberForKind("homenaje")).toBe(18);
    expect(FORM_SCHEMAS.homenaje.titleKey).toBe("title");
  });

  it("rechaza una lista superior al límite editorial", () => {
    const programs = Array.from({ length: 13 }, (_, index) => ({
      name: `Programa ${index + 1}`,
    }));
    expect(() =>
      viewContentSchema.parse({ kind: "proximos_inicios", programs }),
    ).toThrow();
  });
});
