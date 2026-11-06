"use client";

import { BookOpen, Dices, LogIn, Skull, Swords } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { estaNaFicha } from "@/lib/rota-ficha";
import { CalafrioLogo } from "../svg/calafrio-ornamentos";
import { AlternarTema } from "./alternar-tema";
import { UsuarioMenu } from "./usuario-menu";

interface BarraTopoProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function BarraTopo({ user }: BarraTopoProps) {
  const pathname = usePathname();

  if (estaNaFicha(pathname) || pathname === "/login") return null;

  const links = [
    { href: "/mesa", label: "Suas Mesas", icon: Swords },
    { href: "/gerador", label: "Gerador", icon: Dices },
    { href: "/biblioteca", label: "Biblioteca & PDFs", icon: BookOpen },
    { href: "/bestiario", label: "Bestiário", icon: Skull },
  ];

  return (
    <header className="border-b border-border bg-card/95 backdrop-blur sticky top-0 z-40 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <Link href="/mesa">
          <CalafrioLogo />
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const ativo =
              link.href === "/mesa"
                ? pathname.startsWith("/mesa")
                : pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs sm:text-sm font-bold tracking-wide transition-all border ${
                  ativo
                    ? "bg-black text-white border-black shadow-[1px_1px_0px_#000]"
                    : "border-transparent text-foreground/80 hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="size-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <AlternarTema />

          {user ? (
            <UsuarioMenu user={user} />
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold border border-black shadow-[1px_1px_0px_#000] hover:bg-neutral-800 transition-colors"
            >
              <LogIn className="size-3.5" />
              <span>Entrar</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
