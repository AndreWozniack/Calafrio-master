"use client";

import type {
  AlocacaoSlotMatriz,
  CatalogoCalafrio,
  HabilidadeUnicaCalafrio,
} from "@calafrio/core";
import { TOKENS_PERSONALIDADE } from "@calafrio/tema";
import { Lock, Plus, X } from "lucide-react";
import { Posicionado } from "./primitivos-papel";
import { u } from "./unidades";

export const COLUNAS_X = [22, 236, 444];
export const LINHAS_Y = [78, 267, 457];
const LARGURA = 195;
const ALTURA = 172;
const PASSO_LINHA = 14.6;
const PRIMEIRA_LINHA = 79;

interface DadosSlot {
  nome: string;
  tipoAcao: string;
  custo: string;
  descricao: string;
  cor?: string;
  requerFoco: "sim" | "condicional" | "nao";
  id?: string;
}

function dadosDoSlot(
  alocacao: AlocacaoSlotMatriz | undefined,
  catalogo: CatalogoCalafrio,
  unicas: HabilidadeUnicaCalafrio[],
): DadosSlot | null {
  if (!alocacao) return null;
  if (alocacao.tipo === "unica") {
    const unica = unicas.find((x) => x.id === alocacao.id);
    if (!unica) return null;
    const token = unica.personalidadeAlinhamento
      ? TOKENS_PERSONALIDADE[unica.personalidadeAlinhamento]
      : undefined;
    return {
      nome: unica.nome,
      tipoAcao: unica.tipoAcao,
      custo: `${unica.custo} ${unica.recurso.toUpperCase()}`,
      descricao: unica.descricao,
      cor: token?.corPositiva,
      requerFoco: unica.requerFoco ? "sim" : "nao",
      id: unica.id,
    };
  }
  const hab = catalogo.habilidadesParanormais.find((h) => h.id === alocacao.id);
  if (!hab) return null;
  const token = TOKENS_PERSONALIDADE[hab.personalidade];
  return {
    nome: hab.nome,
    tipoAcao: hab.tipoAcao,
    custo: hab.custoPA === 0 ? "passiva" : `${hab.custoPA} PA`,
    descricao: hab.descricao,
    cor: hab.dominio === "positivo" ? token.corPositiva : token.corNegativa,
    requerFoco: hab.requerFoco,
    id: hab.id,
  };
}

