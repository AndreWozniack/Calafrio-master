import type { Metadata } from "next";
import { VisaoMesaCombate } from "@/components/mesa/visao-mesa-combate";

export const metadata: Metadata = {
  title: "Mesa de Combate | Calafrio RPG",
  description:
    "Rastreador de combate em tempo real com turnos em sentido horário, economia de 2 ações padrão + 1 ação livre e mitigação 1:1 de dano com Ânimum (PA).",
};

export default function MesaPage() {
  return (
    <div className="space-y-6">
      <VisaoMesaCombate />
    </div>
  );
}
