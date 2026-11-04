"use client";

import type {
  AlocacaoSlotMatriz,
  CatalogoCalafrio,
  FichaCalafrio,
  FichaDerivadaCalafrio,
  HabilidadeUnicaCalafrio,
} from "@calafrio/core";
import { TOKENS_PERSONALIDADE } from "@calafrio/tema";
import { AlertTriangle, Sparkles } from "lucide-react";
import { useState } from "react";
import { CardSlotMatriz } from "./card-slot-matriz";
import { PainelEcosERegras } from "./painel-ecos-e-regras";

interface PaginaVersoMatrizProps {
  ficha: FichaCalafrio;
  derivada: FichaDerivadaCalafrio;
  catalogo: CatalogoCalafrio;
  onAlocarSlot: (slot: number, alocacao: AlocacaoSlotMatriz) => void;
  onLimparSlot: (slot: number) => void;
  onAdicionarHabilidadeUnica: (unica: HabilidadeUnicaCalafrio) => void;
  onRemoverHabilidadeUnica: (id: string) => void;
  focoAtivoId?: string;
  onAlternarFoco?: (id: string) => void;
  onDefinirAnotacoes: (anotacoes: string) => void;
}

export function PaginaVersoMatriz({
  ficha,
  derivada,
  catalogo,
  onAlocarSlot,
  onLimparSlot,
  onAdicionarHabilidadeUnica,
  onRemoverHabilidadeUnica,
  focoAtivoId,
  onAlternarFoco,
  onDefinirAnotacoes,
}: PaginaVersoMatrizProps) {
  const [slotSelecionado, setSlotSelecionado] = useState<number | null>(null);
  const [filtroPersonalidade, setFiltroPersonalidade] =
    useState<string>("todas");

  const habilidadesDisponiveis = catalogo.habilidadesParanormais.filter((h) => {
    if (
      filtroPersonalidade !== "todas" &&
      h.personalidade !== filtroPersonalidade
    )
      return false;
    // se já tem domínio definido, priorizar avisar
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Matriz 3x3 e Bônus de Alinhamento */}
      <div className="calafrio-card p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="calafrio-tag">HABILIDADES PARANORMAIS</span>
              <span className="text-xs text-muted-foreground font-semibold">
                NÚMERO MÁX. DE HABILIDADES = APT (
                {derivada.habilidadesMemorizadasCount} /{" "}
                {derivada.limiteHabilidadesMemorizadas})
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Alinhe habilidades da mesma personalidade para destravar bônus
              geométricos:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-muted rounded font-bold text-foreground/90 border border-border">
              ↔ Horizontal = +3 PA
            </span>
            <span className="px-2 py-1 bg-muted rounded font-bold text-foreground/90 border border-border">
              ↕ Vertical = +3 PD
            </span>
            <span className="px-2 py-1 bg-muted rounded font-bold text-foreground/90 border border-border">
              ⤢ Diagonal = +6 PV
            </span>
            <span className="px-2 py-1 bg-muted rounded font-bold text-foreground/90 border border-border">
              ⊞ Bloco 2x2 = +3 VEL
            </span>
          </div>
        </div>

        {/* Alinhamentos Ativos Atualmente */}
        {derivada.alinhamentosAtivos.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded">
            <span className="text-xs font-bold text-accent-ink flex items-center gap-1">
              <Sparkles className="size-3.5" /> Alinhamentos Ativos:
            </span>
            {derivada.alinhamentosAtivos.map((ali, idx) => (
              <span
                key={idx}
                className="text-[11px] font-black px-2 py-0.5 rounded bg-amber-400 text-black uppercase"
              >
                {ali.padrao}: {ali.bonusTexto} ({ali.personalidade})
              </span>
            ))}
          </div>
        )}

        {/* Avisos de Regra */}
        {derivada.avisosDeRegra.map((aviso, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 p-2.5 bg-red-950/40 border border-red-800/60 rounded text-xs text-red-200"
          >
            <AlertTriangle className="size-4 shrink-0 text-red-400" />
            <span>{aviso.mensagem}</span>
          </div>
        ))}

        {/* O Grid 3x3 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {Array.from({ length: 9 }).map((_, idx) => {
            const alocacao = ficha.matrizHabilidades.find(
              (m) => m.slot === idx,
            );
            return (
              <CardSlotMatriz
                key={idx}
                numeroSlot={idx}
                alocacao={alocacao}
                catalogo={catalogo}
                habilidadesUnicas={ficha.habilidadesUnicas}
                onSelecionar={(slot) => setSlotSelecionado(slot)}
                onLimpar={(slot) => onLimparSlot(slot)}
                focoAtivo={focoAtivoId === alocacao?.id}
                onAlternarFoco={onAlternarFoco}
              />
            );
          })}
        </div>
      </div>

      {/* Modal / Seletor de Habilidade para o Slot */}
      {slotSelecionado !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="calafrio-card p-5 max-w-2xl w-full max-h-[85vh] flex flex-col space-y-4 shadow-2xl border-2 border-amber-400">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="calafrio-tag">
                ALOCAR NO SLOT #{slotSelecionado + 1}
              </span>
              <button
                type="button"
                onClick={() => setSlotSelecionado(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold cursor-pointer"
              >
                ✕ Fechar
              </button>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Filtrar:</span>
              <button
                type="button"
                onClick={() => setFiltroPersonalidade("todas")}
                className={`text-xs px-2 py-1 rounded cursor-pointer ${
                  filtroPersonalidade === "todas"
                    ? "bg-amber-400 text-black font-bold"
                    : "bg-muted"
                }`}
              >
                Todas
              </button>
              {Object.entries(TOKENS_PERSONALIDADE).map(([key, token]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFiltroPersonalidade(key)}
                  className={`text-xs px-2 py-1 rounded cursor-pointer ${
                    filtroPersonalidade === key
                      ? "bg-amber-400 text-black font-bold"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {token.emoji} {token.nome}
                </button>
              ))}
            </div>

            {/* Lista com scroll */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {/* Opções de Habilidades Únicas */}
              {ficha.habilidadesUnicas.length > 0 && (
                <div className="space-y-1 mb-3">
                  <span className="text-[10px] font-bold text-accent-ink uppercase tracking-wider">
                    Suas Habilidades Únicas:
                  </span>
                  {ficha.habilidadesUnicas.map((u) => (
                    <div
                      key={u.id}
                      onClick={() => {
                        onAlocarSlot(slotSelecionado, {
                          slot: slotSelecionado,
                          tipo: "unica",
                          id: u.id,
                        });
                        setSlotSelecionado(null);
                      }}
                      className="p-2.5 rounded border border-amber-500/40 bg-card hover:bg-accent/20 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="font-bold text-sm text-accent-ink">
                          {u.nome}
                        </div>
                        <p className="text-xs text-foreground/80 line-clamp-1">
                          {u.descricao}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-accent-ink">
                        {u.custo} {u.recurso.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Habilidades do Catálogo */}
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Catálogo Oficial (60 habilidades):
              </span>
              {habilidadesDisponiveis.map((hab) => {
                const token = TOKENS_PERSONALIDADE[hab.personalidade];
                const cor =
                  hab.dominio === "positivo"
                    ? token.corPositiva
                    : token.corNegativa;
                return (
                  <div
                    key={hab.id}
                    onClick={() => {
                      onAlocarSlot(slotSelecionado, {
                        slot: slotSelecionado,
                        tipo: "paranormal",
                        id: hab.id,
                      });
                      setSlotSelecionado(null);
                    }}
                    style={{ borderLeftColor: cor, borderLeftWidth: 4 }}
                    className="p-2.5 rounded border border-border bg-card hover:bg-muted cursor-pointer flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">
                          {hab.nome}
                        </span>
                        <span
                          style={{ backgroundColor: cor }}
                          className="text-[9px] text-white font-extrabold px-1.5 py-0.5 rounded-xs"
                        >
                          {token.nome} ({hab.dominio})
                        </span>
                        <span className="text-[10px] text-muted-foreground capitalize">
                          {hab.tipoAcao}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/80 line-clamp-1 mt-0.5">
                        {hab.descricao}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-xs text-accent-ink">
                        {hab.custoPA === 0 ? "0 PA" : `${hab.custoPA} PA`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Gerenciador de Ecos + Anotações da Ficha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PainelEcosERegras
          ficha={ficha}
          derivada={derivada}
          onAdicionarHabilidadeUnica={onAdicionarHabilidadeUnica}
          onRemoverHabilidadeUnica={onRemoverHabilidadeUnica}
        />

        <div className="calafrio-card p-4 space-y-2">
          <span className="calafrio-tag">ANOTAÇÕES DA SESSÃO</span>
          <textarea
            value={ficha.anotacoes ?? ""}
            onChange={(e) => onDefinirAnotacoes(e.target.value)}
            placeholder="Pistas investigadas, NPCs encontrados, contatos no submundo curitibano..."
            rows={10}
            className="w-full bg-muted/40 text-xs p-3 rounded border border-border"
          />
        </div>
      </div>
    </div>
  );
}
