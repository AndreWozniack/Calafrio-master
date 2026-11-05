# Convite de Players para Mesas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir que o mestre convide jogadores por link/código (`/entrar/[codigo]`), e que o jogador entre pela landing ou pelo hub `/mesa`, replicando o fluxo do T20 Master.

**Architecture:** Regras puras (normalizar código, quem é mestre, filtrar mesas) ficam em `convite-regras.ts`. Operações de persistência (Postgres Drizzle com fallback no store JSON, no padrão de `armazenamento-calafrio.ts`) ficam em um arquivo novo `armazenamento-convite.ts`, porque `armazenamento-calafrio.ts` já tem 365 linhas (limite 400). A UI usa server actions + componentes cliente pequenos (sem biblioteca de popover; o projeto não tem uma).

**Tech Stack:** TypeScript estrito, Next.js 16 (App Router, server actions), Drizzle/Postgres + store JSON local, Tailwind v4, lucide-react, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-04-convite-players-design.md`

## Global Constraints

- Tipagem estrita: sem `any`. Biome (`pnpm lint`) e `scripts/check-file-lines.mjs` (máx. 400 linhas por arquivo) devem passar a cada task.
- Todo acesso a dados tem dois caminhos: Postgres (`db` não nulo, com `try/catch` + `console.warn`) e fallback `carregarStore`/`salvarStore`.
- Código de convite: 6 caracteres do alfabeto de `gerarCodigoConvite()` (`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`); é único (`codigo_convite` é `unique` no schema).
- Só existem dois papéis: Mestre e Jogador. Sem expiração por tempo; a única invalidação é "Regerar".
- Jogador só entra com `userId` vinculado (sem fichas órfãs). Rascunho = player com `nome: "Investigador Pendente"`.
- Regerar o código exige confirmação explícita do mestre (dois cliques).
- `/entrar/*` NÃO é rota pública: o middleware já manda o não autenticado para `/login?callbackUrl=...` e `login/page.tsx` já devolve o destino. Não alterar `middleware.ts`.
- Textos de UI em português.

## Decisões que o spec deixa abertas

- **Mestre** = `mesa.userId == null || mesa.userId === userId` (mesmo critério que `listarMesas` já usa). Mestre que abre o link do próprio convite não vira player: vai para `/mesa/[mesaId]`.
- **"Ver / Criar minha Ficha"** cria/reusa o rascunho e abre o assistente em `/mesa/[mesaId]/players/novo?rascunho=<playerId>`; ao concluir, o assistente **salva sobre o rascunho** (sem criar segundo player). **"Entrar sem criar ficha agora"** cria/reusa o rascunho e vai para `/mesa/[mesaId]`.
- `sairDaMesaComoJogador` **remove** os players do usuário naquela mesa (anti-meta: sem fichas órfãs).

## Review Focus

1. Mestre abre o próprio link de convite → não cria player; vai ao painel da mesa. (Task 2)
2. Código digitado com minúsculas, espaços ou hífen (`ab c-d23`) casa com o código real; código inexistente → 404; campo vazio não navega. (Tasks 1, 2)
3. Clicar duas vezes / reabrir o link / voltar do assistente → nunca duplica player do mesmo usuário na mesa. (Tasks 1, 2)
4. Jogador comum não consegue regerar código, excluir a mesa nem vê o popover do mestre (autorização no servidor, não só na UI). (Tasks 3, 4)
5. "Sair da Mesa" remove só os players daquele usuário naquela mesa, nunca de outras mesas nem de outros usuários. (Task 1)
6. Regerar com colisão de código (código sorteado já existe) tenta de novo e devolve um código único; o link antigo passa a dar 404. (Task 1)

---

### Task 1: Regras puras e serviços de convite

**Files:**
- Create: `apps/web/vitest.config.ts` (alias `@` → `./src`; `apps/web` hoje não tem config e os testes existentes só usam imports relativos)
- Create: `apps/web/src/services/convite-regras.ts`
- Create: `apps/web/src/services/armazenamento-convite.ts`
- Modify: `apps/web/src/services/armazenamento-calafrio.ts` (`criarPlayer` aceita `userId`; `listarPlayers`/`obterPlayer` devolvem `userId`; `listarMesas` filtra o fallback local por usuário)
- Test: `apps/web/src/services/__tests__/convite-regras.test.ts`
- Test: `apps/web/src/services/__tests__/armazenamento-convite.test.ts`

**Interfaces:**
- Consumes: `MesaCalafrio`, `PlayerCalafrio`, `DadosStore`, `gerarCodigoConvite`, `carregarStore`, `salvarStore` (de `armazenamento-store.ts`); `obterMesa`, `criarPlayer` (de `armazenamento-calafrio.ts`); `criarFichaCalafrioVazia(id: string, nome: string): FichaCalafrio` (de `@calafrio/core`).
- Produces (`convite-regras.ts`, puro, sem import de `db`):
  - `normalizarCodigoConvite(entrada: string): string` — `trim`, maiúsculas, remove espaços e `-`.
  - `ehMestreDaMesa(mesa: Pick<MesaCalafrio, "userId">, userId?: string): boolean`.
  - `filtrarMesasDoUsuario(store: Pick<DadosStore, "mesas" | "players">, userId: string): MesaCalafrio[]` — mesas em que o usuário é mestre ou tem player.
- Produces (`armazenamento-convite.ts`):
  - `class ErroConvite extends Error { constructor(public codigo: "INVALIDO" | "MESTRE" | "SEM_PERMISSAO") }`
  - `buscarMesaPorCodigoConvite(codigo: string): Promise<MesaCalafrio | null>` (normaliza antes de buscar)
  - `regerarCodigoConvite(mesaId: string, userId?: string): Promise<string>` (se `userId` vier e não for mestre → `ErroConvite("SEM_PERMISSAO")`; sorteia até 5 vezes até achar código livre)
  - `entrarPorConvite(userId: string, codigo: string): Promise<{ mesaId: string; playerId: string }>` (código inválido → `ErroConvite("INVALIDO")`; mestre → `ErroConvite("MESTRE")`; reusa player existente do usuário na mesa; senão cria rascunho)
  - `sairDaMesaComoJogador(userId: string, mesaId: string): Promise<void>`
  - `criarPlayer(mesaId: string, ficha: FichaCalafrio, userId?: string): Promise<PlayerCalafrio>` (assinatura atualizada em `armazenamento-calafrio.ts`)

- [ ] **Step 1: Criar `apps/web/vitest.config.ts`** com `defineConfig` de `vitest/config` e `resolve.alias: { "@": <abs>/src }` (`fileURLToPath(new URL("./src", import.meta.url))`). Rodar `pnpm --filter @calafrio/web test` e confirmar que os testes existentes continuam passando.

- [ ] **Step 2: Escrever `convite-regras.test.ts` (falhando)**, com estas asserções:
  - `normalizarCodigoConvite(" ab c-d23 ")` → `"ABCD23"`; `normalizarCodigoConvite("   ")` → `""`.
  - `ehMestreDaMesa({ userId: "u1" }, "u1")` → `true`; `({ userId: "u1" }, "u2")` → `false`; `({ userId: "u1" }, undefined)` → `false`; `({ userId: null }, "u2")` → `true`.
  - `filtrarMesasDoUsuario` com mesas `m1` (dono `u1`), `m2` (dono `u9`), `m3` (dono `u9`) e um player de `u1` em `m2`: para `u1` devolve `[m1, m2]`; para `u7` devolve `[]`.

- [ ] **Step 3: Rodar** `pnpm --filter @calafrio/web test convite-regras` → FAIL (módulo inexistente).

- [ ] **Step 4: Implementar `convite-regras.ts`** com as três funções acima.

- [ ] **Step 5: Rodar o teste** → PASS.

- [ ] **Step 6: Escrever `armazenamento-convite.test.ts` (falhando).** Setup: `vi.mock("@/db", () => ({ db: null, schema: {} }))`; `vi.mock("../armazenamento-store", async (orig) => ({ ...(await orig()), carregarStore, salvarStore, gerarCodigoConvite }))` onde `carregarStore` devolve um `DadosStore` em memória recriado em `beforeEach` com `mesa-1` (dono `mestre1`, código `CALA26`) e `mesa-2` (dono `mestre1`, código `OUTRA2`), e `gerarCodigoConvite` é um `vi.fn`. Casos:
  - `buscarMesaPorCodigoConvite("cala-26")` devolve `mesa-1`; `buscarMesaPorCodigoConvite("ZZZZZZ")` → `null`.
  - `entrarPorConvite("u2", "CALA26")` devolve `{ mesaId: "mesa-1", playerId }`; o store passa a ter 1 player com `userId === "u2"`, `mesaId === "mesa-1"`, `nome === "Investigador Pendente"`.
  - Segunda chamada igual devolve o mesmo `playerId` e o store continua com 1 player.
  - `entrarPorConvite("mestre1", "CALA26")` rejeita com `ErroConvite` de `codigo === "MESTRE"`; `entrarPorConvite("u2", "ZZZZZZ")` rejeita com `codigo === "INVALIDO"`.
  - `regerarCodigoConvite("mesa-1", "mestre1")` com `gerarCodigoConvite` devolvendo `"CALA26"` (colisão) e depois `"NOVO22"` → resolve `"NOVO22"`; `buscarMesaPorCodigoConvite("CALA26")` → `null`; `buscarMesaPorCodigoConvite("NOVO22")` → `mesa-1`.
  - `regerarCodigoConvite("mesa-1", "u2")` rejeita com `codigo === "SEM_PERMISSAO"` e o código da mesa não muda.
  - `sairDaMesaComoJogador("u2", "mesa-1")` com players: `u2` em `mesa-1`, `u2` em `mesa-2`, `u3` em `mesa-1` → sobram exatamente os dois últimos.
  - `criarPlayer("mesa-1", ficha, "u2")` grava `userId === "u2"`; `criarPlayer("mesa-1", ficha)` grava `userId` nulo/ausente.

- [ ] **Step 7: Rodar** `pnpm --filter @calafrio/web test armazenamento-convite` → FAIL.

- [ ] **Step 8: Atualizar `armazenamento-calafrio.ts`:**
  - `criarPlayer(mesaId, ficha, userId?: string)`: inclui `userId: userId ?? null` no objeto `novo` e no `insert` do Drizzle.
  - `listarPlayers` e `obterPlayer`: mapear `userId: p.userId` no caminho Postgres.
  - `listarMesas(userId)`: no fallback local, quando `userId` vier, devolver `filtrarMesasDoUsuario(s, userId)`; sem `userId`, manter `s.mesas`.

- [ ] **Step 9: Implementar `armazenamento-convite.ts`** (padrão Postgres-com-fallback das demais funções; usar `eq`/`and` do `drizzle-orm`; rascunho via `criarPlayer(mesaId, criarFichaCalafrioVazia(id, "Investigador Pendente"), userId)`; `entrarPorConvite` reusa o primeiro player do usuário na mesa; `regerarCodigoConvite` valida mestre via `ehMestreDaMesa`, consulta se o código sorteado já existe e repete até 5 vezes, lançando `Error` se esgotar; atualiza também `atualizadaEm` no Postgres).

- [ ] **Step 10: Rodar** `pnpm --filter @calafrio/web test` → tudo PASS. Rodar `pnpm lint` e `pnpm type-check` → sem erros.

- [ ] **Step 11: Commit**

```bash
git add apps/web/vitest.config.ts apps/web/src/services
git commit -m "feat(web): add invite services and pure role rules"
```

---

### Task 2: Página de convite `/entrar/[codigo]` e assistente sobre rascunho

**Files:**
- Create: `apps/web/src/app/entrar/page.tsx`
- Create: `apps/web/src/app/entrar/form-entrar-com-codigo.tsx`
- Create: `apps/web/src/app/entrar/[codigo]/page.tsx`
- Create: `apps/web/src/app/entrar/[codigo]/entrar-landing.tsx`
- Create: `apps/web/src/app/entrar/actions.ts`
- Modify: `apps/web/src/app/mesa/actions.ts` (adicionar `entrarPorCodigoAction`)
- Modify: `apps/web/src/app/mesa/[mesaId]/players/novo/page.tsx` e `novo-player-client.tsx` (suporte a `?rascunho=`)

**Interfaces:**
- Consumes: Task 1 (`buscarMesaPorCodigoConvite`, `entrarPorConvite`, `ErroConvite`, `ehMestreDaMesa`, `normalizarCodigoConvite`, `obterPlayer`), `salvarFichaPlayerAction(playerId: string, ficha: FichaCalafrio)` de `players/actions.ts`, `auth()` de `@/auth` (id do usuário em `(session.user as { id?: string }).id`).
- Produces:
  - `entrarPorCodigoAction(formData: FormData): Promise<void>` em `mesa/actions.ts` — lê o campo `codigo`, normaliza; vazio → retorna sem navegar; senão `redirect(\`/entrar/${codigo}\`)`.
  - `entrarSemFichaAction(codigo: string): Promise<{ mesaId: string; playerId: string }>` em `entrar/actions.ts` — exige sessão (senão `redirect("/login")`), chama `entrarPorConvite`, `revalidatePath` de `/mesa` e `/mesa/${mesaId}/players`.
  - `<FormEntrarComCodigo />` (server component, `<form action={entrarPorCodigoAction}>` com `input name="codigo"` e botão "Entrar").
  - `<EntrarLanding mesaNome: string; codigo: string; />` (cliente) com os dois botões.
  - `NovoPlayerClient` ganha prop opcional `rascunhoId?: string`.

- [ ] **Step 1: Implementar `entrarPorCodigoAction`** em `mesa/actions.ts` conforme Interfaces. Não há teste unitário (depende de `auth`/`redirect`); coberto pela verificação manual do Step 8.

- [ ] **Step 2: Criar `entrar/actions.ts` com `entrarSemFichaAction`**; `ErroConvite` do tipo `MESTRE` ou `INVALIDO` é propagado (a landing evita chamá-lo nesses casos).

- [ ] **Step 3: Criar `entrar/page.tsx`** (card no estilo `calafrio-card` de `/mesa/page.tsx`, com `<FormEntrarComCodigo />` e link "Voltar às Mesas") e `form-entrar-com-codigo.tsx`.

- [ ] **Step 4: Criar `entrar/[codigo]/page.tsx`** (server component, `params: Promise<{ codigo: string }>`):
  - `auth()`; sem sessão → `redirect("/login")` (rede de segurança além do middleware).
  - `buscarMesaPorCodigoConvite(codigo)` nulo → `notFound()`.
  - `ehMestreDaMesa(mesa, userId)` → `redirect(\`/mesa/${mesa.id}\`)`.
  - Caso contrário renderiza `<EntrarLanding mesaNome={mesa.nome} codigo={codigo} />` dentro de `BannerEscudo` com ícone/nome da mesa e a badge "Calafrio 2ª Edição".

- [ ] **Step 5: Criar `entrar-landing.tsx`** (`"use client"`): botão primário "Ver / Criar minha Ficha" chama `entrarSemFichaAction(codigo)` e faz `router.push(\`/mesa/${mesaId}/players/novo?rascunho=${playerId}\`)`; botão secundário "Entrar sem criar ficha agora" chama a mesma action e faz `router.push(\`/mesa/${mesaId}\`)`. Ambos desabilitados enquanto `useTransition` estiver pendente (evita clique duplo).

- [ ] **Step 6: Suporte a rascunho no assistente.**
  - `novo/page.tsx`: lê `searchParams: Promise<{ rascunho?: string }>`; só repassa `rascunhoId` se `obterPlayer(rascunho)` existir, `player.mesaId === mesaId` e `player.userId` for o usuário da sessão; caso contrário ignora o parâmetro (assistente cria player novo como hoje).
  - `novo-player-client.tsx`: em `handleConcluir`, se `rascunhoId` existir chama `salvarFichaPlayerAction(rascunhoId, { ...f.ficha, id: rascunhoId })` e navega para `/mesa/${mesaId}/players/${rascunhoId}/ficha`; senão mantém o `criarPlayerAction` atual.

- [ ] **Step 7: Rodar** `pnpm lint`, `pnpm type-check`, `pnpm --filter @calafrio/web test` → sem erros.

- [ ] **Step 8: Verificação manual** (`pnpm dev`, login de dev com dois usuários em janelas distintas): mestre cria mesa e abre `/entrar/<codigo>` → cai no painel; jogador abre o link deslogado → login → volta à landing; "Entrar sem criar ficha agora" → painel e 1 "Investigador Pendente" em `/mesa/<id>/players`; reabrir o link e clicar "Ver / Criar minha Ficha" → assistente; concluir → o mesmo player (sem duplicar) ganha o nome novo; `/entrar/XXXXXX` → 404; `/entrar` com `ab c-d23` navega para `/entrar/ABCD23`.

- [ ] **Step 9: Commit**

```bash
git add apps/web/src/app/entrar apps/web/src/app/mesa/actions.ts "apps/web/src/app/mesa/[mesaId]/players/novo"
git commit -m "feat(web): add invite landing page and wizard on draft player"
```

---

### Task 3: Popover "Convidar Jogadores" para o mestre

**Files:**
- Create: `apps/web/src/app/mesa/[mesaId]/players/convite-mesa-popover.tsx`
- Modify: `apps/web/src/app/mesa/[mesaId]/players/actions.ts` (adicionar `regerarConviteAction`)
- Modify: `apps/web/src/app/mesa/[mesaId]/players/page.tsx`

**Interfaces:**
- Consumes: `regerarCodigoConvite`, `ErroConvite`, `ehMestreDaMesa` (Task 1); `auth()`.
- Produces:
  - `regerarConviteAction(mesaId: string): Promise<string>` — exige sessão; devolve o novo código; `ErroConvite("SEM_PERMISSAO")` se não for mestre; `revalidatePath` de `/mesa/${mesaId}`, `/mesa/${mesaId}/players` e `/mesa`.
  - `<ConviteMesaPopover mesaId: string; codigoConvite: string; />` (cliente).

- [ ] **Step 1: Implementar `regerarConviteAction`** chamando `regerarCodigoConvite(mesaId, userId)` com o `userId` da sessão.

- [ ] **Step 2: Implementar `ConviteMesaPopover`**: botão "Convidar Jogadores" (ícone `UserPlus`) que abre/fecha um painel absoluto (fecha com clique fora e `Escape`); mostra `input readOnly` com `${origin}/entrar/${codigo}` (`origin` vem de `window.location.origin` em `useEffect`, evitando divergência de hidratação); botão "Copiar" usa `navigator.clipboard.writeText` e mostra "Copiado!" por 2 s; botão "Regerar código" abre confirmação inline ("Isso invalida o link atual. Confirmar?" com "Confirmar"/"Cancelar") e só então chama `regerarConviteAction`, atualizando o código exibido com o retorno.

- [ ] **Step 3: Integrar em `players/page.tsx`**, no bloco de botões do header, **somente** quando `ehMestreDaMesa(mesa, userId)` (ler `userId` via `auth()`).

- [ ] **Step 4: Rodar** `pnpm lint`, `pnpm type-check`, `pnpm --filter @calafrio/web test` → sem erros.

- [ ] **Step 5: Verificação manual:** como mestre, popover abre, "Copiar" mostra "Copiado!", "Regerar" exige confirmação, e o link antigo passa a dar 404 em `/entrar/<antigo>`; como jogador (entrou pelo convite), `/mesa/<id>/players` não mostra o botão.

- [ ] **Step 6: Commit**

```bash
git add "apps/web/src/app/mesa/[mesaId]/players"
git commit -m "feat(web): add invite popover with copy and regenerate for masters"
```

---

### Task 4: Hub de mesas com código, papéis e "Sair da Mesa"

**Files:**
- Create: `apps/web/src/app/mesa/botao-sair-da-mesa.tsx`
- Modify: `apps/web/src/app/mesa/page.tsx`
- Modify: `apps/web/src/app/mesa/actions.ts` (adicionar `sairDaMesaAction`; proteger `excluirMesaAction`)

**Interfaces:**
- Consumes: `FormEntrarComCodigo` (Task 2), `ehMestreDaMesa`, `sairDaMesaComoJogador` (Task 1), `obterMesa`.
- Produces:
  - `sairDaMesaAction(mesaId: string): Promise<void>` — exige sessão; chama `sairDaMesaComoJogador(userId, mesaId)`; `revalidatePath("/mesa")`.
  - `excluirMesaAction(mesaId: string)` passa a ignorar a chamada (sem excluir) se o usuário da sessão não for mestre (`ehMestreDaMesa(await obterMesa(mesaId), userId)`).
  - `<BotaoSairDaMesa mesaId: string />` (cliente; `confirm("Sair desta mesa? Seus personagens nela serão removidos.")` antes de submeter).

- [ ] **Step 1: Atualizar as actions** em `mesa/actions.ts` conforme Interfaces.

- [ ] **Step 2: Atualizar `mesa/page.tsx`:** renderizar `<FormEntrarComCodigo />` (rótulo "Entrar com Código") abaixo do formulário de criação; para cada mesa calcular `mestre = ehMestreDaMesa(mesa, userId)`; mestre mantém badge "Mestre", código e botão excluir; jogador vê badge "Jogador" (ícone `User`, estilo distinto do âmbar), **sem** código e **sem** botão excluir, com `<BotaoSairDaMesa />` ao lado de "Entrar".

- [ ] **Step 3: Implementar `botao-sair-da-mesa.tsx`.**

- [ ] **Step 4: Rodar** `pnpm lint`, `pnpm type-check`, `pnpm --filter @calafrio/web test` → sem erros.

- [ ] **Step 5: Verificação manual:** no hub do jogador a mesa aparece como "Jogador" sem lixeira e sem código; "Sair da Mesa" pede confirmação, remove a mesa da lista e só os players dele naquela mesa; chamar `excluirMesaAction` de um jogador não apaga a mesa; "Entrar com Código" no hub leva a `/entrar/<codigo>`.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/app/mesa
git commit -m "feat(web): add code entry, role badges and leave-table to hub"
```
