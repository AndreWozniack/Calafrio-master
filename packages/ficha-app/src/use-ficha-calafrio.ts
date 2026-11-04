"use client";

import {
  type CatalogoCalafrio,
  type EstadoDeJogoCalafrio,
  type FichaCalafrio,
  type FichaDerivadaCalafrio,
  carregarCatalogoCalafrio,
  criarEstadoDeJogoInicial,
  montarFichaCalafrio,
  aplicarDanoCalafrio,
  aplicarAtividadeHabilidade,
  aplicarDescansoCalafrio,
  type EspectroDeDano,
} from "@calafrio/core";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { obterFichaInicial } from "./ficha-inicial";
import { type AcaoFichaCalafrio, fichaCalafrioReducer } from "./ficha-reducer";

const CHAVE_LOCAL_STORAGE = "calafrio:ficha-ativa:v1";

export function useFichaCalafrio() {
  const catalogo: CatalogoCalafrio = useMemo(() => carregarCatalogoCalafrio(), []);

  const [ficha, dispatch] = useReducer(
    fichaCalafrioReducer,
    undefined,
    () => {
      if (typeof window !== "undefined") {
        try {
          const salvo = localStorage.getItem(CHAVE_LOCAL_STORAGE);
          if (salvo) return JSON.parse(salvo) as FichaCalafrio;
        } catch {}
      }
      return obterFichaInicial();
    },
  );

  const [estado, setEstado] = useState<EstadoDeJogoCalafrio>(() =>
    criarEstadoDeJogoInicial(),
  );

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CHAVE_LOCAL_STORAGE, JSON.stringify(ficha));
      } catch {}
    }
  }, [ficha]);

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
    (tipo: "curto" | "longo", horas?: number, modo: "fixo" | "rolado" = "fixo") => {
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

  const resetarCombate = useCallback(() => {
    setEstado((prev) => ({
      ...prev,
      acoesPadraoRestantes: 2,
      acaoLivreRestante: 1,
      reflexoRestante: 1,
    }));
  }, []);

  const alternarFoco = useCallback((focoId: string) => {
    setEstado((prev) => ({
      ...prev,
      focoAtivoId: prev.focoAtivoId === focoId ? undefined : focoId,
    }));
  }, []);

  return {
    catalogo,
    ficha,
    derivada,
    estado,
    dispatch,
    // Ações de jogo
    sofrerDano,
    usarHabilidade,
    descansar,
    curarPv,
    curarPa,
    resetarCombate,
    alternarFoco,
  };
}
