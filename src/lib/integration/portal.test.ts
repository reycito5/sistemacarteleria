import { describe, expect, it } from "vitest";
import {
  SAMPLE_PORTAL_PROGRAMS,
  portalProgramSchema,
  programToDestacado,
  programsToOfertaGeneral,
} from "./portal";
import { viewContentSchema } from "@/lib/views/schemas";

describe("portalProgramSchema", () => {
  it("aplica valores por defecto", () => {
    const p = portalProgramSchema.parse({ id: "x", name: "Prog" });
    expect(p.modality).toBe("");
    expect(p.enrollmentOpen).toBe(true);
  });
});

describe("programToDestacado", () => {
  it("produce una vista válida con especificaciones ordenadas", () => {
    const content = programToDestacado(SAMPLE_PORTAL_PROGRAMS[1]);
    const parsed = viewContentSchema.safeParse(content);
    expect(parsed.success).toBe(true);
    expect(content.programName).toMatch(/Inteligencia Artificial/);
    expect(content.specs.length).toBeLessThanOrEqual(6);
    expect(content.specs[0]).toEqual({ label: "Modalidad", value: "Virtual" });
  });

  it("cambia el texto del QR según inscripción abierta", () => {
    const abierto = programToDestacado({ ...SAMPLE_PORTAL_PROGRAMS[0], enrollmentOpen: true });
    const cerrado = programToDestacado({ ...SAMPLE_PORTAL_PROGRAMS[0], enrollmentOpen: false });
    expect(abierto.qrCaption).toBe("INSCRÍBETE AQUÍ");
    expect(cerrado.qrCaption).toBe("CONOCE EL PROGRAMA");
  });
});

describe("programsToOfertaGeneral", () => {
  it("genera una vista válida con máximo 4 ofertas", () => {
    const content = programsToOfertaGeneral(SAMPLE_PORTAL_PROGRAMS);
    expect(viewContentSchema.safeParse(content).success).toBe(true);
    expect(content.offers.length).toBeLessThanOrEqual(4);
  });
});
