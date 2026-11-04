"use client";

import {
  Dices,
  LayoutDashboard,
  NotebookPen,
  Swords,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { estaNaFicha } from "@/lib/rota-ficha";

const ABAS = [
  { sufixo: "", label: "Painel", Icon: LayoutDashboard },
  { sufixo: "/players", label: "Players", Icon: Users },
  { sufixo: "/combate", label: "Combate", Icon: Swords },
  { sufixo: "/dados", label: "Dados", Icon: Dices },
  { sufixo: "/anotacoes", label: "Anotações", Icon: NotebookPen },
];

export function NavegacaoMesa({ mesaId }: { mesaId: string }) {
  const pathname = usePathname();
  const base = `/mesa/${mesaId}`;

  if (estaNaFicha(pathname)) return null;

  return (
    <nav className="flex items-center gap-1.5 border-b border-border/80 pb-2.5 overflow-x-auto no-scrollbar">
      {ABAS.map(({ sufixo, label, Icon }) => {
        const href = base + sufixo;
        const ativa =
          sufixo === "" ? pathname === base : pathname.startsWith(href);
        return (
          <Link
            key={label}
            href={href}
            className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
              ativa
                ? "bg-foreground text-background shadow-xs font-black"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            <Icon className="size-3.5" /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
