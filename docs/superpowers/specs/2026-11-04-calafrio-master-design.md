# Calafrio-master — Design de Arquitetura e Sistema (Calafrio 2e)

## 1. Intenção e Motivação (O Porquê)

Construir o **`Calafrio-master`** (`/Users/andrewozniack/Documents/Calafrio-master`), um aplicativo web e motor de regras completo para o sistema **Calafrio TTRPG (2ª Edição — Outubro de 2026)**, criado a partir da fundação arquitetural e de infraestrutura já validada no `T20-master`, mas em um **repositório e container independentes**.

Embora compartilhe a filosofia de engenharia do `T20-master` (`Catálogo → Ficha → FichaDerivada`, Clean Code, SOLID, componentes enxutos, persistência via Drizzle/Postgres e deploy via Docker/Dokploy), o **Calafrio 2e** é um sistema mecanicamente distinto e muito mais aberto narrativamente que Tormenta20:
- Não existem raças, classes, multiclasse, 6 atributos básicos nem lista de 30 perícias.
- Toda a progressão gira em torno da **Aptidão (`APT` de 1 a 6)**, **Palavras-chave (`2 + APT`)**, **Matriz 3×3 de Habilidades Paranormais** (com bônus geométricos de alinhamento e trava de Domínio Positivo/Negativo), **Carteira (`F$` e `E$P`)**, **Inventário** (objetos mundanos, arsenal, bugigangas, parartefatos) e **Ecos (`= APT`)**.
- O sistema permite que **itens/parartefatos**, **palavras-chave**, **Ecos** e **decisões do Mestre de Jogo (MdJ)** criem modificadores livres, concedam palavras-chave/companheiros extras, criem habilidades únicas e até **reescrevam regras de custo e consumo** (ex.: pagar habilidades com `PV` em vez de `PA`, ou unificar `PV` e `PA` como no Djanho de *Sexto Sentido*).

---

## 2. Tamanho do Trabalho e Fases do Projeto

Este trabalho tem o porte de um **projeto completo dividido em 4 módulos sequenciais**, onde cada módulo entrega valor funcional testável de ponta a ponta:

1. **Fase 1 (Núcleo + Ficha Viva + Assistente de Criação/Evolução)**:
   - Scaffold do monorepo `/Users/andrewozniack/Documents/Calafrio-master` (`Dockerfile`, `docker-compose.yml`, `pnpm-workspace.yaml`, `@calafrio/tema`, `@calafrio/core`, `@calafrio/ficha-app`, `@calafrio/web`).
   - Catálogo completo extraído do Notion e dos PDFs oficiais (60 Habilidades Paranormais das 5 árvores, 100 Palavras-chave genéricas, 100 Ocupações, 100 Bugigangas, 13 categorias de Armas Mundanas, tabelas `1d6` de Familiares, Lacaios e Djanhos, Glossário).
   - Engine determinística + Motor de Efeitos Abertos (`montarFicha`, cálculo de matriz 3×3, Ecos, Parartefatos, palavras-chave concedidas, reescrita de regras).
   - UI da **Ficha Viva de 2 Páginas** (fiel ao PDF `2e-V1_FichaPersonagem_Calafrio.pdf`), **Assistente de Criação/Evolução de `APT`** e **Rolador de Dados** (`d20` com Normal/Vantagem/Desvantagem + `+APT`, `d6`, `d100`).
2. **Fase 2 (Biblioteca de Consulta + Leitor de PDFs Oficiais)**:
   - Busca rápida de Habilidades Paranormais (filtrável por personalidade, domínio Positivo/Negativo, custo e tipo de ação), tabelas interativas (`d100` e `1d6`), glossário e **Leitor embutido dos 3 PDFs oficiais** (`Ficha de Personagem`, `Habilidades Paranormais`, `Ficha de Consulta Rápida`).
3. **Fase 3 (Bestiário Plugável — Criador de Monstros, NPCs e Companheiros)**:
   - Contrato `MotorBestiario` desacoplado; implementação inicial seguindo a regra unificada de criaturas do Calafrio (`PV`, `PD`, `PA`, `+APT`, `Velocidade`, `Palavras-chave`, `Resistências/Vulnerabilidades/Imunidades` aos espectros de dano e ações/habilidades livres), pronto para plugar um gerador específico no futuro.
