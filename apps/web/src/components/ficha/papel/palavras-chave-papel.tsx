"use client";

import type {
  FichaDerivadaCalafrio,
  PalavraChaveNaFicha,
} from "@calafrio/core";
import { Dices, Plus, X } from "lucide-react";
import { useState } from "react";
import { ModalPalavraChave } from "../modal-palavra-chave";
import { EtiquetaPapel, LinhaSeta, Posicionado } from "./primitivos-papel";
import { u } from "./unidades";

type PalavraDerivada = FichaDerivadaCalafrio["palavrasChaveAtivas"][number];

const TOTAL_LINHAS = 9;
const CATEGORIAS_FIXAS = [
  { categoria: "ocupacao", rotulo: "Ocupação" },
  { categoria: "talento", rotulo: "Talento" },
  { categoria: "falha", rotulo: "Falha" },
] as const;

/** As três primeiras linhas do papel são Ocupação, Talento e Falha; o resto é livre. */
export function distribuirLinhas(palavras: PalavraDerivada[]) {
  const usadas = new Set<string>();
  const fixas = CATEGORIAS_FIXAS.map(({ categoria, rotulo }) => {
    const achada = palavras.find(
      (p) => p.categoria === categoria && !usadas.has(p.id),
    );
    if (achada) usadas.add(achada.id);
    return { palavra: achada, rotulo };
  });
  const livres = palavras.filter((p) => !usadas.has(p.id));
  const linhas: { palavra?: PalavraDerivada; rotulo?: string }[] = [
    ...fixas,
    ...livres.map((palavra) => ({ palavra, rotulo: undefined })),
  ];
  while (linhas.length < TOTAL_LINHAS) linhas.push({});
  return linhas;
}

export function PalavrasChavePapel({
  derivada,
  onAdicionar,
  onRemover,
  onRolar,
}: {
  derivada: FichaDerivadaCalafrio;
  onAdicionar: (palavra: PalavraChaveNaFicha) => void;
  onRemover: (id: string) => void;
  onRolar: (nome: string) => void;
}) {
  const [modalAberto, setModalAberto] = useState(false);
  const linhas = distribuirLinhas(derivada.palavrasChaveAtivas);

  return (
    <>
      <EtiquetaPapel area={{ x: 453, y: 30, w: 104, h: 26 }}>
        Palavras-chave:
      </EtiquetaPapel>
      <LinhaSeta area={{ x: 556, y: 36, w: 92, h: 14 }} />
      <Posicionado
        area={{ x: 560, y: 52, w: 88, h: 9 }}
        className="text-right uppercase italic"
        style={{ fontSize: u(6) }}
      >
        = 2 + APT ({derivada.palavrasChaveOcupadas}/
        {derivada.limitePalavrasChave})
      </Posicionado>

      <Posicionado
        area={{ x: 455, y: 64, w: 193, h: 266 }}
        className="bg-[#f1f1ef]"
        style={{ boxShadow: "inset 0 0 3px rgba(0,0,0,0.35)" }}
      />
      {linhas.map((linha, i) => {
        const y = 67 + i * 29.2;
        const p = linha.palavra;
        return (
          <Posicionado
            // biome-ignore lint/suspicious/noArrayIndexKey: linhas fixas do papel
            key={i}
            area={{ x: 458, y, w: 187, h: 26 }}
            className="group bg-white"
            style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.35)" }}
          >
            {p ? (
              <button
                type="button"
                onClick={() => onRolar(p.nome)}
                title={`Rolar d20 + APT com ${p.nome}`}
                className="flex size-full cursor-pointer items-center truncate text-left"
                style={{ paddingLeft: u(6), fontSize: u(11) }}
              >
                <span className="truncate font-semibold">{p.nome}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setModalAberto(true)}
                title="Adicionar palavra-chave"
                className="flex size-full cursor-pointer items-center justify-start text-black/0 transition-colors hover:text-black/40"
                style={{ paddingLeft: u(6) }}
              >
                <Plus style={{ width: u(11), height: u(11) }} />
              </button>
            )}
            {linha.rotulo && (
              <span
                className="pointer-events-none absolute uppercase italic text-black/80"
                style={{ right: u(14), bottom: u(2), fontSize: u(5.5) }}
              >
                {linha.rotulo}
              </span>
            )}
            {p && (
              <span
                className="absolute top-0 flex h-full items-center gap-[0.4cqw] opacity-0 transition-opacity group-hover:opacity-100"
                style={{ right: u(4) }}
              >
                <Dices style={{ width: u(10), height: u(10) }} />
                {!p.semConsumirLimite && (
                  <button
                    type="button"
                    title="Remover"
                    onClick={() => onRemover(p.id)}
                    className="cursor-pointer text-red-700"
                  >
                    <X style={{ width: u(10), height: u(10) }} />
                  </button>
                )}
              </span>
            )}
          </Posicionado>
        );
      })}

      <ModalPalavraChave
        aberto={modalAberto}
        onSalvar={onAdicionar}
        onFechar={() => setModalAberto(false)}
      />
    </>
  );
}
