# Design Doc: Sistema de Convite de Players para Mesas (Calafrio Master)

## 1. Contexto e Motivação
No Calafrio Master, mestres precisam convidar jogadores para suas mesas de forma simples, segura e sem fricção. No projeto irmão **T20 Master**, essa funcionalidade foi desenvolvida com grande aceitação: cada mesa tem um código único de convite, o mestre pode copiar o link ou regerar o código a qualquer momento via Popover, e o jogador pode entrar pelo link ou digitando o código no hub de mesas, sendo direcionado diretamente para criar seu personagem no assistente (wizard) ou entrar na mesa.

O objetivo deste projeto é replicar com precisão cirúrgica o fluxo de convites do T20 Master dentro do ecossistema do Calafrio Master.

---

## 2. Metas, Não-Metas e Anti-Metas

### Metas (Goals)
1. **Código e Link de Convite Únicos:** Cada mesa possui um `codigoConvite` (já previsto no schema `mesas`).
2. **Popover do Mestre:** Em `/mesa/[mesaId]/players`, adicionar botão "Convidar Jogadores" com Popover que:
   - Exibe a URL de convite formatada (`https://.../entrar/{codigo}`);
   - Permite copiar o link com um clique e feedback visual temporário ("Copiado!");
   - Permite regerar o código de convite (invalidando o link anterior).
3. **Página de Convite (`/entrar/[codigo]`):**
   - Página com estilo visual Calafrio (tema sombrio/paranormal de Curitiba);
   - Exibe o nome da mesa e detalhes de ambientação;
   - Botão primário **"Ver / Criar minha Ficha"**: vincula o usuário à mesa e o direciona diretamente ao **Assistente de Criação (Wizard)** de Investigador (`/mesa/[mesaId]/players/novo` ou rota do assistente vinculada à mesa);
   - Botão secundário **"Entrar sem criar ficha agora"**: cria um rascunho de Investigador pendente vinculado ao usuário e redireciona para `/mesa/[mesaId]`.
4. **Hub de Mesas (`/mesa`):**
   - Formulário "Entrar com Código" para digitação manual do código;
   - Diferenciação visual entre mesas onde o usuário é **Mestre** e mesas onde é **Jogador** (com botão "Sair da Mesa" para jogadores).
5. **Autenticação e Redirecionamento:**
   - Jogadores não autenticados que acessam `/entrar/[codigo]` são redirecionados pelo middleware para o login com Google via `callbackUrl`, retornando automaticamente para a tela do convite após o login.
6. **Backend e Persistência:**
   - Suporte completo tanto no banco Postgres (Drizzle) quanto no fallback local (`calafrio-store.json`).
   - Métodos: `buscarMesaPorCodigoConvite`, `regerarCodigoConvite`, `entrarPorConvite`, `desvincularUsuarioDaMesa`.

### Não-Metas (Non-Goals)
- Criação de permissões granulares de mestre assistente ou co-mestre (apenas Mestre vs Jogador).
- Sistema de expiração automática por tempo dos códigos (a expiração é sob demanda através da ação "Regerar Convite").

### Anti-Metas (Anti-Goals)
- Não permitir que um jogador entre em uma mesa sem vincular sua conta (`userId`), evitando fichas órfãs.
- Não quebrar nem regerar códigos existentes sem confirmação explícita do mestre.

---

## 3. Abordagens Consideradas

- **Abordagem A (Selecionada): Replicar exatamente o T20 com Landing + Wizard**
  - O jogador acessa `/entrar/[codigo]`, vê os dados da mesa em uma tela temática, escolhe entre iniciar o wizard ou entrar no painel da mesa.
  - O mestre possui popover com link, cópia e regeração.
  - O hub possui input para código manual e suporte a Jogador vs Mestre.
  - *Vantagens:* Fidelidade completa à experiência madura do T20, clareza sobre em qual mesa está entrando e flexibilidade de criar o personagem na hora ou depois.

- **Abordagem B: Redirecionamento instantâneo sem landing**
  - O link `/entrar/[codigo]` automaticamente joga o usuário no assistente sem tela intermediária.
  - *Desvantagens:* Falta de contexto inicial da mesa, remove a opção de entrar primeiro para olhar anotações/cenário sem ter que preencher ficha de imediato.

---

## 4. Detalhamento da Implementação

### 4.1 Banco de Dados e Serviços (`armazenamento-calafrio.ts`)
- `buscarMesaPorCodigoConvite(codigo: string): Promise<MesaCalafrio | null>`
- `regerarCodigoConvite(mesaId: string, userId?: string): Promise<string>`
- `entrarPorConvite(userId: string, codigo: string): Promise<{ mesaId: string; playerId: string }>`:
  - Busca mesa pelo código.
  - Se o usuário já tiver um player cadastrado na mesa, retorna o `playerId` existente.
  - Se não tiver, cria um novo rascunho de player ("Investigador Pendente") com `userId` vinculado e valores padrão.
- `sairDaMesaComoJogador(userId: string, mesaId: string): Promise<void>`:
  - Remove ou desvincula os players do usuário naquela mesa.
- Atualizar `criarPlayer` para aceitar opcionalmente `userId`.

### 4.2 Camada de Rotas e Telas Web
1. **`/entrar/page.tsx`**: Tela com formulário para digitar o código de convite.
2. **`/entrar/[codigo]/page.tsx`** e **`entrar-landing.tsx`**:
   - Valida código com `buscarMesaPorCodigoConvite` (se inválido, `notFound()`).
   - Apresenta card com brasão/ícone de Calafrio, nome da mesa, badge do sistema.
   - Ação "Ver / Criar minha Ficha": chama `entrarSemFichaAction(codigo)` e faz `router.push('/mesa/[mesaId]/players/novo')` (ou com `playerId` do rascunho).
   - Ação "Entrar sem criar ficha agora": chama `entrarSemFichaAction(codigo)` e faz `router.push('/mesa/[mesaId]')`.
3. **`/mesa/[mesaId]/players/convite-mesa-popover.tsx`**:
   - Componente cliente com botão "Convidar Jogadores", Popover, campo input com a URL completa, botão Copiar e ação de regerar.
   - Incluído no header de `/mesa/[mesaId]/players/page.tsx`.
4. **`/mesa/page.tsx` e `actions.ts`**:
   - Ação `entrarPorCodigoAction` redirecionando para `/entrar/[codigo]`.
   - Adicionar o formulário "Entrar com Código" no hub de mesas.
   - Identificar e renderizar badges de "Mestre" e "Jogador", e botão de "Sair da Mesa" para jogadores.
