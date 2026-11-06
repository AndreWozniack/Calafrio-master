"use client";

import type { FichaVivaV1 } from "@calafrio/ficha-app";
import type { NivelZoomFicha } from "../fichas-tipos";
import {
  NumeroEditavel,
  NumeroFixo,
  VitalAtualMaximo,
} from "../papel/campo-vital";
import { FolhaPapel } from "../papel/folha-papel";
import {
  BotaoPassoPapel,
  CampoPapel,
  EtiquetaPapel,
  Losango,
  Posicionado,
  RodapePapel,
} from "../papel/primitivos-papel";
import { RetratoPapel } from "../papel/retrato-papel";
import { u } from "../papel/unidades";
import { InventarioPapelV1 } from "./inventario-papel-v1";
import { PalavrasChavePapelV1 } from "./palavras-chave-papel-v1";
import { TriadePapelV1 } from "./triade-papel-v1";

function LinhaCabecalho({
  y,
  rotulo,
  legenda,
  children,
}: {
  y: number;
  rotulo: React.ReactNode;
  legenda?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <CampoPapel area={{ x: 196, y, w: 212, h: 26 }}>
        <div className="flex size-full" style={{ paddingLeft: u(14) }}>
          {children}
        </div>
      </CampoPapel>
      <EtiquetaPapel area={{ x: 112, y, w: 100, h: 26 }} tamanho={13}>
        <span title={legenda}>{rotulo}</span>
      </EtiquetaPapel>
    </>
  );
}

const sigla = (texto: string) => (
  <strong className="ml-[0.5cqw] font-extrabold">({texto})</strong>
);

export function FolhaFrenteV1({
  f,
  zoom,
}: {
  f: FichaVivaV1;
  zoom?: NivelZoomFicha;
}) {
  const { ficha, derivada } = f;

  return (
    <FolhaPapel zoom={zoom}>
      <RetratoPapel
        retratoUrl={ficha.ilustracaoUrl}
        onDefinir={(url) => f.definirIlustracaoUrl(url)}
        area={{ x: 14, y: 14, w: 96, h: 130 }}
      />

      {/* Nome */}
      <Posicionado
        area={{ x: 112, y: 14, w: 293, h: 32 }}
        className="bg-white"
        style={{ boxShadow: "0 0 3px rgba(0,0,0,0.3)" }}
      >
        <input
          value={ficha.nome}
          onChange={(e) => f.definirNome(e.target.value)}
          placeholder="Nome do investigador"
          className="size-full bg-transparent font-semibold outline-none placeholder:font-normal placeholder:text-black/20"
          style={{ fontSize: u(18), paddingLeft: u(10), paddingBottom: u(6) }}
        />
      </Posicionado>
      <Posicionado
        area={{ x: 112, y: 45, w: 293, h: 3 }}
        className="bg-black"
      />
      <Posicionado
        area={{ x: 300, y: 32, w: 98, h: 11 }}
        className="text-right uppercase italic"
        style={{ fontSize: u(7.5) }}
      >
        Nome
      </Posicionado>
      <Losango cx={407} cy={46} lado={11} />

      {/* Vitais */}
      <LinhaCabecalho
        y={60}
        rotulo={<>Vida {sigla("PV")}:</>}
        legenda="= Nível × 6"
      >
        <VitalAtualMaximo
          atual={ficha.pvAtual}
          maximo={derivada.pvMax}
          onAtual={f.definirPvAtual}
          titulo="PV atual"
        />
      </LinhaCabecalho>
      <LinhaCabecalho
        y={89}
        rotulo={<>Ânimum {sigla("PA")}:</>}
        legenda="= Alma × 9"
      >
        <VitalAtualMaximo
          atual={ficha.paAtual}
          maximo={derivada.paMax}
          onAtual={f.definirPaAtual}
          titulo="PA atual"
        />
      </LinhaCabecalho>

      <CampoPapel area={{ x: 196, y: 118, w: 90, h: 26 }}>
        <div className="flex w-full" style={{ paddingLeft: u(14) }}>
          <NumeroFixo>+{derivada.ba}</NumeroFixo>
        </div>
      </CampoPapel>
      <EtiquetaPapel area={{ x: 112, y: 118, w: 100, h: 26 }} tamanho={13}>
        <span title="= Nível">Aptidão {sigla("BA")}:</span>
      </EtiquetaPapel>
      <CampoPapel area={{ x: 344, y: 118, w: 64, h: 26 }}>
        <NumeroFixo>{derivada.velocidade}m</NumeroFixo>
      </CampoPapel>
      <EtiquetaPapel area={{ x: 272, y: 118, w: 88, h: 26 }} tamanho={13}>
        Velocidade:
      </EtiquetaPapel>

      {/* Logo */}
      <Posicionado area={{ x: 470, y: 20, w: 168, h: 32 }}>
        {/* biome-ignore lint/performance/noImgElement: logo estático */}
        <img
          src="/assets/Calafrio.svg"
          alt="Calafrio TTRPG"
          className="size-full object-contain"
        />
      </Posicionado>
      <Posicionado
        area={{ x: 470, y: 52, w: 168, h: 12 }}
        className="text-center tracking-[0.35em]"
        style={{ fontSize: u(8) }}
      >
        - TTRPG · 1ª EDIÇÃO -
      </Posicionado>

      {/* Nível */}
      <CampoPapel area={{ x: 520, y: 72, w: 128, h: 28 }}>
        <div
          className="flex size-full items-center justify-between"
          style={{ paddingLeft: u(22), paddingRight: u(16) }}
        >
          <BotaoPassoPapel
            sentido="menos"
            titulo="Diminuir nível"
            onClick={() => f.definirNivel(ficha.nivel - 1)}
          />
          <div style={{ width: u(36) }}>
            <NumeroEditavel
              valor={ficha.nivel}
              min={1}
              onChange={f.definirNivel}
              titulo="Nível"
            />
          </div>
          <BotaoPassoPapel
            sentido="mais"
            titulo="Aumentar nível"
            onClick={() => f.definirNivel(ficha.nivel + 1)}
          />
        </div>
      </CampoPapel>
      <EtiquetaPapel area={{ x: 447, y: 72, w: 94, h: 28 }} tamanho={14}>
        Nível:
      </EtiquetaPapel>

      <TriadePapelV1
        atributos={ficha.atributos}
        derivada={derivada}
        onDefinirAtributo={f.definirAtributo}
      />

      <InventarioPapelV1
        inventario={ficha.inventario}
        carteira={ficha.carteira}
        anotacoes={ficha.anotacoes}
        onAdicionarItem={f.adicionarItem}
        onRemoverItem={f.removerItem}
        onDefinirCarteira={f.definirCarteira}
        onDefinirAnotacoes={f.definirAnotacoes}
      />

      <PalavrasChavePapelV1
        palavras={ficha.palavrasChave}
        derivada={derivada}
        onAdicionar={f.adicionarPalavraChave}
        onRemover={f.removerPalavraChave}
      />

      <RodapePapel />
    </FolhaPapel>
  );
}
