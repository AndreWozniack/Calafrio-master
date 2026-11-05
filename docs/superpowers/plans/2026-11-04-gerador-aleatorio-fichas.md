# Gerador Aleatório de Fichas para Calafrio RPG Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar o gerador aleatório e canônico de fichas no motor (`@calafrio/core`) e uma zona especial interativa com prévia e salvamento rápido na tela de players da mesa (`/mesa/[mesaId]/players`).

**Architecture:** Motor puro no pacote `@calafrio/core/ficha/gerador-aleatorio.ts` sorteando ocupações, palavras-chave, habilidades de domínio uniforme e bugigangas, coberto por testes no Vitest. Na UI (`apps/web`), um componente de cliente `ZonaGeradorAleatorio` na tela de players permite gerar, re-rolar, inspecionar a ficha e adicionar à mesa em 1 clique ou salvar e abrir o editor.

**Tech Stack:** TypeScript estrito, React 19, Next.js 16 (App Router), Tailwind CSS v4, Lucide React, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-04-gerador-aleatorio-fichas-design.md`

## Global Constraints

- Monorepo pnpm com pacotes `@calafrio/core`, `@calafrio/tema`, `apps/web`.
- Tipagem estrita: sem `any`.
- As fichas geradas devem sempre satisfazer as regras da 2ª Edição de Calafrio sem gerar `avisosDeRegra`:
  - Domínio consistente (*apenas Positivo* ou *apenas Negativo*).
  - Número de habilidades memorizadas $= \text{APT}$ (default 1).
  - Número de palavras-chave base $= 2 + \text{APT}$ (1 ocupação + 2 aspectos/traços).
  - Vitais e derivados calculados via `montarFichaCalafrio`.

## Review Focus

1. **Risco de `DOMINIO_MISTO`:** A habilidade sorteada deve vir exclusivamente de uma lista filtrada pelo mesmo domínio escolhido para o personagem.
2. **Duplicação de palavras-chave:** As 2 palavras-chave genéricas não devem ser idênticas entre si nem à ocupação.
3. **Persistência correta na mesa:** `criarPlayerAction` deve receber a ficha gerada com id único e registrar no banco/armazenamento da mesa sem erros de serialização.
4. **Cálculo de vitais derivados:** A prévia deve mostrar os vitais derivados reais (PV, PA, PD, VEL) calculados pelo motor de regras, e não números estáticos.
5. **Responsividade mobile da zona especial:** O card de prévia e os botões de ação devem caber confortavelmente em telas pequenas.

---

### Task 1: Motor do Gerador Aleatório no Core (`@calafrio/core`)

**Files:**
- Create: `packages/core/ficha/gerador-aleatorio.ts`
- Create: `packages/core/ficha/__tests__/gerador-aleatorio.test.ts`
- Modify: `packages/core/ficha/index.ts`
- Modify: `packages/core/index.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface OpcoesGeradorFicha {
    apt?: number; // default: 1 (suporta 1 a 6)
    personalidadeFoco?: PersonalidadeCalafrio;
    dominio?: "positivo" | "negativo";
    jogador?: string;
    randomFn?: () => number; // default: Math.random (permite testes determinísticos com seed)
  }
  export function gerarFichaAleatoria(
    catalogo: CatalogoCalafrio,
    opcoes?: OpcoesGeradorFicha,
  ): FichaCalafrio;
  ```

- [ ] **Step 1: Escrever teste falhando para `gerarFichaAleatoria`**

```ts
// packages/core/ficha/__tests__/gerador-aleatorio.test.ts
import { describe, expect, it } from "vitest";
import { carregarCatalogoCalafrio } from "../../catalogo";
import { montarFichaCalafrio } from "../montar-ficha";
import { gerarFichaAleatoria } from "../gerador-aleatorio";

