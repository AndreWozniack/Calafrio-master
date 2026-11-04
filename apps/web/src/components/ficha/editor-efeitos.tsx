"use client";

import type {
  AlvoAtributoCalafrio,
  EfeitoCalafrio,
  EspectroDeDano,
  RegraEspecialId,
} from "@calafrio/core";
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

const ESPECTROS: EspectroDeDano[] = [
  "fisico",
  "castanho",
  "rubro",
  "ceruleo",
  "alvo",
  "variavel",
];

function descreverEfeito(e: EfeitoCalafrio): string {
  switch (e.tipo) {
    case "modificadorAtributo":
      return `${formatarValor(e.valor)} ${
        ALVOS.find((a) => a.id === e.alvo)?.rotulo ?? e.alvo
      }${e.condicaoTexto ? ` — ${e.condicaoTexto}` : ""}`;
    case "concederPalavraChave":
      return `Concede palavra-chave: ${e.nome}`;
    case "resistenciaOuVulnerabilidade":
      return `${e.grau} a ${e.espectro}`;
    case "companheiro":
      return `Companheiro: ${e.nome}`;
    case "regraEspecial":
      return `Regra: ${e.regra} — ${e.descricao}`;
  }
}

interface Props {
  efeitos: EfeitoCalafrio[];
  onChange: (efeitos: EfeitoCalafrio[]) => void;
}

const classeControle =
  "border-2 border-black bg-white px-2.5 py-1.5 text-xs text-black font-bold outline-none focus:shadow-[0_0_0_2px_#fbbf24] shadow-[1px_1px_0px_#000]";

