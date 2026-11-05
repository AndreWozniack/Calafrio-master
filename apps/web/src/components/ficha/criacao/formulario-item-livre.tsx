"use client";

import type {
  CategoriaItemCalafrio,
  ItemNaFichaCalafrio,
} from "@calafrio/core";
import type { EspectroDeDano } from "@calafrio/tema";
import { Plus } from "lucide-react";
import { useState } from "react";

export const CATEGORIAS_ITEM: {
  valor: CategoriaItemCalafrio;
  rotulo: string;
}[] = [
  { valor: "ferramenta", rotulo: "Ferramenta / Objeto Geral" },
  { valor: "arma_curto", rotulo: "Arma (Curto Alcance)" },
  { valor: "arma_longo", rotulo: "Arma (Longo Alcance)" },
  { valor: "arma_misto", rotulo: "Arma (Alcance Misto)" },
  { valor: "consumivel", rotulo: "Consumível / Munição" },
  { valor: "vestimenta", rotulo: "Vestimenta / Proteção" },
  { valor: "bugiganga", rotulo: "Bugiganga" },
];

export function FormularioItemLivre({
  onAdicionarItem,
}: {
  onAdicionarItem: (item: ItemNaFichaCalafrio) => void;
}) {
  const [nomeLivre, setNomeLivre] = useState("");
  const [categoriaLivre, setCategoriaLivre] =
    useState<CategoriaItemCalafrio>("ferramenta");
  const [danoLivre, setDanoLivre] = useState<number | undefined>(undefined);
  const [alcanceLivre, setAlcanceLivre] = useState("");
  const [descricaoLivre, setDescricaoLivre] = useState("");
  const [espectroLivre, setEspectroLivre] = useState<EspectroDeDano>("fisico");
  const [precoFundosLivre, setPrecoFundosLivre] = useState<number>(0);

  const criarItemLivre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeLivre.trim()) return;

    onAdicionarItem({
      id: `item-livre-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      nome: nomeLivre.trim(),
      categoria: categoriaLivre,
      paranormal: false,
      equipado: false,
      dano: danoLivre && danoLivre > 0 ? Number(danoLivre) : undefined,
      espectroDano: espectroLivre,
      alcance: alcanceLivre.trim() || undefined,
      precoFundos: precoFundosLivre > 0 ? Number(precoFundosLivre) : undefined,
      descricao: descricaoLivre.trim() || undefined,
      efeitos: [],
    });

    setNomeLivre("");
    setDanoLivre(undefined);
    setAlcanceLivre("");
    setDescricaoLivre("");
    setPrecoFundosLivre(0);
  };

  return (
    <form
      onSubmit={criarItemLivre}
      className="p-4 sm:p-5 rounded-xl border-2 border-border bg-card shadow-xs space-y-3.5 text-sm"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-foreground font-bold mb-1.5 text-sm">
            Nome do Item
          </label>
          <input
            type="text"
            value={nomeLivre}
            onChange={(e) => setNomeLivre(e.target.value)}
            placeholder="Nome do item ou equipamento"
            required
            className="w-full bg-muted/30 p-2.5 rounded-lg border-2 border-border font-bold outline-none focus:border-amber-400 text-foreground text-sm"
          />
        </div>

        <div>
          <label className="block text-foreground font-bold mb-1.5 text-sm">
            Categoria
          </label>
          <select
            value={categoriaLivre}
            onChange={(e) =>
              setCategoriaLivre(e.target.value as CategoriaItemCalafrio)
            }
            className="w-full bg-muted/30 p-2.5 rounded-lg border-2 border-border font-bold outline-none cursor-pointer text-foreground text-sm"
          >
            {CATEGORIAS_ITEM.map((cat) => (
              <option key={cat.valor} value={cat.valor}>
                {cat.rotulo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-foreground font-bold mb-1.5 text-sm">
            Dano (se for arma)
          </label>
          <input
            type="number"
            min={0}
            value={danoLivre ?? ""}
            onChange={(e) =>
              setDanoLivre(e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="Pontos de dano numérico"
            className="w-full bg-muted/30 p-2.5 rounded-lg border-2 border-border font-bold outline-none focus:border-amber-400 text-foreground text-sm"
          />
        </div>

        <div>
          <label className="block text-foreground font-bold mb-1.5 text-sm">
            Alcance ou Tipo
          </label>
          <input
            type="text"
            value={alcanceLivre}
            onChange={(e) => setAlcanceLivre(e.target.value)}
            placeholder="Alcance do ataque ou aplicação"
            className="w-full bg-muted/30 p-2.5 rounded-lg border-2 border-border font-bold outline-none focus:border-amber-400 text-foreground text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-foreground font-bold mb-1.5 text-sm">
            Descrição e Propriedades
          </label>
          <textarea
            rows={2}
            value={descricaoLivre}
            onChange={(e) => setDescricaoLivre(e.target.value)}
            placeholder="Descrição, efeitos especiais ou notas de uso"
            className="w-full bg-muted/30 p-2.5 rounded-lg border-2 border-border font-medium outline-none focus:border-amber-400 text-foreground text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-sm rounded-lg cursor-pointer transition-colors shadow-xs"
      >
        <Plus className="size-4" /> Adicionar Item Livre ao Inventário
      </button>
    </form>
  );
}
