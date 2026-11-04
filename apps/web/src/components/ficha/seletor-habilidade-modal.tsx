"use client";

import type {
  AlocacaoSlotMatriz,
  CatalogoCalafrio,
  HabilidadeUnicaCalafrio,
} from "@calafrio/core";
import { TOKENS_PERSONALIDADE } from "@calafrio/tema";
import { useState } from "react";
import { BotaoSecundario, CascaModal } from "./modais/casca-modal";
import {
  BuscaBiblioteca,
  CardResultado,
  FiltrosBiblioteca,
  ListaVazia,
} from "./modais/lista-biblioteca";

interface SeletorHabilidadeModalProps {
  slot: number;
  catalogo: CatalogoCalafrio;
  habilidadesUnicas: HabilidadeUnicaCalafrio[];
  onAlocar: (slot: number, alocacao: AlocacaoSlotMatriz) => void;
  onFechar: () => void;
}

const FILTROS = [
  { id: "todas", rotulo: "Todas" },
  ...Object.entries(TOKENS_PERSONALIDADE).map(([id, t]) => ({
    id,
    rotulo: `${t.emoji} ${t.nome}`,
  })),
];

export function SeletorHabilidadeModal({
  slot,
  catalogo,
  habilidadesUnicas,
  onAlocar,
  onFechar,
}: SeletorHabilidadeModalProps) {
  const [filtro, setFiltro] = useState("todas");
  const [busca, setBusca] = useState("");

  const habilidades = catalogo.habilidadesParanormais.filter(
    (h) =>
      (filtro === "todas" || h.personalidade === filtro) &&
      h.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  const alocar = (tipo: AlocacaoSlotMatriz["tipo"], id: string) => {
    onAlocar(slot, { slot, tipo, id });
    onFechar();
  };

  return (
    <CascaModal
      titulo={`Habilidade do slot #${slot + 1}`}
      onFechar={onFechar}
      rodape={<BotaoSecundario onClick={onFechar}>Cancelar</BotaoSecundario>}
    >
      <div className="space-y-3">
        <BuscaBiblioteca
          valor={busca}
          onChange={setBusca}
          placeholder={`Buscar entre ${catalogo.habilidadesParanormais.length} habilidades...`}
        />
        <FiltrosBiblioteca opcoes={FILTROS} ativo={filtro} onMudar={setFiltro} />

        {habilidadesUnicas.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-extrabold uppercase text-black/70">
              Suas habilidades únicas
            </p>
            {habilidadesUnicas.map((u) => (
              <CardResultado
                key={u.id}
                titulo={u.nome}
                descricao={u.descricao}
                meta={`${u.custo} ${u.recurso.toUpperCase()}`}
                onSelecionar={() => alocar("unica", u.id)}
              />
            ))}
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-extrabold uppercase text-black/70">
            Catálogo oficial ({habilidades.length})
          </p>
          {habilidades.map((hab) => {
            const token = TOKENS_PERSONALIDADE[hab.personalidade];
            return (
              <CardResultado
                key={hab.id}
                titulo={`${token.emoji} ${hab.nome}`}
                descricao={hab.descricao}
                meta={`${hab.custoPA === 0 ? "0" : hab.custoPA} PA · ${hab.dominio === "positivo" ? "+" : "−"}`}
                onSelecionar={() => alocar("paranormal", hab.id)}
              />
            );
          })}
          {habilidades.length === 0 && (
            <ListaVazia texto="Nenhuma habilidade encontrada." />
          )}
        </div>
      </div>
    </CascaModal>
  );
}