/** Editor de modificadores livres (efeitos abertos) — o Mestre decide o que o item/palavra-chave concede. */
export function EditorEfeitos({ efeitos, onChange }: Props) {
  const [alvo, setAlvo] = useState<AlvoAtributoCalafrio>("pd");
  const [valor, setValor] = useState(1);
  const [condicao, setCondicao] = useState("");
  const [tipo, setTipo] = useState<
    "modificador" | "palavra" | "resistencia" | "regra"
  >("modificador");
  const [nomePalavra, setNomePalavra] = useState("");
  const [espectro, setEspectro] = useState<EspectroDeDano>("fisico");
  const [grau, setGrau] = useState<"resistente" | "vulneravel" | "imune">(
    "resistente",
  );
  const [regra, setRegra] = useState<RegraEspecialId>("customizada");
  const [textoRegra, setTextoRegra] = useState("");

  const adicionar = () => {
    if (tipo === "modificador") {
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
    } else if (tipo === "palavra") {
      if (!nomePalavra.trim()) return;
      onChange([
        ...efeitos,
        {
          tipo: "concederPalavraChave",
          nome: nomePalavra.trim(),
          semConsumirLimite: true,
        },
      ]);
      setNomePalavra("");
    } else if (tipo === "resistencia") {
      onChange([
        ...efeitos,
        { tipo: "resistenciaOuVulnerabilidade", espectro, grau },
      ]);
    } else {
      if (!textoRegra.trim() && regra === "customizada") return;
      onChange([
        ...efeitos,
        {
          tipo: "regraEspecial",
          regra,
          descricao: textoRegra.trim() || "Regra definida pelo MdJ",
        },
      ]);
      setTextoRegra("");
    }
  };

  return (
    <div className="space-y-2.5">
<<<<<<< Updated upstream
      <span className="block text-xs font-black uppercase tracking-wider text-black/70">
=======
      <span className="block text-[11px] font-black uppercase tracking-wider text-black/70">
>>>>>>> Stashed changes
        Efeitos / modificadores (opcional)
      </span>
      {efeitos.map((e, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: lista local editável
          key={i}
          className="flex items-center justify-between text-xs px-2.5 py-1.5 border-2 border-black bg-white text-black font-semibold shadow-[1px_1px_0px_#000]"
        >
          <span>{descreverEfeito(e)}</span>
          <button
            type="button"
            aria-label="Remover efeito"
            onClick={() => onChange(efeitos.filter((_, j) => j !== i))}
            className="cursor-pointer text-black/60 hover:text-red-700 transition-colors p-0.5"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as typeof tipo)}
          className={classeControle}
          aria-label="Tipo de efeito"
        >
          <option value="modificador" className="bg-white text-black font-bold">Modificador de atributo</option>
          <option value="palavra" className="bg-white text-black font-bold">Conceder palavra-chave</option>
          <option value="resistencia" className="bg-white text-black font-bold">Resistência / vulnerabilidade</option>
          <option value="regra" className="bg-white text-black font-bold">Regra especial</option>
        </select>
        {tipo === "modificador" && (
          <>
            <select
              value={alvo}
              onChange={(e) => setAlvo(e.target.value as AlvoAtributoCalafrio)}
              className={classeControle}
            >
              {ALVOS.map((a) => (
                <option key={a.id} value={a.id} className="bg-white text-black font-bold">
                  {a.rotulo}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={valor}
              onChange={(e) => setValor(Number(e.target.value))}
              className={`w-16 ${classeControle}`}
              aria-label="Valor do modificador"
            />
            <input
              type="text"
              value={condicao}
              onChange={(e) => setCondicao(e.target.value)}
              placeholder="Condição (opcional)"
              className={`flex-1 min-w-[130px] ${classeControle} placeholder:text-black/40 font-medium`}
            />
          </>
        )}
        {tipo === "palavra" && (
          <input
            type="text"
            value={nomePalavra}
            onChange={(e) => setNomePalavra(e.target.value)}
            placeholder="Nome da palavra-chave concedida"
            className={`flex-1 min-w-[160px] ${classeControle} placeholder:text-black/40 font-medium`}
          />
        )}
        {tipo === "resistencia" && (
          <>
            <select
              value={espectro}
              onChange={(e) => setEspectro(e.target.value as EspectroDeDano)}
              className={classeControle}
            >
              {ESPECTROS.map((x) => (
                <option key={x} value={x} className="bg-white text-black font-bold">
                  {x}
                </option>
              ))}
            </select>
            <select
              value={grau}
              onChange={(e) => setGrau(e.target.value as typeof grau)}
              className={classeControle}
            >
              <option value="resistente" className="bg-white text-black font-bold">Resistente</option>
              <option value="vulneravel" className="bg-white text-black font-bold">Vulnerável</option>
              <option value="imune" className="bg-white text-black font-bold">Imune</option>
            </select>
          </>
        )}
        {tipo === "regra" && (
          <>
            <select
              value={regra}
              onChange={(e) => setRegra(e.target.value as RegraEspecialId)}
              className={classeControle}
            >
              <option value="customizada" className="bg-white text-black font-bold">Customizada</option>
              <option value="permitirDominioMisto" className="bg-white text-black font-bold">Domínio misto</option>
              <option value="pvUnificadoComPa" className="bg-white text-black font-bold">PV e PA unificados</option>
              <option value="habilidadeUnicaContaParaAlinhamento" className="bg-white text-black font-bold">
                Única conta p/ alinhamento
              </option>
            </select>
            <input
              type="text"
              value={textoRegra}
              onChange={(e) => setTextoRegra(e.target.value)}
              placeholder="Descrição da regra"
              className={`flex-1 min-w-[140px] ${classeControle} placeholder:text-black/40 font-medium`}
            />
          </>
        )}
        <button
          type="button"
          onClick={adicionar}
          className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-black uppercase border-2 border-black bg-black text-white hover:bg-black/85 cursor-pointer shadow-[2px_2px_0px_#000] active:scale-95 transition-all"
        >
          <Plus className="size-3.5" strokeWidth={3} /> Efeito
        </button>
      </div>
    </div>
  );
}
