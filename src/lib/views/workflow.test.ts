import { describe, expect, it } from "vitest";
import {
  canTransition,
  nextStatuses,
  PLAYABLE_STATUSES,
  statusLabel,
} from "./workflow";

describe("flujo de aprobación", () => {
  it("borrador solo puede ir a revisión", () => {
    const next = nextStatuses("borrador");
    expect(next).toHaveLength(1);
    expect(next[0].to).toBe("en_revision");
  });

  it("en revisión puede aprobarse o devolverse", () => {
    const targets = nextStatuses("en_revision").map((t) => t.to);
    expect(targets).toContain("aprobado");
    expect(targets).toContain("borrador");
  });

  it("valida transiciones permitidas y rechaza inválidas", () => {
    expect(canTransition("borrador", "en_revision")).toBe(true);
    expect(canTransition("borrador", "aprobado")).toBe(false);
    expect(canTransition("aprobado", "archivado")).toBe(true);
    expect(canTransition("archivado", "aprobado")).toBe(false);
  });

  it("solo aprobado/publicado son reproducibles", () => {
    expect(PLAYABLE_STATUSES).toContain("aprobado");
    expect(PLAYABLE_STATUSES).not.toContain("borrador");
  });

  it("etiqueta los estados en español", () => {
    expect(statusLabel("en_revision")).toBe("En revisión");
  });
});
