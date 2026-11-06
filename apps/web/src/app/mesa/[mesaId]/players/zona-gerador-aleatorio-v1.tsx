"use client";

import {
  calcularFichaV1,
  type FichaCalafrioV1,
  type FichaDerivadaV1,
  gerarFichaV1Aleatoria,
  obterHabilidade1e,
} from "@calafrio/core";
import {
  Check,
  Coins,
  Dices,
  ExternalLink,
  Heart,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  Shield,
  Sparkles,
  Tag,
  User,
  X,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { criarPlayerAction } from "./actions";

interface ZonaGeradorAleatorioV1Props {
  mesaId: string;
}

export function ZonaGeradorAleatorioV1({
  mesaId,
}: ZonaGeradorAleatorioV1Props) {
  const router = useRouter();

  const [fichaSorteada, setFichaSorteada] = useState<FichaCalafrioV1 | null>(
    null,
  );
  const [derivada, setDerivada] = useState<FichaDerivadaV1 | null>(null);
  const [sorteando, setSorteando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      for (const t of timeouts) clearTimeout(t);
    };
  }, []);

  const agendar = (fn: () => void, ms: number) => {
    timeoutsRef.current.push(setTimeout(fn, ms));
  };

  const executarSorteio = () => {
    setSorteando(true);
    setSucesso(false);
    setErro(null);

    agendar(() => {
      const novaFicha = gerarFichaV1Aleatoria({ nivel: 1 });
      const novaDerivada = calcularFichaV1(novaFicha);
      setFichaSorteada(novaFicha);
      setDerivada(novaDerivada);
      setSorteando(false);
    }, 250);
  };

  const handleSalvar = async (redirecionarParaFicha: boolean) => {
    if (!fichaSorteada || salvando) return;
    setSalvando(true);
    setErro(null);
    try {
      const novo = await criarPlayerAction(mesaId, fichaSorteada);
      setSucesso(true);
      if (redirecionarParaFicha && novo?.id) {
        router.push(`/mesa/${mesaId}/players/${novo.id}/ficha`);
      } else {
        router.refresh();
        agendar(() => {
          setFichaSorteada(null);
          setDerivada(null);
          setSucesso(false);
        }, 1200);
      }
    } catch (e) {
      console.error("Erro ao salvar personagem aleatório 1e:", e);
      setErro("Não foi possível adicionar o personagem à mesa.");
    } finally {
      setSalvando(false);
    }
  };

  const ocupacao =
    fichaSorteada?.palavrasChave.find((pc) => pc.categoria === "ocupacao")
      ?.nome ?? "Investigador";

  const palavrasOutras =
    fichaSorteada?.palavrasChave.filter((pc) => pc.categoria !== "ocupacao") ??
    [];

  const primeiraHab = fichaSorteada?.habilidades[0];
  const habilidadeInfo = primeiraHab ? obterHabilidade1e(primeiraHab.id) : null;

  return (
    <div className="calafrio-card p-4 sm:p-5 border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card to-card space-y-4">
      {/* Cabeçalho da Zona de Forja */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-amber-400 text-black flex items-center justify-center shadow-xs">
            <Dices className={`size-5 ${sorteando ? "animate-spin" : ""}`} />
          </div>
          <div>
            <h2 className="text-base font-black uppercase tracking-wide text-foreground flex items-center gap-2">
              Forja Rápida de Investigador
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/30">
                Calafrio 1e
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Sorteie uma ficha clássica completa (Corpo, Mente, Alma, PM,
              árvore paranormal e equipamento) com 1 clique.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={executarSorteio}
          disabled={sorteando || salvando}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-black text-xs uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-black shadow-xs cursor-pointer transition-all active:scale-95 disabled:opacity-50 self-stretch sm:self-auto justify-center"
        >
          {sorteando ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Rolando Dados...
            </>
          ) : (
            <>
              <Dices className="size-4" />
              {fichaSorteada ? "Sortear Outro" : "Forjar Investigador"}
            </>
          )}
        </button>
      </div>

      {/* Prévia da Ficha Sorteada */}
      {fichaSorteada && derivada && (
        <div className="pt-3 border-t border-border/60 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Identidade & Vitais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-muted/40 p-3.5 rounded-xl border border-border/60">
            {/* Nome e Ocupação */}
            <div className="sm:col-span-2 space-y-1">
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Investigador Forjado
              </div>
              <div className="text-lg font-black text-foreground flex items-center gap-2">
                <User className="size-4 text-accent-ink shrink-0" />
                <span className="truncate">{fichaSorteada.nome}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-400/20 text-amber-900 dark:text-amber-300 border border-amber-400/30">
                  {ocupacao}
                </span>
                <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                  <Coins className="size-3.5 text-amber-500" />
                  {fichaSorteada.carteira.fundos} F$
                </span>
              </div>
            </div>

            {/* Vitais em Badges */}
            <div className="sm:col-span-2 flex items-center justify-start sm:justify-end gap-2 flex-wrap">
              <div className="px-2.5 py-1.5 rounded-lg bg-card border border-border text-center shadow-2xs">
                <div className="text-[10px] font-black text-muted-foreground uppercase">
                  BA
                </div>
                <div className="text-sm font-black text-foreground">
                  {derivada.ba}
                </div>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-center shadow-2xs">
                <div className="text-[10px] font-black text-red-700 dark:text-red-400 uppercase flex items-center justify-center gap-0.5">
                  <Heart className="size-3" /> PV
                </div>
                <div className="text-sm font-black text-red-700 dark:text-red-400">
                  {derivada.pvMax}
                </div>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-center shadow-2xs">
                <div className="text-[10px] font-black text-cyan-800 dark:text-cyan-400 uppercase flex items-center justify-center gap-0.5">
                  <Zap className="size-3" /> PA
                </div>
                <div className="text-sm font-black text-cyan-800 dark:text-cyan-400">
                  {derivada.paMax}
                </div>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg bg-card border border-border text-center shadow-2xs">
                <div className="text-[10px] font-black text-muted-foreground uppercase flex items-center justify-center gap-0.5">
                  <Shield className="size-3" /> PD
                </div>
                <div className="text-sm font-black text-foreground">
                  {derivada.pd}
                </div>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-center shadow-2xs">
                <div className="text-[10px] font-black text-purple-400 uppercase">
                  PM
                </div>
                <div className="text-sm font-black text-purple-300">
                  {derivada.pmGasto}/{derivada.pmMax}
                </div>
              </div>
            </div>
          </div>

          {/* Atributos & Habilidade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Tríade de Atributos */}
            <div className="bg-card p-3 rounded-xl border border-border space-y-2">
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                Tríade de Atributos
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-muted/30 border border-border">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">
                    Corpo
                  </div>
                  <div className="text-base font-black text-foreground">
                    {fichaSorteada.atributos.corpo}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-muted/30 border border-border">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">
                    Mente
                  </div>
                  <div className="text-base font-black text-foreground">
                    {fichaSorteada.atributos.mente}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-muted/30 border border-border">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">
                    Alma
                  </div>
                  <div className="text-base font-black text-foreground">
                    {fichaSorteada.atributos.alma}
                  </div>
                </div>
              </div>
            </div>

            {/* Habilidade Paranormal Sorteada */}
            <div className="bg-card p-3 rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-accent-ink" /> Habilidade
                  Memorizada
                </span>
                {habilidadeInfo && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/20">
                    Árvore {habilidadeInfo.arvore}
                  </span>
                )}
              </div>
              {habilidadeInfo ? (
                <div>
                  <div className="text-xs font-black text-foreground flex items-center gap-1.5">
                    <span>{habilidadeInfo.nome}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      (Grau {habilidadeInfo.grau} • {habilidadeInfo.custoPA} PA)
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                    {habilidadeInfo.descricao}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Nenhuma habilidade memorizada.
                </p>
              )}
            </div>
          </div>

          {/* Palavras-Chave & Inventário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-card p-3 rounded-xl border border-border space-y-2">
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="size-3.5 text-accent-ink" /> Palavras-Chave
              </span>
              <div className="flex flex-wrap gap-1.5">
                {palavrasOutras.map((pc) => (
                  <span
                    key={pc.id}
                    className="text-xs px-2 py-0.5 rounded-md bg-muted text-foreground border border-border font-medium"
                  >
                    {pc.nome}
                    <span className="text-[9px] text-muted-foreground ml-1 uppercase">
                      ({pc.categoria})
                    </span>
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-card p-3 rounded-xl border border-border space-y-2">
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Package className="size-3.5 text-accent-ink" /> Equipamento
              </span>
              <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                {fichaSorteada.inventario.map((item) => (
                  <span
                    key={item.id}
                    className="px-2 py-0.5 rounded-md bg-muted/60 border border-border text-foreground"
                  >
                    {item.nome} x{item.quantidade}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Feedback de Erro */}
          {erro && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 font-bold">
              {erro}
            </div>
          )}

          {/* Barra de Ações: Salvar / Descartar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-border/40">
            <button
              type="button"
              onClick={() => {
                setFichaSorteada(null);
                setDerivada(null);
              }}
              disabled={salvando}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="size-4" /> Descartar
            </button>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={executarSorteio}
                disabled={salvando || sorteando}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted text-xs font-black text-foreground cursor-pointer transition-colors shadow-2xs"
              >
                <RefreshCw className="size-3.5" /> Outro
              </button>

              <button
                type="button"
                onClick={() => handleSalvar(false)}
                disabled={salvando}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-card hover:bg-muted border border-border text-xs font-black text-foreground cursor-pointer transition-all shadow-2xs disabled:opacity-50"
              >
                {salvando ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : sucesso ? (
                  <Check className="size-3.5 text-emerald-500" />
                ) : (
                  <Plus className="size-3.5 text-accent-ink" />
                )}
                <span>Salvar na Mesa</span>
              </button>

              <button
                type="button"
                onClick={() => handleSalvar(true)}
                disabled={salvando}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-black cursor-pointer transition-all shadow-xs disabled:opacity-50"
              >
                {salvando ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <ExternalLink className="size-3.5" />
                )}
                <span>Salvar & Abrir Ficha</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
