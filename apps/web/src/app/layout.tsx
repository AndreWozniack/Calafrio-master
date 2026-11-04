import type { Metadata } from "next";
import { BarraTopo } from "@/components/navegacao/barra-topo";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calafrio TTRPG (2e) — Master",
  description:
    "Ficha Viva, Criação de Personagens e Mesa de Combate para Calafrio 2e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased min-h-screen flex flex-col bg-[#0E0E11] text-[#F4F4F2]">
        <BarraTopo />
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
