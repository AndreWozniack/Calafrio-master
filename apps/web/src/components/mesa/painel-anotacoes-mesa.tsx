"use client";

import { Pin, PinOff, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  atualizarAnotacaoAction,
  criarAnotacaoAction,
  excluirAnotacaoAction,
} from "@/app/mesa/[mesaId]/anotacoes/actions";
import type { AnotacaoMesa } from "@/services/armazenamento-calafrio";

function ordenar(notas: AnotacaoMesa[]) {
  return [...notas].sort(
    (a, b) =>
      Number(b.fixada) - Number(a.fixada) ||
      b.criadaEm.localeCompare(a.criadaEm),
  );
}

export function PainelAnotacoesMesa({
  mesaId,
  anotacoesIniciais,
}: {
  mesaId: string;
  anotacoesIniciais: AnotacaoMesa[];
}) {
  const [notas, setNotas] = useState(anotacoesIniciais);

  const adicionar = async () => {
    const nova = await criarAnotacaoAction(mesaId, "Nova anotação", "");
    setNotas((atual) => ordenar([...atual, nova]));
  };

  const alterar = (
    id: string,
    mudancas: Partial<Pick<AnotacaoMesa, "titulo" | "texto" | "fixada">>,
  ) => {
    setNotas((atual) =>
      ordenar(atual.map((n) => (n.id === id ? { ...n, ...mudancas } : n))),
    );
  };

  const salvar = (id: string, mudancas: Parameters<typeof alterar>[1]) => {
    alterar(id, mudancas);
    void atualizarAnotacaoAction(mesaId, id, mudancas);
  };

  const excluir = (id: string) => {
    setNotas((atual) => atual.filter((n) => n.id !== id));
    void excluirAnotacaoAction(mesaId, id);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 className="text-lg font-black">Anotações do Mestre</h2>
        <button
          type="button"
          onClick={adicionar}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-amber-400 px-3.5 py-2 text-xs font-black uppercase tracking-wider text-black hover:bg-amber-300"
        >
          <Plus className="size-3.5" /> Nova
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {notas.map((nota) => (
          <article key={nota.id} className="calafrio-card space-y-2 p-3">
            <div className="flex items-center gap-2">
              <input
                value={nota.titulo}
                onChange={(e) => alterar(nota.id, { titulo: e.target.value })}
                onBlur={(e) => salvar(nota.id, { titulo: e.target.value })}
                className="min-w-0 flex-1 bg-transparent text-sm font-black outline-none"
              />
              <button
                type="button"
                title={nota.fixada ? "Desafixar" : "Fixar"}
                onClick={() => salvar(nota.id, { fixada: !nota.fixada })}
                className="cursor-pointer text-muted-foreground hover:text-amber-400"
              >
                {nota.fixada ? (
                  <PinOff className="size-4" />
                ) : (
                  <Pin className="size-4" />
                )}
              </button>
              <button
                type="button"
                title="Excluir"
                onClick={() => excluir(nota.id)}
                className="cursor-pointer text-muted-foreground hover:text-red-400"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <textarea
              value={nota.texto}
              onChange={(e) => alterar(nota.id, { texto: e.target.value })}
              onBlur={(e) => salvar(nota.id, { texto: e.target.value })}
              rows={6}
              placeholder="Pistas, NPCs, ganchos de cena..."
              className="w-full resize-y rounded border border-border bg-muted/40 p-2 text-xs outline-none focus:border-amber-400"
            />
          </article>
        ))}
      </div>

      {notas.length === 0 && (
        <p className="rounded-xl border-2 border-dashed border-border py-10 text-center text-xs text-muted-foreground">
          Nenhuma anotação. Registre pistas, NPCs e ganchos da campanha.
        </p>
      )}
    </section>
  );
}
