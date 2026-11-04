"use client";

import React from "react";
import type { FichaCalafrio, FichaDerivadaCalafrio, ItemNaFichaCalafrio, PalavraChaveNaFicha } from "@calafrio/core";
import { PainelPalavrasChave } from "./painel-palavras-chave";
import { PainelInventario } from "./painel-inventario";
import { Heart, Zap, Shield, Flame, Activity, Dices } from "lucide-react";

interface PaginaFrenteFichaProps {
  ficha: FichaCalafrio;
  derivada: FichaDerivadaCalafrio;
  onDefinirNome: (nome: string) => void;
  onDefinirApt: (apt: number) => void;
  onAdicionarPalavraChave: (palavra: PalavraChaveNaFicha) => void;
  onRemoverPalavraChave: (id: string) => void;
  onAdicionarItem: (item: ItemNaFichaCalafrio) => void;
  onAlternarEquipado: (id: string) => void;
  onRemoverItem: (id: string) => void;
  onAtualizarCarteira: (fundos: number, espirions: number) => void;
  onAbrirRolagem: (nome?: string) => void;
  onCurarPv: (qtd: number) => void;
  onCurarPa: (qtd: number) => void;
}

export function PaginaFrenteFicha({
  ficha,
  derivada,
  onDefinirNome,
  onDefinirApt,
  onAdicionarPalavraChave,
  onRemoverPalavraChave,
  onAdicionarItem,
  onAlternarEquipado,
  onRemoverItem,
  onAtualizarCarteira,
  onAbrirRolagem,
  onCurarPv,
  onCurarPa,
}: PaginaFrenteFichaProps) {
  return (
    <div className="space-y-6">
      {/* Bloco Superior: Nome + Atributos Centrais Derivados de APT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Retrato / Identidade */}
        <div className="md:col-span-4 calafrio-card p-4 flex flex-col justify-between space-y-3">
          <div>
            <span className="calafrio-tag mb-2">IDENTIDADE DO NEURAL</span>
            <input
              type="text"
              value={ficha.nome}
              onChange={(e) => onDefinirNome(e.target.value)}
              placeholder="Nome do Personagem"
              className="w-full text-lg font-black bg-muted/40 px-3 py-2 rounded border border-border mt-1"
            />
          </div>

          <div className="p-3 bg-muted/20 border border-dashed border-border rounded flex flex-col items-center justify-center text-center py-6">
            <span className="text-3xl mb-1">👤</span>
            <span className="text-xs text-muted-foreground font-semibold">Ilustração do Neural</span>
          </div>

          <button
            type="button"
            onClick={() => onAbrirRolagem()}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-sm rounded cursor-pointer transition-colors"
          >
            <Dices className="size-4" /> Rolar Ação / Contestação
          </button>
        </div>

        {/* Pilha de Atributos Oficiais Calafrio 2e */}
        <div className="md:col-span-8 calafrio-card p-4 space-y-3">
          {/* Aptidão */}
          <div className="flex flex-wrap items-center justify-between p-3 bg-muted/40 rounded border border-border">
            <div className="flex items-center gap-2">
              <span className="calafrio-tag">APTIDÃO (APT):</span>
              <span className="text-xs text-muted-foreground">= Concedido pelo MdJ (1 a 6)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onDefinirApt(Math.max(1, ficha.aptBase - 1))}
                className="size-7 bg-muted text-foreground font-bold rounded hover:bg-border cursor-pointer"
              >
                -
              </button>
              <span className="text-2xl font-black text-amber-400 min-w-8 text-center">
                {derivada.apt}
              </span>
              <button
                type="button"
                onClick={() => onDefinirApt(Math.min(6, ficha.aptBase + 1))}
                className="size-7 bg-muted text-foreground font-bold rounded hover:bg-border cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Grid de Vitais */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Defesa */}
            <div className="p-3 bg-card border border-border rounded text-center">
              <span className="calafrio-tag-sm mb-1">DEFESA (PD)</span>
              <div className="text-2xl font-black text-foreground mt-1">{derivada.pd}</div>
              <span className="text-[10px] text-muted-foreground">= 3 × APT</span>
            </div>

            {/* Vida */}
            <div className="p-3 bg-card border border-red-900/40 rounded text-center">
              <span className="calafrio-tag-sm mb-1 bg-red-950 text-red-200">VIDA (PV)</span>
              <div className="text-2xl font-black text-red-400 mt-1">
                {derivada.pvAtual} <span className="text-xs text-muted-foreground">/ {derivada.pvMax}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">= 3 + 3 × APT</span>
            </div>

            {/* Ânimum */}
            <div className="p-3 bg-card border border-cyan-900/40 rounded text-center">
              <span className="calafrio-tag-sm mb-1 bg-cyan-950 text-cyan-200">ÂNIMUM (PA)</span>
              <div className="text-2xl font-black text-cyan-400 mt-1">
                {derivada.paAtual} <span className="text-xs text-muted-foreground">/ {derivada.paMax}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">= 3 + 3 × APT</span>
            </div>

            {/* Velocidade */}
            <div className="p-3 bg-card border border-border rounded text-center">
              <span className="calafrio-tag-sm mb-1">VELOCIDADE</span>
              <div className="text-2xl font-black text-foreground mt-1">{derivada.velocidade}m</div>
              <span className="text-[10px] text-muted-foreground">= 6 + Bônus</span>
            </div>
          </div>

          {/* Ecos & Alertas */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded text-xs">
            <span className="font-bold text-amber-300">
              Ecos Totais: {derivada.ecosDisponiveis} disponíveis (de {derivada.ecosMax} base)
            </span>
            {derivada.inconsciente && (
              <span className="font-black text-red-400 animate-pulse uppercase">
                ⚠️ INCONSCIENTE! Morre em {derivada.segundosAteMorrer}s sem socorro
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bloco Inferior: Palavras-chave + Inventário */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PainelPalavrasChave
          ficha={ficha}
          derivada={derivada}
          onAdicionar={onAdicionarPalavraChave}
          onRemover={onRemoverPalavraChave}
          onRolarTeste={(palavra) => onAbrirRolagem(palavra)}
        />

        <PainelInventario
          ficha={ficha}
          onAdicionarItem={onAdicionarItem}
          onAlternarEquipado={onAlternarEquipado}
          onRemoverItem={onRemoverItem}
          onAtualizarCarteira={onAtualizarCarteira}
        />
      </div>
    </div>
  );
}
