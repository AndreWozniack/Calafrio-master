# Design Document: CI Pipeline, Biome Linter e Limite de 400 Linhas

**Data:** 2026-11-04  
**Status:** Aprovado  
**Escopo:** Monorepo (`.github/workflows`, `scripts/`, `biome.json`, `packages/`, `apps/`)

---

## 1. Contexto e Motivação
Para assegurar a qualidade contínua do monorepo Calafrio, evitar regressões antes de cada merge em `main`/`dev` e garantir que o código permaneça conciso e legível, configuraremos um pipeline completo de Integração Contínua (CI) no GitHub Actions com:
1. Verificação de Linter e formatação de código.
2. Regra arquitetural estrita de que **nenhum arquivo de código ultrapasse 400 linhas**.
3. Verificação de tipos estáticos (`pnpm type-check`).
4. Execução de toda a suíte de testes (`pnpm test`).
5. Validação de build da imagem de produção via Docker.

---

## 2. Metas, Não-Metas e Anti-Metas

### Metas (Goals)
1. **GitHub Actions CI (`.github/workflows/ci.yml`)**:
   - Disparo automático em `push` e `pull_request` mirando `main` e `dev`.
   - Jobs paralelos e rápidos:
     - `lint`: executa Biome (`biome check`) e a verificação de 400 linhas (`check:lines`).
     - `type-check`: valida todos os pacotes com `tsc --noEmit`.
     - `test`: roda a suíte Vitest com sucesso.
     - `docker-build`: valida `docker build` do Next.js sem depender de banco de dados em runtime.
2. **Script de Limite de Linhas (`pnpm check:lines`)**:
   - Varre recursivamente arquivos fonte (`.ts`, `.tsx`, `.js`, `.jsx`, `.css`) em `apps/` e `packages/`.
   - Ignora artefatos de build (`node_modules`, `.next`, `dist`, `.expo`, `public`) e catálogos estáticos de dados/seed (`packages/core/catalogo/habilidades-paranormais.ts`).
   - Aponta exatamente os arquivos que violarem o teto de 400 linhas com número de linhas e falha com código de erro 1.
3. **Resolução de Violações Existentes**:
   - Corrigir os arquivos de código atuais que excedem 400 linhas dividindo-os em submódulos coesos.
   - Corrigir avisos e desvios de formatação do Biome.

### Não-Metas (Non-Goals)
- Publicar a imagem Docker em registry de produção (isso é etapa de CD/Deploy, não de CI de verificação).
- Fatiar artificialmente dicionários estáticos de dados de RPG.

### Anti-Metas (Anti-Goals)
- Não permitir que o CI passe se houver violação de tipos, testes quebrados ou arquivos com mais de 400 linhas.
- Não usar ESLint lento quando o Biome já está configurado e roda em milissegundos.

---

## 3. Arquitetura e Decisões Técnicas

### 3.1 Script de Verificação de Linhas (`scripts/check-file-lines.mjs`)
- Implementado em Node.js puro ESM (sem dependências extras).
- Lê cada arquivo, conta quebras de linha (`\n`).
- Emite saída formatada clara:
  ```
  [Linhas] 420 linhas: apps/web/src/... (Excede limite de 400 linhas!)
  ```
- Integrado ao script raiz: `"lint": "biome check . && node scripts/check-file-lines.mjs"`.

### 3.2 Arquivos a Modularizar (Refatoração para <= 400 linhas)
1. `apps/web/src/components/ficha/criacao/etapa-itens-equipamentos.tsx` (672 linhas) -> Extrair listas/pacotes de itens ou sub-blocos.
2. `packages/core/ficha/montar-ficha.ts` (483 linhas) -> Extrair cálculos de bônus derivados para arquivo de apoio.
3. `apps/web/src/services/armazenamento-calafrio.ts` (453 linhas) -> Separar armazenamento de mesa e de criaturas/fichas.
4. `apps/web/src/components/ficha/pagina-ecos-aprimoramentos.tsx` (443 linhas) -> Extrair subcomponentes de eco.
5. `apps/web/src/components/ficha/visualizador-papel.tsx` (411 linhas) -> Extrair controles de zoom/páginas.
6. `apps/mobile/src/components/modais/ModalRolagemMobile.tsx` (~490 linhas) e `SeletorHabilidadeMobile.tsx` (~440 linhas) -> Extrair estilos e componentes visuais para manter <= 400 linhas.

### 3.3 GitHub Actions Workflow (`.github/workflows/ci.yml`)
```yaml
name: CI

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test

  docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t calafrio-web:ci .
```
