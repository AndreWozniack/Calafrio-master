"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const CHAVE_TEMA = "calafrio:tema:v1";

export function AlternarTema() {
  const [escuro, setEscuro] = useState(false);

  useEffect(() => {
    setEscuro(document.documentElement.classList.contains("dark"));
  }, []);

  const alternar = () => {
    const proximo = !escuro;
    document.documentElement.classList.toggle("dark", proximo);
    try {
      localStorage.setItem(CHAVE_TEMA, proximo ? "escuro" : "claro");
    } catch {}
    setEscuro(proximo);
  };

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={escuro ? "Ativar tema claro" : "Ativar tema escuro"}
      title={escuro ? "Tema claro" : "Tema escuro"}
      className="p-2 rounded-sm border border-border hover:bg-muted cursor-pointer"
    >
      {escuro ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
