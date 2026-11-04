"use client";

import type {
  CatalogoCalafrio,
  CustomizacaoDeEco,
  FichaCalafrio,
  FichaDerivadaCalafrio,
  HabilidadeUnicaCalafrio,
} from "@calafrio/core";
import type { NivelZoomFicha } from "./fichas-tipos";
import { Plus, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { ModalCustomizacaoEco } from "./modal-customizacao-eco";
import { ModalHabilidadeUnica } from "./modal-habilidade-unica";
import {
  CardHabilidadeUnica,
  ItemCustomizacaoEco,
} from "./papel/card-ecos-componentes";
import { FolhaPapel } from "./papel/folha-papel";
import {
  CaixaMoldura,
  EtiquetaPapel,
  LinhaSeta,
  Posicionado,
  RodapePapel,
} from "./papel/primitivos-papel";
import { u } from "./papel/unidades";

export interface PaginaEcosAprimoramentosProps {
  ficha: FichaCalafrio;
  derivada: FichaDerivadaCalafrio;
  catalogo: CatalogoCalafrio;
  onAdicionarHabilidadeUnica: (unica: HabilidadeUnicaCalafrio) => void;
  onAtualizarHabilidadeUnica?: (
    id: string,
    dados: Partial<HabilidadeUnicaCalafrio>,
  ) => void;
  onRemoverHabilidadeUnica: (id: string) => void;
  onAdicionarCustomizacaoEco?: (customizacao: CustomizacaoDeEco) => void;
  onRemoverCustomizacaoEco?: (id: string) => void;
  onDefinirAnotacoes?: (anotacoes: string) => void;
  zoom?: NivelZoomFicha;
}

export function PaginaEcosAprimoramentos({
  ficha,
  derivada,
  catalogo,
  onAdicionarHabilidadeUnica,
  onAtualizarHabilidadeUnica,
  onRemoverHabilidadeUnica,
  onAdicionarCustomizacaoEco,
  onRemoverCustomizacaoEco,
  onDefinirAnotacoes,
  zoom,
}: PaginaEcosAprimoramentosProps) {
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
    if (unicaEmEdicao && onAtualizarHabilidadeUnica) {
      onAtualizarHabilidadeUnica(unicaEmEdicao.id, unica);
    } else {
      onAdicionarHabilidadeUnica(unica);
    }
    setModalUnicaAberto(false);
    setUnicaEmEdicao(null);
  };

  const ecosGastos = derivada.ecosMax - derivada.ecosDisponiveis;

  return (
    <div className="space-y-6">
      <FolhaPapel zoom={zoom}>
        {/* Cabeçalho */}
        <EtiquetaPapel area={{ x: 6, y: 28, w: 236, h: 28 }} tamanho={13.5}>
          Ecos & Aprimoramentos
        </EtiquetaPapel>
        <LinhaSeta area={{ x: 242, y: 35, w: 218, h: 14 }} />
        <Posicionado
          area={{ x: 464, y: 33, w: 186, h: 20 }}
          className="text-right uppercase font-mono font-bold tracking-wider"
          style={{ fontSize: u(8) }}
        >
          CALAFRIO 2E · MUTAÇÕES
        </Posicionado>

        {/* Resumo de Ecos & Ações de Forja */}
        <Posicionado
          area={{ x: 12, y: 64, w: 638, h: 48 }}
          className="border-2 border-black bg-white flex items-center justify-between px-3 shadow-[2px_2px_0px_#000]"
        >
          {/* Contadores analógicos de Ecos */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-black text-white px-2.5 py-1">
              <Sparkles
                style={{ width: u(11), height: u(11) }}
                className="text-amber-400"
              />
              <span
                className="font-extrabold uppercase"
                style={{ fontSize: u(10.5) }}
              >
                ECOS LIVRES: {derivada.ecosDisponiveis}
              </span>
            </div>
            <div
              className="flex items-center gap-2 font-bold uppercase text-black/80"
              style={{ fontSize: u(9.5) }}
            >
              <span>
                Gastos: <strong className="text-black">{ecosGastos}</strong>
              </span>
              <span>·</span>
              <span>
                Total (APT):{" "}
                <strong className="text-black">{derivada.ecosMax}</strong>
              </span>
            </div>
          </div>

          {/* Botões de Ação estilo carimbo/zine */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={abrirNovaUnica}
              className="flex cursor-pointer items-center gap-1 bg-black text-white px-2.5 py-1 font-extrabold uppercase transition-transform hover:scale-105 active:scale-95 shadow-[1px_1px_0px_#000]"
              style={{ fontSize: u(9.5) }}
            >
              <Plus style={{ width: u(10), height: u(10) }} strokeWidth={3} />
              Habilidade Única
            </button>
            {onAdicionarCustomizacaoEco && (
              <button
                type="button"
                onClick={() => setModalCustomizacaoAberto(true)}
                className="flex cursor-pointer items-center gap-1 border-2 border-black bg-white text-black px-2 py-0.5 font-extrabold uppercase transition-transform hover:scale-105 active:scale-95 shadow-[1px_1px_0px_#000]"
                style={{ fontSize: u(9.5) }}
              >
                <Wand2 style={{ width: u(10), height: u(10) }} /> Aprimorar c/
                Eco
              </button>
            )}
          </div>
        </Posicionado>

        {/* SEÇÃO 1: Habilidades Únicas */}
        <EtiquetaPapel area={{ x: 6, y: 122, w: 216, h: 26 }} tamanho={13}>
          Habilidades Únicas ({ficha.habilidadesUnicas.length})
        </EtiquetaPapel>
        <LinhaSeta area={{ x: 222, y: 128, w: 240, h: 14 }} />
        <Posicionado
          area={{ x: 300, y: 140, w: 350, h: 12 }}
          className="text-right uppercase italic font-bold text-black/70"
          style={{ fontSize: u(7.5) }}
        >
          1 Eco por habilidade 
        </Posicionado>

        <CaixaMoldura area={{ x: 12, y: 154, w: 638, h: 366 }} />
        <Posicionado
          area={{ x: 14, y: 156, w: 634, h: 362 }}
          className="overflow-y-auto p-3 space-y-2.5"
        >
          {ficha.habilidadesUnicas.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
              <Sparkles
                style={{ width: u(28), height: u(28) }}
                className="text-black/30 mb-2"
              />
              <div
                className="font-extrabold uppercase text-black/80"
                style={{ fontSize: u(12) }}
              >
                Nenhuma Habilidade Única
              </div>
              <p
                className="mt-1 max-w-[440px] text-black/60 italic"
                style={{ fontSize: u(9.8), lineHeight: 1.4 }}
              >
                Clique em{" "}
                <strong className="text-black not-italic">
                  + Habilidade Única
                </strong>{" "}
                acima para registrar seus poderes manifestados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ficha.habilidadesUnicas.map((uItem) => (
                <CardHabilidadeUnica
                  key={uItem.id}
                  uItem={uItem}
                  onEditar={() => abrirEditarUnica(uItem)}
                  onRemover={() => onRemoverHabilidadeUnica(uItem.id)}
                />
              ))}
            </div>
          )}
        </Posicionado>

        {/* SEÇÃO 2: Aprimoramentos da Matriz */}
        <EtiquetaPapel area={{ x: 6, y: 530, w: 236, h: 26 }} tamanho={13}>
          Aprimoramentos de Eco ({ficha.customizacoesEco.length})
        </EtiquetaPapel>
        <LinhaSeta area={{ x: 242, y: 536, w: 220, h: 14 }} />
        <Posicionado
          area={{ x: 300, y: 548, w: 350, h: 12 }}
          className="text-right uppercase italic font-bold text-black/70"
          style={{ fontSize: u(7.5) }}
        >
          Modificações de regras aplicadas a habilidades da matriz
        </Posicionado>

        <CaixaMoldura area={{ x: 12, y: 562, w: 638, h: 168 }} />
        <Posicionado
          area={{ x: 14, y: 564, w: 634, h: 164 }}
          className="overflow-y-auto p-3 space-y-2"
        >
          {ficha.customizacoesEco.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center">
              <div
                className="font-extrabold uppercase text-black/80"
                style={{ fontSize: u(11.5) }}
              >
                Nenhum Aprimoramento Registrado
              </div>
              <p
                className="mt-0.5 max-w-[460px] text-black/60 italic"
                style={{ fontSize: u(9.2), lineHeight: 1.35 }}
              >
                Use um Eco para aprimorar qualquer habilidade existente.
              </p>
            </div>
          ) : (
            ficha.customizacoesEco.map((c) => (
              <ItemCustomizacaoEco
                key={c.id}
                customizacao={c}
                catalogo={catalogo}
                onRemover={
                  onRemoverCustomizacaoEco
                    ? () => onRemoverCustomizacaoEco(c.id)
                    : undefined
                }
              />
            ))
          )}
        </Posicionado>

        {/* SEÇÃO 3: Mutações, Pactos & Regras Acordadas */}
        <EtiquetaPapel area={{ x: 6, y: 738, w: 220, h: 26 }} tamanho={12}>
          Mutações & Outros
        </EtiquetaPapel>
        <LinhaSeta area={{ x: 226, y: 744, w: 424, h: 14 }} />

        <CaixaMoldura area={{ x: 12, y: 768, w: 638, h: 124 }} />
        <Posicionado
          area={{ x: 172, y: 766, w: 478, h: 4 }}
          className="bg-black"
        />
        <textarea
          value={ficha.anotacoes ?? ""}
          onChange={(e) => onDefinirAnotacoes?.(e.target.value)}
          placeholder="Outras regras e condições que afetam a ficha..."
          className="absolute resize-none bg-transparent outline-none placeholder:text-black/30 p-2.5 font-medium"
          style={{
            left: u(20),
            top: u(776),
            width: u(622),
            height: u(108),
            fontSize: u(9.5),
            lineHeight: 1.35,
          }}
        />

        <RodapePapel />
      </FolhaPapel>

      {/* Modais de Criação / Edição */}
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

      {modalCustomizacaoAberto && onAdicionarCustomizacaoEco && (
        <ModalCustomizacaoEco
          aberto={modalCustomizacaoAberto}
          ficha={ficha}
          catalogo={catalogo}
          onSalvar={(c) => {
            onAdicionarCustomizacaoEco(c);
            setModalCustomizacaoAberto(false);
          }}
          onFechar={() => setModalCustomizacaoAberto(false)}
        />
      )}
    </div>
  );
}
