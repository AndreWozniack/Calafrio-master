"use client";

import {
  carregarCatalogoCalafrio,
  type FichaCalafrio,
  type FichaCalafrioV1,
  gerarFichaAleatoria,
  gerarFichaV1Aleatoria,
  type SistemaVersao,
} from "@calafrio/core";
import {
  Check,
  Dices,
  ExternalLink,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { criarPlayerAction } from "@/app/mesa/[mesaId]/players/actions";
import type { MesaCalafrio } from "@/services/armazenamento-store";
import { CardPreview1e } from "./card-preview-1e";
import { CardPreview2e } from "./card-preview-2e";

export function GeradorUniversalClient({ mesas }: { mesas: MesaCalafrio[] }) {
  const router = useRouter();
  const catalogo = useMemo(() => carregarCatalogoCalafrio(), []);

  const [versao, setVersao] = useState<SistemaVersao>("1e");
  const [ficha1e, setFicha1e] = useState<FichaCalafrioV1 | null>(null);
  const [ficha2e, setFicha2e] = useState<FichaCalafrio | null>(null);

  const [mesaSelecionadaId, setMesaSelecionadaId] = useState<string>("");
  const [sorteando, setSorteando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const mesasCompativeis = useMemo(() => {
    return mesas.filter((m) => m.sistemaVersao === versao);
  }, [mesas, versao]);

  const executarSorteio = () => {
    setSorteando(true);
    setSucesso(false);
    setErro(null);

    setTimeout(() => {
      if (versao === "1e") {
        setFicha1e(gerarFichaV1Aleatoria({ nivel: 1 }));
      } else {
        setFicha2e(gerarFichaAleatoria(catalogo, { apt: 1 }));
      }
      setSorteando(false);
    }, 250);
  };

  const handleSalvar = async (abrirFicha: boolean) => {
    const fichaAtual = versao === "1e" ? ficha1e : ficha2e;
    if (!fichaAtual || !mesaSelecionadaId || salvando) return;

    setSalvando(true);
    setErro(null);

    try {
      const novo = await criarPlayerAction(mesaSelecionadaId, fichaAtual);
      setSucesso(true);
      if (abrirFicha && novo?.id) {
        router.push(`/mesa/${mesaSelecionadaId}/players/${novo.id}/ficha`);
      } else {
        setTimeout(() => {
          setSucesso(false);
        }, 2000);
      }
    } catch (e) {
      console.error("Erro ao salvar personagem:", e);
      setErro("Falha ao adicionar o personagem à mesa selecionada.");
    } finally {
      setSalvando(false);
    }
  };

  const temFicha = versao === "1e" ? !!ficha1e : !!ficha2e;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="calafrio-tag-sm">FERRAMENTA DE JOGO</span>
          <h1 className="text-2xl font-black font-heading tracking-wide text-foreground uppercase flex items-center gap-2 mt-1">
            <Dices className="size-6 text-accent-ink" /> Gerador de
            Investigadores
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gere fichas completas para qualquer edição de Calafrio com 1 clique.
          </p>
        </div>

        {/* Seletor de Edição */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/40 border border-border rounded-xl">
          <button
            type="button"
            onClick={() => {
              setVersao("1e");
              setMesaSelecionadaId("");
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              versao === "1e"
                ? "bg-amber-500 text-black shadow-xs font-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="size-3.5" /> Calafrio 1e (Clássica)
          </button>
          <button
            type="button"
            onClick={() => {
              setVersao("2e");
              setMesaSelecionadaId("");
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              versao === "2e"
                ? "bg-amber-500 text-black shadow-xs font-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="size-3.5" /> Calafrio 2e (Matriz 3×3)
          </button>
        </div>
      </div>

      {/* Card Principal da Forja */}
      <div className="calafrio-card p-5 border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card to-card space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black uppercase tracking-wide text-foreground flex items-center gap-2">
              Forjar Personagem • {versao === "1e" ? "1ª Edição" : "2ª Edição"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {versao === "1e"
                ? "Gera atributos (Corpo/Mente/Alma), PM, habilidades da árvore, ocupação e equipamentos."
                : "Gera APT, matriz 3×3 com domínio consistente, palavras-chave, arma e bugiganga d100."}
            </p>
          </div>

          <button
            type="button"
            onClick={executarSorteio}
            disabled={sorteando || salvando}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-black shadow-xs cursor-pointer transition-all active:scale-95 disabled:opacity-50 self-stretch sm:self-auto justify-center"
          >
            {sorteando ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Rolando...
              </>
            ) : (
              <>
                <Dices className="size-4" />
                {temFicha ? "Sortear Outro" : "Forjar Investigador"}
              </>
            )}
          </button>
        </div>

        {/* Prévia */}
        {versao === "1e" && ficha1e && (
          <div className="pt-3 border-t border-border/60">
            <CardPreview1e ficha={ficha1e} />
          </div>
        )}
        {versao === "2e" && ficha2e && (
          <div className="pt-3 border-t border-border/60">
            <CardPreview2e ficha={ficha2e} catalogo={catalogo} />
          </div>
        )}

        {/* Feedback de Erro */}
        {erro && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-500 font-bold">
            {erro}
          </div>
        )}

        {/* Barra de Ações com Mesas */}
        {temFicha && (
          <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                if (versao === "1e") setFicha1e(null);
                else setFicha2e(null);
              }}
              className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer self-start sm:self-center"
            >
              <X className="size-4" /> Descartar
            </button>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {mesasCompativeis.length > 0 && (
                <div className="flex items-center gap-2">
                  <select
                    value={mesaSelecionadaId}
                    onChange={(e) => setMesaSelecionadaId(e.target.value)}
                    className="bg-background border border-border rounded-lg px-3 py-2 text-xs font-bold text-foreground outline-none focus:border-amber-400"
                  >
                    <option value="">Selecione uma mesa...</option>
                    {mesasCompativeis.map((m) => (
                      <option key={m.id} value={m.id}>
                        Mesa: {m.nome}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleSalvar(false)}
                    disabled={!mesaSelecionadaId || salvando}
                    className="px-3.5 py-2 rounded-lg bg-card hover:bg-muted border border-border text-xs font-bold text-foreground cursor-pointer disabled:opacity-40 flex items-center gap-1.5 shadow-2xs"
                  >
                    {salvando ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : sucesso ? (
                      <Check className="size-3.5 text-emerald-400" />
                    ) : (
                      <Plus className="size-3.5 text-accent-ink" />
                    )}
                    <span>Salvar na Mesa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSalvar(true)}
                    disabled={!mesaSelecionadaId || salvando}
                    className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-black cursor-pointer disabled:opacity-40 flex items-center gap-1.5 shadow-xs"
                  >
                    <ExternalLink className="size-3.5" />
                    <span>Salvar & Abrir</span>
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={executarSorteio}
                disabled={sorteando || salvando}
                className="px-3 py-2 rounded-lg border border-border hover:bg-muted text-xs font-bold text-foreground cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <RefreshCw className="size-3.5" />
                <span>Outro</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
