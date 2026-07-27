"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenFrame } from "@/components/institutional/ScreenFrame";
import { INSTITUTION } from "@/lib/design/tokens";

const STORAGE_KEY = "sicd.screen.code";
const TOKEN_KEY = "sicd.screen.token";
type Phase = "solicitando" | "esperando" | "no_configurado" | "error";

/**
 * Pantalla de activación del reproductor (sección 22). Solicita un código,
 * lo muestra en grande y hace polling hasta que el administrador lo confirma;
 * entonces guarda su identidad y arranca la reproducción.
 */
export function ActivationClient() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("solicitando");
  const [code, setCode] = useState<string | null>(null);
  const codeRef = useRef<string | null>(null);

  // Paso 1: solicitar un código de activación.
  useEffect(() => {
    let cancelled = false;
    const requestCode = async () => {
      try {
        const res = await fetch("/api/player/activate/request", { method: "POST" });
        if (res.status === 503) {
          if (!cancelled) setPhase("no_configurado");
          return;
        }
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { activationCode: string };
        if (cancelled) return;
        codeRef.current = data.activationCode;
        setCode(data.activationCode);
        setPhase("esperando");
      } catch {
        if (!cancelled) setPhase("error");
      }
    };
    requestCode();
    return () => {
      cancelled = true;
    };
  }, []);

  // Paso 2: polling del estado de activación.
  useEffect(() => {
    if (phase !== "esperando") return;
    let cancelled = false;

    const poll = async () => {
      const current = codeRef.current;
      if (!current) return;
      try {
        const res = await fetch(`/api/player/activate/status?code=${current}`, {
          cache: "no-store",
        });
        const data = (await res.json()) as {
          status?: string;
          screen?: { code: string };
          deviceToken?: string;
        };
        if (cancelled) return;
        if (data.status === "activated" && data.screen) {
          try {
            window.localStorage.setItem(STORAGE_KEY, data.screen.code);
            if (data.deviceToken) {
              window.localStorage.setItem(TOKEN_KEY, data.deviceToken);
            }
          } catch {
            /* almacenamiento no disponible */
          }
          router.replace(`/player?screen=${encodeURIComponent(data.screen.code)}`);
        } else if (data.status === "expired" || data.status === "not_found") {
          setPhase("solicitando");
          codeRef.current = null;
          // Reintenta solicitar un código nuevo.
          const r = await fetch("/api/player/activate/request", { method: "POST" });
          if (r.ok) {
            const d = (await r.json()) as { activationCode: string };
            codeRef.current = d.activationCode;
            setCode(d.activationCode);
            setPhase("esperando");
          }
        }
      } catch {
        // Reintento en el siguiente ciclo.
      }
    };

    const id = setInterval(poll, 3000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [phase, router]);

  return (
    <div className="kiosk-root">
      <ScreenFrame bare>
        <div
          className="grid h-full place-items-center"
          style={{ background: "var(--color-inst-blue-bottom)" }}
        >
          <div className="text-center text-inst-white">
            <p className="text-[24px] font-semibold tracking-[0.3em] text-inst-gold">
              {INSTITUTION.systemName}
            </p>
            <h1 className="mt-3 text-[44px] font-black">Activación de pantalla</h1>

            {phase === "esperando" && code && (
              <>
                <p className="mt-8 text-[24px] font-medium text-inst-white/80">
                  Introduzca este código en el panel de administración:
                </p>
                <p className="mt-6 font-mono text-[120px] font-black leading-none tracking-[0.15em] text-inst-gold">
                  {code}
                </p>
                <p className="mt-6 text-[20px] text-inst-white/70">
                  Esperando confirmación del administrador…
                </p>
              </>
            )}

            {phase === "solicitando" && (
              <p className="mt-10 text-[24px] text-inst-white/80">
                Solicitando código de activación…
              </p>
            )}

            {phase === "no_configurado" && (
              <p className="mt-10 max-w-[70%] text-[22px] text-inst-white/80">
                El servidor aún no está configurado. Configure Supabase para activar
                pantallas.
              </p>
            )}

            {phase === "error" && (
              <p className="mt-10 text-[22px] text-inst-white/80">
                No se pudo solicitar el código. Reintentando…
              </p>
            )}
          </div>
        </div>
      </ScreenFrame>
    </div>
  );
}
