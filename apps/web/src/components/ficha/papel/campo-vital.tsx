"use client";

import { BotaoPassoPapel, CampoPapel, EtiquetaPapel } from "./primitivos-papel";
import { u } from "./unidades";

const X_ETIQUETA = 165;
const LARGURA_ETIQUETA = 107;
const X_CAMPO = 266;
const LARGURA_CAMPO = 154;
const ALTURA = 35;
export const Y_LINHA_INICIAL = 78;
const PASSO = 43.4;

const classeEntrada =
  "w-full bg-transparent text-center font-extrabold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

export function LinhaVital({
  indice,
  rotulo,
  legenda,
  children,
}: {
  indice: number;
  rotulo: React.ReactNode;
  legenda: string;
  children: React.ReactNode;
}) {
  const y = Y_LINHA_INICIAL + indice * PASSO;
  return (
    <>
      <CampoPapel
        area={{ x: X_CAMPO, y, w: LARGURA_CAMPO, h: ALTURA }}
        legenda={legenda}
      >
        {children}
      </CampoPapel>
      <EtiquetaPapel
        area={{ x: X_ETIQUETA, y, w: LARGURA_ETIQUETA, h: ALTURA }}
      >
        {rotulo}
      </EtiquetaPapel>
    </>
  );
}

export function NumeroEditavel({
  valor,
  onChange,
  min,
  titulo,
}: {
  valor: number;
  onChange: (n: number) => void;
  min?: number;
  titulo?: string;
}) {
  return (
    <input
      type="number"
      value={valor}
      min={min}
      title={titulo}
      onChange={(e) => onChange(Number(e.target.value))}
      className={classeEntrada}
      style={{ fontSize: u(20) }}
    />
  );
}

export function NumeroFixo({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="w-full text-center font-extrabold"
      style={{ fontSize: u(20) }}
    >
      <span key={String(Array.isArray(children) ? children[0] : children)} className="valor-pulso">
        {children}
      </span>
    </span>
  );
}

export function VitalAtualMaximo({
  atual,
  maximo,
  onAtual,
  titulo,
}: {
  atual: number;
  maximo: number;
  onAtual: (n: number) => void;
  titulo: string;
}) {
  return (
    <div
      className="flex size-full items-center justify-between"
      style={{ paddingLeft: u(8), paddingRight: u(22), fontSize: u(20) }}
    >
      <BotaoPassoPapel
        sentido="menos"
        titulo={`Diminuir ${titulo}`}
        onClick={() => onAtual(atual - 1)}
      />
      <div className="flex items-center font-extrabold">
        <input
          type="number"
          value={atual}
          min={0}
          title={titulo}
          onChange={(e) => onAtual(Number(e.target.value))}
          className={`${classeEntrada} text-right`}
          style={{ fontSize: u(20), width: u(36) }}
        />
        <span className="px-[0.5cqw] font-light" style={{ fontSize: u(24) }}>
          /
        </span>
        <span style={{ minWidth: u(30) }}>{maximo}</span>
      </div>
      <BotaoPassoPapel
        sentido="mais"
        titulo={`Aumentar ${titulo}`}
        onClick={() => onAtual(atual + 1)}
      />
    </div>
  );
}
