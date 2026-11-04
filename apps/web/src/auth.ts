import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { buscarUsuarioPorGoogleId } from "@/db/queries/usuarios";
import { provisionarConta } from "@/services/conta-service";

/**
 * Login sem senha, só no ambiente de desenvolvimento.
 */
const isDev =
  process.env.NODE_ENV !== "production" ||
  process.env.ALLOW_DEV_LOGIN === "true";

const googleClientId =
  process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID;
const googleClientSecret =
  process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET;
const authSecret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  (isDev ? "calafrio-dev-secret-jwt-key-super-secure-token-2026" : undefined);

if (!authSecret && !isDev) {
  console.error(
    "⚠️ [AUTH CONFIG] AUTH_SECRET ausente em produção! Configure AUTH_SECRET nas variáveis de ambiente da VPS/Dokploy.",
  );
}
if ((!googleClientId || !googleClientSecret) && !isDev) {
  console.error(
    "⚠️ [AUTH CONFIG] Credenciais do Google ausentes! Configure AUTH_GOOGLE_ID e AUTH_GOOGLE_SECRET nas variáveis de ambiente.",
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: authSecret,
  providers: [
    ...(googleClientId && googleClientSecret
      ? [
          Google({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          }),
        ]
      : [
          Google({
            clientId: googleClientId ?? "missing-google-client-id",
            clientSecret: googleClientSecret ?? "missing-google-client-secret",
          }),
        ]),
    ...(isDev
      ? [
          Credentials({
            id: "dev-login",
            name: "Investigador de Teste",
            credentials: {
              nome: { label: "Nome", type: "text" },
              email: { label: "Email", type: "text" },
            },
            async authorize(credentials) {
              const email = String(credentials?.email ?? "")
                .trim()
                .toLowerCase();
              const nome = String(credentials?.nome ?? "").trim();
              if (!email || !nome) return null;
              return { id: `dev:${email}`, name: nome, email };
            },
          }),
        ]
      : []),
  ],
  session: { strategy: "jwt" },
  logger: {
    error(error) {
      console.error("🔴 [AUTH ERROR]:", error);
    },
    warn(code) {
      console.warn("🟡 [AUTH WARN]:", code);
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    async signIn({ user, account }) {
      const idExterno = account?.providerAccountId || user?.id;
      if (!idExterno || !user?.email) return false;
      const conta = await provisionarConta({
        idExterno,
        email: user.email,
        nome: user.name ?? user.email,
        avatarUrl: user.image,
      });
      return conta !== null;
    },
    async jwt({ token, account, user }) {
      const idExterno =
        account?.providerAccountId || (user as { id?: string } | undefined)?.id;
      if (idExterno) {
        const dbUser = await buscarUsuarioPorGoogleId(idExterno);
        if (dbUser) {
          token.userId = dbUser.id;
          token.role = dbUser.role;
        } else {
          token.userId = idExterno;
          token.role = "user";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId && session.user) {
        (
          session.user as typeof session.user & { id: string; role: string }
        ).id = token.userId as string;
        (
          session.user as typeof session.user & { id: string; role: string }
        ).role = (token.role as string) ?? "user";
      }
      return session;
    },
  },
});
