"use client";

import { BookOpen, Skull, Swords } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalafrioLogo } from "../svg/calafrio-ornamentos";

export function BarraTopo() {
  const pathname = usePathname();

  const links = [
    { href: "/mesa", label: "Suas Mesas", icon: Swords },
    { href: "/biblioteca", label: "Biblioteca & PDFs", icon: BookOpen },
    { href: "/bestiario", label: "Bestiário", icon: Skull },
  ];

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-40 px-4 py-2.5">
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs sm:text-sm font-bold tracking-wide transition-colors ${
                  ativo
                    ? "bg-amber-400 text-black shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="size-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
