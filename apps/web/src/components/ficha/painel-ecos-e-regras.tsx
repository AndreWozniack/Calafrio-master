"use client";

import type {
  FichaCalafrio,
  FichaDerivadaCalafrio,
  HabilidadeUnicaCalafrio,
  PersonalidadeCalafrio,
} from "@calafrio/core";
import { TOKENS_PERSONALIDADE } from "@calafrio/tema";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface PainelEcosERegrasProps {
  ficha: FichaCalafrio;
  derivada: FichaDerivadaCalafrio;
  onAdicionarHabilidadeUnica: (unica: HabilidadeUnicaCalafrio) => void;
  onRemoverHabilidadeUnica: (id: string) => void;
}

export function PainelEcosERegras({
  ficha,
  derivada,
  onAdicionarHabilidadeUnica,
  onRemoverHabilidadeUnica,
}: PainelEcosERegrasProps) {
  const [nome, setNome] = useState("");
  const [custo, setCusto] = useState(3);
  const [recurso, setRecurso] =
    useState<HabilidadeUnicaCalafrio["recurso"]>("pa");
  const [tipoAcao, setTipoAcao] =
    useState<HabilidadeUnicaCalafrio["tipoAcao"]>("padrao");
  const [personalidade, setPersonalidade] = useState<
    PersonalidadeCalafrio | "nenhum"
  >("nenhum");
  const [descricao, setDescricao] = useState("");

  const lidarCriarUnica = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !descricao.trim()) return;

    onAdicionarHabilidadeUnica({
      id: `unica-${Date.now()}`,
      nome: nome.trim(),
      custo,
      recurso,
      tipoAcao,
      personalidadeAlinhamento:
        personalidade === "nenhum" ? undefined : personalidade,
      descricao: descricao.trim(),
      ecosInvestidos: 1,
      efeitos: [],
    });

    setNome("");
    setDescricao("");
  };

  return (
    <div className="calafrio-card p-4 space-y-4">
      {/* Resumo de Ecos */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-amber-500/10 border border-amber-500/40 rounded">
        <div>
          <span className="calafrio-tag">
            ECOS: {derivada.ecosDisponiveis} / {derivada.ecosMax}
          </span>
          <p className="text-[11px] text-muted-foreground mt-1">
            Cada Eco permite criar uma Habilidade Única, aprimorar uma existente
            ou reescrever uma regra (aprovado pelo MdJ).
          </p>
        </div>
      </div>

      {/* Lista de Habilidades Únicas Criadas */}
      <div className="space-y-2">
        <span className="calafrio-tag-sm">
          HABILIDADES ÚNICAS (CRIADAS COM ECOS)
        </span>
        {ficha.habilidadesUnicas.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-2">
            Nenhuma habilidade única criada ainda. Crie uma abaixo usando seus
            Ecos!
          </p>
        ) : (
          ficha.habilidadesUnicas.map((u) => (
            <div
              key={u.id}
              className="p-3 rounded border border-amber-500/40 bg-card/60 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-300 text-sm">
                    {u.nome}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {u.tipoAcao} · {u.custo} {u.recurso.toUpperCase()}
                  </span>
                  {u.personalidadeAlinhamento && (
                    <span
                      style={{
                        backgroundColor:
                          TOKENS_PERSONALIDADE[u.personalidadeAlinhamento]
                            .corPositiva,
                      }}
                      className="text-black font-extrabold text-[9px] px-1.5 py-0.5 rounded-xs"
                    >
                      Alinha:{" "}
                      {TOKENS_PERSONALIDADE[u.personalidadeAlinhamento].nome}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onRemoverHabilidadeUnica(u.id)}
                  className="p-1 text-muted-foreground hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              <p className="text-xs text-foreground/80">{u.descricao}</p>
            </div>
          ))
        )}
      </div>

      {/* Criador de Habilidade Única */}
      <form
        onSubmit={lidarCriarUnica}
        className="p-3 bg-muted/30 rounded border border-border space-y-3"
      >
        <div className="flex items-center gap-1.5 font-bold text-xs text-amber-400">
          <Sparkles className="size-3.5" />
          <span>Criar Nova Habilidade Única (1 Eco)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da habilidade..."
            className="bg-card text-xs p-2 rounded border border-border"
            required
          />

          <div className="flex gap-2">
            <select
              value={tipoAcao}
              onChange={(e) => setTipoAcao(e.target.value as any)}
              className="bg-card text-xs p-2 rounded border border-border flex-1"
            >
              <option value="padrao">Ação Padrão</option>
              <option value="livre">Ação Livre</option>
              <option value="reflexo">Reflexo</option>
              <option value="preparada">Preparada</option>
              <option value="passiva">Passiva</option>
            </select>

            <input
              type="number"
              min={0}
              value={custo}
              onChange={(e) => setCusto(Number(e.target.value))}
              className="w-14 bg-card text-xs p-2 rounded border border-border text-center"
              title="Custo"
            />

            <select
              value={recurso}
              onChange={(e) => setRecurso(e.target.value as any)}
              className="bg-card text-xs p-2 rounded border border-border"
            >
              <option value="pa">PA</option>
              <option value="pv">PV</option>
              <option value="nenhum">Nenhum</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-muted-foreground">
            Personalidade (se acordado c/ MdJ para matriz):
          </label>
          <select
            value={personalidade}
            onChange={(e) => setPersonalidade(e.target.value as any)}
            className="bg-card text-xs p-1.5 rounded border border-border"
          >
            <option value="nenhum">Nenhuma (neutra)</option>
            <option value="maneiro">Maneiro (Verde)</option>
            <option value="caotico">Caótico (Vermelho)</option>
            <option value="esquisito">Esquisito (Lilás)</option>
            <option value="racional">Racional (Azul)</option>
            <option value="agradavel">Agradável (Rosa)</option>
          </select>
        </div>

        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descreva detalhadamente o efeito negociado com o Mestre..."
          rows={2}
          className="w-full bg-card text-xs p-2 rounded border border-border"
          required
        />

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs py-2 rounded cursor-pointer transition-colors"
        >
          <Plus className="size-3.5" /> Forjar Habilidade Única
        </button>
      </form>
    </div>
  );
}
