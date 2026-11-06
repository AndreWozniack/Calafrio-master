# Design Doc: Suporte a Calafrio 1ª Edição (Clássica) com Seletor por Mesa

> Revisão 2 (2026-11-05): regras conferidas contra as fontes oficiais e contra o código atual.

## 0. Fontes de regra (ordem de precedência)
1. **Ficha oficial 1e** — `FichaPersonagem[V3].pdf` (iCloud `RPG/RPG - Root/`, 28/07/2025). Fonte das fórmulas.
2. **Habilidades 1e** — `V8_HabilidadesParanormais_Calafrio.pdf` (iCloud `RPG/RPG - Root/`, 16/07/2025). Fonte dos nomes, graus, custos de PA, ícones e **ligações entre habilidades** (linhas tracejadas).
3. **Notion "Calafrio TTRPG"** (Brendo Grunevald, atualizado 15/07/2025) — regras textuais de criação, graus, esquecimento, Ecos e Habilidades Únicas. O Notion ainda cita o PDF V6; o V8 é mais novo e prevalece.

O Notion mistura o sistema antigo com o bloco "🚧 EM CONSTRUÇÃO – Novo sistema de alocação de níveis". **Este projeto adota o sistema novo**, que é o único coerente com a Ficha V3:

| Regra | Adotado (novo + Ficha V3) | Descartado (texto antigo do Notion) |
|---|---|---|
| Defesa | PD = 3 + Corpo×3 | 10 PD iniciais, +1 PD por Corpo |
| Barreira | não existe | Pontos de Barreira (+6 PB por Corpo) |
| Palavras-chave | 2 + Nível | +1 por ponto em Mente |
| Ecos (EP) | = Nível (1 no nível 1) | "inicia sem nenhum EP" |

## 1. Contexto e Motivação
O **Calafrio Master** foi construído sobre a **2ª Edição (2e)**: Aptidão Base (`APT`), Matriz 3×3, polaridade de Domínio. Há mestres que jogam a **1ª Edição (1e)**: atributos **Corpo/Mente/Alma**, habilidades por **Graus 0–III** compradas com **Pontos de Memória (PM)** e **Ecos Psíquicos**. Objetivo: suportar as duas edições, escolhida na criação de cada mesa.

## 2. Objetivos, Não-Objetivos e Anti-Objetivos

### Objetivos
1. **Seletor de edição na criação da mesa** (`/mesa`): "2ª Edição (padrão)" ou "1ª Edição (clássica)".
2. **Núcleo 1e isolado em `@calafrio/core`** (cálculo, catálogo, regras), sem tocar no motor 2e.
3. **Catálogo 1e completo**: 60 habilidades (5 árvores × 12) com grau, custo de PA, ícones e grafo de requisitos.
4. **Persistência de fichas 1e** nos players da mesa (Postgres + store JSON).
5. **Ficha Viva 1e** fiel à Ficha V3 e **Assistente de Criação 1e**.
6. **Telas existentes da mesa** (lista de players, painel, convite, gerador) funcionando em mesas 1e sem quebrar.

### Não-Objetivos (desta entrega)
- Converter mesas existentes (todas recebem `sistemaVersao = "2e"`).
- Trocar a edição de uma mesa depois de criada (imutável).
- Gerador aleatório de personagem 1e (o botão fica oculto em mesas 1e).
- Exportação em PDF da ficha 1e (o botão fica oculto em fichas 1e).
- Rolagem integrada e modal de dano/cura na ficha 1e: PV e PA atuais são editáveis direto na ficha.
- Visão de combate (`/mesa/[id]/combate`) e app mobile: usam personagens do armazenamento local (2e), não os players da mesa. Ficam inalterados.

### Anti-Objetivos
- Ficha "Frankenstein" (Corpo/Mente/Alma junto com Matriz 3×3).
- `if (versao === "1e")` espalhado dentro do motor 2e. A ramificação acontece só nas bordas: persistência, actions e containers de página.

## 3. Restrições
- TypeScript estrito; monorepo `packages/core`, `packages/ficha-app`, `apps/web`.
- Postgres via Drizzle com fallback para `apps/web/data/calafrio-store.json`.
- Vitest, ambiente `node`. Não há testes `.tsx` no repo nem testing-library/jsdom; **lógica de UI vai para helpers `.ts` testáveis**, componentes ficam finos e são verificados no navegador.
- `pnpm lint` barra arquivos `.ts/.tsx` com mais de 400 linhas (`scripts/check-file-lines.mjs`).
- `@calafrio/core` exporta `"./*": "./*.ts"`; subpasta `v1/` **não** resolve como `@calafrio/core/v1`. Importar sempre de `@calafrio/core` (barrel raiz).

