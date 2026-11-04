"use client";

import type {
  AlocacaoSlotMatriz,
  CatalogoCalafrio,
  HabilidadeUnicaCalafrio,
} from "@calafrio/core";
import { TOKENS_PERSONALIDADE } from "@calafrio/tema";
import { useState } from "react";

interface SeletorHabilidadeModalProps {
  slot: number;
  catalogo: CatalogoCalafrio;
  habilidadesUnicas: HabilidadeUnicaCalafrio[];
  onAlocar: (slot: number, alocacao: AlocacaoSlotMatriz) => void;
  onFechar: () => void;
}

export function SeletorHabilidadeModal({
  slot,
  catalogo,
  habilidadesUnicas,
  onAlocar,
  onFechar,
}: SeletorHabilidadeModalProps) {
  const [filtro, setFiltro] = useState<string>("todas");
  const [busca, setBusca] = useState("");

  const habilidades = catalogo.habilidadesParanormais.filter(
    (h) =>
      (filtro === "todas" || h.personalidade === filtro) &&
      h.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  const alocar = (tipo: AlocacaoSlotMatriz["tipo"], id: string) => {
    onAlocar(slot, { slot, tipo, id });
    onFechar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="calafrio-card flex max-h-[85vh] w-full max-w-2xl flex-col space-y-4 border-2 border-amber-400 p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="calafrio-tag">ALOCAR NO SLOT #{slot + 1}</span>
          <button
            type="button"
            onClick={onFechar}
            className="cursor-pointer text-sm font-bold text-muted-foreground hover:text-foreground"
          >
            ✕ Fechar
          </button>
        </div>

        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar habilidade..."
          className="rounded border border-border bg-card p-2 text-xs"
        />

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Filtrar:</span>
          {[
            ["todas", "Todas"],
            ...Object.entries(TOKENS_PERSONALIDADE).map(([k, t]) => [
              k,
              `${t.emoji} ${t.nome}`,
            ]),
          ].map(([chave, rotulo]) => (
            <button
              key={chave}
              type="button"
              onClick={() => setFiltro(chave)}
              className={`cursor-pointer rounded px-2 py-1 text-xs ${
                filtro === chave
                  ? "bg-amber-400 font-bold text-black"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {rotulo}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {habilidadesUnicas.length > 0 && (
            <div className="mb-3 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-ink">
                Suas Habilidades Únicas:
              </span>
              {habilidadesUnicas.map((u) => (
                <button
                  type="button"
                  key={u.id}
                  onClick={() => alocar("unica", u.id)}
                  className="flex w-full cursor-pointer items-center justify-between rounded border border-amber-500/40 bg-card p-2.5 text-left transition-colors hover:bg-muted"
                >
                  <div>
                    <div className="text-sm font-bold text-accent-ink">
                      {u.nome}
                    </div>
                    <p className="line-clamp-1 text-xs text-foreground/80">
                      {u.descricao}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-accent-ink">
                    {u.custo} {u.recurso.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          )}

          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Catálogo Oficial ({habilidades.length}):
          </span>
          {habilidades.map((hab) => {
            const token = TOKENS_PERSONALIDADE[hab.personalidade];
            const cor =
              hab.dominio === "positivo"
                ? token.corPositiva
                : token.corNegativa;
            return (
              <button
                type="button"
                key={hab.id}
                onClick={() => alocar("paranormal", hab.id)}
                style={{ borderLeftColor: cor, borderLeftWidth: 4 }}
                className="flex w-full cursor-pointer items-center justify-between gap-3 rounded border border-border bg-card p-2.5 text-left transition-colors hover:bg-muted"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{hab.nome}</span>
                    <span
                      style={{ backgroundColor: cor }}
                      className="rounded-xs px-1.5 py-0.5 text-[9px] font-extrabold text-white"
                    >
                      {token.nome} ({hab.dominio})
                    </span>
                    <span className="text-[10px] capitalize text-muted-foreground">
                      {hab.tipoAcao}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-foreground/80">
                    {hab.descricao}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-bold text-accent-ink">
                  {hab.custoPA === 0 ? "0 PA" : `${hab.custoPA} PA`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
