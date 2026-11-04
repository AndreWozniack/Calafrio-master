import { notFound } from "next/navigation";
import { PainelAnotacoesMesa } from "@/components/mesa/painel-anotacoes-mesa";
import { obterMesa } from "@/services/armazenamento-calafrio";
import { listarAnotacoes } from "@/services/anotacoes-mesa";

export default async function MesaAnotacoesPage({
  params,
}: {
  params: Promise<{ mesaId: string }>;
}) {
  const { mesaId } = await params;
  if (!(await obterMesa(mesaId))) notFound();

  return (
    <PainelAnotacoesMesa
      mesaId={mesaId}
      anotacoesIniciais={await listarAnotacoes(mesaId)}
    />
  );
}
