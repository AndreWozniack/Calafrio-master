"use client";

import type { ItemV1 } from "@calafrio/core";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import {
  CaixaMoldura,
  CampoPapel,
  EtiquetaPapel,
  Posicionado,
} from "../papel/primitivos-papel";
import { u } from "../papel/unidades";
import { ModalItemV1 } from "./modais-papel-v1";

/** Pauta de caderno: uma linha a cada 24 unidades da folha. */
const PAUTA = `repeating-linear-gradient(to bottom, transparent 0, transparent calc(${u(24)} - 1px), rgba(0,0,0,0.18) calc(${u(24)} - 1px), rgba(0,0,0,0.18) ${u(24)})`;

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
      <CampoPapel area={{ x: 40, y, w: 96, h: 26 }}>
        <input
          type="number"
          min={0}
          value={valor}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          className="w-full bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          style={{ fontSize: u(14), paddingLeft: u(38) }}
        />
      </CampoPapel>
      <EtiquetaPapel area={{ x: 6, y, w: 66, h: 26 }} tamanho={13}>
        <strong className="font-semibold">{rotulo}</strong>
      </EtiquetaPapel>
    </>
  );
}

export function InventarioPapelV1({
  inventario,
  carteira,
  anotacoes,
  onAdicionarItem,
  onRemoverItem,
  onDefinirCarteira,
  onDefinirAnotacoes,
}: {
  inventario: ItemV1[];
  carteira: { fundos: number; espirions: number };
  anotacoes: string;
  onAdicionarItem: (item: ItemV1) => void;
  onRemoverItem: (id: string) => void;
  onDefinirCarteira: (fundos: number, espirions: number) => void;
  onDefinirAnotacoes: (texto: string) => void;
}) {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <CaixaMoldura area={{ x: 12, y: 178, w: 402, h: 712 }} />
      <EtiquetaPapel area={{ x: 4, y: 166, w: 182, h: 26 }}>
        Inventário &amp; anotações
      </EtiquetaPapel>

      <CampoCarteira
        y={202}
        rotulo="Fundo$:"
        valor={carteira.fundos}
        onChange={(n) => onDefinirCarteira(n, carteira.espirions)}
      />
      <CampoCarteira
        y={232}
        rotulo="E$P:"
        valor={carteira.espirions}
        onChange={(n) => onDefinirCarteira(carteira.fundos, n)}
      />

      {/* Itens */}
      <Posicionado
        area={{ x: 24, y: 272, w: 378, h: 290 }}
        className="flex flex-col overflow-y-auto"
        style={{ backgroundImage: PAUTA, fontSize: u(12.5) }}
      >
        {inventario.map((item) => (
          <div
            key={item.id}
            className="group flex shrink-0 items-center justify-between font-bold"
            style={{ height: u(24), paddingLeft: u(4), gap: u(6) }}
          >
            <span className="truncate">
              • {item.nome}
              {item.quantidade > 1 && (
                <span className="font-extrabold"> ×{item.quantidade}</span>
              )}
              {item.notas && (
                <span className="font-semibold italic text-black/55">
                  {" "}
                  — {item.notas}
                </span>
              )}
            </span>
            <button
              type="button"
              title="Remover item"
              aria-label={`Remover ${item.nome}`}
              onClick={() => onRemoverItem(item.id)}
              className="shrink-0 cursor-pointer text-black/30 hover:text-red-700"
            >
              <X style={{ width: u(11), height: u(11) }} strokeWidth={3} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className="flex shrink-0 cursor-pointer items-center font-bold text-black/45 transition-colors hover:text-black"
          style={{ height: u(24), paddingLeft: u(4), gap: u(4) }}
        >
          <Plus style={{ width: u(11), height: u(11) }} strokeWidth={3} />
          Adicionar item
        </button>
      </Posicionado>

      {/* Anotações */}
      <Posicionado
        area={{ x: 24, y: 572, w: 140, h: 14 }}
        className="uppercase italic font-bold text-black/70"
        style={{ fontSize: u(8) }}
      >
        Anotações
      </Posicionado>
      <Posicionado area={{ x: 24, y: 588, w: 378, h: 290 }}>
        <textarea
          value={anotacoes}
          onChange={(e) => onDefinirAnotacoes(e.target.value)}
          placeholder="Pistas, contatos, segredos…"
          className="size-full resize-none bg-transparent font-semibold outline-none placeholder:text-black/25"
          style={{
            backgroundImage: PAUTA,
            fontSize: u(12.5),
            lineHeight: u(24),
            paddingLeft: u(4),
          }}
        />
      </Posicionado>

      {modalAberto && (
        <ModalItemV1
          onSalvar={onAdicionarItem}
          onFechar={() => setModalAberto(false)}
        />
      )}
    </>
  );
}
