"use client";

import type { FichaVivaV1 } from "@calafrio/ficha-app";
import type { NivelZoomFicha } from "../fichas-tipos";
import { FolhaPapel } from "../papel/folha-papel";
import {
  CaixaMoldura,
  EtiquetaPapel,
  Posicionado,
  RodapePapel,
} from "../papel/primitivos-papel";
import { u } from "../papel/unidades";
import { TabelaHabilidadesPapelV1 } from "./tabela-habilidades-papel-v1";
import { TabelaUnicasPapelV1 } from "./tabela-unicas-papel-v1";

export function FolhaVersoV1({
  f,
  zoom,
}: {
  f: FichaVivaV1;
  zoom?: NivelZoomFicha;
}) {
  return (
    <FolhaPapel zoom={zoom}>
      {/* Quem sou eu? */}
      <CaixaMoldura area={{ x: 12, y: 28, w: 636, h: 76 }} />
      <EtiquetaPapel area={{ x: 4, y: 16, w: 112, h: 26 }}>
        Quem sou eu?
      </EtiquetaPapel>
      <Posicionado area={{ x: 22, y: 44, w: 616, h: 56 }}>
        <textarea
          value={f.ficha.quemSouEu}
          onChange={(e) => f.definirQuemSouEu(e.target.value)}
          placeholder="Conceito, aparência, motivos para investigar o oculto…"
          className="size-full resize-none bg-transparent font-semibold outline-none placeholder:text-black/25"
          style={{ fontSize: u(11.5), lineHeight: u(17) }}
        />
      </Posicionado>

      <TabelaHabilidadesPapelV1 f={f} />
      <TabelaUnicasPapelV1 f={f} />

      <RodapePapel />
    </FolhaPapel>
  );
}
