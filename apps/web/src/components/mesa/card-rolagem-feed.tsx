import type { RolagemMesa } from "@/services/armazenamento-calafrio";

const ESTILO_DESFECHO: Record<RolagemMesa["desfecho"], string> = {
  critico: "border-amber-400/60 bg-amber-950/20 text-amber-200",
  sucesso: "border-green-500/40 bg-green-950/15 text-green-200",
  falha: "border-red-500/40 bg-red-950/15 text-red-200",
  desastre: "border-red-500/70 bg-red-950/30 text-red-100",
};

function horaCurta(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CardRolagemFeed({ rolagem }: { rolagem: RolagemMesa }) {
  return (
    <li
      className={`flex items-center gap-3 rounded-lg border p-3 ${ESTILO_DESFECHO[rolagem.desfecho]}`}
    >
      <div className="w-12 text-center text-2xl font-black">
        {rolagem.total}
      </div>
      <div className="min-w-0 flex-1 text-xs">
        <div className="truncate font-black text-foreground">
          {rolagem.autor} · {rolagem.acao}
        </div>
        <div className="text-muted-foreground">{rolagem.detalhe}</div>
        <div className="font-bold uppercase tracking-wide">
          {rolagem.veredito}
        </div>
      </div>
      <time className="text-[10px] text-muted-foreground">
        {horaCurta(rolagem.criadaEm)}
      </time>
    </li>
  );
}
