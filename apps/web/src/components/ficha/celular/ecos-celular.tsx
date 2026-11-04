"use client";

import type {
  CustomizacaoDeEco,
  HabilidadeUnicaCalafrio,
} from "@calafrio/core";
import { TOKENS_PERSONALIDADE } from "@calafrio/tema";
import { Pencil, Plus, Sparkles, Trash2, Wand2 } from "lucide-react";
import { useState } from "react";
import type { FichaViva } from "../fichas-tipos";
import { ModalCustomizacaoEco } from "../modal-customizacao-eco";
import { ModalHabilidadeUnica } from "../modal-habilidade-unica";
import { CartaoPapel, EtiquetaCelular, TituloSecaoCelular } from "./blocos-celular";

export function EcosCelular({ f }: { f: FichaViva }) {
  const [modalUnicaAberto, setModalUnicaAberto] = useState(false);
  const [unicaEmEdicao, setUnicaEmEdicao] =
    useState<HabilidadeUnicaCalafrio | null>(null);
  const [modalCustomizacaoAberto, setModalCustomizacaoAberto] = useState(false);

  const abrirNovaUnica = () => {
    setUnicaEmEdicao(null);
    setModalUnicaAberto(true);
  };

  const abrirEditarUnica = (unica: HabilidadeUnicaCalafrio) => {
    setUnicaEmEdicao(unica);
    setModalUnicaAberto(true);
  };

  const lidarSalvarUnica = (unica: HabilidadeUnicaCalafrio) => {
    if (unicaEmEdicao) {
      f.dispatch({ tipo: "atualizarHabilidadeUnica", id: unicaEmEdicao.id, dados: unica });
    } else {
      f.dispatch({ tipo: "adicionarHabilidadeUnica", unica });
    }
    setModalUnicaAberto(false);
    setUnicaEmEdicao(null);
  };

  const ecosGastos = f.derivada.ecosMax - f.derivada.ecosDisponiveis;

  return (
    <div className="entrada-lista space-y-5">
      {/* Resumo de Ecos */}
      <CartaoPapel className="space-y-3">
        <div className="flex items-center justify-between gap-2 border-b-2 border-black pb-2">
          <EtiquetaCelular className="!text-[14px]">
            Ecos Paranormais
          </EtiquetaCelular>
          <div className="bg-black text-white px-2.5 py-1 text-xs font-black uppercase">
            Livres: {f.derivada.ecosDisponiveis}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-black/80 font-bold uppercase">
          <span>Total (APT): <strong className="text-black">{f.derivada.ecosMax}</strong></span>
          <span>Gastos: <strong className="text-black">{ecosGastos}</strong></span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={abrirNovaUnica}
            className="pressionavel flex min-h-12 cursor-pointer items-center justify-center gap-1.5 bg-black text-white text-xs font-black uppercase shadow-[2px_2px_0px_#000]"
          >
            <Plus className="size-4" strokeWidth={3} />
            Habilidade Única
          </button>
          <button
            type="button"
            onClick={() => setModalCustomizacaoAberto(true)}
            className="pressionavel flex min-h-12 cursor-pointer items-center justify-center gap-1.5 border-2 border-black bg-white text-black text-xs font-black uppercase shadow-[2px_2px_0px_#000]"
          >
            <Wand2 className="size-4" />
            Aprimorar c/ Eco
          </button>
        </div>
      </CartaoPapel>

      {/* Habilidades Únicas */}
      <section className="space-y-2">
        <TituloSecaoCelular detalhe={`${f.ficha.habilidadesUnicas.length} forjada(s)`}>
          Habilidades Únicas
        </TituloSecaoCelular>

        {f.ficha.habilidadesUnicas.length === 0 ? (
          <CartaoPapel className="py-6 text-center text-xs text-black/60 italic">
            Nenhuma habilidade única criada ainda. Toque em "+ Habilidade Única" para manifestar uma técnica singular.
          </CartaoPapel>
        ) : (
          <div className="space-y-2">
            {f.ficha.habilidadesUnicas.map((uItem) => {
              const tokenPers = uItem.personalidadeAlinhamento
                ? TOKENS_PERSONALIDADE[uItem.personalidadeAlinhamento]
                : null;
              return (
                <CartaoPapel key={uItem.id} className="space-y-2">
                  <div className="flex items-start justify-between gap-2 border-b border-black/20 pb-1.5">
                    <div
                      className="min-w-0 flex-1 cursor-pointer"
                      onClick={() => abrirEditarUnica(uItem)}
                    >
                      <h4 className="font-extrabold uppercase text-sm text-black">
                        {uItem.nome}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="bg-black text-white text-[10px] font-black uppercase px-1.5 py-0.5">
                          {uItem.tipoAcao} · {uItem.custo} {uItem.recurso.toUpperCase()}
                        </span>
                        {uItem.ecosInvestidos && uItem.ecosInvestidos > 1 && (
                          <span className="border border-black bg-amber-200 text-black text-[10px] font-black uppercase px-1.5 py-0.5">
                            {uItem.ecosInvestidos} Ecos
                          </span>
                        )}
                        {tokenPers && (
                          <span
                            style={{ backgroundColor: tokenPers.corPositiva }}
                            className="text-black font-black uppercase text-[10px] px-1.5 py-0.5 border border-black"
                          >
                            {tokenPers.nome}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => abrirEditarUnica(uItem)}
                        className="p-1.5 text-black hover:bg-black hover:text-white transition-colors"
                        title="Editar"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => f.dispatch({ tipo: "removerHabilidadeUnica", id: uItem.id })}
                        className="p-1.5 text-black/60 hover:text-red-600 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-black/90 font-medium whitespace-pre-wrap">
                    {uItem.descricao}
                  </p>

                  {(uItem.alcance || uItem.duracao || uItem.tempoPreparacao) && (
                    <div className="text-[11px] text-black/60 italic pt-1 border-t border-black/10 flex items-center gap-2 flex-wrap">
                      {uItem.alcance && <span>Alcance: {uItem.alcance}</span>}
                      {uItem.duracao && <span>Duração: {uItem.duracao}</span>}
                      {uItem.tempoPreparacao && <span>Preparo: {uItem.tempoPreparacao}</span>}
                    </div>
                  )}
                </CartaoPapel>
              );
            })}
          </div>
        )}
      </section>

      {/* Aprimoramentos da Matriz */}
      <section className="space-y-2">
        <TituloSecaoCelular detalhe={`${f.ficha.customizacoesEco.length} ativo(s)`}>
          Aprimoramentos de Eco
        </TituloSecaoCelular>

        {f.ficha.customizacoesEco.length === 0 ? (
          <CartaoPapel className="py-5 text-center text-xs text-black/60 italic">
            Nenhum aprimoramento aplicado a habilidades existentes.
          </CartaoPapel>
        ) : (
          <div className="space-y-2">
            {f.ficha.customizacoesEco.map((c) => {
              const habOriginal = f.catalogo.habilidadesParanormais.find(
                (h) => h.id === c.habilidadeAlvoId,
              );
              return (
                <CartaoPapel key={c.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold uppercase text-xs text-black">
                        {c.titulo}
                      </span>
                      <span className="text-[10px] bg-black/10 text-black px-1.5 py-0.5 font-bold">
                        Alvo: {habOriginal?.nome ?? c.habilidadeAlvoId}
                      </span>
                    </div>
                    {c.descricaoMudanca && (
                      <p className="text-xs text-black/80 font-medium mt-0.5">
                        {c.descricaoMudanca}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => f.dispatch({ tipo: "removerCustomizacaoEco", id: c.id })}
                    className="p-1.5 text-black/60 hover:text-red-600 transition-colors shrink-0"
                    title="Remover"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </CartaoPapel>
              );
            })}
          </div>
        )}
      </section>

      {/* Manifestações / Pactos */}
      <section className="space-y-2">
        <TituloSecaoCelular>Manifestações & Pactos</TituloSecaoCelular>
        <CartaoPapel className="p-2">
          <textarea
            value={f.ficha.anotacoes ?? ""}
            onChange={(e) => f.definirAnotacoes(e.target.value)}
            placeholder="Pactos, condições paranormais e acordos com o Mestre de Jogo..."
            className="w-full h-24 resize-none bg-transparent outline-none text-xs text-black placeholder:text-black/35 font-medium"
          />
        </CartaoPapel>
      </section>

      {/* Modais */}
      {modalUnicaAberto && (
        <ModalHabilidadeUnica
          aberto={modalUnicaAberto}
          inicial={unicaEmEdicao ?? undefined}
          onSalvar={lidarSalvarUnica}
          onFechar={() => {
            setModalUnicaAberto(false);
            setUnicaEmEdicao(null);
          }}
        />
      )}

      {modalCustomizacaoAberto && (
        <ModalCustomizacaoEco
          aberto={modalCustomizacaoAberto}
          ficha={f.ficha}
          catalogo={f.catalogo}
          onSalvar={(c) => {
            f.dispatch({ tipo: "adicionarCustomizacaoEco", customizacao: c });
            setModalCustomizacaoAberto(false);
          }}
          onFechar={() => setModalCustomizacaoAberto(false)}
        />
      )}
    </div>
  );
}
