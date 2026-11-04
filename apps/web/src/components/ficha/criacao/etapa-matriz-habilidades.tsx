"use client";

import type {
  CatalogoCalafrio,
  FichaCalafrio,
  FichaDerivadaCalafrio,
} from "@calafrio/core";
import { TOKENS_PERSONALIDADE, type PersonalidadeCalafrio } from "@calafrio/tema";
import { Check, Sparkles, Trash2, Zap } from "lucide-react";
import { useMemo, useState } from "react";

interface EtapaMatrizHabilidadesProps {
  ficha: FichaCalafrio;
  derivada: FichaDerivadaCalafrio;
  catalogo: CatalogoCalafrio;
  onAlocarSlot: (slot: number, tipo: "paranormal" | "unica", id: string) => void;
  onLimparSlot: (slot: number) => void;
}

export function EtapaMatrizHabilidades({
  ficha,
  derivada,
  catalogo,
  onAlocarSlot,
  onLimparSlot,
}: EtapaMatrizHabilidadesProps) {
  const [slotSelecionado, setSlotSelecionado] = useState<number>(0);
  const [filtroPersonalidade, setFiltroPersonalidade] = useState<string>("todas");
  const [filtroDominio, setFiltroDominio] = useState<string>("todos");
  const [busca, setBusca] = useState<string>("");

  const habilidadesFiltradas = useMemo(() => {
    return catalogo.habilidadesParanormais.filter((h) => {
      if (filtroPersonalidade !== "todas" && h.personalidade !== filtroPersonalidade) {
        return false;
      }
      if (filtroDominio !== "todos" && h.dominio !== filtroDominio) {
        return false;
      }
      if (busca.trim()) {
        const termo = busca.toLowerCase();
        return (
          h.nome.toLowerCase().includes(termo) ||
          h.descricao.toLowerCase().includes(termo)
        );
      }
      return true;
    });
  }, [catalogo.habilidadesParanormais, filtroPersonalidade, filtroDominio, busca]);

  const alocacaoAtualSlot = ficha.matrizHabilidades.find(
    (m) => m.slot === slotSelecionado,
  );

  const habilidadeNoSlot = useMemo(() => {
    if (!alocacaoAtualSlot) return null;
    return catalogo.habilidadesParanormais.find(
      (h) => h.id === alocacaoAtualSlot.id,
    );
  }, [alocacaoAtualSlot, catalogo.habilidadesParanormais]);

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-base font-black text-foreground uppercase tracking-wide">
          3. Matriz 3x3 de Habilidades ({ficha.matrizHabilidades.length} / {ficha.aptBase} alocadas)
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          Selecione um slot na matriz e escolha a habilidade paranormal que deseja alocar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Lado Esquerdo: Grade 3x3 dos Slots */}
        <div className="md:col-span-5 space-y-3">
          <span className="calafrio-tag-sm">ESCOLHA O SLOT DA MATRIZ</span>
          <div className="grid grid-cols-3 gap-2 p-3 bg-muted/40 rounded-xl border border-border">
            {Array.from({ length: 9 }).map((_, slotIdx) => {
              const aloc = ficha.matrizHabilidades.find((m) => m.slot === slotIdx);
              const hab = aloc
                ? catalogo.habilidadesParanormais.find((h) => h.id === aloc.id)
                : null;
              const isSelected = slotSelecionado === slotIdx;

              return (
                <button
                  key={slotIdx}
                  type="button"
                  onClick={() => setSlotSelecionado(slotIdx)}
                  className={`h-20 p-1.5 rounded-lg border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "border-amber-400 bg-amber-400/10 ring-2 ring-amber-400/50"
                      : "border-border bg-card hover:border-amber-400/40"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-black text-muted-foreground">
                      #{slotIdx + 1}
                    </span>
                    {hab && (
                      <span className="size-2 rounded-full bg-amber-400" />
                    )}
                  </div>
                  <div className="truncate w-full">
                    {hab ? (
                      <span className="text-[11px] font-bold text-foreground block truncate">
                        {hab.nome}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground/60 italic">
                        Vazio
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Slot Atual Ativo */}
          <div className="p-3 bg-card rounded-xl border border-border text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">
                Slot #{slotSelecionado + 1} Selecionado
              </span>
              {habilidadeNoSlot && (
                <button
                  type="button"
                  onClick={() => onLimparSlot(slotSelecionado)}
                  className="flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300 cursor-pointer"
                >
                  <Trash2 className="size-3" /> Desalocar
                </button>
              )}
            </div>
            {habilidadeNoSlot ? (
              <div className="text-[11px] space-y-1">
                <div className="font-black text-amber-400">{habilidadeNoSlot.nome}</div>
                <div className="text-muted-foreground line-clamp-2">
                  {habilidadeNoSlot.descricao}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground italic">
                Nenhuma habilidade alocada neste slot. Escolha uma na lista ao lado.
              </p>
            )}
          </div>
        </div>

        {/* Lado Direito: Catálogo de Habilidades */}
        <div className="md:col-span-7 space-y-3">
          <span className="calafrio-tag-sm">CATÁLOGO DE HABILIDADES PARANORMAIS</span>

          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou efeito"
              className="bg-card p-2 rounded-lg border border-border text-xs outline-none focus:border-amber-400 font-bold"
            />

            <select
              value={filtroPersonalidade}
              onChange={(e) => setFiltroPersonalidade(e.target.value)}
              className="bg-card p-2 rounded-lg border border-border text-xs font-bold outline-none cursor-pointer"
            >
              <option value="todas">Todas as Personalidades</option>
              {Object.keys(TOKENS_PERSONALIDADE).map((key) => (
                <option key={key} value={key}>
                  {TOKENS_PERSONALIDADE[key as PersonalidadeCalafrio].nome}
                </option>
              ))}
            </select>

            <select
              value={filtroDominio}
              onChange={(e) => setFiltroDominio(e.target.value)}
              className="bg-card p-2 rounded-lg border border-border text-xs font-bold outline-none cursor-pointer"
            >
              <option value="todos">Todos os Domínios</option>
              <option value="positivo">Positivo</option>
              <option value="negativo">Negativo</option>
            </select>
          </div>

          {/* Lista de Habilidades */}
          <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1 text-xs">
            {habilidadesFiltradas.map((hab) => {
              const estaNoSlotAtual = alocacaoAtualSlot?.id === hab.id;
              const estaEmAlgumSlot = ficha.matrizHabilidades.some(
                (m) => m.id === hab.id,
              );

              return (
                <div
                  key={hab.id}
                  className={`p-3 rounded-lg border transition-all ${
                    estaNoSlotAtual
                      ? "border-amber-400 bg-amber-400/10"
                      : "border-border bg-card hover:border-border/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-foreground">
                          {hab.nome}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-semibold uppercase">
                          {hab.personalidade} · {hab.dominio}
                        </span>
                        {hab.custoPA > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-800/40 font-bold">
                            {hab.custoPA} PA
                          </span>
                        )}
                        {hab.permiteCustoEmPV && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-800/40 font-bold">
                            Permite PV
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-[11px] mt-1 leading-relaxed">
                        {hab.descricao}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onAlocarSlot(slotSelecionado, "paranormal", hab.id)
                      }
                      className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        estaNoSlotAtual
                          ? "bg-amber-400 text-black"
                          : "bg-muted hover:bg-amber-400 hover:text-black text-foreground"
                      }`}
                    >
                      {estaNoSlotAtual ? (
                        <>
                          <Check className="size-3" /> Alocada
                        </>
                      ) : (
                        `Alocar no #${slotSelecionado + 1}`
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            {habilidadesFiltradas.length === 0 && (
              <p className="text-muted-foreground text-center py-6 italic text-xs">
                Nenhuma habilidade encontrada para os filtros aplicados.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
