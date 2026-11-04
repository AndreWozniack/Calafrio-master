"use client";

import { ImagePlus } from "lucide-react";
import { useRef } from "react";
import { Losango, Posicionado } from "./primitivos-papel";
import { u } from "./unidades";

const LADO_MAXIMO = 480;

function lerImagemRedimensionada(arquivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onerror = () => reject(leitor.error);
    leitor.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("imagem inválida"));
      img.onload = () => {
        const escala = Math.min(
          1,
          LADO_MAXIMO / Math.max(img.width, img.height),
        );
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        canvas
          .getContext("2d")
          ?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = String(leitor.result);
    };
    leitor.readAsDataURL(arquivo);
  });
}

export function RetratoPapel({
  retratoUrl,
  onDefinir,
}: {
  retratoUrl?: string;
  onDefinir: (url: string) => void;
}) {
  const entrada = useRef<HTMLInputElement>(null);

  return (
    <>
      <Posicionado area={{ x: 58, y: 28, w: 98, h: 132 }}>
        <button
          type="button"
          onClick={() => entrada.current?.click()}
          title="Trocar retrato"
          className="group relative block size-full cursor-pointer overflow-hidden bg-white"
          style={{ border: `${u(2.4)} solid black` }}
        >
          {retratoUrl ? (
            // biome-ignore lint/performance/noImgElement: data URL local
            <img
              src={retratoUrl}
              alt="Retrato"
              className="size-full object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-black/25">
              <ImagePlus style={{ width: u(26), height: u(26) }} />
            </span>
          )}
        </button>
        <input
          ref={entrada}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const arquivo = e.target.files?.[0];
            if (arquivo) onDefinir(await lerImagemRedimensionada(arquivo));
            e.target.value = "";
          }}
        />
      </Posicionado>
      <Posicionado
        area={{ x: 78, y: 158, w: 58, h: 4 }}
        style={{
          backgroundImage: "radial-gradient(circle, #000 45%, transparent 50%)",
          backgroundSize: `${u(5)} ${u(4)}`,
        }}
      />
      <Losango cx={107} cy={159} lado={9} />
    </>
  );
}
