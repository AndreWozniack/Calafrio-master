"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  type FichaViva,
  type ModoVisualizacao,
  type NivelZoomFicha,
  type PaginaFicha,
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
      className={`group absolute top-1/2 -translate-y-1/2 z-40 flex size-12 sm:size-14 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-[#fbfbf9]/95 text-black shadow-[2px_3px_0px_#000] backdrop-blur transition-all duration-300 ease-out hover:scale-110 hover:shadow-[3px_5px_0px_#000] active:scale-95 active:shadow-[1px_1px_0px_#000] ${visibilidade} ${
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

export function VisualizadorPapel({
  f,
  modo,
  pagina,
  onMudarPagina,
  onAbrirRolagem,
  zoom,
}: VisualizadorPapelProps) {
  const [transicao, setTransicao] = useState<{
    paginaAlvo: PaginaFicha;
    tipo: "avancar" | "voltar";
    folhaAnimando: PaginaFicha;
  } | null>(null);

  const inicioToque = useRef<number | null>(null);

  const virar = (destino: PaginaFicha) => {
    if (destino === pagina || transicao) return;
    const avancando = ORDEM_PAGINAS[destino] > ORDEM_PAGINAS[pagina];
    setTransicao({
      paginaAlvo: destino,
      tipo: avancando ? "avancar" : "voltar",
      folhaAnimando: avancando ? destino : pagina,
    });
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

  // Determina quais folhas estão ativas/visíveis na pilha real
  const mostrarVerso =
    pagina === "verso" ||
    pagina === "ecos" ||
    transicao?.folhaAnimando === "verso";

  const mostrarEcos =
    pagina === "ecos" || transicao?.folhaAnimando === "ecos";

  const animacaoVerso =
    transicao?.folhaAnimando === "verso"
      ? transicao.tipo === "avancar"
        ? "folha-camada-cima-entrar"
        : "folha-camada-cima-sair"
      : "";

  const animacaoEcos =
    transicao?.folhaAnimando === "ecos"
      ? transicao.tipo === "avancar"
        ? "folha-camada-cima-entrar"
        : "folha-camada-cima-sair"
      : "";

  const renderPagina = (alvo: PaginaFicha) => {
    switch (alvo) {
      case "frente":
        return (
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
            zoom={zoom}
          />
        );
      case "verso":
        return (
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
            onNavegarParaEcos={() => virar("ecos")}
            zoom={zoom}
          />
        );
      case "ecos":
        return (
          <PaginaEcosAprimoramentos
            ficha={f.ficha}
            derivada={f.derivada}
            catalogo={f.catalogo}
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
            zoom={zoom}
          />
        );
    }
  };

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
        <div className="flex items-end gap-1.5 px-2 -mb-[2px] z-30 relative">
          {(
            [
              ["frente", "1 · Identidade"],
              ["verso", "2 · Matriz"],
              ["ecos", "3 · Ecos & Aprimoramentos"],
            ] as const
          ).map(([alvo, rotulo]) => {
            const ativa = pagina === alvo;
            return (
              <button
                key={alvo}
                type="button"
                onClick={() => virar(alvo)}
                className={`cursor-pointer px-4 py-2 text-xs font-black uppercase tracking-wider rounded-t-md transition-all flex items-center gap-2 font-heading ${
                  ativa
                    ? "bg-[#fbfbf9] text-black border-2 border-b-0 border-black shadow-[0_-2px_6px_rgba(0,0,0,0.06)] relative z-20 pb-2.5"
                    : "bg-[#e5e5e0] text-black/60 border border-b-0 border-black/30 hover:bg-[#eaeae5] hover:text-black"
                }`}
              >
                <span
                  className={`size-2 rounded-full ${
                    ativa ? "bg-black" : "bg-black/40"
                  }`}
                />
                {rotulo}
              </button>
            );
          })}
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

      {/* Pilha Real de Folhas Físicas */}
      {!duas ? (
        <div className="relative w-full pb-4 sm:pb-6 pr-3 sm:pr-6">
          <div className="relative w-full overflow-x-clip">
            {/* Folha 1 (Frente / Identidade) — Base da mesa: NUNCA SE MEXE */}
            <div
              className={`relative w-full rounded-sm transition-shadow duration-300 ${
                pagina === "frente" && !transicao
                  ? "z-30 pointer-events-auto shadow-xl"
                  : "z-10 pointer-events-none shadow-md"
              }`}
            >
              {renderPagina("frente")}

              {/* Faixa tátil clicável na margem exposta da Folha 1 */}
              {pagina !== "frente" && (
                <button
                  type="button"
                  onClick={() => virar("frente")}
                  title="Voltar para a Folha 1 (Identidade)"
                  aria-label="Voltar para a Folha 1 (Identidade)"
                  className="absolute top-0 left-0 w-3 sm:w-6 h-full z-40 cursor-pointer pointer-events-auto bg-transparent hover:bg-black/5 transition-colors"
                />
              )}
            </div>

            {/* Folha 2 (Verso / Matriz) — Sobreposta à Folha 1 em posição física fixa */}
            {mostrarVerso && (
              <div
                className={`absolute inset-0 translate-x-1.5 sm:translate-x-3 translate-y-1 sm:translate-y-2 ${
                  pagina === "verso" && !transicao
                    ? "z-30 pointer-events-auto"
                    : "z-20 pointer-events-none"
                }`}
              >
                <div
                  className={`relative w-full rounded-sm shadow-xl ${animacaoVerso}`}
                >
                  {renderPagina("verso")}

                  {/* Faixa tátil clicável na margem exposta da Folha 2 quando a Folha 3 está por cima */}
                  {pagina === "ecos" && (
                    <button
                      type="button"
                      onClick={() => virar("verso")}
                      title="Voltar para a Folha 2 (Matriz)"
                      aria-label="Voltar para a Folha 2 (Matriz)"
                      className="absolute top-0 left-0 w-3 sm:w-6 h-full z-40 cursor-pointer pointer-events-auto bg-transparent hover:bg-black/5 transition-colors"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Folha 3 (Ecos & Aprimoramentos) — Sobreposta à Folha 2 em posição física fixa */}
            {mostrarEcos && (
              <div
                className={`absolute inset-0 translate-x-3 sm:translate-x-6 translate-y-2 sm:translate-y-4 ${
                  pagina === "ecos" && !transicao
                    ? "z-30 pointer-events-auto"
                    : "z-20 pointer-events-none"
                }`}
              >
                <div
                  className={`relative w-full rounded-sm shadow-2xl ${animacaoEcos}`}
                >
                  {renderPagina("ecos")}
                </div>
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

      {/* Controles de Paginação Rodapé */}
      <div
        className={`mt-4 flex items-center justify-center gap-2.5 text-xs font-bold ${controlesVisiveis}`}
      >
        {(
          [
            ["frente", "1 · Identidade"],
            ["verso", "2 · Matriz"],
            ["ecos", "3 · Ecos & Aprimoramentos"],
          ] as const
        ).map(([alvo, rotulo]) => (
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
            {rotulo}
          </button>
        ))}
      </div>
    </div>
  );
}
