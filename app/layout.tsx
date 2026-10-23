import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Natsumatsuri 2026 — 14 de noviembre · Pirapó",
  description: "Nos encontramos en Natsumatsuri 2026. Sábado 14 de noviembre desde las 18:00 en la Cancha de la Asociación Japonesa de Pirapó, Itapúa, Paraguay.",
  openGraph: {
    title: "Natsumatsuri 2026 — Nos vemos en Pirapó",
    description: "14 de noviembre · 18:00 h · Cancha de la Asociación Japonesa de Pirapó. Una noche para encontrarnos, una tradición para compartir.",
    locale: "es_PY",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10100f",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="es"><body>{children}</body></html>;
}
