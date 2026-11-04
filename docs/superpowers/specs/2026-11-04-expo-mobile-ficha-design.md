# Design Document: App Mobile Calafrio (Expo React Native) - Foco em Fichas de Player

**Data:** 2026-11-04  
**Status:** Aprovado  
**Escopo:** `apps/mobile`, `packages/ficha-app`, `packages/core`

---

## 1. Contexto e Motivação
O sistema Calafrio é um RPG de horror e investigação com regras próprias e estética marcante (alto contraste preto e branco, estilo papel impresso, etiquetas hexagonais, tipografia serifada e temática noir). 

Atualmente, o monorepo conta com uma aplicação web (`apps/web` em Next.js) e pacotes compartilhados (`@calafrio/core` e `@calafrio/ficha-app`). Existe uma necessidade crucial durante as sessões de jogo presenciais e remotas: **jogadores utilizarem seus smartphones como fichas interativas de personagem**, de forma rápida, offline-first e com fidelidade estética absoluta à versão física e à interface mobile já prototipada na web.

---

## 2. Metas, Não-Metas e Anti-Metas

### Metas (Goals)
1. **App Mobile Expo (`apps/mobile`)**: Criar uma aplicação React Native com Expo integrada ao monorepo pnpm.
2. **Fidelidade Visual Absoluta**: Replicar fielmente o design sombrio de papel, tipografia (Alegreya/Cinzel/Mono), tags pretas chanfradas, botões táteis e estrutura das 3 abas principais da ficha celular (`Ficha`, `Mochila`, `Matriz`).
3. **Reaproveitamento de Lógica**: Consumir diretamente `@calafrio/core` (regras, cálculos derivados, catálogo de habilidades) e `@calafrio/ficha-app` (reducer de ações, hooks de estado e cálculo de vitais).
4. **Hub de Personagens Offline**: Permitir listar, buscar, criar, duplicar e excluir múltiplos personagens salvos localmente no dispositivo (AsyncStorage).
5. **Criação Ágil com Indicador de Pendências (Guia Não-Bloqueante)**:
   - Criação direta da ficha com abertura imediata na tela de edição.
   - Indicador/checklist discreto de pendências (ex: avisos de campos vazios como "Adicionar conceito", "Faltam palavras-chave", "Slots vazios na Matriz") que atualiza em tempo real até a ficha estar 100% pronta.
6. **Ações Rápidas e Interativas de Mesa**:
   - Ajuste rápido de Vitais conforme `@calafrio/core`: **PV (Vida)**, **PA (Ânimum/Ação)**, **APT (Aptidão)**, **PD (Defesa)**, **Velocidade** e **Ecos**.
   - Modal de Dano / Cura rápido (ajustes diretos com cálculo e feedback).
   - Rolador de dados integrado com palavras-chave, dados extras e testes de perícia/atributo.
   - Gestão de Matriz 3x3 de Habilidades com detecção de alinhamentos e modais de seleção de habilidades do catálogo (`HABILIDADES_PARANORMAIS_CATALOGO`) e habilidades únicas.
   - Gestão de Inventário com cálculo de carga e carteira, adição/edição de itens.
   - Foto/Retrato do personagem via galeria (`expo-image-picker`) com redimensionamento e compressão local (`expo-image-manipulator`).

### Não-Metas (Non-Goals)
- Interface de Mestre/Mesa no mobile (combate tático, grid, controle de monstros, bestiário avançado) - permanece no desktop/web.
- Conexão em tempo real via WebSocket/Drizzle DB para sincronização em nuvem nesta primeira fase (o foco é a experiência offline-first de ficha do jogador, com exportação/importação JSON opcional).
- Leitor de PDF do livro de regras no mobile (manter focado na ficha).

### Anti-Metas (Anti-Goals)
- Não usar webviews para renderizar a ficha. O app deve ser nativo puro com resposta tátil instantânea.
- Não descaracterizar a identidade visual noir/gótica do Calafrio (não usar componentes genéricos de Material Design ou iOS padrão sem a customização de tema).
- Não alterar ou quebrar o funcionamento e os testes existentes de `apps/web` e `packages/core`.

---

## 3. Abordagens Consideradas

### Abordagem 1: Expo + NativeWind espelhando a UI móvel (ESCOLHIDA)
- **Descrição:** Mantemos `@calafrio/core` e `@calafrio/ficha-app` para regras e estado. No novo app `apps/mobile`, utilizamos Expo com NativeWind (Tailwind CSS para React Native), carregamos as fontes oficiais e construímos os componentes nativos (`View`, `Text`, `Pressable`, ícones vetoriais) espelhando a estrutura visual de `apps/web/src/components/ficha/celular/*`.
- **Por que foi escolhida:** Garante a mais alta performance nativa, fidelidade visual precisa ao design de `celular/` e não compromete a estabilidade do Next.js 16 na web.

