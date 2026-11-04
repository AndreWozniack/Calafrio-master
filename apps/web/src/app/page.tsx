"use client";

import { useFichaCalafrio } from "@calafrio/ficha-app";
import { Dices, Moon, Sparkles, Sun } from "lucide-react";
import { useState } from "react";
import { AssistenteCriacaoCalafrio } from "@/components/ficha/assistente-criacao-calafrio";
import { ModalRolagemCalafrio } from "@/components/ficha/modal-rolagem-calafrio";
import { PaginaFrenteFicha } from "@/components/ficha/pagina-frente-ficha";
import { PaginaVersoMatriz } from "@/components/ficha/pagina-verso-matriz";

export default function PaginaFichaPrincipal() {
  const f = useFichaCalafrio();
  const [paginaAtiva, setPaginaAtiva] = useState<"frente" | "verso">("frente");
  const [mostrarRolagem, setMostrarRolagem] = useState(false);
  const [palavraChaveRolagem, setPalavraChaveRolagem] = useState<
    string | undefined
  >(undefined);
  const [mostrarAssistente, setMostrarAssistente] = useState(false);

  return (
    <div className="space-y-6">
      {/* Barra de Controle e Ações Rápidas */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-card border border-border rounded-md shadow-sm">
        <div className="flex items-center gap-2">
          {/* Alternador de Páginas da Ficha Oficial */}
          <div className="inline-flex p-1 bg-muted rounded-sm border border-border text-xs font-bold">
            <button
              type="button"
              onClick={() => setPaginaAtiva("frente")}
              className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
                paginaAtiva === "frente"
                  ? "bg-amber-400 text-black shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              📄 Página 1 (Frente: Vitais & Itens)
            </button>
            <button
              type="button"
              onClick={() => setPaginaAtiva("verso")}
              className={`px-3 py-1.5 rounded-xs transition-colors cursor-pointer ${
                paginaAtiva === "verso"
                  ? "bg-amber-400 text-black shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🧩 Página 2 (Verso: Matriz 3×3 & Ecos)
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Assistente de Criação */}
          <button
            type="button"
            onClick={() => setMostrarAssistente(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30 rounded text-xs font-bold cursor-pointer"
          >
            <Sparkles className="size-3.5" /> Assistente de Criação
          </button>

          {/* Descansos */}
          <button
            type="button"
            onClick={() => f.descansar("curto", 1, "fixo")}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-muted hover:bg-border rounded text-xs font-bold cursor-pointer text-muted-foreground hover:text-foreground"
            title="Descanso Curto (1h: +9 PA)"
          >
            <Sun className="size-3.5 text-amber-400" /> Descanso Curto (+9 PA)
          </button>

          <button
            type="button"
            onClick={() => f.descansar("longo", 8, "fixo")}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-muted hover:bg-border rounded text-xs font-bold cursor-pointer text-muted-foreground hover:text-foreground"
            title="Descanso Longo (8h: +6 PV e todo o PA)"
          >
            <Moon className="size-3.5 text-cyan-400" /> Descanso Longo (+6 PV /
            Full PA)
          </button>

          {/* Rolar d20 */}
          <button
            type="button"
            onClick={() => {
              setPalavraChaveRolagem(undefined);
              setMostrarRolagem(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 text-black hover:bg-amber-300 rounded text-xs font-black cursor-pointer shadow-sm"
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
          onDefinirNome={(nome) => f.dispatch({ tipo: "definirNome", nome })}
          onDefinirApt={(apt) => f.dispatch({ tipo: "definirApt", apt })}
          onAdicionarPalavraChave={(palavra) =>
            f.dispatch({ tipo: "adicionarPalavraChave", palavra })
          }
          onRemoverPalavraChave={(id) =>
            f.dispatch({ tipo: "removerPalavraChave", id })
          }
          onAdicionarItem={(item) =>
            f.dispatch({ tipo: "adicionarItem", item })
          }
          onAlternarEquipado={(id) =>
            f.dispatch({ tipo: "alternarEquipadoItem", id })
          }
          onRemoverItem={(id) => f.dispatch({ tipo: "removerItem", id })}
          onAtualizarCarteira={(fundos, espirions) =>
            f.dispatch({ tipo: "definirCarteira", fundos, espirions })
          }
          onAbrirRolagem={(palavra) => {
            setPalavraChaveRolagem(palavra);
            setMostrarRolagem(true);
          }}
          onCurarPv={f.curarPv}
          onCurarPa={f.curarPa}
        />
      ) : (
        <PaginaVersoMatriz
          ficha={f.ficha}
          derivada={f.derivada}
          catalogo={f.catalogo}
          onAlocarSlot={(slot, alocacao) =>
            f.dispatch({ tipo: "alocarSlotMatriz", slot, alocacao })
          }
          onLimparSlot={(slot) =>
            f.dispatch({ tipo: "limparSlotMatriz", slot })
          }
          onAdicionarHabilidadeUnica={(unica) =>
            f.dispatch({ tipo: "adicionarHabilidadeUnica", unica })
          }
          onRemoverHabilidadeUnica={(id) =>
            f.dispatch({ tipo: "removerHabilidadeUnica", id })
          }
          focoAtivoId={f.estado.focoAtivoId}
          onAlternarFoco={f.alternarFoco}
          onDefinirAnotacoes={(anotacoes) =>
            f.dispatch({ tipo: "definirAnotacoes", anotacoes })
          }
        />
      )}

      {/* Modais Globais */}
      <ModalRolagemCalafrio
        aberto={mostrarRolagem}
        derivada={f.derivada}
        palavraChaveInicial={palavraChaveRolagem}
        onFechar={() => setMostrarRolagem(false)}
      />

      <AssistenteCriacaoCalafrio
        aberto={mostrarAssistente}
        ficha={f.ficha}
        derivada={f.derivada}
        catalogo={f.catalogo}
        onDefinirNome={(nome) => f.dispatch({ tipo: "definirNome", nome })}
        onDefinirApt={(apt) => f.dispatch({ tipo: "definirApt", apt })}
        onAdicionarPalavraChave={(palavra) =>
          f.dispatch({ tipo: "adicionarPalavraChave", palavra })
        }
        onRemoverPalavraChave={(id) =>
          f.dispatch({ tipo: "removerPalavraChave", id })
        }
        onAtualizarCarteira={(fundos, espirions) =>
          f.dispatch({ tipo: "definirCarteira", fundos, espirions })
        }
        onFechar={() => setMostrarAssistente(false)}
      />
    </div>
  );
}
