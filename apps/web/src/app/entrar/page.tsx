import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BannerEscudo } from "@/components/navegacao/banner-escudo";
import { FormEntrarComCodigo } from "./form-entrar-com-codigo";

export const metadata: Metadata = {
  title: "Entrar em uma Mesa | Calafrio RPG",
};

export default async function EntrarPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=%2Fentrar");

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 md:py-12 space-y-6">
      <BannerEscudo>
        <h1 className="text-2xl font-black font-heading uppercase tracking-wide text-white">
          Entrar em uma Mesa
        </h1>
        <p className="text-sm text-white/80 font-semibold mt-1">
          Digite o código de convite que o mestre te enviou.
        </p>
      </BannerEscudo>
      <FormEntrarComCodigo />
      <Link
        href="/mesa"
        className="inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" /> Voltar às Mesas
      </Link>
    </main>
  );
}
