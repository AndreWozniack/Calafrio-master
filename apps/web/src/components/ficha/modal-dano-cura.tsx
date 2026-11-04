"use client";

import { type EspectroDeDano, TOKENS_ESPECTRO_DANO } from "@calafrio/tema";
import { Heart, Skull, Zap } from "lucide-react";
import { useState } from "react";
import { BotaoPrincipal, BotaoSecundario, CascaModal } from "./modais/casca-modal";

type Modo = "dano" | "pv" | "pa";

interface ModalDanoCuraProps {
  pvAtual: number;
  paAtual: number;
  onDano: (valor: number, espectro: EspectroDeDano, paMitigar: number) => void;
  onCurarPv: (valor: number) => void;
  onCurarPa: (valor: number) => void;
  onFechar: () => void;
}

const MODOS: { id: Modo; rotulo: string; Icone: typeof Skull }[] = [
  { id: "dano", rotulo: "Sofrer dano", Icone: Skull },
  { id: "pv", rotulo: "Curar PV", Icone: Heart },
  { id: "pa", rotulo: "Recuperar PA", Icone: Zap },
];

const ATALHOS = [1, 2, 3, 5, 10];

export function ModalDanoCura({
  pvAtual,
  paAtual,
  onDano,
  onCurarPv,
  onCurarPa,
  onFechar,
}: ModalDanoCuraProps) {
  const [modo, setModo] = useState<Modo>("dano");
  const [valor, setValor] = useState(1);
  const [espectro, setEspectro] = useState<EspectroDeDano>("fisico");
  const [paMitigar, setPaMitigar] = useState(0);

  const aplicar = () => {
    if (valor <= 0) return;
    if (modo === "dano") onDano(valor, espectro, paMitigar);
    else if (modo === "pv") onCurarPv(valor);
    else onCurarPa(valor);
    onFechar();
  };

  return (
    <CascaModal
      titulo="Dano e cura"
      onFechar={onFechar}
      rodape={
        <>
          <BotaoSecundario onClick={onFechar}>Cancelar</BotaoSecundario>
          <BotaoPrincipal disabled={valor <= 0} onClick={aplicar}>
            Aplicar
          </BotaoPrincipal>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm font-extrabold uppercase text-black/70">
          PV {pvAtual} · PA {paAtual}
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {MODOS.map(({ id, rotulo, Icone }) => (
            <button
              key={id}
              type="button"
              onClick={() => setModo(id)}
              className={`flex cursor-pointer flex-col items-center gap-1 px-1 py-3 text-sm font-extrabold ${
                modo === id
                  ? "bg-black text-white"
                  : "border-2 border-black bg-white"
              }`}
            >
              <Icone className="size-4" />
              {rotulo}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-extrabold uppercase text-black/70">
            Quantidade
            <input
              type="number"
              min={1}
              value={valor}
              onChange={(e) => setValor(Number(e.target.value))}
              className="mt-1 w-full border-2 border-black bg-white px-3 py-3 text-center text-3xl font-black text-black outline-none"
            />
          </label>
          <div className="flex gap-1.5">
            {ATALHOS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setValor(n)}
                className="min-h-11 flex-1 cursor-pointer border-2 border-black bg-white text-base font-extrabold active:bg-black active:text-white"
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {modo === "dano" && (
          <div className="grid grid-cols-2 gap-2">
            <label className="block text-sm font-extrabold uppercase text-black/70">
              Espectro
              <select
                value={espectro}
                onChange={(e) => setEspectro(e.target.value as EspectroDeDano)}
                className="mt-1 w-full border-2 border-black bg-white px-2 py-2.5 text-base font-semibold normal-case"
              >
                {Object.values(TOKENS_ESPECTRO_DANO).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.emoji} {t.rotulo}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-extrabold uppercase text-black/70">
              PA para mitigar
              <input
                type="number"
                min={0}
                max={paAtual}
                value={paMitigar}
                onChange={(e) => setPaMitigar(Number(e.target.value))}
                className="mt-1 w-full border-2 border-black bg-white px-2 py-2.5 text-base font-semibold"
              />
            </label>
          </div>
        )}

      </div>
    </CascaModal>
  );
}
