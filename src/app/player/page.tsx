import { PlayerClient } from "@/components/player/PlayerClient";

export const metadata = {
  title: "Reproductor — UABJB Posgrado Digital",
};

export const dynamic = "force-dynamic";

/**
 * Reproductor a pantalla completa (modo kiosco). Cada mini PC abre esta ruta
 * con su código de pantalla: /player?screen=REC-01. Consume el manifiesto
 * institucional, se sincroniza por hora oficial y reporta su estado.
 */
export default async function PlayerPage({
  searchParams,
}: {
  searchParams: Promise<{ screen?: string }>;
}) {
  const { screen } = await searchParams;
  return <PlayerClient screenCode={screen} />;
}
