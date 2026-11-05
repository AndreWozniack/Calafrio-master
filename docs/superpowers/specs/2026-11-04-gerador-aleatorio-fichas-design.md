# Design: Gerador Aleatório de Fichas para Calafrio RPG (2ª Edição)

- **Data:** 04/11/2026
- **Status:** Proposta de Design
- **Contexto:** Tela de Players da Mesa (`/mesa/[mesaId]/players`) e Motor do Calafrio (`@calafrio/core`)

---

## 1. Contexto & Propósito (Intent & Why)

Em mesas de *Calafrio RPG*, mestres e jogadores frequentemente precisam criar fichas de personagens de maneira instantânea: seja para introduzir um novo jogador sem demora, criar um NPC investigativo com estatísticas canônicas completas, ou improvisar uma vítima/aliado paranormal no submundo de Curitiba.

Hoje, a criação de personagens exige percorrer as 4 etapas do `AssistenteCriacaoCalafrio` (`/mesa/[mesaId]/players/novo`). Este documento projeta um gerador 100% aleatório, que opera com 1 clique direto na tela de players da mesa, permitindo pré-visualizar, re-rolar e salvar a ficha pronta, com liberdade para edição posterior.

---

## 2. Objetivos, Não-Objetivos e Anti-Objetivos

### Objetivos (Goals)
1. **Motor Determinístico & Puro no Core (`@calafrio/core`):** Criar a função `gerarFichaAleatoria(catalogo, opcoes?)` que produz um objeto `FichaCalafrio` 100% conforme as regras da 2ª Edição.
2. **Conformidade Estrita com Regras da 2ª Edição:**
   - **APT:** Inicial APT 1 (ou configurável via opção se fornecida).
   - **Palavras-chave:** Exatamente $2 + \text{APT} = 3$ palavras-chave (1 Ocupação d100 + 2 traços/aspectos d100).
   - **Matriz 3×3 & Domínio:** Alocar $\text{APT}$ habilidades memorizadas (padrão 1 habilidade em slot central ou aleatório da matriz), respeitando obrigatoriamente a regra de ouro de domínio (*apenas Positivo* ou *apenas Negativo*, sem incorrer no erro de `DOMINIO_MISTO`).
   - **Equipamento:** 1 arma do catálogo de armas mundanas condizente com a ocupação/perfil + 1 bugiganga d100.
   - **Carteira:** Fundos iniciais $\text{F}\$$ proporcionais e coerentes (ex: d6 + 4 ou custo da arma + troco).
   - **Identidade Urbana:** Nomes gerados com sabor investigativo e atmosfera urbana brasileira/curitibana.
3. **Zona Especial na Tela de Players (`/mesa/[mesaId]/players`):**
   - Card temático estilizado no topo da página de players.
   - Botão de ação direta `🎲 Forjar Investigador Aleatório`.
   - Card de prévia expansível com animação, apresentando os dados do personagem sorteado (Nome, Ocupação, Vitais derivados, Habilidade, Traços, Bugiganga).
   - Ações imediatas:
     - **Re-rolar** (`🎲 Sortear Outro`)
     - **Adicionar à Mesa** (`✅ Salvar na Mesa`) — cria via `criarPlayerAction` e atualiza a lista.
     - **Salvar e Editar** (`✏️ Salvar e Abrir Ficha`) — cria via `criarPlayerAction` e navega para `/mesa/[mesaId]/players/[playerId]/ficha`.
4. **Testes Unitários no Vitest:** Cobrir o gerador no `@calafrio/core` validando que as fichas geradas nunca disparam `avisosDeRegra` em `montarFichaCalafrio`.

### Não-Objetivos (Non-Goals)
- Não substituir o `AssistenteCriacaoCalafrio` manual passo-a-passo (ambos convivem harmonicamente).
- Não criar IA generativa para histórias longas (as palavras-chave, ocupações e bugigangas já são o motor narrativo de Calafrio).

### Anti-Objetivos (Anti-Goals)
- **Anti-meta 1: Fichas com avisos de regra:** O gerador nunca deve gerar combinações com habilidades de domínio misto ou com limites de APT/palavras estourados.
- **Anti-meta 2: Complexidade burocrática:** Não exigir do usuário dezenas de cliques antes de gerar; deve ser 1 clique para ver a ficha pronta.

---

## 3. Abordagens Consideradas & Decisão

### Abordagem 1: Motor Puro no Core + Zona Expansível na Tela de Players (ESCOLHIDA)
- **Descrição:** A lógica de geração vive no pacote `@calafrio/core/ficha/gerador-aleatorio.ts`, exposta para todo o monorepo. O Next.js (`apps/web`) cria o componente de cliente `ZonaGeradorAleatorio` na página `/mesa/[mesaId]/players/page.tsx`.
- **Trade-offs:** Exige exportar a função e estruturar os dados de nomes no core, mas garante separação total de responsabilidades, testabilidade em Vitest e reaproveitamento no app mobile.

