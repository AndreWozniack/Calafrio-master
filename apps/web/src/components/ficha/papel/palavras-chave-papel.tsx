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
        area={{ x: 556, y: 51, w: 92, h: 11 }}
        className="text-right uppercase italic font-bold"
        style={{ fontSize: u(7.8) }}
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
              <>
                <button
                  type="button"
                  onClick={() => onRolar(p.nome)}
                  title={`Rolar d20 + APT com "${p.nome}"`}
                  className="flex size-full cursor-pointer items-center truncate text-left font-bold hover:bg-black/5"
                  style={{
                    paddingLeft: u(8),
                    paddingRight: u(40),
                    fontSize: u(13),
                  }}
                >
                  <span className="truncate">{p.nome}</span>
                </button>
                <span
                  className="absolute top-0 flex h-full items-center"
                  style={{ right: u(5), gap: u(4) }}
                >
                  <span
                    className="pointer-events-none flex items-center justify-center rounded-full bg-black text-white"
                    style={{ width: u(16), height: u(16) }}
                    aria-hidden="true"
                  >
                    <Dices style={{ width: u(10), height: u(10) }} />
                  </span>
                  {!p.semConsumirLimite && (
                    <button
                      type="button"
                      title="Remover palavra-chave"
                      aria-label={`Remover ${p.nome}`}
                      onClick={() => onRemover(p.id)}
                      className="cursor-pointer text-black/35 hover:text-red-700"
                    >
                      <X style={{ width: u(11), height: u(11) }} strokeWidth={3} />
                    </button>
                  )}
                </span>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setModalAberto(true)}
                title="Adicionar palavra-chave"
                className="flex size-full cursor-pointer items-center text-black/45 font-bold transition-colors hover:bg-black/5 hover:text-black"
                style={{ paddingLeft: u(8), gap: u(4), fontSize: u(11.8) }}
              >
                <Plus style={{ width: u(11), height: u(11) }} strokeWidth={3} />
                Adicionar
              </button>
            )}
            {linha.rotulo && (
              <span
                className="pointer-events-none absolute font-bold uppercase italic text-black/70"
                style={{ right: u(40), bottom: u(1.5), fontSize: u(7.5) }}
              >
                {linha.rotulo}
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
