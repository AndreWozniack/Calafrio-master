# Design Document: App Mobile Calafrio (Expo React Native) - Foco em Fichas de Player

**Data:** 2026-11-04  
**Status:** Proposto / Em Validação  
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
4. **Hub de Personagens Offline**: Permitir criar, duplicar, editar e excluir múltiplos personagens salvos localmente no dispositivo (AsyncStorage).
5. **Ações Rápidas de Mesa**:
   - Ajuste rápido de Vitais (Vida, Sanidade, PA, Tensão, Defesa).
   - Modal de Dano/Cura rápido.
   - Rolador de dados integrado com palavras-chave e testes de atributo.
   - Gestão de Matriz 3x3 de Habilidades com detecção de alinhamentos.
   - Gestão de Inventário com cálculo de carga e carteira.
   - Foto/Retrato do personagem via galeria (`expo-image-picker`).

### Não-Metas (Non-Goals)
- Interface de Mestre/Mesa no mobile (combate tático, grid, controle de monstros, bestiário avançado) - permanece no desktop/web.
- Conexão em tempo real via WebSocket/Drizzle DB para sincronização em nuvem nesta primeira fase (o foco é a experiência offline-first de ficha do jogador, com exportação/importação JSON se necessário).
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
- Refatorar levemente `packages/ficha-app` para expor uma interface de armazenamento plugável (`StorageAdapter`):
  ```ts
  export interface StorageAdapter {
    getItem(key: string): string | null | Promise<string | null>;
    setItem(key: string, value: string): void | Promise<void>;
    removeItem(key: string): void | Promise<void>;
  }
  ```
- O padrão na web continua sendo `localStorage`.
- No mobile, o app injeta um adaptador baseado em `@react-native-async-storage/async-storage`.

### 4.3 Experiência de Uso da Ficha Móvel
1. **Navegação**:
   - Stack simples: `Lista de Personagens (Hub)` ➔ `Ficha do Personagem`.
2. **Tela da Ficha**:
   - Barra superior com botão voltar, nome, conceito, foto e botões de atalho: D20 (Rolagens) e Caveira/Coração (Dano/Cura).
   - Navegação inferior ou sub-abas: **Ficha** (Vitais + Palavras-chave), **Mochila** (Itens + Carga + Dinheiro) e **Matriz** (Slots 3x3 + Habilidades).
3. **Feedback Tátil**:
   - Uso de `expo-haptics` em botões de incremento/decremento e no lançamento de dados.

---

## 5. Plano de Reuso de Componentes Visuais

| Componente Web Atual | Equivalente Mobile (Expo Native) | Comportamento |
| :--- | :--- | :--- |
| `EtiquetaCelular` | `EtiquetaCalafrio` (`View` + `Text` com estilo chanfrado) | Tag preta com texto serifado claro |
| `CartaoPapel` | `CartaoPapel` (`View` com fundo branco, borda/sombra) | Bloco de papel com textura visual noir |
| `PassoCelular` | `BotaoPasso` (`Pressable` arredondado com ícone +/-) | Incremento/decremento de vitais |
| `VitaisCelular` | `PainelVitaisMobile` | Grid 2 colunas com Vida, Sanidade, PA, Tensão |
| `MatrizCelular` | `Matriz3x3Mobile` | Grid 3x3 com realce de alinhamentos e modal de detalhe |
| `InventarioCelular` | `InventarioMobile` | Lista de itens com slots ocupados e toggle de equipado |
| `ModalRolagemCalafrio` | `ModalRolagemMobile` | Modal nativo (`Modal` ou bottom-sheet) com animação de dados |
| `ModalDanoCura` | `ModalDanoCuraMobile` | Aplicação rápida de dano físico ou sanidade |

---

## 6. O que fica a cargo do Builder
- Configuração exata das dependências do Expo no `apps/mobile/package.json` garantindo compatibilidade com React 19 / 18.
- Configuração de resolução de symlinks no `metro.config.js` para monorepos com pnpm.
- Carregamento de fontes locais no Expo (`@expo-google-fonts/alegreya` ou fontes TTF locais).
