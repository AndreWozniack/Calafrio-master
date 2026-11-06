"use client";

import type { AtributosV1, FichaDerivadaV1 } from "@calafrio/core";
import { Minus, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { NumeroFixo } from "../papel/campo-vital";
import {
  CampoPapel,
  EtiquetaPapel,
  PontilhadoVertical,
  Posicionado,
} from "../papel/primitivos-papel";
import { u } from "../papel/unidades";

type ChaveAtributo = keyof AtributosV1;

/** Botão branco sobre a faixa preta do atributo (inverso do BotaoPassoPapel). */
function BotaoFaixa({
  sentido,
  titulo,
  desabilitado,
  onClick,
}: {
  sentido: "mais" | "menos";
  titulo: string;
  desabilitado: boolean;
  onClick: () => void;
}) {
  const Icone = sentido === "mais" ? Plus : Minus;
  return (
    <button
      type="button"
      title={titulo}
      aria-label={titulo}
      disabled={desabilitado}
      onClick={onClick}
      className="flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
      style={{ width: u(17), height: u(17) }}
    >
      <Icone style={{ width: u(11), height: u(11) }} strokeWidth={3} />
    </button>
  );
}

function BlocoAtributo({
  y,
  nome,
  valor,
  bonus,
  derivadoRotulo,
  derivadoLegenda,
  derivado,
  podeAumentar,
  onMudar,
}: {
  y: number;
  nome: string;
  valor: number;
  bonus: string;
  derivadoRotulo: ReactNode;
  derivadoLegenda: string;
  derivado: ReactNode;
  podeAumentar: boolean;
  onMudar: (valor: number) => void;
}) {
  return (
    <>
      {/* Faixa preta com o nome do atributo */}
      <Posicionado
        area={{ x: 470, y: y + 10, w: 178, h: 34 }}
        className="flex items-center justify-end bg-black text-white"
        style={{
          clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, ${u(10)} 50%)`,
          paddingRight: u(8),
          gap: u(6),
        }}
      >
        <span
          className="flex-1 text-center font-extrabold"
          style={{ fontSize: u(20), paddingLeft: u(18) }}
        >
          {nome}
        </span>
        <BotaoFaixa
          sentido="menos"
          titulo={`Diminuir ${nome}`}
          desabilitado={valor <= 1}
          onClick={() => onMudar(valor - 1)}
        />
        <BotaoFaixa
          sentido="mais"
          titulo={podeAumentar ? `Aumentar ${nome}` : "Sem pontos livres"}
          desabilitado={!podeAumentar}
          onClick={() => onMudar(valor + 1)}
        />
      </Posicionado>

      {/* Círculo com o valor */}
      <Posicionado
        area={{ x: 431, y, w: 52, h: 52 }}
        className="flex items-center justify-center rounded-full bg-white"
        style={{ border: `${u(3)} solid black` }}
      >
        <span
          key={valor}
          className="valor-pulso font-extrabold"
          style={{ fontSize: u(24) }}
        >
          {valor}
        </span>
      </Posicionado>
      <Posicionado
        area={{ x: 470, y: y + 48, w: 178, h: 10 }}
        className="text-right uppercase italic"
        style={{ fontSize: u(6.8) }}
      >
        {bonus}
      </Posicionado>

      <PontilhadoVertical x={446} y={y + 56} altura={46} />

      {/* Valor derivado (PD, PM, PA) */}
      <CampoPapel area={{ x: 540, y: y + 65, w: 108, h: 28 }}>
        <div
          className="flex w-full"
          style={{ paddingLeft: u(24), paddingRight: u(14) }}
        >
          {derivado}
        </div>
      </CampoPapel>
      <Posicionado
        area={{ x: 540, y: y + 94, w: 104, h: 9 }}
        className="text-right uppercase italic"
        style={{ fontSize: u(6.5) }}
      >
        {derivadoLegenda}
      </Posicionado>
      <EtiquetaPapel area={{ x: 465, y: y + 65, w: 98, h: 28 }} tamanho={13}>
        {derivadoRotulo}
      </EtiquetaPapel>
    </>
  );
}

export function TriadePapelV1({
  atributos,
  derivada,
  onDefinirAtributo,
}: {
  atributos: AtributosV1;
  derivada: FichaDerivadaV1;
  onDefinirAtributo: (atributo: ChaveAtributo, valor: number) => void;
}) {
  const soma = atributos.corpo + atributos.mente + atributos.alma;
  const podeAumentar = soma < derivada.pontosAtributoEsperados;

  const rotulo = (texto: string, sigla: string) => (
    <>
      {texto} <strong className="ml-[0.5cqw] font-extrabold">({sigla})</strong>:
    </>
  );

  return (
    <>
      <Posicionado
        area={{ x: 447, y: 104, w: 201, h: 12 }}
        className={`text-right uppercase italic ${
          podeAumentar ? "font-extrabold" : ""
        }`}
        style={{ fontSize: u(7.2) }}
      >
        Pontos de atributo: {soma} / {derivada.pontosAtributoEsperados} (3 +
        Nível)
      </Posicionado>

      <BlocoAtributo
        y={132}
        nome="Corpo"
        valor={atributos.corpo}
        bonus="+3 PD por nível atribuído"
        derivadoRotulo={rotulo("Defesa", "PD")}
        derivadoLegenda="= 3 + (Corpo × 3)"
        derivado={<NumeroFixo>{derivada.pd}</NumeroFixo>}
        podeAumentar={podeAumentar}
        onMudar={(v) => onDefinirAtributo("corpo", v)}
      />
      <BlocoAtributo
        y={250}
        nome="Mente"
        valor={atributos.mente}
        bonus="+6 PM por nível atribuído"
        derivadoRotulo={rotulo("Memória", "PM")}
        derivadoLegenda="= Mente × 6"
        derivado={
          <NumeroFixo>
            {derivada.pmGasto}
            <span className="font-light" style={{ fontSize: u(16) }}>
              {" "}
              /{" "}
            </span>
            {derivada.pmMax}
          </NumeroFixo>
        }
        podeAumentar={podeAumentar}
        onMudar={(v) => onDefinirAtributo("mente", v)}
      />
      <BlocoAtributo
        y={368}
        nome="Alma"
        valor={atributos.alma}
        bonus="+9 PA por nível atribuído"
        derivadoRotulo={rotulo("Ânimum", "PA")}
        derivadoLegenda="= Alma × 9"
        derivado={<NumeroFixo>{derivada.paMax}</NumeroFixo>}
        podeAumentar={podeAumentar}
        onMudar={(v) => onDefinirAtributo("alma", v)}
      />
    </>
  );
}
