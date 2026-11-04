import { notFound } from "next/navigation";
import { CentralDadosMesa } from "@/components/mesa/central-dados-mesa";
import { obterMesa } from "@/services/armazenamento-calafrio";
import { listarRolagens } from "@/services/rolagens-mesa";

export default async function MesaDadosPage({
  params,
}: {
  params: Promise<{ mesaId: string }>;
}) {
  const { mesaId } = await params;
  if (!(await obterMesa(mesaId))) notFound();

  return (
    <CentralDadosMesa
      mesaId={mesaId}
      rolagensIniciais={await listarRolagens(mesaId)}
    />
  );
}
