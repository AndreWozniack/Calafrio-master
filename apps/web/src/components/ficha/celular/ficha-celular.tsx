"use client";

import {
  Backpack,
  Dices,
  Grid3x3,
  ImagePlus,
  Moon,
  Skull,
  Sun,
  User,
} from "lucide-react";
import { useRef, useState } from "react";
import type { FichaViva } from "../fichas-tipos";
import { lerImagemRedimensionada } from "../papel/retrato-papel";
import {
  CarteiraCelular,
  InventarioCelular,
  PalavrasChaveCelular,
} from "./listas-celular";
import { MatrizCelular } from "./matriz-celular";
import { VitaisCelular } from "./vitais-celular";

type Aba = "ficha" | "mochila" | "matriz";

const ABAS: { id: Aba; rotulo: string; Icone: typeof User }[] = [
  { id: "ficha", rotulo: "Ficha", Icone: User },
  { id: "mochila", rotulo: "Mochila", Icone: Backpack },
  { id: "matriz", rotulo: "Matriz", Icone: Grid3x3 },
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
    "flex min-h-14 cursor-pointer flex-col items-center justify-center gap-1 text-xs font-extrabold active:scale-95";
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
  onAbrirRolagem,
  onAbrirDanoCura,
}: {
  f: FichaViva;
  onAbrirRolagem: (nome?: string) => void;
  onAbrirDanoCura: () => void;
}) {
  const [aba, setAba] = useState<Aba>("ficha");

  return (
    <div
      className="-mx-3 -mt-3 min-h-screen space-y-5 px-3 pb-28 pt-4 text-black"
      style={{
        fontFamily: "var(--font-alegreya), Georgia, serif",
        fontWeight: 600,
        backgroundImage: "url(/assets/fundo-papel.svg)",
        backgroundSize: "40vw",
      }}
    >
      {aba === "ficha" && (
        <>
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

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t-[3px] border-black bg-white pb-[env(safe-area-inset-bottom)]">
        {ABAS.map(({ id, rotulo, Icone }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setAba(id);
              window.scrollTo({ top: 0 });
            }}
            className={`flex min-h-16 cursor-pointer flex-col items-center justify-center gap-0.5 text-xs font-extrabold ${
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
