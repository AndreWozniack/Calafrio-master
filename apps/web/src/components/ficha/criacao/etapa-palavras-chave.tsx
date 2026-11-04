"use client";

import type {
  CatalogoCalafrio,
  FichaCalafrio,
  FichaDerivadaCalafrio,
  PalavraChaveNaFicha,
} from "@calafrio/core";
import { Dices, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface EtapaPalavrasChaveProps {
  ficha: FichaCalafrio;
  derivada: FichaDerivadaCalafrio;
  catalogo: CatalogoCalafrio;
  onAdicionarPalavraChave: (palavra: PalavraChaveNaFicha) => void;
  onRemoverPalavraChave: (id: string) => void;
}

export function EtapaPalavrasChave({
  ficha,
  derivada,
  catalogo,
  onAdicionarPalavraChave,
  onRemoverPalavraChave,
}: EtapaPalavrasChaveProps) {
  const [textoLivre, setTextoLivre] = useState("");
  const [categoriaLivre, setCategoriaLivre] =
    useState<PalavraChaveNaFicha["categoria"]>("ocupacao");

  const lidarAdicionarLivre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textoLivre.trim()) return;

    onAdicionarPalavraChave({
      id: `pc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      nome: textoLivre.trim(),
      categoria: categoriaLivre,
      semConsumirLimite: false,
      efeitos: [],
    });
    setTextoLivre("");
  };

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

  const sortearGenerica = (cat: "talento" | "falha" | "extra") => {
    const idx = Math.floor(
      Math.random() * catalogo.palavrasChaveGenericas.length,
    );
    const item = catalogo.palavrasChaveGenericas[idx];
    onAdicionarPalavraChave({
      id: `pc-${cat}-${Date.now()}`,
      nome: item.nome,
      categoria: cat,
      semConsumirLimite: false,
      efeitos: [],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-base font-black text-foreground uppercase tracking-wide">
          2. Palavras-Chave ({ficha.palavrasChave.length} /{" "}
          {derivada.limitePalavrasChave})
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          Adicione termos livres que definem as perícias, ocupação e falhas do
          seu personagem.
        </p>
      </div>

      {/* Formulário de Criação Livre */}
      <form
        onSubmit={lidarAdicionarLivre}
        className="p-4 rounded-xl border border-border bg-muted/40 space-y-3"
      >
        <span className="calafrio-tag-sm">ESCREVER PALAVRA-CHAVE LIVRE</span>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <input
            type="text"
            value={textoLivre}
            onChange={(e) => setTextoLivre(e.target.value)}
            placeholder="Digite o conceito ou perícia livre"
            className="sm:col-span-7 bg-card p-2.5 rounded-lg border border-border text-xs focus:border-amber-400 outline-none font-bold"
          />

          <select
            value={categoriaLivre}
            onChange={(e) =>
              setCategoriaLivre(
                e.target.value as PalavraChaveNaFicha["categoria"],
              )
            }
            className="sm:col-span-3 bg-card p-2.5 rounded-lg border border-border text-xs font-bold outline-none cursor-pointer"
          >
            <option value="ocupacao">Ocupação</option>
            <option value="talento">Talento</option>
            <option value="falha">Falha</option>
            <option value="extra">Extra / MdJ</option>
          </select>

          <button
            type="submit"
            className="sm:col-span-2 flex items-center justify-center gap-1 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs py-2 rounded-lg cursor-pointer transition-colors"
          >
            <Plus className="size-3.5" /> Adicionar
          </button>
        </div>
      </form>

      {/* Sorteadores d100 Oficiais */}
      <div className="p-4 rounded-xl border border-border bg-card/40 space-y-2.5">
        <span className="calafrio-tag-sm">OU SORTEAR NAS TABELAS D100</span>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={sortearOcupacao}
            className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-border text-foreground font-bold text-xs rounded-lg cursor-pointer transition-colors"
          >
            <Dices className="size-3.5 text-amber-400" /> Sortear Ocupação
          </button>
          <button
            type="button"
            onClick={() => sortearGenerica("talento")}
            className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-border text-foreground font-bold text-xs rounded-lg cursor-pointer transition-colors"
          >
            <Dices className="size-3.5 text-blue-400" /> Sortear Talento
          </button>
          <button
            type="button"
            onClick={() => sortearGenerica("falha")}
            className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-border text-foreground font-bold text-xs rounded-lg cursor-pointer transition-colors"
          >
            <Dices className="size-3.5 text-red-400" /> Sortear Falha
          </button>
        </div>
      </div>

      {/* Lista de Palavras-Chave Adicionadas */}
      <div className="space-y-2">
        <span className="text-xs text-muted-foreground font-bold block">
          Palavras-Chave Escolhidas:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ficha.palavrasChave.map((pc) => (
            <div
              key={pc.id}
              className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card text-xs"
            >
              <div>
                <span className="font-bold text-foreground block">
                  {pc.nome}
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                  {pc.categoria}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemoverPalavraChave(pc.id)}
                className="p-1 text-muted-foreground hover:text-red-400 cursor-pointer"
                title="Remover"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
          {ficha.palavrasChave.length === 0 && (
            <p className="text-xs text-muted-foreground italic col-span-full py-4 text-center">
              Nenhuma palavra-chave adicionada ainda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
