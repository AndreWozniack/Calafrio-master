"use client";

import type { FichaDerivadaCalafrio } from "@calafrio/core";
import { Dices, Plus, Shield, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { ModalItem } from "../modal-item";
import { ModalPalavraChave } from "../modal-palavra-chave";
import type { FichaViva } from "../fichas-tipos";
import { CartaoPapel, TituloSecaoCelular } from "./blocos-celular";

const botaoAdicionar =
  "flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 border-2 border-dashed border-black/40 bg-white/70 text-sm font-extrabold text-black/70 active:bg-white";

export function PalavrasChaveCelular({
  f,
  derivada,
  onRolar,
}: {
  f: FichaViva;
  derivada: FichaDerivadaCalafrio;
  onRolar: (nome: string) => void;
}) {
  const [modal, setModal] = useState(false);
  return (
    <section className="space-y-2">
      <TituloSecaoCelular
        detalhe={`${derivada.palavrasChaveOcupadas}/${derivada.limitePalavrasChave} · 2+APT`}
      >
        Palavras-chave
      </TituloSecaoCelular>
      {derivada.palavrasChaveAtivas.map((p) => (
        <CartaoPapel key={p.id} className="flex items-center gap-2 !p-0">
          <button
            type="button"
            onClick={() => onRolar(p.nome)}
            className="flex min-h-12 flex-1 cursor-pointer items-center gap-3 px-3 text-left active:bg-black/5"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black text-white">
              <Dices className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-extrabold">
                {p.nome}
              </span>
              <span className="block text-[10px] font-bold uppercase italic text-black/60">
                {p.categoria} · toque para rolar
              </span>
            </span>
          </button>
          {!p.semConsumirLimite && (
            <button
              type="button"
              aria-label={`Remover ${p.nome}`}
              onClick={() => f.removerPalavraChave(p.id)}
              className="flex size-12 cursor-pointer items-center justify-center text-black/40 active:text-red-700"
            >
              <X className="size-5" strokeWidth={3} />
            </button>
          )}
        </CartaoPapel>
      ))}
      <button type="button" onClick={() => setModal(true)} className={botaoAdicionar}>
        <Plus className="size-4" strokeWidth={3} /> Adicionar palavra-chave
      </button>
      <ModalPalavraChave
        aberto={modal}
        onSalvar={f.adicionarPalavraChave}
        onFechar={() => setModal(false)}
      />
    </section>
  );
}

export function CarteiraCelular({ f }: { f: FichaViva }) {
  const { fundos, espirions } = f.ficha.carteira;
  const campo = (rotulo: string, valor: number, aoMudar: (n: number) => void) => (
    <label className="flex flex-1 items-center gap-2 bg-white p-2 shadow-[0_0_3px_rgba(0,0,0,0.4)]">
      <span className="calafrio-tag text-sm">{rotulo}</span>
      <input
        type="number"
        min={0}
        value={valor}
        onChange={(e) => aoMudar(Number(e.target.value))}
        className="min-w-0 flex-1 bg-transparent text-right text-xl font-extrabold outline-none"
      />
    </label>
  );
  return (
    <section className="space-y-2">
      <TituloSecaoCelular>Carteira</TituloSecaoCelular>
      <div className="flex gap-3">
        {campo("F$", fundos, (n) => f.definirCarteira(n, espirions))}
        {campo("E$P", espirions, (n) => f.definirCarteira(fundos, n))}
      </div>
    </section>
  );
}

export function InventarioCelular({ f }: { f: FichaViva }) {
  const [modal, setModal] = useState(false);
  return (
    <section className="space-y-2">
      <TituloSecaoCelular detalhe={`${f.ficha.inventario.length} itens`}>
        Inventário
      </TituloSecaoCelular>
      {f.ficha.inventario.map((item) => (
        <CartaoPapel key={item.id} className="flex items-start gap-2">
          <button
            type="button"
            onClick={() => f.dispatch({ tipo: "alternarEquipadoItem", id: item.id })}
            aria-label={item.equipado ? "Guardar item" : "Equipar item"}
            className={`flex size-11 shrink-0 cursor-pointer flex-col items-center justify-center rounded ${
              item.equipado ? "bg-black text-white" : "bg-black/10 text-black/50"
            }`}
          >
            <Shield className="size-4" />
            <span className="text-[8px] font-bold uppercase">
              {item.equipado ? "Equip." : "Guard."}
            </span>
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-base font-extrabold">
              {item.paranormal && <Sparkles className="size-4 shrink-0" />}
              <span className="truncate">{item.nome}</span>
            </div>
            {item.dano && (
              <div className="text-xs font-bold italic">
                Dano {item.dano} · {item.espectroDano}
              </div>
            )}
            {item.descricao && (
              <p className="text-xs font-medium text-black/70">{item.descricao}</p>
            )}
          </div>
          <button
            type="button"
            aria-label={`Remover ${item.nome}`}
            onClick={() => f.removerItem(item.id)}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center text-black/40 active:text-red-700"
          >
            <X className="size-5" strokeWidth={3} />
          </button>
        </CartaoPapel>
      ))}
      <button type="button" onClick={() => setModal(true)} className={botaoAdicionar}>
        <Plus className="size-4" strokeWidth={3} /> Novo item
      </button>
      <ModalItem
        aberto={modal}
        onSalvar={f.adicionarItem}
        onFechar={() => setModal(false)}
      />
    </section>
  );
}
