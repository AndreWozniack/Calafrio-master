"use client";

import type { FichaVivaV1 } from "@calafrio/ficha-app";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  CaixaMoldura,
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
import {
  ModalAprimoramentoV1,
  ModalHabilidadeUnicaV1,
} from "./modais-papel-v1";

const L_APRIMORAR = 44;
const L_NOME = 170;

export function TabelaUnicasPapelV1({ f }: { f: FichaVivaV1 }) {
  const { ficha, derivada } = f;
  const [criando, setCriando] = useState(false);
  const [aprimorando, setAprimorando] = useState<{
    id: string;
    nome: string;
  } | null>(null);

  const unicas = ficha.habilidadesUnicas;
  const semEco = derivada.ecosGastos >= derivada.ecosMax;
  const vazias = Math.max(0, LINHAS_MINIMAS - unicas.length - 1);

  return (
    <>
      <CaixaMoldura area={{ x: 12, y: 520, w: 636, h: 372 }} />
      <EtiquetaPapel area={{ x: 4, y: 508, w: 140, h: 26 }}>
        Habilidades Únicas
      </EtiquetaPapel>
      <Posicionado
        area={{ x: 360, y: 524, w: 280, h: 12 }}
        className="text-right uppercase italic text-black/60"
        style={{ fontSize: u(6.5) }}
      >
        Criar: 1 EP · aprimorar: +1 EP · ativa custa 3 PA
      </Posicionado>

      <Posicionado
        area={{ x: 14, y: 540, w: 632, h: 14 }}
        className="flex items-end"
        style={{ gap: u(8), paddingLeft: u(10) }}
      >
        <CabecalhoColuna largura={L_APRIMORAR}>Aprimorar</CabecalhoColuna>
        <CabecalhoColuna largura={L_NOME} alinhar="center">
          Nome
        </CabecalhoColuna>
        <CabecalhoColuna alinhar="center">Descrição</CabecalhoColuna>
      </Posicionado>

      <Posicionado
        area={{ x: 14, y: 556, w: 632, h: 330 }}
        className="flex flex-col overflow-y-auto"
      >
        {unicas.map((hu, i) => (
          <LinhaTabela key={hu.id} indice={i}>
            <div
              className="flex shrink-0 items-center justify-center"
              style={{ width: u(L_APRIMORAR), gap: u(8) }}
            >
              {[0, 1].map((k) => {
                const a = hu.aprimoramentos[k];
                return (
                  <LosangoAprimorar
                    key={k}
                    aprimoramento={a}
                    semEco={semEco}
                    onAprimorar={() =>
                      setAprimorando({ id: hu.id, nome: hu.nome })
                    }
                    onRemover={() =>
                      a &&
                      confirm(`Remover o aprimoramento "${a.descricao}"?`) &&
                      f.removerAprimoramentoHabilidadeUnica(hu.id, a.id)
                    }
                  />
                );
              })}
            </div>
            <Coluna largura={L_NOME}>
              <span
                className="truncate font-extrabold"
                style={{ fontSize: u(12) }}
              >
                {hu.nome}
              </span>
              <span
                className="ml-auto shrink-0 font-bold italic text-black/60"
                style={{ fontSize: u(8) }}
              >
                {hu.passiva ? "P" : "3 PA"}
              </span>
            </Coluna>
            <Coluna className="items-center" sublinhar={false}>
              <p
                className="line-clamp-2 font-semibold leading-tight text-black/80"
                style={{ fontSize: u(7.6) }}
                title={[
                  hu.descricao,
                  ...hu.aprimoramentos.map((a) => `◆ ${a.descricao}`),
                ].join("\n")}
              >
                {hu.aprimoramentos.length > 0 && (
                  <strong className="text-black">
                    {hu.aprimoramentos.map((a) => `◆ ${a.descricao} `)}
                  </strong>
                )}
                {hu.descricao}
              </p>
            </Coluna>
            <BotaoRemoverLinha
              titulo={`Remover ${hu.nome}`}
              onClick={() =>
                confirm(`Remover a habilidade única "${hu.nome}"?`) &&
                f.removerHabilidadeUnica(hu.id)
              }
            />
          </LinhaTabela>
        ))}

        <LinhaTabela indice={unicas.length}>
          <button
            type="button"
            disabled={semEco}
            onClick={() => setCriando(true)}
            title={semEco ? "Sem EP livre" : "Criar habilidade única (1 EP)"}
            className="flex cursor-pointer items-center font-bold text-black/50 transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-black/50"
            style={{ gap: u(4), fontSize: u(11), paddingLeft: u(4) }}
          >
            <Plus style={{ width: u(11), height: u(11) }} strokeWidth={3} />
            {semEco
              ? "Criar habilidade única (sem EP livre)"
              : "Criar habilidade única"}
          </button>
        </LinhaTabela>
        {Array.from({ length: vazias }, (_, k) => (
          <LinhaTabela key={`vazia-${k}`} indice={unicas.length + 1 + k} />
        ))}
      </Posicionado>

      {criando && (
        <ModalHabilidadeUnicaV1
          onSalvar={f.adicionarHabilidadeUnica}
          onFechar={() => setCriando(false)}
        />
      )}
      {aprimorando && (
        <ModalAprimoramentoV1
          alvo={aprimorando.nome}
          onSalvar={(d) => f.aprimorarHabilidadeUnica(aprimorando.id, d)}
          onFechar={() => setAprimorando(null)}
        />
      )}
    </>
  );
}
