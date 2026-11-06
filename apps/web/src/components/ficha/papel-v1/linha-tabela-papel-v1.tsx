"use client";

import type { AprimoramentoV1 } from "@calafrio/core";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { u } from "../papel/unidades";

export const ALTURA_LINHA = 31;
export const LINHAS_MINIMAS = 10;

/** Losango de "Aprimorar" do papel: vazio, preenchido (aprimorado) ou inativo. */
export function LosangoAprimorar({
  aprimoramento,
  semEco,
  inativo,
  onAprimorar,
  onRemover,
}: {
  aprimoramento?: AprimoramentoV1;
  semEco: boolean;
  inativo?: boolean;
  onAprimorar: () => void;
  onRemover: () => void;
}) {
  const tem = !!aprimoramento;
  const bloqueado = inativo || (!tem && semEco);
  const titulo = inativo
    ? "Grau 0 não recebe aprimoramento"
    : tem
      ? `${aprimoramento.descricao} (clique para remover)`
      : semEco
        ? "Sem EP livre"
        : "Aprimorar (+1 EP)";
  return (
    <button
      type="button"
      title={titulo}
      aria-label={titulo}
      disabled={bloqueado}
      onClick={tem ? onRemover : onAprimorar}
      className={`shrink-0 rotate-45 cursor-pointer border-solid border-black transition-colors disabled:cursor-not-allowed ${
        tem ? "bg-black" : "bg-white hover:bg-black/25"
      } ${bloqueado ? "opacity-30" : ""}`}
      style={{ width: u(10), height: u(10), borderWidth: u(2) }}
    />
  );
}

/** Uma linha listrada da tabela do verso. */
export function LinhaTabela({
  indice,
  invalida,
  children,
}: {
  indice: number;
  invalida?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={`group relative flex shrink-0 items-center ${
        invalida
          ? "bg-red-100"
          : indice % 2 === 1
            ? "bg-[#efefed]"
            : "bg-transparent"
      }`}
      style={{ height: u(ALTURA_LINHA), gap: u(8), paddingLeft: u(10) }}
    >
      {children}
    </div>
  );
}

export function Coluna({
  largura,
  children,
  className = "",
  sublinhar = true,
}: {
  largura?: number;
  children?: ReactNode;
  className?: string;
  sublinhar?: boolean;
}) {
  return (
    <div
      className={`flex h-[70%] min-w-0 items-end ${largura ? "shrink-0" : "flex-1"} ${className}`}
      style={{
        width: largura ? u(largura) : undefined,
        borderBottom: sublinhar ? "1px solid rgba(0,0,0,0.35)" : undefined,
        paddingBottom: u(2),
      }}
    >
      {children}
    </div>
  );
}

export function BotaoRemoverLinha({
  titulo,
  onClick,
}: {
  titulo: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={titulo}
      aria-label={titulo}
      onClick={onClick}
      className="shrink-0 cursor-pointer text-black/25 opacity-0 transition-opacity hover:text-red-700 focus:opacity-100 group-hover:opacity-100"
      style={{ marginRight: u(8) }}
    >
      <X style={{ width: u(11), height: u(11) }} strokeWidth={3} />
    </button>
  );
}

/** Cabeçalho em itálico caixa-alta das colunas ("APRIMORAR", "GRAU"...). */
export function CabecalhoColuna({
  largura,
  children,
  alinhar = "left",
}: {
  largura?: number;
  children: ReactNode;
  alinhar?: "left" | "center";
}) {
  return (
    <span
      className={`uppercase italic ${largura ? "shrink-0" : "flex-1"} ${
        alinhar === "center" ? "text-center" : ""
      }`}
      style={{ width: largura ? u(largura) : undefined, fontSize: u(7) }}
    >
      {children}
    </span>
  );
}
