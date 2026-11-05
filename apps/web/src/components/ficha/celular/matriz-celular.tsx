"use client";

import type { AlocacaoSlotMatriz } from "@calafrio/core";
import { Lock, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { FichaViva } from "../fichas-tipos";
import { SeletorHabilidadeModal } from "../seletor-habilidade-modal";
import {
  CartaoPapel,
  EtiquetaCelular,
  TituloSecaoCelular,
} from "./blocos-celular";

function resumoSlot(f: FichaViva, alocacao?: AlocacaoSlotMatriz) {
  if (!alocacao) return null;
  if (alocacao.tipo === "unica") {
    const u = f.ficha.habilidadesUnicas.find((x) => x.id === alocacao.id);
    return (
      u && {
        nome: u.nome,
        detalhe: `${u.tipoAcao} · ${u.custo} ${u.recurso.toUpperCase()}`,
        descricao: u.descricao,
        id: u.id,
        foco: Boolean(u.requerFoco),
      }
    );
  }
  const h = f.catalogo.habilidadesParanormais.find((x) => x.id === alocacao.id);
  return (
    h && {
      nome: h.nome,
      detalhe: `${h.tipoAcao} · ${h.custoPA === 0 ? "passiva" : `${h.custoPA} PA`}`,
      descricao: h.descricao,
      id: h.id,
      foco: h.requerFoco !== "nao",
    }
  );
}

export function MatrizCelular({ f }: { f: FichaViva }) {
  const [seletor, setSeletor] = useState<number | null>(null);
  const [aberto, setAberto] = useState<number | null>(null);
  const emAlinhamento = new Set(
    f.derivada.alinhamentosAtivos.flatMap((a) => a.slots),
  );
  const alocacaoDe = (slot: number) =>
    f.ficha.matrizHabilidades.find((m) => m.slot === slot);
  const detalhe = aberto !== null ? resumoSlot(f, alocacaoDe(aberto)) : null;

  return (
    <div className="entrada-lista space-y-5">
      <section className="space-y-2">
        <TituloSecaoCelular
          detalhe={`${f.derivada.habilidadesMemorizadasCount}/${f.derivada.limiteHabilidadesMemorizadas} = APT`}
        >
          Habilidades
        </TituloSecaoCelular>
        <div className="entrada-lista grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }, (_, slot) => {
            const r = resumoSlot(f, alocacaoDe(slot));
            return (
              <button
                key={slot}
                type="button"
                onClick={() => (r ? setAberto(slot) : setSeletor(slot))}
                className={`pressionavel flex min-h-24 cursor-pointer flex-col items-start gap-1 bg-white p-2 text-left ${
                  emAlinhamento.has(slot)
                    ? "shadow-[0_0_0_2px_black]"
                    : "shadow-[0_0_3px_rgba(0,0,0,0.4)]"
                }`}
              >
                <EtiquetaCelular className="!px-2 !py-0 !text-[11px]">
                  #{slot + 1}
                </EtiquetaCelular>
                {r ? (
                  <span className="text-[13px] font-extrabold leading-tight">
                    {r.nome}
                  </span>
                ) : (
                  <span className="flex flex-1 items-center self-center text-black/35">
                    <Plus className="size-6" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] font-bold uppercase italic text-black/60">
          ↔ +3 PA · ↕ +3 PD · ⤢ +6 PV · ⊞ +3 VEL (alinhe a mesma personalidade)
        </p>
      </section>

      <section className="space-y-2">
        <TituloSecaoCelular>Anotações</TituloSecaoCelular>
        <textarea
          value={f.ficha.anotacoes ?? ""}
          onChange={(e) => f.definirAnotacoes(e.target.value)}
          rows={8}
          placeholder="Pistas, NPCs, contatos..."
          className="w-full border-2 border-black bg-white p-3 text-base font-semibold outline-none"
        />
      </section>

      {detalhe && aberto !== null && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70">
          <CartaoPapel className="w-full space-y-3 !p-4">
            <div className="flex items-center justify-between">
              <EtiquetaCelular>#{aberto + 1}</EtiquetaCelular>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setAberto(null)}
                className="size-11 cursor-pointer"
              >
                <X className="mx-auto size-6" />
              </button>
            </div>
            <h3 className="text-xl font-extrabold">{detalhe.nome}</h3>
            <p className="text-xs font-bold uppercase italic">
              {detalhe.detalhe}
            </p>
            <p className="text-sm font-medium leading-snug">
              {detalhe.descricao}
            </p>
            {detalhe.foco && (
              <button
                type="button"
                onClick={() => f.alternarFoco(detalhe.id)}
                className={`flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 font-extrabold ${
                  f.estado.focoAtivoId === detalhe.id
                    ? "bg-amber-400 text-black"
                    : "bg-black text-white"
                }`}
              >
                <Lock className="size-4" />
                {f.estado.focoAtivoId === detalhe.id
                  ? "Foco ativo — soltar"
                  : "Ativar Foco"}
              </button>
            )}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSeletor(aberto);
                  setAberto(null);
                }}
                className="min-h-12 cursor-pointer border-2 border-black font-extrabold"
              >
                Trocar habilidade
              </button>
              <button
                type="button"
                onClick={() => {
                  f.limparSlotMatriz(aberto);
                  setAberto(null);
                }}
                className="flex min-h-12 cursor-pointer items-center justify-center gap-2 border-2 border-red-700 font-extrabold text-red-700"
              >
                <Trash2 className="size-4" /> Limpar slot
              </button>
            </div>
          </CartaoPapel>
        </div>
      )}

      {seletor !== null && (
        <SeletorHabilidadeModal
          slot={seletor}
          catalogo={f.catalogo}
          habilidadesUnicas={f.ficha.habilidadesUnicas}
          onAlocar={(slot, a) => f.alocarSlotMatriz(slot, a.tipo, a.id)}
          onFechar={() => setSeletor(null)}
        />
      )}
    </div>
  );
}
