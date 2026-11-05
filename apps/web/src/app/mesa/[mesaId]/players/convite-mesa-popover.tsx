"use client";

import { Check, Copy, RefreshCw, UserPlus } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { regerarConviteAction } from "./actions";

export function ConviteMesaPopover({
  mesaId,
  codigoConvite,
}: {
  mesaId: string;
  codigoConvite: string;
}) {
  const [aberto, setAberto] = useState(false);
  const [codigo, setCodigo] = useState(codigoConvite);
  const [origem, setOrigem] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciar] = useTransition();
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => setOrigem(window.location.origin), []);

  useEffect(() => {
    if (!aberto) return;
    const fora = (e: MouseEvent) => {
      if (raiz.current && !raiz.current.contains(e.target as Node)) {
        setAberto(false);
        setConfirmando(false);
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        setConfirmando(false);
      }
    };
    document.addEventListener("mousedown", fora);
    window.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fora);
      window.removeEventListener("keydown", esc);
    };
  }, [aberto]);

  const url = `${origem}/entrar/${codigo}`;

  const copiar = async () => {
    await navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const regerar = () =>
    iniciar(async () => {
      setErro(null);
      try {
        setCodigo(await regerarConviteAction(mesaId));
        setConfirmando(false);
      } catch {
        setErro("Não foi possível regerar o código.");
      }
    });

  return (
    <div ref={raiz} className="relative">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="flex items-center gap-1.5 px-4 py-2 border border-border hover:border-amber-400/60 text-foreground font-black text-xs uppercase tracking-wider rounded-lg cursor-pointer transition-colors"
      >
        <UserPlus className="size-4" /> Convidar Jogadores
      </button>

      {aberto && (
        <div className="absolute right-0 z-30 mt-2 w-[min(22rem,calc(100vw-2rem))] calafrio-card p-4 space-y-3 shadow-lg">
          <p className="text-xs font-bold text-muted-foreground">
            Envie este link aos jogadores. Código:{" "}
            <span className="font-mono text-foreground">{codigo}</span>
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={url}
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 min-w-0 bg-muted/60 text-xs p-2 rounded-lg border border-border font-mono"
            />
            <button
              type="button"
              onClick={copiar}
              className="flex items-center gap-1 px-3 py-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs rounded-lg cursor-pointer"
            >
              {copiado ? (
                <>
                  <Check className="size-3.5" /> Copiado!
                </>
              ) : (
                <>
                  <Copy className="size-3.5" /> Copiar
                </>
              )}
            </button>
          </div>

          {confirmando ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-red-400">
                Isso invalida o link atual. Confirmar?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={pendente}
                  onClick={regerar}
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-400 disabled:opacity-60 text-white font-black text-xs rounded-lg cursor-pointer"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmando(false)}
                  className="px-3 py-1.5 border border-border text-xs font-bold rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmando(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <RefreshCw className="size-3.5" /> Regerar código
            </button>
          )}
          {erro && <p className="text-xs font-semibold text-red-400">{erro}</p>}
        </div>
      )}
    </div>
  );
}
