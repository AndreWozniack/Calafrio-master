import type { RolagemMesa } from "@/services/armazenamento-calafrio";

interface EstiloVisual {
  container: string;
  numero: string;
  veredito: string;
}

const ESTILOS_DESFECHO: Record<RolagemMesa["desfecho"], EstiloVisual> = {
  critico: {
    container:
      "border-amber-400/80 bg-amber-50/80 text-amber-950 dark:border-amber-500/60 dark:bg-amber-950/25 dark:text-amber-100",
    numero: "text-amber-800 dark:text-amber-300",
    veredito: "text-amber-900 dark:text-amber-300 font-extrabold",
  },
  sucesso: {
    container:
      "border-emerald-400/80 bg-emerald-50/80 text-emerald-950 dark:border-emerald-500/50 dark:bg-emerald-950/25 dark:text-emerald-100",
    numero: "text-emerald-800 dark:text-emerald-300",
    veredito: "text-emerald-900 dark:text-emerald-300 font-extrabold",
  },
  falha: {
    container:
      "border-red-300 bg-red-50/80 text-red-950 dark:border-red-500/50 dark:bg-red-950/25 dark:text-red-100",
    numero: "text-red-700 dark:text-red-300",
    veredito: "text-red-800 dark:text-red-300 font-extrabold",
  },
  desastre: {
    container:
      "border-red-500 bg-red-100/90 text-red-950 dark:border-red-500/80 dark:bg-red-950/45 dark:text-red-100",
    numero: "text-red-900 dark:text-red-200",
    veredito: "text-red-950 dark:text-red-200 font-black",
  },
};

function horaCurta(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CardRolagemFeed({ rolagem }: { rolagem: RolagemMesa }) {
  const estilo = ESTILOS_DESFECHO[rolagem.desfecho];
  return (
    <li
      className={`entrada flex items-center gap-3 rounded-lg border p-3 shadow-xs transition-colors ${estilo.container}`}
    >
      <div className={`w-12 text-center text-2xl font-black ${estilo.numero}`}>
        {rolagem.total}
      </div>
      <div className="min-w-0 flex-1 text-xs space-y-0.5">
        <div className="truncate font-black text-foreground">
          {rolagem.autor} · {rolagem.acao}
        </div>
        <div className="text-muted-foreground">{rolagem.detalhe}</div>
        <div
          className={`uppercase tracking-wide text-xs font-bold ${estilo.veredito}`}
        >
          {rolagem.veredito}
        </div>
      </div>
      <time className="text-xs text-muted-foreground font-semibold">
        {horaCurta(rolagem.criadaEm)}
      </time>
    </li>
  );
}
