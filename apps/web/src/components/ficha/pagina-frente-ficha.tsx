"use client";

import type {
  FichaCalafrio,
  FichaDerivadaCalafrio,
  ItemNaFichaCalafrio,
  PalavraChaveNaFicha,
} from "@calafrio/core";
import {
  LinhaVital,
  NumeroEditavel,
  NumeroFixo,
  VitalAtualMaximo,
} from "./papel/campo-vital";
import { FolhaPapel } from "./papel/folha-papel";
import { InventarioPapel } from "./papel/inventario-papel";
import { PalavrasChavePapel } from "./papel/palavras-chave-papel";
import {
  BotaoPassoPapel,
  CampoPapel,
  EtiquetaPapel,
  Losango,
  PontilhadoVertical,
  Posicionado,
  RodapePapel,
} from "./papel/primitivos-papel";
import { RetratoPapel } from "./papel/retrato-papel";
import { u } from "./papel/unidades";

interface PaginaFrenteFichaProps {
  ficha: FichaCalafrio;
  derivada: FichaDerivadaCalafrio;
  onDefinirNome: (nome: string) => void;
  onDefinirApt: (apt: number) => void;
  onDefinirRetrato: (url: string) => void;
  onDefinirPvAtual: (valor: number) => void;
  onDefinirPaAtual: (valor: number) => void;
  onAdicionarPalavraChave: (palavra: PalavraChaveNaFicha) => void;
  onRemoverPalavraChave: (id: string) => void;
  onAdicionarItem: (item: ItemNaFichaCalafrio) => void;
  onAlternarEquipado: (id: string) => void;
  onRemoverItem: (id: string) => void;
  onAtualizarCarteira: (fundos: number, espirions: number) => void;
  onAbrirRolagem: (nome?: string) => void;
}

function CampoCarteira({
  y,
  rotulo,
  valor,
  onChange,
}: {
  y: number;
  rotulo: string;
  valor: number;
  onChange: (n: number) => void;
}) {
  return (
    <>
      <CampoPapel area={{ x: 40, y, w: 112, h: 32 }}>
        <input
          type="number"
          min={0}
          value={valor}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          style={{ fontSize: u(15), paddingLeft: u(60) }}
        />
      </CampoPapel>
      <EtiquetaPapel area={{ x: 26, y, w: 68, h: 32 }} tamanho={14}>
        <strong className="font-semibold">{rotulo}</strong>
      </EtiquetaPapel>
    </>
  );
}

