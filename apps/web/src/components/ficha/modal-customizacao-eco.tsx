"use client";

import type {
  CatalogoCalafrio,
  CustomizacaoDeEco,
  EfeitoCalafrio,
  FichaCalafrio,
  RecursoDeAtivacao,
  TipoAcaoCalafrio,
} from "@calafrio/core";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { EditorEfeitos } from "./editor-efeitos";
import { Campo, classeCampo, numeroOuIndefinido } from "./modais/campos-modal";
import {
  BotaoPrincipal,
  BotaoSecundario,
  CascaModal,
} from "./modais/casca-modal";

interface Props {
  aberto: boolean;
  ficha: FichaCalafrio;
  catalogo: CatalogoCalafrio;
  onSalvar: (customizacao: CustomizacaoDeEco) => void;
  onFechar: () => void;
}

export function ModalCustomizacaoEco({ aberto, ...resto }: Props) {
  if (!aberto) return null;
  return <ConteudoModal {...resto} />;
}

function ConteudoModal({
  ficha,
  catalogo,
  onSalvar,
  onFechar,
}: Omit<Props, "aberto">) {
  const [habilidadeAlvoId, setHabilidadeAlvoId] = useState(
    ficha.matrizHabilidades[0]?.id ??
      catalogo.habilidadesParanormais[0]?.id ??
      "",
  );
  const [titulo, setTitulo] = useState("");
  const [descricaoMudanca, setDescricaoMudanca] = useState("");
  const [novoCusto, setNovoCusto] = useState<number | undefined>();
  const [novoRecurso, setNovoRecurso] = useState<RecursoDeAtivacao | "">("");
  const [novoTipoAcao, setNovoTipoAcao] = useState<TipoAcaoCalafrio | "">("");
  const [efeitosExtras, setEfeitosExtras] = useState<EfeitoCalafrio[]>([]);

  const valido = titulo.trim() !== "" && habilidadeAlvoId !== "";

  const salvar = () => {
    if (!valido) return;
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
    <CascaModal
      titulo="Aprimorar com Eco (1 Eco)"
      onFechar={onFechar}
      rodape={
        <>
          <BotaoSecundario onClick={onFechar}>Cancelar</BotaoSecundario>
          <BotaoPrincipal disabled={!valido} onClick={salvar}>
            <Sparkles className="size-5" /> Gravar
          </BotaoPrincipal>
        </>
      }
    >
      <div className="space-y-4">
        <Campo rotulo="Habilidade alvo">
          <select
            value={habilidadeAlvoId}
            onChange={(e) => setHabilidadeAlvoId(e.target.value)}
            className={classeCampo}
          >
            <optgroup label="Suas habilidades na Matriz">
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
            <optgroup label="Catálogo oficial">
              {catalogo.habilidadesParanormais.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.nome} ({h.personalidade})
                </option>
              ))}
            </optgroup>
          </select>
        </Campo>

        <Campo rotulo="Nome do aprimoramento">
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex.: Telepatia de longo alcance"
            className={classeCampo}
          />
        </Campo>

        <div className="grid grid-cols-2 gap-3">
          <Campo rotulo="Novo custo">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={novoCusto ?? ""}
              onChange={(e) => setNovoCusto(numeroOuIndefinido(e.target.value))}
              placeholder="Original"
              className={classeCampo}
            />
          </Campo>
          <Campo rotulo="Novo recurso">
            <select
              value={novoRecurso}
              onChange={(e) =>
                setNovoRecurso(e.target.value as RecursoDeAtivacao | "")
              }
              className={classeCampo}
            >
              <option value="">Original</option>
              <option value="pa">PA</option>
              <option value="pv">PV</option>
              <option value="nenhum">Nenhum</option>
            </select>
          </Campo>
          <Campo rotulo="Nova ação" className="col-span-2">
            <select
              value={novoTipoAcao}
              onChange={(e) =>
                setNovoTipoAcao(e.target.value as TipoAcaoCalafrio | "")
              }
              className={classeCampo}
            >
              <option value="">Original</option>
              <option value="padrao">Padrão</option>
              <option value="livre">Livre</option>
              <option value="reflexo">Reflexo</option>
              <option value="passiva">Passiva</option>
            </select>
          </Campo>
        </div>

        <Campo rotulo="Descrição da melhoria">
          <textarea
            value={descricaoMudanca}
            onChange={(e) => setDescricaoMudanca(e.target.value)}
            rows={4}
            placeholder="Descreva a melhoria acordada com o MdJ..."
            className={classeCampo}
          />
        </Campo>

        <details className="border-2 border-black/30">
          <summary className="min-h-12 cursor-pointer px-3 py-3 text-base font-extrabold">
            Efeitos extras ({efeitosExtras.length})
          </summary>
          <div className="border-t-2 border-black/20 p-3">
            <EditorEfeitos efeitos={efeitosExtras} onChange={setEfeitosExtras} />
          </div>
        </details>
      </div>
    </CascaModal>
  );
}
