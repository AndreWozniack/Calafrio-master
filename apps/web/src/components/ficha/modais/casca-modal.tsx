"use client";

import { X } from "lucide-react";
import { type ReactNode, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { EtiquetaCelular } from "../celular/blocos-celular";

interface CascaModalProps {
  titulo: string;
  onFechar: () => void;
  children: ReactNode;
  rodape?: ReactNode;
}

const aoMontar = () => () => {};
const noCliente = () => true;
const noServidor = () => false;

/**
 * Casca única dos modais da ficha: tela cheia no celular, caixa central no desktop.
 * Usa `dvh` para respeitar as barras do navegador móvel, rolagem só no miolo e rodapé fixo.
 */
export function CascaModal({
  titulo,
  onFechar,
  children,
  rodape,
}: CascaModalProps) {
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
    };
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", aoTeclar);
    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [onFechar]);

  const montado = useSyncExternalStore(aoMontar, noCliente, noServidor);
  if (!montado) return null;

  // Portal no body: ancestrais com `transform` (ex.: ficha centralizada) quebram `fixed`.
  return createPortal(
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape tratado no window
    <div
      className="modal-fundo fixed inset-0 z-50 flex items-stretch justify-center bg-black/70 sm:items-center sm:p-4"
      onClick={onFechar}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
        className="modal-caixa flex h-dvh w-full flex-col bg-white text-black shadow-2xl sm:h-auto sm:max-h-[90dvh] sm:max-w-2xl sm:border-[3px] sm:border-black"
        style={{ fontFamily: "var(--font-alegreya), Georgia, serif" }}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b-[3px] border-black px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <EtiquetaCelular className="!text-base uppercase">
            {titulo}
          </EtiquetaCelular>
          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar"
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center active:bg-black/10"
          >
            <X className="size-6" strokeWidth={3} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          {children}
        </div>

        {rodape && (
          <footer className="flex shrink-0 gap-2 border-t-[3px] border-black px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
            {rodape}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}

const botao =
  "pressionavel flex min-h-12 cursor-pointer items-center justify-center gap-2 border-2 border-black px-4 text-base font-extrabold active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40";

export function BotaoSecundario({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={`${botao} bg-white`}>
      {children}
    </button>
  );
}

export function BotaoPrincipal({
  children,
  disabled,
  type = "button",
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${botao} flex-1 bg-black text-white`}
    >
      {children}
    </button>
  );
}