export function PaginaFrenteFicha({
  ficha,
  derivada,
  onDefinirNome,
  onDefinirApt,
  onDefinirRetrato,
  onDefinirPvAtual,
  onDefinirPaAtual,
  onAdicionarPalavraChave,
  onRemoverPalavraChave,
  onAdicionarItem,
  onAlternarEquipado,
  onRemoverItem,
  onAtualizarCarteira,
  onAbrirRolagem,
}: PaginaFrenteFichaProps) {
  return (
    <FolhaPapel>
      {/* Logo vertical */}
      <Posicionado area={{ x: 16, y: 30, w: 28, h: 130 }}>
        {/* biome-ignore lint/performance/noImgElement: logo estático */}
        <img
          src="/assets/Calafrio.svg"
          alt="Calafrio TTRPG"
          className="absolute left-0 max-w-none"
          style={{
            top: "100%",
            width: u(130),
            height: u(23.5),
            transformOrigin: "top left",
            transform: "rotate(-90deg)",
          }}
        />
      </Posicionado>

      <RetratoPapel
        retratoUrl={ficha.retratoUrl}
        onDefinir={onDefinirRetrato}
      />

      {/* Nome */}
      <Posicionado
        area={{ x: 158, y: 28, w: 272, h: 35 }}
        className="bg-white"
        style={{ boxShadow: "0 0 3px rgba(0,0,0,0.3)" }}
      >
        <input
          value={ficha.nome}
          onChange={(e) => onDefinirNome(e.target.value)}
          placeholder="Nome do player"
          className="size-full bg-transparent font-semibold outline-none placeholder:font-normal placeholder:text-black/20"
          style={{ fontSize: u(19), paddingLeft: u(10), paddingBottom: u(8) }}
        />
      </Posicionado>
      <Posicionado
        area={{ x: 157, y: 61, w: 274, h: 3 }}
        className="bg-black"
      />
      <Posicionado
        area={{ x: 330, y: 47, w: 96, h: 12 }}
        className="text-right uppercase italic"
        style={{ fontSize: u(7.5) }}
      >
        Nome
      </Posicionado>
      <Losango cx={433} cy={62} lado={11} />
      <PontilhadoVertical x={434} y={72} altura={245} />

      {/* Vitais */}
      <LinhaVital
        indice={0}
        rotulo={
          <>
            Aptidão{" "}
            <strong className="ml-[0.5cqw] font-extrabold">(APT)</strong>:
          </>
        }
        legenda="= Concedido pelo MdJ"
      >
        <div
          className="flex size-full items-center justify-between"
          style={{ paddingLeft: u(8), paddingRight: u(22) }}
        >
          <BotaoPassoPapel
            sentido="menos"
            titulo="Diminuir APT"
            onClick={() => onDefinirApt(ficha.aptBase - 1)}
          />
          <div style={{ width: u(60) }}>
            <NumeroEditavel
              valor={ficha.aptBase}
              min={1}
              onChange={onDefinirApt}
              titulo="Aptidão"
            />
          </div>
          <BotaoPassoPapel
            sentido="mais"
            titulo="Aumentar APT"
            onClick={() => onDefinirApt(ficha.aptBase + 1)}
          />
        </div>
      </LinhaVital>
      <LinhaVital
        indice={1}
        rotulo={
          <>
            Defesa <strong className="ml-[0.5cqw] font-extrabold">(PD)</strong>:
          </>
        }
        legenda="= 3*APT"
      >
        <NumeroFixo>{derivada.pd}</NumeroFixo>
      </LinhaVital>
      <LinhaVital
        indice={2}
        rotulo={
          <>
            Vida <strong className="ml-[0.5cqw] font-extrabold">(PV)</strong>:
          </>
        }
        legenda="= 3 + 3*APT"
      >
        <VitalAtualMaximo
          atual={derivada.pvAtual}
          maximo={derivada.pvMax}
          onAtual={onDefinirPvAtual}
          titulo="PV atual"
        />
      </LinhaVital>
      <LinhaVital
        indice={3}
        rotulo={
          <>
            Ânimum <strong className="ml-[0.5cqw] font-extrabold">(PA)</strong>:
          </>
        }
        legenda="= 3 + 3*APT"
      >
        <VitalAtualMaximo
          atual={derivada.paAtual}
          maximo={derivada.paMax}
          onAtual={onDefinirPaAtual}
          titulo="PA atual"
        />
      </LinhaVital>
      <LinhaVital
        indice={4}
        rotulo="Velocidade:"
        legenda="= 6 + Bônus diversos"
      >
        <NumeroFixo>{derivada.velocidade}</NumeroFixo>
      </LinhaVital>
      <LinhaVital indice={5} rotulo="Ecos:" legenda="= APT">
        <NumeroFixo>
          {derivada.ecosDisponiveis}
          <span className="text-black/50" style={{ fontSize: u(12) }}>
            {" "}
            / {derivada.ecosMax}
          </span>
        </NumeroFixo>
      </LinhaVital>

      {/* Carteira */}
      <EtiquetaPapel area={{ x: 8, y: 187, w: 118, h: 28 }} tamanho={13.5}>
        Carteira
      </EtiquetaPapel>
      <PontilhadoVertical x={16} y={225} altura={88} />
      <CampoCarteira
        y={229}
        rotulo="F$:"
        valor={ficha.carteira.fundos}
        onChange={(n) => onAtualizarCarteira(n, ficha.carteira.espirions)}
      />
      <CampoCarteira
        y={272}
        rotulo="E$P:"
        valor={ficha.carteira.espirions}
        onChange={(n) => onAtualizarCarteira(ficha.carteira.fundos, n)}
      />

      <PalavrasChavePapel
        derivada={derivada}
        onAdicionar={onAdicionarPalavraChave}
        onRemover={onRemoverPalavraChave}
        onRolar={onAbrirRolagem}
      />

      <InventarioPapel
        inventario={ficha.inventario}
        onAdicionar={onAdicionarItem}
        onAlternarEquipado={onAlternarEquipado}
        onRemover={onRemoverItem}
      />

      <RodapePapel />
    </FolhaPapel>
  );
}
