import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const LIMITE_LINHAS = 400;

const EXTENSOES_ALVO = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".css",
]);

const PASTAS_IGNORADAS = new Set([
  "node_modules",
  ".next",
  "dist",
  ".expo",
  "public",
  ".git",
  ".turbo",
  "coverage",
]);

// Catálogos e tabelas estáticas de dados do RPG (isentas de corte de linha)
const CAMINHOS_ISENTOS = [
  "packages/core/catalogo/",
  "packages/core/src/catalogo/",
  "packages/core/dados/",
  "packages/core/src/dados/",
];

function ehCaminhoIsento(relPath) {
  const normalizado = relPath.replace(/\\/g, "/");
  return CAMINHOS_ISENTOS.some((isento) => normalizado.includes(isento));
}

async function coletarArquivos(dir, baseDir = dir) {
  const resultados = [];
  const entradas = await readdir(dir, { withFileTypes: true });

  for (const entrada of entradas) {
    const caminhoCompleto = join(dir, entrada.name);
    const caminhoRelativo = relative(baseDir, caminhoCompleto);

    if (entrada.isDirectory()) {
      if (PASTAS_IGNORADAS.has(entrada.name)) {
        continue;
      }
      resultados.push(...(await coletarArquivos(caminhoCompleto, baseDir)));
    } else if (entrada.isFile()) {
      const ext = extname(entrada.name);
      if (EXTENSOES_ALVO.has(ext)) {
        resultados.push(caminhoCompleto);
      }
    }
  }

  return resultados;
}

async function contarLinhas(caminhoArquivo) {
  const conteudo = await readFile(caminhoArquivo, "utf8");
  if (!conteudo) return 0;
  // Conta a quantidade de quebras de linha
  return conteudo.split("\n").length;
}

async function principal() {
  const pastasRaiz = ["apps", "packages"];
  const todosArquivos = [];

  for (const pasta of pastasRaiz) {
    try {
      const info = await stat(pasta);
      if (info.isDirectory()) {
        const arquivos = await coletarArquivos(pasta, process.cwd());
        todosArquivos.push(...arquivos);
      }
    } catch {
      // Pasta não existe, ignora
    }
  }

  const violacoes = [];
  let totalVerificados = 0;

  for (const arquivo of todosArquivos) {
    const rel = relative(process.cwd(), arquivo).replace(/\\/g, "/");
    if (ehCaminhoIsento(rel)) {
      continue;
    }

    totalVerificados += 1;
    const totalLinhas = await contarLinhas(arquivo);

    if (totalLinhas > LIMITE_LINHAS) {
      violacoes.push({
        arquivo: rel,
        linhas: totalLinhas,
      });
    }
  }

  console.log(`\n🔍 Verificação de Limite de Linhas (máx: ${LIMITE_LINHAS} linhas)`);
  console.log(`   Arquivos de código verificados: ${totalVerificados}`);

  if (violacoes.length > 0) {
    console.error(`\n❌ Encontradas ${violacoes.length} violações do limite de ${LIMITE_LINHAS} linhas:\n`);
    for (const v of violacoes) {
      console.error(`   - ${v.arquivo}: ${v.linhas} linhas (+${v.linhas - LIMITE_LINHAS})`);
    }
    console.error(
      "\n💡 Regra arquitetural: divida esses arquivos em submódulos coesos e reutilizáveis.\n",
    );
    process.exit(1);
  }

  console.log(`✅ Todos os ${totalVerificados} arquivos respeitam o teto de ${LIMITE_LINHAS} linhas!\n`);
}

principal().catch((erro) => {
  console.error("Erro ao verificar limite de linhas:", erro);
  process.exit(1);
});
