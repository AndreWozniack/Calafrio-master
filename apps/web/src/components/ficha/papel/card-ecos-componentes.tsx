"use client";

import type {
  CatalogoCalafrio,
  CustomizacaoDeEco,
  HabilidadeUnicaCalafrio,
} from "@calafrio/core";
import { TOKENS_PERSONALIDADE } from "@calafrio/tema";
import { Pencil, Trash2 } from "lucide-react";
import { u } from "./unidades";

export function CardHabilidadeUnica({
  uItem,
  onEditar,
  onRemover,
}: {
  uItem: HabilidadeUnicaCalafrio;
  onEditar: () => void;
  onRemover: () => void;
}) {
  const tokenPers = uItem.personalidadeAlinhamento
    ? TOKENS_PERSONALIDADE[uItem.personalidadeAlinhamento]
    : null;

  return (
    <div className="border-2 border-black bg-white p-2.5 shadow-[2px_2px_0px_#000] flex flex-col justify-between gap-1.5 transition-shadow hover:shadow-[3px_3px_0px_#000]">
      <div>
        <div className="flex items-start justify-between gap-1.5 border-b-2 border-black pb-1.5">
          <div
            className="min-w-0 flex-1 cursor-pointer"
            onClick={onEditar}
            title="Clique para editar"
          >
            <h4
              className="font-extrabold uppercase text-black truncate hover:underline"
              style={{ fontSize: u(11.5) }}
            >
              {uItem.nome}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span
                className="bg-black text-white font-extrabold uppercase px-1.5 py-0.5 leading-none"
                style={{ fontSize: u(7.8) }}
              >
                {uItem.tipoAcao} · {uItem.custo} {uItem.recurso.toUpperCase()}
              </span>
              {uItem.ecosInvestidos && uItem.ecosInvestidos > 1 ? (
                <span
                  className="border border-black bg-amber-200 text-black font-extrabold uppercase px-1.5 py-0.5 leading-none"
                  style={{ fontSize: u(7.8) }}
                >
                  {uItem.ecosInvestidos} Ecos
                </span>
              ) : null}
              {tokenPers && (
                <span
                  style={{ backgroundColor: tokenPers.corPositiva }}
                  className="text-black font-black uppercase text-xs px-1.5 py-0.5 border border-black leading-none"
                >
                  {tokenPers.nome}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 pt-0.5">
            <button
              type="button"
              onClick={onEditar}
              className="p-1 hover:bg-black hover:text-white transition-colors cursor-pointer border border-transparent hover:border-black"
              title="Editar habilidade única"
            >
              <Pencil style={{ width: u(10), height: u(10) }} />
            </button>
            <button
              type="button"
              onClick={onRemover}
              className="p-1 text-black/60 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
              title="Excluir habilidade única"
            >
              <Trash2 style={{ width: u(10), height: u(10) }} />
            </button>
          </div>
        </div>

        <p
          className="mt-1.5 text-black/90 font-medium whitespace-pre-wrap"
          style={{ fontSize: u(9.2), lineHeight: 1.35 }}
        >
          {uItem.descricao}
        </p>
      </div>

      {(uItem.alcance || uItem.duracao || uItem.tempoPreparacao) && (
        <div
          className="pt-1 border-t border-black/20 flex items-center gap-2 flex-wrap text-black/70 italic font-semibold"
          style={{ fontSize: u(7.8) }}
        >
          {uItem.alcance && <span>Alcance: {uItem.alcance}</span>}
          {uItem.duracao && <span>Duração: {uItem.duracao}</span>}
          {uItem.tempoPreparacao && <span>Preparo: {uItem.tempoPreparacao}</span>}
        </div>
      )}
    </div>
  );
}

export function ItemCustomizacaoEco({
  customizacao,
  catalogo,
  onRemover,
}: {
  customizacao: CustomizacaoDeEco;
  catalogo: CatalogoCalafrio;
  onRemover?: () => void;
}) {
  const habOriginal = catalogo.habilidadesParanormais.find(
    (h) => h.id === customizacao.habilidadeAlvoId,
  );

  return (
    <div className="border-2 border-black bg-white p-2.5 shadow-[2px_2px_0px_#000] flex items-center justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="font-extrabold uppercase text-black"
            style={{ fontSize: u(10.5) }}
          >
            {customizacao.titulo}
          </span>
          <span
            className="bg-black/10 border border-black/40 text-black font-bold uppercase px-1.5 py-0.5"
            style={{ fontSize: u(7.8) }}
          >
            Alvo: {habOriginal?.nome ?? customizacao.habilidadeAlvoId}
          </span>
        </div>
        {customizacao.descricaoMudanca && (
          <p
            className="mt-1 text-black/80 font-medium"
            style={{ fontSize: u(9.2), lineHeight: 1.3 }}
          >
            {customizacao.descricaoMudanca}
          </p>
        )}
      </div>
      {onRemover && (
        <button
          type="button"
          onClick={onRemover}
          className="p-1.5 text-black/60 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
          title="Remover aprimoramento"
        >
          <Trash2 style={{ width: u(11), height: u(11) }} />
        </button>
      )}
    </div>
  );
}
