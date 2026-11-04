"use client";

import React, { useState } from "react";
import { ExternalLink } from "lucide-react";

export function SecaoPdfViewer() {
  const [pdfAtivo, setPdfAtivo] = useState<string>(
    "/assets/calafrio/2e-V1HabilidadesParanormais_Calafrio.pdf",
  );

  return (
    <div className="calafrio-card p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <span className="calafrio-tag">DOCUMENTOS OFICIAIS (PDF)</span>
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() =>
              setPdfAtivo("/assets/calafrio/2e-V1HabilidadesParanormais_Calafrio.pdf")
            }
            className={`px-3 py-1.5 rounded cursor-pointer ${
              pdfAtivo.includes("Habilidades")
                ? "bg-amber-400 text-black"
                : "bg-muted text-muted-foreground"
            }`}
          >
            Habilidades Paranormais
          </button>
          <button
            type="button"
            onClick={() =>
              setPdfAtivo("/assets/calafrio/2e-V1FichaConsulta_Calafrio.pdf")
            }
            className={`px-3 py-1.5 rounded cursor-pointer ${
              pdfAtivo.includes("Consulta")
                ? "bg-amber-400 text-black"
                : "bg-muted text-muted-foreground"
            }`}
          >
            Ficha de Consulta Rápida
          </button>
          <button
            type="button"
            onClick={() =>
              setPdfAtivo("/assets/calafrio/2e-V1_FichaPersonagem_Calafrio.pdf")
            }
            className={`px-3 py-1.5 rounded cursor-pointer ${
              pdfAtivo.includes("FichaPersonagem")
                ? "bg-amber-400 text-black"
                : "bg-muted text-muted-foreground"
            }`}
          >
            Ficha de Personagem
          </button>
          <a
            href={pdfAtivo}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 bg-muted hover:bg-border rounded text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ExternalLink className="size-3.5" /> Abrir em Nova Aba
          </a>
        </div>
      </div>

      <div className="w-full h-[750px] border border-border rounded overflow-hidden bg-black/40">
        <iframe
          src={pdfAtivo}
          className="w-full h-full border-0"
          title="Leitor de PDF Oficial Calafrio"
        />
      </div>
    </div>
  );
}
