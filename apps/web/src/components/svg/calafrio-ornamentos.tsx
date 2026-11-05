import Image from "next/image";

export function CalafrioLogo({
  className = "h-7 sm:h-8",
}: {
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <Image
        src="/assets/Calafrio.svg"
        alt="Calafrio RPG"
        width={549}
        height={99}
        priority
        className="h-6 sm:h-7.5 w-auto object-contain dark:invert transition-[filter]"
      />
      <span className="text-[10px] font-bold tracking-widest border border-amber-500/40 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded-xs uppercase">
        2e TTRPG
      </span>
    </div>
  );
}

export function DiamanteOrnamento({
  className = "size-3 text-accent-ink",
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <polygon points="12,2 22,12 12,22 2,12" />
    </svg>
  );
}

export function BordaGeometricaCalafrio({
  className = "w-full text-foreground/40",
}: {
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between overflow-hidden opacity-60 my-2 select-none ${className}`}
    >
      {Array.from({ length: 24 }).map((_, i) => (
        <span key={i} className="text-[10px] tracking-tighter">
          ▲▼◈
        </span>
      ))}
    </div>
  );
}

export function CadeadoFocoIcon({
  foco,
  className = "size-4",
}: {
  foco: "sim" | "condicional" | "nao";
  className?: string;
}) {
  if (foco === "nao") return null;
  return (
    <span
      title={
        foco === "sim"
          ? "Requer Foco (ação prolongada concentrada)"
          : "Pode requerer Foco"
      }
      className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-bold ${
        foco === "sim"
          ? "bg-amber-500/20 text-accent-ink border border-amber-500/40"
          : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
      }`}
    >
      🔒{foco === "condicional" ? "?" : ""}
    </span>
  );
}
