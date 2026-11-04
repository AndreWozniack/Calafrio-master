"use client";

import React, { useState } from "react";
import type {
  CatalogoCalafrio,
  FichaCalafrio,
  FichaDerivadaCalafrio,
  PalavraChaveNaFicha,
} from "@calafrio/core";
import { Sparkles, Dices, ChevronRight, ChevronLeft, Check } from "lucide-react";

interface AssistenteCriacaoCalafrioProps {
  aberto: boolean;
  ficha: FichaCalafrio;
  derivada: FichaDerivadaCalafrio;
  catalogo: CatalogoCalafrio;
  onDefinirNome: (nome: string) => void;
  onDefinirApt: (apt: number) => void;
  onAdicionarPalavraChave: (palavra: PalavraChaveNaFicha) => void;
  onRemoverPalavraChave: (id: string) => void;
  onAtualizarCarteira: (fundos: number, espirions: number) => void;
  onFechar: () => void;
}

export function AssistenteCriacaoCalafrio({
  aberto,
  ficha,
  derivada,
  catalogo,
  onDefinirNome,
  onDefinirApt,
  onAdicionarPalavraChave,
  onRemoverPalavraChave,
  onAtualizarCarteira,
  onFechar,
}: AssistenteCriacaoCalafrioProps) {
  const [etapa, setEtapa] = useState<1 | 2 | 3 | 4>(1);

  if (!aberto) return null;

  // Sorteadores d100
  const sortearOcupacao = () => {
    const idx = Math.floor(Math.random() * catalogo.ocupacoes.length);
    const item = catalogo.ocupacoes[idx];
    onAdicionarPalavraChave({
      id: `pc-ocupacao-${Date.now()}`,
      nome: item.nome,
      categoria: "ocupacao",
      semConsumirLimite: false,
      efeitos: [],
    });
  };

  const sortearPalavra = (cat: "talento" | "falha" | "extra") => {
    const idx = Math.floor(Math.random() * catalogo.palavrasChaveGenericas.length);
    const item = catalogo.palavrasChaveGenericas[idx];
    onAdicionarPalavraChave({
      id: `pc-${cat}-${Date.now()}`,
      nome: item.nome,
      categoria: cat,
      semConsumirLimite: false,
      efeitos: [],
    });
  };

  const sortearFundos = () => {
    const fundos = Math.floor(Math.random() * 12) + 1;
    onAtualizarCarteira(fundos, ficha.carteira.espirions);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
      <div className="calafrio-card p-6 max-w-2xl w-full max-h-[90vh] flex flex-col space-y-4 shadow-2xl border-2 border-amber-400">
        {/* Cabeçalho do Wizard */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <span className="calafrio-tag">ASSISTENTE DE CRIAÇÃO — CALAFRIO 2E</span>
            <div className="text-xs text-muted-foreground mt-0.5">
              Etapa {etapa} de 4
            </div>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="text-muted-foreground hover:text-foreground text-sm font-bold cursor-pointer"
          >
            ✕ Cancelar
          </button>
        </div>

        {/* Indicador de Passos */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
          <div className={`p-1.5 rounded ${etapa === 1 ? "bg-amber-400 text-black" : "bg-muted text-muted-foreground"}`}>
            1. Conceito & APT
          </div>
          <div className={`p-1.5 rounded ${etapa === 2 ? "bg-amber-400 text-black" : "bg-muted text-muted-foreground"}`}>
            2. Palavras-chave
          </div>
          <div className={`p-1.5 rounded ${etapa === 3 ? "bg-amber-400 text-black" : "bg-muted text-muted-foreground"}`}>
            3. Habilidades
          </div>
          <div className={`p-1.5 rounded ${etapa === 4 ? "bg-amber-400 text-black" : "bg-muted text-muted-foreground"}`}>
            4. Dinheiro & Itens
          </div>
        </div>

        {/* Conteúdo Contextual por Etapa */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {etapa === 1 && (
            <div className="space-y-4 p-2">
              <div>
                <label className="block text-foreground font-bold mb-1">Nome do Personagem:</label>
                <input
                  type="text"
                  value={ficha.nome}
                  onChange={(e) => onDefinirNome(e.target.value)}
                  placeholder="Ex.: Brenda Silveira, Igor Kowalski..."
                  className="w-full bg-muted p-2 rounded border border-border text-sm"
                />
              </div>

              <div>
                <label className="block text-foreground font-bold mb-1">Aptidão Inicial (APT):</label>
                <p className="text-muted-foreground text-[11px] mb-2">
                  Em Calafrio, personagens iniciam suas aventuras com <strong>1 APT</strong> (recém descoberta do paranormal). O MdJ concede novos pontos a cada missão.
                </p>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5, 6].map((valor) => (
                    <button
                      key={valor}
                      type="button"
                      onClick={() => onDefinirApt(valor)}
                      className={`size-10 rounded font-black text-sm cursor-pointer ${
                        ficha.aptBase === valor ? "bg-amber-400 text-black" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {valor}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded border border-border space-y-1">
                <span className="font-bold text-amber-300">Valores derivados para APT {ficha.aptBase}:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-bold">
                  <div className="p-2 bg-card rounded">PD: {3 * ficha.aptBase}</div>
                  <div className="p-2 bg-card rounded">PV: {3 + 3 * ficha.aptBase}</div>
                  <div className="p-2 bg-card rounded">PA: {3 + 3 * ficha.aptBase}</div>
                  <div className="p-2 bg-card rounded">Ecos: {ficha.aptBase}</div>
                </div>
              </div>
            </div>
          )}

          {etapa === 2 && (
            <div className="space-y-3 p-2">
              <p className="text-muted-foreground">
                Personagens iniciam com <strong>três palavras-chave obrigatórias:</strong> uma <em>Ocupação</em>, um <em>Maior Talento</em> e uma <em>Pior Falha</em>. Cada APT adicional concede +1 palavra-chave.
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={sortearOcupacao}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-border rounded font-bold cursor-pointer"
                >
                  <Dices className="size-3.5 text-amber-400" /> Sortear Ocupação (d100)
                </button>
                <button
                  type="button"
                  onClick={() => sortearPalavra("talento")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-border rounded font-bold cursor-pointer"
                >
                  <Dices className="size-3.5 text-amber-400" /> Sortear Talento (d100)
                </button>
                <button
                  type="button"
                  onClick={() => sortearPalavra("falha")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-border rounded font-bold cursor-pointer"
                >
                  <Dices className="size-3.5 text-amber-400" /> Sortear Falha (d100)
                </button>
              </div>

              <div className="space-y-1 pt-2">
                <span className="font-bold text-foreground">Palavras-chave Atuais ({ficha.palavrasChave.length} de {2 + ficha.aptBase}):</span>
                {ficha.palavrasChave.map((pc) => (
                  <div key={pc.id} className="flex items-center justify-between p-2 rounded bg-card border border-border">
                    <span className="font-bold">{pc.nome} <span className="text-[10px] text-muted-foreground uppercase">({pc.categoria})</span></span>
                    <button
                      type="button"
                      onClick={() => onRemoverPalavraChave(pc.id)}
                      className="text-muted-foreground hover:text-red-400 text-xs font-bold"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {etapa === 3 && (
            <div className="space-y-3 p-2">
              <p className="text-muted-foreground">
                Suas habilidades são organizadas na <strong>Matriz 3×3 (Verso da Ficha)</strong>. Você pode memorizar até <strong>{ficha.aptBase} habilidades</strong> (= APT).
              </p>
              <div className="p-3 bg-muted/40 rounded border border-border space-y-2">
                <span className="font-bold text-amber-300">Regra de Domínio:</span>
                <p className="text-[11px] text-muted-foreground">
                  Escolha se deseja atuar no <strong>Domínio Positivo</strong> ou <strong>Domínio Negativo</strong> das emoções. Não é permitido misturar domínios (a menos que liberado pelo MdJ com um Eco).
                </p>
                <p className="text-[11px] text-foreground font-semibold">
                  Alinhe habilidades da mesma personalidade em linhas, colunas, diagonais ou blocos 2x2 para ganhar bônus permanentes de vitais!
                </p>
              </div>
            </div>
          )}

          {etapa === 4 && (
            <div className="space-y-4 p-2">
              <div>
                <label className="block text-foreground font-bold mb-1">Fundos Iniciais (F$):</label>
                <p className="text-muted-foreground text-[11px] mb-2">
                  Escolha entre <strong>1 a 12 Fundos</strong> conforme a classe social do seu personagem, ou lance o d12:
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={ficha.carteira.fundos}
                    onChange={(e) => onAtualizarCarteira(Number(e.target.value), ficha.carteira.espirions)}
                    className="w-20 bg-muted text-center p-2 rounded border border-border font-bold text-sm"
                  />
                  <button
                    type="button"
                    onClick={sortearFundos}
                    className="flex items-center gap-1.5 px-3 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded cursor-pointer"
                  >
                    <Dices className="size-4" /> Sortear Fundos (1d12)
                  </button>
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded border border-border text-xs space-y-1">
                <span className="font-bold text-foreground">Equipamentos Iniciais Recomendados:</span>
                <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                  <li>3 objetos mundanos guiados pelas palavras-chave</li>
                  <li>1 arma do arsenal (ou parartefato se começar acima do nível 1)</li>
                  <li>2 bugigangas de baixo valor da tabela d100</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com Navegação */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          <button
            type="button"
            disabled={etapa === 1}
            onClick={() => setEtapa((prev) => Math.max(1, prev - 1) as any)}
            className="flex items-center gap-1 px-3 py-1.5 bg-muted hover:bg-border disabled:opacity-40 rounded font-bold text-xs cursor-pointer"
          >
            <ChevronLeft className="size-4" /> Anterior
          </button>

          {etapa < 4 ? (
            <button
              type="button"
              onClick={() => setEtapa((prev) => Math.min(4, prev + 1) as any)}
              className="flex items-center gap-1 px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs rounded cursor-pointer"
            >
              Próximo <ChevronRight className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onFechar}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-green-500 hover:bg-green-400 text-black font-black text-xs rounded cursor-pointer"
            >
              <Check className="size-4" /> Concluir Criação
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
