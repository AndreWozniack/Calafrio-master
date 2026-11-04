"use client";

import type { CatalogoCalafrio } from "@calafrio/core";
import { TOKENS_PERSONALIDADE } from "@calafrio/tema";
import { Search } from "lucide-react";
import { useState } from "react";

interface SecaoHabilidadesBibliotecaProps {
  catalogo: CatalogoCalafrio;
}

export function SecaoHabilidadesBiblioteca({
  catalogo,
}: SecaoHabilidadesBibliotecaProps) {
  const [busca, setBusca] = useState("");
  const [filtroPersonalidade, setFiltroPersonalidade] =
    useState<string>("todas");
  const [filtroDominio, setFiltroDominio] = useState<string>("todos");

  const habilidadesFiltradas = catalogo.habilidadesParanormais.filter((h) => {
    if (
      filtroPersonalidade !== "todas" &&
      h.personalidade !== filtroPersonalidade
    ) {
      return false;
    }
    if (filtroDominio !== "todos" && h.dominio !== filtroDominio) {
      return false;
    }
    if (busca.trim()) {
      const termo = busca.toLowerCase();
      const matchNome = h.nome.toLowerCase().includes(termo);
      const matchDesc = h.descricao.toLowerCase().includes(termo);
      if (!matchNome && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 calafrio-card p-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="size-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar habilidade ou efeito..."
            className="w-full bg-muted/60 pl-11 pr-4 py-2.5 rounded text-sm sm:text-base border border-border outline-none font-medium text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold">
          <select
            value={filtroPersonalidade}
            onChange={(e) => setFiltroPersonalidade(e.target.value)}
            className="bg-muted p-2.5 rounded border border-border cursor-pointer font-bold text-foreground"
          >
            <option value="todas">Todas Personalidades</option>
            {Object.entries(TOKENS_PERSONALIDADE).map(([key, t]) => (
              <option key={key} value={key}>
                {t.emoji} {t.nome}
              </option>
            ))}
          </select>

          <select
            value={filtroDominio}
            onChange={(e) => setFiltroDominio(e.target.value)}
            className="bg-muted p-2.5 rounded border border-border cursor-pointer font-bold text-foreground"
          >
            <option value="todos">Todos os Domínios</option>
            <option value="positivo">Domínio Positivo</option>
            <option value="negativo">Domínio Negativo</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habilidadesFiltradas.map((hab) => {
          const token = TOKENS_PERSONALIDADE[hab.personalidade];
          const cor =
            hab.dominio === "positivo" ? token.corPositiva : token.corNegativa;
          return (
            <div
              key={hab.id}
              style={{ borderTopColor: cor, borderTopWidth: 4 }}
              className="calafrio-card p-5 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-black text-lg sm:text-xl text-foreground tracking-tight leading-tight">
                    {hab.nome}
                  </span>
                  <span
                    style={{ backgroundColor: cor }}
                    className="text-xs text-white font-black px-2 py-0.5 rounded-xs shrink-0 uppercase tracking-wide shadow-xs"
                  >
                    {token.nome} ({hab.dominio})
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-foreground/80 mt-1.5">
                  <span className="capitalize">{hab.tipoAcao}</span>
                  {hab.tempoPreparacao && <span>({hab.tempoPreparacao})</span>}
                  <span>·</span>
                  <span className="font-extrabold text-accent-ink text-sm sm:text-base">
                    {hab.custoPA === 0 ? "Passiva" : `${hab.custoPA} PA`}
                  </span>
                  {hab.requerFoco !== "nao" && (
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                      · 🔒 Foco
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base text-foreground/90 mt-2.5 leading-relaxed font-medium">
                  {hab.descricao}
                </p>
              </div>

              <div className="text-xs sm:text-sm font-semibold text-muted-foreground pt-2.5 border-t border-border flex justify-between">
                <span>{hab.alcance ?? "Toque / Pessoal"}</span>
                <span>{hab.duracao ?? "Instantâneo"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
