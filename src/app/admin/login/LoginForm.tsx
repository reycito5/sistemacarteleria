"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, KeyRound, LogIn, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Field, Input, inputClasses } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";

const schema = z.object({
  email: z.string().email("Correo institucional no válido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"password" | "mfa">("password");
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-[12px] bg-info-soft p-4">
          <ShieldCheck
            size={18}
            className="mt-0.5 shrink-0 text-inst-blue-top"
            aria-hidden
          />
          <p className="text-sm leading-relaxed text-ui-ink-soft">
            Introduzca el código de 6 dígitos de su aplicación de autenticación.
          </p>
        </div>

        <Field label="Código de verificación" htmlFor="mfa-code">
          <input
            id="mfa-code"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            autoFocus
            className={`${inputClasses} h-14 text-center text-2xl font-bold tracking-[0.45em] tabular-nums`}
          />
        </Field>

        {serverError && <Alert tone="danger">{serverError}</Alert>}

        <Button
          onClick={submitMfa}
          disabled={mfaBusy || mfaCode.length < 6}
          block
          size="lg"
        >
          <ShieldCheck size={17} aria-hidden />
          {mfaBusy ? "Verificando…" : "Verificar y entrar"}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Field
        label="Correo institucional"
        htmlFor="login-email"
        error={errors.email?.message}
        required
      >
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="nombre@uabjb.edu.bo"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
      </Field>

      <Field
        label="Contraseña"
        htmlFor="login-password"
        error={errors.password?.message}
        required
      >
        <div className="relative">
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className="pr-11"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-[8px] text-ui-faint transition hover:bg-ui-canvas hover:text-ui-ink"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </Field>

      {serverError && <Alert tone="danger">{serverError}</Alert>}

      <Button type="submit" disabled={isSubmitting} block size="lg">
        {isSubmitting ? (
          <>
            <KeyRound size={17} aria-hidden />
            Ingresando…
          </>
        ) : (
          <>
            <LogIn size={17} aria-hidden />
            Ingresar al panel
          </>
        )}
      </Button>
    </form>
  );
}
