const PADRAO_ROTA_FICHA = /^\/mesa\/[^/]+\/players\/[^/]+\/ficha/;

/** Na ficha viva o cabeçalho global some para liberar a tela. */
export const estaNaFicha = (pathname: string) =>
  PADRAO_ROTA_FICHA.test(pathname);
