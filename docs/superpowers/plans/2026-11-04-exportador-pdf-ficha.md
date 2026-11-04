# Exportador de Ficha para PDF Editável Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar o gerador e exportador de PDF interativo e 100% editável (AcroForm) para a ficha do Calafrio 2e, preenchido automaticamente com os dados do investigador a partir do template oficial de 2 páginas.

**Architecture:** Carregamento do template oficial `2e-V1_FichaPersonagem_Calafrio.pdf` utilizando a biblioteca `pdf-lib`. Um módulo determinístico de coordenadas converte o canvas de referência A4 (`662x936`) para pontos PDF (`595.28 x 841.89`). O motor de exportação injeta campos interativos `AcroForm` (`createTextField`), preenchendo-os com os dados de `FichaCalafrio` e `FichaDerivadaCalafrio`. O botão "Exportar PDF" na interface web dispara a geração e download imediato do arquivo no navegador.

**Tech Stack:** TypeScript, Next.js, `pdf-lib`, React 19, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-04-exportador-pdf-ficha-design.md`

## Global Constraints

- O PDF gerado DEVE ser 100% editável via formulários AcroForm padrão em qualquer leitor de PDF (Adobe Acrobat, navegadores, Preview do Mac).
- DEVE utilizar como base o arquivo oficial `apps/web/public/assets/calafrio/2e-V1_FichaPersonagem_Calafrio.pdf`, mantendo exatamente 2 páginas.
- Os campos DEVEM vir pré-preenchidos com os dados da ficha do jogador no momento da exportação.
- Nenhum serviço externo pago ou dependência binária pesada (como Puppeteer/Chromium) pode ser introduzido.
- O nome do arquivo gerado para download deve seguir o formato `Ficha_<NomeOuInvestigador>_Calafrio2e.pdf`.

## Review Focus

1. **Campos numéricos vazios ou zero:** Valores como 0 em PV, PA ou Carteira devem ser renderizados como `"0"` e não campos em branco.
2. **Nomes longos e overflow de texto:** Habilidades, itens e anotações com textos extensos devem usar campos multilinhas (`multiline: true`) para permitir quebra de linha sem cortar conteúdo.
3. **Caracteres especiais e acentuação:** Nomes com acentos da língua portuguesa (Ex: "Investigação", "Ódio", "Espíritos") devem ser preservados sem corrupção de encoding no PDF.
4. **Ficha sem retrato ou com URL inválida:** Se `ficha.retratoUrl` for indefinido, nulo ou inválido, a exportação não deve quebrar nem travar; a caixa de retrato deve permanecer limpa.
5. **Slots da matriz vazios:** Slots de 0 a 8 que não possuem habilidade alocada devem gerar campos de texto editáveis em branco, permitindo que o jogador digite manualmente no PDF.

---

### Task 1: Instalação de Dependências (`pdf-lib`) e Setup de Testes em `apps/web`

**Files:**
- Modify: `apps/web/package.json`
- Test: `apps/web/package.json`

**Interfaces:**
- Produces: `pdf-lib` disponível para importação em `apps/web/src/*`; script `pnpm --filter @calafrio/web test` funcional executando Vitest.

- [ ] **Step 1: Adicionar dependências e script de teste em `apps/web/package.json`**
  Adicionar `"pdf-lib": "^1.17.9"` em `dependencies`, `"vitest": "^3.2.7"` em `devDependencies`, e `"test": "vitest run"` em `scripts`.

- [ ] **Step 2: Executar instalação com pnpm**
  Run: `pnpm install`
  Expected: Dependências instaladas sem conflitos.

- [ ] **Step 3: Verificar execução do teste existente no workspace**
  Run: `pnpm --filter @calafrio/web test`
  Expected: PASS para os testes existentes de `apps/web`.

- [ ] **Step 4: Commit**
  ```bash
  git add apps/web/package.json pnpm-lock.yaml
  git commit -m "chore(web): add pdf-lib dependency and vitest test script"
  ```

---

### Task 2: Módulo de Coordenadas e Mapeamento A4 (`coordenadas-ficha-pdf.ts`)

**Files:**
- Create: `apps/web/src/services/pdf/coordenadas-ficha-pdf.ts`
- Test: `apps/web/src/services/pdf/__tests__/coordenadas-ficha-pdf.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface CoordenadaRetanguloPdf {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  export function canvasParaPdf(x: number, y: number, w: number, h: number): CoordenadaRetanguloPdf;
  export const COORDENADAS_FICHA_PAGINA_1: Record<string, CoordenadaRetanguloPdf | CoordenadaRetanguloPdf[]>;
  export const COORDENADAS_FICHA_PAGINA_2: Record<string, CoordenadaRetanguloPdf | CoordenadaRetanguloPdf[]>;
  ```

- [ ] **Step 1: Escrever teste de coordenadas que falha**
  Criar `apps/web/src/services/pdf/__tests__/coordenadas-ficha-pdf.test.ts` testando:
  - Conversão de `(0, 0, 662, 936)` para `(0, 0, 595.28, 841.89)`.
  - Inversão correta do eixo Y (origem inferior esquerda no PDF vs superior esquerda no HTML).
  - Presença das coordenadas para Nome, APT, PV Atual/Max, PA Atual/Max, PD, Ecos, Palavras-chave (9 linhas), Inventário, Carteira e 9 Slots da Matriz.

- [ ] **Step 2: Executar teste para verificar falha**
  Run: `pnpm --filter @calafrio/web dlx vitest run apps/web/src/services/pdf/__tests__/coordenadas-ficha-pdf.test.ts`
  Expected: FAIL com módulo não encontrado.

- [ ] **Step 3: Implementar `coordenadas-ficha-pdf.ts`**
  Implementar a fórmula de escala e o mapeamento dos retângulos oficiais da frente e verso:
  ```ts
  const ESCALA_X = 595.276 / 662;
  const ESCALA_Y = 841.89 / 936;
  export function canvasParaPdf(x: number, y: number, w: number, h: number): CoordenadaRetanguloPdf {
    return {
      x: Number((x * ESCALA_X).toFixed(2)),
      y: Number((841.89 - (y + h) * ESCALA_Y).toFixed(2)),
      width: Number((w * ESCALA_X).toFixed(2)),
      height: Number((h * ESCALA_Y).toFixed(2)),
    };
  }
  ```
  Mapear posições calibradas com base nos primitivos de `pagina-frente-ficha.tsx` e `pagina-verso-matriz.tsx`.

- [ ] **Step 4: Executar teste para verificar sucesso**
  Run: `pnpm --filter @calafrio/web dlx vitest run apps/web/src/services/pdf/__tests__/coordenadas-ficha-pdf.test.ts`
  Expected: PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add apps/web/src/services/pdf/coordenadas-ficha-pdf.ts apps/web/src/services/pdf/__tests__/coordenadas-ficha-pdf.test.ts
  git commit -m "feat(web): add A4 coordinate mapping module for character sheet PDF"
  ```

---

### Task 3: Motor de Geração e Preenchimento do PDF Editável (`exportador-pdf-ficha.ts`)

**Files:**
- Create: `apps/web/src/services/pdf/exportador-pdf-ficha.ts`
- Test: `apps/web/src/services/pdf/__tests__/exportador-pdf-ficha.test.ts`

**Interfaces:**
- Consumes: `FichaCalafrio`, `FichaDerivadaCalafrio`, `CatalogoCalafrio` de `@calafrio/core`, `canvasParaPdf` e constantes de Task 2.
- Produces:
  ```ts
  export interface OpcoesExportacaoPdf {
    bufferTemplate?: ArrayBuffer | Uint8Array;
  }
  export async function gerarPdfFichaEditavel(
    ficha: FichaCalafrio,
    derivada: FichaDerivadaCalafrio,
    catalogo?: CatalogoCalafrio,
    opcoes?: OpcoesExportacaoPdf
  ): Promise<Uint8Array>;
  ```

- [ ] **Step 1: Escrever teste de exportação do PDF que falha**
  Criar `apps/web/src/services/pdf/__tests__/exportador-pdf-ficha.test.ts`:
  - Carrega o arquivo `apps/web/public/assets/calafrio/2e-V1_FichaPersonagem_Calafrio.pdf`.
  - Executa `gerarPdfFichaEditavel` com uma ficha de teste contendo nome, APT, vitais, palavras-chave, itens e habilidades na matriz.
  - Valida que o retorno é um `Uint8Array` válido de PDF (`%PDF`).
  - Lê o PDF gerado via `PDFDocument.load` e verifica:
    - Exatamente 2 páginas.
    - Formulário AcroForm ativo com campos: `nome`, `apt`, `pv_atual`, `pv_max`, `pa_atual`, `pa_max`, `pd`, `palavra_chave_1` até `palavra_chave_9`, `inventario`, `slot_matriz_1_titulo` até `slot_matriz_9_titulo`.
    - Os valores nos campos correspondem aos dados da ficha fornecida.

- [ ] **Step 2: Executar teste para verificar falha**
  Run: `pnpm --filter @calafrio/web dlx vitest run apps/web/src/services/pdf/__tests__/exportador-pdf-ficha.test.ts`
  Expected: FAIL com módulo não encontrado.

- [ ] **Step 3: Implementar `exportador-pdf-ficha.ts`**
  - Implementar carregamento do template via `opcoes.bufferTemplate` ou `fetch` / `fs`.
  - Obter formulário com `const form = pdfDoc.getForm()`.
  - Criar helper `criarCampoTexto(nome, rect, valor, multiline, fontSize)`.
  - Mapear e preencher:
    - Identidade e Vitais (Página 1).
    - Palavras-chave com `distribuirLinhas(derivada.palavrasChaveAtivas)`.
    - Inventário formatado com tags `[E]` (equipado), dano, espectro e descrição.
    - Carteira (`fundos`, `espirions`).
    - Matriz de 9 Slots (Página 2), associando dados do catálogo quando disponível (custo em PA, ação, domínio e texto do efeito).
    - Anotações na página 2 com `ficha.anotacoes` e resumo de modificadores de eco.
    - Se houver `ficha.retratoUrl` em formato base64/data URL de imagem, embutir via `embedJpg` ou `embedPng` e desenhar na caixa do retrato.

- [ ] **Step 4: Executar teste para verificar sucesso**
  Run: `pnpm --filter @calafrio/web dlx vitest run apps/web/src/services/pdf/__tests__/exportador-pdf-ficha.test.ts`
  Expected: PASS com todos os campos gerados e preenchidos.

- [ ] **Step 5: Commit**
  ```bash
  git add apps/web/src/services/pdf/exportador-pdf-ficha.ts apps/web/src/services/pdf/__tests__/exportador-pdf-ficha.test.ts
  git commit -m "feat(web): implement editable PDF character sheet generator using pdf-lib"
  ```

---

### Task 4: Integração na Interface do Usuário (`FichaLiveClient` e `FichaCelular`)

**Files:**
- Modify: `apps/web/src/app/mesa/[mesaId]/players/[playerId]/ficha/ficha-live-client.tsx`
- Modify: `apps/web/src/components/ficha/celular/ficha-celular.tsx`
- Create: `apps/web/src/services/pdf/disparar-download-pdf.ts`
- Test: `apps/web/src/services/pdf/__tests__/disparar-download-pdf.test.ts`

**Interfaces:**
- Consumes: `gerarPdfFichaEditavel` de Task 3.
- Produces: Botão visual "Exportar PDF" na barra de ações da ficha desktop e celular, que efetua o download de `Ficha_<Nome>_Calafrio2e.pdf`.

- [ ] **Step 1: Escrever teste unitário para o utilitário de nome de arquivo e sanitização**
  Criar `apps/web/src/services/pdf/__tests__/disparar-download-pdf.test.ts` testando a função `formatarNomeArquivoPdf(nomePersonagem)`:
  - `"Arthur Pendelton"` -> `"Ficha_Arthur_Pendelton_Calafrio2e.pdf"`
  - `""` ou indefinido -> `"Ficha_Investigador_Calafrio2e.pdf"`
  - Caracteres especiais ou inválidos são limpos (`"Arthur / & O'Connor"` -> `"Ficha_Arthur_OConnor_Calafrio2e.pdf"`).

- [ ] **Step 2: Executar teste para verificar falha**
  Run: `pnpm --filter @calafrio/web dlx vitest run apps/web/src/services/pdf/__tests__/disparar-download-pdf.test.ts`
  Expected: FAIL.

- [ ] **Step 3: Implementar `disparar-download-pdf.ts`**
  Implementar:
  ```ts
  export function formatarNomeArquivoPdf(nome?: string): string;
  export function baixarArquivoPdfNoNavegador(buffer: Uint8Array, nomeArquivo: string): void;
  ```
  Utiliza `URL.createObjectURL(new Blob([buffer], { type: "application/pdf" }))` e clica em link temporário invisível.

- [ ] **Step 4: Executar teste para verificar sucesso**
  Run: `pnpm --filter @calafrio/web dlx vitest run apps/web/src/services/pdf/__tests__/disparar-download-pdf.test.ts`
  Expected: PASS.

- [ ] **Step 5: Integrar botão "Exportar PDF" em `ficha-live-client.tsx` e `ficha-celular.tsx`**
  - Adicionar botão com ícone `FileDown` (Lucide) na barra superior ao lado de "Rolar d20".
  - Gerenciar estado `exportandoPdf: boolean`.
  - Ao clicar:
    - Dispara `gerarPdfFichaEditavel(f.ficha, f.derivada, catalogo)`.
    - Dispara `baixarArquivoPdfNoNavegador(buffer, nomeArquivo)`.
  - Mesma ação acessível na visualização mobile (`ficha-celular.tsx`).

- [ ] **Step 6: Verificar compilação e tipagem**
  Run: `pnpm --filter @calafrio/web run type-check`
  Expected: PASS sem erros de tipo.

- [ ] **Step 7: Commit**
  ```bash
  git add apps/web/src/services/pdf/disparar-download-pdf.ts apps/web/src/services/pdf/__tests__/disparar-download-pdf.test.ts apps/web/src/app/mesa/[mesaId]/players/[playerId]/ficha/ficha-live-client.tsx apps/web/src/components/ficha/celular/ficha-celular.tsx
  git commit -m "feat(web): add export PDF button and browser download handler in character sheet"
  ```

---

### Task 5: Validação Completa, Teste de Integração e Lint

**Files:**
- Test: Todas as suítes de teste do monorepo e verificação de integridade do arquivo gerado.

- [ ] **Step 1: Executar suíte completa de testes no monorepo**
  Run: `pnpm test`
  Expected: Todos os pacotes e testes passando.

- [ ] **Step 2: Executar verificação estática do Biome e TypeScript**
  Run: `pnpm --filter @calafrio/web run type-check`
  Expected: Zero erros de tipo.

- [ ] **Step 3: Script de verificação de campos e integridade AcroForm**
  Executar um teste de verificação que inspeciona o PDF gerado com PyPDF/Node para garantir que os campos criados são 100% preenchidos e interativos.

- [ ] **Step 4: Commit final da branch**
  ```bash
  git commit --allow-empty -m "chore(web): complete verification for editable character sheet PDF exporter"
  ```
