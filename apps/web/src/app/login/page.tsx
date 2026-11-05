import { headers } from "next/headers";
import Image from "next/image";
import { signIn } from "@/auth";
import { ehAmbienteDev } from "@/lib/auth/ambiente";

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

  const headerList = await headers();
  const host = headerList.get("host") || headerList.get("x-forwarded-host");
  const isDev = ehAmbienteDev(host);

  return (
    <div
      data-pagina-login
      className="w-full flex-1 flex flex-col items-center justify-center min-h-[calc(100dvh-3rem)] sm:min-h-[calc(100dvh-5rem)] p-4 sm:p-8"
    >
      <div className="w-full max-w-[440px] sm:max-w-[480px] border-2 border-black bg-white p-6 sm:p-10 shadow-[6px_6px_0px_#000] text-black space-y-6 sm:space-y-7 my-auto">
        {/* Topo / Logo */}
        <div className="text-center space-y-3">
          <div className="flex justify-center pt-1 px-2">
            <Image
              src="/assets/Calafrio.svg"
              alt="Calafrio RPG"
              width={549}
              height={99}
              priority
              className="w-full max-w-[240px] sm:max-w-[320px] h-auto object-contain aspect-[549/99]"
            />
          </div>

          <div className="space-y-1.5">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-neutral-800 bg-neutral-100 border border-neutral-400 px-2.5 py-1">
              2ª Edição • TTRPG
            </span>
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider font-heading text-neutral-950 pt-1">
              Investigação Paranormal
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 font-serif leading-relaxed px-2">
              Entre com sua conta Google para gerenciar suas mesas e fichas de
              investigação.
            </p>
          </div>
        </div>

        {/* Alerta de Erro se houver */}
        {error && (
          <div className="p-3 bg-red-50 border-2 border-red-300 text-red-900 text-xs font-medium space-y-1">
            <p className="font-bold flex items-center gap-1">
              ⚠️ Falha no login:
            </p>
            {error === "Configuration" ? (
              <div className="text-[11px] leading-relaxed space-y-1">
                <p>
                  Erro de configuração de autenticação (
                  <strong>Configuration</strong>). Possíveis causas:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-neutral-800">
                  <li>
                    Variáveis <code>AUTH_SECRET</code>,{" "}
                    <code>AUTH_GOOGLE_ID</code> ou{" "}
                    <code>AUTH_GOOGLE_SECRET</code> não preenchidas no
                    Dokploy/VPS.
                  </li>
                  <li>
                    Falta da URI de redirecionamento no Google Cloud Console:
                    adicione{" "}
                    <code>https://seu-dominio/api/auth/callback/google</code> (e{" "}
                    <code>http://localhost:3001/api/auth/callback/google</code>{" "}
                    para local).
                  </li>
                </ul>
              </div>
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
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 sm:py-4 bg-black text-white hover:bg-neutral-800 font-bold text-sm sm:text-base tracking-wide border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5 sm:size-6 shrink-0"
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

        {/* Login de Desenvolvimento (Exibido EXCLUSIVAMENTE em ambiente local de dev) */}
        {isDev && (
          <div className="space-y-3 pt-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-white px-2.5 text-neutral-400">
                  Ou Simular Investigador
                </span>
              </div>
            </div>

            <form
              className="space-y-2.5"
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
                className="w-full bg-neutral-50 border-2 border-neutral-300 focus:border-black px-3.5 py-2.5 text-xs sm:text-sm font-semibold outline-none transition-colors"
              />
              <input
                name="email"
                type="email"
                placeholder="email@dev.local"
                defaultValue="investigador@calafrio.local"
                required
                className="w-full bg-neutral-50 border-2 border-neutral-300 focus:border-black px-3.5 py-2.5 text-xs sm:text-sm font-semibold outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border-2 border-black font-black text-xs uppercase tracking-wider transition-colors cursor-pointer active:bg-neutral-300 shadow-[2px_2px_0px_#000]"
              >
                Entrar com Conta Dev
              </button>
            </form>
          </div>
        )}

        {/* Rodapé do Card */}
        <div className="pt-2 border-t border-neutral-200 text-center">
          <p className="text-[11px] text-neutral-400 font-mono">
            Calafrio 2ª Edição • RPG Investigativo
          </p>
        </div>
      </div>
    </div>
  );
}
