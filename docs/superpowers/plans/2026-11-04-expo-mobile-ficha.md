# App Mobile Calafrio (Expo React Native) - Foco em Fichas de Player Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o aplicativo mobile em Expo React Native (`apps/mobile`) integrado ao monorepo pnpm, replicando fielmente o design sombrio de papel do Calafrio e proporcionando uma experiência completa e offline-first de ficha para os jogadores.

**Architecture:** App Expo SDK 52+ estruturado em `apps/mobile`, consumindo `@calafrio/core` e `@calafrio/ficha-app`. Camada de visualização nativa modular (`View`, `Text`, `Pressable`, Lucide Icons) espelhando a linguagem visual da web (`apps/web/src/components/ficha/celular/*`). Persistência local via AsyncStorage com adaptador assíncrono.

**Tech Stack:** React Native, Expo (SDK 52+), TypeScript, `@calafrio/core`, `@calafrio/ficha-app`, `@react-native-async-storage/async-storage`, `expo-image-picker`, `expo-image-manipulator`, `expo-haptics`, `lucide-react-native`.

**Spec:** [`docs/superpowers/specs/2026-11-04-expo-mobile-ficha-design.md`](file:///Users/andrewozniack/Documents/Calafrio-master/docs/superpowers/specs/2026-11-04-expo-mobile-ficha-design.md)

## Global Constraints
- React 19 / 18 e TypeScript 5.8+ em conformidade com o monorepo pnpm.
- Não quebrar ou modificar o comportamento existente de `apps/web` e as funções síncronas de `@calafrio/ficha-app`.
- Fidelidade estética rigorosa: alto contraste preto/branco, tipografia com serifas/estilo papel, tags chanfradas, botões táteis.
- Zero dependência de rede para funcionamento essencial da ficha (100% offline-first).

## Review Focus
- Persistência e hidratação do AsyncStorage sem perda de dados na reinicialização do app.
- Imagens de retrato salvas como Base64 compacto (<=40KB) via manipulação de imagem.
- Matriz 3x3 calculando e destacando visualmente alinhamentos ativos em tempo real.
- Modais e formulários com bom espaçamento e usabilidade touch (sem sobreposição de teclado).
- Cálculos de vitais (PV, PA, APT, PD, Velocidade) idênticos ao `@calafrio/core`.

---

### Task 1: Suporte a Armazenamento Assíncrono em `@calafrio/ficha-app`

**Files:**
- Create: `packages/ficha-app/src/armazenamento-async.ts`
- Create: `packages/ficha-app/src/use-gerenciador-personagens-async.ts`
- Modify: `packages/ficha-app/src/index.ts`
- Test: `packages/ficha-app/src/__tests__/armazenamento-async.test.ts`

**Interfaces:**
- Consumes: `FichaCalafrio` de `@calafrio/core`, `CHAVE_STORAGE_PERSONAGENS` de `./armazenamento`
- Produces: `StorageAdapterAsync`, `useGerenciadorPersonagensAsync(adapter)`

- [ ] **Step 1: Escrever teste que valida o gerenciador assíncrono com mock adapter**
- [ ] **Step 2: Executar teste e verificar falha**
- [ ] **Step 3: Implementar `armazenamento-async.ts` e `use-gerenciador-personagens-async.ts`**
- [ ] **Step 4: Executar testes de `@calafrio/ficha-app` e garantir aprovação**
- [ ] **Step 5: Commit das alterações**

---

### Task 2: Scaffolding e Configuração do App Expo (`apps/mobile`)

**Files:**
- Create: `apps/mobile/package.json`
- Create: `apps/mobile/app.json`
- Create: `apps/mobile/metro.config.js`
- Create: `apps/mobile/tsconfig.json`
- Create: `apps/mobile/src/theme/tokens.ts`
- Modify: `pnpm-lock.yaml`, `package.json` (root)

**Interfaces:**
- Produces: App Expo configurado para monorepo pnpm, com resolução de symlinks dos pacotes `@calafrio/*`.

- [ ] **Step 1: Criar `apps/mobile/package.json` com dependências necessárias (`expo`, `react-native`, `lucide-react-native`, `@react-native-async-storage/async-storage`, `expo-image-picker`, `expo-image-manipulator`, `expo-haptics`)**
- [ ] **Step 2: Configurar `apps/mobile/metro.config.js` para monorepo pnpm**
- [ ] **Step 3: Configurar `apps/mobile/app.json` e `tsconfig.json`**
- [ ] **Step 4: Executar `pnpm install` e validar que as dependências resolvem sem erro**
- [ ] **Step 5: Commit do scaffolding**

---

### Task 3: Componentes Base de UI do Calafrio Mobile

**Files:**
- Create: `apps/mobile/src/components/ui/EtiquetaCalafrio.tsx`
- Create: `apps/mobile/src/components/ui/CartaoPapel.tsx`
- Create: `apps/mobile/src/components/ui/BotaoPasso.tsx`
- Create: `apps/mobile/src/components/ui/TituloSecao.tsx`
- Create: `apps/mobile/src/components/ui/ChecklistPendencias.tsx`
- Create: `apps/mobile/src/components/ui/index.ts`

**Interfaces:**
- Produces: Componentes visuais primários com a linguagem gráfica do Calafrio (tags chanfradas, cantos nítidos, alto contraste).

- [ ] **Step 1: Implementar `EtiquetaCalafrio` com estilo chanfrado e texto serifado**
- [ ] **Step 2: Implementar `CartaoPapel` com estilo de papel e borda sombreada**
- [ ] **Step 3: Implementar `BotaoPasso` com suporte a `expo-haptics` e ícones `lucide-react-native`**
- [ ] **Step 4: Implementar `TituloSecao` e `ChecklistPendencias`**
- [ ] **Step 5: Validar compilação TypeScript**
- [ ] **Step 6: Commit dos componentes base**

---

### Task 4: Componentes da Ficha - Vitais e Palavras-chave

**Files:**
- Create: `apps/mobile/src/components/ficha/PainelVitaisMobile.tsx`
- Create: `apps/mobile/src/components/ficha/PalavrasChaveMobile.tsx`
- Create: `apps/mobile/src/components/ficha/AbaFichaPrincipal.tsx`

**Interfaces:**
- Consumes: `FichaViva` (hook `useFichaCalafrio`), componentes de `src/components/ui`
- Produces: Visualização da aba principal da ficha com ajuste de vitais e lista de palavras-chave interativas.

- [ ] **Step 1: Implementar `PainelVitaisMobile` com cartões ajustáveis para PV, PA, APT, PD, Velocidade e Ecos**
- [ ] **Step 2: Implementar `PalavrasChaveMobile` com tags clicáveis para rolagem e botão de adicionar**
- [ ] **Step 3: Montar `AbaFichaPrincipal` integrando vitais, palavras-chave e checklist de pendências**
- [ ] **Step 4: Validar tipagem e compilação**
- [ ] **Step 5: Commit dos componentes da aba principal**

---

### Task 5: Componentes da Ficha - Mochila (Inventário) e Matriz 3x3

**Files:**
- Create: `apps/mobile/src/components/ficha/InventarioMobile.tsx`
- Create: `apps/mobile/src/components/ficha/CarteiraMobile.tsx`
- Create: `apps/mobile/src/components/ficha/AbaMochila.tsx`
- Create: `apps/mobile/src/components/ficha/Matriz3x3Mobile.tsx`
- Create: `apps/mobile/src/components/ficha/AbaMatriz.tsx`

**Interfaces:**
- Consumes: `FichaViva`, `calcularAlinhamentosMatriz` de `@calafrio/core`
- Produces: Aba de Mochila com carga/itens e Aba da Matriz com detecção de alinhamentos.

- [ ] **Step 1: Implementar `InventarioMobile` e `CarteiraMobile` na `AbaMochila`**
- [ ] **Step 2: Implementar `Matriz3x3Mobile` na `AbaMatriz` com grid 3x3 e destaque de alinhamentos**
- [ ] **Step 3: Validar tipagem com `@calafrio/core`**
- [ ] **Step 4: Commit das abas Mochila e Matriz**

---

### Task 6: Modais Nativos de Ação

**Files:**
- Create: `apps/mobile/src/components/modais/ModalRolagemMobile.tsx`
- Create: `apps/mobile/src/components/modais/ModalDanoCuraMobile.tsx`
- Create: `apps/mobile/src/components/modais/ModalItemMobile.tsx`
- Create: `apps/mobile/src/components/modais/ModalPalavraChaveMobile.tsx`
- Create: `apps/mobile/src/components/modais/SeletorHabilidadeMobile.tsx`

**Interfaces:**
- Consumes: `FichaViva`, catálogo de `@calafrio/core`, `rolarDado` / fórmulas
- Produces: Modais nativos responsivos com feedback tátil e interações limpas.

- [ ] **Step 1: Implementar `ModalRolagemMobile` com seleção de dados, palavras-chave e feedback haptic**
- [ ] **Step 2: Implementar `ModalDanoCuraMobile` com cálculo rápido de dano e cura**
- [ ] **Step 3: Implementar `ModalItemMobile` e `ModalPalavraChaveMobile`**
- [ ] **Step 4: Implementar `SeletorHabilidadeMobile` com busca no catálogo paranormal**
- [ ] **Step 5: Validar tipagem e compilação**
- [ ] **Step 6: Commit dos modais**

---

### Task 7: Telas e Navegação Principal

**Files:**
- Create: `apps/mobile/src/screens/HubPersonagensScreen.tsx`
- Create: `apps/mobile/src/screens/FichaPlayerScreen.tsx`
- Create: `apps/mobile/App.tsx`
- Modify: `package.json` (root) para adicionar scripts `mobile` e `mobile:web`

**Interfaces:**
- Consumes: `useGerenciadorPersonagensAsync`, `useFichaCalafrio`, telas e modais
- Produces: Fluxo completo de uso do app.

- [ ] **Step 1: Implementar `HubPersonagensScreen` com busca, criação direta, duplicação e exclusão**
- [ ] **Step 2: Implementar `FichaPlayerScreen` com header de retrato (`expo-image-picker`), atalhos de dados/dano e alternância de abas**
- [ ] **Step 3: Integrar no `App.tsx` com navegação de fluxo e adaptador do `AsyncStorage`**
- [ ] **Step 4: Validar fluxo completo**
- [ ] **Step 5: Commit da navegação**

---

### Task 8: Verificação Integrada e Testes

- [ ] **Step 1: Executar `pnpm type-check` no monorepo inteiro**
- [ ] **Step 2: Executar bateria de testes com `pnpm test`**
- [ ] **Step 3: Verificar consistência e fidelidade com o design web**
