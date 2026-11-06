"use client";

import {
  type CategoriaPalavraChaveV1,
  type HabilidadeUnicaV1,
  type ItemV1,
  type PalavraChaveV1,
  ROTULO_CATEGORIA_PALAVRA_CHAVE_V1,
} from "@calafrio/core";
import { useState } from "react";
import { Alternancia, Campo, classeCampo } from "../modais/campos-modal";
import {
  BotaoPrincipal,
  BotaoSecundario,
  CascaModal,
} from "../modais/casca-modal";

const novoId = (prefixo: string) =>
  `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

function Rodape({
  podeSalvar,
  onSalvar,
  onFechar,
  rotulo = "Salvar",
}: {
  podeSalvar: boolean;
  onSalvar: () => void;
  onFechar: () => void;
  rotulo?: string;
}) {
  return (
    <>
      <BotaoSecundario onClick={onFechar}>Cancelar</BotaoSecundario>
      <BotaoPrincipal disabled={!podeSalvar} onClick={onSalvar}>
        {rotulo}
      </BotaoPrincipal>
    </>
  );
}

/** Texto livre de um aprimoramento (1 EP), aprovado pelo Mestre. */
export function ModalAprimoramentoV1({
  alvo,
  onSalvar,
  onFechar,
}: {
  alvo: string;
  onSalvar: (descricao: string) => void;
  onFechar: () => void;
}) {
  const [texto, setTexto] = useState("");
  const salvar = () => {
    if (!texto.trim()) return;
    onSalvar(texto.trim());
    onFechar();
  };
  return (
    <CascaModal
      titulo={`Aprimorar ${alvo}`}
      onFechar={onFechar}
      rodape={
        <Rodape
          podeSalvar={!!texto.trim()}
          onSalvar={salvar}
          onFechar={onFechar}
          rotulo="Aprimorar (1 EP)"
        />
      }
    >
      <Campo rotulo="Efeito do aprimoramento">
        <textarea
          autoFocus
          rows={4}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Descreva o efeito combinado com o Mestre…"
          className={classeCampo}
        />
      </Campo>
    </CascaModal>
  );
}

export function ModalHabilidadeUnicaV1({
  onSalvar,
  onFechar,
}: {
  onSalvar: (unica: HabilidadeUnicaV1) => void;
  onFechar: () => void;
}) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [passiva, setPassiva] = useState(false);
  const salvar = () => {
    if (!nome.trim()) return;
    onSalvar({
      id: novoId("hu"),
      nome: nome.trim(),
      descricao: descricao.trim(),
      passiva,
      aprimoramentos: [],
    });
    onFechar();
  };
  return (
    <CascaModal
      titulo="Criar habilidade única"
      onFechar={onFechar}
      rodape={
        <Rodape
          podeSalvar={!!nome.trim()}
          onSalvar={salvar}
          onFechar={onFechar}
          rotulo="Criar (1 EP)"
        />
      }
    >
      <div className="space-y-4">
        <Campo rotulo="Nome">
          <input
            autoFocus
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={classeCampo}
          />
        </Campo>
        <Campo rotulo="Descrição">
          <textarea
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className={classeCampo}
          />
        </Campo>
        <Alternancia
          rotulo="Passiva (sem custo de PA; ativa custa 3 PA)"
          marcado={passiva}
          onChange={setPassiva}
        />
      </div>
    </CascaModal>
  );
}

const CATEGORIAS: CategoriaPalavraChaveV1[] = [
  "ocupacao",
  "personalidade",
  "miscelanea",
  "livre",
];

export function ModalPalavraChaveV1({
  categoriaInicial,
  onSalvar,
  onFechar,
}: {
  categoriaInicial: CategoriaPalavraChaveV1;
  onSalvar: (palavra: PalavraChaveV1) => void;
  onFechar: () => void;
}) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState(categoriaInicial);
  const salvar = () => {
    if (!nome.trim()) return;
    onSalvar({ id: novoId("pc"), nome: nome.trim(), categoria });
    onFechar();
  };
  return (
    <CascaModal
      titulo="Nova palavra-chave"
      onFechar={onFechar}
      rodape={
        <Rodape
          podeSalvar={!!nome.trim()}
          onSalvar={salvar}
          onFechar={onFechar}
        />
      }
    >
      <div className="space-y-4">
        <Campo rotulo="Palavra-chave">
          <input
            autoFocus
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && salvar()}
            placeholder="Ex: Médica legista, Teimosa, Dirigir…"
            className={classeCampo}
          />
        </Campo>
        <Campo rotulo="Categoria">
          <select
            value={categoria}
            onChange={(e) =>
              setCategoria(e.target.value as CategoriaPalavraChaveV1)
            }
            className={classeCampo}
          >
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {ROTULO_CATEGORIA_PALAVRA_CHAVE_V1[c]}
              </option>
            ))}
          </select>
        </Campo>
      </div>
    </CascaModal>
  );
}

export function ModalItemV1({
  onSalvar,
  onFechar,
}: {
  onSalvar: (item: ItemV1) => void;
  onFechar: () => void;
}) {
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [notas, setNotas] = useState("");
  const salvar = () => {
    if (!nome.trim()) return;
    onSalvar({
      id: novoId("item"),
      nome: nome.trim(),
      quantidade: Math.max(1, Math.round(quantidade) || 1),
      notas: notas.trim() || undefined,
    });
    onFechar();
  };
  return (
    <CascaModal
      titulo="Novo item"
      onFechar={onFechar}
      rodape={
        <Rodape
          podeSalvar={!!nome.trim()}
          onSalvar={salvar}
          onFechar={onFechar}
        />
      }
    >
      <div className="space-y-4">
        <div className="flex gap-3">
          <Campo rotulo="Item" className="flex-1">
            <input
              autoFocus
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={classeCampo}
            />
          </Campo>
          <Campo rotulo="Qtd." className="w-24">
            <input
              type="number"
              min={1}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className={classeCampo}
            />
          </Campo>
        </div>
        <Campo rotulo="Notas (opcional)">
          <input
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            className={classeCampo}
          />
        </Campo>
      </div>
    </CascaModal>
  );
}
