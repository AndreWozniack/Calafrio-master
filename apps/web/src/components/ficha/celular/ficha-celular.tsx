"use client";

import {
  Backpack,
  ArrowLeft,
  Dices,
  Grid3x3,
  ImagePlus,
  Moon,
  Skull,
  Sparkles,
  Sun,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import type { FichaViva } from "../fichas-tipos";
import { lerImagemRedimensionada } from "../papel/retrato-papel";
import { EcosCelular } from "./ecos-celular";
import {
  CarteiraCelular,
  InventarioCelular,
  PalavrasChaveCelular,
} from "./listas-celular";
import { MatrizCelular } from "./matriz-celular";
import { VitaisCelular } from "./vitais-celular";

type Aba = "ficha" | "mochila" | "matriz" | "ecos";

const ABAS: { id: Aba; rotulo: string; Icone: typeof User }[] = [
  { id: "ficha", rotulo: "Ficha", Icone: User },
  { id: "mochila", rotulo: "Mochila", Icone: Backpack },
  { id: "matriz", rotulo: "Matriz", Icone: Grid3x3 },
  { id: "ecos", rotulo: "Ecos", Icone: Sparkles },
];

function Cabecalho({ f }: { f: FichaViva }) {
  const entrada = useRef<HTMLInputElement>(null);
  const retrato = f.ficha.retratoUrl;
  return (
    <div className="flex items-end gap-3">
      <button
        type="button"
        onClick={() => entrada.current?.click()}
        aria-label="Trocar retrato"
        className="flex h-24 w-[4.5rem] shrink-0 cursor-pointer items-center justify-center overflow-hidden border-[3px] border-black bg-white text-black/30"
      >
        {retrato ? (
          // biome-ignore lint/performance/noImgElement: data URL local
          <img src={retrato} alt="Retrato" className="size-full object-cover" />
        ) : (
          <ImagePlus className="size-7" />
        )}
      </button>
      <input
        ref={entrada}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const arquivo = e.target.files?.[0];
          if (arquivo) {
            f.dispatch({
              tipo: "definirRetrato",
              url: await lerImagemRedimensionada(arquivo),
            });
          }
          e.target.value = "";
        }}
      />
      <div className="min-w-0 flex-1">
        <input
          value={f.ficha.nome}
          onChange={(e) => f.definirNome(e.target.value)}
          placeholder="Nome do player"
          className="w-full border-b-[3px] border-black bg-white px-2 py-2 text-2xl font-extrabold shadow-[0_0_3px_rgba(0,0,0,0.3)] outline-none placeholder:font-normal placeholder:text-black/25"
        />
        <div className="mt-1 text-right text-[10px] font-bold uppercase italic">
          Nome
        </div>
      </div>
    </div>
  );
}

function AcoesRapidas({
  f,
  onRolar,
  onDanoCura,
}: {
  f: FichaViva;
  onRolar: () => void;
  onDanoCura: () => void;
}) {
  const base =
    "pressionavel flex min-h-14 cursor-pointer flex-col items-center justify-center gap-1 text-xs font-extrabold";
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={onRolar}
        className={`${base} bg-amber-400 text-black`}
      >
        <Dices className="size-5" /> Rolar d20
      </button>
      <button
        type="button"
        onClick={onDanoCura}
        className={`${base} bg-black text-white`}
      >
        <Skull className="size-5" /> Dano / Cura
      </button>
      <button
        type="button"
        onClick={() => f.descansar("curto", 1, "fixo")}
        className={`${base} border-2 border-black bg-white`}
      >
        <Sun className="size-5" /> Descanso curto
      </button>
      <button
        type="button"
        onClick={() => f.descansar("longo", 8, "fixo")}
        className={`${base} border-2 border-black bg-white`}
      >
        <Moon className="size-5" /> Descanso longo
      </button>
    </div>
  );
}

export function FichaCelular({
  f,
  voltarHref,
  onAbrirRolagem,
  onAbrirDanoCura,
}: {
  f: FichaViva;
  voltarHref: string;
  onAbrirRolagem: (nome?: string) => void;
  onAbrirDanoCura: () => void;
}) {
  const [aba, setAba] = useState<Aba>("ficha");

  const trocarAba = (novaAba: Aba) => {
    if (novaAba === aba) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    setAba(novaAba);
  };

  return (
    <div
      data-papel
      className="min-h-dvh space-y-5 overflow-x-clip px-3.5 pb-28 pt-[max(1rem,env(safe-area-inset-top))] text-black"
      style={{
        fontFamily: "var(--font-alegreya), Georgia, serif",
        fontWeight: 600,
        backgroundImage: "url(/assets/fundo-papel.svg)",
        backgroundSize: "40vw",
      }}
    >
      <div key={aba} className="transicao-aba space-y-5 min-h-[calc(100dvh-12rem)]">
      {aba === "ficha" && (
        <>
          <div className="flex items-center justify-between gap-3">
            <Link
              href={voltarHref}
              className="flex min-h-11 items-center gap-1.5 text-sm font-extrabold"
            >
              <ArrowLeft className="size-4" strokeWidth={3} /> Players
            </Link>
            {/* biome-ignore lint/performance/noImgElement: logo estático */}
            <img
              src="/assets/Calafrio.svg"
              alt="Calafrio TTRPG"
              className="h-7 w-auto"
            />
          </div>
          <Cabecalho f={f} />
          <AcoesRapidas
            f={f}
            onRolar={() => onAbrirRolagem()}
            onDanoCura={onAbrirDanoCura}
          />
          <VitaisCelular f={f} derivada={f.derivada} />
          <CarteiraCelular f={f} />
          <PalavrasChaveCelular
            f={f}
            derivada={f.derivada}
            onRolar={onAbrirRolagem}
          />
        </>
      )}
      {aba === "mochila" && <InventarioCelular f={f} />}
      {aba === "matriz" && <MatrizCelular f={f} />}
      {aba === "ecos" && <EcosCelular f={f} />}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t-[3px] border-black bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)] pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {ABAS.map(({ id, rotulo, Icone }) => (
          <button
            key={id}
            type="button"
            onClick={() => trocarAba(id)}
            className={`pressionavel flex min-h-16 cursor-pointer flex-col items-center justify-center gap-0.5 text-xs font-extrabold transition-colors duration-200 ${
              aba === id ? "bg-black text-white" : "text-black"
            }`}
          >
            <Icone className="size-5" />
            {rotulo}
          </button>
        ))}
      </nav>
    </div>
  );
}
