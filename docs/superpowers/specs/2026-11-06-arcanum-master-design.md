# Arcanum-Master — Design de Arquitetura da Plataforma Multi-Sistema de RPG (Go Backend + WebSocket + React Front)

## 1. Intenção e Motivação (O Porquê)
Criar o **`Arcanum-Master`** (`/Users/andrewozniack/Documents/Arcanum-Master`), uma plataforma web moderna, autoritativa e extensível para jogos de RPG de mesa (VTT / Gestão de Mesas, Fichas Vivas e Consulta de Livros). 

A plataforma consolida as experiências de **`T20-master`** (Tormenta20) e **`Calafrio-master`** (Calafrio 1e e 2e) sob uma nova arquitetura desacoplada de alto desempenho:
* **Backend Autoritativo em Go (Golang)**: Hospeda a **Engine Central de Regras**, orquestração de salas em tempo real via **WebSockets**, persistência e o módulo **Arcanum** de ingestão e busca de PDFs.
* **Frontend Rico em React / TypeScript**: Atua como o visualizador interativo das folhas de papel, cards do Mestre, rolador 3D (`@3d-dice`) e leitor de manuais, comunicando-se com o servidor exclusivamente por ações via WebSocket e endpoints HTTP auxiliares.
* **Extensibilidade Multi-Sistema**: Estrutura modular em Go (`pkg/sistemas/*`) preparada para plugar novos sistemas rapidamente, com foco futuro em **Shadowdark** e **Old School Essentials (OSE)**.

---

## 2. Metas, Não-Metas e Anti-Metas

### 2.1. Metas (Goals)
* **Servidor Autoritativo em Go**: Toda a matemática de atributos, acúmulo de bônus, validação de regras e gastos de recursos (PV, PM, PA) é calculada e validada pelo backend em Go, eliminando trapaças ou inconsistências.
* **Comunicação em Tempo Real via WebSocket**:
  * Ao abrir uma ficha ou mesa, o cliente estabelece uma conexão WebSocket persistente (`ws://` ou `wss://`).
  * Edições e ações do jogador enviam eventos (`AcaoFicha`) e o Go devolve em < 2ms o estado derivado completo (`FichaDerivada`), com broadcast imediato para o Mestre.
* **Módulo Arcanum Nativo em Go**: Processamento de PDFs de alta performance (extração, chunking, busca textual veloz e suporte a streaming de respostas de IA).
* **Fidelidade Visual das Fichas**: Componentes React dedicados que reproduzem fielmente o design das folhas de papel de cada jogo (Tormenta20, Calafrio 1e/2e, Shadowdark).
* **Rolador 3D Integrado**: Eventos de rolagem de dados disparados pelo WebSocket são orquestrados no client pelo `@3d-dice` sincronizados entre todos na mesa.

### 2.2. Não-Metas (Non-Goals)
* Não implementar battlemaps com grid tático ou tokens dinâmicos nesta fase (foco estrito em Fichas Vivas, Gestão de Mesas, Teatro da Mente e Consulta de Regras via Arcanum).
* Não duplicar a engine em duas linguagens: a lógica de regras é 100% de responsabilidade do Go; o frontend apenas renderiza a `FichaDerivada` recebida e dispara ações.

### 2.3. Anti-Metas
* **Bloqueio de UI por latência**: A interface do frontend deve aplicar atualizações otimistas ou resposta imediata via WebSocket com debouncing em campos de texto livre.
* **Vazamento de Regras no Banco**: Nenhuma coluna específica de jogo (ex: `forca`, `pm`, `apt`) no banco de dados. Tudo é armazenado em JSONB agnóstico no Postgres.
* **Acoplamento entre Módulos de Jogos**: As regras de Tormenta20 e Calafrio devem viver em pacotes Go isolados (`pkg/sistemas/t20` e `pkg/sistemas/calafrio`).

---

## 3. Arquitetura do Sistema

```
                             [ NAVEGADOR / CLIENTE ]
                     React + Tailwind + @3d-dice (Ficha & Mesa)
                                      ▲
                                      │  WebSockets (Ações & FichaDerivada)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       BACKEND AUTORITATIVO EM GO                            │
│                                                                             │
│  ┌───────────────────────┐   ┌───────────────────────────────────────────┐  │
│  │   Gateway & Roteador  │   │          Módulo Arcanum (PDF Engine)      │  │
│  │  (Fiber/Chi + WS Hub) │   │  • Parser de PDF   • Busca Textual / RAG  │  │
│  └──────────┬────────────┘   └───────────────────────────────────────────┘  │
│             │                                                               │
│             ▼                                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      ENGINE MULTI-SISTEMA EM GO                       │  │
│  │                                                                       │  │
│  │   pkg/engine          pkg/sistemas/t20        pkg/sistemas/calafrio   │  │
│  │  (Contrato Geral)   (Classes, Magias, Mod)   (Matriz 3x3, Aptidão)    │  │
│  │                                                                       │  │
│  │   pkg/sistemas/shadowdark (Futuro)                                    │  │
│  └──────────────────────────────────┬────────────────────────────────────┘  │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      ▼
                         [ BANCO POSTGRESQL (Drizzle/pgx) ]
                      Mesas, Usuários, Personagens (JSONB)
```

