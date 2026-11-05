"use client";

import { useEffect, useRef, useState } from "react";
import {
  type FichaViva,
  type ModoVisualizacao,
  type NivelZoomFicha,
  obterConfigZoomFicha,
  type PaginaFicha,
} from "./fichas-tipos";
import { PaginaEcosAprimoramentos } from "./pagina-ecos-aprimoramentos";
import { PaginaFrenteFicha } from "./pagina-frente-ficha";
import { PaginaVersoMatriz } from "./pagina-verso-matriz";
import {
  AbasFicharioDossie,
  BotoesPaginacaoRodape,
  SetaVirar,
} from "./papel/controles-navegacao-papel";

interface VisualizadorPapelProps {
  f: FichaViva;
  modo?: ModoVisualizacao;
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

const ORDEM_PAGINAS: Record<PaginaFicha, number> = {
  frente: 1,
  verso: 2,
  ecos: 3,
};

export function VisualizadorPapel({
  f,
  modo = "uma",
  pagina,
  onMudarPagina,
  onAbrirRolagem,
  zoom = "100",
}: VisualizadorPapelProps) {
  const [transicao, setTransicao] = useState<{
    cima: PaginaFicha;
    baixo: PaginaFicha;
    tipo: "avancar" | "voltar";
  } | null>(null);

  const inicioToque = useRef<number | null>(null);

  const virar = (destino: PaginaFicha) => {
    if (destino === pagina || transicao) return;
    const avancando = ORDEM_PAGINAS[destino] > ORDEM_PAGINAS[pagina];
    setTransicao({
      cima: avancando ? destino : pagina,
      baixo: avancando ? pagina : destino,
      tipo: avancando ? "avancar" : "voltar",
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
      if (digitando(e.target) || document.querySelector(".fixed.inset-0"))
        return;
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

  const animacaoVerso =
    transicao?.cima === "verso" && transicao.tipo === "avancar"
      ? "folha-camada-cima-entrar"
      : transicao?.cima === "verso" && transicao.tipo === "voltar"
        ? "folha-camada-cima-sair"
        : "";

  const animacaoEcos =
    transicao?.cima === "ecos" && transicao.tipo === "avancar"
      ? "folha-camada-cima-entrar"
      : transicao?.cima === "ecos" && transicao.tipo === "voltar"
        ? "folha-camada-cima-sair"
        : "";

  const mostrarVerso =
    pagina === "verso" ||
    pagina === "ecos" ||
    transicao?.cima === "verso" ||
    transicao?.baixo === "verso";

  const mostrarEcos =
    pagina === "ecos" ||
    transicao?.cima === "ecos" ||
    transicao?.baixo === "ecos";

  const obterZIndex = (folha: PaginaFicha) => {
    if (transicao) {
      if (transicao.cima === folha) return "z-30";
      if (transicao.baixo === folha) return "z-20";
      return "z-10";
    }
    if (pagina === folha) return "z-30";
    if (pagina === "ecos") {
      return folha === "verso" ? "z-20" : "z-10";
    }
    if (pagina === "verso") {
      return folha === "frente" ? "z-20" : "z-10";
    }
    return folha === "verso" ? "z-20" : "z-10";
  };

  return (
    <div
      className={`relative ${
        duas
          ? "w-full"
          : "mx-auto w-full transition-[max-width] duration-200 ease-out"
      }`}
      style={
        duas ? undefined : { maxWidth: `${configZoom.larguraMaximaFolhaPx}px` }
      }
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
      {/* Abas físicas estilo fichário/dossiê */}
      {!duas && <AbasFicharioDossie pagina={pagina} onVirar={virar} />}

      {/* Setas Laterais de Navegação */}
      {pagina === "frente" && (
        <SetaVirar
          sentido="direita"
          rotulo="Virar para a Matriz de Habilidades"
          onClick={() => virar("verso")}
          visibilidade={controlesVisiveis}
        />
      )}
      {pagina === "verso" && (
        <>
          <SetaVirar
            sentido="esquerda"
            rotulo="Voltar para a Frente (Identidade)"
            onClick={() => virar("frente")}
            visibilidade={controlesVisiveis}
          />
          <SetaVirar
            sentido="direita"
            rotulo="Avançar para Ecos & Aprimoramentos"
            onClick={() => virar("ecos")}
            visibilidade={controlesVisiveis}
          />
        </>
      )}
      {pagina === "ecos" && (
        <SetaVirar
          sentido="esquerda"
          rotulo="Voltar para a Matriz de Habilidades"
          onClick={() => virar("verso")}
          visibilidade={controlesVisiveis}
        />
      )}

      {/* Visualização de Páginas: Pilha Real com Deslocamento Vertical Sutil (sem deslocamento horizontal) */}
      {!duas ? (
        <div className="relative w-full pb-3 sm:pb-4">
          <div className="relative w-full overflow-hidden rounded-sm">
            {/* Folha 1 (Frente / Identidade) — Base da pilha: y = 0 */}
            <div
              className={`relative w-full rounded-sm transition-all duration-300 ${obterZIndex(
                "frente",
              )} ${
                pagina === "frente" && !transicao
                  ? "pointer-events-auto shadow-xl"
                  : "pointer-events-none shadow-md"
              } translate-x-0 translate-y-0`}
            >
              {renderPagina("frente")}

              {/* Borda superior clicável da Folha 1 exposta quando estiver na Folha 2 ou 3 */}
              {pagina !== "frente" && !transicao && (
                <button
                  type="button"
                  onClick={() => virar("frente")}
                  title="Voltar para a Folha 1 (Identidade)"
                  aria-label="Voltar para a Folha 1 (Identidade)"
                  className="absolute top-0 left-0 w-full h-1.5 sm:h-2 z-40 cursor-pointer pointer-events-auto bg-transparent hover:bg-black/10 transition-colors"
                />
              )}
            </div>

            {/* Folha 2 (Verso / Matriz) — Sobreposta ligeiramente mais para baixo (y = 4px a 6px) */}
            {mostrarVerso && (
              <div
                className={`absolute inset-0 translate-x-0 translate-y-1 sm:translate-y-1.5 transition-all duration-300 ${obterZIndex(
                  "verso",
                )} ${
                  pagina === "verso" && !transicao
                    ? "pointer-events-auto shadow-xl"
                    : "pointer-events-none shadow-md"
                }`}
              >
                <div className={`relative w-full rounded-sm ${animacaoVerso}`}>
                  {renderPagina("verso")}

                  {/* Borda superior clicável da Folha 2 exposta quando estiver na Folha 3 */}
                  {pagina === "ecos" && !transicao && (
                    <button
                      type="button"
                      onClick={() => virar("verso")}
                      title="Voltar para a Folha 2 (Matriz)"
                      aria-label="Voltar para a Folha 2 (Matriz)"
                      className="absolute top-0 left-0 w-full h-1.5 sm:h-2 z-40 cursor-pointer pointer-events-auto bg-transparent hover:bg-black/10 transition-colors"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Folha 3 (Ecos & Aprimoramentos) — Sobreposta ligeiramente mais para baixo (y = 8px a 12px) */}
            {mostrarEcos && (
              <div
                className={`absolute inset-0 translate-x-0 translate-y-2 sm:translate-y-3 transition-all duration-300 ${obterZIndex(
                  "ecos",
                )} ${
                  pagina === "ecos" && !transicao
                    ? "pointer-events-auto shadow-2xl"
                    : "pointer-events-none shadow-md"
                }`}
              >
                <div className={`relative w-full rounded-sm ${animacaoEcos}`}>
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
      <BotoesPaginacaoRodape
        pagina={pagina}
        onVirar={virar}
        className={controlesVisiveis}
      />
    </div>
  );
}
