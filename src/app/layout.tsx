import type { Metadata, Viewport } from "next";
import { dmSans } from "./fonts";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI15 — Planificador inteligente de fiestas de 15",
  description: "Planificá tu fiesta de 15 en un solo lugar.",
};

export const viewport: Viewport = {
  themeColor: "#CD5782",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={dmSans.variable}>
      <body className="h-[100dvh] overflow-hidden font-sans antialiased">
        <PhoneFrame>{children}</PhoneFrame>
      </body>
    </html>
  );
}