## 4. Abordagem escolhida: motor polimórfico por edição
- `mesas.sistemaVersao: "1e" | "2e"` é a fonte da verdade.
- `FichaPersonagem = FichaCalafrio | FichaCalafrioV1`, discriminada por `edicao: "1e"` (a ficha 2e não tem o campo).
- UI ramifica por edição no container de página.

Descartada: modelo único com campos opcionais (fragiliza tipagem e arrisca a 2e).

## 5. Especificação Técnica

### 5.1. Mesa
```ts
export type SistemaVersao = "1e" | "2e";
// mesas: sistemaVersao: text("sistema_versao").$type<SistemaVersao>().notNull().default("2e")
```
- Migration gerada com `pnpm db:generate` (linhas existentes recebem `'2e'` pelo default).
- `MesaCalafrio` (em `armazenamento-store.ts`) ganha `sistemaVersao: SistemaVersao`. Leitura do JSON antigo usa `?? "2e"`. A mesa de exemplo do store nasce `"2e"`.
- `criarMesa(nome, userId?, versao = "2e")`. A action valida o valor do form (só `"1e"`/`"2e"`; qualquer outro vira `"2e"`).

### 5.2. Atributos e derivados (Ficha V3)
| Valor | Fórmula |
|---|---|
| Pontos de atributo | Corpo + Mente + Alma = 3 + Nível, cada um ≥ 1 |
| Nível | 1 a 10 |
| Defesa (PD) | 3 + Corpo × 3 |
| Memória (PM máx.) | Mente × 6 |
| Ânimum (PA máx.) | Alma × 9 |
| Vida (PV máx.) | Nível × 6 |
| Aptidão (BA) | Nível |
| Velocidade | 6 |
| Ecos psíquicos (EP máx.) | Nível |
| Palavras-chave (máx.) | 2 + Nível |

A ficha guarda **PV atual** e **PA atual** (a Ficha V3 mostra "atual / máximo"). PM é derivado (gasto / máximo).

### 5.3. Habilidades paranormais
- **Árvores:** maneiras, caoticas, esquisitas, agradaveis, racionais. Pode-se memorizar de várias árvores.
- **Custo de memorização:** Grau 0 = 0 PM, I = 3 PM, II = 6 PM, III = 12 PM.
- **Grau 0:** memorizado automática e gratuitamente quando a ficha tem qualquer outra habilidade válida da árvore. **Não é guardado na ficha**; é derivado.
- **Requisitos (grafo):** Grau II exige ao menos um Grau I **ligado a ele** memorizado. Grau III exige ao menos um Grau II ligado a ele **que seja válido** (ou seja, que tenha seu Grau I).
- **Esquecer** (só em descanso longo, devolve os PM): remove também, em cascata, as habilidades de grau maior que ficarem sem nenhum requisito válido.
- **Custo de uso:** número de PA, ou `"passivo"`.
- **PM extra (Familiar):** "Para cada 3 PM adicionais alocados nesta habilidade" o familiar melhora. A habilidade memorizada guarda `pmExtra` (múltiplo de 3, ≥ 0). Só habilidades com `permitePmExtra` aceitam.
- **Ícones do PDF:** algumas cartas têm cadeado e/ou "?". A semântica não está documentada; o catálogo guarda `marcadores: ("cadeado" | "interrogacao")[]` só para exibição, sem regra.

#### Grafo de ligações (igual nas 5 árvores, posições de cima para baixo no PDF)
- I₁ → II₁, II₂ · I₂ → II₂, II₃ · I₃ → II₃, II₄ · I₄ → II₄, II₅
- III₁ ← II₁, II₂ · III₂ ← II₃, II₄ · (II₅ não leva a nenhum III)

#### Catálogo (V8)
Notação: nome (custo PA) [marcadores]. "P" = passivo. 🔒 = cadeado, ❓ = interrogação.

