/**
 * Determina com rigor se o sistema está em ambiente de desenvolvimento local.
 * Em produção (calafrio.wozniack.com ou qualquer domínio público real),
 * o login dev sem senha é terminantemente bloqueado.
 */
export function ehAmbienteDev(host?: string | null): boolean {
  // 1. Se o host da requisição for um domínio público / produção
  if (host) {
    const h = host.toLowerCase();
    if (
      h.includes("wozniack.com") ||
      (h.includes("calafrio.") && !h.includes("localhost")) ||
      (!h.includes("localhost") &&
        !h.includes("127.0.0.1") &&
        !h.includes("192.168.") &&
        !h.includes("10.") &&
        !h.includes(":3001"))
    ) {
      return false;
    }
  }

  // 2. Se NODE_ENV é estritamente production
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  // 3. Se ALLOW_DEV_LOGIN está desabilitado
  if (process.env.ALLOW_DEV_LOGIN === "false") {
    return false;
  }

  // 4. Se a variável DOMAIN aponta para domínio público de produção
  const domain = (process.env.DOMAIN ?? "").toLowerCase();
  if (
    domain.includes("wozniack.com") ||
    (domain.includes(".") && !domain.includes("localhost"))
  ) {
    return false;
  }

  // 5. Se AUTH_URL ou NEXTAUTH_URL apontam para produção
  const authUrl = (
    process.env.AUTH_URL ??
    process.env.NEXTAUTH_URL ??
    ""
  ).toLowerCase();
  if (
    authUrl.includes("wozniack.com") ||
    (authUrl.startsWith("https://") && !authUrl.includes("localhost"))
  ) {
    return false;
  }

  // Só permite dev se for local e NODE_ENV=development ou ALLOW_DEV_LOGIN=true
  return (
    process.env.NODE_ENV === "development" ||
    process.env.ALLOW_DEV_LOGIN === "true"
  );
}
