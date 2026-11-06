# Suporte a Calafrio 1ª Edição com Seletor por Mesa — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> Revisão 2 (2026-11-05): corrigido contra as fontes do jogo (Ficha V3, PDF V8, Notion) e contra o código atual.

**Goal:** Suportar a 1ª Edição de Calafrio (Corpo/Mente/Alma, PM, Graus 0–III com grafo de requisitos, Ecos) ao lado da 2ª, escolhida na criação da mesa.

**Architecture:** `mesas.sistemaVersao` é a fonte da verdade. `@calafrio/core` ganha `edicao.ts` (tipos compartilhados) e `v1/` (modelo, catálogo, regras, cálculo). `@calafrio/ficha-app` ganha reducer e hook 1e. `apps/web` ramifica só nas bordas: persistência, actions e containers de página.

**Tech Stack:** TypeScript, Next.js 16, Tailwind v4, Drizzle/Postgres + store JSON, Vitest (ambiente node).

**Spec:** [`docs/superpowers/specs/2026-11-05-suporte-calafrio-1e-design.md`](../specs/2026-11-05-suporte-calafrio-1e-design.md)

## Global Constraints
- Zero quebra na 2e: nenhum arquivo do motor 2e muda de comportamento.
- Importar 1e sempre de `@calafrio/core` (barrel raiz). `@calafrio/core/v1` **não resolve** (`exports: "./*": "./*.ts"`).
- Sem testes `.tsx` (não há testing-library/jsdom e o tsconfig usa `jsx: preserve`). Lógica de UI vai para helpers `.ts` com teste; componentes ficam finos e são verificados no navegador (Task 11).
- Testes de serviço/action **nunca** tocam no `data/calafrio-store.json` real nem no Postgres: copiar o padrão de mocks de `apps/web/src/services/__tests__/armazenamento-convite.test.ts` (`vi.mock("@/db", () => ({ db: null, schema: {} }))` + store em memória).
- Arquivos `.ts/.tsx` ≤ 400 linhas (`pnpm lint`). `armazenamento-calafrio.ts` já tem 371: extrair helpers em vez de crescer.
- Fontes de regra para transcrição: `~/Library/Mobile Documents/com~apple~CloudDocs/RPG/RPG - Root/V8_HabilidadesParanormais_Calafrio.pdf` e `FichaPersonagem[V3].pdf`. Extrair texto com `pdftotext`.

## Review Focus
1. Mesa sem versão (ou JSON antigo) → `"2e"`; valor inválido no form → `"2e"`.
2. Pontos de atributo = 3 + Nível, cada um ≥ 1; fórmulas da §5.2 da spec para níveis 1–10.
3. Grafo de requisitos por **ligação** (não por árvore), Grau 0 derivado, esquecimento em cascata.
4. PM gasto ≤ Mente×6, EP gastos ≤ Nível, ≤ 2 aprimoramentos, palavras-chave ≤ 2 + Nível.
5. Ficha de edição diferente da mesa é recusada no servidor; convite em mesa 1e cria rascunho 1e.
6. Telas existentes da mesa não quebram com players 1e.

---

### Task 1: Tipos de edição compartilhados (`packages/core/edicao.ts`)

**Files:**
- Create: `packages/core/edicao.ts`
- Modify: `packages/core/index.ts`
- Test: `packages/core/__tests__/edicao.test.ts`

Esta task cria só `SistemaVersao` e `normalizarSistemaVersao`. `FichaPersonagem`/`ehFichaV1` entram na Task 3, quando `FichaCalafrioV1` existir.

- [ ] **Step 1: Teste falhando**

```ts
import { describe, expect, it } from "vitest";
import { normalizarSistemaVersao } from "../edicao";

describe("normalizarSistemaVersao", () => {
  it("aceita 1e e 2e", () => {
    expect(normalizarSistemaVersao("1e")).toBe("1e");
    expect(normalizarSistemaVersao("2e")).toBe("2e");
  });
  it("qualquer outro valor vira 2e", () => {
    for (const v of [undefined, null, "", "3e", 1, "1E"]) {
      expect(normalizarSistemaVersao(v)).toBe("2e");
    }
  });
});
```

- [ ] **Step 2:** `pnpm --filter @calafrio/core test edicao` → FAIL (módulo não existe).

- [ ] **Step 3: Implementar**

```ts
// packages/core/edicao.ts
export type SistemaVersao = "1e" | "2e";
export const SISTEMA_VERSAO_PADRAO: SistemaVersao = "2e";

export function normalizarSistemaVersao(valor: unknown): SistemaVersao {
  return valor === "1e" || valor === "2e" ? valor : SISTEMA_VERSAO_PADRAO;
}
```
Em `packages/core/index.ts`: `export * from "./edicao";`.

- [ ] **Step 4:** teste → PASS. **Step 5:** commit `feat(core): add SistemaVersao type and normalizer`.

---

### Task 2: Modelo e catálogo 1e com grafo (`packages/core/v1/`)

**Files:**
- Create: `packages/core/v1/modelo-v1.ts`, `packages/core/v1/index.ts`, `packages/core/v1/catalogo/montar-arvore.ts`, `maneiras.ts`, `caoticas.ts`, `esquisitas.ts`, `agradaveis.ts`, `racionais.ts`, `index.ts`
- Modify: `packages/core/index.ts`
- Test: `packages/core/v1/catalogo/__tests__/catalogo-v1.test.ts`

Um arquivo por árvore para respeitar o limite de 400 linhas.

- [ ] **Step 0: Modelo** (`modelo-v1.ts`, só tipos e constantes; `v1/index.ts` reexporta), conforme spec §5.5, mais:

