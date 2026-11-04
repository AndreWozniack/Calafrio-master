"use client";

import { ImagePlus, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { uploadRetratoAction } from "@/app/actions/upload";
import { Losango, Posicionado } from "./primitivos-papel";
import { u } from "./unidades";

const LADO_MAXIMO = 640;

export function lerImagemRedimensionada(arquivo: File): Promise<string> {
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
        resolve(canvas.toDataURL("image/jpeg", 0.88));
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
  const [enviando, setEnviando] = useState(false);

  const lidarArquivo = async (arquivo: File) => {
    // 1. Otimização imediata local (feedback instantâneo)
    try {
      const dataUrlLocal = await lerImagemRedimensionada(arquivo);
      onDefinir(dataUrlLocal);
    } catch (e) {
      console.warn("Erro ao ler imagem localmente:", e);
    }

    // 2. Upload para o Cloudflare R2 via Server Action
    setEnviando(true);
    try {
      const formData = new FormData();
      formData.append("arquivo", arquivo);
      const res = await uploadRetratoAction(formData);
      if (res.url) {
        onDefinir(res.url);
      }
    } catch (err) {
      console.warn("Upload para R2 falhou, mantendo versão local:", err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <Posicionado area={{ x: 58, y: 28, w: 98, h: 132 }}>
        <button
          type="button"
          onClick={() => entrada.current?.click()}
          title="Trocar retrato do investigador"
          disabled={enviando}
          className="group relative block size-full cursor-pointer overflow-hidden bg-white"
          style={{ border: `${u(2.4)} solid black` }}
        >
          {retratoUrl ? (
            // biome-ignore lint/performance/noImgElement: imagem de retrato
            <img
              src={retratoUrl}
              alt="Retrato do investigador"
              className="size-full object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-black/25">
              <ImagePlus style={{ width: u(26), height: u(26) }} />
            </span>
          )}

          {enviando && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-[10px] gap-1">
              <Loader2 className="size-4 animate-spin" />
              <span>R2 Upload...</span>
            </div>
          )}
        </button>
        <input
          ref={entrada}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const arquivo = e.target.files?.[0];
            if (arquivo) void lidarArquivo(arquivo);
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
