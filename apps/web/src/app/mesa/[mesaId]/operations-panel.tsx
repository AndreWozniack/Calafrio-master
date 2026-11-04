import { BookOpen, FileText, Skull, Swords, Users } from "lucide-react";
import Link from "next/link";

interface OperationsPanelProps {
  mesaId: string;
}

export function OperationsPanel({ mesaId }: OperationsPanelProps) {
  return (
    <aside className="space-y-4">
      {/* Card de Combate em Tempo Real (Estilo T20 Master) */}
      <div className="calafrio-card p-4 space-y-3 border-amber-400/40 bg-gradient-to-br from-amber-950/20 via-card to-card">
        <span className="calafrio-tag">COMBATE & ENCONTROS</span>
        <div className="space-y-1">
          <h3 className="font-black text-sm text-foreground flex items-center gap-1.5">
            <Swords className="size-4 text-amber-400" /> Mesa de Combate
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Rastreador de iniciativas em sentido horário, mitigação com PA e
            controle de ações.
          </p>
        </div>

        <Link
          href={`/mesa/${mesaId}/combate`}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Swords className="size-3.5" /> Abrir Mesa de Combate
        </Link>
      </div>

      {/* Acessos Rápidos da Campanha */}
      <div className="calafrio-card p-4 space-y-2.5">
        <span className="calafrio-tag-sm">CONSULTA RÁPIDA</span>
        <div className="space-y-1.5 text-xs font-bold">
          <Link
            href={`/mesa/${mesaId}/players`}
            className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Users className="size-4 text-amber-400" />
            <span>Gerenciar Todos os Players</span>
          </Link>
          <Link
            href="/bestiario"
            className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Skull className="size-4 text-amber-400" />
            <span>Bestiário & Ameaças</span>
          </Link>
          <Link
            href="/biblioteca"
            className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <BookOpen className="size-4 text-amber-400" />
            <span>Biblioteca & PDFs Oficiais</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
