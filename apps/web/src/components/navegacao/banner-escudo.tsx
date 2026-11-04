import type { ReactNode } from "react";

/** Faixa escura com a arte do "Escudo de Mestre"; o texto interno deve ser claro. */
export function BannerEscudo({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border-2 border-black bg-[#0F0B28] text-white shadow-[3px_3px_0px_#000] ${className}`}
      style={{
        backgroundImage: "url(/assets/escudo-mestre.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#0F0B28]/90 via-[#0F0B28]/55 to-transparent"
      />
      <div className="relative px-5 py-5 sm:px-6 sm:py-6">{children}</div>
    </div>
  );
}
