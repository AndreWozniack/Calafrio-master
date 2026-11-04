import { Search } from "lucide-react";
import type { ReactNode } from "react";

export function BuscaBiblioteca({
  valor,
  onChange,
  placeholder,
  acao,
}: {
  valor: string;
  onChange: (v: string) => void;
  placeholder: string;
  acao?: ReactNode;
}) {
  return (
    <div className="flex gap-2">
      <label className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/50" />
        <input
          type="search"
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border-2 border-black bg-white py-2.5 pl-9 pr-3 text-base font-semibold outline-none focus:shadow-[0_0_0_2px_#fbbf24]"
        />
      </label>
      {acao}
    </div>
  );
}

export function FiltrosBiblioteca<T extends string>({
  opcoes,
  ativo,
  onMudar,
}: {
  opcoes: { id: T; rotulo: string }[];
  ativo: T;
  onMudar: (id: T) => void;
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {opcoes.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onMudar(o.id)}
          className={`min-h-10 shrink-0 cursor-pointer border-2 border-black px-3.5 text-sm font-extrabold ${
            ativo === o.id ? "bg-black text-white" : "bg-white"
          }`}
        >
          {o.rotulo}
        </button>
      ))}
    </div>
  );
}

export function CardResultado({
  titulo,
  descricao,
  meta,
  selecionado,
  onSelecionar,
}: {
  titulo: string;
  descricao?: string;
  meta?: string;
  selecionado?: boolean;
  onSelecionar: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelecionar}
      className={`pressionavel grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-2 px-3 py-2.5 text-left active:bg-black/5 ${
        selecionado ? "border-black bg-amber-100" : "border-black/25 bg-white"
      }`}
    >
      <span className="min-w-0">
        <span className="block text-base font-extrabold leading-tight">
          {titulo}
        </span>
        {descricao && (
          <span className="mt-0.5 line-clamp-2 block text-sm font-medium leading-snug text-black/70">
            {descricao}
          </span>
        )}
      </span>
      {meta && (
        <span className="whitespace-nowrap text-right text-xs font-extrabold uppercase text-black/70">
          {meta}
        </span>
      )}
    </button>
  );
}

export function ListaVazia({ texto }: { texto: string }) {
  return (
    <p className="border-2 border-dashed border-black/30 px-3 py-6 text-center text-sm font-semibold italic text-black/60">
      {texto}
    </p>
  );
}
