import { describe, expect, it } from "vitest";
import { generateDeviceToken, hashToken, verifyToken } from "./deviceToken";

describe("deviceToken", () => {
  it("genera tokens hex de 64 caracteres y únicos", () => {
    const a = generateDeviceToken();
    const b = generateDeviceToken();
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(a).not.toBe(b);
  });

  it("el hash es determinista y distinto del token", () => {
    const t = "abc123";
    expect(hashToken(t)).toBe(hashToken(t));
    expect(hashToken(t)).not.toBe(t);
  });

  it("verifyToken acepta el token correcto y rechaza el incorrecto", () => {
    const token = generateDeviceToken();
    const stored = hashToken(token);
    expect(verifyToken(token, stored)).toBe(true);
    expect(verifyToken("otro", stored)).toBe(false);
  });
});
