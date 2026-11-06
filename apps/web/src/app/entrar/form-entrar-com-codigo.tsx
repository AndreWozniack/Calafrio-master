import { KeyRound } from "lucide-react";
import { entrarPorCodigoAction } from "../mesa/actions";

export function FormEntrarComCodigo() {
  return (
    <form
      action={entrarPorCodigoAction}
      className="calafrio-card p-4 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center"
    >
      <input
        type="text"
        name="codigo"
        placeholder="Entrar com Código (ex: CALA26)..."
        required
        autoComplete="off"
        maxLength={12}
        className="flex-1 bg-muted/60 text-sm p-2.5 rounded-lg border border-border focus:border-amber-400 outline-none font-mono uppercase"
      />
      <button
        type="submit"
        className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-sm uppercase tracking-wider rounded-lg cursor-pointer transition-colors shadow-sm"
      >
        <KeyRound className="size-4" /> Entrar
      </button>
    </form>
  );
}