describe("gerarFichaAleatoria", () => {
  const catalogo = carregarCatalogoCalafrio();

  it("deve gerar uma ficha válida pelas regras da 2ª Edição com APT 1 padrão", () => {
    const ficha = gerarFichaAleatoria(catalogo);
    expect(ficha.id).toBeTruthy();
    expect(ficha.nome).toBeTruthy();
    expect(ficha.aptBase).toBe(1);
    expect(ficha.palavrasChave.length).toBe(3); // 1 ocupação + 2 genéricas
    expect(ficha.matrizHabilidades.length).toBe(1);
    expect(ficha.inventario.length).toBeGreaterThanOrEqual(2); // arma + bugiganga

    const derivada = montarFichaCalafrio(ficha, catalogo);
    expect(derivada.avisosDeRegra).toEqual([]);
    expect(derivada.dominioAtual).toMatch(/^(positivo|negativo)$/);
    expect(derivada.pvMax).toBe(6); // 3 + 3 * 1
    expect(derivada.paMax).toBe(6); // 3 + 3 * 1
    expect(derivada.pd).toBe(3);   // 3 * 1
  });

  it("deve respeitar opções personalizadas de APT e domínio", () => {
    const ficha = gerarFichaAleatoria(catalogo, { apt: 2, dominio: "positivo" });
    expect(ficha.aptBase).toBe(2);
    expect(ficha.palavrasChave.length).toBe(4); // 2 + 2
    expect(ficha.matrizHabilidades.length).toBe(2);

    const derivada = montarFichaCalafrio(ficha, catalogo);
    expect(derivada.avisosDeRegra).toEqual([]);
    expect(derivada.dominioAtual).toBe("positivo");
  });

  it("deve gerar 50 fichas consecutivas sem qualquer aviso de regra", () => {
    for (let i = 0; i < 50; i++) {
      const ficha = gerarFichaAleatoria(catalogo);
      const derivada = montarFichaCalafrio(ficha, catalogo);
      expect(derivada.avisosDeRegra).toEqual([]);
    }
  });
});
```

- [ ] **Step 2: Rodar o teste para verificar que falha**

Run: `pnpm --filter @calafrio/core test packages/core/ficha/__tests__/gerador-aleatorio.test.ts`
Expected: FAIL ("Cannot find module '../gerador-aleatorio'")

- [ ] **Step 3: Implementar `gerarFichaAleatoria` em `packages/core/ficha/gerador-aleatorio.ts`**

Implementar:
- Lista curada de prenomes e sobrenomes de temática urbana/investigativa.
- Sorteio da ocupação de `catalogo.ocupacoes`.
- Sorteio de $(1 + \text{APT})$ palavras-chave sem repetição de `catalogo.palavrasChaveGenericas`.
- Escolha de domínio (*positivo* ou *negativo*) e filtro de `catalogo.habilidadesParanormais` pertencentes a esse domínio (e opcionalmente respeitando `personalidadeFoco`).
- Alocação de $\text{APT}$ habilidades em posições da matriz 3x3 sem colisão de slots.
- Sorteio de 1 arma do `catalogo.armasMundanas` e 1 bugiganga de `catalogo.bugigangas`.
- Cálculo de carteira inicial em $\text{F}\$$.
- Exportar em `packages/core/ficha/index.ts` e `packages/core/index.ts`.

- [ ] **Step 4: Rodar o teste para verificar que passa**

Run: `pnpm --filter @calafrio/core test packages/core/ficha/__tests__/gerador-aleatorio.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/core/ficha/gerador-aleatorio.ts packages/core/ficha/__tests__/gerador-aleatorio.test.ts packages/core/ficha/index.ts packages/core/index.ts
git commit -m "feat(core): add canonical random character generator"
```

---

### Task 2: Componente UI `ZonaGeradorAleatorio` na Web

**Files:**
- Create: `apps/web/src/app/mesa/[mesaId]/players/zona-gerador-aleatorio.tsx`

**Interfaces:**
- Consumes:
  - `gerarFichaAleatoria(catalogo, opcoes)` de `@calafrio/core`
  - `carregarCatalogoCalafrio()` de `@calafrio/core`
  - `montarFichaCalafrio(ficha, catalogo)` de `@calafrio/core`
  - `criarPlayerAction(mesaId, ficha)` de `./actions`
- Props:
  ```ts
  interface ZonaGeradorAleatorioProps {
    mesaId: string;
  }
  ```

- [ ] **Step 1: Implementar o componente `ZonaGeradorAleatorio` com estado de prévia, sorteio reativo e ações**

Recursos do componente:
- Botão chamativo no estilo Calafrio: `🎲 Forjar Investigador Aleatório (1 Clique)`.
- Quando gerado, expandir painel temático com:
  - Nome sorteado + badge da Ocupação.
  - Vitais destacados calculados em tempo real (APT, PV, PA, PD, VEL).
  - Palavras-chave listadas em pills estilizadas.
  - Habilidade Paranormal sorteada com descrição, custo e domínio (*Positivo* em âmbar/dourado, *Negativo* em roxo/índigo).
  - Itens iniciais (Arma e Bugiganga d100).
  - Carteira inicial ($\text{F}\$$).
- Botões de Ação:
  - `🎲 Sortear Outro`: gera novo sorteio instantâneo.
  - `✅ Adicionar à Mesa`: salva chamando `criarPlayerAction(mesaId, fichaSorteada)` e exibe indicador de sucesso.
  - `✏️ Salvar e Abrir Ficha`: salva e faz `router.push('/mesa/${mesaId}/players/${player.id}/ficha')`.
  - `✕ Fechar`: descarta a prévia atual.

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/mesa/[mesaId]/players/zona-gerador-aleatorio.tsx
git commit -m "feat(web): add ZonaGeradorAleatorio interactive component"
```

---

### Task 3: Integração na Tela de Players da Mesa

**Files:**
- Modify: `apps/web/src/app/mesa/[mesaId]/players/page.tsx`

- [ ] **Step 1: Integrar `ZonaGeradorAleatorio` em `apps/web/src/app/mesa/[mesaId]/players/page.tsx`**

Posicionar o componente logo abaixo do cabeçalho da página de players e antes da lista de players existentes.

- [ ] **Step 2: Verificar compilação TypeScript e Build**

Run: `pnpm type-check`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/app/mesa/[mesaId]/players/page.tsx
git commit -m "feat(web): integrate random generator zone into players page"
```

---

### Task 4: Verificação de Ponta a Ponta

- [ ] **Step 1: Rodar toda a suíte de testes do monorepo**

Run: `pnpm test`
Expected: Todos os testes passando.

- [ ] **Step 2: Validar lint e formatação**

Run: `pnpm lint` ou validação do biome se configurado.

- [ ] **Step 3: Testar manualmente a geração e salvamento**

Testar no navegador a criação e adição de player à mesa via gerador aleatório.
