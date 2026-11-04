"use client";

import type { FichaCalafrio } from "@calafrio/core";
import { useFichaCalafrio } from "@calafrio/ficha-app";
import {
  ArrowLeft,
  Dices,
  Moon,
  Skull,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FichaCelular } from "@/components/ficha/celular/ficha-celular";
import type {
  PaginaFicha,
} from "@/components/ficha/fichas-tipos";
import { ModalDanoCura } from "@/components/ficha/modal-dano-cura";
import { ModalRolagemCalafrio } from "@/components/ficha/modal-rolagem-calafrio";
import { VisualizadorPapel } from "@/components/ficha/visualizador-papel";
import {
  formatarContestacao,
  formatarTesteAcao,
} from "@/components/mesa/formatar-rolagem";
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

  const abrirRolagem = (nome?: string) => {
    setPalavraChaveRolagem(nome);
    setMostrarRolagem(true);
  };

  return (
    <div className="w-full">
      <div className="hidden sm:block space-y-5 mx-auto max-w-[920px]">
        <div className="mb-5 flex w-full flex-wrap items-center justify-between gap-2 rounded-sm border-2 border-black bg-[#f7f7f5] p-2.5 shadow-[2px_2px_0px_#000]">
          <div className="flex items-center gap-2">
            <Link href={`/mesa/${mesaId}/players`} className={botaoClaro}>
              <ArrowLeft className="size-4" /> Players
            </Link>
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
        />
      </div>

      <div className="sm:hidden">
        <FichaCelular
          f={f}
          voltarHref={`/mesa/${mesaId}/players`}
          onAbrirRolagem={abrirRolagem}
          onAbrirDanoCura={() => setMostrarDanoCura(true)}
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