### Abordagem 2: Inline no Front-end (Next.js)
- **Descrição:** Criar a função diretamente dentro de um hook React em `apps/web`.
- **Trade-offs:** Mais rápida de implementar inicialmente, porém mistura regras de domínio na camada de UI e impossibilita testes automatizados limpos de regras do Calafrio. Descartada.

### Abordagem 3: Redirecionamento com Preenchimento Automático do Assistente
- **Descrição:** O botão na tela de players cria um estado rascunho e joga o usuário para o wizard de 4 etapas.
- **Trade-offs:** Lenta para gerar múltiplos NPCs/personagens em sequência durante uma sessão de jogo. Descartada em favor da geração ágil em 1 clique com prévia.

---

## 4. Detalhes de Implementação

### 4.1. Motor do Core: `packages/core/ficha/gerador-aleatorio.ts`
- **Banco de Nomes:** Coleção rica de prenomes (masculinos, femininos, neutros) e sobrenomes brasileiros/curitibanos (ex: *Brendo, Helena, Dante, Moema, Rafael, Yasmin, Grunevald, Silva, Ferreira, Beltrão, Loureiro, Maciel*).
- **Parâmetros Opcionais (`OpcoesGeradorFicha`):**
  ```ts
  export interface OpcoesGeradorFicha {
    apt?: number; // default: 1
    personalidadeFoco?: PersonalidadeCalafrio; // opcional
    dominio?: "positivo" | "negativo"; // default: aleatório
    jogador?: string; // opcional
  }
  ```
- **Fluxo do Sorteio:**
  1. Define APT (default 1).
  2. Sorteia Nome e Sobrenome.
  3. Sorteia Ocupação da tabela d100 de `catalogo.ocupacoes`.
  4. Sorteia 2 traços/aspectos sem repetição de `catalogo.palavrasChaveGenericas`.
  5. Sorteia Domínio (*positivo* ou *negativo*) e filtra `catalogo.habilidadesParanormais` válidas. Sorteia 1 habilidade e aloca no slot central (slot 4) ou slot aleatório (0 a 8).
  6. Sorteia 1 arma mundana do catálogo compatível.
  7. Sorteia 1 bugiganga da tabela d100 de `catalogo.bugigangas`.
  8. Calcula carteira inicial: $\text{F}\$ = 6 + \text{d6}$ (ou valor padrão justo), $\text{E\$P} = 0$.
  9. Retorna `FichaCalafrio` pronta com UUID gerado.

### 4.2. Interface do Usuário: `apps/web/src/app/mesa/[mesaId]/players/zona-gerador-aleatorio.tsx`
- Componente cliente (`"use client"`).
- Renderizado na `PlayersPage` (`apps/web/src/app/mesa/[mesaId]/players/page.tsx`).
- Estados:
  - `fichaSorteada: FichaCalafrio | null`
  - `carregando: boolean`
  - `salvando: boolean`
- Ao clicar em `🎲 Forjar Investigador Aleatório`:
  - Gera instantaneamente com animação visual de rolagem de dados.
  - Exibe um painel de prévia com:
    - Identidade: Nome, Ocupação, Aptidão e Carteira.
    - Vitais derivados calculados em tempo real via `montarFichaCalafrio` (PV, PA, PD, VEL).
    - Palavras-chave sorteadas.
    - Habilidade Paranormal sorteada (com badge de domínio e personalidade).
    - Equipamentos & Bugigangas.
  - Botões de Ação:
    - `🎲 Re-rolar`: descarta e sorteia nova composição no mesmo instante.
    - `✅ Adicionar à Mesa`: chama `criarPlayerAction(mesaId, fichaSorteada)` e fecha a prévia com toast/feedback.
    - `✏️ Salvar e Abrir Ficha`: salva e redireciona direto para `/mesa/[mesaId]/players/[novoId]/ficha`.
    - `Cancelar / Fechar`: recolhe a prévia.

---

## 5. Plano de Testes & Verificação

1. **Testes Unitários (`packages/core/ficha/__tests__/gerador-aleatorio.test.ts`):**
   - Garantir que 100 iterações aleatórias sucessivas gerem fichas válidas.
   - Garantir que nenhuma ficha gerada gere `avisosDeRegra` (especialmente sem `DOMINIO_MISTO`, sem limite de palavras ou de habilidades violado).
   - Validar que a ficha derivada calculada possui PV, PA e PD corretos para o APT sorteado.
2. **Type-Check & Build:**
   - `pnpm --filter @calafrio/core build` / `pnpm test`
   - `pnpm type-check`
3. **Verificação no Navegador:**
   - Acessar a tela de players de uma mesa.
   - Forjar investigadores aleatórios, testar o botão de re-rolar, salvar na mesa e verificar a presença do novo investigador na lista e no editor completo de ficha.
