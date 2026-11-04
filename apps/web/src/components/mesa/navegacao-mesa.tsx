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

  return (
    <nav className="flex flex-wrap gap-1.5 border-b border-border pb-3">
      {ABAS.map(({ sufixo, label, Icon }) => {
        const href = base + sufixo;
        const ativa =
          sufixo === "" ? pathname === base : pathname.startsWith(href);
        return (
          <Link
            key={label}
            href={href}
            className={`flex items-center gap-1.5 rounded-sm px-3.5 py-1.5 text-xs font-bold transition-all border ${
              ativa
                ? "bg-black text-white border-black shadow-[1px_1px_0px_#000]"
                : "bg-card text-foreground/80 border-border hover:border-black hover:text-foreground"
            }`}
          >
            <Icon className="size-3.5" /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
