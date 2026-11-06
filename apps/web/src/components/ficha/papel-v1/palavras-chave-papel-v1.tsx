"use client";

import type {
  CategoriaPalavraChaveV1,
  FichaDerivadaV1,
  PalavraChaveV1,
} from "@calafrio/core";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import {
  EtiquetaPapel,
  LinhaSeta,
  Posicionado,
} from "../papel/primitivos-papel";
import { u } from "../papel/unidades";
import { ModalPalavraChaveV1 } from "./modais-papel-v1";

const TOTAL_LINHAS = 12;
const Y_LISTA = 540;
const PASSO = 29;

const CATEGORIAS_FIXAS = [
  { categoria: "ocupacao", rotulo: "Ocupação" },
  { categoria: "personalidade", rotulo: "Personalidade" },
  { categoria: "miscelanea", rotulo: "Miscelânea" },
] as const;

interface LinhaPalavra {
  palavra?: PalavraChaveV1;
  categoria: CategoriaPalavraChaveV1;
  rotulo?: string;
}

/** As três primeiras linhas do papel são Ocupação, Personalidade e Miscelânea. */
export function distribuirPalavrasV1(palavras: PalavraChaveV1[]) {
  const usadas = new Set<string>();
  const fixas: LinhaPalavra[] = CATEGORIAS_FIXAS.map(
    ({ categoria, rotulo }) => {
      const achada = palavras.find(
        (p) => p.categoria === categoria && !usadas.has(p.id),
      );
      if (achada) usadas.add(achada.id);
      return { palavra: achada, categoria, rotulo };
    },
  );
  const linhas: LinhaPalavra[] = [
    ...fixas,
    ...palavras
      .filter((p) => !usadas.has(p.id))
      .map((palavra) => ({ palavra, categoria: palavra.categoria })),
  ];
  while (linhas.length < TOTAL_LINHAS) linhas.push({ categoria: "livre" });
  return linhas;
}

export function PalavrasChavePapelV1({
  palavras,
  derivada,
  onAdicionar,
  onRemover,
}: {
  palavras: PalavraChaveV1[];
  derivada: FichaDerivadaV1;
  onAdicionar: (palavra: PalavraChaveV1) => void;
  onRemover: (id: string) => void;
}) {
  const [categoriaModal, setCategoriaModal] =
    useState<CategoriaPalavraChaveV1 | null>(null);
  const linhas = distribuirPalavrasV1(palavras);
  const cheio = palavras.length >= derivada.limitePalavrasChave;

  return (
    <>
      <EtiquetaPapel area={{ x: 465, y: 507, w: 104, h: 26 }}>
        Palavras-chave:
      </EtiquetaPapel>
      <LinhaSeta area={{ x: 568, y: 513, w: 80, h: 14 }} />
      <Posicionado
        area={{ x: 540, y: 528, w: 108, h: 10 }}
        className="text-right font-bold uppercase italic"
        style={{ fontSize: u(6.8) }}
      >
        = 2 + Nível ({palavras.length}/{derivada.limitePalavrasChave})
      </Posicionado>

      <Posicionado
        area={{ x: 472, y: Y_LISTA, w: 176, h: 350 }}
        className="bg-[#f1f1ef]"
        style={{ boxShadow: "inset 0 0 3px rgba(0,0,0,0.35)" }}
      />
      {linhas.map((linha, i) => {
        const p = linha.palavra;
        const foraDoLimite = !p && (cheio || i >= derivada.limitePalavrasChave);
        return (
          <Posicionado
            key={i}
            area={{ x: 475, y: Y_LISTA + 3 + i * PASSO, w: 170, h: 26 }}
            className={foraDoLimite ? "bg-white/50" : "bg-white"}
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.35)" }}
          >
            {p ? (
              <div
                className="flex size-full items-center justify-between font-bold"
                style={{ paddingLeft: u(8), paddingRight: u(5) }}
              >
                <span className="truncate" style={{ fontSize: u(12.5) }}>
                  {p.nome}
                </span>
                <button
                  type="button"
                  title="Remover palavra-chave"
                  aria-label={`Remover ${p.nome}`}
                  onClick={() => onRemover(p.id)}
                  className="shrink-0 cursor-pointer text-black/35 hover:text-red-700"
                >
                  <X style={{ width: u(11), height: u(11) }} strokeWidth={3} />
                </button>
              </div>
            ) : foraDoLimite ? null : (
              <button
                type="button"
                onClick={() => setCategoriaModal(linha.categoria)}
                title="Adicionar palavra-chave"
                className="flex size-full cursor-pointer items-center font-bold text-black/45 transition-colors hover:bg-black/5 hover:text-black"
                style={{ paddingLeft: u(8), gap: u(4), fontSize: u(11.5) }}
              >
                <Plus style={{ width: u(11), height: u(11) }} strokeWidth={3} />
                Adicionar
              </button>
            )}
            {linha.rotulo && (
              <span
                className="pointer-events-none absolute font-bold uppercase italic text-black/70"
                style={{ right: u(20), bottom: u(1.5), fontSize: u(6.8) }}
              >
                {linha.rotulo}
              </span>
            )}
          </Posicionado>
        );
      })}

      {categoriaModal && (
        <ModalPalavraChaveV1
          categoriaInicial={categoriaModal}
          onSalvar={onAdicionar}
          onFechar={() => setCategoriaModal(null)}
        />
      )}
    </>
  );
}
