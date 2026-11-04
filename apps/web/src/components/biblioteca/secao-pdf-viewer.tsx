"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";

export function SecaoPdfViewer() {
  const [pdfAtivo, setPdfAtivo] = useState<string>(
    "/assets/calafrio/2e-V1HabilidadesParanormais_Calafrio.pdf",
  );

  return (
    <div className="calafrio-card p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border pb-4">
        <span className="calafrio-tag text-xs sm:text-sm">
          DOCUMENTOS OFICIAIS (PDF)
        </span>
        <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-black">
          <button
            type="button"
            onClick={() =>
              setPdfAtivo(
                "/assets/calafrio/2e-V1HabilidadesParanormais_Calafrio.pdf",
              )
            }
            className={`px-4 py-2 rounded-md cursor-pointer transition-all ${
              pdfAtivo.includes("Habilidades")
                ? "bg-amber-400 text-black shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Habilidades Paranormais
          </button>
          <button
            type="button"
            onClick={() =>
              setPdfAtivo("/assets/calafrio/2e-V1FichaConsulta_Calafrio.pdf")
            }
            className={`px-4 py-2 rounded-md cursor-pointer transition-all ${
              pdfAtivo.includes("Consulta")
                ? "bg-amber-400 text-black shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Ficha de Consulta Rápida
          </button>
          <button
            type="button"
            onClick={() =>
              setPdfAtivo("/assets/calafrio/2e-V1_FichaPersonagem_Calafrio.pdf")
            }
            className={`px-4 py-2 rounded-md cursor-pointer transition-all ${
              pdfAtivo.includes("FichaPersonagem")
                ? "bg-amber-400 text-black shadow-xs"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Ficha de Personagem
          </button>
          <a
            href={pdfAtivo}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-muted hover:bg-border rounded-md text-sm sm:text-base font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          >
            <ExternalLink className="size-4" /> Abrir em Nova Aba
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
