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
    <div className="space-y-6 font-sans">
      <div>
        <h4 className="text-lg font-black text-foreground uppercase tracking-wide">
          2. Palavras-Chave ({ficha.palavrasChave.length} /{" "}
          {derivada.limitePalavrasChave})
        </h4>
        <p className="text-sm text-foreground/75 mt-1">
          Adicione termos livres que definem as perícias, ocupação e falhas do
          seu personagem.
        </p>
      </div>

      {/* Formulário de Criação Livre */}
      <form
        onSubmit={lidarAdicionarLivre}
        className="p-4 sm:p-5 rounded-xl border-2 border-border bg-card shadow-xs space-y-3"
      >
        <span className="calafrio-tag-sm">ESCREVER PALAVRA-CHAVE LIVRE</span>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <input
            type="text"
            value={textoLivre}
            onChange={(e) => setTextoLivre(e.target.value)}
            placeholder="Digite o conceito ou perícia livre"
            className="sm:col-span-7 bg-muted/30 p-3 rounded-lg border-2 border-border text-sm focus:border-amber-400 outline-none font-bold text-foreground placeholder:text-foreground/40"
          />

          <select
            value={categoriaLivre}
            onChange={(e) =>
              setCategoriaLivre(
                e.target.value as PalavraChaveNaFicha["categoria"],
              )
            }
            className="sm:col-span-3 bg-muted/30 p-3 rounded-lg border-2 border-border text-sm font-bold text-foreground outline-none cursor-pointer"
          >
            <option value="ocupacao">Ocupação</option>
            <option value="talento">Talento</option>
            <option value="falha">Falha</option>
            <option value="extra">Extra / MdJ</option>
          </select>

          <button
            type="submit"
            className="sm:col-span-2 flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-sm py-3 px-4 rounded-lg cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="size-4" /> Adicionar
          </button>
        </div>
      </form>

      {/* Sorteadores d100 Oficiais */}
      <div className="p-4 sm:p-5 rounded-xl border-2 border-border bg-card shadow-xs space-y-3">
        <span className="calafrio-tag-sm">OU SORTEAR NAS TABELAS D100</span>
        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            type="button"
            onClick={sortearOcupacao}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-muted/60 hover:bg-muted text-foreground font-bold text-sm rounded-lg border-2 border-border cursor-pointer transition-colors shadow-xs"
          >
            <Dices className="size-4 text-amber-600 dark:text-amber-400" />{" "}
            Sortear Ocupação
          </button>
          <button
            type="button"
            onClick={() => sortearGenerica("talento")}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-muted/60 hover:bg-muted text-foreground font-bold text-sm rounded-lg border-2 border-border cursor-pointer transition-colors shadow-xs"
          >
            <Dices className="size-4 text-blue-600 dark:text-blue-400" />{" "}
            Sortear Talento
          </button>
          <button
            type="button"
            onClick={() => sortearGenerica("falha")}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-muted/60 hover:bg-muted text-foreground font-bold text-sm rounded-lg border-2 border-border cursor-pointer transition-colors shadow-xs"
          >
            <Dices className="size-4 text-red-600 dark:text-red-400" /> Sortear
            Falha
          </button>
        </div>
      </div>

      {/* Lista de Palavras-Chave Adicionadas */}
      <div className="space-y-2">
        <span className="text-sm text-foreground font-bold block">
          Palavras-Chave Escolhidas:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {ficha.palavrasChave.map((pc) => (
            <div
              key={pc.id}
              className="flex items-center justify-between p-3 rounded-xl border-2 border-border bg-card shadow-xs text-sm"
            >
              <div>
                <span className="font-bold text-foreground block text-sm">
                  {pc.nome}
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-extrabold uppercase tracking-wider bg-muted text-foreground/80 mt-1 inline-block border border-border/60">
                  {pc.categoria}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemoverPalavraChave(pc.id)}
                className="p-2 text-foreground/60 hover:text-red-600 dark:hover:text-red-400 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                title="Remover"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          {ficha.palavrasChave.length === 0 && (
            <p className="text-sm text-foreground/60 italic col-span-full py-6 text-center border-2 border-dashed border-border rounded-xl">
              Nenhuma palavra-chave adicionada ainda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
