# Arcanum-Master: Port da Engine e Regras de Negócio para Go — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Inicializar o repositório `/Users/andrewozniack/Documents/Arcanum-Master` e implementar a engine de regras agnóstica (`pkg/engine`) e os dois primeiros motores determinísticos em Go (`pkg/sistemas/t20` e `pkg/sistemas/calafrio`), com 100% de paridade de regras e cobertura de testes unitários.

**Architecture:** O núcleo em Go adota o padrão de motor funcional determinístico com servidor autoritativo (`(FichaBase, EstadoJogo, Acao) -> (FichaAtualizada, FichaDerivada, Rolagens)`). O pacote `pkg/engine` define interfaces e tipos canônicos de sistemas, enquanto cada RPG vive isolado em `pkg/sistemas/<nome>`, expondo seus catálogos, fórmulas e reducers de ação puros sem efeitos colaterais.

**Tech Stack:** Go 1.23+, `go test`, biblioteca padrão de Go, JSON tagging estrito.

**Spec:** `docs/superpowers/specs/2026-11-06-arcanum-master-design.md`

---

## Global Constraints & Principles

- **Zero dependências externas pesadas no motor:** `pkg/engine` e os módulos de regras devem usar estritamente a biblioteca padrão do Go.
- **Isolamento Total:** `pkg/sistemas/t20` e `pkg/sistemas/calafrio` não podem se importar mutuamente. Ambos dependem apenas de `pkg/engine`.
- **Pureza Funcional e Determinismo:** Funções de cálculo de ficha derivada não devem acessar disco, rede ou banco de dados.
- **TDD (Test-Driven Development):** Cada fórmula e regra (bônus de atributos em T20, alinhamentos da matriz 3×3 em Calafrio) deve ser coberta com testes unitários em `_test.go` verificando paridade com as engines legadas em TypeScript.

---

## File Structure

```
/Users/andrewozniack/Documents/Arcanum-Master/
├── go.mod
├── Makefile
├── pkg/
│   ├── engine/
│   │   ├── types.go           # Interfaces canônicas SistemaRPG, MetadadosSistema, AcaoFicha, RequisicaoRolagem
│   │   ├── modificador.go     # Estrutura padronizada de modificadores (alvo, valor, origem)
│   │   ├── registry.go        # Registry global de sistemas registrados
│   │   └── registry_test.go   # Teste do ciclo de registro de sistemas
│   └── sistemas/
│       ├── t20/
│       │   ├── modelo.go          # Structs FichaT20, FichaDerivadaT20, EstadoJogoT20
│       │   ├── catalogo.go        # Catálogo imutável (Raças, Classes, Perícias, Atributos)
│       │   ├── calculo.go         # Motor de derivação (PV, PM, Defesa, Modificadores, Bônus de Treinamento)
│       │   ├── acoes.go           # Reducer autoritativo de ações (AplicarAcao)
│       │   ├── sistema.go         # Implementação da interface SistemaRPG
│       │   └── calculo_test.go    # Testes unitários com cenários de personagens de T20
│       └── calafrio/
│           ├── modelo_2e.go       # Structs FichaCalafrio2e, FichaDerivada2e, EstadoJogo2e
│           ├── catalogo_2e.go     # Habilidades Paranormais (5 personalidades, 2 domínios), Palavras-chave, Bugigangas
│           ├── matriz_2e.go       # Algoritmo de alinhamento 3×3 (linhas, colunas, diagonais, 2×2)
│           ├── calculo_2e.go      # Motor de derivação 2e (APT, PV, PA, PD, Ecos)
│           ├── modelo_1e.go       # Structs FichaCalafrio1e, FichaDerivada1e (Corpo, Mente, Alma, Graus)
│           ├── calculo_1e.go      # Motor de derivação 1e
│           ├── sistema_2e.go      # Implementação SistemaRPG para Calafrio 2e
│           ├── sistema_1e.go      # Implementação SistemaRPG para Calafrio 1e
│           ├── matriz_2e_test.go  # Testes dos bônus geométricos da matriz 3×3
│           └── calculo_2e_test.go # Testes de cálculo de atributos e aptidão
```

