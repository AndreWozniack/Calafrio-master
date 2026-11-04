import Image from "next/image";
import { signIn } from "@/auth";

function extrairDestino(callbackUrl?: string): string {
  if (!callbackUrl) return "/mesa";
  try {
    const url = new URL(callbackUrl, "http://localhost");
    if (url.pathname.includes("mesa-curitiba-1")) return "/mesa";
    return url.pathname + url.search;
  } catch {
    return "/mesa";
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;
  const destino = extrairDestino(callbackUrl);
  const isDev =
    process.env.NODE_ENV !== "production" ||
    process.env.ALLOW_DEV_LOGIN === "true";

  return (
    <div
      data-pagina-login
      className="w-full flex-1 flex flex-col items-center justify-start sm:justify-center py-2 sm:py-6 px-1"
    >
      <div className="w-full max-w-sm border border-black bg-white p-4 sm:p-7 shadow-[3px_3px_0px_#000] text-black space-y-4 sm:space-y-5">
        {/* Topo / Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center pt-1 px-4">
            <Image
              src="/assets/Calafrio.svg"
              alt="Calafrio RPG"
              width={549}
              height={99}
              priority
              className="w-full max-w-[190px] sm:max-w-[240px] h-auto object-contain aspect-[549/99]"
            />
          </div>

          <div className="space-y-1">
            <span className="inline-block text-[9px] font-black uppercase tracking-widest text-neutral-700 bg-neutral-100 border border-neutral-300 px-2 py-0.5">
              2ª Edição • TTRPG
            </span>
            <h1 className="text-sm sm:text-base font-black uppercase tracking-wider font-heading text-neutral-950 pt-0.5">
              Investigação Paranormal
            </h1>
            <p className="text-[11px] sm:text-xs text-neutral-600 font-serif leading-relaxed px-1">
              Entre com sua conta Google para gerenciar suas mesas e fichas.
            </p>
          </div>
        </div>

        {/* Alerta de Erro se houver */}
        {error && (
          <div className="p-2.5 bg-red-50 border border-red-300 text-red-900 text-xs font-medium space-y-1">
            <p className="font-bold flex items-center gap-1">⚠️ Falha no login:</p>
            {error === "Configuration" ? (
              <p className="text-[11px] leading-relaxed">
                Para autenticar com o Google localmente, use o endereço{" "}
                <strong className="underline">http://localhost:3001</strong>. O Google proíbe URLs de redirecionamento com <code className="bg-red-100 px-1 font-mono">0.0.0.0</code>.
              </p>
            ) : error === "AccessDenied" ? (
              <p className="text-[11px]">
                Acesso negado. Sua conta não consta na allowlist de e-mails.
              </p>
            ) : (
              <p className="text-[11px] font-mono">{error}</p>
            )}
          </div>
        )}

        {/* Botão Oficial de Login com Google */}
        <form
          action={async (formData: FormData) => {
            "use server";
            const redirectTo =
              (formData.get("redirectTo") as string) || "/mesa";
            await signIn("google", { redirectTo });
          }}
        >
          <input type="hidden" name="redirectTo" value={destino} />
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 sm:py-3 bg-black text-white hover:bg-neutral-800 font-bold text-xs sm:text-sm tracking-wide border border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4 sm:size-5 shrink-0"
              aria-hidden="true"
            >
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.5 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.5-6.4-5.2L1.9 17C3.7 20.7 7.4 24 12 24z"
              />
            </svg>
            <span>Entrar com Google</span>
          </button>
        </form>

        {/* Login de Desenvolvimento (Dev Only) */}
        {isDev && (
          <div className="space-y-2.5 pt-1">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-white px-2 text-neutral-400">
                  Ou Simular Investigador
                </span>
              </div>
            </div>

            <form
              className="space-y-2"
              action={async (formData: FormData) => {
                "use server";
                const nome = formData.get("nome") as string;
                const email = formData.get("email") as string;
                const redirectTo =
                  (formData.get("redirectTo") as string) || "/mesa";
                await signIn("dev-login", { nome, email, redirectTo });
              }}
            >
              <input type="hidden" name="redirectTo" value={destino} />
              <input
                name="nome"
                placeholder="Nome do Investigador"
                defaultValue="Investigador Dev"
                required
                className="w-full bg-neutral-50 border border-neutral-300 focus:border-black px-3 py-2 text-xs font-semibold outline-none transition-colors"
              />
              <input
                name="email"
                type="email"
                placeholder="email@dev.local"
                defaultValue="investigador@calafrio.local"
                required
                className="w-full bg-neutral-50 border border-neutral-300 focus:border-black px-3 py-2 text-xs font-semibold outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-black font-black text-xs uppercase tracking-wider transition-colors cursor-pointer active:bg-neutral-300"
              >
                Entrar com Conta Dev
              </button>
            </form>
          </div>
        )}

        <div className="text-center text-[10px] text-neutral-400 pt-1.5 border-t border-neutral-100 font-mono">
          Calafrio 2ª Edição • RPG Investigativo
        </div>
      </div>
    </div>
  );
}
