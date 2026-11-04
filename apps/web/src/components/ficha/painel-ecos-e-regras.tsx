"use client";

import type {
  CatalogoCalafrio,
  CustomizacaoDeEco,
  FichaCalafrio,
  FichaDerivadaCalafrio,
  HabilidadeUnicaCalafrio,
} from "@calafrio/core";
import { TOKENS_PERSONALIDADE } from "@calafrio/tema";
import { Pencil, Plus, Sparkles, Trash2, Wand2 } from "lucide-react";
import { useState } from "react";
import { ModalCustomizacaoEco } from "./modal-customizacao-eco";
import { ModalHabilidadeUnica } from "./modal-habilidade-unica";

interface PainelEcosERegrasProps {
  ficha: FichaCalafrio;
  derivada: FichaDerivadaCalafrio;
  catalogo: CatalogoCalafrio;
  onAdicionarHabilidadeUnica: (unica: HabilidadeUnicaCalafrio) => void;
  onAtualizarHabilidadeUnica?: (
    id: string,
    dados: Partial<HabilidadeUnicaCalafrio>,
  ) => void;
  onRemoverHabilidadeUnica: (id: string) => void;
  onAdicionarCustomizacaoEco?: (customizacao: CustomizacaoDeEco) => void;
  onRemoverCustomizacaoEco?: (id: string) => void;
}

