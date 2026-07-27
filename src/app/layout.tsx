import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { INSTITUTION } from "@/lib/design/tokens";

/**
 * Inter como alternativa web de Neue Haas Grotesk / Helvetica Now (V11.6).
 * Pesos institucionales: 400/500 texto, 600/700 subtítulos, 800/900 títulos.
 */
const inter = Inter({
  variable: "--font-inst-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

/**
 * Serif académica para los nombres de programa del portal público, en línea
 * con el portal de oferta académica. No se usa en las pantallas del televisor,
 * cuya tipografía sigue bloqueada por la línea gráfica V11.6.
 */
const sourceSerif = Source_Serif_4({
  variable: "--font-inst-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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
      className={`${inter.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
