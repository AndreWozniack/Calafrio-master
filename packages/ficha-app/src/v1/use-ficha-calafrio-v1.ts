"use client";

import {
  calcularFichaV1,
  criarFichaV1Vazia,
  type FichaCalafrioV1,
  type FichaDerivadaV1,
  type HabilidadeUnicaV1,
  type ItemV1,
  type PalavraChaveV1,
} from "@calafrio/core";
import { useEffect, useMemo, useReducer, useRef } from "react";
import {
  type AcaoFichaV1,
  fichaCalafrioV1Reducer,
} from "./ficha-v1-reducer";

export function useFichaCalafrioV1(
  fichaParam?: FichaCalafrioV1,
  onSalvar?: (ficha: FichaCalafrioV1) => void
) {
  const [ficha, dispatch] = useReducer(
    fichaCalafrioV1Reducer,
    fichaParam,
    (inicial) => inicial ?? criarFichaV1Vazia("sem-ficha", "")
  );

  // Sincronizar se a fichaParam mudar externamente
  useEffect(() => {
    if (fichaParam && fichaParam.id !== ficha.id) {
      dispatch({ tipo: "carregarFicha", ficha: fichaParam });
      ultimaFichaSalvaRef.current = fichaParam;
    }
  }, [fichaParam, ficha.id]);

  // Propaga edições sem disparar no mount inicial ou em loops
  const onSalvarRef = useRef(onSalvar);
  useEffect(() => {
    onSalvarRef.current = onSalvar;
  }, [onSalvar]);

  const ultimaFichaSalvaRef = useRef<FichaCalafrioV1>(ficha);
  useEffect(() => {
    if (ultimaFichaSalvaRef.current !== ficha) {
      ultimaFichaSalvaRef.current = ficha;
      onSalvarRef.current?.(ficha);
    }
  }, [ficha]);

  const derivada: FichaDerivadaV1 = useMemo(
    () => calcularFichaV1(ficha),
    [ficha]
  );

  return {
    ficha,
    derivada,
    dispatch,
    definirNome: (nome: string) => dispatch({ tipo: "definirNome", nome }),
    definirJogador: (jogador: string) =>
      dispatch({ tipo: "definirJogador", jogador }),
    definirNivel: (nivel: number) =>
      dispatch({ tipo: "definirNivel", nivel }),
    definirAtributo: (atributo: "corpo" | "mente" | "alma", valor: number) =>
      dispatch({ tipo: "definirAtributo", atributo, valor }),
    definirPvAtual: (valor: number) =>
      dispatch({ tipo: "definirPvAtual", valor }),
    definirPaAtual: (valor: number) =>
      dispatch({ tipo: "definirPaAtual", valor }),
    memorizarHabilidade: (id: string) =>
      dispatch({ tipo: "memorizarHabilidade", id }),
    esquecerHabilidade: (id: string) =>
      dispatch({ tipo: "esquecerHabilidade", id }),
    aprimorarHabilidade: (id: string, descricao: string) =>
      dispatch({ tipo: "aprimorarHabilidade", id, descricao }),
    removerAprimoramentoHabilidade: (id: string, aprimoramentoId: string) =>
      dispatch({
        tipo: "removerAprimoramentoHabilidade",
        id,
        aprimoramentoId,
      }),
    definirPmExtra: (id: string, pmExtra: number) =>
      dispatch({ tipo: "definirPmExtra", id, pmExtra }),
    adicionarHabilidadeUnica: (unica: HabilidadeUnicaV1) =>
      dispatch({ tipo: "adicionarHabilidadeUnica", unica }),
    aprimorarHabilidadeUnica: (id: string, descricao: string) =>
      dispatch({ tipo: "aprimorarHabilidadeUnica", id, descricao }),
    removerHabilidadeUnica: (id: string) =>
      dispatch({ tipo: "removerHabilidadeUnica", id }),
    adicionarPalavraChave: (palavra: PalavraChaveV1) =>
      dispatch({ tipo: "adicionarPalavraChave", palavra }),
    removerPalavraChave: (id: string) =>
      dispatch({ tipo: "removerPalavraChave", id }),
    adicionarItem: (item: ItemV1) => dispatch({ tipo: "adicionarItem", item }),
    removerItem: (id: string) => dispatch({ tipo: "removerItem", id }),
    definirCarteira: (fundos: number, espirions: number) =>
      dispatch({ tipo: "definirCarteira", fundos, espirions }),
    definirQuemSouEu: (texto: string) =>
      dispatch({ tipo: "definirQuemSouEu", texto }),
    definirAnotacoes: (texto: string) =>
      dispatch({ tipo: "definirAnotacoes", texto }),
    definirIlustracaoUrl: (url?: string) =>
      dispatch({ tipo: "definirIlustracaoUrl", url }),
  };
}