```ts
export type CustoPAV1 = number | "passivo";
export type MarcadorV1 = "cadeado" | "interrogacao";
export interface HabilidadeCatalogoV1 {
  id: string; nome: string; arvore: ArvoreV1; grau: GrauV1;
  custoPA: CustoPAV1; requisitos: string[]; descricao: string;
  marcadores: MarcadorV1[]; permitePmExtra?: boolean;
}
export const CUSTO_PM_POR_GRAU: Record<GrauV1, number> = { 0: 0, 1: 3, 2: 6, 3: 12 };
export const MAX_APRIMORAMENTOS_V1 = 2;
export const CUSTO_PA_HABILIDADE_UNICA_V1 = 3;
export const NIVEL_MIN_V1 = 1;
export const NIVEL_MAX_V1 = 10;

export type CodigoAvisoV1 =
  | "NIVEL_INVALIDO" | "PONTOS_ATRIBUTO_PENDENTES" | "PONTOS_ATRIBUTO_INVALIDOS"
  | "LIMITE_PM_EXCEDIDO" | "LIMITE_ECOS_EXCEDIDO" | "APRIMORAMENTOS_EXCEDIDOS"
  | "REQUISITO_NAO_ATENDIDO" | "HABILIDADE_DESCONHECIDA" | "GRAU_ZERO_EXPLICITO"
  | "PM_EXTRA_INVALIDO" | "PALAVRAS_CHAVE_EXCEDIDAS";
export interface AvisoV1 { codigo: CodigoAvisoV1; mensagem: string; alvoId?: string }

export interface FichaDerivadaV1 {
  pd: number; pmMax: number; paMax: number; pvMax: number; ba: number;
  velocidade: number; ecosMax: number; limitePalavrasChave: number;
  pmGasto: number; pmRestante: number; ecosGastos: number;
  pontosAtributoEsperados: number;
  habilidadesValidas: string[]; grauZeroMemorizados: string[];
  avisos: AvisoV1[];
}
```
`PONTOS_ATRIBUTO_PENDENTES` = soma < 3 + Nível (ficha em construção). `PONTOS_ATRIBUTO_INVALIDOS` = soma > 3 + Nível ou algum atributo < 1 ou não inteiro.

- [ ] **Step 1: Testes falhando**

```ts
import { describe, expect, it } from "vitest";
import { HABILIDADES_1E, listarHabilidadesPorArvore1e, obterHabilidade1e } from "..";

const ARVORES = ["maneiras", "caoticas", "esquisitas", "agradaveis", "racionais"] as const;

describe("Catálogo 1e", () => {
  it("60 habilidades, 12 por árvore (1/4/5/2), ids únicos", () => {
    expect(HABILIDADES_1E).toHaveLength(60);
    expect(new Set(HABILIDADES_1E.map((h) => h.id)).size).toBe(60);
    for (const a of ARVORES) {
      const g = listarHabilidadesPorArvore1e(a).map((h) => h.grau);
      expect([0, 1, 2, 3].map((x) => g.filter((y) => y === x).length)).toEqual([1, 4, 5, 2]);
    }
  });

  it("requisitos apontam para grau imediatamente anterior da mesma árvore", () => {
    for (const h of HABILIDADES_1E) {
      for (const r of h.requisitos) {
        const req = obterHabilidade1e(r);
        expect(req?.arvore).toBe(h.arvore);
        expect(req?.grau).toBe(h.grau - 1);
      }
      if (h.grau <= 1) expect(h.requisitos).toEqual([]);
    }
  });

  it("grafo de Maneiras exatamente como o PDF V8", () => {
    const req = (id: string) => obterHabilidade1e(id)?.requisitos;
    expect(req("levitacao")).toEqual(["impeto"]);
    expect(req("manifestacao-castanha")).toEqual(["impeto", "ectobalistica"]);
    expect(req("ressonancia")).toEqual(["ectobalistica", "campo-de-forca"]);
    expect(req("fluxo-anti-animatico")).toEqual(["campo-de-forca", "telecinese"]);
    expect(req("absorcao-eterea")).toEqual(["telecinese"]);
    expect(req("modo-divino")).toEqual(["levitacao", "manifestacao-castanha"]);
    expect(req("conduite")).toEqual(["ressonancia", "fluxo-anti-animatico"]);
  });

  it("custos e marcadores de amostra", () => {
    expect(obterHabilidade1e("impeto")).toMatchObject({ arvore: "maneiras", grau: 1, custoPA: 2 });
    expect(obterHabilidade1e("arsenal-psionico")).toMatchObject({ grau: 0, custoPA: 2 });
    expect(obterHabilidade1e("conduite")?.custoPA).toBe("passivo");
    expect(obterHabilidade1e("inscricao")?.custoPA).toBe(0);
    expect(obterHabilidade1e("imolacao")?.custoPA).toBe(6);
    expect(obterHabilidade1e("perdicao")?.custoPA).toBe(12);
    expect(obterHabilidade1e("manifestacao-castanha")?.marcadores).toEqual(["cadeado", "interrogacao"]);
    expect(obterHabilidade1e("familiar")).toMatchObject({ custoPA: "passivo", permitePmExtra: true });
    expect(HABILIDADES_1E.filter((h) => h.permitePmExtra).map((h) => h.id)).toEqual(["familiar"]);
  });

  it("toda habilidade tem descrição", () => {
    for (const h of HABILIDADES_1E) expect(h.descricao.trim().length).toBeGreaterThan(20);
  });
});
```

- [ ] **Step 2:** `pnpm --filter @calafrio/core test catalogo-v1` → FAIL.

- [ ] **Step 3: Implementar o montador** (o grafo fica num lugar só):

