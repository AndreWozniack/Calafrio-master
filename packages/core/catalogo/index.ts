import { BUGIGANGAS_CATALOGO } from "./bugigangas";
import { ARMAS_MUNDANAS_CATALOGO } from "./equipamentos";
import { GLOSSARIO_CALAFRIO } from "./glossario";
import { HABILIDADES_PARANORMAIS_CATALOGO } from "./habilidades-paranormais";
import { OCUPACOES_CATALOGO } from "./ocupacoes";
import { PALAVRAS_CHAVE_GENERICAS_CATALOGO } from "./palavras-chave";
import {
  TABELA_DJANHOS,
  TABELA_FAMILIARES,
  TABELA_LACAIOS,
} from "./tabelas-suporte";
import type { CatalogoCalafrio } from "./tipos";

const CATALOGO_CONGELADO: CatalogoCalafrio = Object.freeze({
  habilidadesParanormais: HABILIDADES_PARANORMAIS_CATALOGO,
  palavrasChaveGenericas: PALAVRAS_CHAVE_GENERICAS_CATALOGO,
  ocupacoes: OCUPACOES_CATALOGO,
  bugigangas: BUGIGANGAS_CATALOGO,
  armasMundanas: ARMAS_MUNDANAS_CATALOGO,
  familiares: TABELA_FAMILIARES,
  lacaios: TABELA_LACAIOS,
  djanhos: TABELA_DJANHOS,
  glossario: GLOSSARIO_CALAFRIO,
});

export function carregarCatalogoCalafrio(): CatalogoCalafrio {
  return CATALOGO_CONGELADO;
}

export * from "./bugigangas";
export * from "./equipamentos";
export * from "./glossario";
export * from "./habilidades-paranormais";
export * from "./ocupacoes";
export * from "./palavras-chave";
export * from "./tabelas-suporte";
export * from "./tipos";
