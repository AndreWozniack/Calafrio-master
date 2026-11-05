"use client";

import type { FichaDerivadaCalafrio } from "@calafrio/core";
import type { FichaViva } from "../fichas-tipos";
import { CartaoPapel, EtiquetaCelular, PassoCelular } from "./blocos-celular";

/** Reinicia o pulso do número quando o valor muda. */
function extrairChave(children: React.ReactNode): string {
  return Array.isArray(children)
    ? children.map((c) => (typeof c === "object" ? "" : String(c))).join("")
    : String(children);
}

function CartaoVital({
  rotulo,
  legenda,
  children,
}: {
  rotulo: string;
  legenda: string;
  children: React.ReactNode;
}) {
  return (
    <CartaoPapel className="space-y-1.5">
      <EtiquetaCelular>{rotulo}</EtiquetaCelular>
      <div className="flex min-h-10 items-center justify-between gap-1">
        {children}
      </div>
      <div className="text-right text-[9px] font-bold uppercase italic text-black/60">
        {legenda}
      </div>
    </CartaoPapel>
  );
}

function ValorGrande({ children }: { children: React.ReactNode }) {
  return (
    <span className="min-w-0 flex-1 text-center text-2xl font-extrabold leading-none">
      <span key={String(extrairChave(children))} className="valor-pulso">
        {children}
      </span>
    </span>
  );
}

function Ajustavel({
  valor,
  texto,
  rotulo,
  onMudar,
}: {
  valor: number;
  texto: React.ReactNode;
  rotulo: string;
  onMudar: (n: number) => void;
}) {
  return (
    <>
      <PassoCelular
        sentido="menos"
        titulo={`Diminuir ${rotulo}`}
        onClick={() => onMudar(valor - 1)}
      />
      <ValorGrande>{texto}</ValorGrande>
      <PassoCelular
        sentido="mais"
        titulo={`Aumentar ${rotulo}`}
        onClick={() => onMudar(valor + 1)}
      />
    </>
  );
}

export function VitaisCelular({
  f,
  derivada,
}: {
  f: FichaViva;
  derivada: FichaDerivadaCalafrio;
}) {
  return (
    <div className="entrada-lista grid grid-cols-2 gap-3 [&>*]:min-w-0">
      <CartaoVital rotulo="Vida (PV)" legenda="= 3 + 3*APT">
        <Ajustavel
          valor={derivada.pvAtual}
          rotulo="PV"
          onMudar={f.definirPvAtual}
          texto={
            <>
              {derivada.pvAtual}
              <span className="text-base text-black/50">
                {" "}
                /{derivada.pvMax}
              </span>
            </>
          }
        />
      </CartaoVital>
      <CartaoVital rotulo="Ânimum (PA)" legenda="= 3 + 3*APT">
        <Ajustavel
          valor={derivada.paAtual}
          rotulo="PA"
          onMudar={f.definirPaAtual}
          texto={
            <>
              {derivada.paAtual}
              <span className="text-base text-black/50">
                {" "}
                /{derivada.paMax}
              </span>
            </>
          }
        />
      </CartaoVital>
      <CartaoVital rotulo="Aptidão (APT)" legenda="= concedido pelo MdJ">
        <Ajustavel
          valor={f.ficha.aptBase}
          rotulo="APT"
          onMudar={f.definirApt}
          texto={f.ficha.aptBase}
        />
      </CartaoVital>
      <CartaoVital rotulo="Defesa (PD)" legenda="= 3*APT">
        <ValorGrande>{derivada.pd}</ValorGrande>
      </CartaoVital>
      <CartaoVital rotulo="Velocidade" legenda="= 6 + bônus diversos">
        <ValorGrande>{derivada.velocidade}</ValorGrande>
      </CartaoVital>
      <CartaoVital rotulo="Ecos" legenda="= APT">
        <ValorGrande>
          {derivada.ecosDisponiveis}
          <span className="text-base text-black/50"> /{derivada.ecosMax}</span>
        </ValorGrande>
      </CartaoVital>
    </div>
  );
}