```ts
// montar-arvore.ts
export interface CartaV1 {
  id: string; nome: string; custoPA: CustoPAV1; descricao: string;
  marcadores?: MarcadorV1[]; permitePmExtra?: boolean;
}
export interface CartasArvoreV1 {
  grauZero: CartaV1;
  grauI: [CartaV1, CartaV1, CartaV1, CartaV1];
  grauII: [CartaV1, CartaV1, CartaV1, CartaV1, CartaV1];
  grauIII: [CartaV1, CartaV1];
}
// Posições de cima para baixo no PDF V8 (linhas tracejadas).
const II_REQUER_I = [[0], [0, 1], [1, 2], [2, 3], [3]] as const;
const III_REQUER_II = [[0, 1], [2, 3]] as const;

export function montarArvoreV1(arvore: ArvoreV1, c: CartasArvoreV1): HabilidadeCatalogoV1[] {
  const h = (x: CartaV1, grau: GrauV1, requisitos: string[]): HabilidadeCatalogoV1 => ({
    ...x, arvore, grau, requisitos, marcadores: x.marcadores ?? [],
  });
  return [
    h(c.grauZero, 0, []),
    ...c.grauI.map((x) => h(x, 1, [])),
    ...c.grauII.map((x, k) => h(x, 2, II_REQUER_I[k].map((i) => c.grauI[i].id))),
    ...c.grauIII.map((x, k) => h(x, 3, III_REQUER_II[k].map((i) => c.grauII[i].id))),
  ];
}
```

- [ ] **Step 4: Transcrever as 5 árvores** na **ordem e com os custos/marcadores da tabela da spec §5.3**. Ids em kebab-case sem acento (`ruido-amplificacao`, `metabolismo-de-dianho`, …). Descrições: `pdftotext -layout` do PDF V8, conferindo carta a carta com a imagem (`pdftoppm -r 110 -png`), porque o texto extraído sai fora de ordem. *Manifestação rubra*: copiar como está + `// TODO(fonte): descrição no V8 é cópia de Manifestação castanha`.

- [ ] **Step 5:** `index.ts` exporta `HABILIDADES_1E`, `obterHabilidade1e(id)` (via `Map`) e `listarHabilidadesPorArvore1e(arvore)`; `v1/index.ts` reexporta.
- [ ] **Step 6:** testes → PASS. **Step 7:** `packages/core/index.ts`: `export * from "./v1";`. Commit `feat(core): add 1e model and ability catalog with prerequisite graph`.

---

### Task 3: Regras e cálculo 1e (`packages/core/v1/`)

**Files:**
- Create: `packages/core/v1/regras-v1.ts`, `packages/core/v1/calculo-v1.ts`, `packages/core/v1/ficha-vazia-v1.ts`
- Modify: `packages/core/edicao.ts` (adicionar `FichaPersonagem`, `ehFichaV1`, `edicaoDaFicha`)
- Test: `packages/core/v1/__tests__/calculo-v1.test.ts`, `packages/core/v1/__tests__/regras-v1.test.ts`

**Depende de:** Task 2 (modelo e catálogo).

- [ ] **Step 1: Testes falhando** (`calculo-v1.test.ts`)

```ts
import { describe, expect, it } from "vitest";
import { calcularFichaV1 } from "../calculo-v1";
import { criarFichaV1Vazia } from "../ficha-vazia-v1";
import type { FichaCalafrioV1 } from "../modelo-v1";

const base = (over: Partial<FichaCalafrioV1> = {}): FichaCalafrioV1 => ({
  ...criarFichaV1Vazia("t", "Teste"),
  atributos: { corpo: 2, mente: 1, alma: 1 },
  ...over,
});
const codigos = (f: FichaCalafrioV1) => calcularFichaV1(f).avisos.map((a) => a.codigo);

describe("calcularFichaV1 — derivados", () => {
  it("nível 1, 2/1/1", () => {
    const d = calcularFichaV1(base());
    expect(d).toMatchObject({
      pd: 9, pmMax: 6, paMax: 9, pvMax: 6, ba: 1, velocidade: 6,
      ecosMax: 1, limitePalavrasChave: 3, pontosAtributoEsperados: 4,
    });
    expect(d.avisos).toEqual([]);
  });

  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])("nível %i", (nivel) => {
    const d = calcularFichaV1(base({ nivel, atributos: { corpo: nivel, mente: 2, alma: 2 } }));
    expect(d.pvMax).toBe(nivel * 6);
    expect(d.ba).toBe(nivel);
    expect(d.ecosMax).toBe(nivel);
    expect(d.limitePalavrasChave).toBe(2 + nivel);
    expect(d.pd).toBe(3 + nivel * 3);
    expect(d.pontosAtributoEsperados).toBe(3 + nivel);
  });

  it("atributos: pendente, excedido, < 1, nível inválido", () => {
    expect(codigos(base({ atributos: { corpo: 1, mente: 1, alma: 1 } }))).toContain("PONTOS_ATRIBUTO_PENDENTES");
    expect(codigos(base({ atributos: { corpo: 3, mente: 1, alma: 1 } }))).toContain("PONTOS_ATRIBUTO_INVALIDOS");
    expect(codigos(base({ atributos: { corpo: 4, mente: 0, alma: 0 } }))).toContain("PONTOS_ATRIBUTO_INVALIDOS");
    expect(codigos(base({ nivel: 11 }))).toContain("NIVEL_INVALIDO");
    expect(codigos(base({ nivel: 0 }))).toContain("NIVEL_INVALIDO");
  });
});

describe("calcularFichaV1 — PM", () => {
  it("soma custo por grau e acusa estouro", () => {
    const d = calcularFichaV1(base({
      habilidades: [
        { id: "impeto", aprimoramentos: [] },     // I = 3
        { id: "levitacao", aprimoramentos: [] },  // II = 6
      ],
    }));
    expect(d.pmGasto).toBe(9);
    expect(d.pmRestante).toBe(-3);
    expect(d.avisos.map((a) => a.codigo)).toContain("LIMITE_PM_EXCEDIDO");
  });

  it("Grau 0 é derivado, grátis e não pode ser gravado", () => {
    const d = calcularFichaV1(base({ habilidades: [{ id: "impeto", aprimoramentos: [] }] }));
    expect(d.grauZeroMemorizados).toEqual(["arsenal-psionico"]);
    expect(d.pmGasto).toBe(3);
    expect(codigos(base({ habilidades: [{ id: "arsenal-psionico", aprimoramentos: [] }] })))
      .toContain("GRAU_ZERO_EXPLICITO");
  });

  it("PM extra só no Familiar, múltiplo de 3", () => {
    const f = (pmExtra: number, id = "familiar") =>
      base({ atributos: { corpo: 1, mente: 2, alma: 1 }, habilidades: [{ id, aprimoramentos: [], pmExtra }] });
    expect(calcularFichaV1(f(6)).pmGasto).toBe(9);
    expect(codigos(f(6))).not.toContain("PM_EXTRA_INVALIDO");
    expect(codigos(f(4))).toContain("PM_EXTRA_INVALIDO");
    expect(codigos(f(3, "impeto"))).toContain("PM_EXTRA_INVALIDO");
  });

  it("habilidade desconhecida avisa e não soma", () => {
    const d = calcularFichaV1(base({ habilidades: [{ id: "nao-existe", aprimoramentos: [] }] }));
    expect(d.pmGasto).toBe(0);
    expect(d.avisos.map((a) => a.codigo)).toContain("HABILIDADE_DESCONHECIDA");
  });
});

describe("calcularFichaV1 — Ecos e palavras-chave", () => {
  const apr = (n: number) => Array.from({ length: n }, (_, i) => ({ id: `a${i}`, descricao: "x" }));

  it("conta aprimoramentos e únicas (1 + aprimoramentos)", () => {
    const d = calcularFichaV1(base({
      nivel: 3, atributos: { corpo: 2, mente: 2, alma: 2 },
      habilidades: [{ id: "impeto", aprimoramentos: apr(1) }],
      habilidadesUnicas: [{ id: "u1", nome: "U", descricao: "", passiva: false, aprimoramentos: apr(1) }],
    }));
    expect(d.ecosGastos).toBe(3);
    expect(d.avisos).toEqual([]);
  });

  it("acusa EP acima do nível e mais de 2 aprimoramentos", () => {
    const f = base({ habilidades: [{ id: "impeto", aprimoramentos: apr(3) }] });
    expect(codigos(f)).toEqual(expect.arrayContaining(["LIMITE_ECOS_EXCEDIDO", "APRIMORAMENTOS_EXCEDIDOS"]));
  });

  it("palavras-chave ≤ 2 + nível", () => {
    const pcs = Array.from({ length: 4 }, (_, i) => ({ id: `p${i}`, nome: `P${i}`, categoria: "livre" as const }));
    expect(codigos(base({ palavrasChave: pcs }))).toContain("PALAVRAS_CHAVE_EXCEDIDAS");
  });
});
```

