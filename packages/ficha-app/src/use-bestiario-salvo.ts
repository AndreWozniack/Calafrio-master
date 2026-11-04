"use client";

import type { CriaturaCalafrio } from "@calafrio/core";
import { useCallback, useEffect, useState } from "react";
import {
  CHAVE_STORAGE_BESTIARIO,
  gravarLista,
  lerCriaturasSalvas,
} from "./armazenamento";

/** Bestiário persistido: criaturas criadas pelo Mestre sobrevivem ao reload e ficam disponíveis na Mesa. */
export function useBestiarioSalvo() {
  const [criaturas, setCriaturasState] = useState<CriaturaCalafrio[]>([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    setCriaturasState(lerCriaturasSalvas());
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (carregado) gravarLista(CHAVE_STORAGE_BESTIARIO, criaturas);
  }, [criaturas, carregado]);

  const adicionar = useCallback((c: CriaturaCalafrio) => {
    setCriaturasState((prev) => [...prev, c]);
  }, []);
  const atualizar = useCallback(
    (id: string, dados: Partial<CriaturaCalafrio>) => {
      setCriaturasState((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...dados } : c)),
      );
    },
    [],
  );
  const remover = useCallback((id: string) => {
    setCriaturasState((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { criaturas, carregado, adicionar, atualizar, remover };
}
