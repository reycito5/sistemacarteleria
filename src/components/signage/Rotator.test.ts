import { describe, expect, it } from "vitest";
import { nextRotatorIndex } from "./Rotator";

describe("nextRotatorIndex", () => {
  it("recorre todos los contenidos y vuelve al primero", () => {
    expect(nextRotatorIndex(0, 3)).toBe(1);
    expect(nextRotatorIndex(1, 3)).toBe(2);
    expect(nextRotatorIndex(2, 3)).toBe(0);
  });

  it("es seguro con listas vacías e índices inválidos", () => {
    expect(nextRotatorIndex(8, 0)).toBe(0);
    expect(nextRotatorIndex(-2, 4)).toBe(1);
  });
});
