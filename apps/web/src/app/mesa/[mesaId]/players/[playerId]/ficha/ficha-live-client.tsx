"use client";

import type { FichaCalafrio } from "@calafrio/core";
import { useFichaCalafrio } from "@calafrio/ficha-app";
import {
  ArrowLeft,
  Dices,
  FileDown,
  Loader2,
  Moon,
  Skull,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FichaCelular } from "@/components/ficha/celular/ficha-celular";
import {
  CHAVE_STORAGE_ZOOM_FICHA,
  type NivelZoomFicha,
  obterConfigZoomFicha,
  type PaginaFicha,
} from "@/components/ficha/fichas-tipos";
import { ModalDanoCura } from "@/components/ficha/modal-dano-cura";
import { ModalRolagemCalafrio } from "@/components/ficha/modal-rolagem-calafrio";
import { SeletorZoomFicha } from "@/components/ficha/seletor-zoom-ficha";
import { VisualizadorPapel } from "@/components/ficha/visualizador-papel";
import {
  formatarContestacao,
  formatarTesteAcao,
} from "@/components/mesa/formatar-rolagem";
import {
  baixarArquivoPdfNoNavegador,
  formatarNomeArquivoPdf,
} from "@/services/pdf/disparar-download-pdf";
import { gerarPdfFichaEditavel } from "@/services/pdf/exportador-pdf-ficha";
import { registrarRolagemAction } from "../../../dados/actions";
import { salvarFichaPlayerAction } from "../../actions";

interface FichaLiveClientProps {
  mesaId: string;
  playerId: string;
  fichaInicial: FichaCalafrio;
}

const botaoBarra =
  "flex cursor-pointer items-center gap-1.5 rounded-sm border border-black px-3 py-2 text-xs font-bold shadow-[1px_1px_0px_#000] transition-all";
const botaoClaro = `${botaoBarra} bg-white text-black hover:bg-black hover:text-white`;

