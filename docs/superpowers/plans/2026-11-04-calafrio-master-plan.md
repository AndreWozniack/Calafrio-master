# Calafrio-master Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o monorepo independente `/Users/andrewozniack/Documents/Calafrio-master` com a engine determinística e aberta do Calafrio 2e (`@calafrio/core`), controladores de estado (`@calafrio/ficha-app`), identidade visual fiel (`@calafrio/tema`) e aplicação web (`@calafrio/web`) contendo Ficha Viva de 2 páginas, Assistente de Criação/Evolução, Biblioteca com leitor dos PDFs oficiais, Bestiário plugável e Rastreador de Mesa/Combate.

**Architecture:** Monorepo `pnpm` em três camadas unidirecionais (`Catálogo imutável → Ficha persistida → FichaDerivada calculada`), inspirado em `T20-master/packages/core/ficha`, mas 100% nativo para o domínio do Calafrio 2e (`APT` 1–6, Matriz 3×3 de Habilidades Paranormais com bônus de alinhamento, Palavras-chave, Carteira `F$`/`E$P`, Ecos e Motor de Efeitos Abertos com proveniência). Inclui configuração Docker/Dokploy isolada.

**Tech Stack:** TypeScript 5, pnpm workspaces, Vitest, Next.js (App Router), React 19, Tailwind CSS 4, Lucide Icons, Biome.

**Spec:** `/Users/andrewozniack/Documents/Calafrio-master/docs/superpowers/specs/2026-11-04-calafrio-master-design.md`

## Global Constraints

- Repositório isolado em `/Users/andrewozniack/Documents/Calafrio-master` (nenhuma dependência de runtime apontando para `/Users/andrewozniack/Documents/T20-master` ou `/Users/andrewozniack/Documents/arsenal`).
- Zero resquícios de Tormenta20 (proibido usar termos `raca`, `classe`, `pm`, `cdDeMagia` ou os 6 atributos de T20).
- `@calafrio/core` é TypeScript puro: não importa React, Next, banco de dados nem `node:*`.
- `FichaDerivadaCalafrio` nunca é persistida; todo valor derivado (`pvMax`, `paMax`, `pd`, `velocidade`, `ecosMax`, bônus da matriz 3×3) é recalculado por `montarFichaCalafrio`.
- Todo modificador em `FichaDerivadaCalafrio` carrega `origem` (proveniência).
- Arquivos pequenos e coesos (componentes e módulos abaixo de ~300 linhas, seguindo SOLID e Clean Code).

## Review Focus

- **Alinhamento parcial ou com Habilidade Única sem personalidade na Matriz 3×3:** Uma linha/coluna/diagonal/bloco 2×2 com menos de 3 (ou 4 no bloco 2×2) habilidades, ou contendo habilidades de personalidades diferentes, ou uma Habilidade Única sem personalidade atribuída, **não** deve conceder bônus de alinhamento; já uma Habilidade Única com `personalidadeAlinhamento` autorizada pelo MdJ deve contar normalmente. (Testado na Task 3).
- **Conflito de Domínio Emocional (Positivo vs. Negativo):** Tentar memorizar habilidades do Domínio Positivo e Negativo simultaneamente deve gerar um aviso/pendência de validação em `FichaDerivadaCalafrio.avisosDeRegra`, a menos que a ficha possua o efeito `regraEspecial: "permitirDominioMisto"`. (Testado na Task 3).
- **Palavras-chave concedidas pelo Mestre/Itens/Outras Palavras-chave:** Palavras-chave com `semConsumirLimite: true` devem entrar na lista final de palavras-chave ativas sem incrementar o contador de vagas ocupadas do limite `2 + APT`. (Testado na Task 3).
- **Unificação de PV e PA (Djanho 6 — Sexto Sentido) e Custo em PV (*Pirocinese*):** Quando a regra `pvUnificadoComPa` estiver ativa ou uma habilidade usar `recurso: "pv"`, o consumo deve debitar de `danoSofrido` (reduzindo `pvAtual`) em vez de `paGasto`. (Testado na Task 3).
- **Contestação hostil contra vítima com `PD` maior que a rolagem + crítico 20 e falha crítica 1:** Em `rolarContestacao`, se a vítima rolar total menor que seu `PD` (exceto quando o dado natural for `1`), o resultado efetivo da vítima deve ser elevado ao piso `PD`; um `20` natural do atacante vence mesmo contra `PD` alto, e um `1` natural falha automaticamente. (Testado na Task 4).

---

## Mapa de Arquivos a Criar em `/Users/andrewozniack/Documents/Calafrio-master`

