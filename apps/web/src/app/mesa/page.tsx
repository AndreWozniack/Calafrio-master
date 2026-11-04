import { ArrowRight, Plus, Shield, Swords, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BannerEscudo } from "@/components/navegacao/banner-escudo";
import { listarMesas } from "@/services/armazenamento-calafrio";
import { criarMesaAction, excluirMesaAction } from "./actions";

export const metadata: Metadata = {
  title: "Suas Mesas | Calafrio RPG",
  description:
    "Gerencie suas campanhas e mesas de investigação paranormal em Calafrio.",
};

export default async function MesaPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as { id?: string }).id;
  const mesas = await listarMesas(userId);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 md:py-12 space-y-6">
      {/* Header do Hub de Mesas (Estilo T20 Master) */}
      <BannerEscudo>
        <div>
          <h1 className="text-2xl font-black font-heading uppercase tracking-wide text-white flex items-center gap-2">
            <Swords className="size-6 text-amber-400" /> Suas Mesas
          </h1>
          <p className="text-xs text-white/70 font-semibold mt-1">
            Campanhas e mesas ativas no submundo paranormal de Curitiba.
          </p>
        </div>
      </BannerEscudo>

      {/* Formulário de Criação de Nova Mesa */}
      <form
        action={criarMesaAction}
        className="calafrio-card p-4 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center"
      >
        <input
          type="text"
          name="nome"
          placeholder="Nome da nova mesa (ex: Mistérios do Batel)..."
          required
          className="flex-1 bg-muted/60 text-xs p-2.5 rounded-lg border border-border focus:border-amber-400 outline-none"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider rounded-lg cursor-pointer transition-colors shadow-sm"
        >
          <Plus className="size-4" /> Criar Mesa
        </button>
      </form>

      {/* Lista de Mesas (Cards estilo T20 Master) */}
      <div className="entrada-lista space-y-3">
        {mesas.map((mesa) => (
          <div
            key={mesa.id}
            className="calafrio-card p-0 hover:border-amber-400/30 transition-all overflow-hidden flex flex-col justify-between"
          >
            <div className="p-4 flex items-center justify-between gap-3">
              <Link
                href={`/mesa/${mesa.id}`}
                className="flex-1 min-w-0 group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-black text-base text-foreground group-hover:text-amber-300 transition-colors">
                    {mesa.nome}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-400/15 text-amber-300 border border-amber-400/30">
                    <Shield className="size-3" /> Mestre
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Código:{" "}
                    <strong className="text-foreground">
                      {mesa.codigoConvite}
                    </strong>
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <form
                  action={async () => {
                    "use server";
                    await excluirMesaAction(mesa.id);
                  }}
                >
                  <button
                    type="submit"
                    className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-950/30 rounded-lg cursor-pointer transition-colors"
                    title="Excluir Mesa"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </form>

                <Link
                  href={`/mesa/${mesa.id}`}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs rounded-lg cursor-pointer shadow-sm transition-colors"
                >
                  <span>Entrar</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {mesas.length === 0 && (
          <div className="py-12 text-center border-2 border-dashed border-border rounded-xl bg-card/30 space-y-2">
            <Swords className="size-8 mx-auto text-muted-foreground/60" />
            <p className="text-sm font-bold text-foreground">
              Nenhuma mesa encontrada.
            </p>
            <p className="text-xs text-muted-foreground">
              Crie uma mesa no campo acima para começar a mestrar Calafrio.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
