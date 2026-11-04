"use client";

import {
  type CriaturaCalafrio,
  carregarCatalogoCalafrio,
  motorBestiarioUnificado,
} from "@calafrio/core";
import { useBestiarioSalvo } from "@calafrio/ficha-app";
import { Skull, Trash2 } from "lucide-react";
import { useState } from "react";
import { FichaCriaturaAtiva } from "./ficha-criatura-ativa";
import { FormularioCriarCriatura } from "./formulario-criar-criatura";

export function VisaoBestiario() {
  const catalogo = carregarCatalogoCalafrio();

  const { criaturas, carregado, adicionar, atualizar, remover } =
    useBestiarioSalvo();

  const importarPresetsLacaios = () => {
    for (const l of catalogo.lacaios) {
      const id = `lacaio-${l.dado}`;
      if (criaturas.some((c) => c.id === id)) continue;
      adicionar({
        id,
        nome: l.nome,
        categoria: "lacaio",
        apt: l.aptBonus,
        pvMax: l.pv,
        pvAtual: l.pv,
        pd: l.pd,
        paMax: 3 + 3 * l.aptBonus,
        paAtual: 3 + 3 * l.aptBonus,
        velocidade: l.velocidade,
        palavrasChave: [l.nome],
        resistencias: {},
        acoes: [
          {
            id: `acao-${l.dado}`,
            nome: "Ataque",
            tipoAcao: "padrao",
            dano: l.aptBonus,
            espectroDano: "fisico",
            descricao: l.propriedades,
          },
        ],
        notas: l.descricao,
      });
    }
  };

  const [criaturaSelecionadaId, setCriaturaSelecionadaId] =
    useState<string>("");

  const criaturaAtiva =
    criaturas.find((c) => c.id === criaturaSelecionadaId) ?? criaturas[0];

  const lidarCriar = (
    nome: string,
    apt: number,
    categoria: CriaturaCalafrio["categoria"],
  ) => {
    const base = motorBestiarioUnificado.gerarPadraoPorApt(apt);
    const nova: CriaturaCalafrio = {
      ...base,
      id: `criatura-${Date.now()}`,
      nome,
      categoria,
      pvAtual: base.pvMax,
      paAtual: base.paMax,
    };
    adicionar(nova);
    setCriaturaSelecionadaId(nova.id);
  };

  const atualizarCriaturaAtiva = (dados: Partial<CriaturaCalafrio>) => {
    if (!criaturaAtiva) return;
    atualizar(criaturaAtiva.id, dados);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-card border border-border rounded-md shadow-sm">
        <div>
          <span className="calafrio-tag">BESTIÁRIO & NPCS DO MESTRE</span>
          <p className="text-xs text-muted-foreground mt-1">
            Crie e gerencie criaturas, lacaios e assombrações do submundo
            curitibano.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Lista de Criaturas + Formulário de Criação */}
        <div className="lg:col-span-4 space-y-4">
          <FormularioCriarCriatura onCriar={lidarCriar} />

          {/* Lista de Criaturas */}
          <div className="calafrio-card p-4 space-y-2">
            <span className="calafrio-tag-sm">CRIATURAS CADASTRADAS</span>
            {carregado && criaturas.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Nenhuma criatura ainda. Crie uma acima ou importe os presets
                oficiais.
              </p>
            )}
            <button
              type="button"
              onClick={importarPresetsLacaios}
              className="w-full px-2 py-1.5 border border-border rounded text-[11px] font-bold hover:bg-muted cursor-pointer"
            >
              Importar presets oficiais de Lacaios
            </button>
            <div className="entrada-lista space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {criaturas.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setCriaturaSelecionadaId(c.id)}
                  className={`flex items-center justify-between p-2.5 rounded border text-xs cursor-pointer transition-colors ${
                    criaturaAtiva?.id === c.id
                      ? "border-amber-400 bg-accent/20 text-accent-ink"
                      : "border-border bg-card/60 hover:bg-muted/40"
                  }`}
                >
                  <div>
                    <div className="font-bold flex items-center gap-1.5">
                      <Skull className="size-3 text-accent-ink" />
                      <span>{c.nome}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                        ({c.categoria})
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      APT {c.apt} · {c.pvMax} PV · {c.pd} PD
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      remover(c.id);
                    }}
                    className="p-1 text-muted-foreground hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Ficha de Estatísticas da Criatura Selecionada */}
        <div className="lg:col-span-8 space-y-4">
          {criaturaAtiva ? (
            <FichaCriaturaAtiva
              criatura={criaturaAtiva}
              onAtualizar={atualizarCriaturaAtiva}
            />
          ) : (
            <div className="calafrio-card p-8 text-center text-muted-foreground italic">
              Nenhuma criatura selecionada. Crie uma na coluna ao lado!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
