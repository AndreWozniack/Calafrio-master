"use client";

import type { FichaVivaV1 } from "@calafrio/ficha-app";
import { HelpCircle, Lock, Plus } from "lucide-react";
import { useState } from "react";
import { linhasHabilidadesV1 } from "../ficha-v1/modelo-visual-v1";
import { NumeroFixo } from "../papel/campo-vital";
import {
  CaixaMoldura,
  CampoPapel,
  EtiquetaPapel,
  Posicionado,
} from "../papel/primitivos-papel";
import { u } from "../papel/unidades";
import {
  BotaoRemoverLinha,
  CabecalhoColuna,
  Coluna,
  LINHAS_MINIMAS,
  LinhaTabela,
  LosangoAprimorar,
} from "./linha-tabela-papel-v1";
import { ModalAprimoramentoV1 } from "./modais-papel-v1";
import { SeletorHabilidadePapelV1 } from "./seletor-habilidade-papel-v1";

const L_APRIMORAR = 44;
const L_GRAU = 30;
const L_NOME = 150;
const L_CUSTO = 40;

export function TabelaHabilidadesPapelV1({ f }: { f: FichaVivaV1 }) {
  const { ficha, derivada } = f;
  const [seletorAberto, setSeletorAberto] = useState(false);
  const [aprimorando, setAprimorando] = useState<{
    id: string;
    nome: string;
  } | null>(null);

  const linhas = linhasHabilidadesV1(ficha, derivada);
  const semEco = derivada.ecosGastos >= derivada.ecosMax;
  const vazias = Math.max(0, LINHAS_MINIMAS - linhas.length - 1);

  const esquecer = (id: string, nome: string) => {
    if (
      confirm(
        `Esquecer "${nome}"? Habilidades de grau maior que dependem dela também serão esquecidas.`,
      )
    )
      f.esquecerHabilidade(id);
  };

  return (
    <>
      <CaixaMoldura area={{ x: 12, y: 126, w: 636, h: 371 }} />
      <EtiquetaPapel area={{ x: 4, y: 114, w: 170, h: 26 }}>
        Habilidades Paranormais
      </EtiquetaPapel>

      <CampoPapel area={{ x: 540, y: 114, w: 96, h: 26 }}>
        <div className="flex w-full" style={{ paddingLeft: u(14) }}>
          <NumeroFixo>
            {derivada.ecosGastos}
            <span className="font-light" style={{ fontSize: u(16) }}>
              {" "}
              /{" "}
            </span>
            {derivada.ecosMax}
          </NumeroFixo>
        </div>
      </CampoPapel>
      <EtiquetaPapel area={{ x: 448, y: 114, w: 106, h: 26 }} tamanho={13}>
        Ecos psíquicos:
      </EtiquetaPapel>
      <Posicionado
        area={{ x: 540, y: 141, w: 92, h: 10 }}
        className="text-right uppercase italic text-black/60"
        style={{ fontSize: u(6.5) }}
      >
        = Nível atual
      </Posicionado>

      <Posicionado
        area={{ x: 14, y: 150, w: 632, h: 14 }}
        className="flex items-end"
        style={{ gap: u(8), paddingLeft: u(10) }}
      >
        <CabecalhoColuna largura={L_APRIMORAR}>Aprimorar</CabecalhoColuna>
        <CabecalhoColuna largura={L_GRAU} alinhar="center">
          Grau
        </CabecalhoColuna>
        <CabecalhoColuna largura={L_NOME} alinhar="center">
          Nome
        </CabecalhoColuna>
        <CabecalhoColuna largura={L_CUSTO} alinhar="center">
          Custo
        </CabecalhoColuna>
        <CabecalhoColuna alinhar="center">Descrição</CabecalhoColuna>
      </Posicionado>

      <Posicionado
        area={{ x: 14, y: 166, w: 632, h: 326 }}
        className="flex flex-col overflow-y-auto"
      >
        {linhas.map((l, i) => {
          const familiar = l.id === "familiar";
          const aprimoramentos = [0, 1].map((k) => l.aprimoramentos[k]);
          return (
            <LinhaTabela key={l.id} indice={i} invalida={l.invalida}>
              <div
                className="flex shrink-0 items-center justify-center"
                style={{ width: u(L_APRIMORAR), gap: u(8) }}
              >
                {aprimoramentos.map((a, k) => (
                  <LosangoAprimorar
                    key={k}
                    aprimoramento={a}
                    semEco={semEco}
                    inativo={l.automatica}
                    onAprimorar={() =>
                      setAprimorando({ id: l.id, nome: l.nome })
                    }
                    onRemover={() =>
                      a &&
                      confirm(`Remover o aprimoramento "${a.descricao}"?`) &&
                      f.removerAprimoramentoHabilidade(l.id, a.id)
                    }
                  />
                ))}
              </div>
              <Coluna
                largura={L_GRAU}
                className="justify-center font-extrabold"
              >
                <span style={{ fontSize: u(12) }}>{l.grauRomano}</span>
              </Coluna>
              <Coluna largura={L_NOME} className="gap-[0.6cqw]">
                <span
                  className="truncate font-extrabold"
                  style={{ fontSize: u(12) }}
                  title={l.invalida ? "Requisito não atendido" : l.nome}
                >
                  {l.nome}
                </span>
                {l.marcadores.includes("cadeado") && (
                  <Lock
                    className="shrink-0 self-center"
                    style={{ width: u(9), height: u(9) }}
                    aria-label="Marcador de cadeado"
                  />
                )}
                {l.marcadores.includes("interrogacao") && (
                  <HelpCircle
                    className="shrink-0 self-center"
                    style={{ width: u(9), height: u(9) }}
                    aria-label="Marcador de interrogação"
                  />
                )}
                {familiar && (
                  <label
                    className="ml-auto flex shrink-0 items-center italic text-black/70"
                    style={{ fontSize: u(7.5), gap: u(2) }}
                    title="PM extra no familiar (múltiplos de 3)"
                  >
                    +PM
                    <input
                      type="number"
                      min={0}
                      step={3}
                      value={l.pmExtra ?? 0}
                      onChange={(e) =>
                        f.definirPmExtra(l.id, Number(e.target.value))
                      }
                      className="bg-white text-center font-extrabold outline-none"
                      style={{
                        width: u(28),
                        fontSize: u(9),
                        border: "1px solid rgba(0,0,0,0.4)",
                      }}
                    />
                  </label>
                )}
              </Coluna>
              <Coluna largura={L_CUSTO} className="justify-center font-bold">
                <span style={{ fontSize: u(10) }}>
                  {l.custoPA === "passivo" ? "P" : `${l.custoPA} PA`}
                </span>
              </Coluna>
              <Coluna className="items-center" sublinhar={false}>
                <p
                  className="line-clamp-2 font-semibold leading-tight text-black/80"
                  style={{ fontSize: u(7.6) }}
                  title={[
                    l.descricao,
                    ...l.aprimoramentos.map((a) => `◆ ${a.descricao}`),
                  ].join("\n")}
                >
                  {l.aprimoramentos.length > 0 && (
                    <strong className="text-black">
                      {l.aprimoramentos.map((a) => `◆ ${a.descricao} `)}
                    </strong>
                  )}
                  {l.descricao}
                </p>
              </Coluna>
              {l.automatica ? (
                <span
                  className="shrink-0 italic text-black/45"
                  style={{ fontSize: u(6.5), marginRight: u(8) }}
                >
                  auto
                </span>
              ) : (
                <BotaoRemoverLinha
                  titulo={`Esquecer ${l.nome}`}
                  onClick={() => esquecer(l.id, l.nome)}
                />
              )}
            </LinhaTabela>
          );
        })}

        <LinhaTabela indice={linhas.length}>
          <button
            type="button"
            onClick={() => setSeletorAberto(true)}
            className="flex cursor-pointer items-center font-bold text-black/50 transition-colors hover:text-black"
            style={{ gap: u(4), fontSize: u(11), paddingLeft: u(4) }}
          >
            <Plus style={{ width: u(11), height: u(11) }} strokeWidth={3} />
            Memorizar habilidade ({derivada.pmRestante} PM livres)
          </button>
        </LinhaTabela>
        {Array.from({ length: vazias }, (_, k) => (
          <LinhaTabela key={`vazia-${k}`} indice={linhas.length + 1 + k} />
        ))}
      </Posicionado>

      {seletorAberto && (
        <SeletorHabilidadePapelV1
          ficha={ficha}
          derivada={derivada}
          onMemorizar={f.memorizarHabilidade}
          onFechar={() => setSeletorAberto(false)}
        />
      )}
      {aprimorando && (
        <ModalAprimoramentoV1
          alvo={aprimorando.nome}
          onSalvar={(d) => f.aprimorarHabilidade(aprimorando.id, d)}
          onFechar={() => setAprimorando(null)}
        />
      )}
    </>
  );
}
