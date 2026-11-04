"use client";

import type { FichaCalafrio } from "@calafrio/core";
import { useCallback, useEffect, useState } from "react";
import {
  CHAVE_STORAGE_ATIVO,
  CHAVE_STORAGE_PERSONAGENS,
  gravarLista,
  lerPersonagensSalvos,
} from "./armazenamento";
import {
  adicionarPersonagem,
  atualizarPersonagemNaLista,
  criarNovoPersonagemPadrao,
  duplicarPersonagem as duplicarPersonagemCore,
  excluirPersonagem as excluirPersonagemCore,
} from "./gerenciador-personagens-core";

export function useGerenciadorPersonagens() {
  const [personagens, setPersonagens] = useState<FichaCalafrio[]>([]);
  const [personagemAtivoId, setPersonagemAtivoId] = useState<string | null>(
    null,
  );
  // Evita sobrescrever o storage antes da hidratação (SSR começa vazio).
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    const salvos = lerPersonagensSalvos();
    setPersonagens(salvos);
    try {
      const id = localStorage.getItem(CHAVE_STORAGE_ATIVO);
      if (id && salvos.some((p) => p.id === id)) setPersonagemAtivoId(id);
    } catch {}
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (carregado) gravarLista(CHAVE_STORAGE_PERSONAGENS, personagens);
  }, [personagens, carregado]);

  useEffect(() => {
    if (!carregado) return;
    try {
      if (personagemAtivoId) {
        localStorage.setItem(CHAVE_STORAGE_ATIVO, personagemAtivoId);
      } else {
        localStorage.removeItem(CHAVE_STORAGE_ATIVO);
      }
    } catch {}
  }, [personagemAtivoId, carregado]);

  const personagemAtivo =
    personagens.find((p) => p.id === personagemAtivoId) ?? null;

  const selecionarPersonagem = useCallback((id: string | null) => {
    setPersonagemAtivoId(id);
  }, []);

  const criarPersonagem = useCallback((nome?: string) => {
    const novo = criarNovoPersonagemPadrao(nome);
    setPersonagens((prev) => adicionarPersonagem(prev, novo));
    setPersonagemAtivoId(novo.id);
    return novo;
  }, []);

  const duplicarPersonagem = useCallback((id: string) => {
    let recemCriado: FichaCalafrio | null = null;
    setPersonagens((prev) => {
      const { novaLista, duplicado } = duplicarPersonagemCore(prev, id);
      recemCriado = duplicado;
      return novaLista;
    });
    return recemCriado;
  }, []);

  const excluirPersonagem = useCallback(
    (id: string) => {
      setPersonagens((prev) => excluirPersonagemCore(prev, id));
      if (personagemAtivoId === id) {
        setPersonagemAtivoId(null);
      }
    },
    [personagemAtivoId],
  );

  const salvarPersonagem = useCallback((fichaAtualizada: FichaCalafrio) => {
    setPersonagens((prev) => atualizarPersonagemNaLista(prev, fichaAtualizada));
  }, []);

  return {
    personagens,
    carregado,
    personagemAtivoId,
    personagemAtivo,
    selecionarPersonagem,
    criarPersonagem,
    duplicarPersonagem,
    excluirPersonagem,
    salvarPersonagem,
  };
}