---

## Tasks

### Task 1: Scaffold do Repositório Arcanum-Master & Contratos `pkg/engine`

- [x] **Step 1.1:** Criar o diretório `/Users/andrewozniack/Documents/Arcanum-Master` e inicializar o repositório git (`git init`).
- [x] **Step 1.2:** Inicializar o módulo Go (`go mod init github.com/andrewozniack/arcanum-master`).
- [x] **Step 1.3:** Escrever o teste que falha para o Registry de sistemas em `pkg/engine/registry_test.go`.
- [x] **Step 1.4:** Implementar os contratos `pkg/engine/types.go`, `pkg/engine/modificador.go` e `pkg/engine/registry.go`.
- [x] **Step 1.5:** Executar `go test ./pkg/engine/...` e validar aprovação.
- [x] **Step 1.6:** Commit das alterações (`feat(engine): scaffold repository and core engine contracts`).

---

### Task 2: Engine de Tormenta20 em Go (`pkg/sistemas/t20`)

- [x] **Step 2.1:** Modelar os tipos em `pkg/sistemas/t20/modelo.go` (`FichaT20`, `Atributos`, `FichaDerivadaT20`, `PericiaTreinada`, `ItemEquipado`).
- [x] **Step 2.2:** Portar o catálogo base em `pkg/sistemas/t20/catalogo.go` (Perícias oficiais, cálculo de modificadores de atributo padrão D&D/T20 `(valor - 10) / 2`, regras de PV/PM iniciais e por nível de classes clássicas).
- [x] **Step 2.3:** Escrever testes unitários em `pkg/sistemas/t20/calculo_test.go` cobrindo:
  - Guerreiro Nível 1 com FOR 18, DES 14, CON 16 calculando PV, PM e Defesa.
  - Arcanista Nível 3 calculando CD de magia e bônus de perícias treinadas com metade do nível.
- [x] **Step 2.4:** Implementar o motor determinístico em `pkg/sistemas/t20/calculo.go`.
- [x] **Step 2.5:** Implementar o reducer de ações em `pkg/sistemas/t20/acoes.go` (`ATUALIZAR_ATRIBUTO`, `ADICIONAR_ITEM`, `EQUIPAR_ITEM`, `GASTAR_PM`, `SOFRER_DANO`).
- [x] **Step 2.6:** Implementar `pkg/sistemas/t20/sistema.go` satisfazendo `engine.SistemaRPG` e registrando no Registry.
- [x] **Step 2.7:** Executar `go test -v ./pkg/sistemas/t20/...` e validar aprovação de todos os casos.
- [x] **Step 2.8:** Commit das alterações (`feat(t20): implement tormenta20 rules engine and actions reducer in Go`).

---

### Task 3: Algoritmo da Matriz 3×3 do Calafrio 2e em Go (`pkg/sistemas/calafrio/matriz_2e`)

- [x] **Step 3.1:** Escrever testes unitários em `pkg/sistemas/calafrio/matriz_2e_test.go` para todos os padrões de alinhamento:
  - 3 habilidades caóticas em linha horizontal (`[0,1,2]`) -> `+3 PA`.
  - 3 habilidades racionais em coluna vertical (`[0,3,6]`) -> `+3 PD`.
  - 3 habilidades esquisitas em diagonal (`[0,4,8]`) -> `+6 PV`.
  - 4 habilidades agradáveis em bloco 2×2 (`[0,1,3,4]`) -> `+3 Velocidade`.
  - Matriz com domínio misto (detectando aviso de regra).
- [x] **Step 3.2:** Implementar `pkg/sistemas/calafrio/matriz_2e.go` com os 8 alinhamentos possíveis e o bloco 2×2.
- [x] **Step 3.3:** Executar `go test -v ./pkg/sistemas/calafrio/...` para validar a geometria da matriz.
- [x] **Step 3.4:** Commit das alterações (`feat(calafrio): implement 3x3 matrix alignment solver in Go`).

---

### Task 4: Engine Completa de Calafrio (2e e 1e) em Go (`pkg/sistemas/calafrio`)

