"use client";

import type {
  AlvoAtributoCalafrio,
  FichaCalafrio,
  FichaDerivadaCalafrio,
  RegraEspecialId,
} from "@calafrio/core";
import { Minus, Plus } from "lucide-react";

const ALVOS: {
  id: AlvoAtributoCalafrio;
  rotulo: string;
  total: (d: FichaDerivadaCalafrio) => number;
}[] = [
  { id: "pvMax", rotulo: "PV máximo", total: (d) => d.pvMax },
  { id: "paMax", rotulo: "PA máximo", total: (d) => d.paMax },
  { id: "pd", rotulo: "Defesa (PD)", total: (d) => d.pd },
  { id: "velocidade", rotulo: "Velocidade", total: (d) => d.velocidade },
  { id: "ecosMax", rotulo: "Ecos", total: (d) => d.ecosMax },
  {
    id: "limitePalavrasChave",
    rotulo: "Limite de palavras-chave",
    total: (d) => d.limitePalavrasChave,
  },
  {
    id: "limiteHabilidadesMemorizadas",
    rotulo: "Limite de habilidades",
    total: (d) => d.limiteHabilidadesMemorizadas,
  },
  {
    id: "bonusTesteAcao",
    rotulo: "Bônus em testes",
    total: (d) => d.bonusTesteAcao,
  },
  {
    id: "bonusContestacao",
    rotulo: "Bônus em contestação",
    total: (d) => d.bonusContestacao,
  },
  {
    id: "danoDesarmado",
    rotulo: "Dano desarmado",
    total: (d) => d.danoDesarmado,
  },
];

const REGRAS: { id: RegraEspecialId; rotulo: string; descricao: string }[] = [
  {
    id: "permitirDominioMisto",
    rotulo: "Permitir domínio misto (Positivo + Negativo)",
    descricao: "Liberado pelo MdJ.",
  },
  {
    id: "pvUnificadoComPa",
    rotulo: "PV e PA unificados (custos saem do PV)",
    descricao: "Como o Djanho Sexto Sentido.",
  },
  {
    id: "habilidadeUnicaContaParaAlinhamento",
    rotulo: "Habilidade Única conta para alinhamento",
    descricao: "Liberado pelo MdJ.",
  },
];

interface Props {
  ficha: FichaCalafrio;
  derivada: FichaDerivadaCalafrio;
  onAjuste: (alvo: AlvoAtributoCalafrio, valor: number) => void;
  onRegra: (regra: RegraEspecialId, ativa: boolean, descricao: string) => void;
}

export function PainelAjustesMestre({
  ficha,
  derivada,
  onAjuste,
  onRegra,
}: Props) {
  const ajusteAtual = (alvo: AlvoAtributoCalafrio): number => {
    const e = ficha.efeitosCustomizados.find(
      (x) => x.id === `ajuste-manual-${alvo}`,
    );
    return e?.efeito.tipo === "modificadorAtributo" &&
      typeof e.efeito.valor === "number"
      ? e.efeito.valor
      : 0;
  };
  const regraAtiva = (r: RegraEspecialId) =>
    ficha.efeitosCustomizados.some((x) => x.id === `regra-manual-${r}`);

  return (
    <details className="calafrio-card p-4 group">
      <summary className="cursor-pointer flex items-center gap-2 list-none">
        <span className="calafrio-tag">AJUSTES LIVRES DO MESTRE</span>
        <span className="text-xs text-muted-foreground">
          somam ou subtraem do valor calculado — nada fica travado
        </span>
      </summary>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {ALVOS.map((a) => {
          const aj = ajusteAtual(a.id);
          return (
            <div
              key={a.id}
              className="flex items-center justify-between gap-2 p-2 rounded border border-border text-xs"
            >
              <div>
                <div className="font-bold">{a.rotulo}</div>
                <div className="text-xs text-muted-foreground font-medium">
                  total {a.total(derivada)} · ajuste {aj > 0 ? `+${aj}` : aj}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label={`Diminuir ajuste de ${a.rotulo}`}
                  onClick={() => onAjuste(a.id, aj - 1)}
                  className="size-7 grid place-items-center rounded border border-border hover:bg-muted cursor-pointer"
                >
                  <Minus className="size-3" />
                </button>
                <input
                  type="number"
                  value={aj}
                  onChange={(e) => onAjuste(a.id, Number(e.target.value) || 0)}
                  aria-label={`Ajuste de ${a.rotulo}`}
                  className="w-12 text-center bg-muted/40 rounded border border-border h-7"
                />
                <button
                  type="button"
                  aria-label={`Aumentar ajuste de ${a.rotulo}`}
                  onClick={() => onAjuste(a.id, aj + 1)}
                  className="size-7 grid place-items-center rounded border border-border hover:bg-muted cursor-pointer"
                >
                  <Plus className="size-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 space-y-1.5">
        <span className="calafrio-tag-sm">REGRAS ESPECIAIS</span>
        {REGRAS.map((r) => (
          <label
            key={r.id}
            className="flex items-center gap-2 text-xs cursor-pointer"
          >
            <input
              type="checkbox"
              checked={regraAtiva(r.id)}
              onChange={(e) => onRegra(r.id, e.target.checked, r.descricao)}
            />
            {r.rotulo}
          </label>
        ))}
      </div>
    </details>
  );
}
