"use client";

import type { FichaCalafrio } from "@calafrio/core";
import { useFichaCalafrio } from "@calafrio/ficha-app";
import { ArrowLeft, Dices, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ModalRolagemCalafrio } from "@/components/ficha/modal-rolagem-calafrio";
import { PaginaFrenteFicha } from "@/components/ficha/pagina-frente-ficha";
import { PaginaVersoMatriz } from "@/components/ficha/pagina-verso-matriz";
import { salvarFichaPlayerAction } from "../../actions";

interface FichaLiveClientProps {
  mesaId: string;
  playerId: string;
  fichaInicial: FichaCalafrio;
}

export function FichaLiveClient({
  mesaId,
  playerId,
  fichaInicial,
}: FichaLiveClientProps) {
  const f = useFichaCalafrio(fichaInicial, (nova) => {
    salvarFichaPlayerAction(playerId, nova);
  });

  const [paginaAtiva, setPaginaAtiva] = useState<"frente" | "verso">("frente");
  const [mostrarRolagem, setMostrarRolagem] = useState(false);
  const [palavraChaveRolagem, setPalavraChaveRolagem] = useState<
    string | undefined
  >(undefined);

  return (
    <div className="space-y-6">
      {/* Barra Superior da Ficha */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-card border border-border rounded-md shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/mesa/${mesaId}/players`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-muted hover:bg-border text-foreground text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-3.5 text-amber-400" /> Investigadores
          </Link>

          <span className="text-xs text-muted-foreground font-semibold px-2">
            Investigador:{" "}
            <strong className="text-foreground">{f.ficha.nome}</strong> (APT{" "}
            {f.ficha.aptBase})
          </span>

          {/* Alternador de Páginas */}
          <div className="inline-flex p-0.5 bg-muted rounded border border-border text-xs font-bold">
            <button
              type="button"
              onClick={() => setPaginaAtiva("frente")}
              className={`px-3 py-1 rounded-xs transition-colors cursor-pointer ${
                paginaAtiva === "frente"
                  ? "bg-amber-400 text-black shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Página 1 (Frente)
            </button>
            <button
              type="button"
              onClick={() => setPaginaAtiva("verso")}
              className={`px-3 py-1 rounded-xs transition-colors cursor-pointer ${
                paginaAtiva === "verso"
                  ? "bg-amber-400 text-black shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Página 2 (Matriz 3×3)
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Descansos */}
          <button
            type="button"
            onClick={() => f.descansar("curto", 1, "fixo")}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-muted hover:bg-border rounded text-xs font-bold cursor-pointer text-muted-foreground hover:text-foreground"
            title="Descanso Curto (1h: +9 PA)"
          >
            <Sun className="size-3.5 text-amber-400" /> Curto (+9 PA)
          </button>

          <button
            type="button"
            onClick={() => f.descansar("longo", 8, "fixo")}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-muted hover:bg-border rounded text-xs font-bold cursor-pointer text-muted-foreground hover:text-foreground"
            title="Descanso Longo (8h: +6 PV e todo o PA)"
          >
            <Moon className="size-3.5 text-cyan-400" /> Longo (+6 PV)
          </button>

          {/* Rolar d20 */}
          <button
            type="button"
            onClick={() => {
              setPalavraChaveRolagem(undefined);
              setMostrarRolagem(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 text-black hover:bg-amber-300 rounded text-xs font-black cursor-pointer shadow-sm"
          >
            <Dices className="size-3.5" /> Rolar Dados
          </button>
        </div>
      </div>

      {/* Exibição da Página Selecionada */}
      {paginaAtiva === "frente" ? (
        <PaginaFrenteFicha
          ficha={f.ficha}
          derivada={f.derivada}
          onDefinirNome={f.definirNome}
          onDefinirApt={f.definirApt}
          onAdicionarPalavraChave={f.adicionarPalavraChave}
          onRemoverPalavraChave={f.removerPalavraChave}
          onAdicionarItem={f.adicionarItem}
          onAlternarEquipado={(id) =>
            f.dispatch({ tipo: "alternarEquipadoItem", id })
          }
          onRemoverItem={f.removerItem}
          onAtualizarCarteira={f.definirCarteira}
          onAbrirRolagem={(palavra) => {
            setPalavraChaveRolagem(palavra);
            setMostrarRolagem(true);
          }}
          onCurarPv={(qtd) => f.descansar("longo", qtd, "fixo")}
          onCurarPa={(qtd) => f.descansar("curto", qtd, "fixo")}
        />
      ) : (
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
          onRemoverHabilidadeUnica={(id) =>
            f.dispatch({ tipo: "removerHabilidadeUnica", id })
          }
          onDefinirAnotacoes={f.definirAnotacoes}
        />
      )}

      {/* Modal de Rolagens */}
      {mostrarRolagem && (
        <ModalRolagemCalafrio
          aberto={mostrarRolagem}
          derivada={f.derivada}
          palavraChaveInicial={palavraChaveRolagem}
          onFechar={() => setMostrarRolagem(false)}
        />
      )}
    </div>
  );
}
