"use client";

import type { FichaCalafrio, ItemNaFichaCalafrio } from "@calafrio/core";
import { Plus, Shield, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { ModalItem } from "../modal-item";
import { CaixaMoldura, EtiquetaPapel, Posicionado } from "./primitivos-papel";
import { u } from "./unidades";

export function InventarioPapel({
  inventario,
  onAdicionar,
  onAlternarEquipado,
  onRemover,
}: {
  inventario: FichaCalafrio["inventario"];
  onAdicionar: (item: ItemNaFichaCalafrio) => void;
  onAlternarEquipado: (id: string) => void;
  onRemover: (id: string) => void;
}) {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <CaixaMoldura area={{ x: 12, y: 361, w: 638, h: 526 }} />
      <Posicionado
        area={{ x: 120, y: 359, w: 530, h: 4 }}
        className="bg-black"
      />
      <EtiquetaPapel area={{ x: 8, y: 347, w: 112, h: 30 }}>
        Inventário
      </EtiquetaPapel>

      <Posicionado
        area={{ x: 24, y: 376, w: 614, h: 500 }}
        className="overflow-y-auto"
        style={{ columnCount: 2, columnGap: u(18), fontSize: u(10.5) }}
      >
        {inventario.map((item) => (
          <div
            key={item.id}
            className="group mb-[1.4cqw] flex break-inside-avoid items-start gap-[1cqw] border-b border-black/20 pb-[1cqw]"
          >
            <button
              type="button"
              onClick={() => onAlternarEquipado(item.id)}
              title={item.equipado ? "Equipado" : "Guardado"}
              className={`mt-[0.3cqw] shrink-0 cursor-pointer ${item.equipado ? "text-black" : "text-black/25"}`}
            >
              <Shield style={{ width: u(11), height: u(11) }} />
            </button>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-center gap-[0.8cqw] font-bold">
                {item.paranormal && (
                  <Sparkles style={{ width: u(9), height: u(9) }} />
                )}
                <span className="truncate">{item.nome}</span>
                {item.dano && (
                  <span className="italic" style={{ fontSize: u(8.5) }}>
                    [{item.dano} {item.espectroDano}]
                  </span>
                )}
              </div>
              {item.descricao && (
                <p className="text-black/70" style={{ fontSize: u(8.5) }}>
                  {item.descricao}
                </p>
              )}
            </div>
            <button
              type="button"
              title="Remover"
              onClick={() => onRemover(item.id)}
              className="cursor-pointer text-red-700 opacity-0 group-hover:opacity-100"
            >
              <X style={{ width: u(10), height: u(10) }} />
            </button>
          </div>
        ))}
      </Posicionado>

      <Posicionado area={{ x: 560, y: 364, w: 84, h: 16 }}>
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className="flex size-full cursor-pointer items-center justify-center gap-[0.5cqw] bg-black text-white transition-opacity hover:opacity-80"
          style={{ fontSize: u(8.5) }}
        >
          <Plus style={{ width: u(9), height: u(9) }} /> Novo item
        </button>
      </Posicionado>

      <ModalItem
        aberto={modalAberto}
        onSalvar={onAdicionar}
        onFechar={() => setModalAberto(false)}
      />
    </>
  );
}
