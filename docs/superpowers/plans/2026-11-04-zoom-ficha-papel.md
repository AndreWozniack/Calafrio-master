# Zoom Determinístico na Ficha Viva Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar controle determinístico de zoom na Ficha Viva (90%, 100%, 115%, 130%) com persistência automática no `localStorage` do usuário.

**Architecture:** A Folha de Papel já utiliza unidades proporcionais de container (`cqw`), permitindo que a ampliação do container redimensione todo o conteúdo (textos, dados, badges, matriz) de forma matemática e vetorial. O estado de zoom é gerenciado no cliente com sincronização imediata em `calafrio:ficha:zoom:v1` no `localStorage`, refletindo na barra de navegação da ficha e nos limites de largura (`max-w`) do container da folha.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide React (`ZoomIn`), Vitest.

---

### Task 1: Definição dos tipos e constantes de Zoom
- [ ] Adicionar tipo `NivelZoomFicha` e dicionário com larguras e rótulos em `apps/web/src/components/ficha/fichas-tipos.ts`.
- [ ] Criar teste unitário para validar cálculo das dimensões de zoom e chave de persistência.

### Task 2: Componente do Seletor de Zoom
- [ ] Criar `apps/web/src/components/ficha/seletor-zoom-ficha.tsx` com estilo estético Calafrio 2e (pills com bordas pretas nítidas, hover e estado ativo).
- [ ] Exibir ícone `ZoomIn` e as 4 opções: `90%`, `100%`, `115%`, `130%`.

### Task 3: Integração no VisualizadorPapel e FolhaPapel
- [ ] Atualizar `FolhaPapel` para aceitar `zoom?: NivelZoomFicha` ajustando `max-w` dinamicamente conforme o nível.
- [ ] Atualizar `VisualizadorPapel` para propagar o zoom para cada folha renderizada.

### Task 4: Integração na FichaLiveClient com Persistência
- [ ] Adicionar estado `zoom` com inicialização e efeito para `localStorage.getItem("calafrio:ficha:zoom:v1")`.
- [ ] Ajustar largura máxima do container na `FichaLiveClient` para acomodar os níveis 115% e 130% sem corte.
- [ ] Posicionar o `SeletorZoomFicha` na barra de ações da ficha desktop.

### Task 5: Verificação e Testes
- [ ] Executar type-check e vitest.
- [ ] Validar comportamento em modo 1 página e modo 2 páginas.
