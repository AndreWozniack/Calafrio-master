import { NavegacaoMesa } from "@/components/mesa/navegacao-mesa";

export default async function MesaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ mesaId: string }>;
}) {
  const { mesaId } = await params;

  return (
    <div className="space-y-5">
      <NavegacaoMesa mesaId={mesaId} />
      {children}
    </div>
  );
}
