"use client";

import {
  ARVORES_1E,
  type ArvoreV1,
  CUSTO_PM_POR_GRAU,
  type FichaCalafrioV1,
  type FichaDerivadaV1,
  HABILIDADES_1E,
  podeMemorizarV1,
} from "@calafrio/core";
import { HelpCircle, Lock } from "lucide-react";
import { useState } from "react";
import {
  formatarCustoPA,
  formatarGrauRomano,
} from "../ficha-v1/modelo-visual-v1";
import { CascaModal } from "../modais/casca-modal";

const NOMES_ARVORES: Record<ArvoreV1, string> = {
  maneiras: "Maneiras",
  caoticas: "Caóticas",
  esquisitas: "Esquisitas",
  agradaveis: "Agradáveis",
  racionais: "Racionais",
};

/** Escolha de habilidade paranormal no estilo da ficha impressa (preto e branco). */
export function SeletorHabilidadePapelV1({
  ficha,
  derivada,
  onMemorizar,
  onFechar,
}: {
  ficha: FichaCalafrioV1;
  derivada: FichaDerivadaV1;
  onMemorizar: (id: string) => void;
  onFechar: () => void;
}) {
  const [arvore, setArvore] = useState<ArvoreV1>("maneiras");
  const cartas = HABILIDADES_1E.filter(
    (h) => h.arvore === arvore && h.grau > 0,
  );

  return (
    <CascaModal titulo="Memorizar habilidade" onFechar={onFechar}>
      <p className="mb-3 text-sm font-semibold text-black/70">
        Memória: {derivada.pmGasto} / {derivada.pmMax} PM ·{" "}
        {derivada.pmRestante} livres. Grau II e III exigem uma habilidade ligada
        do grau anterior.
      </p>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {ARVORES_1E.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setArvore(a)}
            className={`cursor-pointer border-2 border-black px-3 py-1.5 text-sm font-extrabold ${
              a === arvore ? "bg-black text-white" : "bg-white hover:bg-black/5"
            }`}
          >
            {NOMES_ARVORES[a]}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {cartas.map((c) => {
          const memorizada = ficha.habilidades.some((h) => h.id === c.id);
          const checagem = podeMemorizarV1(ficha, c.id);
          return (
            <li
              key={c.id}
              className={`border-2 border-black bg-white p-3 ${
                !memorizada && !checagem.ok ? "opacity-55" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-black px-1.5 py-0.5 text-xs font-extrabold text-white">
                      Grau {formatarGrauRomano(c.grau)}
                    </span>
                    <span className="text-base font-extrabold">{c.nome}</span>
                    <span className="text-xs font-bold italic text-black/60">
                      {formatarCustoPA(c.custoPA)} · {CUSTO_PM_POR_GRAU[c.grau]}{" "}
                      PM
                    </span>
                    {c.marcadores.includes("cadeado") && (
                      <Lock
                        className="size-3.5"
                        aria-label="Marcador de cadeado da carta"
                      />
                    )}
                    {c.marcadores.includes("interrogacao") && (
                      <HelpCircle
                        className="size-3.5"
                        aria-label="Marcador de interrogação da carta"
                      />
                    )}
                  </div>
                  <p className="mt-1.5 text-sm leading-snug text-black/80">
                    {c.descricao}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  {memorizada ? (
                    <span className="text-sm font-extrabold italic">
                      Memorizada
                    </span>
                  ) : checagem.ok ? (
                    <button
                      type="button"
                      onClick={() => {
                        onMemorizar(c.id);
                        onFechar();
                      }}
                      className="cursor-pointer border-2 border-black bg-black px-3 py-1.5 text-sm font-extrabold text-white shadow-[2px_2px_0_rgba(0,0,0,0.35)] hover:bg-black/85"
                    >
                      Memorizar
                    </button>
                  ) : (
                    <span className="block max-w-36 text-xs font-bold italic leading-tight text-red-800">
                      {checagem.motivo}
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </CascaModal>
  );
}
