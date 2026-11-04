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

export function ModalRolagemCalafrio({
  aberto,
  derivada,
  palavraChaveInicial,
  onFechar,
  onRolou,
}: ModalRolagemCalafrioProps) {
  const [tipoRolagem, setTipoRolagem] = useState<"acao" | "contestacao">(
    "acao",
  );
  const [modo, setModo] = useState<ModoRolagemD20>("normal");
  const [dificuldade, setDificuldade] = useState<number>(15);
  const [bonusExtra, _setBonusExtra] = useState<number>(0);
  const [nomeAcao, setNomeAcao] = useState(palavraChaveInicial ?? "Ação Geral");

  // Parâmetros de Contestação
  const [aptOponente, setAptOponente] = useState<number>(2);
  const [pdOponente, setPdOponente] = useState<number>(6);
  const [modoOponente, _setModoOponente] = useState<ModoRolagemD20>("normal");

  const [resultadoAcao, setResultadoAcao] = useState<ResultadoTesteAcao | null>(
    null,
  );
  const [resultadoContestacao, setResultadoContestacao] =
    useState<ResultadoContestacao | null>(null);

  if (!aberto) return null;

  const lidarRolarAcao = () => {
    const res = rolarTesteAcao({
      apt: derivada.apt,
      bonusExtra,
      modo,
      dificuldade,
    });
    setResultadoAcao(res);
    setResultadoContestacao(null);
    onRolou?.({ tipo: "acao", dados: res }, nomeAcao);
  };

  const lidarRolarContestacao = () => {
    const res = rolarContestacao({
      aptAtacante: derivada.apt,
      bonusAtacante: bonusExtra,
      modoAtacante: modo,
      aptVitima: aptOponente,
      pdVitima: pdOponente,
      modoVitima: modoOponente,
    });
    setResultadoContestacao(res);
    setResultadoAcao(null);
    onRolou?.({ tipo: "contestacao", dados: res }, nomeAcao);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="calafrio-card p-5 max-w-lg w-full space-y-4 shadow-2xl border-2 border-amber-400">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex items-center gap-2">
            <span className="calafrio-tag">ROLAGEM DE DADOS</span>
            <span className="text-xs text-accent-ink font-bold">
              d20 + APT ({derivada.apt})
            </span>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="text-muted-foreground hover:text-foreground text-sm font-bold cursor-pointer"
          >
            ✕ Fechar
          </button>
        </div>

        {/* Tipo de Rolagem */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setTipoRolagem("acao");
              setResultadoContestacao(null);
            }}
            className={`py-2 text-xs font-bold rounded cursor-pointer ${
              tipoRolagem === "acao"
                ? "bg-amber-400 text-black shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            🎲 Teste de Ação (vs Dificuldade)
          </button>
          <button
            type="button"
            onClick={() => {
              setTipoRolagem("contestacao");
              setResultadoAcao(null);
            }}
            className={`py-2 text-xs font-bold rounded cursor-pointer ${
              tipoRolagem === "contestacao"
                ? "bg-amber-400 text-black shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            💥 Contestação (vs Alvo/PD)
          </button>
        </div>

        {/* Configuração do Teste */}
        <div className="space-y-3 bg-muted/30 p-3 rounded border border-border text-xs">
          <div>
            <label className="block text-muted-foreground mb-1 font-semibold">
              Identificação da Ação:
            </label>
            <input
              type="text"
              value={nomeAcao}
              onChange={(e) => setNomeAcao(e.target.value)}
              className="w-full bg-card p-1.5 rounded border border-border text-xs"
              placeholder="Ex.: Desviar, Blefar, Atacar com navalha..."
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <label className="block text-muted-foreground mb-1 font-semibold">
                Modo do d20:
              </label>
              <div className="flex gap-1">
                {(["normal", "vantagem", "desvantagem"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModo(m)}
                    className={`px-2 py-1 rounded capitalize cursor-pointer ${
                      modo === m
                        ? "bg-amber-400 text-black font-bold"
                        : "bg-card text-muted-foreground"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {tipoRolagem === "acao" && (
              <div>
                <label className="block text-muted-foreground mb-1 font-semibold">
                  Dificuldade:
                </label>
                <select
                  value={dificuldade}
                  onChange={(e) => setDificuldade(Number(e.target.value))}
                  className="bg-card p-1.5 rounded border border-border"
                >
                  <option value={10}>Muito Simples (10)</option>
                  <option value={13}>Simples (13)</option>
                  <option value={15}>Moderado (15)</option>
                  <option value={17}>Difícil (17)</option>
                  <option value={20}>Impossível (20+)</option>
                </select>
              </div>
            )}
          </div>

          {tipoRolagem === "contestacao" && (
            <div className="pt-2 border-t border-border grid grid-cols-2 gap-2">
              <div>
                <label className="block text-muted-foreground mb-1">
                  APT do Oponente:
                </label>
                <input
                  type="number"
                  min={0}
                  max={6}
                  value={aptOponente}
                  onChange={(e) => setAptOponente(Number(e.target.value))}
                  className="w-full bg-card p-1.5 rounded border border-border"
                />
              </div>
              <div>
                <label className="block text-muted-foreground mb-1">
                  PD do Oponente:
                </label>
                <input
                  type="number"
                  min={0}
                  value={pdOponente}
                  onChange={(e) => setPdOponente(Number(e.target.value))}
                  className="w-full bg-card p-1.5 rounded border border-border"
                />
              </div>
            </div>
          )}
        </div>

        {/* Botão de Lançamento */}
        <button
          type="button"
          onClick={
            tipoRolagem === "acao" ? lidarRolarAcao : lidarRolarContestacao
          }
          className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-sm rounded cursor-pointer flex items-center justify-center gap-2 transition-colors"
        >
          <Dices className="size-4" /> Lançar Dados
        </button>

        {/* Exibição do Resultado de Ação */}
        {resultadoAcao && (
          <div
            className={`p-4 rounded border-2 text-center space-y-1 ${
              resultadoAcao.sucesso
                ? "border-green-500/60 bg-green-950/20 text-green-200"
                : "border-red-500/60 bg-red-950/20 text-red-200"
            }`}
          >
            <div className="text-3xl font-black">{resultadoAcao.total}</div>
            <div className="text-xs font-bold">
              d20 ({resultadoAcao.dados.join(", ")}) ➔{" "}
              {resultadoAcao.dadoEscolhido} + APT ({resultadoAcao.apt})
            </div>
            <div className="text-sm font-extrabold uppercase tracking-wide mt-1">
              {resultadoAcao.critico === "sucesso_critico" &&
                "✨ 20 NATURAL — SUCESSO CRÍTICO!"}
              {resultadoAcao.critico === "falha_critica" &&
                "☠️ 1 NATURAL — PIOR FALHA POSSÍVEL!"}
              {resultadoAcao.critico === "nenhum" &&
                (resultadoAcao.sucesso
                  ? `SUCESSO (vs Dificuldade ${resultadoAcao.dificuldade})`
                  : `FALHA (vs Dificuldade ${resultadoAcao.dificuldade})`)}
            </div>
          </div>
        )}

        {/* Exibição do Resultado de Contestação */}
        {resultadoContestacao && (
          <div
            className={`p-4 rounded border-2 text-center space-y-2 ${
              resultadoContestacao.vencedor === "atacante"
                ? "border-green-500/60 bg-green-950/20 text-green-200"
                : "border-red-500/60 bg-red-950/20 text-red-200"
            }`}
          >
            <div className="flex items-center justify-around">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">
                  Seu Total
                </span>
                <div className="text-2xl font-black">
                  {resultadoContestacao.totalAtacante}
                </div>
                <span className="text-[10px]">
                  d20 ({resultadoContestacao.dadoEscolhidoAtacante}) +{" "}
                  {resultadoContestacao.aptAtacante}
                </span>
              </div>
              <div className="text-lg font-bold text-muted-foreground">VS</div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">
                  Oponente
                </span>
                <div className="text-2xl font-black">
                  {resultadoContestacao.totalEfetivoVitima}
                </div>
                <span className="text-[10px]">
                  {resultadoContestacao.pisoPdAplicado
                    ? `Piso PD (${resultadoContestacao.pdVitima})`
                    : `d20 (${resultadoContestacao.dadoEscolhidoVitima})`}
                </span>
              </div>
            </div>

            <div className="text-sm font-extrabold uppercase tracking-wide pt-2 border-t border-border/40">
              {resultadoContestacao.vencedor === "atacante"
                ? "🏆 SUCESSO NA CONTESTAÇÃO! O alvo sofre os efeitos."
                : "🛡️ O ALVO RESISTIU! O golpe foi mitigado/desviado."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
