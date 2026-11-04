"use client";

import {
  aplicarAtividadeHabilidade,
  aplicarDanoCalafrio,
  aplicarDescansoCalafrio,
  type CatalogoCalafrio,
  carregarCatalogoCalafrio,
  criarEstadoDeJogoInicial,
  criarFichaCalafrioVazia,
  type EspectroDeDano,
  type EstadoDeJogoCalafrio,
  type FichaCalafrio,
  type FichaDerivadaCalafrio,
  montarFichaCalafrio,
} from "@calafrio/core";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { fichaCalafrioReducer } from "./ficha-reducer";

export function useFichaCalafrio(
  fichaParam?: FichaCalafrio,
  onSalvar?: (ficha: FichaCalafrio) => void,
) {
  const catalogo: CatalogoCalafrio = useMemo(
    () => carregarCatalogoCalafrio(),
    [],
  );

  const [ficha, dispatch] = useReducer(
    fichaCalafrioReducer,
    fichaParam,
    (inicial) => inicial ?? criarFichaCalafrioVazia("sem-ficha", ""),
  );

  const [estado, setEstado] = useState<EstadoDeJogoCalafrio>(() =>
    criarEstadoDeJogoInicial(),
  );

  // Sincronizar se a fichaParam mudar externamente
  useEffect(() => {
    if (fichaParam && fichaParam.id !== ficha.id) {
      dispatch({ tipo: "carregarFicha", ficha: fichaParam });
      setEstado(criarEstadoDeJogoInicial());
    }
  }, [fichaParam, ficha.id]);

  // Propaga edições para o gerenciador (que persiste a coleção inteira).
  useEffect(() => {
    if (onSalvar && fichaParam && fichaParam.id === ficha.id) onSalvar(ficha);
  }, [ficha, onSalvar, fichaParam]);

  // Recalcular a FichaDerivada de forma determinística
  const derivada: FichaDerivadaCalafrio = useMemo(
    () => montarFichaCalafrio(ficha, catalogo, estado),
    [ficha, catalogo, estado],
  );

  // Ações de jogo
  const sofrerDano = useCallback(
    (danoBruto: number, espectro: EspectroDeDano, paParaMitigar?: number) => {
      setEstado((prev) =>
        aplicarDanoCalafrio(ficha, catalogo, prev, {
          danoBruto,
          espectro,
          paParaMitigar,
        }),
      );
    },
    [ficha, catalogo],
  );

  const usarHabilidade = useCallback(
    (custo: number, recurso: "pa" | "pv" | "nenhum", ativarFocoId?: string) => {
      setEstado((prev) =>
        aplicarAtividadeHabilidade(ficha, catalogo, prev, {
          custo,
          recurso,
          ativarFocoId,
        }),
      );
    },
    [ficha, catalogo],
  );

  const descansar = useCallback(
    (
      tipo: "curto" | "longo",
      horas?: number,
      modo: "fixo" | "rolado" = "fixo",
    ) => {
      setEstado((prev) =>
        aplicarDescansoCalafrio(ficha, catalogo, prev, {
          tipo,
          horas,
          modo,
        }),
      );
    },
    [ficha, catalogo],
  );

  const curarPv = useCallback((pontos: number) => {
    setEstado((prev) => ({
      ...prev,
      danoSofrido: Math.max(0, prev.danoSofrido - pontos),
    }));
  }, []);

  const curarPa = useCallback((pontos: number) => {
    setEstado((prev) => ({
      ...prev,
      paGasto: Math.max(0, prev.paGasto - pontos),
    }));
  }, []);

  const alternarFoco = useCallback((focoId: string) => {
    setEstado((prev) => ({
      ...prev,
      focoAtivoId: prev.focoAtivoId === focoId ? undefined : focoId,
    }));
  }, []);

  const carregarFicha = useCallback((novaFicha: FichaCalafrio) => {
    dispatch({ tipo: "carregarFicha", ficha: novaFicha });
    setEstado(criarEstadoDeJogoInicial());
  }, []);

  return {
    ficha,
    derivada,
    estado,
    catalogo,
    dispatch,
    carregarFicha,
    curarPv,
    curarPa,
    alternarFoco,
    // Atalhos
    definirNome: (nome: string) => dispatch({ tipo: "definirNome", nome }),
    definirJogador: (jogador: string) =>
      dispatch({ tipo: "definirJogador", jogador }),
    definirApt: (apt: number) => dispatch({ tipo: "definirApt", apt }),
    definirCarteira: (fundos: number, espirions: number) =>
      dispatch({ tipo: "definirCarteira", fundos, espirions }),
    alocarSlotMatriz: (
      slot: number,
      tipo: "paranormal" | "unica",
      id: string,
    ) =>
      dispatch({
        tipo: "alocarSlotMatriz",
        slot,
        alocacao: { slot, tipo, id },
      }),
    limparSlotMatriz: (slot: number) =>
      dispatch({ tipo: "limparSlotMatriz", slot }),
    adicionarItem: (item: any) => dispatch({ tipo: "adicionarItem", item }),
    removerItem: (id: string) => dispatch({ tipo: "removerItem", id }),
    adicionarPalavraChave: (palavra: any) =>
      dispatch({ tipo: "adicionarPalavraChave", palavra }),
    removerPalavraChave: (id: string) =>
      dispatch({ tipo: "removerPalavraChave", id }),
    definirSuporteTabela: (
      tipoTabela: "djanho" | "familiar" | "lacaio",
      dado: number,
    ) => dispatch({ tipo: "definirSuporteTabela", tipoTabela, dado }),
    definirAnotacoes: (anotacoes: string) =>
      dispatch({ tipo: "definirAnotacoes", anotacoes }),
    // Ações de Combate / Sobrevivência
    sofrerDano,
    usarHabilidade,
    descansar,
  };
}
