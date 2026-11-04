"use client";

import type {
  CatalogoCalafrio,
  FichaCalafrio,
  FichaDerivadaCalafrio,
} from "@calafrio/core";
import {
  type PersonalidadeCalafrio,
  TOKENS_PERSONALIDADE,
} from "@calafrio/tema";
import { Check, Sparkles, Trash2, Zap } from "lucide-react";
import { useMemo, useState } from "react";

interface EtapaMatrizHabilidadesProps {
  ficha: FichaCalafrio;
  derivada: FichaDerivadaCalafrio;
  catalogo: CatalogoCalafrio;
  onAlocarSlot: (
    slot: number,
    tipo: "paranormal" | "unica",
    id: string,
  ) => void;
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
  const [filtroPersonalidade, setFiltroPersonalidade] =
    useState<string>("todas");
  const [filtroDominio, setFiltroDominio] = useState<string>("todos");
  const [busca, setBusca] = useState<string>("");

  const habilidadesFiltradas = useMemo(() => {
    return catalogo.habilidadesParanormais.filter((h) => {
      if (
        filtroPersonalidade !== "todas" &&
        h.personalidade !== filtroPersonalidade
      ) {
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
  }, [
    catalogo.habilidadesParanormais,
    filtroPersonalidade,
    filtroDominio,
    busca,
  ]);

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
    <div className="space-y-6 font-sans">
      <div>
        <h4 className="text-lg font-black text-foreground uppercase tracking-wide">
          3. Matriz 3x3 de Habilidades ({ficha.matrizHabilidades.length} /{" "}
          {ficha.aptBase} alocadas)
        </h4>
        <p className="text-sm text-foreground/75 mt-1">
          Selecione um slot na matriz e escolha a habilidade paranormal que
          deseja alocar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Lado Esquerdo: Grade 3x3 dos Slots */}
        <div className="md:col-span-5 space-y-3">
          <span className="calafrio-tag-sm">ESCOLHA O SLOT DA MATRIZ</span>
          <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-muted/30 rounded-xl border-2 border-border shadow-xs">
            {Array.from({ length: 9 }).map((_, slotIdx) => {
              const aloc = ficha.matrizHabilidades.find(
                (m) => m.slot === slotIdx,
              );
              const hab = aloc
                ? catalogo.habilidadesParanormais.find((h) => h.id === aloc.id)
                : null;
              const isSelected = slotSelecionado === slotIdx;

              return (
                <button
                  key={slotIdx}
                  type="button"
                  onClick={() => setSlotSelecionado(slotIdx)}
                  className={`h-22 p-2 rounded-xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer shadow-xs ${
                    isSelected
                      ? "border-amber-500 bg-amber-400/20 ring-2 ring-amber-400/60"
                      : "border-border bg-card hover:border-amber-400/60"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black text-foreground/70">
                      #{slotIdx + 1}
                    </span>
                    {hab && (
                      <span className="size-2.5 rounded-full bg-amber-500" />
                    )}
                  </div>
                  <div className="truncate w-full">
                    {hab ? (
                      <span className="text-xs font-bold text-foreground block truncate">
                        {hab.nome}
                      </span>
                    ) : (
                      <span className="text-xs text-foreground/45 italic">
                        Vazio
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Slot Atual Ativo */}
          <div className="p-3.5 bg-card rounded-xl border-2 border-border text-sm space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground text-sm">
                Slot #{slotSelecionado + 1} Selecionado
              </span>
              {habilidadeNoSlot && (
                <button
                  type="button"
                  onClick={() => onLimparSlot(slotSelecionado)}
                  className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                >
                  <Trash2 className="size-3.5" /> Desalocar
                </button>
              )}
            </div>
            {habilidadeNoSlot ? (
              <div className="text-xs space-y-1">
                <div className="font-black text-amber-800 dark:text-amber-400 text-sm">
                  {habilidadeNoSlot.nome}
                </div>
                <div className="text-foreground/80 leading-relaxed line-clamp-3">
                  {habilidadeNoSlot.descricao}
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/60 italic">
                Nenhuma habilidade alocada neste slot. Escolha uma na lista ao
                lado.
              </p>
            )}
          </div>
        </div>

        {/* Lado Direito: Catálogo de Habilidades */}
        <div className="md:col-span-7 space-y-3">
          <span className="calafrio-tag-sm">
            CATÁLOGO DE HABILIDADES PARANORMAIS
          </span>

          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou efeito"
              className="bg-card p-2.5 rounded-lg border-2 border-border text-sm font-semibold outline-none focus:border-amber-400 text-foreground shadow-xs placeholder:text-foreground/40"
            />

            <select
              value={filtroPersonalidade}
              onChange={(e) => setFiltroPersonalidade(e.target.value)}
              className="bg-card p-2.5 rounded-lg border-2 border-border text-sm font-bold outline-none cursor-pointer text-foreground shadow-xs"
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
              className="bg-card p-2.5 rounded-lg border-2 border-border text-sm font-bold outline-none cursor-pointer text-foreground shadow-xs"
            >
              <option value="todos">Todos os Domínios</option>
              <option value="positivo">Positivo</option>
              <option value="negativo">Negativo</option>
            </select>
          </div>

          {/* Lista de Habilidades */}
          <div className="max-h-[380px] overflow-y-auto space-y-2.5 pr-1">
            {habilidadesFiltradas.map((hab) => {
              const estaNoSlotAtual = alocacaoAtualSlot?.id === hab.id;
              const estaEmAlgumSlot = ficha.matrizHabilidades.some(
                (m) => m.id === hab.id,
              );

              return (
                <div
                  key={hab.id}
                  className={`p-3.5 rounded-xl border-2 transition-all shadow-xs ${
                    estaNoSlotAtual
                      ? "border-amber-500 bg-amber-50/60 dark:bg-amber-950/20"
                      : "border-border bg-card hover:border-border/90"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-foreground text-sm">
                          {hab.nome}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-foreground/85 font-bold uppercase tracking-wider border border-border/60">
                          {hab.personalidade} · {hab.dominio}
                        </span>
                        {hab.custoPA > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 border border-sky-300 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800 font-extrabold">
                            {hab.custoPA} PA
                          </span>
                        )}
                        {hab.permiteCustoEmPV && (
                          <span className="text-xs px-2 py-0.5 rounded-md bg-red-100 text-red-900 border border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800 font-extrabold">
                            Permite PV
                          </span>
                        )}
                      </div>
                      <p className="text-foreground/85 text-xs sm:text-[13px] mt-1.5 leading-relaxed">
                        {hab.descricao}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onAlocarSlot(slotSelecionado, "paranormal", hab.id)
                      }
                      className={`shrink-0 px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs ${
                        estaNoSlotAtual
                          ? "bg-amber-400 text-neutral-950 font-black"
                          : "bg-muted hover:bg-amber-400 hover:text-neutral-950 text-foreground border border-border"
                      }`}
                    >
                      {estaNoSlotAtual ? (
                        <>
                          <Check className="size-3.5" /> Alocada
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
              <p className="text-foreground/60 text-center py-8 italic text-sm border-2 border-dashed border-border rounded-xl">
                Nenhuma habilidade encontrada para os filtros aplicados.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
