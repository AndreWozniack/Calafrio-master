"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FichaViva, ModoVisualizacao, PaginaFicha } from "./fichas-tipos";
import { PaginaFrenteFicha } from "./pagina-frente-ficha";
import { PaginaVersoMatriz } from "./pagina-verso-matriz";

interface VisualizadorPapelProps {
  f: FichaViva;
  modo: ModoVisualizacao;
  pagina: PaginaFicha;
  onMudarPagina: (pagina: PaginaFicha) => void;
  onAbrirRolagem: (nome?: string) => void;
}

const LIMITE_SWIPE_PX = 60;

function digitando(alvo: EventTarget | null) {
  return (
    alvo instanceof HTMLElement &&
    ["INPUT", "TEXTAREA", "SELECT"].includes(alvo.tagName)
  );
}

function SetaVirar({
  sentido,
  rotulo,
  onClick,
  visibilidade,
}: {
  sentido: "esquerda" | "direita";
  rotulo: string;
  onClick: () => void;
  visibilidade: string;
}) {
  const Icone = sentido === "direita" ? ChevronRight : ChevronLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={rotulo}
      title={rotulo}
      className={`absolute top-[38%] z-20 flex-col items-center gap-1 rounded-full border-2 border-black bg-white/95 p-2 text-black shadow-lg transition-transform hover:scale-110 active:scale-95 ${visibilidade} ${
        sentido === "direita" ? "right-1 sm:-right-5" : "left-1 sm:-left-5"
      }`}
    >
      <Icone className="size-6" strokeWidth={3} />
    </button>
  );
}

export function VisualizadorPapel({
  f,
  modo,
  pagina,
  onMudarPagina,
  onAbrirRolagem,
}: VisualizadorPapelProps) {
  const [direcao, setDirecao] = useState<"avancar" | "voltar" | null>(null);
  const inicioToque = useRef<number | null>(null);

  const virar = (destino: PaginaFicha) => {
    if (destino === pagina) return;
    setDirecao(destino === "verso" ? "avancar" : "voltar");
    onMudarPagina(destino);
  };

  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (digitando(e.target) || document.querySelector(".fixed.inset-0")) return;
      if (e.key === "ArrowRight" && pagina === "frente") virar("verso");
      if (e.key === "ArrowLeft" && pagina === "verso") virar("frente");
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  });

  const duas = modo === "duas";
  const controlesVisiveis = duas ? "lg:hidden" : "";
  const animacao =
    direcao === null ? "" : direcao === "avancar" ? "virar-avancar" : "virar-voltar";
  const mostrar = (alvo: PaginaFicha) =>
    pagina === alvo ? "block" : duas ? "hidden lg:block" : "hidden";

  return (
    <div
      className="relative"
      data-modo={modo}
      onTouchStart={(e) => {
        inicioToque.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (inicioToque.current === null || digitando(e.target)) return;
        const dx = e.changedTouches[0].clientX - inicioToque.current;
        inicioToque.current = null;
        if (dx < -LIMITE_SWIPE_PX) virar("verso");
        if (dx > LIMITE_SWIPE_PX) virar("frente");
      }}
    >
      {pagina === "frente" ? (
        <SetaVirar
          sentido="direita"
          rotulo="Virar para o verso (Matriz)"
          onClick={() => virar("verso")}
          visibilidade={`flex ${controlesVisiveis}`}
        />
      ) : (
        <SetaVirar
          sentido="esquerda"
          rotulo="Voltar para a frente"
          onClick={() => virar("frente")}
          visibilidade={`flex ${controlesVisiveis}`}
        />
      )}

      <div className={`grid items-start gap-6 ${duas ? "lg:grid-cols-2" : ""}`}>
        <div key={`frente-${pagina}`} className={`${mostrar("frente")} ${animacao}`}>
          <PaginaFrenteFicha
            ficha={f.ficha}
            derivada={f.derivada}
            onDefinirNome={f.definirNome}
            onDefinirApt={f.definirApt}
            onDefinirRetrato={(url) =>
              f.dispatch({ tipo: "definirRetrato", url })
            }
            onDefinirPvAtual={f.definirPvAtual}
            onDefinirPaAtual={f.definirPaAtual}
            onAdicionarPalavraChave={f.adicionarPalavraChave}
            onRemoverPalavraChave={f.removerPalavraChave}
            onAdicionarItem={f.adicionarItem}
            onAlternarEquipado={(id) =>
              f.dispatch({ tipo: "alternarEquipadoItem", id })
            }
            onRemoverItem={f.removerItem}
            onAtualizarCarteira={f.definirCarteira}
            onAbrirRolagem={onAbrirRolagem}
          />
        </div>
        <div key={`verso-${pagina}`} className={`${mostrar("verso")} ${animacao}`}>
          <PaginaVersoMatriz
            ficha={f.ficha}
            derivada={f.derivada}
            catalogo={f.catalogo}
            onAlocarSlot={(slot, alocacao) =>
              f.alocarSlotMatriz(slot, alocacao.tipo, alocacao.id)
            }
            onLimparSlot={f.limparSlotMatriz}
            onAdicionarHabilidadeUnica={(unica) =>
              f.dispatch({ tipo: "adicionarHabilidadeUnica", unica })
            }
            onAtualizarHabilidadeUnica={(id, dados) =>
              f.dispatch({ tipo: "atualizarHabilidadeUnica", id, dados })
            }
            onRemoverHabilidadeUnica={(id) =>
              f.dispatch({ tipo: "removerHabilidadeUnica", id })
            }
            onAdicionarCustomizacaoEco={(customizacao) =>
              f.dispatch({ tipo: "adicionarCustomizacaoEco", customizacao })
            }
            onRemoverCustomizacaoEco={(id) =>
              f.dispatch({ tipo: "removerCustomizacaoEco", id })
            }
            focoAtivoId={f.estado.focoAtivoId}
            onAlternarFoco={f.alternarFoco}
            onDefinirAnotacoes={f.definirAnotacoes}
          />
        </div>
      </div>

      <div
        className={`mt-4 flex items-center justify-center gap-3 text-xs font-bold ${controlesVisiveis}`}
      >
        {(["frente", "verso"] as const).map((alvo) => (
          <button
            key={alvo}
            type="button"
            onClick={() => virar(alvo)}
            className={`cursor-pointer rounded-full px-4 py-1.5 ${
              pagina === alvo
                ? "bg-black text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {alvo === "frente" ? "1 · Frente" : "2 · Verso"}
          </button>
        ))}
      </div>
    </div>
  );
}
