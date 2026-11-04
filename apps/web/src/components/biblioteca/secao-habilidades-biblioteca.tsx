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
        <div className="relative flex-1 min-w-[200px]">
          <Search className="size-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar habilidade ou efeito..."
            className="w-full bg-muted/60 pl-9 pr-3 py-2 rounded text-xs border border-border"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filtroPersonalidade}
            onChange={(e) => setFiltroPersonalidade(e.target.value)}
            className="bg-muted p-2 rounded border border-border"
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
            className="bg-muted p-2 rounded border border-border"
          >
            <option value="todos">Todos os Domínios</option>
            <option value="positivo">Domínio Positivo</option>
            <option value="negativo">Domínio Negativo</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {habilidadesFiltradas.map((hab) => {
          const token = TOKENS_PERSONALIDADE[hab.personalidade];
          const cor =
            hab.dominio === "positivo" ? token.corPositiva : token.corNegativa;
          return (
            <div
              key={hab.id}
              style={{ borderTopColor: cor, borderTopWidth: 4 }}
              className="calafrio-card p-4 flex flex-col justify-between space-y-2.5"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-base text-foreground">
                    {hab.nome}
                  </span>
                  <span
                    style={{ backgroundColor: cor }}
                    className="text-[9px] text-white font-extrabold px-1.5 py-0.5 rounded-xs"
                  >
                    {token.nome} ({hab.dominio})
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
                  <span className="capitalize">{hab.tipoAcao}</span>
                  {hab.tempoPreparacao && <span>({hab.tempoPreparacao})</span>}
                  <span>·</span>
                  <span className="font-bold text-accent-ink">
                    {hab.custoPA === 0 ? "Passiva" : `${hab.custoPA} PA`}
                  </span>
                  {hab.requerFoco !== "nao" && (
                    <span className="text-accent-ink">· 🔒 Foco</span>
                  )}
                </div>

                <p className="text-xs text-foreground/80 mt-2 leading-relaxed">
                  {hab.descricao}
                </p>
              </div>

              <div className="text-[10px] text-muted-foreground pt-2 border-t border-border flex justify-between">
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
