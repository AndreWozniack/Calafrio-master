"use client";

import { carregarCatalogoCalafrio } from "@calafrio/core";
import { useMemo, useState } from "react";
import { SecaoArsenalESuporte } from "./secao-arsenal-e-suporte";
import { SecaoHabilidadesBiblioteca } from "./secao-habilidades-biblioteca";
import { SecaoPdfViewer } from "./secao-pdf-viewer";
import { SecaoTabelasD100 } from "./secao-tabelas-d100";

export function VisaoBiblioteca() {
  const catalogo = useMemo(() => carregarCatalogoCalafrio(), []);

  const [abaAtiva, setAbaAtiva] = useState<
    "habilidades" | "tabelas" | "arsenal" | "glossario" | "pdfs"
  >("habilidades");

  return (
    <div className="space-y-6">
      {/* Navegação de Abas da Biblioteca */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-card border-2 border-border rounded-md shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-black">
          <button
            type="button"
            onClick={() => setAbaAtiva("habilidades")}
            className={`px-4 py-2 rounded-md cursor-pointer transition-all ${
              abaAtiva === "habilidades"
                ? "bg-amber-400 text-black shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
          >
            ✨ 60 Habilidades
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("tabelas")}
            className={`px-4 py-2 rounded-md cursor-pointer transition-all ${
              abaAtiva === "tabelas"
                ? "bg-amber-400 text-black shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
          >
            🎲 Tabelas d100
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("arsenal")}
            className={`px-4 py-2 rounded-md cursor-pointer transition-all ${
              abaAtiva === "arsenal"
                ? "bg-amber-400 text-black shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
          >
            ⚔️ Arsenal & Suporte
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("glossario")}
            className={`px-4 py-2 rounded-md cursor-pointer transition-all ${
              abaAtiva === "glossario"
                ? "bg-amber-400 text-black shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
          >
            📖 Glossário
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("pdfs")}
            className={`px-4 py-2 rounded-md cursor-pointer transition-all ${
              abaAtiva === "pdfs"
                ? "bg-amber-400 text-black shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
          >
            📑 PDFs Oficiais
          </button>
        </div>
      </div>

      {abaAtiva === "habilidades" && (
        <SecaoHabilidadesBiblioteca catalogo={catalogo} />
      )}

      {abaAtiva === "tabelas" && <SecaoTabelasD100 catalogo={catalogo} />}

      {abaAtiva === "arsenal" && <SecaoArsenalESuporte catalogo={catalogo} />}

      {abaAtiva === "glossario" && (
        <div className="calafrio-card p-5 space-y-4">
          <span className="calafrio-tag text-xs sm:text-sm">
            GLOSSÁRIO OFICIAL — CALAFRIO 2E
          </span>
          <div className="entrada-lista grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {catalogo.glossario.map((g) => (
              <div
                key={g.termo}
                className="p-4 rounded-md bg-muted/40 border border-border shadow-xs"
              >
                <div className="font-black text-base sm:text-lg text-accent-ink mb-1.5">
                  {g.termo}
                </div>
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-medium">
                  {g.definicao}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {abaAtiva === "pdfs" && <SecaoPdfViewer />}
    </div>
  );
}