```text
/Users/andrewozniack/Documents/Calafrio-master/
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── biome.json
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
├── packages/
│   ├── tema/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── tokens.ts
│   │   │   ├── index.ts
│   │   │   └── tokens.test.ts
│   ├── core/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── index.ts
│   │   ├── catalogo/
│   │   │   ├── tipos.ts
│   │   │   ├── habilidades-paranormais.ts
│   │   │   ├── palavras-chave.ts
│   │   │   ├── ocupacoes.ts
│   │   │   ├── equipamentos.ts
│   │   │   ├── bugigangas.ts
│   │   │   ├── tabelas-suporte.ts
│   │   │   ├── glossario.ts
│   │   │   ├── index.ts
│   │   │   └── __tests__/catalogo.test.ts
│   │   ├── ficha/
│   │   │   ├── modelo.ts
│   │   │   ├── efeitos.ts
│   │   │   ├── matriz-alinhamento.ts
│   │   │   ├── montar-ficha.ts
│   │   │   ├── estado-jogo.ts
│   │   │   ├── index.ts
│   │   │   └── __tests__/montar-ficha.test.ts
│   │   ├── bestiario/
│   │   │   ├── motor-bestiario.ts
│   │   │   └── __tests__/motor-bestiario.test.ts
│   │   └── rolagem/
│   │       ├── rolagem-calafrio.ts
│   │       └── __tests__/rolagem-calafrio.test.ts
│   └── ficha-app/
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   ├── ficha-inicial.ts
│       │   ├── ficha-reducer.ts
│       │   ├── use-ficha-calafrio.ts
│       │   ├── index.ts
│       │   └── __tests__/ficha-reducer.test.ts
└── apps/
    └── web/
        ├── package.json
        ├── tsconfig.json
        ├── next.config.ts
        ├── postcss.config.mjs
        ├── public/
        │   └── assets/calafrio/
        │       ├── 2e-V1_FichaPersonagem_Calafrio.pdf
        │       ├── 2e-V1HabilidadesParanormais_Calafrio.pdf
        │       └── 2e-V1FichaConsulta_Calafrio.pdf
        └── src/
            ├── app/
            │   ├── globals.css
            │   ├── layout.tsx
            │   ├── page.tsx
            │   ├── biblioteca/page.tsx
            │   ├── bestiario/page.tsx
            │   └── mesa/page.tsx
            └── components/
                ├── svg/calafrio-ornamentos.tsx
                ├── navegacao/barra-topo.tsx
                ├── ficha/
                │   ├── pagina-frente-ficha.tsx
                │   ├── pagina-verso-matriz.tsx
                │   ├── card-slot-matriz.tsx
                │   ├── painel-palavras-chave.tsx
                │   ├── painel-inventario.tsx
                │   ├── painel-ecos-e-regras.tsx
                │   ├── assistente-criacao-calafrio.tsx
                │   └── modal-rolagem-calafrio.tsx
                ├── biblioteca/visao-biblioteca.tsx
                ├── bestiario/visao-bestiario.tsx
                └── mesa/visao-mesa-combate.tsx
```

---

### Task 1: Scaffold do Monorepo `/Users/andrewozniack/Documents/Calafrio-master`, Docker/Dokploy e `@calafrio/tema`

**Files:**
- Create: `/Users/andrewozniack/Documents/Calafrio-master/package.json`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/pnpm-workspace.yaml`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/tsconfig.base.json`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/biome.json`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/Dockerfile`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/docker-compose.yml`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/.env.example`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/.gitignore`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/tema/package.json`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/tema/tsconfig.json`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/tema/src/tokens.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/tema/src/index.ts`
- Test: `/Users/andrewozniack/Documents/Calafrio-master/packages/tema/src/tokens.test.ts`

**Interfaces:**
- Produces:
  - `PersonalidadeCalafrio = "maneiro" | "caotico" | "esquisito" | "racional" | "agradavel"`
  - `DominioEmocional = "positivo" | "negativo"`
  - `TOKENS_PERSONALIDADE: Record<PersonalidadeCalafrio, { nome: string; emoji: string; corPositiva: string; corNegativa: string; corBorda: string }>`
  - `TOKENS_ESPECTRO_DANO: Record<"fisico" | "castanho" | "rubro" | "ceruleo" | "alvo" | "variavel", { rotulo: string; emoji: string; corHex: string }>`

- [ ] **Step 1: Write the failing test in `packages/tema/src/tokens.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { TOKENS_ESPECTRO_DANO, TOKENS_PERSONALIDADE } from "./tokens";

describe("@calafrio/tema tokens", () => {
  it("define exatamente as 5 personalidades com cores para domínio positivo e negativo", () => {
    expect(Object.keys(TOKENS_PERSONALIDADE)).toEqual([
      "maneiro",
      "caotico",
      "esquisito",
      "racional",
      "agradavel",
    ]);
    for (const token of Object.values(TOKENS_PERSONALIDADE)) {
      expect(token.corPositiva).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(token.corNegativa).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it("define os espectros de dano do Calafrio 2e", () => {
    expect(Object.keys(TOKENS_ESPECTRO_DANO)).toEqual([
      "fisico",
      "castanho",
      "rubro",
      "ceruleo",
      "alvo",
      "variavel",
    ]);
  });
});
```

