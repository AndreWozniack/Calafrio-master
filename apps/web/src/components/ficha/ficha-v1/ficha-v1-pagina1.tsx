"use client";

import type { FichaCalafrioV1, FichaDerivadaV1 } from "@calafrio/core";
import { Coins, Heart, Plus, Shield, Trash2, Zap } from "lucide-react";
import { FichaV1Triade } from "./ficha-v1-triade";
import { resumoVitaisV1 } from "./modelo-visual-v1";

interface FichaV1Pagina1Props {
  ficha: FichaCalafrioV1;
  derivada: FichaDerivadaV1;
  definirNome: (nome: string) => void;
  definirJogador: (jogador: string) => void;
  definirNivel: (nivel: number) => void;
  definirAtributo: (
    atributo: "corpo" | "mente" | "alma",
    valor: number,
  ) => void;
  definirPvAtual: (valor: number) => void;
  definirPaAtual: (valor: number) => void;
  definirCarteira: (fundos: number, espirions: number) => void;
  adicionarPalavraChave: (p: {
    id: string;
    nome: string;
    categoria: "ocupacao" | "personalidade" | "miscelanea" | "livre";
  }) => void;
  removerPalavraChave: (id: string) => void;
  adicionarItem: (item: {
    id: string;
    nome: string;
    quantidade: number;
    notas?: string;
  }) => void;
  removerItem: (id: string) => void;
  definirQuemSouEu: (texto: string) => void;
  definirAnotacoes: (texto: string) => void;
}