export function SlotHabilidadePapel({
  numero,
  alocacao,
  catalogo,
  habilidadesUnicas,
  destacado,
  focoAtivo,
  onSelecionar,
  onLimpar,
  onAlternarFoco,
}: {
  numero: number;
  alocacao?: AlocacaoSlotMatriz;
  catalogo: CatalogoCalafrio;
  habilidadesUnicas: HabilidadeUnicaCalafrio[];
  destacado: boolean;
  focoAtivo: boolean;
  onSelecionar: (slot: number) => void;
  onLimpar: (slot: number) => void;
  onAlternarFoco?: (id: string) => void;
}) {
  const x = COLUNAS_X[numero % 3];
  const y = LINHAS_Y[Math.floor(numero / 3)];
  const dados = dadosDoSlot(alocacao, catalogo, habilidadesUnicas);
  const recorte = `polygon(0 0, calc(100% - ${u(14)}) 0, 100% ${u(14)}, 100% 100%, 0 100%)`;

  return (
    <>
      <Posicionado
        area={{ x, y, w: LARGURA, h: ALTURA }}
        className="group"
        style={{
          filter: destacado
            ? "drop-shadow(0 0 0.5cqw rgba(0,0,0,0.9))"
            : "drop-shadow(0 0 1px rgba(0,0,0,0.4))",
        }}
      >
        <div className="size-full bg-[#f4f4f2]" style={{ clipPath: recorte }} />
        <button
          type="button"
          onClick={() => onSelecionar(numero)}
          title={dados ? dados.nome : "Escolher habilidade"}
          className="absolute inset-0 cursor-pointer"
          aria-label={`Slot ${numero + 1}`}
        />

        {/* linha do título */}
        <div
          className="pointer-events-none absolute bg-black/35"
          style={{ left: u(22), top: u(49), width: u(100), height: u(1) }}
        />
        {dados && (
          <div
            className="pointer-events-none absolute flex items-end gap-[0.6cqw] truncate font-extrabold leading-none"
            style={{
              left: u(22),
              top: u(30),
              width: u(112),
              height: u(18),
              fontSize: u(13.5),
            }}
          >
            {dados.cor && (
              <span
                className="mb-[0.3cqw] inline-block shrink-0 rotate-45"
                style={{
                  width: u(6),
                  height: u(6),
                  backgroundColor: dados.cor,
                  border: "1px solid black",
                }}
              />
            )}
            <span className="truncate">{dados.nome}</span>
          </div>
        )}
        {dados && (
          <div
            className="pointer-events-none absolute font-bold uppercase italic text-black/85"
            style={{ left: u(22), top: u(50), fontSize: u(8.2) }}
          >
            {dados.tipoAcao} · {dados.custo}
          </div>
        )}

        {/* linhas pautadas / descrição */}
        <div
          className="pointer-events-none absolute overflow-hidden"
          style={{
            left: u(22),
            top: u(PRIMEIRA_LINHA - PASSO_LINHA),
            width: u(160),
            height: u(PASSO_LINHA * 6),
            backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent calc(${u(PASSO_LINHA)} - 1px), rgba(0,0,0,0.28) calc(${u(PASSO_LINHA)} - 1px), rgba(0,0,0,0.28) ${u(PASSO_LINHA)})`,
            fontSize: u(10.5),
            lineHeight: u(PASSO_LINHA),
            fontWeight: 600,
          }}
        >
          {dados?.descricao}
        </div>
        {!dados && (
          <div
            className="pointer-events-none absolute flex items-center font-bold text-black/50 transition-colors group-hover:text-black"
            style={{ left: u(22), top: u(59), gap: u(4), fontSize: u(12) }}
          >
            <Plus style={{ width: u(12), height: u(12) }} strokeWidth={3} />
            Escolher habilidade
          </div>
        )}

        {/* cadeado (Foco) */}
        <FocoCadeado
          requer={dados?.requerFoco ?? "nao"}
          preenchido={Boolean(dados)}
          ativo={focoAtivo}
          onClick={() => dados?.id && onAlternarFoco?.(dados.id)}
        />

        {dados && (
          <button
            type="button"
            title="Limpar slot"
            onClick={() => onLimpar(numero)}
            className="absolute z-10 cursor-pointer text-black/40 hover:text-red-700"
            style={{ right: u(8), bottom: u(6) }}
          >
            <X style={{ width: u(11), height: u(11) }} />
          </button>
        )}
      </Posicionado>

      {/* aba preta #n */}
      <Posicionado
        area={{ x, y: y + 2, w: 58, h: 28 }}
        className="flex items-center justify-center bg-black font-extrabold text-white"
        style={{
          clipPath: `polygon(0 0, calc(100% - ${u(12)}) 0, 100% 50%, calc(100% - ${u(12)}) 100%, 0 100%)`,
          fontSize: u(13),
          paddingRight: u(8),
        }}
      >
        #{numero + 1}
      </Posicionado>
    </>
  );
}

function FocoCadeado({
  requer,
  preenchido,
  ativo,
  onClick,
}: {
  requer: DadosSlot["requerFoco"];
  preenchido: boolean;
  ativo: boolean;
  onClick: () => void;
}) {
  const interativo = preenchido && requer !== "nao";
  return (
    <>
      <div
        className="absolute bg-black"
        style={{ right: u(17), top: u(48), width: u(12), height: u(2) }}
      />
      <button
        type="button"
        onClick={interativo ? onClick : undefined}
        disabled={!interativo}
        title={
          requer === "nao"
            ? "Sem Foco"
            : ativo
              ? "Foco ativo (clique para soltar)"
              : "Requer Foco (clique para ativar)"
        }
        className={`absolute z-10 flex items-center justify-center gap-[0.2cqw] rounded-full font-extrabold ${
          interativo ? "cursor-pointer" : "cursor-default"
        } ${ativo ? "bg-amber-400 text-black" : "bg-black text-white"} ${
          preenchido && requer === "nao" ? "opacity-25" : ""
        }`}
        style={{
          right: u(27),
          top: u(40),
          width: u(28),
          height: u(17),
          fontSize: u(10),
        }}
      >
        <Lock style={{ width: u(9), height: u(9) }} />
        {requer !== "sim" ? "?" : ""}
      </button>
      <div className="absolute" style={{ right: u(8), top: u(44) }}>
        <svg
          viewBox="0 0 10 10"
          style={{ width: u(10), height: u(10) }}
          aria-hidden="true"
        >
          <polygon
            points="5,0.8 9.2,5 5,9.2 0.8,5"
            fill="white"
            stroke="black"
            strokeWidth="1.4"
          />
        </svg>
      </div>
    </>
  );
}