export function FichaLiveClient({
  mesaId,
  playerId,
  fichaInicial,
}: FichaLiveClientProps) {
  const f = useFichaCalafrio(fichaInicial, (nova) => {
    salvarFichaPlayerAction(playerId, nova);
  });

  const [pagina, setPagina] = useState<PaginaFicha>("frente");
  const [mostrarRolagem, setMostrarRolagem] = useState(false);
  const [mostrarDanoCura, setMostrarDanoCura] = useState(false);
  const [palavraChaveRolagem, setPalavraChaveRolagem] = useState<string>();
  const [zoom, setZoom] = useState<NivelZoomFicha>("100");
  const [exportandoPdf, setExportandoPdf] = useState(false);

  const exportarPdf = async () => {
    if (exportandoPdf) return;
    setExportandoPdf(true);
    try {
      const buffer = await gerarPdfFichaEditavel(
        f.ficha,
        f.derivada,
        f.catalogo,
      );
      const nomeArquivo = formatarNomeArquivoPdf(f.ficha.nome);
      baixarArquivoPdfNoNavegador(buffer, nomeArquivo);
    } catch (erro) {
      console.error("Erro ao exportar PDF:", erro);
      alert(
        "Não foi possível gerar o PDF. Verifique os dados e tente novamente.",
      );
    } finally {
      setExportandoPdf(false);
    }
  };

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE_STORAGE_ZOOM_FICHA);
      if (salvo && ["90", "100", "115", "130"].includes(salvo)) {
        setZoom(salvo as NivelZoomFicha);
      }
    } catch {
      // Ignora erro de localStorage
    }
  }, []);

  const mudarZoom = (novo: NivelZoomFicha) => {
    setZoom(novo);
    try {
      localStorage.setItem(CHAVE_STORAGE_ZOOM_FICHA, novo);
    } catch {
      // Ignora erro de localStorage
    }
  };

  const configZoom = obterConfigZoomFicha(zoom);

  const abrirRolagem = (nome?: string) => {
    setPalavraChaveRolagem(nome);
    setMostrarRolagem(true);
  };

  return (
    <div className="w-full">
      <div
        className="hidden sm:block space-y-5 mx-auto transition-[max-width] duration-200 ease-out"
        style={{ maxWidth: `${configZoom.larguraMaximaUmaPaginaPx}px` }}
      >
        <div className="mb-5 flex w-full flex-wrap items-center justify-between gap-2 rounded-sm border-2 border-black bg-[#f7f7f5] p-2.5 shadow-[2px_2px_0px_#000]">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/mesa/${mesaId}/players`} className={botaoClaro}>
              <ArrowLeft className="size-4" /> Players
            </Link>
            <SeletorZoomFicha zoom={zoom} onMudarZoom={mudarZoom} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => f.descansar("curto", 1, "fixo")}
              title="Descanso curto (1h: +9 PA)"
              className={botaoClaro}
            >
              <Sun className="size-4 text-amber-600" /> Descanso curto
            </button>
            <button
              type="button"
              onClick={() => f.descansar("longo", 8, "fixo")}
              title="Descanso longo (8h: +6 PV e todo o PA)"
              className={botaoClaro}
            >
              <Moon className="size-4 text-blue-600" /> Descanso longo
            </button>
            <button
              type="button"
              onClick={() => setMostrarDanoCura(true)}
              className={botaoClaro}
            >
              <Skull className="size-4" /> Dano / Cura
            </button>
            <button
              type="button"
              onClick={exportarPdf}
              disabled={exportandoPdf}
              title="Exportar ficha preenchida para PDF editável (AcroForm)"
              className={botaoClaro}
            >
              {exportandoPdf ? (
                <Loader2 className="size-4 animate-spin text-black" />
              ) : (
                <FileDown className="size-4 text-emerald-700" />
              )}
              {exportandoPdf ? "Exportando..." : "Exportar PDF"}
            </button>
            <button
              type="button"
              onClick={() => abrirRolagem()}
              className={`${botaoBarra} bg-black px-4 font-black text-white shadow-[2px_2px_0px_rgba(0,0,0,0.4)] hover:bg-black/85`}
            >
              <Dices className="size-4 text-amber-400" /> Rolar d20
            </button>
          </div>
        </div>

        <VisualizadorPapel
          f={f}
          pagina={pagina}
          onMudarPagina={setPagina}
          onAbrirRolagem={abrirRolagem}
          zoom={zoom}
        />
      </div>

      <div className="sm:hidden">
        <FichaCelular
          f={f}
          voltarHref={`/mesa/${mesaId}/players`}
          onAbrirRolagem={abrirRolagem}
          onAbrirDanoCura={() => setMostrarDanoCura(true)}
          onExportarPdf={exportarPdf}
          exportandoPdf={exportandoPdf}
        />
      </div>

      {mostrarRolagem && (
        <ModalRolagemCalafrio
          aberto={mostrarRolagem}
          derivada={f.derivada}
          palavraChaveInicial={palavraChaveRolagem}
          onFechar={() => setMostrarRolagem(false)}
          onRolou={(resultado, acao) => {
            const ctx = { mesaId, autor: f.ficha.nome || "Player", acao };
            const rolagem =
              resultado.tipo === "acao"
                ? formatarTesteAcao(resultado.dados, ctx)
                : formatarContestacao(resultado.dados, ctx);
            void registrarRolagemAction(rolagem);
          }}
        />
      )}

      {mostrarDanoCura && (
        <ModalDanoCura
          pvAtual={f.derivada.pvAtual}
          paAtual={f.derivada.paAtual}
          onDano={(valor, espectro, paMitigar) =>
            f.sofrerDano(valor, espectro, paMitigar)
          }
          onCurarPv={f.curarPv}
          onCurarPa={f.curarPa}
          onFechar={() => setMostrarDanoCura(false)}
        />
      )}
    </div>
  );
}
