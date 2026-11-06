import { redirect } from "next/navigation";
import { NavegacaoMesa } from "@/components/mesa/navegacao-mesa";
import { obterAcessoMesa } from "@/lib/auth/acesso-mesa";

export default async function MesaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ mesaId: string }>;
}) {
  const { mesaId } = await params;
  const { acesso, membro } = await obterAcessoMesa(mesaId);
  // Mesa inexistente: cada página decide (notFound/redirect). Estranho: volta ao hub.
  if (acesso && !membro) redirect("/mesa");

  return (
    <div className="space-y-5">
      <NavegacaoMesa mesaId={mesaId} mestre={acesso?.mestre ?? false} />
      {children}
    </div>
  );
}
