"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const schema = z.object({
  email: z.string().email("Correo institucional no válido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"password" | "mfa">("password");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaBusy, setMfaBusy] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const finish = () => {
    // Navegación completa (no router.push) tras iniciar sesión: garantiza que
    // el navegador envíe al servidor las cookies de sesión recién creadas, para
    // que el middleware reconozca la sesión y no rebote de vuelta al login.
    window.location.assign("/admin");
  };

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword(values);
      if (error) {
        setServerError(error.message);
        return;
      }

      // ¿Requiere segundo factor?
      const { data: aal } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aal?.nextLevel === "aal2" && aal.nextLevel !== aal.currentLevel) {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const totp = factors?.totp?.[0];
        if (totp) {
          setMfaFactorId(totp.id);
          setPhase("mfa");
          return;
        }
      }
      finish();
    } catch {
      setServerError(
        "No se pudo conectar con Supabase. Verifique la configuración del entorno.",
      );
    }
  };

  const submitMfa = async () => {
    if (!mfaFactorId) return;
    setServerError(null);
    setMfaBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: mfaFactorId,
        code: mfaCode,
      });
      if (error) {
        setServerError(error.message);
        return;
      }
      finish();
    } catch {
      setServerError("No se pudo verificar el código.");
    } finally {
      setMfaBusy(false);
    }
  };

  if (phase === "mfa") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-panel-ink">
          Introduzca el código de 6 dígitos de su aplicación de autenticación.
        </p>
        <input
          value={mfaCode}
          onChange={(e) => setMfaCode(e.target.value)}
          inputMode="numeric"
          maxLength={6}
          autoFocus
          className="w-full rounded-lg border border-panel-border bg-white px-3 py-2.5 text-center text-lg tracking-[0.4em] tabular-nums outline-none transition focus:border-inst-blue focus:ring-2 focus:ring-inst-blue/20"
        />
        {serverError && <p className="text-sm text-inst-red">{serverError}</p>}
        <button
          onClick={submitMfa}
          disabled={mfaBusy || mfaCode.length < 6}
          className="w-full rounded-lg py-2.5 text-sm font-bold text-inst-white shadow-sm transition hover:brightness-110 disabled:opacity-60"
          style={{ background: "var(--color-inst-blue-bottom)" }}
        >
          {mfaBusy ? "Verificando…" : "Verificar"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label className="block text-sm font-semibold text-panel-ink">
          Correo
        </label>
        <input
          type="email"
          autoComplete="email"
          {...register("email")}
          className="mt-1 w-full rounded-lg border border-panel-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-inst-blue focus:ring-2 focus:ring-inst-blue/20"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-inst-red">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-panel-ink">
          Contraseña
        </label>
        <input
          type="password"
          autoComplete="current-password"
          {...register("password")}
          className="mt-1 w-full rounded-lg border border-panel-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-inst-blue focus:ring-2 focus:ring-inst-blue/20"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-inst-red">{errors.password.message}</p>
        )}
      </div>

      {serverError && <p className="text-sm text-inst-red">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg py-2.5 text-sm font-bold text-inst-white shadow-sm transition hover:brightness-110 disabled:opacity-60"
        style={{ background: "var(--color-inst-blue-bottom)" }}
      >
        {isSubmitting ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
