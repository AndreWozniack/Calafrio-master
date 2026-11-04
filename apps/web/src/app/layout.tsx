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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: script estático anti-flash do tema
          dangerouslySetInnerHTML={{
            __html:
              'try{if(localStorage.getItem("calafrio:tema:v1")==="escuro")document.documentElement.classList.add("dark")}catch(e){}',
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground">
        <BarraTopo />
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
