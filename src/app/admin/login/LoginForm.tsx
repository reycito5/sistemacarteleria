"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword(values);
      if (error) {
        setServerError(error.message);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setServerError(
        "No se pudo conectar con Supabase. Verifique la configuración del entorno.",
      );
    }
  };

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
          className="mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:border-inst-blue"
          style={{ borderColor: "var(--color-panel-border)" }}
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
          className="mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:border-inst-blue"
          style={{ borderColor: "var(--color-panel-border)" }}
        />
        {errors.password && (
          <p className="mt-1 text-xs text-inst-red">{errors.password.message}</p>
        )}
      </div>

      {serverError && <p className="text-sm text-inst-red">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded py-2.5 text-sm font-bold text-inst-white disabled:opacity-60"
        style={{ background: "var(--color-inst-blue-bottom)" }}
      >
        {isSubmitting ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
