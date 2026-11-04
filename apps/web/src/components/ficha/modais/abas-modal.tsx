import { Library, Wrench } from "lucide-react";

export type AbaModal = "biblioteca" | "manual";

const ABAS = [
  { id: "biblioteca", rotulo: "Biblioteca", Icone: Library },
  { id: "manual", rotulo: "Manual", Icone: Wrench },
] as const;

export function AbasModal({
  aba,
  onMudar,
}: {
  aba: AbaModal;
  onMudar: (aba: AbaModal) => void;
}) {
  return (
    <div className="grid grid-cols-2 border-2 border-black">
      {ABAS.map(({ id, rotulo, Icone }) => (
        <button
          key={id}
          type="button"
          onClick={() => onMudar(id)}
          className={`flex min-h-11 cursor-pointer items-center justify-center gap-2 text-base font-extrabold ${
            aba === id ? "bg-black text-white" : "bg-white text-black"
          }`}
        >
          <Icone className="size-4" /> {rotulo}
        </button>
      ))}
    </div>
  );
}
