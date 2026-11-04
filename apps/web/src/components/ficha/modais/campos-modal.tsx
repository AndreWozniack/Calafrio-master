import type { ReactNode } from "react";

export const classeCampo =
  "w-full border-2 border-black bg-white px-3 py-2.5 text-base text-black font-semibold outline-none focus:shadow-[0_0_0_2px_#fbbf24]";

export function Campo({
  rotulo,
  children,
  className = "",
}: {
  rotulo: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block min-w-0 space-y-1 ${className}`}>
      <span className="block text-sm font-extrabold uppercase tracking-wide text-black/70">
        {rotulo}
      </span>
      {children}
    </label>
  );
}

export function Alternancia({
  rotulo,
  marcado,
  onChange,
}: {
  rotulo: string;
  marcado: boolean;
  onChange: (valor: boolean) => void;
}) {
  return (
    <label
      className={`flex min-h-12 cursor-pointer items-center gap-3 border-2 border-black px-3 text-base font-bold ${
        marcado ? "bg-black text-white" : "bg-white"
      }`}
    >
      <input
        type="checkbox"
        checked={marcado}
        onChange={(e) => onChange(e.target.checked)}
        className="size-5 accent-amber-400"
      />
      {rotulo}
    </label>
  );
}

export function numeroOuIndefinido(valor: string): number | undefined {
  return valor === "" ? undefined : Number(valor);
}
