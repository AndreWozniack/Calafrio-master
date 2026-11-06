import { ArrowRight, Plus, Shield, Swords, Trash2, User } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BannerEscudo } from "@/components/navegacao/banner-escudo";
import { listarMesas } from "@/services/armazenamento-calafrio";
import { ehMestreDaMesa } from "@/services/convite-regras";
import { FormEntrarComCodigo } from "../entrar/form-entrar-com-codigo";
import { criarMesaAction, excluirMesaAction } from "./actions";
import { BotaoSairDaMesa } from "./botao-sair-da-mesa";

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
          <p className="text-sm text-white/80 font-semibold mt-1">
            Campanhas e mesas ativas no submundo paranormal de Curitiba.
          </p>
        </div>
      </BannerEscudo>

      {/* Formulário de Criação de Nova Mesa */}
      <form action={criarMesaAction} className="calafrio-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          <input
            type="text"
            name="nome"
            placeholder="Nome da nova mesa (ex: Mistérios do Batel)..."
            required
            className="flex-1 bg-muted/60 text-sm p-2.5 rounded-lg border border-border focus:border-amber-400 outline-none"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-sm uppercase tracking-wider rounded-lg cursor-pointer transition-colors shadow-sm"
          >
            <Plus className="size-4" /> Criar Mesa
          </button>
        </div>

        {/* Seletor de Edição */}
        <div className="pt-2 border-t border-border/40 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Sistema & Regras da Mesa
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-border bg-muted/30 hover:border-amber-400/50 cursor-pointer transition-colors has-[:checked]:border-amber-400 has-[:checked]:bg-amber-400/10">
              <input
                type="radio"
                name="sistemaVersao"
                value="2e"
                defaultChecked
                className="mt-0.5 accent-amber-400 cursor-pointer"
              />
              <div className="space-y-0.5">
                <div className="font-black text-foreground">
                  2ª Edição (Padrão)
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Matriz 3×3, Aptidão Base (APT) e polaridade de Domínio.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-border bg-muted/30 hover:border-amber-400/50 cursor-pointer transition-colors has-[:checked]:border-amber-400 has-[:checked]:bg-amber-400/10">
              <input
                type="radio"
                name="sistemaVersao"
                value="1e"
                className="mt-0.5 accent-amber-400 cursor-pointer"
              />
              <div className="space-y-0.5">
                <div className="font-black text-foreground">
                  1ª Edição Clássica
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Corpo, Mente, Alma, Pontos de Memória (PM) e Graus 0–III.
                </p>
              </div>
            </label>
          </div>
        </div>
      </form>

      <FormEntrarComCodigo />

      {/* Lista de Mesas (Cards estilo T20 Master) */}
      <div className="entrada-lista space-y-3">
        {mesas.map((mesa) => {
          const mestre = ehMestreDaMesa(mesa, userId);
          return (
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
                    {mestre ? (
                      <>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-extrabold uppercase bg-amber-400/15 text-amber-300 border border-amber-400/30">
                          <Shield className="size-3" /> Mestre
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">
                          Código:{" "}
                          <strong className="text-foreground">
                            {mesa.codigoConvite}
                          </strong>
                        </span>
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-extrabold uppercase bg-sky-400/15 text-sky-300 border border-sky-400/30">
                        <User className="size-3" /> Jogador
                      </span>
                    )}
                  </div>
                </Link>

                <div className="flex items-center gap-2">
                  {mestre ? (
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
                  ) : (
                    <BotaoSairDaMesa mesaId={mesa.id} />
                  )}

                  <Link
                    href={`/mesa/${mesa.id}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-sm rounded-lg cursor-pointer shadow-sm transition-colors"
                  >
                    <span>Entrar</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {mesas.length === 0 && (
          <div className="py-12 text-center border-2 border-dashed border-border rounded-xl bg-card/30 space-y-2">
            <Swords className="size-8 mx-auto text-muted-foreground/60" />
            <p className="text-base font-bold text-foreground">
              Nenhuma mesa encontrada.
            </p>
            <p className="text-sm text-muted-foreground">
              Crie uma mesa no campo acima para começar a mestrar Calafrio.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
