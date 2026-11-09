import fs from "node:fs";
import path from "node:path";
import { carregarCatalogoCalafrio } from "../packages/core/catalogo/index";
import { HABILIDADES_1E } from "../packages/core/v1/catalogo/index";

const dest2e = "/Users/andrewozniack/Documents/Arcanum-Master/data/sistemas/calafrio/2e";
const dest1e = "/Users/andrewozniack/Documents/Arcanum-Master/data/sistemas/calafrio/1e";

fs.mkdirSync(dest2e, { recursive: true });
fs.mkdirSync(dest1e, { recursive: true });

console.log("Iniciando exportação de dados estruturados do Calafrio...");

// 1. Catálogo 2e
const catalogo2e = carregarCatalogoCalafrio();

fs.writeFileSync(
  path.join(dest2e, "habilidades_paranormais.json"),
  JSON.stringify(catalogo2e.habilidadesParanormais, null, 2)
);
console.log(`✓ Exportadas ${catalogo2e.habilidadesParanormais.length} Habilidades Paranormais (2e)`);

fs.writeFileSync(
  path.join(dest2e, "palavras_chave.json"),
  JSON.stringify(catalogo2e.palavrasChaveGenericas, null, 2)
);
console.log(`✓ Exportadas ${catalogo2e.palavrasChaveGenericas.length} Palavras-Chave Genéricas (2e)`);

fs.writeFileSync(
  path.join(dest2e, "ocupacoes.json"),
  JSON.stringify(catalogo2e.ocupacoes, null, 2)
);
console.log(`✓ Exportadas ${catalogo2e.ocupacoes.length} Ocupações (2e)`);

fs.writeFileSync(
  path.join(dest2e, "bugigangas.json"),
  JSON.stringify(catalogo2e.bugigangas, null, 2)
);
console.log(`✓ Exportadas ${catalogo2e.bugigangas.length} Bugigangas (2e)`);

fs.writeFileSync(
  path.join(dest2e, "armas_mundanas.json"),
  JSON.stringify(catalogo2e.armasMundanas, null, 2)
);
console.log(`✓ Exportadas ${catalogo2e.armasMundanas.length} Categorias de Armas Mundanas (2e)`);

fs.writeFileSync(
  path.join(dest2e, "tabelas_suporte.json"),
  JSON.stringify({
    familiares: catalogo2e.familiares,
    lacaios: catalogo2e.lacaios,
    djanhos: catalogo2e.djanhos,
  }, null, 2)
);
console.log(`✓ Exportadas Tabelas de Suporte (Familiares, Lacaios, Djanhos) (2e)`);

fs.writeFileSync(
  path.join(dest2e, "glossario.json"),
  JSON.stringify(catalogo2e.glossario, null, 2)
);
console.log(`✓ Exportado Glossário de Termos (2e)`);

// 2. Catálogo 1e
fs.writeFileSync(
  path.join(dest1e, "habilidades_1e.json"),
  JSON.stringify(HABILIDADES_1E, null, 2)
);
console.log(`✓ Exportadas ${HABILIDADES_1E.length} Habilidades de Graus 0 a 3 (1e)`);

console.log("\nExportação do Calafrio concluída com sucesso!");
