"use client";

import type {
  EfeitoCalafrio,
  HabilidadeUnicaCalafrio,
  PersonalidadeCalafrio,
  TipoAcaoCalafrio,
} from "@calafrio/core";
import { TOKENS_PERSONALIDADE } from "@calafrio/tema";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { EditorEfeitos } from "./editor-efeitos";
import { Campo, classeCampo } from "./modais/campos-modal";
import {
  BotaoPrincipal,
  BotaoSecundario,
  CascaModal,
} from "./modais/casca-modal";

interface Props {
  aberto: boolean;
  inicial?: HabilidadeUnicaCalafrio;
  onSalvar: (unica: HabilidadeUnicaCalafrio) => void;
  onFechar: () => void;
}

const TIPOS_ACAO: { id: TipoAcaoCalafrio; rotulo: string }[] = [
  { id: "padrao", rotulo: "Padrão" },
  { id: "livre", rotulo: "Livre" },
  { id: "reflexo", rotulo: "Reflexo" },
  { id: "preparada", rotulo: "Preparada" },
  { id: "passiva", rotulo: "Passiva" },
];

export function ModalHabilidadeUnica({
  aberto,
  inicial,
  onSalvar,
  onFechar,
}: Props) {
  if (!aberto) return null;
  return (
    <ConteudoModal inicial={inicial} onSalvar={onSalvar} onFechar={onFechar} />
  );
}

function ConteudoModal({ inicial, onSalvar, onFechar }: Omit<Props, "aberto">) {
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

  const valido = nome.trim() !== "" && descricao.trim() !== "";

  const salvar = () => {
    if (!valido) return;
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
    onFechar();
  };

  return (
    <CascaModal
      titulo={inicial ? "Editar habilidade única" : "Nova habilidade única"}
      onFechar={onFechar}
      rodape={
        <>
          <BotaoSecundario onClick={onFechar}>Cancelar</BotaoSecundario>
          <BotaoPrincipal disabled={!valido} onClick={salvar}>
            <Sparkles className="size-5" />
            {inicial ? "Salvar" : "Forjar habilidade"}
          </BotaoPrincipal>
        </>
      }
    >
      <div className="space-y-4">
        <Campo rotulo="Nome da habilidade">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Guarda-Chuva Eletrocutante"
            className={classeCampo}
          />
        </Campo>

        <div className="grid grid-cols-2 gap-3">
          <Campo rotulo="Ação">
            <select
              value={tipoAcao}
              onChange={(e) => setTipoAcao(e.target.value as TipoAcaoCalafrio)}
              className={classeCampo}
            >
              {TIPOS_ACAO.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.rotulo}
                </option>
              ))}
            </select>
          </Campo>
          <Campo rotulo="Recurso">
            <select
              value={recurso}
              onChange={(e) =>
                setRecurso(e.target.value as HabilidadeUnicaCalafrio["recurso"])
              }
              className={classeCampo}
            >
              <option value="pa">PA</option>
              <option value="pv">PV</option>
              <option value="nenhum">Nenhum</option>
            </select>
          </Campo>
          <Campo rotulo="Custo">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={custo}
              onChange={(e) => setCusto(Number(e.target.value))}
              className={classeCampo}
            />
          </Campo>
          <Campo rotulo="Ecos gastos">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={ecosInvestidos}
              onChange={(e) => setEcosInvestidos(Number(e.target.value))}
              className={classeCampo}
            />
          </Campo>
        </div>

        <Campo rotulo="Personalidade de alinhamento (se o Mestre permitir)">
          <select
            value={personalidade}
            onChange={(e) =>
              setPersonalidade(
                e.target.value as PersonalidadeCalafrio | "nenhum",
              )
            }
            className={classeCampo}
          >
            <option value="nenhum">Nenhuma (neutra, não pontua)</option>
            {Object.entries(TOKENS_PERSONALIDADE).map(([key, token]) => (
              <option key={key} value={key}>
                {token.emoji} {token.nome}
              </option>
            ))}
          </select>
        </Campo>

        <Campo rotulo="Descrição do efeito">
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={4}
            placeholder="Descreva o funcionamento acordado com o MdJ..."
            className={classeCampo}
          />
        </Campo>

        <details className="border-2 border-black/30">
          <summary className="min-h-12 cursor-pointer px-3 py-3 text-base font-extrabold">
            Efeitos / modificadores ({efeitos.length})
          </summary>
          <div className="border-t-2 border-black/20 p-3">
            <EditorEfeitos efeitos={efeitos} onChange={setEfeitos} />
          </div>
        </details>
      </div>
    </CascaModal>
  );
}
