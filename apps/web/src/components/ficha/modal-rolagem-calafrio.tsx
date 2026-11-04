"use client";

import {
  type FichaDerivadaCalafrio,
  type ModoRolagemD20,
  type ResultadoContestacao,
  type ResultadoTesteAcao,
  rolarContestacao,
  rolarTesteAcao,
} from "@calafrio/core";
import { Dices } from "lucide-react";
import { useState } from "react";
import { Campo, classeCampo } from "./modais/campos-modal";
import {
  BotaoPrincipal,
  BotaoSecundario,
  CascaModal,
} from "./modais/casca-modal";
import { FiltrosBiblioteca } from "./modais/lista-biblioteca";

interface ModalRolagemCalafrioProps {
  aberto: boolean;
  derivada: FichaDerivadaCalafrio;
  palavraChaveInicial?: string;
  onFechar: () => void;
  onRolou?: (
    resultado:
      | { tipo: "acao"; dados: ResultadoTesteAcao }
      | { tipo: "contestacao"; dados: ResultadoContestacao },
    nomeAcao: string,
  ) => void;
}

type TipoRolagem = "acao" | "contestacao";

const TIPOS: { id: TipoRolagem; rotulo: string }[] = [
  { id: "acao", rotulo: "Teste de ação" },
  { id: "contestacao", rotulo: "Contestação" },
];

const MODOS: ModoRolagemD20[] = ["normal", "vantagem", "desvantagem"];

const DIFICULDADES = [
  { valor: 10, rotulo: "Muito simples (10)" },
  { valor: 13, rotulo: "Simples (13)" },
  { valor: 15, rotulo: "Moderado (15)" },
  { valor: 17, rotulo: "Difícil (17)" },
  { valor: 20, rotulo: "Impossível (20+)" },
];

const ESTILO_VITORIA = "border-black bg-amber-100";
const ESTILO_DERROTA = "border-black bg-black text-white";

export function ModalRolagemCalafrio({
  aberto,
  ...resto
}: ModalRolagemCalafrioProps) {
  if (!aberto) return null;
  return <ConteudoModal {...resto} />;
}

