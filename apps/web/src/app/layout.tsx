import type { Metadata, Viewport } from "next";
import { Alegreya, Alegreya_Sans } from "next/font/google";
import { auth } from "@/auth";
import { BarraTopo } from "@/components/navegacao/barra-topo";
import "./globals.css";

const alegreya = Alegreya({
  variable: "--font-alegreya",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const alegreyaSans = Alegreya_Sans({
  variable: "--font-alegreya-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Calafrio TTRPG — Master",
  description:
    "Ficha Viva, Criação de Personagens e Mesa de Combate para Calafrio 2e",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f4f4f2",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${alegreya.variable} ${alegreyaSans.variable}`}
    >
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: script estático anti-flash do tema
          dangerouslySetInnerHTML={{
            __html:
              'try{if(localStorage.getItem("calafrio:tema:v1")==="escuro")document.documentElement.classList.add("dark")}catch(e){}',
          }}
        />
      </head>
      <body className="antialiased min-h-dvh flex flex-col bg-background text-foreground font-serif relative">
        <div className="relative z-1 flex flex-col flex-1">
          <BarraTopo user={session?.user} />
          <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