---

## 4. Modelagem e Contratos em Go

### 4.1. Contrato Canônico da Engine (`pkg/engine/sistema.go`)
```go
package engine

type MetadadosSistema struct {
    ID             string `json:"id"`             // ex: "t20", "calafrio-2e", "shadowdark"
    Nome           string `json:"nome"`           // ex: "Tormenta20"
    Versao         string `json:"versao"`
    Descricao      string `json:"descricao"`
    CorPrimaria    string `json:"corPrimaria"`
}

type AcaoFicha struct {
    Tipo      string         `json:"tipo"`      // ex: "ATUALIZAR_CAMPO", "ADICIONAR_ITEM", "USAR_HABILIDADE"
    Payload   map[string]any `json:"payload"`
}

type RequisicaoRolagem struct {
    Rotulo     string         `json:"rotulo"`
    Expressao  string         `json:"expressao"` // ex: "1d20+7"
    Tipo       string         `json:"tipo"`
    Origem     string         `json:"origem"`
}

type SistemaRPG interface {
    Metadados() MetadadosSistema
    CriarFichaVazia(id, nome string) (any, error)
    CalcularFichaDerivada(fichaBase any, estadoJogo any) (any, []string, error)
    AplicarAcao(fichaBase any, estadoJogo any, acao AcaoFicha) (fichaAtualizada any, estadoAtualizado any, rolagens []RequisicaoRolagem, err error)
    ObterCatalogo() any
    TabelasAleatorias() []TabelaAleatoria
}
```

### 4.2. Protocolo de WebSocket (`pkg/websocket/hub.go`)
Mensagens trocadas entre Client e Servidor:
* **Client -> Servidor**:
  * `ENTRAR_SALA { mesaId, personagemId }`
  * `DESPACHAR_ACAO { personagemId, acao: AcaoFicha }`
  * `DISPARAR_ROLAGEM { expressao, rotulo }`
  * `CONSULTAR_ARCANUM { termo, livroId }`
* **Servidor -> Client**:
  * `FICHA_ATUALIZADA { personagemId, fichaBase, fichaDerivada, avisos }`
  * `MESA_ESTADO { participantes, cardsMestre }`
  * `ROLAGEM_RESULTADO { id, jogador, expressao, total, dadosIndividuais }`
  * `ARCANUM_RESPOSTA { trechos, pagina, texto }`

---

## 5. Estrutura do Novo Repositório `Arcanum-Master`

```
Arcanum-Master/
├── apps/
│   ├── api/                     # Backend em Go (Go 1.23+)
│   │   ├── cmd/server/          # Entrypoint main.go
│   │   ├── pkg/
│   │   │   ├── engine/          # Interfaces canônicas SistemaRPG
│   │   │   ├── sistemas/        # Módulos de regras
│   │   │   │   ├── t20/         # Tormenta20 (Catálogo, Fórmulas, Ações)
│   │   │   │   ├── calafrio/    # Calafrio 1e e 2e
│   │   │   │   └── shadowdark/  # Futuro Shadowdark
│   │   │   ├── websocket/       # Gerenciador de conexões, salas e broadcast
│   │   │   ├── arcanum/         # Extrator de PDFs, Busca e Integração RAG
│   │   │   └── db/              # Conexão pgx e queries SQL
│   │   ├── go.mod
│   │   └── Dockerfile
│   └── web/                     # Frontend em React / Next.js
│       ├── src/
│       │   ├── components/      # UI Shell, Rolador 3D, Arcanum Reader
│       │   ├── sistemas/        # Componentes de Folhas de Papel (T20, Calafrio)
│       │   ├── hooks/           # useMesaSocket, useFichaSocket
│       │   └── app/             # Rotas /mesas, /fichas, /arcanum
│       ├── package.json
│       └── Dockerfile
├── docker-compose.yml           # Postgres + API (Go) + Web (Next.js)
└── README.md
```

---

## 6. Fases de Execução

1. **Fase 1: Fundação do Repositório & Backend Go com WebSocket**
   * Criação do repositório em `/Users/andrewozniack/Documents/Arcanum-Master`.
   * Servidor Go com WebSocket Hub por Mesa/Ficha e persistência em Postgres.
   * Frontend Next.js com conexão WebSocket e integração do rolador 3D.
2. **Fase 2: Motor Tormenta20 em Go & Ficha de T20 no Front**
   * Portar catálogo e lógica de cálculo de T20 para Go (`pkg/sistemas/t20`).
   * Conectar a folha visual de T20 no front ao WebSocket autoritativo.
3. **Fase 3: Motor Calafrio em Go & Fichas 2e e 1e no Front**
   * Portar matriz 3×3, aptidão, domínios e regras de 1e para Go (`pkg/sistemas/calafrio`).
   * Conectar as fichas de papel de Calafrio ao WebSocket.
4. **Fase 4: Módulo Arcanum & Preparação para Shadowdark**
   * Ingestão de PDFs e busca de regras rápida com streaming via WebSocket em Go.
   * Definição dos tipos de dados para Shadowdark.
