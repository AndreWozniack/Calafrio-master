"use client";

import type {
  FichaCalafrioV1,
  FichaDerivadaV1,
  HabilidadeUnicaV1,
} from "@calafrio/core";
import { FichaV1EcosBanner } from "./ficha-v1-ecos-banner";
import { FichaV1HabilidadesUnicas } from "./ficha-v1-habilidades-unicas";
import { FichaV1TabelaHabilidades } from "./ficha-v1-tabela-habilidades";

interface FichaV1Pagina2Props {
  ficha: FichaCalafrioV1;
  derivada: FichaDerivadaV1;
  memorizarHabilidade: (id: string) => void;
  esquecerHabilidade: (id: string) => void;
  aprimorarHabilidade: (id: string, descricao: string) => void;
  removerAprimoramentoHabilidade: (id: string, aprimoramentoId: string) => void;
  definirPmExtra: (id: string, pmExtra: number) => void;
  adicionarHabilidadeUnica: (unica: HabilidadeUnicaV1) => void;
  aprimorarHabilidadeUnica: (id: string, descricao: string) => void;
  removerHabilidadeUnica: (id: string) => void;
}

export function FichaV1Pagina2({
  ficha,
  derivada,
  memorizarHabilidade,
  esquecerHabilidade,
  aprimorarHabilidade,
  removerAprimoramentoHabilidade,
  definirPmExtra,
  adicionarHabilidadeUnica,
  aprimorarHabilidadeUnica,
  removerHabilidadeUnica,
}: FichaV1Pagina2Props) {
  return (
    <div className="space-y-6">
      {/* Banner de Ecos e Avisos */}
      <FichaV1EcosBanner derivada={derivada} />

      {/* Tabela de Habilidades Paranormais */}
      <FichaV1TabelaHabilidades
        ficha={ficha}
        derivada={derivada}
        memorizarHabilidade={memorizarHabilidade}
        esquecerHabilidade={esquecerHabilidade}
        aprimorarHabilidade={aprimorarHabilidade}
        removerAprimoramentoHabilidade={removerAprimoramentoHabilidade}
        definirPmExtra={definirPmExtra}
      />

      {/* Habilidades Únicas */}
      <FichaV1HabilidadesUnicas
        ficha={ficha}
        semEco={derivada.ecosGastos >= derivada.ecosMax}
        adicionarHabilidadeUnica={adicionarHabilidadeUnica}
        aprimorarHabilidadeUnica={aprimorarHabilidadeUnica}
        removerHabilidadeUnica={removerHabilidadeUnica}
      />
    </div>
  );
}