- [x] **Step 4.1:** Modelar structs de 2e (`pkg/sistemas/calafrio/modelo_2e.go`) e 1e (`pkg/sistemas/calafrio/modelo_1e.go`).
- [x] **Step 4.2:** Portar catálogo de Habilidades Paranormais e Palavras-chave em `pkg/sistemas/calafrio/catalogo_2e.go`.
- [x] **Step 4.3:** Escrever testes unitários em `pkg/sistemas/calafrio/calculo_2e_test.go` verificando paridade de cálculos com `@calafrio/core`:
  - `APT 1`: PV Base = 6, PA Base = 6, PD Base = 3, Velocidade = 6, Palavras-chave limite = 3.
  - `APT 3`: PV Base = 12, PA Base = 12, PD Base = 9, Velocidade = 6, Palavras-chave limite = 5.
  - Alinhamentos somados aos atributos derivados com rastreabilidade de origem.
- [x] **Step 4.4:** Implementar o motor 2e em `pkg/sistemas/calafrio/calculo_2e.go` e ações em `pkg/sistemas/calafrio/acoes_2e.go`.
- [x] **Step 4.5:** Implementar o motor 1e em `pkg/sistemas/calafrio/calculo_1e.go` (Corpo, Mente, Alma, Graus).
- [x] **Step 4.6:** Implementar `sistema_2e.go` e `sistema_1e.go` registrando ambos no Registry central.
- [x] **Step 4.7:** Executar `go test -v ./pkg/sistemas/calafrio/...` e garantir aprovação integral.
- [x] **Step 4.8:** Commit das alterações (`feat(calafrio): complete calafrio 1e and 2e rule engines in Go`).

---

### Task 5: Bateria Rigorosa de Testes de Paridade (Golden Fixtures JSON-to-JSON)

> **Invariante Crítico:** A estrutura de dados serializada (`FichaDerivada`) gerada pelo motor em Go deve ser **100% idêntica campo a campo** à gerada pelos motores em TypeScript de `T20-master` e `Calafrio-master`. Nenhuma chave pode faltar, mudar de nome ou ter tipos divergentes (ex.: null vs array vazio, int vs float).

- [x] **Step 5.1:** Criar scripts/fixtures de exportação nos repositórios legados (`T20-master` e `Calafrio-master`):
  - Gerar `testdata/fixtures/t20/` com pelo menos 5 cenários:
    - `01_guerreiro_nv1_basico.json` (FichaBase, EstadoJogo, FichaDerivadaEsperada)
    - `02_arcanista_nv5_magias_pm.json`
    - `03_ladino_pericias_itens.json`
    - `04_combate_dano_condicoes.json`
    - `05_multiclasse_ou_avancado.json`
  - Gerar `testdata/fixtures/calafrio/` com pelo menos 5 cenários:
    - `01_neural_apt1_inicial.json`
    - `02_matriz_alinhada_3x3_bonus.json` (todas as linhas/colunas/diagonais ativadas)
    - `03_dominio_misto_com_avisos.json`
    - `04_1e_corpo_mente_alma.json`
    - `05_estado_combate_pa_dano.json`
- [x] **Step 5.2:** Implementar em Go o runner de paridade profunda (`pkg/engine/paridade_test.go`):
  - Iterar sobre todas as fixtures `.json`.
  - Deserializar `FichaBase` e `EstadoJogo` no Go.
  - Executar `CalcularFichaDerivada`.
  - Serializar a `FichaDerivada` resultante para JSON normalizado (chaves ordenadas).
  - Executar comparação profunda com `google/go-cmp` ou asserção campo a campo contra a `FichaDerivadaEsperada`.
  - Exibir diff colorido detalhado no terminal caso haja discrepância de chaves, tipos ou arredondamentos.
- [x] **Step 5.3:** Executar `go test -v -race ./pkg/engine/...` e validar que 100% das fixtures de paridade passam com equivalência estrita.
- [x] **Step 5.4:** Commit da suíte de paridade (`test(parity): add golden fixtures and strict json-to-json parity runner`).


