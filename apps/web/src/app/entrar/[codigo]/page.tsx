import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { BannerEscudo } from "@/components/navegacao/banner-escudo";
import { buscarMesaPorCodigoConvite } from "@/services/armazenamento-convite";
import { ehMestreDaMesa } from "@/services/convite-regras";
import { EntrarLanding } from "./entrar-landing";

export default async function ConvitePage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/entrar/${codigo}`)}`);
  }

  const mesa = await buscarMesaPorCodigoConvite(codigo);
  if (!mesa) notFound();
  if (ehMestreDaMesa(mesa, userId)) redirect(`/mesa/${mesa.id}`);

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8 md:py-12 space-y-6">
      <BannerEscudo>
        <div className="space-y-2">
          <span className="inline-block px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded">
            Calafrio RPG · 2ª Edição
          </span>
          <p className="text-sm text-white/80 font-semibold">
            Você foi convocado para a mesa
          </p>
          <h1 className="text-2xl sm:text-3xl font-black font-heading uppercase tracking-wide text-white">
            {mesa.nome}
          </h1>
        </div>
      </BannerEscudo>
      <EntrarLanding codigo={codigo} />
    </main>
  );
}
