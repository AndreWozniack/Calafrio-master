"use client";

import type {
  AlocacaoSlotMatriz,
  CatalogoCalafrio,
  CustomizacaoDeEco,
  FichaCalafrio,
  FichaDerivadaCalafrio,
  HabilidadeUnicaCalafrio,
} from "@calafrio/core";
import { AlertTriangle, Sparkles } from "lucide-react";
import { useState } from "react";
import { FolhaPapel } from "./papel/folha-papel";
import { LegendaBonusPapel } from "./papel/legenda-bonus-papel";
import {
  CaixaMoldura,
  EtiquetaPapel,
  LinhaSeta,
  Posicionado,
  RodapePapel,
} from "./papel/primitivos-papel";
import { SlotHabilidadePapel } from "./papel/slot-habilidade-papel";
import { u } from "./papel/unidades";
import { SeletorHabilidadeModal } from "./seletor-habilidade-modal";

interface PaginaVersoMatrizProps {
  ficha: FichaCalafrio;
  derivada: FichaDerivadaCalafrio;
  catalogo: CatalogoCalafrio;
  onAlocarSlot: (slot: number, alocacao: AlocacaoSlotMatriz) => void;
  onLimparSlot: (slot: number) => void;
  onAdicionarHabilidadeUnica?: (unica: HabilidadeUnicaCalafrio) => void;
  onAtualizarHabilidadeUnica?: (
    id: string,
    dados: Partial<HabilidadeUnicaCalafrio>,
  ) => void;
  onRemoverHabilidadeUnica?: (id: string) => void;
  onAdicionarCustomizacaoEco?: (customizacao: CustomizacaoDeEco) => void;
  onRemoverCustomizacaoEco?: (id: string) => void;
  focoAtivoId?: string;
  onAlternarFoco?: (id: string) => void;
  onDefinirAnotacoes: (anotacoes: string) => void;
  onNavegarParaEcos?: () => void;
}

export function PaginaVersoMatriz({
  ficha,
  derivada,
  catalogo,
  onAlocarSlot,
  onLimparSlot,
  onAdicionarHabilidadeUnica,
  onAtualizarHabilidadeUnica,
  onRemoverHabilidadeUnica,
  onAdicionarCustomizacaoEco,
  onRemoverCustomizacaoEco,
  focoAtivoId,
  onAlternarFoco,
  onDefinirAnotacoes,
}: PaginaVersoMatrizProps) {
  const [slotSelecionado, setSlotSelecionado] = useState<number | null>(null);
  const slotsEmAlinhamento = new Set(
    derivada.alinhamentosAtivos.flatMap((a) => a.slots),
  );

  return (
    <div className="space-y-6">
      <FolhaPapel>
        <EtiquetaPapel area={{ x: 6, y: 28, w: 166, h: 28 }} tamanho={13}>
          Habilidades Paranormais
        </EtiquetaPapel>
        <LinhaSeta area={{ x: 172, y: 35, w: 190, h: 14 }} />
        <Posicionado
          area={{ x: 226, y: 52, w: 134, h: 9 }}
          className="text-right uppercase italic"
          style={{ fontSize: u(5.8) }}
        >
          Número máx. de habilidades = APT (
          {derivada.habilidadesMemorizadasCount}/
          {derivada.limiteHabilidadesMemorizadas})
        </Posicionado>
        <LegendaBonusPapel alinhamentos={derivada.alinhamentosAtivos} />

        {Array.from({ length: 9 }, (_, slot) => (
          <SlotHabilidadePapel
            key={slot}
            numero={slot}
            alocacao={ficha.matrizHabilidades.find((m) => m.slot === slot)}
            catalogo={catalogo}
            habilidadesUnicas={ficha.habilidadesUnicas}
            destacado={slotsEmAlinhamento.has(slot)}
            focoAtivo={
              focoAtivoId !== undefined &&
              focoAtivoId ===
                ficha.matrizHabilidades.find((m) => m.slot === slot)?.id
            }
            onSelecionar={setSlotSelecionado}
            onLimpar={onLimparSlot}
            onAlternarFoco={onAlternarFoco}
          />
        ))}

        <CaixaMoldura area={{ x: 12, y: 661, w: 638, h: 226 }} />
        <Posicionado
          area={{ x: 172, y: 659, w: 478, h: 4 }}
          className="bg-black"
        />
        <EtiquetaPapel area={{ x: 6, y: 647, w: 166, h: 28 }} tamanho={13}>
          Anotações
        </EtiquetaPapel>
        <textarea
          value={ficha.anotacoes ?? ""}
          onChange={(e) => onDefinirAnotacoes(e.target.value)}
          placeholder="Pistas, NPCs, contatos no submundo curitibano..."
          className="absolute resize-none bg-transparent outline-none placeholder:text-black/20"
          style={{
            left: u(24),
            top: u(678),
            width: u(614),
            height: u(200),
            fontSize: u(11),
            lineHeight: 1.35,
          }}
        />
        <RodapePapel />
      </FolhaPapel>

      {derivada.avisosDeRegra.map((aviso, idx) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: avisos sem id estável
          key={idx}
          className="mx-auto flex max-w-[880px] items-center gap-2 rounded border border-red-800/60 bg-red-950/40 p-2.5 text-xs text-red-200"
        >
          <AlertTriangle className="size-4 shrink-0 text-red-400" />
          <span>{aviso.mensagem}</span>
        </div>
      ))}

      {slotSelecionado !== null && (
        <SeletorHabilidadeModal
          slot={slotSelecionado}
          catalogo={catalogo}
          habilidadesUnicas={ficha.habilidadesUnicas}
          onAlocar={onAlocarSlot}
          onFechar={() => setSlotSelecionado(null)}
        />
      )}
    </div>
  );
}
