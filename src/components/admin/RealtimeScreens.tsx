"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Suscripción Realtime al estado de las pantallas (Fase 8). Ante cualquier
 * cambio en `screens` o `screen_heartbeats`, refresca los datos del servidor
 * (con un pequeño debounce). Degrada de forma elegante: si Supabase o Realtime
 * no están disponibles, el sondeo de AutoRefresh sigue funcionando.
 */
export function RealtimeScreens() {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let supabase;
    try {
      supabase = createClient();
    } catch {
      return; // sin configuración: solo sondeo
    }

    const refreshSoon = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => router.refresh(), 500);
    };

    const channel = supabase
      .channel("sicd-monitoreo")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "screens" },
        refreshSoon,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "screen_heartbeats" },
        refreshSoon,
      )
      .subscribe();

    return () => {
      if (timer.current) clearTimeout(timer.current);
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