`regras-v1.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { criarFichaV1Vazia } from "../ficha-vazia-v1";
import type { FichaCalafrioV1 } from "../modelo-v1";
import { esquecerHabilidadeV1, habilidadesValidasV1, podeMemorizarV1 } from "../regras-v1";

const comHabs = (ids: string[], mente = 5): FichaCalafrioV1 => ({
  ...criarFichaV1Vazia("t", "T"),
  nivel: 7, atributos: { corpo: 3, mente, alma: 10 - mente },
  habilidades: ids.map((id) => ({ id, aprimoramentos: [] })),
});
const ids = (f: FichaCalafrioV1) => f.habilidades.map((h) => h.id).sort();

describe("requisitos por ligação", () => {
  it("Grau II exige um Grau I ligado (Levitação ← Ímpeto)", () => {
    expect(habilidadesValidasV1(comHabs(["levitacao"]).habilidades)).not.toContain("levitacao");
    expect(habilidadesValidasV1(comHabs(["impeto", "levitacao"]).habilidades)).toContain("levitacao");
    // Telecinese (I₄) não liga em Levitação (II₁)
    expect(habilidadesValidasV1(comHabs(["telecinese", "levitacao"]).habilidades)).not.toContain("levitacao");
  });

  it("Grau III exige um Grau II ligado e válido (Modo divino ← Levitação/Manifestação castanha)", () => {
    expect(habilidadesValidasV1(comHabs(["levitacao", "modo-divino"]).habilidades)).toEqual([]);
    expect(habilidadesValidasV1(comHabs(["impeto", "levitacao", "modo-divino"]).habilidades)).toContain("modo-divino");
    // Ressonância (II₃) não liga em Modo divino (III₁)
    expect(habilidadesValidasV1(comHabs(["ectobalistica", "ressonancia", "modo-divino"]).habilidades)).not.toContain("modo-divino");
  });

  it("podeMemorizarV1 checa requisito, duplicata, Grau 0 e PM", () => {
    expect(podeMemorizarV1(comHabs([]), "levitacao").ok).toBe(false);
    expect(podeMemorizarV1(comHabs(["impeto"]), "levitacao").ok).toBe(true);
    expect(podeMemorizarV1(comHabs(["impeto"]), "impeto").ok).toBe(false);
    expect(podeMemorizarV1(comHabs([]), "arsenal-psionico").ok).toBe(false);
    expect(podeMemorizarV1(comHabs(["impeto"], 1), "levitacao").ok).toBe(false); // 3 + 6 > 6
  });
});

describe("esquecerHabilidadeV1 (cascata)", () => {
  it("remove dependentes sem outro requisito", () => {
    const f = esquecerHabilidadeV1(comHabs(["impeto", "levitacao", "modo-divino"]), "impeto");
    expect(ids(f)).toEqual([]);
  });
  it("mantém dependente com outro requisito do mesmo grau", () => {
    // Manifestação castanha (II₂) ← Ímpeto (I₁) ou Ectobalística (I₂)
    const f = esquecerHabilidadeV1(comHabs(["impeto", "ectobalistica", "manifestacao-castanha"]), "impeto");
    expect(ids(f)).toEqual(["ectobalistica", "manifestacao-castanha"]);
  });
});
```

- [ ] **Step 2:** `pnpm --filter @calafrio/core test v1` → FAIL.

- [ ] **Step 3: Implementar**

