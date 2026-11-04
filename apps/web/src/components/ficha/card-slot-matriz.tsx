"use client";

import type {
  AlocacaoSlotMatriz,
  CatalogoCalafrio,
  HabilidadeUnicaCalafrio,
} from "@calafrio/core";
import { TOKENS_PERSONALIDADE } from "@calafrio/tema";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { CadeadoFocoIcon } from "../svg/calafrio-ornamentos";

interface CardSlotMatrizProps {
  numeroSlot: number; // 0 a 8 (#1 a #9)
  alocacao?: AlocacaoSlotMatriz;
  catalogo: CatalogoCalafrio;
  habilidadesUnicas: HabilidadeUnicaCalafrio[];
  onSelecionar: (slot: number) => void;
  onLimpar: (slot: number) => void;
  focoAtivo?: boolean;
  onAlternarFoco?: (id: string) => void;
}

export function CardSlotMatriz({
  numeroSlot,
  alocacao,
  catalogo,
  habilidadesUnicas,
  onSelecionar,
  onLimpar,
  focoAtivo,
  onAlternarFoco,
}: CardSlotMatrizProps) {
  const rotuloSlot = `#${numeroSlot + 1}`;

  if (!alocacao) {
    return (
      <div
        onClick={() => onSelecionar(numeroSlot)}
        className="group relative border-2 border-dashed border-border hover:border-amber-400/60 rounded-md p-3 min-h-[140px] flex flex-col justify-between cursor-pointer transition-all bg-card/40 hover:bg-muted/40"
      >
        <div className="flex items-center justify-between">
          <span className="calafrio-tag-sm">{rotuloSlot}</span>
          <span className="text-[11px] text-muted-foreground group-hover:text-accent-ink flex items-center gap-1 font-medium">
            <Plus className="size-3.5" /> Alocar
          </span>
        </div>
        <div className="text-center py-4 text-xs text-muted-foreground/60 italic">
          Espaço livre da matriz
        </div>
        <div className="text-[10px] text-muted-foreground/40 text-right">
          3×3
        </div>
      </div>
    );
  }

  if (alocacao.tipo === "unica") {
    const unica = habilidadesUnicas.find((u) => u.id === alocacao.id);
    const tokenPers = unica?.personalidadeAlinhamento
      ? TOKENS_PERSONALIDADE[unica.personalidadeAlinhamento]
      : null;

    return (
      <div className="relative border-2 border-amber-500/70 bg-card rounded-md p-3 min-h-[140px] flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="calafrio-tag-sm">{rotuloSlot}</span>
          <div className="flex items-center gap-1">
            {tokenPers && (
              <span
                style={{ backgroundColor: tokenPers.corPositiva }}
                className="text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded-xs"
                title={`Conta como ${tokenPers.nome}`}
              >
                {tokenPers.emoji} {tokenPers.nome}
              </span>
            )}
            <button
              type="button"
              onClick={() => onSelecionar(numeroSlot)}
              className="text-muted-foreground hover:text-accent-ink p-1 rounded cursor-pointer"
              title="Trocar habilidade deste slot"
            >
              <RefreshCw className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onLimpar(numeroSlot)}
              className="text-muted-foreground hover:text-red-400 p-1 rounded cursor-pointer"
              title="Remover do slot"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>

        <div
          onClick={() => onSelecionar(numeroSlot)}
          className="cursor-pointer flex-1"
          title="Clique para trocar esta habilidade"
        >
          <div className="font-black text-sm text-accent-ink leading-tight hover:underline">
            {unica?.nome ?? "Habilidade Única"}
          </div>
          <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5">
            <span className="capitalize">{unica?.tipoAcao ?? "Padrão"}</span>
            <span>·</span>
            <span className="font-bold text-accent-ink">
              {unica?.custo ?? 3} {unica?.recurso?.toUpperCase() ?? "PA"}
            </span>
            {unica?.ecosInvestidos && unica.ecosInvestidos > 1 && (
              <span className="text-[10px] text-amber-500 font-bold">
                ({unica.ecosInvestidos} Ecos)
              </span>
            )}
          </div>
          <p className="text-[11px] text-foreground/80 line-clamp-3 mt-1.5 leading-snug">
            {unica?.descricao}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/50 text-[10px] text-muted-foreground">
          <span className="text-accent-ink font-semibold">★ Eco Único</span>
          <button
            type="button"
            onClick={() => onSelecionar(numeroSlot)}
            className="text-[10px] text-muted-foreground hover:text-foreground font-semibold flex items-center gap-0.5 cursor-pointer"
          >
            <RefreshCw className="size-3" /> Trocar
          </button>
        </div>
      </div>
    );
  }

  const hab = catalogo.habilidadesParanormais.find((h) => h.id === alocacao.id);
  const tokenPers = hab ? TOKENS_PERSONALIDADE[hab.personalidade] : null;
  const corCard =
    hab?.dominio === "positivo"
      ? tokenPers?.corPositiva
      : tokenPers?.corNegativa;

  return (
    <div
      style={{ borderColor: corCard ?? "#333" }}
      className="relative border-2 bg-card rounded-md p-3 min-h-[140px] flex flex-col justify-between shadow-sm"
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className="calafrio-tag-sm">{rotuloSlot}</span>
        <div className="flex items-center gap-1.5">
          {tokenPers && (
            <span
              style={{ backgroundColor: corCard }}
              className="text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded-xs"
            >
              {tokenPers.emoji} {tokenPers.nome} (
              {hab?.dominio === "positivo" ? "+" : "-"})
            </span>
          )}
          <CadeadoFocoIcon foco={hab?.requerFoco ?? "nao"} />
          <button
            type="button"
            onClick={() => onSelecionar(numeroSlot)}
            className="text-muted-foreground hover:text-accent-ink p-1 rounded cursor-pointer"
            title="Trocar habilidade deste slot"
          >
            <RefreshCw className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onLimpar(numeroSlot)}
            className="text-muted-foreground hover:text-red-400 p-1 rounded cursor-pointer"
            title="Remover do slot"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      <div
        onClick={() => onSelecionar(numeroSlot)}
        className="cursor-pointer flex-1"
        title="Clique para trocar esta habilidade"
      >
        <div className="font-black text-sm text-foreground leading-tight hover:underline">
          {hab?.nome}
        </div>
        <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5">
          <span className="capitalize">{hab?.tipoAcao}</span>
          <span>·</span>
          <span className="font-bold text-accent-ink">
            {hab?.custoPA === 0 ? "Passiva (0 PA)" : `${hab?.custoPA} PA`}
          </span>
          {hab?.permiteCustoEmPV && (
            <span
              className="text-red-400 font-bold"
              title="Pode ser pago com PV"
            >
              / PV
            </span>
          )}
        </div>
        <p className="text-[11px] text-foreground/80 line-clamp-3 mt-1.5 leading-snug">
          {hab?.descricao}
        </p>
      </div>

      <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/50 text-[10px] text-muted-foreground">
        <span>{hab?.duracao ?? hab?.alcance ?? "Instantâneo"}</span>
        <div className="flex items-center gap-2">
          {hab?.requerFoco !== "nao" && onAlternarFoco && hab && (
            <button
              type="button"
              onClick={() => onAlternarFoco(hab.id)}
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer ${
                focoAtivo
                  ? "bg-amber-400 text-black animate-pulse"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {focoAtivo ? "Foco Ativo" : "Ativar Foco"}
            </button>
          )}
          <button
            type="button"
            onClick={() => onSelecionar(numeroSlot)}
            className="text-[10px] text-muted-foreground hover:text-foreground font-semibold flex items-center gap-0.5 cursor-pointer"
          >
            <RefreshCw className="size-3" /> Trocar
          </button>
        </div>
      </div>
    </div>
  );
}
