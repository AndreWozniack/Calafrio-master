/**
 * Utilitários para formatação segura de nome de arquivo e disparo de download de PDF no navegador.
 */

export function formatarNomeArquivoPdf(nome?: string): string {
  if (!nome || !nome.trim()) {
    return "Ficha_Investigador_Calafrio2e.pdf";
  }

  // Remove caracteres especiais perigosos para nomes de arquivos mantendo letras acentuadas e números
  const limpo = nome
    .trim()
    .replace(/[/'"&?#*:<>[\]\\|=+]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  if (!limpo) {
    return "Ficha_Investigador_Calafrio2e.pdf";
  }

  return `Ficha_${limpo}_Calafrio2e.pdf`;
}

/**
 * Cria um link temporário invisível e dispara o download do arquivo PDF na máquina do usuário.
 */
export function baixarArquivoPdfNoNavegador(
  buffer: Uint8Array,
  nomeArquivo: string,
): void {
  if (typeof window === "undefined") return;

  const blob = new Blob([buffer as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = nomeArquivo;
  link.style.display = "none";
  document.body.appendChild(link);

  link.click();

  // Limpeza de recursos
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}
