"use client";

import React, { useMemo, useState } from "react";
import { carregarCatalogoCalafrio } from "@calafrio/core";
import { SecaoHabilidadesBiblioteca } from "./secao-habilidades-biblioteca";
import { SecaoTabelasD100 } from "./secao-tabelas-d100";
import { SecaoArsenalESuporte } from "./secao-arsenal-e-suporte";
import { SecaoPdfViewer } from "./secao-pdf-viewer";

export function VisaoBiblioteca() {
  const catalogo = useMemo(() => carregarCatalogoCalafrio(), []);

  const [abaAtiva, setAbaAtiva] = useState<
    "habilidades" | "tabelas" | "arsenal" | "glossario" | "pdfs"
  >("habilidades");

  return (
    <div className="space-y-6">
      {/* Navegação de Abas da Biblioteca */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-card border border-border rounded-md shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setAbaAtiva("habilidades")}
            className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
              abaAtiva === "habilidades"
                ? "bg-amber-400 text-black"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            ✨ 60 Habilidades
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("tabelas")}
            className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
              abaAtiva === "tabelas"
                ? "bg-amber-400 text-black"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            🎲 Tabelas d100
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("arsenal")}
            className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
              abaAtiva === "arsenal"
                ? "bg-amber-400 text-black"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            ⚔️ Arsenal & Suporte
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("glossario")}
            className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
              abaAtiva === "glossario"
                ? "bg-amber-400 text-black"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            📖 Glossário
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("pdfs")}
            className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
              abaAtiva === "pdfs"
                ? "bg-amber-400 text-black"
                : "bg-muted text-muted-foreground hover:text-foreground"
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
        <div className="calafrio-card p-4 space-y-3">
          <span className="calafrio-tag">GLOSSÁRIO OFICIAL — CALAFRIO 2E</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {catalogo.glossario.map((g) => (
              <div key={g.termo} className="p-3 rounded bg-muted/30 border border-border">
                <div className="font-black text-sm text-amber-400 mb-1">{g.termo}</div>
                <p className="text-xs text-foreground/80 leading-relaxed">{g.definicao}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {abaAtiva === "pdfs" && <SecaoPdfViewer />}
    </div>
  );
}
