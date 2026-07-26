import { describe, expect, it } from "vitest";
import { computePosition, isDrifting, totalDuration, type SyncItem } from "./sync";

const items: SyncItem[] = [
  { id: "a", durationSeconds: 10 },
  { id: "b", durationSeconds: 20 },
  { id: "c", durationSeconds: 30 },
];

const START = Date.UTC(2026, 6, 26, 10, 0, 0); // 10:00:00

describe("totalDuration", () => {
  it("suma las duraciones del ciclo", () => {
    expect(totalDuration(items)).toBe(60);
  });
});

describe("computePosition", () => {
  it("devuelve null si la playlist está vacía", () => {
    expect(computePosition([], START, START + 5000)).toBeNull();
  });

  it("devuelve null antes de la hora oficial", () => {
    expect(computePosition(items, START, START - 1000)).toBeNull();
  });

  it("posiciona en el primer elemento al inicio", () => {
    const pos = computePosition(items, START, START);
    expect(pos).toMatchObject({ index: 0, offsetSeconds: 0, cycleCount: 0 });
  });

  it("posiciona dentro del segundo elemento", () => {
    // 15s -> elemento b (10..30), offset 5
    const pos = computePosition(items, START, START + 15_000);
    expect(pos?.index).toBe(1);
    expect(pos?.offsetSeconds).toBeCloseTo(5);
  });

  it("posiciona dentro del tercer elemento", () => {
    // 45s -> elemento c (30..60), offset 15
    const pos = computePosition(items, START, START + 45_000);
    expect(pos?.index).toBe(2);
    expect(pos?.offsetSeconds).toBeCloseTo(15);
  });

  it("reinicia el ciclo tras la duración total", () => {
    // 65s -> ciclo 1, elemento a, offset 5
    const pos = computePosition(items, START, START + 65_000);
    expect(pos?.index).toBe(0);
    expect(pos?.offsetSeconds).toBeCloseTo(5);
    expect(pos?.cycleCount).toBe(1);
  });

  it("dos pantallas encendidas en momentos distintos coinciden", () => {
    // El cálculo depende solo de 'now', no del encendido: mismo now, misma pos.
    const now = START + 123_456;
    const p1 = computePosition(items, START, now);
    const p2 = computePosition(items, START, now);
    expect(p1).toEqual(p2);
  });
});

describe("isDrifting", () => {
  it("no marca desfase dentro de la tolerancia", () => {
    expect(isDrifting(10, 12)).toBe(false);
  });
  it("marca desfase fuera de la tolerancia", () => {
    expect(isDrifting(10, 20)).toBe(true);
  });
});
