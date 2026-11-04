# Calafrio Master (2ª Edição — Outubro de 2026)

Port oficial e engine viva da **2ª Edição de Calafrio RPG**, adaptado da arquitetura modular do T20-master em um monorepo completamente desacoplado, determinístico e nativo.

> **Cenário & Tom:** Terror psicológico, mistério investigativo urbano e submundo paranormal nas esquinas nebulosas de Curitiba.

---

## 🏗️ Arquitetura do Monorepo

O projeto é estruturado com **pnpm workspaces**, TypeScript estrito, Next.js 16 (App Router + Turbopack), Tailwind CSS v4, Lucide Icons e Vitest:

```
Calafrio-master/
├── packages/
│   ├── tema/             # Tokens, paletas das 5 personalidades, domínios e espectros de dano
│   ├── core/             # Engine pura determinística (TS puro, sem dependência de React/Next)
│   │   ├── catalogo/     # 60 Habilidades, 100 Ocupações, 100 Palavras, 100 Bugigangas, Arsenal, PDFs
│   │   ├── ficha/        # Ficha, FichaDerivada, Matriz 3×3, Efeitos Narrativos Abertos, Mitigação de Dano
│   │   ├── bestiario/    # Motor de ameaças, escalonamento por APT e multiplicadores de dano
│   │   └── rolagem/      # Testes de Ação (d20 + APT), Contestações (piso PD), Críticos e Falhas Naturais
│   └── ficha-app/        # Reducer de estado puro e hooks React (useFichaCalafrio com LocalStorage)
├── apps/
│   └── web/              # Interface viva Next.js 16 com Tailwind v4 e layout fiel ao PDF oficial
│       ├── src/app/
│       │   ├── page.tsx        # Ficha Viva de 2 Páginas + Assistente de Criação
│       │   ├── biblioteca/     # 60 Habilidades, Tabelas d100, Arsenal e Leitor de PDFs
│       │   ├── bestiario/      # Criador de Monstros/NPCs e Simulador de Dano
│       │   └── mesa/           # Mesa de Combate em Tempo Real (Roda, Ações, Dano PA)
│       └── public/assets/calafrio/ # PDFs oficiais integrados (Habilidades, Consulta e Ficha)
├── Dockerfile            # Container multi-stage pronto para produção
└── docker-compose.yml    # Execução isolada em container (porta 3000)
```

---

## ⚡ Como Rodar

### Modo 1: Local (Nativo)

Pré-requisitos: Node.js 22+ e `pnpm` (v10+).

```bash
# 1. Instalar dependências
pnpm install

# 2. Rodar suite de testes automatizados
pnpm test

# 3. Validar tipagem TypeScript
pnpm type-check

# 4. Iniciar servidor de desenvolvimento (porta 3000)
pnpm dev
```

Acesse em seu navegador: [http://localhost:3000](http://localhost:3000).

---

### Modo 2: Docker Container

Para rodar em um container isolado sem poluir seu ambiente:

```bash
# Construir imagem e subir container
docker compose up --build

# Para rodar em background
docker compose up -d
```

Acesse em: [http://localhost:3000](http://localhost:3000).

---

## 🎮 Funcionalidades Principais

### 1. Ficha Viva de 2 Páginas (`/`)
- **Página 1 (Frente):**
  - Identidade (Nome, Jogador, Ocupação, Personalidade, Aptidão, Carteira em F$).
  - Vitais (`PV`: $3 + 3 \times \text{APT}$, `PA`: $3 + 3 \times \text{APT}$, `PD`: $3 \times \text{APT}$, `VEL`: 6m).
  - Gestão de Palavras-chave ($2 + \text{APT}$ slots com suporte a palavras extras concedidas pelo Mestre).
  - Inventário & Parartefatos (com peso, espaços ocupados e notas).
- **Página 2 (Verso):**
  - **Matriz 3×3 (#1 a #9):** Alocação de habilidades com cálculo automático e reativo dos bônus de alinhamento:
    - Linha Horizontal: `+3 PA`
    - Coluna Vertical: `+3 PD`
    - Diagonal: `+6 PV`
    - Quadrante 2×2: `+3 VEL`
  - Ecos & Habilidades Únicas (custos em PA/PV, efeitos abertos).
  - Companheiros, Lacaios e Djanhos.
  - Relatório de Auditoria e Proveniência de Regras.

### 2. Biblioteca & Leitor de PDFs Oficiais (`/biblioteca`)
- **60 Habilidades Paranormais:** Filtros em tempo real por personalidade (*Maneiro, Caótico, Esquisito, Racional, Agradável*), domínio (*Positivo/Negativo*), tipo de ação e foco.
- **Sorteadores d100:** Sorteio instantâneo de Ocupações, Palavras-chave genéricas e Bugigangas.
- **Arsenal Mundano & Suporte:** Tabela completa de armas e regras de Familiares, Lacaios e Djanhos.
- **Glossário Oficial:** Termos canônicos de Calafrio 2e explicados.
- **Visualizador de PDF Embutido:** Acesso direto aos 3 PDFs oficiais do sistema.

### 3. Bestiário Pluggable (`/bestiario`)
- Criação rápida de Ameaças, NPCs, Lacaios e Estruturas escalonadas automaticamente por Aptidão (APT 1 a 6).
- Configuração de resistências, imunidades e vulnerabilidades aos 5 espectros de dano (*Físico, Castanho, Rubro, Cerúleo, Alvo*).
- Simulador de dano e notas narrativas para o Mestre.

### 4. Mesa de Combate em Tempo Real (`/mesa`)
- Turnos em sentido horário (ordem em roda).
- Rodadas de 6 segundos.
- Controle de ações por turno (2 Padrão + 1 Livre) e 1 Reflexo por rodada.
- Mitigação de dano 1:1 utilizando Ânimum (PA) antes de reduzir Pontos de Vida (PV).
- Alerta automático de inconsciência ao atingir 0 PV (timer de morte que cai pela metade a cada queda).

---

## 🧪 Testes e Qualidade

- **Clean Code & SOLID:** Módulos pequenos e coesos (todos os componentes UI < 290 linhas).
- **TS Puro no Core:** `@calafrio/core` e `@calafrio/ficha-app` rodam no Node, browser e React Native sem acoplamento.
- **Testes Unitários:** Executados via Vitest cobrindo catálogos, fórmulas, bônus de matriz, contestações e reducers.
