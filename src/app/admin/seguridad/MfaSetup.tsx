"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface FactorInfo {
  id: string;
  status: string;
  friendlyName: string | null;
}

/**
 * Configuración de verificación en dos pasos (TOTP) con Supabase Auth
 * (sección 29). Permite enrolar un autenticador, verificarlo y retirarlo.
 */
export function MfaSetup() {
  const [factors, setFactors] = useState<FactorInfo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Enrolamiento en curso.
  const [enrollId, setEnrollId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");

  const loadFactors = useCallback(async () => {
    setError(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      setFactors(
        (data?.all ?? []).map((f) => ({
          id: f.id,
          status: f.status,
          friendlyName: f.friendly_name ?? null,
        })),
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "No se pudo cargar la configuración MFA.",
      );
      setFactors([]);
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      await loadFactors();
    };
    run();
  }, [loadFactors]);

  const startEnroll = async () => {
    setError(null);
    setBusy(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: `Autenticador ${new Date().toLocaleDateString("es")}`,
      });
      if (error) throw error;
      setEnrollId(data.id);
      setQr(data.totp.qr_code);
      setSecret(data.totp.secret);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar el enrolamiento.");
    } finally {
      setBusy(false);
    }
  };

  const verifyEnroll = async () => {
    if (!enrollId) return;
    setError(null);
    setBusy(true);
    try {
      const supabase = createClient();
      const challenge = await supabase.auth.mfa.challenge({ factorId: enrollId });
      if (challenge.error) throw challenge.error;
      const verify = await supabase.auth.mfa.verify({
        factorId: enrollId,
        challengeId: challenge.data.id,
        code,
      });
      if (verify.error) throw verify.error;
      setEnrollId(null);
      setQr(null);
      setSecret(null);
      setCode("");
      await loadFactors();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Código incorrecto.");
    } finally {
      setBusy(false);
    }
  };

  const unenroll = async (factorId: string) => {
    setError(null);
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) throw error;
      await loadFactors();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo retirar el factor.");
    } finally {
      setBusy(false);
    }
  };

  const verified = (factors ?? []).filter((f) => f.status === "verified");

  return (
    <div
      className="max-w-xl rounded-md border bg-white p-5"
      style={{ borderColor: "var(--color-panel-border)" }}
    >
      {error && <p className="mb-3 text-sm text-inst-red">{error}</p>}

      {verified.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-bold text-green-700">
            Verificación en dos pasos activa
          </p>
          <ul className="mt-2 space-y-1">
            {verified.map((f) => (
              <li key={f.id} className="flex items-center justify-between text-sm">
                <span>{f.friendlyName ?? "Autenticador"}</span>
                <button
                  onClick={() => unenroll(f.id)}
                  disabled={busy}
                  className="text-xs font-bold text-inst-red disabled:opacity-50"
                >
                  Retirar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!enrollId ? (
        <button
          onClick={startEnroll}
          disabled={busy || factors === null}
          className="rounded px-4 py-2 text-sm font-bold text-inst-white disabled:opacity-60"
          style={{ background: "var(--color-inst-blue-bottom)" }}
        >
          {verified.length > 0 ? "Añadir otro autenticador" : "Activar verificación en dos pasos"}
        </button>
      ) : (
        <div>
          <p className="text-sm font-semibold text-panel-ink">
            1. Escanee el código QR con su aplicación de autenticación
          </p>
          {qr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="Código QR TOTP" className="mt-3 h-44 w-44" />
          )}
          {secret && (
            <p className="mt-2 text-xs text-panel-muted">
              O introduzca la clave manualmente: <code className="font-mono">{secret}</code>
            </p>
          )}
          <p className="mt-4 text-sm font-semibold text-panel-ink">
            2. Introduzca el código de 6 dígitos
          </p>
          <div className="mt-2 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              maxLength={6}
              className="w-32 rounded border px-3 py-2 text-sm tabular-nums"
              style={{ borderColor: "var(--color-panel-border)" }}
            />
            <button
              onClick={verifyEnroll}
              disabled={busy || code.length < 6}
              className="rounded px-4 py-2 text-sm font-bold text-inst-white disabled:opacity-60"
              style={{ background: "var(--color-inst-blue-bottom)" }}
            >
              Verificar y activar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
