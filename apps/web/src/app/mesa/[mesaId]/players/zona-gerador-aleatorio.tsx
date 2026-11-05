"use client";

import {
  carregarCatalogoCalafrio,
  type FichaCalafrio,
  type FichaDerivadaCalafrio,
  gerarFichaAleatoria,
  montarFichaCalafrio,
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
import { useEffect, useMemo, useRef, useState } from "react";
import { criarPlayerAction } from "./actions";

interface ZonaGeradorAleatorioProps {
  mesaId: string;
}

export function ZonaGeradorAleatorio({ mesaId }: ZonaGeradorAleatorioProps) {
  const router = useRouter();
  const catalogo = useMemo(() => carregarCatalogoCalafrio(), []);

  const [fichaSorteada, setFichaSorteada] = useState<FichaCalafrio | null>(
    null,
  );
  const [derivada, setDerivada] = useState<FichaDerivadaCalafrio | null>(null);
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

    // Pequeno delay para animação de dados
    agendar(() => {
      const novaFicha = gerarFichaAleatoria(catalogo, { apt: 1 });
      const novaDerivada = montarFichaCalafrio(novaFicha, catalogo);
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
      console.error("Erro ao salvar personagem aleatório:", e);
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

  const habilidadeInfo = useMemo(() => {
    if (!fichaSorteada || fichaSorteada.matrizHabilidades.length === 0)
      return null;
    const slot0 = fichaSorteada.matrizHabilidades[0];
    return catalogo.habilidadesParanormais.find((h) => h.id === slot0.id);
  }, [fichaSorteada, catalogo]);

  const armaEquipada = fichaSorteada?.inventario.find((i) =>
    i.categoria.startsWith("arma"),
  );
  const bugigangaItem = fichaSorteada?.inventario.find(
    (i) => i.categoria === "bugiganga",
  );

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
                100% Aleatório
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Sorteie uma ficha completa (ocupação d100, traços, matriz de
              domínio consistente, arma e bugiganga) com 1 clique.
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
              <div className="px-3 py-1.5 rounded-lg bg-card border border-border text-center shadow-2xs">
                <div className="text-[10px] font-black text-muted-foreground uppercase">
                  APT
                </div>
                <div className="text-sm font-black text-foreground">
                  {derivada.apt}
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-center shadow-2xs">
                <div className="text-[10px] font-black text-red-700 dark:text-red-400 uppercase flex items-center justify-center gap-0.5">
                  <Heart className="size-3" /> PV
                </div>
                <div className="text-sm font-black text-red-700 dark:text-red-400">
                  {derivada.pvMax}
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-center shadow-2xs">
                <div className="text-[10px] font-black text-cyan-800 dark:text-cyan-400 uppercase flex items-center justify-center gap-0.5">
                  <Zap className="size-3" /> PA
                </div>
                <div className="text-sm font-black text-cyan-800 dark:text-cyan-400">
                  {derivada.paMax}
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-card border border-border text-center shadow-2xs">
                <div className="text-[10px] font-black text-muted-foreground uppercase flex items-center justify-center gap-0.5">
                  <Shield className="size-3" /> PD
                </div>
                <div className="text-sm font-black text-foreground">
                  {derivada.pd}
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-card border border-border text-center shadow-2xs">
                <div className="text-[10px] font-black text-muted-foreground uppercase">
                  VEL
                </div>
                <div className="text-sm font-black text-foreground">
                  {derivada.velocidade}m
                </div>
              </div>
            </div>
          </div>

          {/* Habilidade Paranormal & Palavras-chave */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Habilidade Paranormal Sorteada */}
            <div className="bg-card p-3 rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-accent-ink" /> Habilidade
                  Memorizada (Matriz #
                  {fichaSorteada.matrizHabilidades[0]?.slot ?? 4})
                </span>
                {habilidadeInfo && (
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      habilidadeInfo.dominio === "positivo"
                        ? "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                        : "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800"
                    }`}
                  >
                    Domínio {habilidadeInfo.dominio} ·{" "}
                    {habilidadeInfo.personalidade}
                  </span>
                )}
              </div>

              {habilidadeInfo ? (
                <div>
                  <div className="font-black text-sm text-foreground">
                    {habilidadeInfo.nome}
                    <span className="ml-2 text-xs font-semibold text-muted-foreground">
                      (Custo: {habilidadeInfo.custoPA} PA · Ação{" "}
                      {habilidadeInfo.tipoAcao})
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {habilidadeInfo.descricao}
                  </p>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground italic">
                  Nenhuma habilidade selecionada.
                </div>
              )}
            </div>

            {/* Traços e Palavras-chave */}
            <div className="bg-card p-3 rounded-xl border border-border space-y-2">
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="size-3.5 text-accent-ink" /> Traços &
                Palavras-Chave (d100)
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30">
                  {ocupacao} (Ocupação)
                </span>
                {palavrasOutras.map((p) => (
                  <span
                    key={p.id}
                    className="text-xs font-semibold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border"
                  >
                    {p.nome}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Equipamento Inicial */}
          <div className="bg-muted/30 p-3 rounded-xl border border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <Package className="size-4 text-accent-ink" />
              <span className="font-bold text-foreground">Equipamentos:</span>
              {armaEquipada && (
                <span className="px-2 py-0.5 rounded bg-card border border-border font-medium">
                  🗡️ {armaEquipada.nome}
                  {armaEquipada.dano !== undefined &&
                    ` (Dano ${armaEquipada.dano})`}
                </span>
              )}
              {bugigangaItem && (
                <span className="px-2 py-0.5 rounded bg-card border border-border font-medium">
                  🎲 Bugiganga: {bugigangaItem.nome}
                </span>
              )}
            </div>

            <div className="text-muted-foreground text-[11px]">
              Tudo pronto para desbravar o submundo de Curitiba.
            </div>
          </div>

          {erro && (
            <p
              role="alert"
              className="text-xs font-bold text-red-700 dark:text-red-400"
            >
              {erro}
            </p>
          )}

          {/* Ações da Prévia */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setFichaSorteada(null);
                setDerivada(null);
              }}
              disabled={salvando}
              className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 cursor-pointer order-last sm:order-first"
            >
              <X className="size-3.5" /> Cancelar
            </button>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={executarSorteio}
                disabled={salvando || sorteando}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-bold text-xs bg-muted hover:bg-muted/80 text-foreground border border-border cursor-pointer transition-colors"
              >
                <RefreshCw
                  className={`size-3.5 ${sorteando ? "animate-spin" : ""}`}
                />
                Re-rolar
              </button>

              <button
                type="button"
                onClick={() => handleSalvar(false)}
                disabled={salvando}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider bg-card hover:bg-muted text-foreground border-2 border-border shadow-xs cursor-pointer transition-colors"
              >
                {sucesso ? (
                  <>
                    <Check className="size-4 text-green-600 dark:text-green-400" />
                    Adicionado!
                  </>
                ) : salvando ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Salvando...
                  </>
                ) : (
                  <>
                    <Plus className="size-4" /> Adicionar à Mesa
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSalvar(true)}
                disabled={salvando}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-black shadow-xs cursor-pointer transition-colors"
              >
                {salvando ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ExternalLink className="size-4" />
                )}
                Salvar e Abrir Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
