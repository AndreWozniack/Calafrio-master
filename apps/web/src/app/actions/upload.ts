"use server";

import { uploadImagemR2 } from "@/lib/storage/r2";

export async function uploadRetratoAction(
  formData: FormData,
): Promise<{ url: string | null; erro?: string }> {
  const arquivo = formData.get("arquivo") as File | null;
  if (!arquivo) {
    return { url: null, erro: "Nenhum arquivo enviado" };
  }

  // Validação básica de tipo de imagem
  if (!arquivo.type.startsWith("image/")) {
    return { url: null, erro: "O arquivo precisa ser uma imagem válida" };
  }

  // Limite de 5MB
  if (arquivo.size > 5 * 1024 * 1024) {
    return { url: null, erro: "A imagem não pode exceder 5MB" };
  }

  try {
    const arrayBuffer = await arquivo.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const url = await uploadImagemR2({
      buffer,
      nomeArquivoOriginal: arquivo.name,
      mimeType: arquivo.type,
      pasta: "retratos",
    });

    if (!url) {
      return {
        url: null,
        erro: "R2 não configurado no servidor. Defina as variáveis R2_* no .env",
      };
    }

    return { url };
  } catch (err) {
    console.error("Erro no upload para R2:", err);
    return { url: null, erro: "Falha ao enviar imagem para o R2" };
  }
}
