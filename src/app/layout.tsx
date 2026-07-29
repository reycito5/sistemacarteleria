import type { Metadata, Viewport } from "next";
import { Archivo, Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { INSTITUTION } from "@/lib/design/tokens";

/**
 * Grotesca editorial de interfaz y cuerpos. Archivo tiene un carácter más
 * institucional y con más personalidad que las grotescas neutras por defecto:
 * aporta el aire de identidad universitaria que se busca en la cartelería.
 */
const archivo = Archivo({
  variable: "--font-inst-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

/**
 * Serif editorial de la línea gráfica institucional: titulares de las
 * pantallas, nombres de programa y encabezados del portal. Con sizing óptico
 * automático (eje opsz) gana contraste y aire de revista en los grandes.
 */
const fraunces = Fraunces({
  variable: "--font-inst-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
      className={`${archivo.variable} ${fraunces.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
