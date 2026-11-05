/**
 * Remove caracteres incompatíveis com a tabela WinAnsi (padrão Helvetica do PDF)
 * como emojis ou símbolos fora da faixa Windows-1252, preservando acentos em português.
 */
export function sanitizarTextoWinAnsi(texto: string): string {
  return texto.replace(
    // biome-ignore lint/suspicious/noControlCharactersInRegex: faixa WinAnsi exige tab/LF/CR explícitos
    /[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF\u2013\u2014\u2018\u2019\u201C\u201D\u2022\u2026\u20AC]/g,
    "",
  );
}