`regras-v1.ts`:
```ts
export function habilidadesValidasV1(habs: HabilidadeMemorizadaV1[]): string[] {
  const memorizadas = new Set(habs.map((h) => h.id));
  const validas = new Set<string>();
  for (const grau of [1, 2, 3] as const) {
    for (const id of memorizadas) {
      const c = obterHabilidade1e(id);
      if (!c || c.grau !== grau) continue;
      if (grau === 1 || c.requisitos.some((r) => validas.has(r))) validas.add(id);
    }
  }
  return [...validas];
}

export function grauZeroMemorizadosV1(validas: string[]): string[] {
  const arvores = new Set(validas.map((id) => obterHabilidade1e(id)?.arvore));
  return HABILIDADES_1E.filter((h) => h.grau === 0 && arvores.has(h.arvore)).map((h) => h.id);
}

export function podeMemorizarV1(ficha: FichaCalafrioV1, id: string): { ok: boolean; motivo?: string } {
  const c = obterHabilidade1e(id);
  if (!c) return { ok: false, motivo: "Habilidade desconhecida." };
  if (c.grau === 0) return { ok: false, motivo: "Grau 0 é automático." };
  if (ficha.habilidades.some((h) => h.id === id)) return { ok: false, motivo: "Já memorizada." };
  const validas = new Set(habilidadesValidasV1(ficha.habilidades));
  if (c.grau > 1 && !c.requisitos.some((r) => validas.has(r)))
    return { ok: false, motivo: "Requisito de grau anterior ligado não memorizado." };
  const d = calcularFichaV1(ficha);
  if (d.pmRestante < CUSTO_PM_POR_GRAU[c.grau]) return { ok: false, motivo: "PM insuficiente." };
  return { ok: true };
}

export function esquecerHabilidadeV1(ficha: FichaCalafrioV1, id: string): FichaCalafrioV1 {
  const resto = ficha.habilidades.filter((h) => h.id !== id);
  const validas = new Set(habilidadesValidasV1(resto));
  return {
    ...ficha,
    habilidades: resto.filter((h) => validas.has(h.id) || !obterHabilidade1e(h.id)),
  };
}
```
(O import circular `regras-v1` ↔ `calculo-v1` é seguro porque só funções são usadas em tempo de chamada. Se o lint reclamar, mover `podeMemorizarV1` para `calculo-v1.ts`.)

`calculo-v1.ts` — `calcularFichaV1(f)`:
- Derivados da spec §5.2.
- Para cada habilidade: desconhecida → `HABILIDADE_DESCONHECIDA` (não soma). Grau 0 → `GRAU_ZERO_EXPLICITO` (não soma). Senão soma `CUSTO_PM_POR_GRAU[grau] + (pmExtra ?? 0)`; `pmExtra` presente e (`!permitePmExtra` ou `< 0` ou `% 3 !== 0`) → `PM_EXTRA_INVALIDO`; fora de `habilidadesValidasV1` → `REQUISITO_NAO_ATENDIDO`; `aprimoramentos.length > 2` → `APRIMORAMENTOS_EXCEDIDOS`.
- Únicas: `aprimoramentos.length > 2` → `APRIMORAMENTOS_EXCEDIDOS`.
- `ecosGastos = Σ aprimoramentos das habilidades + Σ (1 + aprimoramentos das únicas)`.
- Limites → `LIMITE_PM_EXCEDIDO`, `LIMITE_ECOS_EXCEDIDO`, `PALAVRAS_CHAVE_EXCEDIDAS`.

`ficha-vazia-v1.ts`:
```ts
export function criarFichaV1Vazia(id: string, nome: string): FichaCalafrioV1 {
  return {
    edicao: "1e", id, nome, nivel: 1,
    atributos: { corpo: 1, mente: 1, alma: 1 },  // 1 ponto livre pendente
    pvAtual: 6, paAtual: 9,
    carteira: { fundos: 6, espirions: 0 },
    palavrasChave: [], habilidades: [], habilidadesUnicas: [], inventario: [],
    quemSouEu: "", anotacoes: "",
  };
}
```

Em `edicao.ts`:
```ts
import type { FichaCalafrio } from "./ficha/modelo";
import type { FichaCalafrioV1 } from "./v1/modelo-v1";
export type FichaPersonagem = FichaCalafrio | FichaCalafrioV1;
export function ehFichaV1(f: FichaPersonagem): f is FichaCalafrioV1 {
  return (f as { edicao?: unknown }).edicao === "1e";
}
export function edicaoDaFicha(f: FichaPersonagem): SistemaVersao {
  return ehFichaV1(f) ? "1e" : "2e";
}
```

- [ ] **Step 4:** `pnpm --filter @calafrio/core test` (tudo, inclusive 2e) → PASS; `pnpm --filter @calafrio/core type-check` → 0 erros.
- [ ] **Step 5:** commit `feat(core): add 1e rules and derived stats`.

---

### Task 4: `sistemaVersao` na mesa (schema, store, migration)

**Files:**
- Modify: `apps/web/src/db/schema.ts`, `apps/web/src/services/armazenamento-store.ts`, `apps/web/src/services/armazenamento-calafrio.ts`, `apps/web/src/services/__tests__/armazenamento-convite.test.ts` (fixtures ganham `sistemaVersao: "2e"`)
- Create: migration via `pnpm db:generate` (`apps/web/drizzle/0001_*.sql`)
- Test: `apps/web/src/services/__tests__/armazenamento-mesas-versao.test.ts`

- [ ] **Step 1: Teste falhando**

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DadosStore } from "../armazenamento-store";

const h = vi.hoisted(() => ({ store: null as unknown as DadosStore }));
vi.mock("@/db", () => ({ db: null, schema: {} }));
vi.mock("../armazenamento-store", async (orig) => ({
  ...(await orig<typeof import("../armazenamento-store")>()),
  carregarStore: async () => h.store,
  salvarStore: async (d: DadosStore) => { h.store = d; },
}));

import { criarMesa, obterMesa } from "../armazenamento-calafrio";
import { normalizarMesa } from "../armazenamento-store";

beforeEach(() => { h.store = { mesas: [], players: [], rolagens: [], anotacoes: [] }; });

