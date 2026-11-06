"use client";

import type { FichaCalafrioV1, HabilidadeUnicaV1 } from "@calafrio/core";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";

interface FichaV1HabilidadesUnicasProps {
  ficha: FichaCalafrioV1;
  adicionarHabilidadeUnica: (unica: HabilidadeUnicaV1) => void;
  aprimorarHabilidadeUnica: (id: string, descricao: string) => void;
  removerHabilidadeUnica: (id: string) => void;
}

export function FichaV1HabilidadesUnicas({
  ficha,
  adicionarHabilidadeUnica,
  aprimorarHabilidadeUnica,
  removerHabilidadeUnica,
}: FichaV1HabilidadesUnicasProps) {
  const [criando, setCriando] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [passiva, setPassiva] = useState(false);

  const criar = () => {
    if (!nome.trim()) return;
    adicionarHabilidadeUnica({
      id: `hu-${Date.now()}`,
      nome: nome.trim(),
      descricao: descricao.trim(),
      passiva,
      aprimoramentos: [],
    });
    setNome("");
    setDescricao("");
    setPassiva(false);
    setCriando(false);
  };

  return (
    <div className="calafrio-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-foreground flex items-center gap-2">
            <Sparkles className="size-4 text-amber-400" /> Habilidades Únicas
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Custa 1 EP criar uma habilidade única. Custo base: 3 PA (ou
            Passivo).
          </p>
        </div>
        {!criando && (
          <button
            type="button"
            onClick={() => setCriando(true)}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-colors"
          >
            <Plus className="size-3.5" /> Criar Habilidade Única
          </button>
        )}
      </div>

      {criando && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-muted/30 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">
                Nome
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Sexto Sentido Aguçado"
                className="w-full bg-background border border-border rounded px-3 py-1.5 text-sm font-bold text-foreground outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">
                Tipo / Custo
              </label>
              <select
                value={passiva ? "passivo" : "ativo"}
                onChange={(e) => setPassiva(e.target.value === "passivo")}
                className="w-full bg-background border border-border rounded px-3 py-1.5 text-sm text-foreground"
              >
                <option value="ativo">Ativa (3 PA / uso)</option>
                <option value="passivo">Passiva</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase text-muted-foreground block mb-1">
              Efeito / Descrição
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={2}
              placeholder="Descreva o que a habilidade única faz..."
              className="w-full bg-background border border-border rounded p-2.5 text-xs text-foreground outline-none focus:border-amber-400 resize-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCriando(false)}
              className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={criar}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded cursor-pointer"
            >
              Salvar Habilidade
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {ficha.habilidadesUnicas.map((hu) => {
          const aprCount = hu.aprimoramentos.length;
          return (
            <div
              key={hu.id}
              className="p-4 rounded-xl border border-border bg-muted/20 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-foreground">
                      {hu.nome}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {hu.passiva ? "Passivo" : "3 PA / uso"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {hu.descricao || "Sem descrição."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removerHabilidadeUnica(hu.id)}
                  title="Remover Habilidade Única"
                  className="text-muted-foreground hover:text-red-400 p-1 cursor-pointer"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* Aprimoramentos */}
              <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase text-muted-foreground">
                    Aprimorar:
                  </span>
                  {[0, 1].map((idx) => {
                    const tem = idx < aprCount;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!tem) {
                            const desc = prompt(
                              "Descrição do aprimoramento (custa 1 EP):",
                            );
                            if (desc)
                              aprimorarHabilidadeUnica(hu.id, desc.trim());
                          }
                        }}
                        className={`size-4 rotate-45 border transition-colors cursor-pointer ${
                          tem
                            ? "bg-amber-400 border-amber-400"
                            : "border-border hover:border-amber-400/50 bg-background"
                        }`}
                        title={
                          tem
                            ? hu.aprimoramentos[idx]?.descricao || "Aprimorado"
                            : "Clique para aprimorar (+1 EP)"
                        }
                      />
                    );
                  })}
                </div>
                {aprCount > 0 && (
                  <div className="text-[11px] text-amber-300 font-mono">
                    {hu.aprimoramentos.map((a) => a.descricao).join(" • ")}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {ficha.habilidadesUnicas.length === 0 && !criando && (
          <p className="text-xs text-muted-foreground italic text-center py-2">
            Nenhuma habilidade única criada.
          </p>
        )}
      </div>
    </div>
  );
}