4. **Fase 4 (Mesa Virtual e Combate em Tempo Real)**:
   - Mesa com iniciativa em roda (ordem de assentos à direita conforme a regra do Calafrio), controle de turno com **2 Ações-padrão**, **1 Ação Livre**, **1 Reflexo por rodada** e **Foco ativo**, aplicação de dano por espectro (*Castanho/Físico, Rubro, Cerúleo, Alvo, Variável*) e mitigação 1:1 com `PA`.

---

## 3. Objetivos, Não-Objetivos e Anti-Objetivos

### Objetivos (Goals)
- **Repositório e Container Isolados**: `/Users/andrewozniack/Documents/Calafrio-master` rodando em seu próprio container Docker (`calafrio-web` / `calafrio-migrate`) na `dokploy-network`.
- **Tema Estrito do Calafrio**: identidade visual fiel aos documentos oficiais do Calafrio 2e (contraste forte preto/off-white, chanfros angulares nas etiquetas, marcadores em losango `◇`, bordas geométricas e a paleta das 5 árvores de personalidade: *Maneiros* verde, *Caóticos* vermelho, *Esquisitos* lilás, *Racionais* azul, *Agradáveis* rosa), preparado para incorporar os SVGs oficiais do usuário.
- **Engine Determinística com Efeitos Abertos**: cálculo puro de `FichaDerivada` a partir de `Ficha + EstadoDeJogo + Catálogo`, suportando customizações narrativas do MdJ, Ecos e Parartefatos com rastreabilidade (`origem` / proveniência em cada modificador).
- **Cobertura 100% do Conteúdo Oficial 2e**: todas as tabelas, fórmulas, restrições de domínio e habilidades dos PDFs e do Notion internalizadas em `@calafrio/core`.

### Não-Objetivos (Non-Goals)
- Não compartilhar banco de dados nem pacotes em tempo de execução com o `T20-master`.
- Não incluir aplicativo mobile (`apps/mobile`) neste primeiro momento — foco 100% em `apps/web` responsivo (desktop e mobile web). *(Decisão do builder)*

### Anti-Objetivos (O que configuraria falha mesmo se funcionar)
- **Resquícios de Tormenta20**: qualquer menção a raças, classes, mana (`PM`), CD de magia ou os 6 atributos de D&D/T20 no código, no banco de dados ou na UI do `Calafrio-master`.
- **Sistema engessado que barra o Mestre**: impedir que um item dê um bônus atípico, que uma palavra-chave conceda outra palavra-chave, ou que uma habilidade criada por Eco tenha custo diferente de `3 PA` quando autorizado pelo MdJ.
- **Estado derivado persistido**: salvar `PV Máximo`, `PA Máximo`, `PD` ou bônus da matriz 3×3 diretamente como verdade no banco em vez de calculá-los via `montarFicha`.

---

## 4. Abordagens Consideradas e Escolha

1. **Abordagem 1 — Scaffold Limpo da Infraestrutura + `@calafrio/core` Nativo (ESCOLHIDA)**
   - Reaproveita a engenharia de monorepo, Docker, autenticação, persistência e padrões de UI do `T20-master`, mas constrói `@calafrio/core`, `@calafrio/ficha-app` e `@calafrio/tema` nativamente para o Calafrio 2e.
   - *Motivo da escolha*: elimina qualquer código morto de T20, mantém tipagem forte na linguagem do Calafrio e permite modelar a Matriz 3×3 e os Ecos de forma limpa.
2. **Abordagem 2 — Fork Completo do `T20-master` com Substituição Gradual (Descartada)**
   - Traria milhares de linhas acopladas a raças, classes e perícias de T20, gerando dívida técnica.
3. **Abordagem 3 — Engine Universal Parametrizada sem tipos fixos (Descartada)**
   - Perderia validação estática em TypeScript para regras centrais como a Matriz 3×3 e os Domínios Positivo/Negativo.

---

## 5. Modelagem do Domínio e Regras do Calafrio 2e (`@calafrio/core`)

