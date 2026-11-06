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

export function NavegacaoMesa({
  mesaId,
  mestre,
}: {
  mesaId: string;
  mestre: boolean;
}) {
  const pathname = usePathname();
  const base = `/mesa/${mesaId}`;

  if (estaNaFicha(pathname)) return null;

  return (
    <nav className="flex items-center gap-1.5 border-b border-border/80 pb-2.5 overflow-x-auto no-scrollbar">
      {ABAS.filter((a) => mestre || a.sufixo !== "/anotacoes").map(
        ({ sufixo, label, Icon }) => {
          const href = base + sufixo;
          const ativa =
            sufixo === "" ? pathname === base : pathname.startsWith(href);
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-xs font-bold transition-all whitespace-nowrap border ${
                ativa
                  ? "bg-black text-white border-black shadow-[1px_1px_0px_#000] font-black"
                  : "bg-card border-border text-foreground hover:bg-muted shadow-xs"
              }`}
            >
              <Icon className="size-3.5" /> {label}
            </Link>
          );
        },
      )}
    </nav>
  );
}
