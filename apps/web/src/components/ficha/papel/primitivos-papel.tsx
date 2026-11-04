import type { CSSProperties, ReactNode } from "react";
import { estiloRetangulo, type Retangulo, u } from "./unidades";

const PONTA = 12;

const FORMA_ETIQUETA = `polygon(${u(PONTA)} 0, calc(100% - ${u(PONTA)}) 0, 100% 50%, calc(100% - ${u(PONTA)}) 100%, ${u(PONTA)} 100%, 0 50%)`;
const FORMA_CAMPO = `polygon(0 0, calc(100% - ${u(PONTA)}) 0, 100% 50%, calc(100% - ${u(PONTA)}) 100%, 0 100%)`;

export function Posicionado({
  area,
  className,
  style,
  children,
}: {
  area: Retangulo;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div className={className} style={{ ...estiloRetangulo(area), ...style }}>
      {children}
    </div>
  );
}

/** Etiqueta preta hexagonal com texto branco ("Aptidão (APT):", "Carteira"...). */
export function EtiquetaPapel({
  area,
  children,
  tamanho = 12.5,
}: {
  area: Retangulo;
  children: ReactNode;
  tamanho?: number;
}) {
  return (
    <Posicionado
      area={area}
      className="flex items-center justify-center bg-black text-white"
      style={{ clipPath: FORMA_ETIQUETA, fontSize: u(tamanho) }}
    >
      <span className="leading-none">{children}</span>
    </Posicionado>
  );
}

/** Campo claro com sombra suave e ponta à direita, onde o jogador "escreve". */
export function CampoPapel({
  area,
  legenda,
  children,
}: {
  area: Retangulo;
  legenda?: string;
  children?: ReactNode;
}) {
  return (
    <Posicionado
      area={area}
      style={{ filter: "drop-shadow(0 0 1px rgba(0,0,0,0.45))" }}
    >
      <div
        className="relative size-full bg-white"
        style={{ clipPath: FORMA_CAMPO }}
      >
        <div className="absolute inset-0 flex items-center">{children}</div>
        {legenda && (
          <span
            className="absolute uppercase italic text-black/80"
            style={{ right: u(PONTA + 4), bottom: u(3), fontSize: u(6) }}
          >
            {legenda}
          </span>
        )}
      </div>
    </Posicionado>
  );
}

export function PontilhadoVertical({
  x,
  y,
  altura,
}: {
  x: number;
  y: number;
  altura: number;
}) {
  return (
    <Posicionado
      area={{ x: x - 1.5, y, w: 3, h: altura }}
      style={{
        backgroundImage: "radial-gradient(circle, #555 45%, transparent 50%)",
        backgroundSize: `${u(3)} ${u(5)}`,
      }}
    />
  );
}

export function Losango({
  cx,
  cy,
  lado = 10,
}: {
  cx: number;
  cy: number;
  lado?: number;
}) {
  return (
    <Posicionado
      area={{ x: cx - lado / 2, y: cy - lado / 2, w: lado, h: lado }}
      className="border-black bg-white"
      style={{
        transform: "rotate(45deg)",
        borderWidth: u(2),
        borderStyle: "solid",
      }}
    />
  );
}

/** Linha de cabeçalho com ponta de seta (recorte da direita do divider.svg). */
export function LinhaSeta({ area }: { area: Retangulo }) {
  return (
    <Posicionado area={area} className="overflow-hidden">
      {/* biome-ignore lint/performance/noImgElement: SVG estático do papel */}
      <img
        src="/assets/divider.svg"
        alt=""
        className="absolute right-0 top-0 h-full w-auto max-w-none"
      />
    </Posicionado>
  );
}

export function RodapePapel() {
  return (
    <Posicionado area={{ x: 0, y: 903, w: 662, h: 24 }}>
      {/* biome-ignore lint/performance/noImgElement: SVG estático do papel */}
      <img
        src="/assets/pattern.svg"
        alt=""
        className="size-full object-fill"
        draggable={false}
      />
    </Posicionado>
  );
}

export function CaixaMoldura({ area }: { area: Retangulo }) {
  return (
    <Posicionado
      area={area}
      className="border-black bg-white"
      style={{ borderWidth: u(2.2), borderStyle: "solid" }}
    />
  );
}
