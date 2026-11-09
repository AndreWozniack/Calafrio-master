# Arcanum-Master: Servidor WebSocket Total, Resiliente e Monitorado em Go — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar o servidor WebSocket Total em Go para o `Arcanum-Master` em `/Users/andrewozniack/Documents/Arcanum-Master`, capaz de trafegar 100% dos fluxos de dados (RPC request-response com `correlationId`, pub-sub de salas de mesa e fichas, broadcast de rolagens), com heartbeat/deadman switch, reconexão resiliente e instrumentação completa de métricas/monitoramento em tempo real (Prometheus + `/health` + JSON stats).

**Architecture:** O subsistema de WebSocket utiliza o padrão de **Hub Concorrente com Channels e Goroutines isoladas por cliente** (`readPump` e `writePump`), eliminando contenção de I/O. As mensagens utilizam um **Envelope Canônico Uniforme** com `correlationId` para suportar tanto chamadas estilo RPC (cliente espera resposta específica) quanto eventos assíncronos (broadcast de sala). Um subsistema de **Métricas Atômicas e Logger Estruturado** rastreia conexões vivas, latência de comandos em microssegundos, taxas de throughput e falhas.

**Tech Stack:** Go 1.23+, `github.com/gorilla/websocket`, `net/http`, sync/atomic, testes com `net/http/httptest`.

**Spec:** `docs/superpowers/specs/2026-11-06-arcanum-master-design.md`

---

## Global Constraints & Principles

- **Envelope Canônico Obrigatório:** Toda e qualquer mensagem que trafega no WebSocket deve seguir a estrutura `Envelope { ID, Tipo, Topico, Payload, Erro, Timestamp }`.
- **I/O Isolado e Seguro:** Uma conexão WebSocket nunca deve ter escritas concorrentes diretas; toda escrita passa pelo canal de buffer do `writePump`.
- **Deadman Switch (Heartbeat):** `readPump` monitora `Pong` com `SetReadDeadline(now + pongWait)`. Se o cliente não responder ao `Ping` em até 60s, a conexão é encerrada de forma limpa e os recursos são liberados.
- **Graceful Shutdown:** Ao receber `SIGINT` ou `SIGTERM`, o servidor envia mensagem de encerramento amigável para todos os clientes conectados e drena os buffers antes de fechar o processo.
- **Monitoramento em Primeiro Lugar:** Toda mensagem recebida, comando executado ou desconexão atualiza métricas e emite logs estruturados com latência de execução.

---

## File Structure

```
/Users/andrewozniack/Documents/Arcanum-Master/
├── go.mod
├── cmd/
│   └── server/
│       ├── main.go                # Entrypoint com servidor HTTP/WS, graceful shutdown e endpoints /ws, /health, /metrics
│       └── main_test.go           # Teste de inicialização e rotas do servidor
└── pkg/
    ├── metrics/
    │   ├── metrics.go             # Coletor thread-safe de métricas (ativas, total_msgs, latência, erros)
    │   └── metrics_test.go        # Testes das métricas atômicas
    └── websocket/
        ├── envelope.go            # Struct Envelope, tipos de mensagem canônicos e helpers de serialização
        ├── client.go              # Client struct, buffers, readPump, writePump e controle de ping/pong
        ├── hub.go                 # Hub central, salas (mesas/fichas), registro/desregistro e broadcast seletivo
        ├── dispatcher.go          # Roteador de comandos (despacha para as engines de T20, Calafrio, etc.)
        ├── handler.go             # Handler HTTP de upgrade para WebSocket com validação de origem
        ├── hub_test.go            # Teste de concorrência, broadcast e isolamento de salas
        └── dispatcher_test.go     # Teste de execução de comandos (ações de ficha, rolagens) via WebSocket
```

---

## Tasks

### Task 1: Envelope Canônico e Subsistema de Métricas & Monitoramento

- [x] **Step 1.1:** Adicionar dependência `github.com/gorilla/websocket` no `go.mod`.
- [x] **Step 1.2:** Escrever teste de métricas em `pkg/metrics/metrics_test.go` cobrindo incremento de conexões ativas, cálculo de latência de comandos e contagem de mensagens.
- [x] **Step 1.3:** Implementar `pkg/metrics/metrics.go` com contadores atômicos (`atomic.Int64`), histogramas básicos de latência e exportação de snapshot em JSON e formato compatível com Prometheus.
- [x] **Step 1.4:** Implementar `pkg/websocket/envelope.go` com `Envelope`, tipos de comando (`ENTRAR_MESA`, `SAIR_MESA`, `EXECUTAR_ACAO_FICHA`, `DISPARAR_ROLAGEM`, `CHAT_MENSAGEM`, `ERRO`, `ACK`) e construtores de resposta com `CorrelationID`.
- [x] **Step 1.5:** Executar `go test -v ./pkg/metrics/...` e validar aprovação.
- [x] **Step 1.6:** Commit das alterações (`feat(websocket): add canonical envelope and metrics collector`).