| Árvore | Grau 0 | Grau I (I₁…I₄) | Grau II (II₁…II₅) | Grau III (III₁, III₂) |
|---|---|---|---|---|
| Maneiras | Arsenal psiônico (2) | Ímpeto (2); Ectobalística (2); Campo de força (2); Telecinese (2) | Levitação (3); Manifestação castanha (3) 🔒❓; Ressonância (3); Fluxo anti-animático (3) 🔒; Absorção etérea (P) | Modo divino (6); Conduíte (P) |
| Caóticas | Frenesi (2) | Bombardeio (2); Sobrecarga (2); Estratagema (2); Lampejo (2) | Imolação (6); Manifestação rubra (3) 🔒❓; Presença torturante (4); Carnificina (4) 🔒; Intangibilidade (4) 🔒 | Desintegração (9); Aparato obliterador (9) |
| Esquisitas | Percepção etérea (2) | Leitura do destino (2); Metamorfose (3); Projeção astral (3) 🔒; Familiar (P, PM extra) | Vislumbre (3); Manifestação cerúlea (3) 🔒❓; Ladrão multidimensional (3); Aprisionamento (P); Legião do abismo (4) 🔒 | Perdição (12); Metabolismo de dianho (P) |
| Agradáveis | Telepatia (P) | Ruído / Amplificação (2); Linguagem universal (P); Ilusionismo (2); Senciência (2) 🔒 | Invasão de pensamentos (3); Manifestação alva (3) 🔒❓; Presença onírica (3) 🔒; Miniaturização (3); Rejuvenescimento (4) | Fundição afetiva (6); Presente (12) |
| Racionais | Inscrição (0) | Reorganização de matéria (2); Encantamento (2); Translocação (2); Mecanovidência (2) | Transmutação de matéria (3); Especialização de aura (3) 🔒❓; Rabdomancia (3); Teletransporte (4); Neurohacking (3) 🔒 | Gênese (12); Palácio mental (P) |

Descrições: transcritas do PDF V8. **Erro conhecido da fonte:** a descrição de *Manifestação rubra* no V8 é cópia da de *Manifestação castanha* (fala em "espectro castanho"). Transcrever como está e registrar `// TODO(fonte)` até o autor corrigir.

### 5.4. Ecos psíquicos e Habilidades Únicas
- **EP máx. = Nível.** Gastos de EP:
  - Aprimorar (customizar) uma habilidade paranormal memorizada: 1 EP por aprimoramento, **máx. 2 por habilidade**. Efeito livre, texto aprovado pelo MdJ (guardado como descrição).
  - Criar Habilidade Única: 1 EP. Aprimorá-la: +1 EP cada, máx. 2.
- **Habilidade Única:** ativa ou passiva, paranormal ou mundana; se ativa, **custa sempre 3 PA**. Potência de referência: 0 aprimoramentos ≈ Grau I, 1 ≈ II, 2 ≈ III (só informativo).
- Validação: EP gastos ≤ EP máx.

### 5.5. Modelo de dados 1e (`packages/core/v1/`)
```ts
export type ArvoreV1 = "maneiras" | "caoticas" | "esquisitas" | "agradaveis" | "racionais";
export type GrauV1 = 0 | 1 | 2 | 3;
export interface AtributosV1 { corpo: number; mente: number; alma: number }
export interface AprimoramentoV1 { id: string; descricao: string }
export interface HabilidadeMemorizadaV1 { id: string; aprimoramentos: AprimoramentoV1[]; pmExtra?: number }
export interface HabilidadeUnicaV1 { id: string; nome: string; descricao: string; passiva: boolean; aprimoramentos: AprimoramentoV1[] }
export type CategoriaPalavraChaveV1 = "ocupacao" | "personalidade" | "miscelanea" | "livre";
export interface PalavraChaveV1 { id: string; nome: string; categoria: CategoriaPalavraChaveV1 }
export interface ItemV1 { id: string; nome: string; quantidade: number; notas?: string }
export interface FichaCalafrioV1 {
  edicao: "1e";
  id: string; nome: string; jogador?: string;
  nivel: number; atributos: AtributosV1;
  pvAtual: number; paAtual: number;
  carteira: { fundos: number; espirions: number };
  palavrasChave: PalavraChaveV1[];
  habilidades: HabilidadeMemorizadaV1[];      // sem Grau 0 (derivado)
  habilidadesUnicas: HabilidadeUnicaV1[];
  inventario: ItemV1[];
  quemSouEu: string; anotacoes: string; ilustracaoUrl?: string;
}
```
- Grau e custo vêm do catálogo; **não ficam gravados na ficha** (evita divergência).
- `calcularFichaV1(ficha) → FichaDerivadaV1` com: `pd, pmMax, paMax, pvMax, ba, velocidade, ecosMax, limitePalavrasChave, pmGasto, pmRestante, ecosGastos, pontosAtributoEsperados, habilidadesValidas: string[], grauZeroMemorizados: string[], avisos: AvisoV1[]`.
- Códigos de aviso: `NIVEL_INVALIDO`, `PONTOS_ATRIBUTO_PENDENTES` (soma < 3 + Nível, ficha em construção), `PONTOS_ATRIBUTO_INVALIDOS` (soma > 3 + Nível ou atributo < 1), `LIMITE_PM_EXCEDIDO`, `LIMITE_ECOS_EXCEDIDO`, `APRIMORAMENTOS_EXCEDIDOS`, `REQUISITO_NAO_ATENDIDO`, `HABILIDADE_DESCONHECIDA`, `GRAU_ZERO_EXPLICITO`, `PM_EXTRA_INVALIDO`, `PALAVRAS_CHAVE_EXCEDIDAS`.
- Funções puras: `criarFichaV1Vazia(id, nome)`, `esquecerHabilidadeV1(ficha, id)` (cascata), `podeMemorizarV1(ficha, id)`.
- Dinheiro inicial: o jogador escolhe de 1 a 12 fundos (padrão 6).

