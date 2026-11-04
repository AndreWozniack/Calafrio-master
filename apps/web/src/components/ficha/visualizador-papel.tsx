"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { flushSync } from "react-dom";
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
const PERSPECTIVA = "perspective(2000px)";
const ANGULO_BORDA = 84;
const DURACAO_SAIDA_MS = 230;
const DURACAO_ENTRADA_MS = 360;

const girar = (graus: number, opacidade: number) => ({
  transform: `${PERSPECTIVA} rotateY(${graus}deg)`,
  opacity: opacidade,
});

const ehTelaDuasPaginas = () => window.matchMedia("(min-width: 1024px)").matches;
const prefereMovimentoReduzido = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Virada em duas fases, só com transform/opacity (compositor):
 * a folha atual gira até ficar de borda, a troca acontece no instante invisível
 * e a nova folha desdobra do outro lado. A folha sempre pivota na lombada.
 */
async function animarVirada(
  saindo: HTMLElement,
  entrando: HTMLElement,
  sentido: 1 | -1,
  trocar: () => void,
) {
  const origem = sentido === 1 ? "left center" : "right center";
  for (const el of [saindo, entrando]) {
    el.style.transformOrigin = origem;
    el.style.willChange = "transform, opacity";
  }

  const saida = saindo.animate(
    [girar(0, 1), girar(-ANGULO_BORDA * sentido, 0.5)],
    {
      duration: DURACAO_SAIDA_MS,
      easing: "cubic-bezier(0.55, 0, 0.9, 0.6)",
      fill: "forwards",
    },
  );
  await saida.finished;

  Object.assign(entrando.style, girar(ANGULO_BORDA * sentido, 0.5));
  flushSync(trocar);

  const entrada = entrando.animate(
    [girar(ANGULO_BORDA * sentido, 0.5), girar(0, 1)],
    { duration: DURACAO_ENTRADA_MS, easing: "cubic-bezier(0.1, 0.8, 0.2, 1)" },
  );
  entrada.finished
    .catch(() => undefined)
    .finally(() => {
      saida.cancel();
      for (const el of [saindo, entrando]) {
        el.style.transform = "";
        el.style.opacity = "";
        el.style.transformOrigin = "";
        el.style.willChange = "";
      }
    });
  await entrada.finished.catch(() => undefined);
}

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
      className={`group absolute top-1/2 -translate-y-1/2 z-30 flex size-12 sm:size-14 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-[#fbfbf9]/95 text-black shadow-[2px_3px_0px_#000] backdrop-blur transition-all duration-300 ease-out hover:scale-110 hover:shadow-[3px_5px_0px_#000] active:scale-95 active:shadow-[1px_1px_0px_#000] ${visibilidade} ${
        sentido === "direita"
          ? "right-2 sm:-right-6 md:-right-7 lg:-right-8"
          : "left-2 sm:-left-6 md:-left-7 lg:-left-8"
      }`}
    >
      <Icone
        className={`size-7 sm:size-8 transition-transform duration-300 ease-out ${
          sentido === "direita"
            ? "group-hover:translate-x-1"
            : "group-hover:-translate-x-1"
        }`}
        strokeWidth={2.5}
      />
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
  const inicioToque = useRef<number | null>(null);
  const virando = useRef(false);
  const refFrente = useRef<HTMLDivElement>(null);
  const refVerso = useRef<HTMLDivElement>(null);

  const virar = (destino: PaginaFicha) => {
    if (destino === pagina || virando.current) return;
    const saindo = (pagina === "frente" ? refFrente : refVerso).current;
    const entrando = (destino === "frente" ? refFrente : refVerso).current;
    const semAnimacao =
      !saindo ||
      !entrando ||
      prefereMovimentoReduzido() ||
      (modo === "duas" && ehTelaDuasPaginas());
    if (semAnimacao) {
      onMudarPagina(destino);
      return;
    }
    virando.current = true;
    void animarVirada(saindo, entrando, destino === "verso" ? 1 : -1, () =>
      onMudarPagina(destino),
    ).finally(() => {
      virando.current = false;
    });
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
  const mostrar = (alvo: PaginaFicha) =>
    pagina === alvo ? "block" : duas ? "hidden lg:block" : "hidden";

  return (
    <div
      className={`relative ${duas ? "w-full" : "mx-auto max-w-[880px]"}`}
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
        <div ref={refFrente} className={mostrar("frente")}>
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
        <div ref={refVerso} className={mostrar("verso")}>
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
        className={`mt-4 flex items-center justify-center gap-2.5 text-xs font-bold ${controlesVisiveis}`}
      >
        {(["frente", "verso"] as const).map((alvo) => (
          <button
            key={alvo}
            type="button"
            onClick={() => virar(alvo)}
            className={`cursor-pointer rounded-full px-4 py-1.5 border border-black transition-all ${
              pagina === alvo
                ? "bg-black text-white shadow-[1px_1px_0px_#000]"
                : "bg-white text-black hover:bg-black/10"
            }`}
          >
            {alvo === "frente" ? "1 · Frente (Identidade)" : "2 · Verso (Matriz)"}
          </button>
        ))}
      </div>
    </div>
  );
}
