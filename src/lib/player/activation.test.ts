import { describe, expect, it } from "vitest";
import {
  activationExpiry,
  generateActivationCode,
  generateScreenCode,
  isActivationExpired,
  isValidActivationCode,
} from "./activation";

describe("generateActivationCode", () => {
  it("genera siempre 6 dígitos", () => {
    for (let i = 0; i < 100; i++) {
      expect(generateActivationCode()).toMatch(/^\d{6}$/);
    }
  });
  it("es determinista con un generador fijo", () => {
    expect(generateActivationCode(() => 0)).toBe("100000");
  });
});

describe("generateScreenCode", () => {
  it("empieza con el prefijo SCR-", () => {
    expect(generateScreenCode()).toMatch(/^SCR-/);
  });
});

describe("isValidActivationCode", () => {
  it("acepta 6 dígitos y rechaza lo demás", () => {
    expect(isValidActivationCode("123456")).toBe(true);
    expect(isValidActivationCode(" 654321 ")).toBe(true);
    expect(isValidActivationCode("12345")).toBe(false);
    expect(isValidActivationCode("abcdef")).toBe(false);
  });
});

describe("isActivationExpired", () => {
  it("trata null como expirado", () => {
    expect(isActivationExpired(null)).toBe(true);
  });
  it("respeta la ventana de validez", () => {
    const now = Date.parse("2026-07-26T10:00:00.000Z");
    const expiry = activationExpiry(now);
    expect(isActivationExpired(expiry, now + 60_000)).toBe(false);
    expect(isActivationExpired(expiry, now + 60 * 60_000)).toBe(true);
  });
});
