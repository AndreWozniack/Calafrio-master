"use client";

import type { AlvoAtributoCalafrio, EfeitoCalafrio } from "@calafrio/core";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const ALVOS: { id: AlvoAtributoCalafrio; rotulo: string }[] = [
  { id: "apt", rotulo: "APT" },
  { id: "pvMax", rotulo: "PV máximo" },
  { id: "paMax", rotulo: "PA máximo" },
  { id: "pd", rotulo: "PD (Defesa)" },
  { id: "velocidade", rotulo: "Velocidade" },
  { id: "ecosMax", rotulo: "Ecos" },
  { id: "limitePalavrasChave", rotulo: "Limite de palavras-chave" },
  { id: "limiteHabilidadesMemorizadas", rotulo: "Limite de habilidades" },
  { id: "bonusTesteAcao", rotulo: "Bônus em testes de ação" },
  { id: "bonusContestacao", rotulo: "Bônus em contestação" },
  { id: "danoDesarmado", rotulo: "Dano desarmado" },
];

function formatarValor(
  v: number | { escalaPorApt: number; base?: number },
): string {
  if (typeof v === "number") return v > 0 ? `+${v}` : String(v);
  return `${v.base ?? 0} + ${v.escalaPorApt}×APT`;
}

interface Props {
  efeitos: EfeitoCalafrio[];
  onChange: (efeitos: EfeitoCalafrio[]) => void;
}

/** Editor de modificadores livres (efeitos abertos) — o Mestre decide o que o item/palavra-chave concede. */
export function EditorEfeitos({ efeitos, onChange }: Props) {
  const [alvo, setAlvo] = useState<AlvoAtributoCalafrio>("pd");
  const [valor, setValor] = useState(1);
  const [condicao, setCondicao] = useState("");

  const adicionar = () => {
    if (!valor) return;
    onChange([
      ...efeitos,
      {
        tipo: "modificadorAtributo",
        alvo,
        valor,
        condicaoTexto: condicao.trim() || undefined,
      },
    ]);
    setCondicao("");
  };

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-black uppercase text-muted-foreground">
        Efeitos / modificadores (opcional)
      </span>
      {efeitos.map((e, i) =>
        e.tipo === "modificadorAtributo" ? (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: lista local editável
            key={i}
            className="flex items-center justify-between text-xs px-2 py-1 rounded border border-border bg-muted/40"
          >
            <span>
              <strong>{formatarValor(e.valor)}</strong>{" "}
              {ALVOS.find((a) => a.id === e.alvo)?.rotulo}
              {e.condicaoTexto ? ` — ${e.condicaoTexto}` : ""}
            </span>
            <button
              type="button"
              aria-label="Remover efeito"
              onClick={() => onChange(efeitos.filter((_, j) => j !== i))}
              className="cursor-pointer text-muted-foreground hover:text-red-500"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ) : null,
      )}
      <div className="flex flex-wrap gap-1.5">
        <select
          value={alvo}
          onChange={(e) => setAlvo(e.target.value as AlvoAtributoCalafrio)}
          className="bg-muted text-xs p-1.5 rounded border border-border"
        >
          {ALVOS.map((a) => (
            <option key={a.id} value={a.id}>
              {a.rotulo}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(Number(e.target.value))}
          className="w-16 bg-muted/60 text-xs px-2 py-1.5 rounded border border-border"
          aria-label="Valor do modificador"
        />
        <input
          type="text"
          value={condicao}
          onChange={(e) => setCondicao(e.target.value)}
          placeholder="Condição (opcional)"
          className="flex-1 min-w-[120px] bg-muted/60 text-xs px-2 py-1.5 rounded border border-border"
        />
        <button
          type="button"
          onClick={adicionar}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded border border-border hover:bg-muted cursor-pointer"
        >
          <Plus className="size-3.5" /> Efeito
        </button>
      </div>
    </div>
  );
}