describe("sistemaVersao da mesa", () => {
  it("padrão 2e", async () => {
    const m = await criarMesa("A");
    expect(m.sistemaVersao).toBe("2e");
    expect((await obterMesa(m.id))?.sistemaVersao).toBe("2e");
  });
  it("1e explícita", async () => {
    const m = await criarMesa("B", undefined, "1e");
    expect((await obterMesa(m.id))?.sistemaVersao).toBe("1e");
  });
  it("mesa antiga do JSON sem campo vira 2e", () => {
    expect(normalizarMesa({ id: "x", nome: "x", codigoConvite: "X", criadaEm: "" }).sistemaVersao).toBe("2e");
  });
});
```

- [ ] **Step 2:** `pnpm --filter @calafrio/web test armazenamento-mesas-versao` → FAIL.

- [ ] **Step 3: Implementar**
  - `schema.ts`: `export type { SistemaVersao } from "@calafrio/core";` e coluna `sistemaVersao: text("sistema_versao").$type<SistemaVersao>().notNull().default("2e")`.
  - `armazenamento-store.ts`: `MesaCalafrio.sistemaVersao: SistemaVersao`; `export function normalizarMesa(m: Omit<MesaCalafrio, "sistemaVersao"> & { sistemaVersao?: unknown }): MesaCalafrio` usando `normalizarSistemaVersao`; `carregarStore` aplica `normalizarMesa` em `lido.mesas`; a mesa de exemplo nasce `"2e"`.
  - `armazenamento-calafrio.ts`: `criarMesa(nome, userId?, versao: SistemaVersao = "2e")`; incluir `sistemaVersao` no insert e nos selects/mapeamentos de `listarMesas` e `obterMesa` (Postgres). Também em `armazenamento-convite.ts` → `buscarMesaPorCodigoConvite`, se ele monta `MesaCalafrio` à mão.
  - `pnpm db:generate` → conferir que o SQL é só `ALTER TABLE "mesas" ADD COLUMN "sistema_versao" text DEFAULT '2e' NOT NULL;`.

- [ ] **Step 4:** testes (novos + convite) → PASS; `pnpm --filter @calafrio/web type-check` → 0 erros.
- [ ] **Step 5:** commit `feat(web): persist sistemaVersao on mesas`.

---

### Task 5: Players com ficha de qualquer edição

**Files:**
- Create: `apps/web/src/services/ficha-edicao.ts`
- Modify: `apps/web/src/services/armazenamento-store.ts`, `apps/web/src/services/armazenamento-calafrio.ts`, `apps/web/src/services/armazenamento-convite.ts`, `apps/web/src/db/schema.ts`, `apps/web/src/app/mesa/[mesaId]/players/actions.ts`
- Test: `apps/web/src/services/__tests__/ficha-edicao.test.ts`, `apps/web/src/services/__tests__/players-1e.test.ts`, mais um caso em `armazenamento-convite.test.ts`

- [ ] **Step 1: Testes falhando**

`ficha-edicao.test.ts`:
```ts
import { criarFichaCalafrioVazia, criarFichaV1Vazia } from "@calafrio/core";
import { describe, expect, it } from "vitest";
import { resumirPlayer, resumirVitais } from "../ficha-edicao";

describe("resumirVitais", () => {
  it("2e mantém a fórmula atual", () => {
    const f = { ...criarFichaCalafrioVazia("a", "A"), aptBase: 2 };
    expect(resumirVitais(f)).toEqual({ aptBase: 2, pvMax: 9, paMax: 9, pd: 6 });
  });
  it("1e usa calcularFichaV1", () => {
    const f = { ...criarFichaV1Vazia("b", "B"), atributos: { corpo: 2, mente: 1, alma: 1 } };
    expect(resumirVitais(f)).toEqual({ aptBase: 1, pvMax: 6, paMax: 9, pd: 9 });
  });
});

