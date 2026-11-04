# Plano de Implementação: CI Pipeline, Biome Linter e Limite de 400 Linhas

> **Meta:** Configurar a pipeline de CI no GitHub Actions executando linter (Biome + limite de 400 linhas), type-check, testes e verificação de Docker, e refatorar os arquivos que atualmente ultrapassam 400 linhas.

---

### Task 1: Script de Validação de Linhas (`scripts/check-file-lines.mjs`) e Scripts no `package.json`
- [ ] Criar `scripts/check-file-lines.mjs` com varredura recursiva de arquivos de código (`.ts`, `.tsx`, `.js`, `.jsx`, `.css`) em `apps/` e `packages/`.
- [ ] Isentar diretórios de build (`node_modules`, `.next`, `dist`, `.expo`, `public`) e catálogos estáticos de dados/seed (`packages/core/catalogo/habilidades-paranormais.ts`, etc.).
- [ ] Adicionar `"check:lines": "node scripts/check-file-lines.mjs"` e atualizar `"lint"` no `package.json` raiz.
- [ ] Testar o script para identificar a lista exata de arquivos que excedem o limite.

---

### Task 2: Refatoração dos Arquivos que Excedem 400 Linhas
- [ ] Refatorar `apps/web/src/components/ficha/criacao/etapa-itens-equipamentos.tsx` (extrair blocos/listas de pacotes para submódulo).
- [ ] Refatorar `packages/core/ficha/montar-ficha.ts` (extrair helpers de cálculo de bônus derivados para submódulo).
- [ ] Refatorar `apps/web/src/services/armazenamento-calafrio.ts` (extrair persistência por entidade para submódulo).
- [ ] Refatorar `apps/web/src/components/ficha/pagina-ecos-aprimoramentos.tsx` (extrair cartões de customização/habilidades únicas para submódulo).
- [ ] Refatorar `apps/mobile/src/components/modais/ModalRolagemMobile.tsx` e `SeletorHabilidadeMobile.tsx` caso excedam 400 linhas.
- [ ] Refatorar quaisquer outros arquivos apontados pelo script.
- [ ] Verificar que `pnpm check:lines` passa 100% sem nenhuma violação.

---

### Task 3: Ajustes de Linter e Biome
- [ ] Executar `pnpm biome check .`
- [ ] Corrigir formatações ou violações de regras apontadas pelo Biome.
- [ ] Garantir que `pnpm lint` rode perfeitamente.

---

### Task 4: Workflow do GitHub Actions (`.github/workflows/ci.yml`)
- [ ] Criar `.github/workflows/ci.yml` com jobs paralelos:
  - `lint`: checkout, setup-node, pnpm install, `pnpm lint`
  - `type-check`: checkout, setup-node, pnpm install, `pnpm type-check`
  - `test`: checkout, setup-node, pnpm install, `pnpm test`
  - `docker`: checkout, `docker build -t calafrio-web:ci .`

---

### Task 5: Verificação Local Completa
- [ ] Rodar `pnpm lint` (Biome + 400 linhas).
- [ ] Rodar `pnpm type-check` em todos os workspaces.
- [ ] Rodar `pnpm test` em todos os testes unitários.

---

### Task 6: Commit e Push para `dev`
- [ ] Fazer commits claros e organizados (ex: `feat(ci): configurar script de limite de 400 linhas e workflow do github actions`, `refactor(web): modularizar componentes para respeitar teto de 400 linhas`).
- [ ] Enviar para `origin/dev`.
