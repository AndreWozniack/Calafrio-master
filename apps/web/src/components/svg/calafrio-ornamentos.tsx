import React from "react";

export function CalafrioLogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 font-black tracking-widest uppercase select-none ${className}`}>
      <span className="text-xl sm:text-2xl font-black bg-black text-white px-2 py-0.5 border border-white/20 calafrio-tag">
        CALAFRIO
      </span>
      <span className="text-[10px] text-amber-400 font-bold tracking-widest border border-amber-400/40 px-1 py-0.5 rounded-xs">
        2e TTRPG
      </span>
    </div>
  );
}

export function DiamanteOrnamento({ className = "size-3 text-amber-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <polygon points="12,2 22,12 12,22 2,12" />
    </svg>
  );
}

export function BordaGeometricaCalafrio({ className = "w-full text-foreground/40" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-between overflow-hidden opacity-60 my-2 select-none ${className}`}>
      {Array.from({ length: 24 }).map((_, i) => (
        <span key={i} className="text-[10px] tracking-tighter">
          ▲▼◈
        </span>
      ))}
    </div>
  );
}

export function CadeadoFocoIcon({ foco, className = "size-4" }: { foco: "sim" | "condicional" | "nao"; className?: string }) {
  if (foco === "nao") return null;
  return (
    <span
      title={foco === "sim" ? "Requer Foco (ação prolongada concentrada)" : "Pode requerer Foco"}
      className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-bold ${
        foco === "sim" ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
      }`}
    >
      🔒{foco === "condicional" ? "?" : ""}
    </span>
  );
}