describe("resumirPlayer", () => {
  it("1e: ocupação e contagem sem quebrar", () => {
    const f = {
      ...criarFichaV1Vazia("b", "B"),
      palavrasChave: [{ id: "p", nome: "Médica", categoria: "ocupacao" as const }],
      habilidades: [{ id: "impeto", aprimoramentos: [] }],
    };
    expect(resumirPlayer(f)).toEqual({ ocupacao: "Médica", totalHabilidades: 1 });
  });
});
```
(Conferir a fórmula 2e atual em `criarPlayer` antes de fixar os números do primeiro caso.)

`players-1e.test.ts` (mesmos mocks da Task 4): `criarPlayer` com ficha 1e grava `pvMax/paMax/pd` corretos e devolve `ficha.edicao === "1e"`; `salvarFichaPlayer` recalcula ao mudar atributos.

Caso novo em `armazenamento-convite.test.ts`: com uma mesa `sistemaVersao: "1e"`, `entrarPorConvite` cria rascunho com `ficha.edicao === "1e"`.

- [ ] **Step 2:** FAIL.

- [ ] **Step 3: Implementar**
  - `ficha-edicao.ts`: `resumirVitais(ficha: FichaPersonagem)` (move a fórmula 2e que hoje está duplicada em `criarPlayer`/`salvarFichaPlayer`) e `resumirPlayer(ficha)` → `{ ocupacao, totalHabilidades }` (2e: `palavrasChave` + `matrizHabilidades.length`; 1e: `palavrasChave` + `habilidades.length`).
  - `PlayerCalafrio.ficha: FichaPersonagem`; `players.ficha` em `schema.ts`: `.$type<FichaPersonagem>()`.
  - `criarPlayer`/`salvarFichaPlayer` aceitam `FichaPersonagem` e usam `resumirVitais`. Isso também reduz as linhas de `armazenamento-calafrio.ts`. Se passar de 400, mover as funções de player para `armazenamento-players.ts` e reexportar.
  - `entrarPorConvite`: `mesa.sistemaVersao === "1e" ? criarFichaV1Vazia(id, NOME_RASCUNHO) : criarFichaCalafrioVazia(id, NOME_RASCUNHO)`.
  - `players/actions.ts`: assinaturas com `FichaPersonagem`. `criarPlayerAction` usa o `mesa` de `exigirAcessoMesa`; `exigirEdicaoDoPlayer` passa a devolver `{ player, mesa }`. Ambas fazem `if (edicaoDaFicha(ficha) !== mesa.sistemaVersao) throw new Error("Ficha de edição diferente da mesa.")`.

- [ ] **Step 4:** `pnpm --filter @calafrio/web test` → PASS. `type-check` vai acusar os consumidores 2e de `player.ficha` (`player-row`, `players-panel`, `ficha/page.tsx`): resolver com `resumirPlayer` e, onde for 2e-only, com `ehFichaV1` (a Task 10 completa a parte visual). Rodar `type-check` → 0 erros.
- [ ] **Step 5:** commit `feat(web): store 1e character sheets on mesa players`.

---

### Task 6: Estado da ficha 1e (`packages/ficha-app`)

**Files:**
- Create: `packages/ficha-app/src/v1/ficha-v1-reducer.ts`, `packages/ficha-app/src/v1/use-ficha-calafrio-v1.ts`
- Modify: `packages/ficha-app/src/index.ts`
- Test: `packages/ficha-app/src/__tests__/ficha-v1-reducer.test.ts`

- [ ] **Step 1: Testes falhando** cobrindo cada ação:
  - `definirAtributo` (mínimo 1);
  - `definirNivel` (limita a 1..10);
  - `definirPvAtual` e `definirPaAtual` (limitados a 0..máx.);
  - `memorizar` (ignora quando `podeMemorizarV1` falha);
  - `esquecer` (cascata via `esquecerHabilidadeV1`);
  - `aprimorar` / `removerAprimoramento` (máx. 2);
  - `definirPmExtra`;
  - `adicionarUnica` / `aprimorarUnica` / `removerUnica`;
  - palavras-chave, inventário, carteira (fundos 1..12 na criação), `quemSouEu`, `anotacoes`, `ilustracaoUrl`, `definirNome`, `definirJogador`.

- [ ] **Step 2:** `pnpm --filter @calafrio/ficha-app test ficha-v1` → FAIL.
- [ ] **Step 3:** Implementar o reducer puro e `useFichaCalafrioV1(inicial?, onSalvar?)` → `{ ficha, derivada, ...acoes }`, com `derivada = useMemo(() => calcularFichaV1(ficha))` e o mesmo padrão de `onSalvarRef`/efeito de `use-ficha-calafrio.ts` (não salvar na montagem).
- [ ] **Step 4:** PASS. **Step 5:** commit `feat(ficha-app): add 1e sheet reducer and hook`.

---

### Task 7: Seletor de edição na criação da mesa + selo

**Files:**
- Modify: `apps/web/src/app/mesa/actions.ts`, `apps/web/src/app/mesa/page.tsx`, `apps/web/src/app/mesa/[mesaId]/dashboard-header.tsx`, `apps/web/src/app/mesa/[mesaId]/page.tsx`
- Test: `apps/web/src/app/mesa/__tests__/criar-mesa-action.test.ts`

- [ ] **Step 1: Teste falhando**

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";

const h = vi.hoisted(() => ({
  criarMesa: vi.fn(async () => ({ id: "mesa-x" })),
  redirect: vi.fn((url: string) => { throw new Error(`NEXT_REDIRECT ${url}`); }),
}));
vi.mock("@/auth", () => ({ auth: vi.fn(async () => ({ user: { id: "user-1" } })) }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: h.redirect }));
vi.mock("@/services/armazenamento-calafrio", () => ({
  criarMesa: h.criarMesa, excluirMesa: vi.fn(), obterMesa: vi.fn(),
}));
vi.mock("@/services/armazenamento-convite", () => ({ sairDaMesaComoJogador: vi.fn() }));

import { criarMesaAction } from "../actions";

const form = (campos: Record<string, string>) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(campos)) fd.append(k, v);
  return fd;
};

beforeEach(() => h.criarMesa.mockClear());

describe("criarMesaAction", () => {
  it.each([
    [{ nome: "A", sistemaVersao: "1e" }, "1e"],
    [{ nome: "B", sistemaVersao: "2e" }, "2e"],
    [{ nome: "C" }, "2e"],
    [{ nome: "D", sistemaVersao: "3e" }, "2e"],
  ])("%o → %s", async (campos, esperado) => {
    await expect(criarMesaAction(form(campos))).rejects.toThrow("NEXT_REDIRECT /mesa/mesa-x");
    expect(h.criarMesa).toHaveBeenCalledWith(campos.nome, "user-1", esperado);
  });
});
```

- [ ] **Step 2:** FAIL.
- [ ] **Step 3: Implementar**
  - action: `const versao = normalizarSistemaVersao(formData.get("sistemaVersao"));` → `criarMesa(nome, userId, versao)`.
  - `page.tsx`: dois cards de rádio `name="sistemaVersao"` (`2e` com `defaultChecked`). Textos da spec §5.7. Manter o estilo `calafrio-card`.
  - `dashboard-header.tsx`: prop `sistemaVersao` e selo "Calafrio 1e"/"Calafrio 2e" ao lado do selo Mestre/Jogador. Passar a prop em `[mesaId]/page.tsx`.
- [ ] **Step 4:** PASS. **Step 5:** commit `feat(web): choose 1e/2e edition when creating a mesa`.

---

### Task 8: Ficha Viva 1e

**Files:**
- Create: `apps/web/src/components/ficha/ficha-v1/modelo-visual-v1.ts`, `ficha-v1-pagina1.tsx`, `ficha-v1-pagina2.tsx`, `index.tsx`
- Create: `apps/web/src/app/mesa/[mesaId]/players/[playerId]/ficha/ficha-live-client-v1.tsx`
- Modify: `apps/web/src/app/mesa/[mesaId]/players/[playerId]/ficha/page.tsx`
- Test: `apps/web/src/components/ficha/ficha-v1/__tests__/modelo-visual-v1.test.ts`