### 5.1. Camadas da Engine (`packages/core/ficha`)
Seguindo os mesmos invariantes de qualidade:
- **`catalogo/` (Camada 1 — Imutável)**:
  - `personalidades`: `maneiro` | `caotico` | `esquisito` | `racional` | `agradavel`.
  - `dominios`: `positivo` | `negativo` (cada personalidade tem 6 habilidades no Domínio Positivo e 6 no Domínio Negativo = 60 habilidades catalogadas).
  - `habilidadesParanormais`: `id`, `nome`, `personalidade`, `dominio`, `tipoAcao` (`padrao` | `livre` | `reflexo` | `preparada` | `passiva` | `livre_ou_reflexo`), `tempoPreparacao?`, `custoPA` (0 para passivas, 1–3 para ativas), `permiteCustoEmPV?` (ex.: *Pirocinese*), `requerFoco` (`"nao"` | `"sim"` | `"condicional"` — ícones de cadeado e cadeado com `❓`), `requerEscolhaDeTabela?` (`"familiares"` | `"lacaios"` | `"djanhos"`), `tipoDano?`, `alcance?`, `duracao?`, `descricao`.
  - `palavrasChaveGenericas` (1 a 100) e `ocupacoes` (1 a 100).
  - `bugigangas` (1 a 100) e `armasMundanas` (13 categorias com preço em `F$`/`E$P`, dano, tipo de dano, alcance e propriedades `(A)`, `(B)`, `(C)`).
  - `tabelasSuporte`: `familiares` (`1d6`), `lacaios` (`1d6`), `djanhos` (`1d6`).
- **`modelo/` (Camadas 2 e 4 — O que persiste)**:
  - `Ficha` (decisões do jogador e customizações autorizadas pelo MdJ).
  - `EstadoDeJogo` (estado efêmero de sessão/combate: `danoSofrido`, `paGasto`, `pvTemporario`, `paTemporario`, `focoAtivoId`, `acoesPadraoRestantes`, `acaoLivreRestante`, `reflexoRestante`, `condicoesAtivas`, `descansosNoDia`).
- **`motor/` (Camada 3 — Cálculo Puro)**:
  - `montarFicha(ficha, catalogo, estado) → FichaDerivada`.

### 5.2. Fórmulas Base e Progressão por Aptidão (`APT`)
- **`APT` (Aptidão)**: inteiro de `1` a `6` (concedido pelo MdJ; pode receber modificadores extras se uma regra/artefato alterar).
- **Atributos Derivados Base**:
  - `PD Base` (Pontos de Defesa) = `3 * APT`
  - `PV Base` (Pontos de Vida) = `3 + 3 * APT`
  - `PA Base` (Pontos de Ânimum) = `3 + 3 * APT`
  - `Velocidade Base` = `6` (metros/hexágonos por ação de movimento)
  - `Ecos Disponíveis Base` = `APT`
  - `Limite de Palavras-chave Base` = `2 + APT` (em `APT 1` = 3 slots iniciais obrigatórios: **Ocupação**, **Talento**, **Falha**; cada ponto de `APT` acima de 1 abre +1 slot).
  - `Limite de Habilidades Memorizadas Base` = `APT` (alocadas nos 9 slots da Matriz 3×3).

### 5.3. Matriz 3×3 de Habilidades e Bônus de Alinhamento
A ficha possui uma matriz fixa de **9 slots** (`#1` a `#9`, dispostos em 3 linhas × 3 colunas: `[0,1,2]`, `[3,4,5]`, `[6,7,8]`):
- O jogador aloca suas **Habilidades Paranormais memorizadas** e **Habilidades Únicas (criadas via Ecos)** em quaisquer posições dos 9 slots.
- **Regra de Domínio Emocional**: Por padrão, todas as Habilidades Paranormais memorizadas devem pertencer ao **mesmo domínio** (`positivo` OU `negativo`), independentemente da árvore de personalidade. *(Como o sistema é aberto, uma flag de regra/Eco pode destravar domínio misto caso o MdJ permita).*
- **Cálculo Automático de Bônus de Alinhamento** (quando todos os slots do padrão contêm Habilidades da **mesma personalidade**):
  - **Linhas Horizontais** (`[0,1,2]`, `[3,4,5]`, `[6,7,8]`): **`+3 PA` totais** por linha formada.
  - **Linhas Verticais** (`[0,3,6]`, `[1,4,7]`, `[2,5,8]`): **`+3 PD` totais** por coluna formada.
  - **Linhas Diagonais** (`[0,4,8]`, `[2,4,6]`): **`+6 PV` totais** por diagonal formada.
  - **Quadriláteros 2×2** (`[0,1,3,4]`, `[1,2,4,5]`, `[3,4,6,7]`, `[4,5,7,8]`): **`+3 Velocidade` total** por bloco 2×2 formado.
