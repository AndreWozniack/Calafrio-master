"use client";

import {
  type CategoriaPalavraChave,
  carregarCatalogoCalafrio,
  type EfeitoCalafrio,
  type PalavraChaveNaFicha,
} from "@calafrio/core";
import { Dices, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { EditorEfeitos } from "./editor-efeitos";
import { type AbaModal, AbasModal } from "./modais/abas-modal";
import { Alternancia, Campo, classeCampo } from "./modais/campos-modal";
import {
  BotaoPrincipal,
  BotaoSecundario,
  CascaModal,
} from "./modais/casca-modal";
import {
  BuscaBiblioteca,
  CardResultado,
  FiltrosBiblioteca,
  ListaVazia,
} from "./modais/lista-biblioteca";

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
  if (!aberto) return null;
  return (
    <ConteudoModal inicial={inicial} onSalvar={onSalvar} onFechar={onFechar} />
  );
}

function ConteudoModal({ inicial, onSalvar, onFechar }: Omit<Props, "aberto">) {
  const catalogo = useMemo(() => carregarCatalogoCalafrio(), []);
  const [aba, setAba] = useState<AbaModal>(inicial ? "manual" : "biblioteca");
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

  const tabela =
    categoria === "ocupacao"
      ? catalogo.ocupacoes
      : catalogo.palavrasChaveGenericas;
  const visiveis = tabela.filter((e) =>
    e.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  const escolher = (escolhido: string) => {
    setNome(escolhido);
    setAba("manual");
  };

  const sortear = () => {
    const e = tabela[Math.floor(Math.random() * tabela.length)];
    if (e) escolher(e.nome);
  };

  const salvar = () => {
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
    onFechar();
  };

  return (
    <CascaModal
      titulo={inicial ? "Editar palavra-chave" : "Nova palavra-chave"}
      onFechar={onFechar}
      rodape={
        <>
          <BotaoSecundario onClick={onFechar}>Cancelar</BotaoSecundario>
          <BotaoPrincipal disabled={!nome.trim()} onClick={salvar}>
            <Plus className="size-5" strokeWidth={3} />
            {inicial ? "Salvar" : "Adicionar"}
          </BotaoPrincipal>
        </>
      }
    >
      <div className="space-y-4">
        <FiltrosBiblioteca
          opcoes={CATEGORIAS}
          ativo={categoria}
          onMudar={setCategoria}
        />
        <AbasModal aba={aba} onMudar={setAba} />

        {aba === "biblioteca" ? (
          <div className="space-y-3">
            <BuscaBiblioteca
              valor={busca}
              onChange={setBusca}
              placeholder={`Buscar entre ${tabela.length} opções...`}
              acao={
                <button
                  type="button"
                  onClick={sortear}
                  aria-label="Sortear no d100"
                  className="flex min-h-12 shrink-0 cursor-pointer items-center gap-1.5 border-2 border-black bg-white px-3 text-sm font-extrabold active:bg-black/10"
                >
                  <Dices className="size-5" /> d100
                </button>
              }
            />
            <div className="space-y-2">
              {visiveis.map((e) => (
                <CardResultado
                  key={e.numero}
                  titulo={e.nome}
                  meta={`d100 · ${e.numero}`}
                  selecionado={e.nome === nome}
                  onSelecionar={() => escolher(e.nome)}
                />
              ))}
              {visiveis.length === 0 && (
                <ListaVazia texto="Nada encontrado. Use a aba Manual para escrever livremente." />
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Campo rotulo="Nome">
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Escreva livremente ou escolha na Biblioteca"
                className={classeCampo}
              />
            </Campo>
            <Campo rotulo="Notas">
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
                className={classeCampo}
              />
            </Campo>
            <Alternancia
              rotulo="Concedida (não consome o limite de 2 + APT)"
              marcado={semConsumirLimite}
              onChange={setSemConsumirLimite}
            />
            <details className="border-2 border-black/30">
              <summary className="min-h-12 cursor-pointer px-3 py-3 text-base font-extrabold">
                Efeitos / modificadores ({efeitos.length})
              </summary>
              <div className="border-t-2 border-black/20 p-3">
                <EditorEfeitos efeitos={efeitos} onChange={setEfeitos} />
              </div>
            </details>
          </div>
        )}
      </div>
    </CascaModal>
  );
}