### 5.6. Persistência dos players
- `FichaPersonagem = FichaCalafrio | FichaCalafrioV1` e `ehFichaV1(f)`.
- `PlayerCalafrio.ficha` e a coluna `players.ficha` passam a `FichaPersonagem` (jsonb, sem migration).
- As colunas-resumo `aptBase/pvMax/paMax/pd` vêm de `resumirVitais(ficha)`: 2e mantém a fórmula atual; 1e usa `ba/pvMax/paMax/pd` de `calcularFichaV1`.
- **Coerência de edição:** `criarPlayerAction` e `salvarFichaPlayerAction` recusam ficha cuja edição difere de `mesa.sistemaVersao`.
- **Convite:** `entrarPorConvite` cria o rascunho com `criarFichaV1Vazia` em mesas 1e.

### 5.7. Interface (`apps/web`)
1. **`/mesa`:** cards de rádio "2ª Edição — Matriz 3×3 & Aptidão" (padrão) e "1ª Edição Clássica — Corpo, Mente, Alma & PM".
2. **Header da mesa:** selo "Calafrio 1e" / "Calafrio 2e".
3. **Ficha Viva 1e** (fiel à Ficha V3):
   - Página 1: ilustração, nome, Vida (atual/máx.), Ânimum (atual/máx.), Aptidão (BA), Fundo$, E$P, Velocidade, Nível; círculos Corpo→PD, Mente→PM (gasto/máx.), Alma→PA; palavras-chave (Ocupação, Personalidade, Miscelânea + livres); "Quem sou eu?"; Inventário & anotações.
   - Página 2: Ecos (gastos/total); tabela de habilidades (2 losangos "Aprimorar", Grau, Nome, Custo, Descrição, ícones); Habilidades Únicas com aprimoramentos; avisos de regra.
4. **Assistente 1e:** Identidade → Atributos (3 + Nível pontos, prévia de PD/PM/PA/PV) → Palavras-chave → Habilidades (orçamento de PM, só habilidades com requisito atendido, Grau 0 automático) → Equipamentos e fundos (1–12).
5. **Telas existentes:** `player-row` e `players-panel` usam `resumirPlayer(ficha)` (ocupação e nº de habilidades por edição); gerador aleatório oculto em mesas 1e; exportar PDF oculto em fichas 1e.

## 6. Pendências com o autor do sistema (não bloqueiam)
- Significado dos ícones cadeado e "?" nas cartas.
- Descrição correta de *Manifestação rubra*.

## 7. Critérios de aceite
- Mesa sem versão → `"2e"`; mesas antigas do JSON → `"2e"`.
- Cálculos 1e corretos para níveis 1 a 10.
- Catálogo: 60 habilidades, 12 por árvore, grafo exatamente como §5.3.
- Requisitos, cascata de esquecimento, Grau 0 automático, limites de PM, EP, aprimoramentos e palavras-chave cobertos por testes.
- Ficha 1e salva e recarrega pelo Postgres e pelo store JSON; ficha de edição errada é recusada.
- Nenhum teste 2e quebra; `pnpm test`, `pnpm type-check` e `pnpm lint` passam.