function ConteudoModal({
  derivada,
  palavraChaveInicial,
  onFechar,
  onRolou,
}: Omit<ModalRolagemCalafrioProps, "aberto">) {
  const [tipo, setTipo] = useState<TipoRolagem>("acao");
  const [modo, setModo] = useState<ModoRolagemD20>("normal");
  const [dificuldade, setDificuldade] = useState(15);
  const [nomeAcao, setNomeAcao] = useState(palavraChaveInicial ?? "Ação geral");
  const [aptOponente, setAptOponente] = useState(2);
  const [pdOponente, setPdOponente] = useState(6);
  const [resultadoAcao, setResultadoAcao] = useState<ResultadoTesteAcao | null>(
    null,
  );
  const [resultadoContestacao, setResultadoContestacao] =
    useState<ResultadoContestacao | null>(null);

  const rolar = () => {
    if (tipo === "acao") {
      const res = rolarTesteAcao({
        apt: derivada.apt,
        bonusExtra: 0,
        modo,
        dificuldade,
      });
      setResultadoAcao(res);
      setResultadoContestacao(null);
      onRolou?.({ tipo: "acao", dados: res }, nomeAcao);
      return;
    }
    const res = rolarContestacao({
      aptAtacante: derivada.apt,
      bonusAtacante: 0,
      modoAtacante: modo,
      aptVitima: aptOponente,
      pdVitima: pdOponente,
      modoVitima: "normal",
    });
    setResultadoContestacao(res);
    setResultadoAcao(null);
    onRolou?.({ tipo: "contestacao", dados: res }, nomeAcao);
  };

  return (
    <CascaModal
      titulo={`d20 + APT (${derivada.apt})`}
      onFechar={onFechar}
      rodape={
        <>
          <BotaoSecundario onClick={onFechar}>Fechar</BotaoSecundario>
          <BotaoPrincipal onClick={rolar}>
            <Dices className="size-5" /> Lançar d20
          </BotaoPrincipal>
        </>
      }
    >
      <div className="space-y-4">
        <FiltrosBiblioteca
          opcoes={TIPOS}
          ativo={tipo}
          onMudar={(t) => {
            setTipo(t);
            setResultadoAcao(null);
            setResultadoContestacao(null);
          }}
        />

        <Campo rotulo="Ação">
          <input
            value={nomeAcao}
            onChange={(e) => setNomeAcao(e.target.value)}
            placeholder="Desviar, blefar, atacar com navalha..."
            className={classeCampo}
          />
        </Campo>

        <div className="space-y-1">
          <span className="block text-sm font-extrabold uppercase tracking-wide text-black/70">
            Modo do d20
          </span>
          <div className="grid grid-cols-3 border-2 border-black">
            {MODOS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setModo(m)}
                className={`min-h-11 cursor-pointer text-sm font-extrabold capitalize ${
                  modo === m ? "bg-black text-white" : "bg-white"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {tipo === "acao" ? (
          <Campo rotulo="Dificuldade">
            <select
              value={dificuldade}
              onChange={(e) => setDificuldade(Number(e.target.value))}
              className={classeCampo}
            >
              {DIFICULDADES.map((d) => (
                <option key={d.valor} value={d.valor}>
                  {d.rotulo}
                </option>
              ))}
            </select>
          </Campo>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Campo rotulo="APT do oponente">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={6}
                value={aptOponente}
                onChange={(e) => setAptOponente(Number(e.target.value))}
                className={classeCampo}
              />
            </Campo>
            <Campo rotulo="PD do oponente">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={pdOponente}
                onChange={(e) => setPdOponente(Number(e.target.value))}
                className={classeCampo}
              />
            </Campo>
          </div>
        )}

        {resultadoAcao && <ResultadoAcao r={resultadoAcao} />}
        {resultadoContestacao && <ResultadoDisputa r={resultadoContestacao} />}
      </div>
    </CascaModal>
  );
}

function ResultadoAcao({ r }: { r: ResultadoTesteAcao }) {
  const veredito =
    r.critico === "sucesso_critico"
      ? "20 natural — sucesso crítico!"
      : r.critico === "falha_critica"
        ? "1 natural — pior falha possível!"
        : r.sucesso
          ? `Sucesso vs dificuldade ${r.dificuldade}`
          : `Falha vs dificuldade ${r.dificuldade}`;
  return (
    <div
      className={`space-y-1 border-[3px] p-4 text-center ${r.sucesso ? ESTILO_VITORIA : ESTILO_DERROTA}`}
    >
      <div className="text-5xl font-black leading-none">{r.total}</div>
      <div className="text-sm font-bold">
        d20 ({r.dados.join(", ")}) → {r.dadoEscolhido} + APT {r.apt}
      </div>
      <div className="text-base font-extrabold uppercase">{veredito}</div>
    </div>
  );
}

function ResultadoDisputa({ r }: { r: ResultadoContestacao }) {
  const venceu = r.vencedor === "atacante";
  return (
    <div
      className={`space-y-2 border-[3px] p-4 text-center ${venceu ? ESTILO_VITORIA : ESTILO_DERROTA}`}
    >
      <div className="flex items-center justify-around">
        <div>
          <div className="text-xs font-bold uppercase">Você</div>
          <div className="text-4xl font-black">{r.totalAtacante}</div>
        </div>
        <div className="text-lg font-bold">VS</div>
        <div>
          <div className="text-xs font-bold uppercase">
            {r.pisoPdAplicado ? `Piso PD ${r.pdVitima}` : "Oponente"}
          </div>
          <div className="text-4xl font-black">{r.totalEfetivoVitima}</div>
        </div>
      </div>
      <div className="border-t-2 border-current pt-2 text-base font-extrabold uppercase">
        {venceu ? "Contestação vencida!" : "O alvo resistiu"}
      </div>
    </div>
  );
}
