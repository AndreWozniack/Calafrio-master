"use client";

import type {
  FichaCalafrioV1,
  FichaDerivadaV1,
  HabilidadeUnicaV1,
  ItemV1,
  PalavraChaveV1,
} from "@calafrio/core";
import { BookOpen, Sparkles } from "lucide-react";
import { useState } from "react";
import { FichaV1Pagina1 } from "./ficha-v1-pagina1";
import { FichaV1Pagina2 } from "./ficha-v1-pagina2";

export interface FichaV1ComponenteProps {
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
  adicionarPalavraChave: (p: PalavraChaveV1) => void;
  removerPalavraChave: (id: string) => void;
  adicionarItem: (item: ItemV1) => void;
  removerItem: (id: string) => void;
  definirQuemSouEu: (texto: string) => void;
  definirAnotacoes: (texto: string) => void;
  memorizarHabilidade: (id: string) => void;
  esquecerHabilidade: (id: string) => void;
  aprimorarHabilidade: (id: string, descricao: string) => void;
  removerAprimoramentoHabilidade: (id: string, aprimoramentoId: string) => void;
  definirPmExtra: (id: string, pmExtra: number) => void;
  adicionarHabilidadeUnica: (unica: HabilidadeUnicaV1) => void;
  aprimorarHabilidadeUnica: (id: string, descricao: string) => void;
  removerHabilidadeUnica: (id: string) => void;
}

export function FichaV1({
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
  memorizarHabilidade,
  esquecerHabilidade,
  aprimorarHabilidade,
  removerAprimoramentoHabilidade,
  definirPmExtra,
  adicionarHabilidadeUnica,
  aprimorarHabilidadeUnica,
  removerHabilidadeUnica,
}: FichaV1ComponenteProps) {
  const [pagina, setPagina] = useState<1 | 2>(1);

  return (
    <div className="space-y-6">
      {/* Alternador de Páginas */}
      <div className="flex items-center justify-center gap-2 border-b border-border/60 pb-4">
        <button
          type="button"
          onClick={() => setPagina(1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            pagina === 1
              ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
              : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <BookOpen className="size-4" />
          Página 1: Atributos & Inventário
        </button>
        <button
          type="button"
          onClick={() => setPagina(2)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            pagina === 2
              ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
              : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <Sparkles className="size-4" />
          Página 2: Habilidades & Ecos
        </button>
      </div>

      {pagina === 1 ? (
        <FichaV1Pagina1
          ficha={ficha}
          derivada={derivada}
          definirNome={definirNome}
          definirJogador={definirJogador}
          definirNivel={definirNivel}
          definirAtributo={definirAtributo}
          definirPvAtual={definirPvAtual}
          definirPaAtual={definirPaAtual}
          definirCarteira={definirCarteira}
          adicionarPalavraChave={adicionarPalavraChave}
          removerPalavraChave={removerPalavraChave}
          adicionarItem={adicionarItem}
          removerItem={removerItem}
          definirQuemSouEu={definirQuemSouEu}
          definirAnotacoes={definirAnotacoes}
        />
      ) : (
        <FichaV1Pagina2
          ficha={ficha}
          derivada={derivada}
          memorizarHabilidade={memorizarHabilidade}
          esquecerHabilidade={esquecerHabilidade}
          aprimorarHabilidade={aprimorarHabilidade}
          removerAprimoramentoHabilidade={removerAprimoramentoHabilidade}
          definirPmExtra={definirPmExtra}
          adicionarHabilidadeUnica={adicionarHabilidadeUnica}
          aprimorarHabilidadeUnica={aprimorarHabilidadeUnica}
          removerHabilidadeUnica={removerHabilidadeUnica}
        />
      )}
    </div>
  );
}
