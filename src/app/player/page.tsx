import { DemoPlayer } from "@/components/player/DemoPlayer";

export const metadata = {
  title: "Reproductor — UABJB Posgrado Digital",
};

/**
 * Reproductor a pantalla completa (modo kiosco). En producción cada mini PC
 * abre esta ruta con su token de pantalla. Por ahora reproduce la playlist de
 * demostración sincronizada por hora oficial.
 */
export default function PlayerPage() {
  return <DemoPlayer />;
}
