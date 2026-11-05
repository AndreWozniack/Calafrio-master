"use client";

import type { CatalogoCalafrio } from "@calafrio/core";
import { Dices } from "lucide-react";
import { useMemo, useState } from "react";
import type { FormItem } from "./form-item";
import {
  BuscaBiblioteca,
  CardResultado,
  FiltrosBiblioteca,
  ListaVazia,
} from "./lista-biblioteca";

type Filtro =
  | "todos"
  | "curto"
  | "longo"
  | "misto"
  | "consumivel"
  | "bugiganga";

const FILTROS: { id: Filtro; rotulo: string }[] = [
  { id: "todos", rotulo: "Tudo" },
  { id: "curto", rotulo: "Corpo a corpo" },
  { id: "longo", rotulo: "Longo alcance" },
  { id: "misto", rotulo: "Misto" },
  { id: "consumivel", rotulo: "Consumíveis" },
  { id: "bugiganga", rotulo: "Bugigangas" },
];

const TIPO_PARA_FILTRO = {
  "Alcance corpo-a-corpo": "curto",
  "Longo-alcance": "longo",
  "Alcance misto": "misto",
  Consumível: "consumivel",
} as const;

const CATEGORIA_POR_FILTRO = {
  curto: "arma_curto",
  longo: "arma_longo",
  misto: "arma_misto",
  consumivel: "consumivel",
} as const;

interface Entrada {
  chave: string;
  filtro: Exclude<Filtro, "todos">;
  titulo: string;
  descricao?: string;
  meta?: string;
  formulario: Partial<FormItem>;
}

function montarEntradas(catalogo: CatalogoCalafrio): Entrada[] {
  const armas = catalogo.armasMundanas.map((a): Entrada => {
    const filtro = TIPO_PARA_FILTRO[a.tipoAlcance];
    return {
      chave: a.id,
      filtro,
      titulo: a.categoria,
      descricao: a.exemplos,
      meta: `Dano ${a.dano} · F$ ${a.precoFundos}`,
      formulario: {
        nome: a.categoria,
        categoria: CATEGORIA_POR_FILTRO[filtro],
        paranormal: false,
        dano: a.dano,
        espectro: a.espectroDano,
        precoFundos: a.precoFundos,
        propriedades: a.propriedades.join("\n"),
        descricao: a.exemplos,
      },
    };
  });
  const bugigangas = catalogo.bugigangas.map(
    (b): Entrada => ({
      chave: `bug-${b.numero}`,
      filtro: "bugiganga",
      titulo: b.nome,
      meta: `d100 · ${b.numero}`,
      formulario: { nome: b.nome, categoria: "bugiganga", paranormal: false },
    }),
  );
  return [...armas, ...bugigangas];
}

export function BibliotecaArsenal({
  catalogo,
  onEscolher,
}: {
  catalogo: CatalogoCalafrio;
  onEscolher: (formulario: Partial<FormItem>) => void;
}) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const entradas = useMemo(() => montarEntradas(catalogo), [catalogo]);

  const visiveis = entradas.filter(
    (e) =>
      (filtro === "todos" || e.filtro === filtro) &&
      `${e.titulo} ${e.descricao ?? ""}`
        .toLowerCase()
        .includes(busca.toLowerCase()),
  );

  const sortearBugiganga = () => {
    const sorteada =
      catalogo.bugigangas[
        Math.floor(Math.random() * catalogo.bugigangas.length)
      ];
    if (sorteada) {
      onEscolher({
        nome: sorteada.nome,
        categoria: "bugiganga",
        paranormal: false,
      });
    }
  };

  return (
    <div className="space-y-3">
      <BuscaBiblioteca
        valor={busca}
        onChange={setBusca}
        placeholder={`Buscar entre ${entradas.length} itens...`}
        acao={
          <button
            type="button"
            onClick={sortearBugiganga}
            title="Sortear bugiganga no d100"
            aria-label="Sortear bugiganga no d100"
            className="flex min-h-12 shrink-0 cursor-pointer items-center gap-1.5 border-2 border-black bg-white px-3 text-sm font-extrabold active:bg-black/10"
          >
            <Dices className="size-5" /> d100
          </button>
        }
      />
      <FiltrosBiblioteca opcoes={FILTROS} ativo={filtro} onMudar={setFiltro} />
      <div className="space-y-2">
        {visiveis.map((e) => (
          <CardResultado
            key={e.chave}
            titulo={e.titulo}
            descricao={e.descricao}
            meta={e.meta}
            onSelecionar={() => onEscolher(e.formulario)}
          />
        ))}
        {visiveis.length === 0 && (
          <ListaVazia texto="Nada encontrado. Use a aba Manual para criar o item." />
        )}
      </div>
    </div>
  );
}
