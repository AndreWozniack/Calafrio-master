"use client";

import type {
  EfeitoCalafrio,
  HabilidadeUnicaCalafrio,
  PersonalidadeCalafrio,
  TipoAcaoCalafrio,
} from "@calafrio/core";
import { TOKENS_PERSONALIDADE } from "@calafrio/tema";
import { X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { EditorEfeitos } from "./editor-efeitos";

interface Props {
  aberto: boolean;
  inicial?: HabilidadeUnicaCalafrio;
  onSalvar: (unica: HabilidadeUnicaCalafrio) => void;
  onFechar: () => void;
}

export function ModalHabilidadeUnica({
  aberto,
  inicial,
  onSalvar,
  onFechar,
}: Props) {
  const [nome, setNome] = useState(inicial?.nome ?? "");
  const [custo, setCusto] = useState(inicial?.custo ?? 3);
  const [recurso, setRecurso] = useState<HabilidadeUnicaCalafrio["recurso"]>(
    inicial?.recurso ?? "pa",
  );
  const [tipoAcao, setTipoAcao] = useState<TipoAcaoCalafrio>(
    inicial?.tipoAcao ?? "padrao",
  );
  const [personalidade, setPersonalidade] = useState<
    PersonalidadeCalafrio | "nenhum"
  >(inicial?.personalidadeAlinhamento ?? "nenhum");
  const [ecosInvestidos, setEcosInvestidos] = useState(
    inicial?.ecosInvestidos ?? 1,
  );
  const [descricao, setDescricao] = useState(inicial?.descricao ?? "");
  const [efeitos, setEfeitos] = useState<EfeitoCalafrio[]>(
    inicial?.efeitos ?? [],
  );

  if (!aberto) return null;

  const fechar = () => {
    onFechar();
  };

  const salvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !descricao.trim()) return;

    onSalvar({
      id:
        inicial?.id ??
        `unica-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      nome: nome.trim(),
      custo,
      recurso,
      tipoAcao,
      personalidadeAlinhamento:
        personalidade === "nenhum" ? undefined : personalidade,
      descricao: descricao.trim(),
      ecosInvestidos: Math.max(1, ecosInvestidos),
      efeitos,
    });
    fechar();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
      <form
        onSubmit={salvar}
        className="calafrio-card p-5 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="calafrio-tag">
            {inicial ? "EDITAR HABILIDADE ÚNICA" : "NOVA HABILIDADE ÚNICA"}
          </span>
          <button type="button" onClick={fechar} aria-label="Fechar">
            <X className="size-4 cursor-pointer" />
          </button>
        </div>

        <div className="space-y-1">
          <label className="block text-[10px] font-black uppercase text-muted-foreground">
            Nome da Habilidade
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Guarda-Chuva Eletrocutante, Sexto Sentido..."
              className="mt-1 w-full bg-muted/60 text-sm px-2.5 py-1.5 rounded border border-border normal-case font-normal"
              required
            />
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <label className="block text-[10px] font-black uppercase text-muted-foreground">
            Ação
            <select
              value={tipoAcao}
              onChange={(e) => setTipoAcao(e.target.value as TipoAcaoCalafrio)}
              className="mt-1 w-full bg-muted/60 text-xs p-1.5 rounded border border-border normal-case font-normal"
            >
              <option value="padrao">Padrão</option>
              <option value="livre">Livre</option>
              <option value="reflexo">Reflexo</option>
              <option value="preparada">Preparada</option>
              <option value="passiva">Passiva</option>
            </select>
          </label>

          <label className="block text-[10px] font-black uppercase text-muted-foreground">
            Custo
            <input
              type="number"
              min={0}
              value={custo}
              onChange={(e) => setCusto(Number(e.target.value))}
              className="mt-1 w-full bg-muted/60 text-xs p-1.5 rounded border border-border text-center normal-case font-normal"
            />
          </label>

          <label className="block text-[10px] font-black uppercase text-muted-foreground">
            Recurso
            <select
              value={recurso}
              onChange={(e) =>
                setRecurso(e.target.value as HabilidadeUnicaCalafrio["recurso"])
              }
              className="mt-1 w-full bg-muted/60 text-xs p-1.5 rounded border border-border normal-case font-normal"
            >
              <option value="pa">PA</option>
              <option value="pv">PV</option>
              <option value="nenhum">Nenhum</option>
            </select>
          </label>

          <label className="block text-[10px] font-black uppercase text-muted-foreground">
            Ecos Gastos
            <input
              type="number"
              min={1}
              value={ecosInvestidos}
              onChange={(e) => setEcosInvestidos(Number(e.target.value))}
              className="mt-1 w-full bg-muted/60 text-xs p-1.5 rounded border border-border text-center normal-case font-normal"
              title="Quantidade de Ecos investidos nesta habilidade"
            />
          </label>
        </div>

        <label className="block text-[10px] font-black uppercase text-muted-foreground">
          Personalidade de Alinhamento (se o Mestre permitir contar na Matriz
          3x3)
          <select
            value={personalidade}
            onChange={(e) =>
              setPersonalidade(
                e.target.value as PersonalidadeCalafrio | "nenhum",
              )
            }
            className="mt-1 w-full bg-muted/60 text-xs p-2 rounded border border-border normal-case font-normal"
          >
            <option value="nenhum">
              Nenhuma (Neutra - não pontua alinhamento)
            </option>
            {Object.entries(TOKENS_PERSONALIDADE).map(([key, token]) => (
              <option key={key} value={key}>
                {token.emoji} {token.nome} (Árvore {token.nome})
              </option>
            ))}
          </select>
        </label>

        <label className="block text-[10px] font-black uppercase text-muted-foreground">
          Descrição Detalhada do Efeito
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            placeholder="Descreva exatamente o funcionamento acordado com o MdJ..."
            className="mt-1 w-full bg-muted/60 text-xs p-2 rounded border border-border normal-case font-normal"
            required
          />
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
            className="px-4 py-2 text-xs font-black rounded bg-amber-400 text-black hover:bg-amber-300 cursor-pointer"
          >
            {inicial ? "Salvar Alterações" : "Forjar Habilidade Única"}
          </button>
        </div>
      </form>
    </div>
  );
}
