import type { FichaCalafrio } from "@calafrio/core";
import { useCallback, useEffect, useState } from "react";
import {
  gravarPersonagemAtivoIdAsync,
  gravarPersonagensAsync,
  lerPersonagemAtivoIdAsync,
  lerPersonagensAsync,
  type StorageAdapterAsync,
} from "./armazenamento-async";
import {
  adicionarPersonagem,
  atualizarPersonagemNaLista,
  criarNovoPersonagemPadrao,
  duplicarPersonagem as duplicarPersonagemCore,
  excluirPersonagem as excluirPersonagemCore,
} from "./gerenciador-personagens-core";

export function useGerenciadorPersonagensAsync(adapter: StorageAdapterAsync) {
  const [personagens, setPersonagens] = useState<FichaCalafrio[]>([]);
  const [personagemAtivoId, setPersonagemAtivoId] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Carrega inicial
  useEffect(() => {
    let ativo = true;
    async function carregar() {
      try {
        const [salvos, idAtivo] = await Promise.all([
          lerPersonagensAsync(adapter),
          lerPersonagemAtivoIdAsync(adapter),
        ]);
        if (!ativo) return;
        setPersonagens(salvos);
        if (idAtivo && salvos.some((p) => p.id === idAtivo)) {
          setPersonagemAtivoId(idAtivo);
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregar();
    return () => {
      ativo = false;
    };
  }, [adapter]);

  // Salva lista quando muda após carregamento
  useEffect(() => {
    if (!carregando) {
      gravarPersonagensAsync(adapter, personagens);
    }
  }, [personagens, carregando, adapter]);

  // Salva ativo quando muda após carregamento
  useEffect(() => {
    if (!carregando) {
      gravarPersonagemAtivoIdAsync(adapter, personagemAtivoId);
    }
  }, [personagemAtivoId, carregando, adapter]);

  const personagemAtivo =
    personagens.find((p) => p.id === personagemAtivoId) ?? null;

  const selecionarPersonagem = useCallback((id: string | null) => {
    setPersonagemAtivoId(id);
  }, []);

  const criarPersonagem = useCallback((nome?: string) => {
    const novo = criarNovoPersonagemPadrao(nome);
    setPersonagens((atuais) => adicionarPersonagem(atuais, novo));
    setPersonagemAtivoId(novo.id);
    return novo;
  }, []);

  const salvarPersonagem = useCallback((atualizado: FichaCalafrio) => {
    setPersonagens((atuais) => {
      const index = atuais.findIndex((p) => p.id === atualizado.id);
      if (index === -1) return atuais;
      if (atuais[index] === atualizado) return atuais;
      return atualizarPersonagemNaLista(atuais, atualizado);
    });
  }, []);

  const duplicarPersonagem = useCallback((id: string) => {
    let novoId: string | null = null;
    setPersonagens((atuais) => {
      const { novaLista, duplicado } = duplicarPersonagemCore(atuais, id);
      novoId = duplicado?.id ?? null;
      return novaLista;
    });
    return novoId;
  }, []);

  const excluirPersonagem = useCallback((id: string) => {
    setPersonagens((atuais) => excluirPersonagemCore(atuais, id));
    setPersonagemAtivoId((atual) => (atual === id ? null : atual));
  }, []);

  return {
    personagens,
    personagemAtivo,
    personagemAtivoId,
    carregando,
    selecionarPersonagem,
    criarPersonagem,
    salvarPersonagem,
    duplicarPersonagem,
    excluirPersonagem,
  };
}
