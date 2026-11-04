import crypto from "node:crypto";
import {
  buscarUsuarioPorEmail,
  buscarUsuarioPorGoogleId,
  inserirUsuario,
  promoverAdmin,
  type UsuarioRow,
} from "@/db/queries/usuarios";
import { ehAmbienteDev } from "@/lib/auth/ambiente";

/**
 * Allowlist opcional de contas. Vazia (variável não definida) = cadastro
 * aberto: qualquer conta entra e é provisionada na hora. Defina
 * `EMAILS_PERMITIDOS` com e-mails separados por vírgula pra fechar.
 */
export function podeEntrar(email: string): boolean {
  const isDev = ehAmbienteDev();

  if (isDev) {
    return true;
  }

  if (
    process.env.ADMIN_EMAIL &&
    email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()
  ) {
    return true;
  }

  const permitidos = new Set(
    (process.env.EMAILS_PERMITIDOS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  );
  return permitidos.size === 0 || permitidos.has(email.toLowerCase());
}

export interface IdentidadeExterna {
  /** `sub` do Google, ou `dev:<email>` no dev-login. */
  idExterno: string;
  email: string;
  nome: string;
  avatarUrl?: string | null;
}

/**
 * Garante a conta de quem acabou de se identificar (web ou mobile).
 * `null` = conta recusada pela allowlist.
 */
export async function provisionarConta(
  identidade: IdentidadeExterna,
): Promise<UsuarioRow | null> {
  if (!podeEntrar(identidade.email)) return null;
  const ehAdmin = identidade.email === process.env.ADMIN_EMAIL;

  let existente = await buscarUsuarioPorGoogleId(identidade.idExterno);
  if (!existente) {
    existente = await buscarUsuarioPorEmail(identidade.email);
  }

  if (!existente) {
    try {
      const novoUsuario = await inserirUsuario({
        id: crypto.randomUUID(),
        googleId: identidade.idExterno,
        nome: identidade.nome,
        email: identidade.email.toLowerCase().trim(),
        avatarUrl: identidade.avatarUrl ?? null,
        role: ehAdmin ? "admin" : "user",
      });

      if (novoUsuario) return novoUsuario;
    } catch (err) {
      console.error("Erro ao inserir usuario no banco:", err);
    }

    // Fallback caso db esteja offline
    return {
      id: `fallback-${identidade.idExterno}`,
      googleId: identidade.idExterno,
      nome: identidade.nome,
      email: identidade.email,
      avatarUrl: identidade.avatarUrl ?? null,
      role: ehAdmin ? "admin" : "user",
      criadaEm: new Date(),
    };
  }

  if (ehAdmin && existente.role !== "admin") {
    await promoverAdmin(existente.id);
    return { ...existente, role: "admin" };
  }

  return existente;
}
