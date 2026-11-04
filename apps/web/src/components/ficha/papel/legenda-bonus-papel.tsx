import type { AlinhamentoAtivo } from "@calafrio/core";
import { Posicionado } from "./primitivos-papel";
import { u } from "./unidades";

const ITENS: {
  padrao: AlinhamentoAtivo["padrao"];
  x: number;
  texto: string;
  icone: React.ReactNode;
}[] = [
  {
    padrao: "horizontal",
    x: 380,
    texto: "= +3 PA",
    icone: <path d="M3 8h10M3 8l2-2M3 8l2 2M13 8l-2-2M13 8l-2 2" />,
  },
  {
    padrao: "vertical",
    x: 438,
    texto: "= +3 PD",
    icone: <path d="M8 3v10M8 3L6 5M8 3l2 2M8 13l-2-2M8 13l2-2" />,
  },
  {
    padrao: "diagonal",
    x: 494,
    texto: "= +6 PV",
    icone: <path d="M4 4l8 8M4 4h3M4 4v3M12 12H9M12 12V9" />,
  },
  {
    padrao: "quadrilatero",
    x: 552,
    texto: "= +3 VELOCIDADE",
    icone: <path d="M5 5h6v6H5zM3 3h2M13 3h-2M3 13h2M13 13h-2" />,
  },
];

export function LegendaBonusPapel({
  alinhamentos,
}: {
  alinhamentos: AlinhamentoAtivo[];
}) {
  const ativos = new Set(alinhamentos.map((a) => a.padrao));
  return (
    <>
      {ITENS.map(({ padrao, x, texto, icone }) => {
        const ativo = ativos.has(padrao);
        return (
          <Posicionado
            key={padrao}
            area={{ x, y: 33, w: 80, h: 20 }}
            className="flex items-center"
            style={{ gap: u(3) }}
          >
            <svg
              viewBox="0 0 16 16"
              className={`rounded-full border-2 border-black ${ativo ? "bg-black text-white" : "bg-white text-black"}`}
              style={{ width: u(18), height: u(18) }}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {icone}
            </svg>
            <span
              className={`italic font-bold ${ativo ? "font-black" : ""}`}
              style={{ fontSize: u(7.8) }}
            >
              {texto}
            </span>
          </Posicionado>
        );
      })}
    </>
  );
}
