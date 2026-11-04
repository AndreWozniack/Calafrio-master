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
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { type AcaoFichaCalafrio, fichaCalafrioReducer } from "./ficha-reducer";

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

  // Parte efêmera do estado (ações do turno, foco...). Vida/ânimum vivem na ficha.
  const [efemero, setEfemero] = useState<EstadoDeJogoCalafrio>(() =>
    criarEstadoDeJogoInicial(),
  );

  const estado: EstadoDeJogoCalafrio = useMemo(
    () => ({
      ...efemero,
      danoSofrido: ficha.vitais?.danoSofrido ?? 0,
      paGasto: ficha.vitais?.paGasto ?? 0,
      pvTemporario: ficha.vitais?.pvTemporario ?? 0,
      paTemporario: ficha.vitais?.paTemporario ?? 0,
    }),
    [efemero, ficha.vitais],
  );
  const estadoRef = useRef(estado);
  estadoRef.current = estado;

  /** Aplica uma transição de estado: vitais vão para a ficha (persistem), o resto fica efêmero. */
  const setEstado = useCallback(
    (
      atualizar:
        | EstadoDeJogoCalafrio
        | ((prev: EstadoDeJogoCalafrio) => EstadoDeJogoCalafrio),
    ) => {
      const proximo =
        typeof atualizar === "function"
          ? atualizar(estadoRef.current)
          : atualizar;
      estadoRef.current = proximo;
      setEfemero(proximo);
      dispatch({
        tipo: "definirVitais",
        vitais: {
          danoSofrido: proximo.danoSofrido,
          paGasto: proximo.paGasto,
          pvTemporario: proximo.pvTemporario,
          paTemporario: proximo.paTemporario,
        },
      });
    },
    [],
  );

  // Sincronizar se a fichaParam mudar externamente
  useEffect(() => {
    if (fichaParam && fichaParam.id !== ficha.id) {
      dispatch({ tipo: "carregarFicha", ficha: fichaParam });
      setEfemero(criarEstadoDeJogoInicial());
      ultimaFichaSalvaRef.current = fichaParam;
    }
  }, [fichaParam, ficha.id]);

  // Propaga edições para o gerenciador sem disparar no mount inicial ou em loops
  const onSalvarRef = useRef(onSalvar);
  useEffect(() => {
    onSalvarRef.current = onSalvar;
  }, [onSalvar]);

  const ultimaFichaSalvaRef = useRef<FichaCalafrio>(ficha);
  useEffect(() => {
    if (ultimaFichaSalvaRef.current !== ficha) {
      ultimaFichaSalvaRef.current = ficha;
      onSalvarRef.current?.(ficha);
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

  // Edição livre dos vitais (o jogador/MdJ manda; nada trava)
  const definirPvAtual = useCallback(
    (valor: number) => {
      const topo = derivada.pvMax + estadoRef.current.pvTemporario;
      const alvo = Math.max(0, Math.min(topo, Math.round(valor) || 0));
      dispatch({ tipo: "definirVitais", vitais: { danoSofrido: topo - alvo } });
    },
    [derivada.pvMax],
  );
  const definirPaAtual = useCallback(
    (valor: number) => {
      const topo = derivada.paMax + estadoRef.current.paTemporario;
      const alvo = Math.max(0, Math.min(topo, Math.round(valor) || 0));
      dispatch({ tipo: "definirVitais", vitais: { paGasto: topo - alvo } });
    },
    [derivada.paMax],
  );
  const definirPvTemporario = useCallback((valor: number) => {
    dispatch({
      tipo: "definirVitais",
      vitais: { pvTemporario: Math.round(valor) || 0 },
    });
  }, []);
  const definirPaTemporario = useCallback((valor: number) => {
    dispatch({
      tipo: "definirVitais",
      vitais: { paTemporario: Math.round(valor) || 0 },
    });
  }, []);
  const definirAjusteManual = useCallback(
    (
      alvo: Extract<AcaoFichaCalafrio, { tipo: "definirAjusteManual" }>["alvo"],
      valor: number,
    ) => dispatch({ tipo: "definirAjusteManual", alvo, valor }),
    [],
  );

  const alternarFoco = useCallback((focoId: string) => {
    setEstado((prev) => ({
      ...prev,
      focoAtivoId: prev.focoAtivoId === focoId ? undefined : focoId,
    }));
  }, []);

  const carregarFicha = useCallback((novaFicha: FichaCalafrio) => {
    dispatch({ tipo: "carregarFicha", ficha: novaFicha });
    setEfemero(criarEstadoDeJogoInicial());
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
    definirPvAtual,
    definirPaAtual,
    definirPvTemporario,
    definirPaTemporario,
    definirAjusteManual,
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