---

### Task 2: Hub Central de Conexões e Salas (Pub/Sub Resiliente)

- [x] **Step 2.1:** Escrever testes de concorrência e gerenciamento de salas em `pkg/websocket/hub_test.go`:
  - Entrada de múltiplos clientes na mesma sala de mesa.
  - Broadcast de mensagem restrito aos clientes daquela sala.
  - Desconexão limpa de um cliente com remoção automática de todas as salas.
  - Broadcast global de sistema para avisos de manutenção.
- [x] **Step 2.2:** Implementar `pkg/websocket/hub.go` com mapas de clientes protegidos por `sync.RWMutex`, agrupamento por `mesaId`, canais de registro/desregistro assíncronos e hooks de métricas.
- [x] **Step 2.3:** Executar `go test -race -v ./pkg/websocket/...` e garantir ausência de race conditions.
- [x] **Step 2.4:** Commit das alterações (`feat(websocket): implement resilient room-based hub`).

---

### Task 3: Client WebSocket com Read/Write Pumps, Heartbeat e Backpressure

- [x] **Step 3.1:** Implementar `pkg/websocket/client.go`:
  - `Client` com buffer configurável de saída (`send chan []byte`).
  - `readPump`: deadman switch com `SetReadDeadline`, leitura contínua e repasse para o dispatcher.
  - `writePump`: ticker de `Ping` periódico (a cada 20s), escrita atômica de mensagens e graceful close.
  - Prevenção de bloqueio: se o buffer do cliente lotar (slow consumer), drop controlado com métrica de `buffer_overflow` e encerramento seguro.
- [x] **Step 3.2:** Implementar `pkg/websocket/handler.go` com `Upgrader` do Gorilla WebSocket, permissão de CORS configurável e criação do ciclo de vida do `Client`.
- [x] **Step 3.3:** Escrever testes de ciclo de vida e timeout do cliente usando `net/http/httptest` em `pkg/websocket/client_test.go`.
- [x] **Step 3.4:** Commit das alterações (`feat(websocket): implement client read/write pumps with heartbeat and backpressure`).

---

### Task 4: Dispatcher de Comandos e Integração com as Engines de RPG

- [x] **Step 4.1:** Escrever testes unitários em `pkg/websocket/dispatcher_test.go`:
  - Cliente envia `EXECUTAR_ACAO_FICHA` para T20 -> Dispatcher chama `SistemaT20.AplicarAcao` -> responde com `ACK` + `FICHA_ATUALIZADA` para o cliente e broadcast para a mesa.
  - Cliente envia `EXECUTAR_ACAO_FICHA` para Calafrio 2e -> Dispatcher atualiza matriz 3x3 e emite a nova ficha derivada com bônus de alinhamento.
  - Cliente envia `DISPARAR_ROLAGEM` -> Dispatcher resolve a rolagem, emite para o orquestrador 3D e faz broadcast para a mesa.
  - Envio de comando com `CorrelationID` -> Servidor devolve resposta com o mesmo `CorrelationID` para resolução de Promises no front.
- [x] **Step 4.2:** Implementar `pkg/websocket/dispatcher.go` integrando o `engine.Registry` (T20 e Calafrio).
- [x] **Step 4.3:** Executar `go test -race -v ./pkg/websocket/...` e validar aprovação de todos os fluxos.
- [x] **Step 4.4:** Commit das alterações (`feat(websocket): implement command dispatcher wired to rpg engine registry`).

---

### Task 5: Servidor HTTP/WS Completo, Monitoramento & Graceful Shutdown

- [x] **Step 5.1:** Implementar `cmd/server/main.go`:
  - Inicialização do Registry com T20 e Calafrio registrados.
  - Inicialização do Hub e do Coletor de Métricas.
  - Endpoints:
    - `/ws`: Endpoint WebSocket do aplicativo.
    - `/health`: Liveness e readiness check em JSON (uptime, conexões ativas, status do hub).
    - `/metrics`: Exportação de métricas completas de monitoramento (mensagens/segundo, latência média e p99, erros).
  - Captura de sinais do sistema operacional (`os.Interrupt`, `syscall.SIGTERM`) com drenagem de conexões em até 10 segundos.
- [x] **Step 5.2:** Escrever teste de ponta a ponta em `cmd/server/main_test.go` simulando conexão WebSocket real, execução de comando, verificação de métricas em `/health` e shutdown limpo.
- [x] **Step 5.3:** Executar `go test -race -v ./...` no repositório inteiro e certificar cobertura total e estabilidade.
- [x] **Step 5.4:** Commit final da Task (`feat(server): complete websocket server with monitoring and graceful shutdown`).

