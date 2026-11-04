"use client";

import { Dices, LayoutDashboard, NotebookPen, Swords, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ABAS = [
  { sufixo: "", label: "Painel", Icon: LayoutDashboard },
  { sufixo: "/players", label: "Investigadores", Icon: Users },
  { sufixo: "/combate", label: "Combate", Icon: Swords },
  { sufixo: "/dados", label: "Dados", Icon: Dices },
  { sufixo: "/anotacoes", label: "Anotações", Icon: NotebookPen },
];

export function NavegacaoMesa({ mesaId }: { mesaId: string }) {
  const pathname = usePathname();
  const base = `/mesa/${mesaId}`;

  return (
    <nav className="flex flex-wrap gap-1 border-b border-border pb-3">
      {ABAS.map(({ sufixo, label, Icon }) => {
        const href = base + sufixo;
        const ativa = sufixo === "" ? pathname === base : pathname.startsWith(href);
        return (
          <Link
            key={label}
            href={href}
            className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-bold transition-colors ${
              ativa
                ? "bg-amber-400 text-black shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className="size-3.5" /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