export function FichaV1Pagina1({
  ficha,
  derivada,
  definirNome,
  definirJogador,
  definirNivel,
  definirAtributo,
  definirPvAtual,
  definirPaAtual,
  definirCarteira,
  adicionarPalavraChave,
  removerPalavraChave,
  adicionarItem,
  removerItem,
  definirQuemSouEu,
  definirAnotacoes,
}: FichaV1Pagina1Props) {
  const resumo = resumoVitaisV1(derivada, ficha);

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Ficha */}
      <div className="calafrio-card p-5 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Identidade */}
        <div className="md:col-span-8 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Nome do Personagem
              </label>
              <input
                type="text"
                value={ficha.nome}
                onChange={(e) => definirNome(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm font-bold text-foreground focus:border-amber-400 outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Jogador
              </label>
              <input
                type="text"
                value={ficha.jogador ?? ""}
                onChange={(e) => definirJogador(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-amber-400 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-muted-foreground">
                Nível:
              </span>
              <select
                value={ficha.nivel}
                onChange={(e) => definirNivel(Number(e.target.value))}
                className="bg-muted border border-border rounded px-2.5 py-1 text-sm font-black text-amber-400"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-muted-foreground">
                Aptidão (BA):
              </span>
              <span className="px-2 py-0.5 rounded bg-muted text-xs font-black text-foreground">
                {resumo.ba}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-muted-foreground">
                Velocidade:
              </span>
              <span className="px-2 py-0.5 rounded bg-muted text-xs font-black text-foreground">
                {resumo.velocidade}m
              </span>
            </div>
          </div>
        </div>

        {/* Carteira e Recursos */}
        <div className="md:col-span-4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-border/50 pt-3 md:pt-0 md:pl-4 space-y-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1 flex items-center gap-1.5">
              <Coins className="size-3.5 text-amber-400" /> Carteira
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">
                  Fundos (F$)
                </span>
                <input
                  type="number"
                  min="0"
                  value={ficha.carteira.fundos}
                  onChange={(e) =>
                    definirCarteira(
                      Math.max(0, Number(e.target.value)),
                      ficha.carteira.espirions,
                    )
                  }
                  className="w-full bg-muted/50 border border-border rounded px-2 py-1 text-sm font-bold text-foreground"
                />
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">
                  Espirions (E$P)
                </span>
                <input
                  type="number"
                  min="0"
                  value={ficha.carteira.espirions}
                  onChange={(e) =>
                    definirCarteira(
                      ficha.carteira.fundos,
                      Math.max(0, Number(e.target.value)),
                    )
                  }
                  className="w-full bg-muted/50 border border-border rounded px-2 py-1 text-sm font-bold text-foreground"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vitais Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="calafrio-card p-4 border-red-500/20 bg-red-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-red-400 flex items-center gap-1.5">
              <Heart className="size-4" /> Vida (PV)
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              Máx: {derivada.pvMax}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <input
              type="number"
              min="0"
              max={derivada.pvMax}
              value={ficha.pvAtual}
              onChange={(e) => definirPvAtual(Number(e.target.value))}
              className="w-20 bg-background/80 border border-red-500/30 rounded px-2 py-1 text-2xl font-black text-red-300 text-center"
            />
            <span className="text-lg font-bold text-muted-foreground">
              / {derivada.pvMax}
            </span>
          </div>
        </div>

        <div className="calafrio-card p-4 border-cyan-500/20 bg-cyan-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-cyan-400 flex items-center gap-1.5">
              <Zap className="size-4" /> Ânimum (PA)
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              Máx: {derivada.paMax}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <input
              type="number"
              min="0"
              max={derivada.paMax}
              value={ficha.paAtual}
              onChange={(e) => definirPaAtual(Number(e.target.value))}
              className="w-20 bg-background/80 border border-cyan-500/30 rounded px-2 py-1 text-2xl font-black text-cyan-300 text-center"
            />
            <span className="text-lg font-bold text-muted-foreground">
              / {derivada.paMax}
            </span>
          </div>
        </div>

        <div className="calafrio-card p-4 border-amber-500/20 bg-amber-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
              <Shield className="size-4" /> Defesa (PD)
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              3 + Corpo×3
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-300">
              {derivada.pd}
            </span>
          </div>
        </div>
      </div>

      {/* Tríade de Atributos */}
      <FichaV1Triade
        ficha={ficha}
        pmResumo={resumo.pm}
        definirAtributo={definirAtributo}
      />

      {/* Palavras-Chave e Inventário */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Palavras-Chave */}
        <div className="calafrio-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
              Palavras-chave ({ficha.palavrasChave.length} /{" "}
              {derivada.limitePalavrasChave})
            </h3>
            <button
              type="button"
              onClick={() => {
                const nome = prompt("Nome da nova palavra-chave:");
                if (!nome) return;
                adicionarPalavraChave({
                  id: `pc-${Date.now()}`,
                  nome: nome.trim(),
                  categoria: "livre",
                });
              }}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="size-3.5" /> Adicionar
            </button>
          </div>
          <div className="space-y-2">
            {ficha.palavrasChave.map((pc) => (
              <div
                key={pc.id}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border text-xs"
              >
                <div>
                  <span className="font-bold text-foreground">{pc.nome}</span>
                  <span className="text-[10px] text-muted-foreground uppercase ml-2 px-1.5 py-0.5 rounded bg-muted">
                    {pc.categoria}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removerPalavraChave(pc.id)}
                  className="text-muted-foreground hover:text-red-400 p-1"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
            {ficha.palavrasChave.length === 0 && (
              <p className="text-xs text-muted-foreground italic">
                Nenhuma palavra-chave adicionada.
              </p>
            )}
          </div>
        </div>

        {/* Inventário */}
        <div className="calafrio-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
              Inventário & Equipamento
            </h3>
            <button
              type="button"
              onClick={() => {
                const nome = prompt("Nome do item:");
                if (!nome) return;
                adicionarItem({
                  id: `it-${Date.now()}`,
                  nome: nome.trim(),
                  quantidade: 1,
                });
              }}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="size-3.5" /> Adicionar
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {ficha.inventario.map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border text-xs"
              >
                <span className="font-bold text-foreground">{it.nome}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    x{it.quantidade}
                  </span>
                  <button
                    type="button"
                    onClick={() => removerItem(it.id)}
                    className="text-muted-foreground hover:text-red-400 p-1"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {ficha.inventario.length === 0 && (
              <p className="text-xs text-muted-foreground italic">
                Nenhum item no inventário.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Narrativo: Quem sou eu & Anotações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="calafrio-card p-5 space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-foreground block">
            Quem sou eu?
          </label>
          <textarea
            value={ficha.quemSouEu}
            onChange={(e) => definirQuemSouEu(e.target.value)}
            rows={4}
            className="w-full bg-muted/30 border border-border rounded-lg p-3 text-xs text-foreground focus:border-amber-400 outline-none resize-none"
            placeholder="Aparência, história e motivações..."
          />
        </div>
        <div className="calafrio-card p-5 space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-foreground block">
            Anotações Gerais
          </label>
          <textarea
            value={ficha.anotacoes}
            onChange={(e) => definirAnotacoes(e.target.value)}
            rows={4}
            className="w-full bg-muted/30 border border-border rounded-lg p-3 text-xs text-foreground focus:border-amber-400 outline-none resize-none"
            placeholder="Pistas, contatos e mistérios..."
          />
        </div>
      </div>
    </div>
  );
}