- Cada bônus de alinhamento entra na `FichaDerivada` como um `Modificador` com proveniência explícita (ex.: `origem: { tipo: "alinhamentoMatriz", padrao: "diagonal", slots: [0,4,8], personalidade: "caotico" }`).

### 5.4. Motor de Efeitos Abertos (Suporte Narrativo para Ecos, Itens, Palavras-chave e MdJ)
Para atender à abertura narrativa do Calafrio sem gambiarras, todo elemento customizável na `Ficha` pode carregar uma lista de `EfeitoCalafrio[]`:

```ts
export type AlvoAtributoCalafrio =
  | "apt"
  | "pvMax"
  | "paMax"
  | "pd"
  | "velocidade"
  | "ecosMax"
  | "limitePalavrasChave"
  | "limiteHabilidadesMemorizadas"
  | "bonusTesteAcao"
  | "bonusContestacao"
  | "danoDesarmado";

export type EspectroDeDano =
  | "fisico"
  | "castanho"
  | "rubro"
  | "ceruleo"
  | "alvo"
  | "variavel";

export type EfeitoCalafrio =
  | {
      tipo: "modificadorAtributo";
      alvo: AlvoAtributoCalafrio;
      valor: number | { escalaPorApt: number; base?: number };
      condicaoTexto?: string;
      ativo?: boolean;
    }
  | {
      tipo: "concederPalavraChave";
      nome: string;
      categoria?: "ocupacao" | "talento" | "falha" | "extra";
      /** Quando true (padrão em concessões do mestre/itens/outras palavras), não consome o limite de 2 + APT */
      semConsumirLimite: boolean;
    }
  | {
      tipo: "resistenciaOuVulnerabilidade";
      espectro: EspectroDeDano;
      grau: "resistente" | "vulneravel" | "imune";
    }
  | {
      tipo: "companheiro";
      subtipo: "familiar" | "lacaio" | "customizado";
      nome: string;
      pvMax?: number;
      pd?: number;
      aptBonus?: number;
      velocidade?: number;
      descricao: string;
    }
  | {
      tipo: "regraEspecial";
      regra:
        | "pvUnificadoComPa" // Ex.: Djanho 6 - Sexto Sentido
        | "permitirDominioMisto" // Eco/MdJ libera Positivo + Negativo juntos
        | "habilidadeUnicaContaParaAlinhamento" // Permite atribuir uma personalidade a uma Habilidade Única no grid 3x3
        | "customizada";
      descricao: string;
    };
```

Onde isso se aplica na prática:
1. **Palavras-chave (`PalavraChaveNaFicha`)**:
   - Cada palavra-chave tem `id`, `nome`, `categoria` (`ocupacao` | `talento` | `falha` | `extra`), `origem` (`escolhaBase` | `concedidaPorPalavraChave` | `concedidaPorItem` | `concedidaPeloMestre`), `notas` e `efeitos: EfeitoCalafrio[]`.
   - Assim, uma palavra-chave pode **conceder outra(s) palavra(s)-chave** (sem gastar o limite `2 + APT`) ou conceder um bônus numérico direto por decisão do MdJ.
2. **Ecos (`UsoDeEco`)**:
   - Cada Eco investido registra seu tipo:
     - **`customizarHabilidade`**: aponta para uma habilidade memorizada e pode sobrescrever `custoPA` (ex.: reduzir pela metade ou zerar), `tipoRecurso` (`"pa"` | `"pv"` | `"nenhum"` | `"consumivel"` | `"condicao"`), `tipoAcao`, `alcance`, `dano`, `duracao`, adicionar `efeitos: EfeitoCalafrio[]` e texto da melhoria aprovada pelo MdJ.
     - **`criarHabilidadeUnica`**: cria uma habilidade do zero (`ativa` ou `passiva`, `paranormal` ou `mundana`). Por regra padrão do livro, ativas começam com custo `3 PA`, mas o campo de custo e tipo de recurso (`PA`, `PV`, usos por descanso, livre) é **100% editável** para refletir acordos com o MdJ, e ela pode opcionalmente ser associada a uma das 5 personalidades se o MdJ permitir que conte no grid 3×3.
     - **`reescreverRegra`**: consome 1 Eco para aplicar um `EfeitoCalafrio` global ao personagem (conforme descrito na `Ficha de Consulta Rápida`).