- [ ] **Step 1: Teste falhando** para `linhasHabilidadesV1(ficha, derivada)`:
  - inclui o Grau 0 derivado no topo da árvore, marcado `automatica: true`;
  - `grauRomano` ("0", "I", "II", "III");
  - `custoTexto` ("2 PA / uso", "Passivo");
  - `custoPM`, `aprimoramentos` (0–2), `marcadores`;
  - `invalida: true` quando o id não está em `derivada.habilidadesValidas`;
  - ordenação por árvore e depois por grau.

  E para `resumoVitaisV1(derivada, ficha)` → textos "atual / máx." de PV, PA e PM.
- [ ] **Step 2:** FAIL. **Step 3:** implementar os helpers.
- [ ] **Step 4: Componentes** (só JSX, sem regra), fiéis à Ficha V3, conforme spec §5.7 item 3. Aprimorar = 2 losangos clicáveis que abrem um campo de descrição. Ícones cadeado/"?" ao lado do custo. Avisos de `derivada.avisos` numa faixa no topo da página 2. Memorizar/esquecer: seletor com `podeMemorizarV1` (mostra o motivo quando bloqueado) e confirmação ao esquecer quando a cascata remove outras habilidades.
- [ ] **Step 5:** `ficha-live-client-v1.tsx` usa `useFichaCalafrioV1(fichaInicial, (f) => salvarFichaPlayerAction(playerId, f))`, **sem** botões de PDF, rolagem e dano/cura. `page.tsx`: `ehFichaV1(player.ficha) ? <FichaLiveClientV1/> : <FichaLiveClient/>`.
- [ ] **Step 6:** testes PASS; `type-check` 0 erros. **Step 7:** commit `feat(web): add 1e live character sheet`.

---

### Task 9: Assistente de criação 1e

**Files:**
- Create: `apps/web/src/components/ficha/criacao-v1/regras-assistente-v1.ts`, `assistente-criacao-v1.tsx` (+ um arquivo por etapa se passar de 400 linhas)
- Create: `apps/web/src/app/mesa/[mesaId]/players/novo/novo-player-client-v1.tsx`
- Modify: `apps/web/src/app/mesa/[mesaId]/players/novo/page.tsx`
- Test: `apps/web/src/components/ficha/criacao-v1/__tests__/regras-assistente-v1.test.ts`

- [ ] **Step 1: Testes falhando** para:
  - `pontosLivresV1(ficha)` = 3 + Nível − soma;
  - `opcoesHabilidadesV1(ficha)` → por árvore, cada item com `{ id, disponivel, motivo }` vindo de `podeMemorizarV1`;
  - `podeAvancarV1(etapa, ficha)`:
    - identidade exige nome;
    - atributos exige 0 pontos livres e nenhum `PONTOS_ATRIBUTO_INVALIDOS`;
    - palavras-chave exige ocupação + personalidade + miscelânea e ≤ limite;
    - habilidades exige `pmRestante ≥ 0`;
    - equipamentos exige fundos entre 1 e 12.
- [ ] **Step 2:** FAIL. **Step 3:** implementar.
- [ ] **Step 4:** Componente com as 5 etapas da spec §5.7 item 4 sobre `useFichaCalafrioV1`. `novo/page.tsx` passa `mesa.sistemaVersao`; em mesa 1e renderiza `NovoPlayerClientV1` (mesma lógica de `rascunhoId` e das actions do client 2e).
- [ ] **Step 5:** PASS. **Step 6:** commit `feat(web): add 1e character creation wizard`.

---

### Task 10: Telas existentes da mesa com players 1e

**Files:**
- Modify: `apps/web/src/app/mesa/[mesaId]/players/player-row.tsx`, `apps/web/src/app/mesa/[mesaId]/players-panel.tsx`, `apps/web/src/app/mesa/[mesaId]/players/page.tsx` (ou quem renderiza `ZonaGeradorAleatorio`)

- [ ] **Step 1:** `player-row` e `players-panel` usam `resumirPlayer(p.ficha)` em vez de `p.ficha.palavrasChave`/`p.ficha.matrizHabilidades`.
- [ ] **Step 2:** `ZonaGeradorAleatorio` só é renderizada quando `mesa.sistemaVersao === "2e"`.
- [ ] **Step 3:** `grep -rnE "\.ficha\.(matriz|aptBase|ecos|alinh)" apps/web/src` → nenhum uso restante sem guarda `ehFichaV1`.
- [ ] **Step 4:** `pnpm --filter @calafrio/web type-check` e `test` → PASS. Commit `fix(web): render mesa player lists for both editions`.

---

### Task 11: Verificação final

- [ ] **Step 1:** `pnpm test` → tudo verde (core, ficha-app, web).
- [ ] **Step 2:** `pnpm type-check` → 0 erros.
- [ ] **Step 3:** `pnpm lint` → biome + limite de linhas OK.
- [ ] **Step 4: Navegador** (`pnpm dev`, sem `DATABASE_URL` para usar o store JSON):
  1. Criar mesa 2e: tudo como antes, selo "Calafrio 2e".
  2. Criar mesa 1e: selo "Calafrio 1e", gerador oculto.
  3. Criar personagem 1e pelo assistente: 2/1/1, Ímpeto + Levitação bloqueada por PM com Mente 1, liberada com Mente 2.
  4. Abrir a ficha 1e: PD 9 / PM 3 de 6 / PA 9 / PV 6; aprimorar Ímpeto (EP 1/1); esquecer Ímpeto com Levitação memorizada → confirmação de cascata.
  5. Recarregar a página: dados persistidos.
  6. Entrar por convite numa mesa 1e com outro usuário: rascunho abre o assistente 1e.
  7. Com Postgres local, se disponível: `pnpm db:migrate` e repetir 2–5.
- [ ] **Step 5:** commit final se sobrar ajuste: `chore: final checks for 1e/2e edition support`.