- [ ] **Step 2: Create monorepo config files (`package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `Dockerfile`, `docker-compose.yml`) and install workspace dependencies**

Run: `cd /Users/andrewozniack/Documents/Calafrio-master && pnpm install`
Expected: `pnpm-lock.yaml` generated cleanly.

- [ ] **Step 3: Implement `packages/tema/src/tokens.ts` and `packages/tema/src/index.ts`**

Use exact colors from the spec (`#85A844`/`#435725` for Maneiro, `#D66863`/`#681D1A` for Caótico, `#B676B1`/`#48284A` for Esquisito, `#68A2B9`/`#1C446B` for Racional, `#E090B5`/`#9B1C4C` for Agradável).

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/andrewozniack/Documents/Calafrio-master && pnpm --filter @calafrio/tema test`
Expected: PASS (2 passed)

- [ ] **Step 5: Initialize git repo and commit**

```bash
cd /Users/andrewozniack/Documents/Calafrio-master
git init
git add .
git commit -m "chore: scaffold Calafrio-master monorepo and @calafrio/tema"
```

---

### Task 2: Catálogo Oficial Calafrio 2e em `@calafrio/core/catalogo`

**Files:**
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/package.json`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/tsconfig.json`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/catalogo/tipos.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/catalogo/habilidades-paranormais.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/catalogo/palavras-chave.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/catalogo/ocupacoes.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/catalogo/equipamentos.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/catalogo/bugigangas.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/catalogo/tabelas-suporte.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/catalogo/glossario.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/catalogo/index.ts`
- Test: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/catalogo/__tests__/catalogo.test.ts`

**Interfaces:**
- Produces:
  - `HabilidadeParanormalCatalogo` (`id`, `nome`, `personalidade`, `dominio`, `tipoAcao`, `tempoPreparacao?`, `custoPA`, `permiteCustoEmPV?`, `requerFoco`, `requerTabelaSuporte?`, `espectroDano?`, `descricao`)
  - `ArmaMundanaCatalogo`, `EntradaTabelaD100`, `FamiliarCatalogo`, `LacaioCatalogo`, `DjanhoCatalogo`, `TermoGlossario`
  - `carregarCatalogoCalafrio(): CatalogoCalafrio`

- [ ] **Step 1: Write the failing test in `packages/core/catalogo/__tests__/catalogo.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { carregarCatalogoCalafrio } from "../index";

describe("Catálogo Oficial Calafrio 2e", () => {
  const catalogo = carregarCatalogoCalafrio();

  it("contém todas as 60 habilidades paranormais (6 positivas e 6 negativas em cada uma das 5 árvores)", () => {
    expect(catalogo.habilidadesParanormais).toHaveLength(60);
    for (const p of ["maneiro", "caotico", "esquisito", "racional", "agradavel"] as const) {
      const daPersonalidade = catalogo.habilidadesParanormais.filter((h) => h.personalidade === p);
      expect(daPersonalidade).toHaveLength(12);
      expect(daPersonalidade.filter((h) => h.dominio === "positivo")).toHaveLength(6);
      expect(daPersonalidade.filter((h) => h.dominio === "negativo")).toHaveLength(6);
    }
  });

  it("marca Pirocinese como permiteCustoEmPV e mapeia tabelas de suporte (Familiares, Lacaios, Djanhos)", () => {
    const pirocinese = catalogo.habilidadesParanormais.find((h) => h.id === "pirocinese");
    expect(pirocinese?.permiteCustoEmPV).toBe(true);
    expect(catalogo.familiares).toHaveLength(6);
    expect(catalogo.lacaios).toHaveLength(6);
    expect(catalogo.djanhos).toHaveLength(6);
  });

  it("contém 100 palavras-chave genéricas, 100 ocupações, 100 bugigangas e 13 categorias de armas mundanas", () => {
    expect(catalogo.palavrasChaveGenericas).toHaveLength(100);
    expect(catalogo.ocupacoes).toHaveLength(100);
    expect(catalogo.bugigangas).toHaveLength(100);
    expect(catalogo.armasMundanas).toHaveLength(13);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/andrewozniack/Documents/Calafrio-master && pnpm --filter @calafrio/core test`
Expected: FAIL (module `../index` not found)

- [ ] **Step 3: Implement `packages/core/catalogo/*` with all data extracted from Notion and the 3 official PDFs**

Include all 60 skills across the 5 pages of `2e-V1HabilidadesParanormais_Calafrio.pdf`, the 3 `1d6` support tables from page 6, the 13 mundane weapons, the three `d100` tables from Notion, and the glossary from `2e-V1FichaConsulta_Calafrio.pdf`.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/andrewozniack/Documents/Calafrio-master && pnpm --filter @calafrio/core test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd /Users/andrewozniack/Documents/Calafrio-master
git add packages/core
git commit -m "feat(core): add complete Calafrio 2e official catalog"
```

---

### Task 3: Modelo e Motor Determinístico da Ficha (`@calafrio/core/ficha`) — Atributos, Matriz 3×3 e Efeitos Abertos

**Files:**
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/ficha/efeitos.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/ficha/modelo.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/ficha/matriz-alinhamento.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/ficha/montar-ficha.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/ficha/estado-jogo.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/ficha/index.ts`
- Test: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/ficha/__tests__/montar-ficha.test.ts`

**Interfaces:**
- Consumes: `CatalogoCalafrio`, `PersonalidadeCalafrio`, `DominioEmocional`, `EspectroDeDano`
- Produces:
  - `FichaCalafrio`, `EstadoDeJogoCalafrio`, `FichaDerivadaCalafrio`, `EfeitoCalafrio`, `ModificadorResolvido`, `AlinhamentoAtivo`
  - `montarFichaCalafrio(ficha: FichaCalafrio, catalogo: CatalogoCalafrio, estado?: EstadoDeJogoCalafrio): FichaDerivadaCalafrio`
  - `aplicarDanoCalafrio(ficha: FichaCalafrio, catalogo: CatalogoCalafrio, estado: EstadoDeJogoCalafrio, opcoes: { danoBruto: number; espectro: EspectroDeDano; paParaMitigar?: number }): EstadoDeJogoCalafrio`
  - `aplicarAtividadeHabilidade(ficha: FichaCalafrio, catalogo: CatalogoCalafrio, estado: EstadoDeJogoCalafrio, opcoes: { custo: number; recurso: "pa" | "pv" | "nenhum"; ativarFocoId?: string }): EstadoDeJogoCalafrio`
  - `aplicarDescansoCalafrio(ficha: FichaCalafrio, catalogo: CatalogoCalafrio, estado: EstadoDeJogoCalafrio, opcoes: { tipo: "curto" | "longo"; horas?: number; modo: "fixo" | "rolado"; valoresRolados?: number[] }): EstadoDeJogoCalafrio`

- [ ] **Step 1: Write the failing tests in `packages/core/ficha/__tests__/montar-ficha.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { carregarCatalogoCalafrio } from "../../catalogo";
import {
  aplicarAtividadeHabilidade,
  aplicarDanoCalafrio,
  aplicarDescansoCalafrio,
  criarEstadoDeJogoInicial,
  criarFichaCalafrioVazia,
  montarFichaCalafrio,
} from "../index";

describe("montarFichaCalafrio e Motor de Efeitos Abertos", () => {
  const catalogo = carregarCatalogoCalafrio();

  it("calcula atributos base por APT (PD=3*APT, PV=3+3*APT, PA=3+3*APT, VEL=6, Ecos=APT, Palavras=2+APT)", () => {
    const ficha = { ...criarFichaCalafrioVazia("f1", "Iara"), aptBase: 2 };
    const derivada = montarFichaCalafrio(ficha, catalogo);
    expect(derivada.apt).toBe(2);
    expect(derivada.pd).toBe(6);
    expect(derivada.pvMax).toBe(9);
    expect(derivada.paMax).toBe(9);
    expect(derivada.velocidade).toBe(6);
    expect(derivada.ecosMax).toBe(2);
    expect(derivada.limitePalavrasChave).toBe(4);
    expect(derivada.limiteHabilidadesMemorizadas).toBe(2);
  });

  it("calcula bônus de alinhamento na matriz 3x3 (horizontal +3 PA, vertical +3 PD, diagonal +6 PV, 2x2 +3 VEL) e suporta Habilidade Única com personalidade autorizada", () => {
    const ficha = {
      ...criarFichaCalafrioVazia("f2", "Brendo"),
      aptBase: 6,
      habilidadesUnicas: [
        {
          id: "unica-1",
          nome: "Guarda-Chuva Balístico",
          tipoAcao: "padrao" as const,
          custo: 3,
          recurso: "pa" as const,
          descricao: "Disparo oculto",
          personalidadeAlinhamento: "maneiro" as const,
          efeitos: [],
        },
      ],
      matrizHabilidades: [
        { slot: 0, tipo: "paranormal" as const, id: "ressonancia" }, // maneiro pos
        { slot: 1, tipo: "paranormal" as const, id: "conduite" }, // maneiro pos
        { slot: 2, tipo: "unica" as const, id: "unica-1" }, // maneiro via Eco
        { slot: 3, tipo: "paranormal" as const, id: "esconjuracao" }, // maneiro pos
        { slot: 4, tipo: "paranormal" as const, id: "configuracao-petrea" }, // maneiro pos
        { slot: 8, tipo: "paranormal" as const, id: "levitacao" }, // maneiro pos
      ],
    };
    const derivada = montarFichaCalafrio(ficha, catalogo);
    // Linha [0,1,2] -> +3 PA; Diagonal [0,4,8] -> +6 PV; Quad 2x2 [0,1,3,4] -> +3 VEL
    expect(derivada.paMax).toBe(3 + 3 * 6 + 3);
    expect(derivada.pvMax).toBe(3 + 3 * 6 + 6);
    expect(derivada.velocidade).toBe(6 + 3);
  });

  it("sinaliza conflito de Domínio Positivo + Negativo, exceto quando permitirDominioMisto está ativo", () => {
    const ficha = {
      ...criarFichaCalafrioVazia("f3", "Caio"),
      aptBase: 2,
      matrizHabilidades: [
        { slot: 0, tipo: "paranormal" as const, id: "ressonancia" }, // positivo
        { slot: 1, tipo: "paranormal" as const, id: "translocacao" }, // negativo
      ],
    };
    const semPermissao = montarFichaCalafrio(ficha, catalogo);
    expect(semPermissao.avisosDeRegra.some((a) => a.codigo === "DOMINIO_MISTO")).toBe(true);

    const comPermissao = montarFichaCalafrio(
      {
        ...ficha,
        efeitosCustomizados: [
          {
            id: "ef-1",
            rotulo: "Eco Dualidade",
            efeito: {
              tipo: "regraEspecial",
              regra: "permitirDominioMisto",
              descricao: "Liberado pelo MdJ",
            },
          },
        ],
      },
      catalogo,
    );
    expect(comPermissao.avisosDeRegra.some((a) => a.codigo === "DOMINIO_MISTO")).toBe(false);
  });

  it("permite que uma palavra-chave ou item conceda outra palavra-chave sem consumir o limite de 2 + APT", () => {
    const ficha = {
      ...criarFichaCalafrioVazia("f4", "Duda"),
      aptBase: 1, // limite = 3
      palavrasChave: [
        {
          id: "pc-1",
          nome: "Detetive do submundo",
          categoria: "ocupacao" as const,
          semConsumirLimite: false,
          efeitos: [
            {
              tipo: "concederPalavraChave" as const,
              nome: "Contatos no Submundo",
              semConsumirLimite: true,
            },
          ],
        },
        { id: "pc-2", nome: "Mãos-leves", categoria: "talento" as const, semConsumirLimite: false, efeitos: [] },
        { id: "pc-3", nome: "Paranóico(a)", categoria: "falha" as const, semConsumirLimite: false, efeitos: [] },
      ],
    };
    const derivada = montarFichaCalafrio(ficha, catalogo);
    expect(derivada.palavrasChaveOcupadas).toBe(3);
    expect(derivada.limitePalavrasChave).toBe(3);
    expect(derivada.palavrasChaveAtivas.map((p) => p.nome)).toContain("Contatos no Submundo");
  });

  it("suporta pvUnificadoComPa (Djanho Sexto Sentido), gasto em PV (Pirocinese), mitigação 1:1 com PA e descanso", () => {
    const ficha = {
      ...criarFichaCalafrioVazia("f5", "Djanho"),
      aptBase: 2, // PV=9, PA=9
      efeitosCustomizados: [
        {
          id: "djanho-6",
          rotulo: "Djanho: Sexto Sentido",
          efeito: {
            tipo: "regraEspecial" as const,
            regra: "pvUnificadoComPa" as const,
            descricao: "PV são considerados como PA",
          },
        },
      ],
    };
    let estado = criarEstadoDeJogoInicial();
    estado = aplicarAtividadeHabilidade(ficha, catalogo, estado, { custo: 2, recurso: "pa" });
    const derivada = montarFichaCalafrio(ficha, catalogo, estado);
    expect(derivada.pvAtual).toBe(7); // debitou do PV pois pvUnificadoComPa está ativo

    // Mitigação de dano e descanso
    const fichaNormal = { ...criarFichaCalafrioVazia("f6", "Normal"), aptBase: 2 };
    let estNormal = criarEstadoDeJogoInicial();
    estNormal = aplicarDanoCalafrio(fichaNormal, catalogo, estNormal, {
      danoBruto: 5,
      espectro: "rubro",
      paParaMitigar: 3,
    });
    const derDepoisDano = montarFichaCalafrio(fichaNormal, catalogo, estNormal);
    expect(derDepoisDano.paAtual).toBe(6); // 9 - 3
    expect(derDepoisDano.pvAtual).toBe(7); // 9 - (5 - 3)

    estNormal = aplicarDescansoCalafrio(fichaNormal, catalogo, estNormal, {
      tipo: "curto",
      horas: 1,
      modo: "fixo",
    });
    expect(montarFichaCalafrio(fichaNormal, catalogo, estNormal).paAtual).toBe(9);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/andrewozniack/Documents/Calafrio-master && pnpm --filter @calafrio/core test`
Expected: FAIL (module `../index` in `ficha` not found)

- [ ] **Step 3: Implement `packages/core/ficha/*` (`efeitos.ts`, `modelo.ts`, `matriz-alinhamento.ts`, `montar-ficha.ts`, `estado-jogo.ts`, `index.ts`)**

Ensure every modifier records provenance (`origem`) and `montarFichaCalafrio` is a pure function with zero side effects.

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/andrewozniack/Documents/Calafrio-master && pnpm --filter @calafrio/core test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd /Users/andrewozniack/Documents/Calafrio-master
git add packages/core
git commit -m "feat(core): implement Calafrio 2e sheet engine, 3x3 matrix and open effects"
```

---

### Task 4: Motor de Bestiário Plugável (`@calafrio/core/bestiario`) e Rolador de Dados (`@calafrio/core/rolagem`)

**Files:**
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/bestiario/motor-bestiario.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/bestiario/__tests__/motor-bestiario.test.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/rolagem/rolagem-calafrio.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/rolagem/__tests__/rolagem-calafrio.test.ts`
- Modify: `/Users/andrewozniack/Documents/Calafrio-master/packages/core/index.ts`

**Interfaces:**
- Produces:
  - `CriaturaCalafrio`, `MotorBestiario`, `motorBestiarioUnificado`
  - `calcularDanoContraCriatura(criatura: CriaturaCalafrio, danoBruto: number, espectro: EspectroDeDano): number`
  - `rolarTesteAcao(opcoes: { apt: number; bonusExtra?: number; modo: "normal" | "vantagem" | "desvantagem"; dificuldade: number; dadosInjetados?: [number, number?] }): ResultadoTesteAcao`
  - `rolarContestacao(opcoes: { aptAtacante: number; bonusAtacante?: number; modoAtacante: "normal" | "vantagem" | "desvantagem"; aptVitima: number; pdVitima: number; bonusVitima?: number; modoVitima: "normal" | "vantagem" | "desvantagem"; dadosAtacante?: [number, number?]; dadosVitima?: [number, number?] }): ResultadoContestacao`

- [ ] **Step 1: Write the failing tests in `motor-bestiario.test.ts` and `rolagem-calafrio.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { calcularDanoContraCriatura, motorBestiarioUnificado } from "../motor-bestiario";
import { rolarContestacao, rolarTesteAcao } from "../../rolagem/rolagem-calafrio";

describe("MotorBestiario e Rolagens Calafrio", () => {
  it("gera estatísticas base por APT e aplica resistências (metade floor), vulnerabilidades (dobro) e imunidades (0)", () => {
    const base = motorBestiarioUnificado.gerarPadraoPorApt(3);
    expect(base.pd).toBe(9);
    expect(base.pvMax).toBe(12);
    const criatura = {
      ...base,
      id: "c1",
      nome: "Esqueletético",
      resistencias: { rubro: "resistente" as const, ceruleo: "vulneravel" as const, fisico: "imune" as const },
    };
    expect(calcularDanoContraCriatura(criatura, 5, "rubro")).toBe(2);
    expect(calcularDanoContraCriatura(criatura, 5, "ceruleo")).toBe(10);
    expect(calcularDanoContraCriatura(criatura, 5, "fisico")).toBe(0);
  });

  it("respeita o piso de PD da vítima em contestações hostis, além de 20 crítico e 1 falha crítica", () => {
    // Atacante tira 10 (8 + 2 APT), vítima tira 3 no dado (3 + 4 APT = 7), mas tem 12 PD -> piso 12 garante vitória da vítima
    const res = rolarContestacao({
      aptAtacante: 2,
      modoAtacante: "normal",
      aptVitima: 4,
      pdVitima: 12,
      modoVitima: "normal",
      dadosAtacante: [8],
      dadosVitima: [3],
    });
    expect(res.totalEfetivoVitima).toBe(12);
    expect(res.vencedor).toBe("vitima");

    // Atacante tira 20 natural -> sucesso crítico automático
    const crit = rolarContestacao({
      aptAtacante: 1,
      modoAtacante: "normal",
      aptVitima: 6,
      pdVitima: 18,
      modoVitima: "normal",
      dadosAtacante: [20],
      dadosVitima: [15],
    });
    expect(crit.vencedor).toBe("atacante");
    expect(crit.criticoAtacante).toBe("sucesso_critico");
  });

  it("avalia testes de ação com vantagem e desvantagem contra a tabela de dificuldades (10, 13, 15, 17, 20)", () => {
    const vant = rolarTesteAcao({
      apt: 3,
      modo: "vantagem",
      dificuldade: 15,
      dadosInjetados: [4, 13],
    });
    expect(vant.dadoEscolhido).toBe(13);
    expect(vant.total).toBe(16);
    expect(vant.sucesso).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/andrewozniack/Documents/Calafrio-master && pnpm --filter @calafrio/core test`
Expected: FAIL

- [ ] **Step 3: Implement `motor-bestiario.ts`, `rolagem-calafrio.ts` and export everything from `packages/core/index.ts`**

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd /Users/andrewozniack/Documents/Calafrio-master && pnpm --filter @calafrio/core test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd /Users/andrewozniack/Documents/Calafrio-master
git add packages/core
git commit -m "feat(core): add pluggable bestiary engine and Calafrio dice/contest resolver"
```

---

### Task 5: Controladores de Estado e Reducers (`@calafrio/ficha-app`)

**Files:**
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/ficha-app/package.json`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/ficha-app/tsconfig.json`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/ficha-app/src/ficha-inicial.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/ficha-app/src/ficha-reducer.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/ficha-app/src/use-ficha-calafrio.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/packages/ficha-app/src/index.ts`
- Test: `/Users/andrewozniack/Documents/Calafrio-master/packages/ficha-app/src/__tests__/ficha-reducer.test.ts`

**Interfaces:**
- Consumes: `@calafrio/core`
- Produces:
  - `AcaoFichaCalafrio` (discriminated union for all sheet edits: `definirNome`, `definirApt`, `adicionarPalavraChave`, `removerPalavraChave`, `adicionarEfeitoEmPalavraChave`, `alocarSlotMatriz`, `limparSlotMatriz`, `adicionarHabilidadeUnica`, `removerHabilidadeUnica`, `adicionarCustomizacaoEco`, `definirCarteira`, `adicionarItem`, `atualizarItem`, `removerItem`, `adicionarEfeitoCustomizado`, `removerEfeitoCustomizado`, `definirAnotacoes`, `carregarFicha`)
  - `fichaCalafrioReducer(state: FichaCalafrio, action: AcaoFichaCalafrio): FichaCalafrio`
  - `useFichaCalafrio(): ControladorFichaCalafrio`

- [ ] **Step 1: Write the failing test in `packages/ficha-app/src/__tests__/ficha-reducer.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { criarFichaCalafrioVazia } from "@calafrio/core";
import { fichaCalafrioReducer } from "../ficha-reducer";

describe("fichaCalafrioReducer", () => {
  it("atualiza APT, aloca habilidades na matriz 3x3 substituindo ocupante anterior do mesmo slot e gerencia palavras-chave com efeitos", () => {
    let ficha = criarFichaCalafrioVazia("f1", "Helena");
    ficha = fichaCalafrioReducer(ficha, { tipo: "definirApt", apt: 3 });
    expect(ficha.aptBase).toBe(3);

    ficha = fichaCalafrioReducer(ficha, {
      tipo: "alocarSlotMatriz",
      slot: 4,
      alocacao: { slot: 4, tipo: "paranormal", id: "telepatia" },
    });
    expect(ficha.matrizHabilidades).toEqual([{ slot: 4, tipo: "paranormal", id: "telepatia" }]);

    ficha = fichaCalafrioReducer(ficha, {
      tipo: "adicionarPalavraChave",
      palavra: {
        id: "pc-1",
        nome: "Paramédico(a)",
        categoria: "ocupacao",
        semConsumirLimite: false,
        efeitos: [
          { tipo: "concederPalavraChave", nome: "Primeiros Socorros", semConsumirLimite: true },
        ],
      },
    });
    expect(ficha.palavrasChave).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/andrewozniack/Documents/Calafrio-master && pnpm --filter @calafrio/ficha-app test`
Expected: FAIL

- [ ] **Step 3: Implement `ficha-inicial.ts`, `ficha-reducer.ts`, `use-ficha-calafrio.ts` (with `localStorage` persistence + preset characters) and `index.ts`**

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /Users/andrewozniack/Documents/Calafrio-master && pnpm --filter @calafrio/ficha-app test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd /Users/andrewozniack/Documents/Calafrio-master
git add packages/ficha-app
git commit -m "feat(ficha-app): add Calafrio sheet reducer and state hook"
```

---

### Task 6: Aplicação Web `@calafrio/web` — Ficha Viva de 2 Páginas, Assistente de Criação e Rolador

**Files:**
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/package.json`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/tsconfig.json`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/next.config.ts`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/postcss.config.mjs`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/src/app/globals.css`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/src/app/layout.tsx`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/src/app/page.tsx`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/src/components/svg/calafrio-ornamentos.tsx`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/src/components/navegacao/barra-topo.tsx`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/src/components/ficha/pagina-frente-ficha.tsx`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/src/components/ficha/pagina-verso-matriz.tsx`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/src/components/ficha/card-slot-matriz.tsx`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/src/components/ficha/painel-palavras-chave.tsx`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/src/components/ficha/painel-inventario.tsx`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/src/components/ficha/painel-ecos-e-regras.tsx`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/src/components/ficha/assistente-criacao-calafrio.tsx`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/src/components/ficha/modal-rolagem-calafrio.tsx`

**Interfaces:**
- Consumes: `@calafrio/core`, `@calafrio/ficha-app`, `@calafrio/tema`
- Produces:
  - Rota principal `/` renderizando a Ficha Viva de 2 páginas (Frente: Atributos, Carteira, Palavras-chave, Inventário/Parartefatos; Verso: Matriz 3×3 `#1`–`#9` com indicadores de alinhamento `+3 PA`, `+3 PD`, `+6 PV`, `+3 VEL`, Ecos/Habilidades Únicas, Companheiros/Djanhos, Anotações e Auditoria), Assistente de Criação/Evolução e Modal de Rolagem/Contestação/Descanso.

- [ ] **Step 1: Create Next.js app configuration and theme styles (`globals.css` with chamfered black labels `.calafrio-tag`, diamond ornaments `◇`, and the 5 personality palettes)**

- [ ] **Step 2: Implement SVG ornaments (`calafrio-ornamentos.tsx`), top navigation (`barra-topo.tsx`), and the modular sheet components (`pagina-frente-ficha.tsx`, `pagina-verso-matriz.tsx`, `card-slot-matriz.tsx`, `painel-palavras-chave.tsx`, `painel-inventario.tsx`, `painel-ecos-e-regras.tsx`, `assistente-criacao-calafrio.tsx`, `modal-rolagem-calafrio.tsx`)**

Keep every component under 300 lines with zero business logic inside JSX (all calculations come from `f.derivada` and `@calafrio/core`).

- [ ] **Step 3: Verify TypeScript compilation of `@calafrio/web`**

Run: `cd /Users/andrewozniack/Documents/Calafrio-master && pnpm --filter @calafrio/web type-check`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/andrewozniack/Documents/Calafrio-master
git add apps/web
git commit -m "feat(web): build 2-page Calafrio Live Sheet, 3x3 matrix UI and Creation Wizard"
```

---

### Task 7: Biblioteca de Consulta Interativa e Leitor dos PDFs Oficiais (`/biblioteca`)

**Files:**
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/src/components/biblioteca/visao-biblioteca.tsx`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/src/app/biblioteca/page.tsx`

**Interfaces:**
- Consumes: `carregarCatalogoCalafrio()` from `@calafrio/core`, `/assets/calafrio/*.pdf`
- Produces:
  - Rota `/biblioteca` com abas para: (1) 60 Habilidades Paranormais filtráveis por personalidade/domínio/ação/foco; (2) Tabelas `d100` (Ocupações, Palavras-chave, Bugigangas) com sorteador instantâneo; (3) Arsenal & Tabelas de Suporte `1d6` (Familiares, Lacaios, Djanhos); (4) Glossário & Consulta Rápida; (5) Leitor integrado dos 3 PDFs oficiais (`2e-V1_FichaPersonagem_Calafrio.pdf`, `2e-V1HabilidadesParanormais_Calafrio.pdf`, `2e-V1FichaConsulta_Calafrio.pdf`).

- [ ] **Step 1: Implement `visao-biblioteca.tsx` and `/biblioteca/page.tsx`**

- [ ] **Step 2: Verify type-check**

Run: `cd /Users/andrewozniack/Documents/Calafrio-master && pnpm --filter @calafrio/web type-check`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
cd /Users/andrewozniack/Documents/Calafrio-master
git add apps/web/src/app/biblioteca apps/web/src/components/biblioteca
git commit -m "feat(web): add interactive Calafrio library and official PDF reader"
```

---

### Task 8: Criador de Monstros/NPCs (`/bestiario`) e Mesa/Combate em Tempo Real (`/mesa`)

**Files:**
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/src/components/bestiario/visao-bestiario.tsx`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/src/app/bestiario/page.tsx`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/src/components/mesa/visao-mesa-combate.tsx`
- Create: `/Users/andrewozniack/Documents/Calafrio-master/apps/web/src/app/mesa/page.tsx`

**Interfaces:**
- Consumes: `motorBestiarioUnificado`, `calcularDanoContraCriatura`, `rolarContestacao`, `rolarTesteAcao` from `@calafrio/core`
- Produces:
  - Rota `/bestiario`: criador de ameaças, NPCs, Familiares e Lacaios com geração sugerida por `APT`, edição livre de `PV`, `PD`, `PA`, `Velocidade`, resistências/vulnerabilidades aos espectros (*Físico, Castanho, Rubro, Cerúleo, Alvo*) e ações customizadas.
  - Rota `/mesa`: mesa de combate em roda (ordem em sentido horário à direita), controle de rodada (`6 segundos`), rastreador de ações do turno (`2 Padrão`, `1 Livre`, `1 Reflexo`, `Foco`), resolvedor de Contestações com piso de `PD`, aplicação de dano por espectro com mitigação em `PA` e contador de inconsciência (`0 PV` — 1 minuto reduzido pela metade a cada queda).

- [ ] **Step 1: Implement `visao-bestiario.tsx`, `/bestiario/page.tsx`, `visao-mesa-combate.tsx`, and `/mesa/page.tsx`**

- [ ] **Step 2: Run full workspace tests, type-check, and production build**

Run: `cd /Users/andrewozniack/Documents/Calafrio-master && pnpm test && pnpm type-check && pnpm build`
Expected: All unit tests PASS, `tsc --noEmit` PASS, Next.js production build succeeds.

- [ ] **Step 3: Commit**

```bash
cd /Users/andrewozniack/Documents/Calafrio-master
git add apps/web/src/app/bestiario apps/web/src/components/bestiario apps/web/src/app/mesa apps/web/src/components/mesa
git commit -m "feat(web): add pluggable Bestiary creator and Calafrio Combat Tracker"
```
