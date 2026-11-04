import { Minus, Plus } from "lucide-react";
import type { ReactNode } from "react";

/** Etiqueta preta hexagonal, a mesma linguagem visual da ficha impressa. */
export function EtiquetaCelular({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`calafrio-tag text-[13px] normal-case tracking-normal ${className}`}
      style={{ fontFamily: "var(--font-alegreya), Georgia, serif" }}
    >
      {children}
    </span>
  );
}

export function PassoCelular({
  sentido,
  titulo,
  onClick,
}: {
  sentido: "mais" | "menos";
  titulo: string;
  onClick: () => void;
}) {
  const Icone = sentido === "mais" ? Plus : Minus;
  return (
    <button
      type="button"
      aria-label={titulo}
      title={titulo}
      onClick={onClick}
      className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black text-white active:scale-90"
    >
      <Icone className="size-5" strokeWidth={3} />
    </button>
  );
}

export function CartaoPapel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-w-0 bg-white p-3 shadow-[0_0_3px_rgba(0,0,0,0.4)] ${className}`}
    >
      {children}
    </div>
  );
}

export function TituloSecaoCelular({
  children,
  detalhe,
}: {
  children: ReactNode;
  detalhe?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <EtiquetaCelular>{children}</EtiquetaCelular>
      <span className="h-[3px] flex-1 bg-black" />
      {detalhe && (
        <span className="text-[10px] font-bold uppercase italic text-black/70">
          {detalhe}
        </span>
      )}
    </div>
  );
}
