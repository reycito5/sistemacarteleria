import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { INSTITUTION } from "@/lib/design/tokens";

/**
 * Grotesca de cuerpo e interfaz. Manrope es limpia, cálida y muy legible en
 * pantalla, con formas geométricas modernas: nada de la neutralidad genérica
 * de las grotescas por defecto.
 */
const manrope = Manrope({
  variable: "--font-inst-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/**
 * Display de titulares: Space Grotesk. Geométrica, con carácter y un aire muy
 * «de pantalla» — ideal para los titulares de la cartelería y del portal.
 */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-inst-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** Monoespaciada para relojes, fechas, códigos y numeración de campos. */
const plexMono = IBM_Plex_Mono({
  variable: "--font-inst-mono",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${INSTITUTION.commercialName} — Cartelería Digital`,
  description:
    "Sistema Institucional de Cartelería Digital del Vicerrectorado de Posgrado — UABJB.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#02024D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${manrope.variable} ${spaceGrotesk.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
