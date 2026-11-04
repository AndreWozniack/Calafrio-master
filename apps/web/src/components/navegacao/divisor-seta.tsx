/** Linha de seção com ponta de seta, tirada do divider.svg da ficha impressa. */
export function DivisorSeta({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center ${className}`}>
      <span className="h-[3px] flex-1 bg-current" />
      <span className="relative block h-3.5 w-7 shrink-0 overflow-hidden dark:invert">
        {/* biome-ignore lint/performance/noImgElement: SVG estático do papel */}
        <img
          src="/assets/divider.svg"
          alt=""
          className="absolute right-0 top-0 h-full w-auto max-w-none"
        />
      </span>
    </div>
  );
}
