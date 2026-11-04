"use client";

import type {
  CatalogoCalafrio,
  CustomizacaoDeEco,
  EfeitoCalafrio,
  FichaCalafrio,
  RecursoDeAtivacao,
  TipoAcaoCalafrio,
} from "@calafrio/core";
import { X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { EditorEfeitos } from "./editor-efeitos";

interface Props {
  aberto: boolean;
  ficha: FichaCalafrio;
  catalogo: CatalogoCalafrio;
  onSalvar: (customizacao: CustomizacaoDeEco) => void;
  onFechar: () => void;
}

export function ModalCustomizacaoEco({
  aberto,
  ficha,
  catalogo,
  onSalvar,
  onFechar,
}: Props) {
  const [habilidadeAlvoId, setHabilidadeAlvoId] = useState(
    catalogo.habilidadesParanormais[0]?.id ?? "",
  );
  const [titulo, setTitulo] = useState("");
  const [descricaoMudanca, setDescricaoMudanca] = useState("");
  const [novoCusto, setNovoCusto] = useState<number | undefined>();
  const [novoRecurso, setNovoRecurso] = useState<RecursoDeAtivacao | "">("");
  const [novoTipoAcao, setNovoTipoAcao] = useState<TipoAcaoCalafrio | "">("");
  const [efeitosExtras, setEfeitosExtras] = useState<EfeitoCalafrio[]>([]);

  if (!aberto) return null;

  const salvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !habilidadeAlvoId) return;

    onSalvar({
      id: `eco-cust-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      habilidadeAlvoId,
      titulo: titulo.trim(),
      descricaoMudanca: descricaoMudanca.trim(),
      novoCusto,
      novoRecurso: novoRecurso === "" ? undefined : novoRecurso,
      novoTipoAcao: novoTipoAcao === "" ? undefined : novoTipoAcao,
      efeitosExtras,
    });
    onFechar();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
      <form
        onSubmit={salvar}
        className="calafrio-card p-5 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="calafrio-tag">
            APRIMORAR HABILIDADE COM ECO (1 ECO)
          </span>
          <button type="button" onClick={onFechar} aria-label="Fechar">
            <X className="size-4 cursor-pointer" />
          </button>
        </div>

        <label className="block text-[10px] font-black uppercase text-muted-foreground">
          Habilidade Alvo
          <select
            value={habilidadeAlvoId}
            onChange={(e) => setHabilidadeAlvoId(e.target.value)}
            className="mt-1 w-full bg-muted/60 text-xs p-2 rounded border border-border normal-case font-normal"
          >
            <optgroup label="Suas Habilidades na Matriz">
              {ficha.matrizHabilidades.map((m) => {
                const hab = catalogo.habilidadesParanormais.find(
                  (h) => h.id === m.id,
                );
                return (
                  <option key={m.id} value={m.id}>
                    Slot #{m.slot + 1}: {hab?.nome ?? m.id}
                  </option>
                );
              })}
            </optgroup>
            <optgroup label="Todas as Habilidades do Catálogo Oficial">
              {catalogo.habilidadesParanormais.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.nome} ({h.personalidade} - {h.dominio})
                </option>
              ))}
            </optgroup>
          </select>
        </label>

        <label className="block text-[10px] font-black uppercase text-muted-foreground">
          Nome do Aprimoramento / Versão
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Telepatia de Longo Alcance, Pirocinese Concentrada..."
            className="mt-1 w-full bg-muted/60 text-xs p-2 rounded border border-border normal-case font-normal"
            required
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <label className="block text-[10px] font-black uppercase text-muted-foreground">
            Novo Custo (opcional)
            <input
              type="number"
              min={0}
              value={novoCusto ?? ""}
              onChange={(e) =>
                setNovoCusto(
                  e.target.value === "" ? undefined : Number(e.target.value),
                )
              }
              placeholder="Mantém original"
              className="mt-1 w-full bg-muted/60 text-xs p-2 rounded border border-border normal-case font-normal"
            />
          </label>

          <label className="block text-[10px] font-black uppercase text-muted-foreground">
            Novo Recurso
            <select
              value={novoRecurso}
              onChange={(e) =>
                setNovoRecurso(e.target.value as RecursoDeAtivacao | "")
              }
              className="mt-1 w-full bg-muted/60 text-xs p-2 rounded border border-border normal-case font-normal"
            >
              <option value="">Mantém original</option>
              <option value="pa">PA</option>
              <option value="pv">PV</option>
              <option value="nenhum">Nenhum (0)</option>
            </select>
          </label>

          <label className="block text-[10px] font-black uppercase text-muted-foreground">
            Nova Ação
            <select
              value={novoTipoAcao}
              onChange={(e) =>
                setNovoTipoAcao(e.target.value as TipoAcaoCalafrio | "")
              }
              className="mt-1 w-full bg-muted/60 text-xs p-2 rounded border border-border normal-case font-normal"
            >
              <option value="">Mantém original</option>
              <option value="padrao">Padrão</option>
              <option value="livre">Livre</option>
              <option value="reflexo">Reflexo</option>
              <option value="passiva">Passiva</option>
            </select>
          </label>
        </div>

        <label className="block text-[10px] font-black uppercase text-muted-foreground">
          Descrição da Melhoria / Efeito
          <textarea
            value={descricaoMudanca}
            onChange={(e) => setDescricaoMudanca(e.target.value)}
            rows={3}
            placeholder="Descreva a melhoria acordada com o MdJ..."
            className="mt-1 w-full bg-muted/60 text-xs p-2 rounded border border-border normal-case font-normal"
          />
        </label>

        <EditorEfeitos efeitos={efeitosExtras} onChange={setEfeitosExtras} />

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onFechar}
            className="px-4 py-2 text-xs font-bold rounded border border-border hover:bg-muted cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-black rounded bg-amber-400 text-black hover:bg-amber-300 cursor-pointer"
          >
            Gravar Aprimoramento
          </button>
        </div>
      </form>
    </div>
  );
}
