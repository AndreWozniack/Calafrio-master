"use client";

import {
  type CategoriaPalavraChave,
  carregarCatalogoCalafrio,
  type EfeitoCalafrio,
  type PalavraChaveNaFicha,
} from "@calafrio/core";
import { Dices, X } from "lucide-react";
import { useMemo, useState } from "react";
import { EditorEfeitos } from "./editor-efeitos";

interface Props {
  aberto: boolean;
  inicial?: PalavraChaveNaFicha;
  onSalvar: (palavra: PalavraChaveNaFicha) => void;
  onFechar: () => void;
}

const CATEGORIAS: { id: CategoriaPalavraChave; rotulo: string }[] = [
  { id: "ocupacao", rotulo: "Ocupação" },
  { id: "talento", rotulo: "Talento" },
  { id: "falha", rotulo: "Falha" },
  { id: "extra", rotulo: "Extra" },
];

export function ModalPalavraChave({
  aberto,
  inicial,
  onSalvar,
  onFechar,
}: Props) {
  const catalogo = useMemo(() => carregarCatalogoCalafrio(), []);
  const [categoria, setCategoria] = useState<CategoriaPalavraChave>(
    inicial?.categoria ?? "ocupacao",
  );
  const [nome, setNome] = useState(inicial?.nome ?? "");
  const [notas, setNotas] = useState(inicial?.notas ?? "");
  const [semConsumirLimite, setSemConsumirLimite] = useState(
    inicial?.semConsumirLimite ?? false,
  );
  const [efeitos, setEfeitos] = useState<EfeitoCalafrio[]>(
    inicial?.efeitos ?? [],
  );
  const [busca, setBusca] = useState("");

  if (!aberto) return null;

  const tabela =
    categoria === "ocupacao"
      ? catalogo.ocupacoes
      : catalogo.palavrasChaveGenericas;
  const sugestoes = tabela
    .filter((e) => e.nome.toLowerCase().includes(busca.toLowerCase()))
    .slice(0, 8);

  const sortear = () => {
    const e = tabela[Math.floor(Math.random() * tabela.length)];
    if (e) setNome(e.nome);
  };

  const fechar = () => {
    setNome("");
    setNotas("");
    setBusca("");
    setEfeitos([]);
    setSemConsumirLimite(false);
    onFechar();
  };

  const salvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    onSalvar({
      id:
        inicial?.id ??
        `pc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      nome: nome.trim(),
      categoria,
      semConsumirLimite,
      notas: notas.trim() || undefined,
      efeitos,
    });
    fechar();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <form
        onSubmit={salvar}
        className="calafrio-card p-5 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="calafrio-tag">
            {inicial ? "EDITAR PALAVRA-CHAVE" : "NOVA PALAVRA-CHAVE"}
          </span>
          <button type="button" onClick={fechar} aria-label="Fechar">
            <X className="size-4 cursor-pointer" />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORIAS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoria(c.id)}
              className={`px-3 py-1 text-xs font-bold rounded border cursor-pointer ${
                categoria === c.id
                  ? "bg-amber-400 text-black border-amber-400"
                  : "border-border hover:bg-muted"
              }`}
            >
              {c.rotulo}
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-muted-foreground">
            Nome
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Escreva livremente ou escolha abaixo"
              className="mt-1 w-full bg-muted/60 text-sm px-2.5 py-2 rounded border border-border normal-case font-normal"
            />
          </label>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder={`Buscar no catálogo (${tabela.length} opções)...`}
              className="flex-1 bg-muted/60 text-xs px-2.5 py-1.5 rounded border border-border"
            />
            <button
              type="button"
              onClick={sortear}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded border border-border hover:bg-muted cursor-pointer"
              title="Sortear no d100"
            >
              <Dices className="size-3.5" /> d100
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {sugestoes.map((s) => (
              <button
                key={s.numero}
                type="button"
                onClick={() => setNome(s.nome)}
                className="px-2 py-0.5 text-[11px] rounded border border-border hover:bg-muted cursor-pointer"
              >
                {s.nome}
              </button>
            ))}
          </div>
        </div>

        <label className="block text-[10px] font-black uppercase text-muted-foreground">
          Notas
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={2}
            className="mt-1 w-full bg-muted/60 text-xs px-2.5 py-2 rounded border border-border normal-case font-normal"
          />
        </label>

        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={semConsumirLimite}
            onChange={(e) => setSemConsumirLimite(e.target.checked)}
          />
          Concedida (não consome o limite de 2 + APT)
        </label>

        <EditorEfeitos efeitos={efeitos} onChange={setEfeitos} />

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={fechar}
            className="px-4 py-2 text-xs font-bold rounded border border-border hover:bg-muted cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!nome.trim()}
            className="px-4 py-2 text-xs font-black rounded bg-amber-400 text-black hover:bg-amber-300 disabled:opacity-40 cursor-pointer"
          >
            {inicial ? "Salvar alterações" : "Adicionar palavra-chave"}
          </button>
        </div>
      </form>
    </div>
  );
}