export function PainelEcosERegras({
  ficha,
  derivada,
  catalogo,
  onAdicionarHabilidadeUnica,
  onAtualizarHabilidadeUnica,
  onRemoverHabilidadeUnica,
  onAdicionarCustomizacaoEco,
  onRemoverCustomizacaoEco,
}: PainelEcosERegrasProps) {
  const [modalUnicaAberto, setModalUnicaAberto] = useState(false);
  const [unicaEmEdicao, setUnicaEmEdicao] =
    useState<HabilidadeUnicaCalafrio | null>(null);

  const [modalCustomizacaoAberto, setModalCustomizacaoAberto] = useState(false);

  const abrirNovaUnica = () => {
    setUnicaEmEdicao(null);
    setModalUnicaAberto(true);
  };

  const abrirEditarUnica = (unica: HabilidadeUnicaCalafrio) => {
    setUnicaEmEdicao(unica);
    setModalUnicaAberto(true);
  };

  const lidarSalvarUnica = (unica: HabilidadeUnicaCalafrio) => {
    if (unicaEmEdicao && onAtualizarHabilidadeUnica) {
      onAtualizarHabilidadeUnica(unicaEmEdicao.id, unica);
    } else {
      onAdicionarHabilidadeUnica(unica);
    }
    setModalUnicaAberto(false);
    setUnicaEmEdicao(null);
  };

  return (
    <div className="calafrio-card p-4 space-y-4">
      {/* Resumo de Ecos */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-amber-500/10 border border-amber-500/40 rounded">
        <div>
          <span className="calafrio-tag">
            ECOS: {derivada.ecosDisponiveis} / {derivada.ecosMax}
          </span>
          <p className="text-[11px] text-muted-foreground mt-1">
            Cada Eco permite criar uma Habilidade Única, aprimorar uma existente
            ou reescrever uma regra (acordado com o MdJ).
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={abrirNovaUnica}
            className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs px-2.5 py-1.5 rounded cursor-pointer transition-colors shadow-sm"
          >
            <Plus className="size-3.5" /> Habilidade Única
          </button>
          {onAdicionarCustomizacaoEco && (
            <button
              type="button"
              onClick={() => setModalCustomizacaoAberto(true)}
              className="flex items-center gap-1 bg-muted hover:bg-border text-foreground font-bold text-xs px-2.5 py-1.5 rounded border border-border cursor-pointer transition-colors"
            >
              <Wand2 className="size-3.5 text-accent-ink" /> Aprimorar com Eco
            </button>
          )}
        </div>
      </div>

      {/* Lista de Habilidades Únicas Criadas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between border-b border-border pb-1">
          <span className="calafrio-tag-sm">
            HABILIDADES ÚNICAS ({ficha.habilidadesUnicas.length})
          </span>
        </div>
        {ficha.habilidadesUnicas.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-1">
            Nenhuma habilidade única criada ainda. Clique em "+ Habilidade
            Única" acima para forjar uma!
          </p>
        ) : (
          ficha.habilidadesUnicas.map((u) => (
            <div
              key={u.id}
              className="p-3 rounded border border-amber-500/40 bg-card/60 space-y-1.5 hover:border-amber-500 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div
                  className="flex items-center gap-2 flex-wrap cursor-pointer flex-1"
                  onClick={() => abrirEditarUnica(u)}
                  title="Clique para editar esta habilidade única"
                >
                  <span className="font-bold text-accent-ink text-sm hover:underline">
                    {u.nome}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {u.tipoAcao} · {u.custo} {u.recurso.toUpperCase()}
                  </span>
                  {u.ecosInvestidos && u.ecosInvestidos > 1 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-500">
                      {u.ecosInvestidos} Ecos
                    </span>
                  )}
                  {u.personalidadeAlinhamento && (
                    <span
                      style={{
                        backgroundColor:
                          TOKENS_PERSONALIDADE[u.personalidadeAlinhamento]
                            .corPositiva,
                      }}
                      className="text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded-xs"
                    >
                      Alinha:{" "}
                      {TOKENS_PERSONALIDADE[u.personalidadeAlinhamento].nome}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => abrirEditarUnica(u)}
                    className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Editar habilidade única"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoverHabilidadeUnica(u.id)}
                    className="p-1 text-muted-foreground hover:text-red-400 cursor-pointer"
                    title="Excluir habilidade única"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-foreground/80">{u.descricao}</p>
            </div>
          ))
        )}
      </div>

      {/* Lista de Customizações de Eco em Habilidades Existentes */}
      {ficha.customizacoesEco.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-border">
          <span className="calafrio-tag-sm">
            APRIMORAMENTOS DE ECO ({ficha.customizacoesEco.length})
          </span>
          <div className="space-y-1.5">
            {ficha.customizacoesEco.map((c) => {
              const habOriginal = catalogo.habilidadesParanormais.find(
                (h) => h.id === c.habilidadeAlvoId,
              );
              return (
                <div
                  key={c.id}
                  className="p-2.5 rounded border border-border bg-muted/30 text-xs flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-bold flex items-center gap-1.5 text-foreground">
                      <Sparkles className="size-3 text-accent-ink" />
                      <span>{c.titulo}</span>
                      <span className="text-[10px] text-muted-foreground">
                        (Alvo: {habOriginal?.nome ?? c.habilidadeAlvoId})
                      </span>
                    </div>
                    {c.descricaoMudanca && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {c.descricaoMudanca}
                      </p>
                    )}
                  </div>
                  {onRemoverCustomizacaoEco && (
                    <button
                      type="button"
                      onClick={() => onRemoverCustomizacaoEco(c.id)}
                      className="p-1 text-muted-foreground hover:text-red-400 cursor-pointer"
                      title="Remover aprimoramento"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modais */}
      {modalUnicaAberto && (
        <ModalHabilidadeUnica
          aberto={modalUnicaAberto}
          inicial={unicaEmEdicao ?? undefined}
          onSalvar={lidarSalvarUnica}
          onFechar={() => {
            setModalUnicaAberto(false);
            setUnicaEmEdicao(null);
          }}
        />
      )}

      {modalCustomizacaoAberto && onAdicionarCustomizacaoEco && (
        <ModalCustomizacaoEco
          aberto={modalCustomizacaoAberto}
          ficha={ficha}
          catalogo={catalogo}
          onSalvar={(c) => {
            onAdicionarCustomizacaoEco(c);
            setModalCustomizacaoAberto(false);
          }}
          onFechar={() => setModalCustomizacaoAberto(false)}
        />
      )}
    </div>
  );
}
