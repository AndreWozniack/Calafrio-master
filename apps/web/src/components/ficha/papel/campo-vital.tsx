"use client";

import { CampoPapel, EtiquetaPapel } from "./primitivos-papel";
import { u } from "./unidades";

const X_ETIQUETA = 165;
const LARGURA_ETIQUETA = 107;
const X_CAMPO = 266;
const LARGURA_CAMPO = 154;
const ALTURA = 35;
export const Y_LINHA_INICIAL = 78;
const PASSO = 43.4;

const classeEntrada =
  "w-full bg-transparent text-center font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

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
      style={{ fontSize: u(17) }}
    />
  );
}

export function NumeroFixo({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="w-full text-center font-semibold"
      style={{ fontSize: u(17) }}
    >
      {children}
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
    <div className="flex size-full items-center" style={{ fontSize: u(17) }}>
      <div style={{ width: u(66) }}>
        <input
          type="number"
          value={atual}
          min={0}
          title={titulo}
          onChange={(e) => onAtual(Number(e.target.value))}
          className={`${classeEntrada} text-right`}
          style={{ fontSize: u(17) }}
        />
      </div>
      <span className="px-[0.6cqw] font-light" style={{ fontSize: u(22) }}>
        /
      </span>
      <span className="font-semibold" style={{ minWidth: u(40) }}>
        {maximo}
      </span>
    </div>
  );
}
