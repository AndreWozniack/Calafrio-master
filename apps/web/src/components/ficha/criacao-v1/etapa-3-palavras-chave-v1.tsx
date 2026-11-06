"use client";

import {
  type CategoriaPalavraChaveV1,
  type FichaCalafrioV1,
  type FichaDerivadaV1,
  type PalavraChaveV1,
  ROTULO_CATEGORIA_PALAVRA_CHAVE_V1,
} from "@calafrio/core";
import { Check, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface Etapa3PalavrasChaveV1Props {
  ficha: FichaCalafrioV1;
  derivada: FichaDerivadaV1;
  onAdicionarPalavraChave: (p: PalavraChaveV1) => void;
  onRemoverPalavraChave: (id: string) => void;
}

export function Etapa3PalavrasChaveV1({
  ficha,
  derivada,
  onAdicionarPalavraChave,
  onRemoverPalavraChave,
}: Etapa3PalavrasChaveV1Props) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] =
    useState<CategoriaPalavraChaveV1>("ocupacao");

  const temOcupacao = ficha.palavrasChave.some(
    (p) => p.categoria === "ocupacao",
  );
  const temPersonalidade = ficha.palavrasChave.some(
    (p) => p.categoria === "personalidade",
  );
  const temMiscelanea = ficha.palavrasChave.some(
    (p) => p.categoria === "miscelanea",
  );

  const adicionar = () => {
    if (!nome.trim()) return;
    onAdicionarPalavraChave({
      id: `pc-${Date.now()}`,
      nome: nome.trim(),
      categoria,
    });
    setNome("");
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-black text-foreground">Palavras-chave</h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          Definem seu passado, personalidade e perícias mundanas. Obrigatório
          ter ao menos 1 de cada categoria base.
        </p>
      </div>

      {/* Status das categorias obrigatórias */}
      <div className="grid grid-cols-3 gap-2">
        <div
          className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
            temOcupacao
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-muted/30 border-border text-muted-foreground"
          }`}
        >
          <span className="font-bold">1. Ocupação</span>
          {temOcupacao && <Check className="size-4" />}
        </div>
        <div
          className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
            temPersonalidade
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-muted/30 border-border text-muted-foreground"
          }`}
        >
          <span className="font-bold">2. Personalidade</span>
          {temPersonalidade && <Check className="size-4" />}
        </div>
        <div
          className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
            temMiscelanea
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-muted/30 border-border text-muted-foreground"
          }`}
        >
          <span className="font-bold">3. Miscelânea</span>
          {temMiscelanea && <Check className="size-4" />}
        </div>
      </div>

      {/* Formulário de Adição */}
      <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="sm:col-span-2">
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  adicionar();
                }
              }}
              placeholder="Ex: Médico legista, Teimoso, Dirigir..."
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold text-foreground focus:border-amber-400 outline-none"
            />
          </div>
          <div>
            <select
              value={categoria}
              onChange={(e) =>
                setCategoria(e.target.value as CategoriaPalavraChaveV1)
              }
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:border-amber-400 outline-none"
            >
              <option value="ocupacao">Ocupação</option>
              <option value="personalidade">Personalidade</option>
              <option value="miscelanea">Miscelânea</option>
              <option value="livre">Livre</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={adicionar}
            disabled={
              !nome.trim() ||
              ficha.palavrasChave.length >= derivada.limitePalavrasChave
            }
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Plus className="size-3.5" /> Adicionar Palavra-chave
          </button>
        </div>
      </div>

      {/* Lista de Palavras-Chave Adicionadas */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {ficha.palavrasChave.map((pc) => (
          <div
            key={pc.id}
            className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border text-xs"
          >
            <div>
              <span className="font-bold text-foreground">{pc.nome}</span>
              <span className="text-[10px] text-muted-foreground uppercase ml-2 px-1.5 py-0.5 rounded bg-muted font-bold">
                {ROTULO_CATEGORIA_PALAVRA_CHAVE_V1[pc.categoria]}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onRemoverPalavraChave(pc.id)}
              className="text-muted-foreground hover:text-red-400 p-1 cursor-pointer"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
