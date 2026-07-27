"use client";

import { useCallback, useEffect, useState } from "react";
import { ShieldCheck, ShieldPlus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Field, inputClasses } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";

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
    <div>
      {error && (
        <Alert tone="danger" className="mb-4" title="No se pudo completar">
          {error}
        </Alert>
      )}

      {verified.length > 0 && (
        <div className="mb-5 rounded-[12px] border border-ok/25 bg-ok-soft p-4">
          <Badge tone="ok" dot>
            Verificación en dos pasos activa
          </Badge>
          <ul className="mt-3 space-y-2">
            {verified.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="flex items-center gap-2 font-semibold text-ui-ink">
                  <ShieldCheck size={15} className="text-ok" aria-hidden />
                  {f.friendlyName ?? "Autenticador"}
                </span>
                <button
                  type="button"
                  onClick={() => unenroll(f.id)}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 rounded-[8px] px-2 py-1 text-xs font-bold text-inst-red transition hover:bg-danger-soft disabled:opacity-50"
                >
                  <Trash2 size={12} aria-hidden />
                  Retirar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!enrollId ? (
        <Button onClick={startEnroll} disabled={busy || factors === null} size="lg">
          <ShieldPlus size={17} aria-hidden />
          {verified.length > 0
            ? "Añadir otro autenticador"
            : "Activar verificación en dos pasos"}
        </Button>
      ) : (
        <div className="space-y-6">
          <div>
            <p className="text-sm font-bold text-inst-blue-top">
              1 · Escanee el código con su aplicación de autenticación
            </p>
            {qr && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qr}
                alt="Código QR para la verificación en dos pasos"
                className="mt-3 h-44 w-44 rounded-[12px] border border-ui-border bg-white p-2"
              />
            )}
            {secret && (
              <p className="mt-3 text-xs leading-relaxed text-ui-muted">
                ¿No puede escanear? Introduzca esta clave manualmente:
                <code className="mt-1 block break-all rounded-[8px] bg-ui-canvas px-2.5 py-1.5 font-mono text-[11px] text-ui-ink">
                  {secret}
                </code>
              </p>
            )}
          </div>

          <div>
            <p className="mb-3 text-sm font-bold text-inst-blue-top">
              2 · Escriba el código de 6 dígitos que muestra la aplicación
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <Field label="Código" htmlFor="mfa-enroll-code" className="w-40">
                <input
                  id="mfa-enroll-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  className={`${inputClasses} h-11 text-center text-lg font-bold tracking-[0.3em] tabular-nums`}
                />
              </Field>
              <Button
                onClick={verifyEnroll}
                disabled={busy || code.length < 6}
                size="lg"
              >
                <ShieldCheck size={17} aria-hidden />
                {busy ? "Verificando…" : "Verificar y activar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
