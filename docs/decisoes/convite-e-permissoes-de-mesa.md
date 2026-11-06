# Convite de jogadores e permissões de mesa — decisões reutilizáveis

Origem: implementação no Calafrio Master (nov/2026), derivada do fluxo do T20 Master.
Objetivo deste arquivo: levar de volta ao **T20 Master** o que se mostrou certo, sem
reabrir as mesmas dúvidas. Código de referência: `apps/web/src/services/convite-regras.ts`,
`armazenamento-convite.ts`, `lib/auth/acesso-mesa.ts`, `app/entrar/`.

## 1. Modelo de papéis (só dois)

- **Mestre** = dono da mesa (`mesa.userId === userId`). Mesa legada sem dono (`userId` nulo) conta como de todos.
- **Jogador** = qualquer usuário com ao menos um player vinculado (`player.userId`) na mesa.
- **Estranho** = nenhum dos dois: não acessa nada da mesa.
- Sem co-mestre, sem permissões granulares (fora de escopo de propósito).

## 2. Regras puras primeiro (testáveis sem banco nem sessão)

Funções sem dependência de `db`/`auth`, cobertas por testes unitários:

| Função | Regra |
|---|---|
| `normalizarCodigoConvite(s)` | `trim`, maiúsculas, remove espaços e `-` (`"ab c-d23"` → `"ABCD23"`) |
| `ehMestreDaMesa(mesa, userId)` | dono, ou mesa sem dono |
| `ehMembroDaMesa(mesa, players, userId)` | mestre ou tem player; sem `userId` → falso |
| `podeEditarPlayer(mesa, player, userId)` | mestre edita todos; jogador só o próprio |
| `filtrarMesasDoUsuario(store, userId)` | mesas em que é mestre ou jogador (fallback local) |

Regra de ouro: **a UI só espelha essas regras; o limite real está nas server actions.**

## 3. Onde aplicar a autorização

1. **Server actions** (limite de segurança). Helper `exigirAcessoMesa(mesaId)` (membro) e
   `exigirMestreDaMesa(mesaId)` (só mestre) lançam erro se não passar.
   - Criar player: membro. Jogador cria vinculado a si (`userId`); mestre cria avulso (sem `userId`).
   - Salvar/excluir player: `podeEditarPlayer`.
   - Regerar convite, anotações, limpar rolagens, excluir mesa: só mestre.
   - Registrar/listar rolagens: membro.
2. **Layout da mesa**: estranho é redirecionado para `/mesa`. Mesa inexistente fica a cargo da página.
   Layout NÃO protege server actions: por isso o item 1 é obrigatório.
3. **Páginas**: ficha de player alheio redireciona (jogador); anotações só do mestre (aba também some).
4. **UI**: esconder o que o papel não pode usar (lixeira, código de convite, badge "Mestre").

## 4. Fluxo do convite

- Cada mesa tem `codigoConvite` único (6 chars, alfabeto sem `0/O/1/I`); link `/entrar/{codigo}`.
- `/entrar/[codigo]` **não é rota pública**: o middleware manda para login com `callbackUrl`, e o
  login devolve à landing.
- Landing: nome da mesa + dois botões.
  - **Ver / Criar minha Ficha** → cria/reusa rascunho e abre o assistente com `?rascunho=<playerId>`;
    ao concluir, o assistente **salva sobre o rascunho** (nunca cria um segundo player).
  - **Entrar sem criar ficha agora** → cria/reusa rascunho e vai ao painel.
- Rascunho = player com nome `"Investigador Pendente"` e `userId` do jogador.
- **Idempotência**: reabrir link / clicar duas vezes devolve o mesmo player.
- **Mestre abrindo o próprio link** → vai ao painel, não vira player.
- `?rascunho=` só é aceito se o player existir, for da mesa e do usuário logado.
- Hub `/mesa`: campo "Entrar com Código" (mesma normalização), badges Mestre/Jogador, "Sair da Mesa"
  (com confirmação) só para jogadores; mestre vê código e lixeira, jogador não.

## 5. Regerar código

- Só mestre. **Confirmação explícita em dois passos** na UI ("Isso invalida o link atual").
- Sorteia até 5 vezes até achar código livre (código é `unique`); esgotou → erro.
- O link antigo passa a dar 404 imediatamente. Sem expiração por tempo.

## 6. Sair da mesa

- Remove os players do usuário **naquela mesa** (nunca de outras mesas nem de outros usuários).
  Escolha deliberada: evita fichas órfãs; é destrutivo, por isso há confirmação.

## 7. Armadilhas encontradas

- `armazenamento-*.ts` crescem rápido (limite de 400 linhas): coloque o convite em arquivo próprio
  (`armazenamento-convite.ts`) em vez de inflar o arquivo existente.
- Mapear `userId` nos dois caminhos (Postgres e store JSON) em `listarPlayers`/`obterPlayer`/`criarPlayer`;
  sem isso o vínculo some silenciosamente em um dos modos.
- O fallback JSON de `listarMesas` ignorava o usuário e mostrava todas as mesas: filtrar por vínculo.
- Testar serviços sem banco: `vi.mock("@/db", () => ({ db: null, schema: {} }))` e mockar
  `carregarStore/salvarStore` com um store em memória; precisa de alias `@` no `vitest.config.ts`.
- Mesa semente sem dono (`CALA26`) faz todo mundo ser "mestre" em dev: para testar convite, crie uma mesa nova.
- `confirm()` em `<form action>`: use `onSubmit` com `preventDefault` num componente cliente.
- Popover sem biblioteca: estado local + fechar com clique fora e `Escape`; calcule a URL com
  `window.location.origin` em `useEffect` para não quebrar a hidratação.

## 8. O que ainda NÃO está coberto (decidir no T20 Master)

- Rolagens/anotações: o `id` da anotação não é validado contra a mesa informada na action.
- Sem limite de players por jogador nem moderação de nomes de rascunho.
- Sem teste automatizado das server actions (dependem de `auth`/`redirect`); só as regras puras têm teste.