3. **Inventário e Parartefatos (`ItemNaFicha`)**:
   - Categorias: `arma_curto`, `arma_longo`, `arma_misto`, `ferramenta`, `consumivel`, `vestimenta`, `bugiganga`.
   - Origem: `mundano` ou `paranormal` (**Parartefato**).
   - Além das estatísticas de arma/municão/usos (`usosAtuais / usosMax`, ex.: 6 disparos para armas de fogo), qualquer item pode ter `efeitos: EfeitoCalafrio[]` e `habilidadesDoItem` com custo de `PA`/`PV`/usos próprio.
4. **Descansos (Configurável Fixo vs. Dado)**:
   - Notou-se uma diferença entre o texto da página do Notion (Descanso Curto = `+9 PA/h`; Descanso Longo = `+6 PV + todo PA`) e o PDF `2e-V1FichaConsulta_Calafrio.pdf` (Descanso Curto = `+1d6 PA/h`; Descanso Longo = `+1d6 PV + todo PA`).
   - *Decisão do builder*: suportaremos ambos no painel de Descanso com um toggle rápido (`Regra Fixa (Notion: +9 PA / +6 PV)` vs. `Regra Rolada (PDF Consulta: +1d6 PA / +1d6 PV)`), deixando a Regra Fixa do Notion como padrão.

---

## 6. Arquitetura do Bestiário Plugável (`MotorBestiario`)

Para atender ao requisito de usar a mesma regra base agora e permitir plugar um motor novo de bestiário no futuro:
- Definimos em `@calafrio/core/bestiario` a interface:
  ```ts
  export interface CriaturaCalafrio {
    id: string;
    nome: string;
    categoria: "ameaca" | "npc" | "familiar" | "lacaio" | "estrutura";
    apt: number;
    pvMax: number;
    pd: number;
    paMax: number;
    velocidade: number;
    palavrasChave: string[];
    resistencias: Partial<Record<EspectroDeDano, "resistente" | "vulneravel" | "imune">>;
    acoes: AcaoDeCriatura[];
    notas?: string;
  }

  export interface MotorBestiario {
    id: string;
    nome: string;
    gerarPadraoPorApt(apt: number, papel?: string): Omit<CriaturaCalafrio, "id" | "nome">;
    validarCriatura(criatura: CriaturaCalafrio): string[];
  }
  ```
- Na versão inicial, `MotorBestiarioUnificado` usa as fórmulas base dos neurais/lacaios (`PD = 3*APT`, `PV = 3 + 3*APT`, `PA = 3 + 3*APT`, `VEL = 6`) como sugestão inicial com **todos os campos destravados** para edição livre pelo MdJ, além de presets prontos das tabelas oficiais de **Familiares** e **Lacaios**.

---

## 7. Identidade Visual e Estrutura de Telas (`@calafrio/tema` & `@calafrio/web`)

### 7.1. Tema Visual (`@calafrio/tema`)
- **Paleta Estrita Calafrio**:
  - Fundo de página/papel: off-white geométrico (`#F4F4F2`) no modo claro da ficha impressa e modo escuro urbano/oculto (`#0E0E11` com cartões `#16161B` e detalhes em branco/amarelo-calafrio `#F5C542`) na interface do app.
  - Etiquetas chanfradas pretas (`clip-path` octogonal/hexagonal alongado nas pontas com marcadores em losango `◇`, idêntico aos cabeçalhos `Aptidão (APT):`, `Defesa (PD):`, `Palavras-chave:`, `Carteira`, `Habilidades Paranormais` do PDF oficial).
  - Cores oficiais das 5 Personalidades (extraídas de `2e-V1HabilidadesParanormais_Calafrio.pdf`):
    - **Maneiros**: Verde Oliva (`#85A844` / Domínio Positivo claro, Domínio Negativo escuro `#435725`)
    - **Caóticos**: Coral/Rubro (`#D66863` / escuro `#681D1A`)
    - **Esquisitos**: Lilás/Orquídea (`#B676B1` / escuro `#48284A`)
    - **Racionais**: Azul Cerúleo (`#68A2B9` / escuro `#1C446B`)
    - **Agradáveis**: Rosa/Magenta (`#E090B5` / escuro `#9B1C4C`)
