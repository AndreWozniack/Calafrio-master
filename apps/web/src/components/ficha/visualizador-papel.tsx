"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  type FichaViva,
  type ModoVisualizacao,
  type NivelZoomFicha,
  type PaginaFicha,
  obterConfigZoomFicha,
} from "./fichas-tipos";
import { PaginaEcosAprimoramentos } from "./pagina-ecos-aprimoramentos";
import { PaginaFrenteFicha } from "./pagina-frente-ficha";
import { PaginaVersoMatriz } from "./pagina-verso-matriz";

interface VisualizadorPapelProps {
  f: FichaViva;
  modo: ModoVisualizacao;
  pagina: PaginaFicha;
  onMudarPagina: (pagina: PaginaFicha) => void;
  onAbrirRolagem: (nome?: string) => void;
  zoom?: NivelZoomFicha;
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

const ORDEM_PAGINAS: Record<PaginaFicha, number> = {
  frente: 1,
  verso: 2,
  ecos: 3,
};

type TransicaoPilha =
  | {
      tipo: "avancar";
      baixo: PaginaFicha;
      cima: PaginaFicha;
    }
  | {
      tipo: "voltar";
      baixo: PaginaFicha;
      cima: PaginaFicha;
    }
  | null;

export function VisualizadorPapel({
  f,
  modo,
  pagina,
  onMudarPagina,
  onAbrirRolagem,
  zoom = "100",
}: VisualizadorPapelProps) {
  const [transicao, setTransicao] = useState<TransicaoPilha>(null);
  const inicioToque = useRef<number | null>(null);

  const virar = (destino: PaginaFicha) => {
    if (destino === pagina || transicao !== null) return;
    const avancando = ORDEM_PAGINAS[destino] > ORDEM_PAGINAS[pagina];
    if (avancando) {
      setTransicao({
        tipo: "avancar",
        baixo: pagina,
        cima: destino,
      });
    } else {
      setTransicao({
        tipo: "voltar",
        baixo: destino,
        cima: pagina,
      });
    }
    onMudarPagina(destino);
  };

  useEffect(() => {
    if (!transicao) return;
    const timer = setTimeout(() => {
      setTransicao(null);
    }, 360);
    return () => clearTimeout(timer);
  }, [transicao]);

  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (digitando(e.target) || document.querySelector(".fixed.inset-0")) return;
      if (e.key === "ArrowRight") {
        if (pagina === "frente") virar("verso");
        else if (pagina === "verso") virar("ecos");
      }
      if (e.key === "ArrowLeft") {
        if (pagina === "ecos") virar("verso");
        else if (pagina === "verso") virar("frente");
      }
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  });

  const duas = modo === "duas";
  const controlesVisiveis = duas ? "lg:hidden" : "";
  const configZoom = obterConfigZoomFicha(zoom);

  const renderPagina = (alvo: PaginaFicha) => {
    switch (alvo) {
      case "frente":
        return (
          <PaginaFrenteFicha
            ficha={f.ficha}
            derivada={f.derivada}
            zoom={zoom}
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
        );
      case "verso":
        return (
          <PaginaVersoMatriz
            ficha={f.ficha}
            derivada={f.derivada}
            catalogo={f.catalogo}
            zoom={zoom}
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
        );
      case "ecos":
        return (
          <PaginaEcosAprimoramentos
            ficha={f.ficha}
            derivada={f.derivada}
            catalogo={f.catalogo}
            zoom={zoom}
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
            onDefinirAnotacoes={f.definirAnotacoes}
          />
        );
    }
  };

  return (
    <div
      className={`relative ${duas ? "w-full" : "mx-auto w-full transition-[max-width] duration-200 ease-out"}`}
      style={duas ? undefined : { maxWidth: `${configZoom.larguraMaximaFolhaPx}px` }}
      onTouchStart={(e) => {
        inicioToque.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (inicioToque.current === null || digitando(e.target)) return;
        const dx = e.changedTouches[0].clientX - inicioToque.current;
        inicioToque.current = null;
        if (dx < -LIMITE_SWIPE_PX) {
          if (pagina === "frente") virar("verso");
          else if (pagina === "verso") virar("ecos");
        }
        if (dx > LIMITE_SWIPE_PX) {
          if (pagina === "ecos") virar("verso");
          else if (pagina === "verso") virar("frente");
        }
      }}
    >
      {/* Abas físicas estilo fichário/dossiê (modo uma página) */}
      {!duas && (
        <div className="flex items-end gap-1.5 px-2 -mb-[2px] z-10 relative">
          <button
            type="button"
            onClick={() => virar("frente")}
            className={`cursor-pointer px-4 py-2 text-xs font-black uppercase tracking-wider rounded-t-md transition-all flex items-center gap-2 ${
              pagina === "frente"
                ? "bg-[#fbfbf9] text-black border-2 border-b-0 border-black shadow-[0_-2px_6px_rgba(0,0,0,0.06)] relative z-20 pb-2.5 font-heading"
                : "bg-[#e5e5e0] text-black/60 border border-b-0 border-black/30 hover:bg-[#eaeae5] hover:text-black font-heading"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                pagina === "frente" ? "bg-black" : "bg-black/40"
              }`}
            />
            1 · Identidade
          </button>
          <button
            type="button"
            onClick={() => virar("verso")}
            className={`cursor-pointer px-4 py-2 text-xs font-black uppercase tracking-wider rounded-t-md transition-all flex items-center gap-2 ${
              pagina === "verso"
                ? "bg-[#fbfbf9] text-black border-2 border-b-0 border-black shadow-[0_-2px_6px_rgba(0,0,0,0.06)] relative z-20 pb-2.5 font-heading"
                : "bg-[#e5e5e0] text-black/60 border border-b-0 border-black/30 hover:bg-[#eaeae5] hover:text-black font-heading"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                pagina === "verso" ? "bg-black" : "bg-black/40"
              }`}
            />
            2 · Matriz
          </button>
          <button
            type="button"
            onClick={() => virar("ecos")}
            className={`cursor-pointer px-4 py-2 text-xs font-black uppercase tracking-wider rounded-t-md transition-all flex items-center gap-2 ${
              pagina === "ecos"
                ? "bg-[#fbfbf9] text-black border-2 border-b-0 border-black shadow-[0_-2px_6px_rgba(0,0,0,0.06)] relative z-20 pb-2.5 font-heading"
                : "bg-[#e5e5e0] text-black/60 border border-b-0 border-black/30 hover:bg-[#eaeae5] hover:text-black font-heading"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                pagina === "ecos" ? "bg-black" : "bg-black/40"
              }`}
            />
            3 · Ecos & Aprimoramentos
          </button>
        </div>
      )}

      {/* Setas Laterais de Navegação */}
      {pagina === "frente" && (
        <SetaVirar
          sentido="direita"
          rotulo="Virar para a Matriz de Habilidades"
          onClick={() => virar("verso")}
          visibilidade={`flex ${controlesVisiveis}`}
        />
      )}
      {pagina === "verso" && (
        <>
          <SetaVirar
            sentido="esquerda"
            rotulo="Voltar para a Frente (Identidade)"
            onClick={() => virar("frente")}
            visibilidade={`flex ${controlesVisiveis}`}
          />
          <SetaVirar
            sentido="direita"
            rotulo="Avançar para Ecos & Aprimoramentos"
            onClick={() => virar("ecos")}
            visibilidade={`flex ${controlesVisiveis}`}
          />
        </>
      )}
      {pagina === "ecos" && (
        <SetaVirar
          sentido="esquerda"
          rotulo="Voltar para a Matriz de Habilidades"
          onClick={() => virar("verso")}
          visibilidade={`flex ${controlesVisiveis}`}
        />
      )}

      {/* Visualização de Páginas com Sobreposição Física */}
      {!duas ? (
        <div className="relative w-full">
          {/* Bordas decorativas da pilha de folhas embaixo (Stack Paper Effect) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-1 translate-y-1 rounded-sm border border-black/25 bg-[#eaeae5] shadow-xs pointer-events-none -z-10"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-2 translate-y-2 rounded-sm border border-black/15 bg-[#dfdfd8] shadow-xs pointer-events-none -z-20"
          />

          <div className="relative w-full overflow-x-clip rounded-sm shadow-xl">
            {transicao ? (
              transicao.tipo === "avancar" ? (
                <>
                  {/* Folha de baixo (fica no lugar e recebe leve sombra de profundidade) */}
                  <div
                    key={`baixo-${transicao.baixo}`}
                    className="relative z-10 w-full pointer-events-none folha-camada-baixo-avancar"
                  >
                    {renderPagina(transicao.baixo)}
                  </div>
                  {/* Folha de cima (entra deslizando por cima com borda e sombra) */}
                  <div
                    key={`cima-${transicao.cima}`}
                    className="absolute inset-0 z-20 w-full folha-camada-cima-entrar pointer-events-none"
                  >
                    {renderPagina(transicao.cima)}
                  </div>
                </>
              ) : (
                <>
                  {/* Folha de baixo (já está no lugar, sendo revelada) */}
                  <div
                    key={`baixo-${transicao.baixo}`}
                    className="relative z-10 w-full pointer-events-none folha-camada-baixo-voltar"
                  >
                    {renderPagina(transicao.baixo)}
                  </div>
                  {/* Folha de cima (desliza para a direita saindo de cima) */}
                  <div
                    key={`cima-${transicao.cima}`}
                    className="absolute inset-0 z-20 w-full folha-camada-cima-sair pointer-events-none"
                  >
                    {renderPagina(transicao.cima)}
                  </div>
                </>
              )
            ) : (
              /* Em repouso (interativa) */
              <div key={`atual-${pagina}`} className="relative z-10 w-full">
                {renderPagina(pagina)}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Modo 2 páginas lado a lado */
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <div>{renderPagina("frente")}</div>
          <div>{renderPagina(pagina === "ecos" ? "ecos" : "verso")}</div>
        </div>
      )}

      <div
        className={`mt-4 flex items-center justify-center gap-2.5 text-xs font-bold ${controlesVisiveis}`}
      >
        {(["frente", "verso", "ecos"] as const).map((alvo) => (
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
            {alvo === "frente"
              ? "1 · Identidade"
              : alvo === "verso"
                ? "2 · Matriz"
                : "3 · Ecos"}
          </button>
        ))}
      </div>
    </div>
  );
}
