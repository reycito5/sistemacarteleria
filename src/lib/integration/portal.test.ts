import { describe, expect, it } from "vitest";
import {
  SAMPLE_PORTAL_PROGRAMS,
  extractProgramList,
  normalizePortalPayload,
  normalizeProgram,
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

describe("normalizeProgram", () => {
  it("acepta nombres de campo en español", () => {
    const p = normalizeProgram({
      slug: "dip-ia",
      nombre: "Diplomado en Inteligencia Artificial",
      modalidad: "Virtual",
      fechaInicio: "10/08/2026",
      duracion: "5 meses",
      creditos: 20,
      horas: "800 horas",
      descripcion: "Transforma datos en decisiones",
    });
    expect(p).not.toBeNull();
    expect(p?.id).toBe("dip-ia");
    expect(p?.name).toBe("Diplomado en Inteligencia Artificial");
    expect(p?.modality).toBe("Virtual");
    expect(p?.durationMonths).toBe(5);
    expect(p?.credits).toBe(20);
    expect(p?.hours).toBe(800);
  });

  it("genera un id cuando el portal no lo trae", () => {
    const p = normalizeProgram({ nombre: "Maestría en Educación Superior" }, 2);
    expect(p?.id).toBe("maestr-a-en-educaci-n-superior-2");
  });

  it("resuelve URL relativas contra el portal", () => {
    const p = normalizeProgram(
      { nombre: "Programa", url: "/inscripcion" },
      0,
      "https://ofertaposgrado.vercel.app/api/programas",
    );
    expect(p?.enrollmentUrl).toBe("https://ofertaposgrado.vercel.app/inscripcion");
  });

  it("descarta registros sin nombre", () => {
    expect(normalizeProgram({ id: "x" })).toBeNull();
    expect(normalizeProgram("texto")).toBeNull();
    expect(normalizeProgram(null)).toBeNull();
  });

  it("interpreta el estado de inscripción escrito como texto", () => {
    expect(normalizeProgram({ nombre: "A", abierto: "no" })?.enrollmentOpen).toBe(false);
    expect(normalizeProgram({ nombre: "A", abierto: "sí" })?.enrollmentOpen).toBe(true);
    // Sin dato explícito, se asume abierto.
    expect(normalizeProgram({ nombre: "A" })?.enrollmentOpen).toBe(true);
  });
});

describe("extractProgramList", () => {
  it("encuentra la lista en los envoltorios habituales", () => {
    const list = [{ nombre: "A" }];
    expect(extractProgramList(list)).toBe(list);
    expect(extractProgramList({ programs: list })).toBe(list);
    expect(extractProgramList({ programas: list })).toBe(list);
    expect(extractProgramList({ data: { programs: list } })).toBe(list);
  });

  it("devuelve null cuando no hay lista", () => {
    expect(extractProgramList({ total: 3 })).toBeNull();
    expect(extractProgramList("texto")).toBeNull();
  });
});

describe("normalizePortalPayload", () => {
  it("normaliza una respuesta completa descartando lo inválido", () => {
    const programs = normalizePortalPayload({
      data: [{ nombre: "Maestría" }, { id: "sin-nombre" }, { titulo: "Diplomado" }],
    });
    expect(programs.map((p) => p.name)).toEqual(["Maestría", "Diplomado"]);
    // Todo lo normalizado cumple el contrato del sistema.
    for (const p of programs) {
      expect(portalProgramSchema.safeParse(p).success).toBe(true);
    }
  });

  it("devuelve lista vacía si la respuesta no tiene programas", () => {
    expect(normalizePortalPayload({ error: "not found" })).toEqual([]);
  });
});