- **Assets SVG**: estrutura de componentes preparada em `apps/web/public/assets/calafrio/` e componentes React em `src/components/svg/` para receber os SVGs originais do usuário (logo Calafrio, borda inferior de triângulos/olhos, ícones de alinhamento 3×3, cadeado de Foco e divisores com estrelas).

### 7.2. Rotas Principais (`apps/web/src/app`)
1. `/` e `/ficha` (**Ficha Viva + Assistente de Criação e Evolução**):
   - **Aba/Página 1 (Frente da Ficha)**: Retrato, Nome, Aptidão (`APT`), Defesa (`PD`), Vida (`PV atual / máx`), Ânimum (`PA atual / máx` + botão rápido *"Mitigar Dano com PA"*), Velocidade, Ecos, Carteira (`F$` e `E$P`), Palavras-chave (Ocupação, Talento, Falha, Extras + concedidas, com botão de rolar teste `1d20 + APT` Normal/Vantagem/Desvantagem) e Inventário interativo.
   - **Aba/Página 2 (Verso da Ficha — Matriz 3×3 e Ecos)**: Grid 3×3 interativo (`#1` a `#9`) com linhas luminosas indicando em tempo real quais alinhamentos (horizontal `+3 PA`, vertical `+3 PD`, diagonal `+6 PV`, 2×2 `+3 VEL`) estão ativos; gerenciador de Ecos; painel de Companheiros/Djanhos; Anotações e Auditoria de Modificadores.
   - **Assistente de Criação Passo a Passo**:
     1. Conceito & `APT` inicial (`1` a `6`)
     2. Palavras-chave (`Ocupação`, `Talento`, `Falha` + extras, com busca ou sorteio `d100`)
     3. Habilidades Paranormais & Matriz 3×3 (escolha de Domínio Positivo/Negativo, alocação nos 9 slots e visualização de bônus)
     4. Ecos (customizações de habilidades ou criação de Habilidade Única)
     5. Carteira (`1–12 F$`, `E$P`) & Equipamento Inicial (3 objetos mundanos, armas do arsenal, 2 bugigangas `d100` e parartefatos)
2. `/biblioteca` (**Biblioteca de Consulta + Leitor de PDFs Oficiais**):
   - Consulta interativa das 60 Habilidades, tabelas `d100`/`1d6`, regras rápidas, glossário e aba **"PDFs Oficiais"** com visualizador embutido dos 3 documentos oficiais copiados para o repositório.
3. `/bestiario` (**Criador de Monstros, NPCs e Companheiros**):
   - Catálogo das criaturas da mesa + criador livre baseado no `MotorBestiario`.
4. `/mesa/[id]` (**Mesa Virtual e Combate em Tempo Real**):
   - Ordem em roda (sentido horário), rastreador de ações do turno (`2 Padrão`, `1 Livre`, `1 Reflexo`), disputas de **Contestação** (`1d20 + APT` vs. `1d20 + APT` respeitando o piso de `PD` da vítima) e log de rolagens em tempo real.

---

## 8. O que Fica a Cargo do Builder

- Configuração das portas locais no `docker-compose.yml` e `.env.example` (ex.: porta `3001` no host para não colidir com o `T20-master` na `3000`).
- Desenho dos SVGs fallback (chanfros, losangos, ícones de alinhamento 3×3 e divisor inferior) caso o usuário envie os arquivos SVG originais depois do scaffold inicial.
- Schema SQL/Drizzle enxuto em `apps/web/src/db/schema/` contendo apenas tabelas do domínio Calafrio (`users`, `fichas_calafrio`, `mesas`, `combates`, `criaturas_bestiario`, `rolagens`).
