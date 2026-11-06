import { notFound, redirect } from "next/navigation";
import { PainelAnotacoesMesa } from "@/components/mesa/painel-anotacoes-mesa";
import { obterAcessoMesa } from "@/lib/auth/acesso-mesa";
import { listarAnotacoes } from "@/services/anotacoes-mesa";

export default async function MesaAnotacoesPage({
  params,
}: {
  params: Promise<{ mesaId: string }>;
}) {
  const { mesaId } = await params;
  const { acesso } = await obterAcessoMesa(mesaId);
  if (!acesso) notFound();
  if (!acesso.mestre) redirect(`/mesa/${mesaId}`);

  return (
    <PainelAnotacoesMesa
      mesaId={mesaId}
      anotacoesIniciais={await listarAnotacoes(mesaId)}
    />
  );
}