### Abordagem 2: Componentes Universais (`react-native-web` no Next.js) (DESCARTADA)
- **Descrição:** Reescrever a UI da ficha em um pacote único com primitivos de React Native e forçar o Next.js a compilar React Native Web.
- **Por que foi descartada:** Gera alto atrito de bundler com Next.js 16 e Tailwind CSS v4, compromete a renderização e impressão da folha A4 e gera fragilidade desnecessária no projeto.

---

## 4. Arquitetura e Decisões Técnicas

### 4.1 Estrutura do Monorepo
```
calafrio-master/
├── apps/
│   ├── web/                     # Next.js 16 (Mesa, Mestre, Bestiário, Ficha Web)
│   └── mobile/                  # [NOVO] Expo React Native App (Fichas dos Players)
│       ├── app/ (ou src/)
│       │   ├── screens/         # Hub de Personagens, Ficha Ativa
│       │   ├── components/      # Blocos, Vitais, Matriz, Mochila, Modais
│       │   └── theme/           # Cores, fontes e estilos Calafrio
│       ├── app.json
│       ├── package.json
│       ├── metro.config.js
│       └── tailwind.config.js
├── packages/
│   ├── core/                    # Regras, tipos, catálogos, fórmulas
│   ├── ficha-app/               # Reducer, hooks, adaptadores de storage
│   └── tema/                    # Paleta de cores, tipografia, tokens
```

### 4.2 Abstração de Armazenamento (`packages/ficha-app`)
Atualmente, `armazenamento.ts` em `packages/ficha-app` usa `localStorage` do browser diretamente.  
**Decisão:**
- Preservar funções existentes síncronas (`lerPersonagensSalvos`, `gravarLista`) para que `apps/web` permaneça 100% inalterado.
- Adicionar no `@calafrio/ficha-app` suporte a armazenamento assíncrono para o mobile (via `@react-native-async-storage/async-storage`), fornecendo um hook adaptado ou permitindo injetar storage assíncrono com tratamento de estado de carregamento (`carregando: boolean`).

### 4.3 Persistência de Imagens e Retratos
- O jogador seleciona a imagem com `expo-image-picker`.
- Usamos `expo-image-manipulator` para redimensionar (largura máxima 400px, JPEG qualidade 0.7-0.8) e obter uma string Base64 compacta (~30KB), mantendo o retrato embutido diretamente no JSON do personagem com carregamento instantâneo e offline, idêntico à web.

### 4.4 Experiência de Uso da Ficha Móvel
1. **Navegação**:
   - `Hub de Personagens (HubPersonagensScreen)` ➔ `Ficha do Personagem (FichaPlayerScreen)`.
2. **Criação e Indicadores de Pendência**:
   - Ao tocar em "Criar", solicita nome (ou gera nome padrão provisório) e abre a ficha imediatamente.
   - Um cartão colapsável no topo da ficha lista pendências sugeridas (ex: `Falta definir conceito`, `+2 palavras-chave recomendadas`, `Slots de habilidade vazios`). Cada item do checklist tem um atalho que foca ou abre o modal respectivo.
3. **Tela da Ficha**:
   - Barra superior com botão voltar, nome, conceito, foto e botões de atalho: D20 (Rolagens) e Caveira (Dano/Cura).
   - Abas principais: **Ficha** (Vitais + Palavras-chave), **Mochila** (Itens + Carga + Dinheiro) e **Matriz** (Slots 3x3 + Habilidades).
4. **Modais do Sistema**:
   - `ModalRolagemMobile`: Seleção de palavra-chave, modificador, dados extras e cálculo de sucessos.
   - `ModalDanoCuraMobile`: Ajuste rápido de PV e PA com motivo.
   - `ModalItemMobile`: Adicionar e editar itens da mochila (nome, slots, descrição).
   - `ModalPalavraChaveMobile`: Adicionar e editar palavras-chave.
   - `SeletorHabilidadeMobile`: Busca e alocação de habilidades paranormais do catálogo em um slot da matriz.
   - `ModalHabilidadeUnicaMobile`: Criação de habilidade única (nome, custo PA, ação).
5. **Feedback Tátil**:
   - Uso de `expo-haptics` em botões de incremento/decremento e no lançamento de dados.

---

## 5. O que fica a cargo do Builder
- Configuração exata das dependências do Expo no `apps/mobile/package.json` compatíveis com o SDK do Expo.
- Configuração de resolução de symlinks no `metro.config.js` para monorepos com pnpm.
- Carregamento de fontes locais no Expo (`Alegreya` e fontes de apoio).
