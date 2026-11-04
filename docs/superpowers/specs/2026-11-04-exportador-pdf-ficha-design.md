# Design Doc: Exportador de Ficha para PDF Editável (Calafrio 2e)

**Data:** 2026-11-04  
**Status:** Proposto  
**Autor:** Antigravity / Pair Programming  

---

## 1. Contexto e Motivação (Intent & Why)

O Calafrio 2e possui uma Ficha Viva interativa rica na web e no mobile, com cálculos automáticos de Aptidão (APT), Pontos de Vida (PV), Pontos de Ação (PA), Defesa (PD), alinhamentos da Matriz de Habilidades e inventário.

Para fechar o ciclo de uso em mesas presenciais e híbridas, os jogadores e mestres precisam conseguir **exportar a ficha completa em um arquivo PDF editável** (com campos de formulário interativos AcroForm). Isso permite que o jogador baixe sua ficha atualizada, abra em qualquer leitor de PDF padrão (Adobe Acrobat, Chrome, macOS Preview, Foxit, etc.) e edite valores, anotações e equipamentos diretamente no arquivo durante o jogo offline ou imprima com seus dados legíveis.

---

## 2. Objetivos, Não-Objetivos e Anti-Objetivos

### Objetivos (Goals)
1. **PDF 100% Editável (AcroForm):** Todos os campos principais da ficha (Nome, Conceito/Ocupação, APT, PV Atual/Max, PA Atual/Max, PD, Palavras-chave, Equipamentos, Itens, Carteira, Habilidades da Matriz e Anotações) devem ser campos de formulário interativos preenchidos com os dados da ficha do jogador no momento da exportação.
2. **Fidelidade Visual Oficial:** Utilizar como base o PDF oficial de 2 páginas já presente no projeto (`apps/web/public/assets/calafrio/2e-V1_FichaPersonagem_Calafrio.pdf`), preservando a arte, bordas, texturas e identidade visual gótica/analógica da 2ª Edição.
3. **Download Rápido e Desacoplado:** Execução ágil via `pdf-lib` sem necessidade de Chromium headless (Puppeteer/Playwright) ou servidores pesados de renderização. Pode ser executado no navegador (client-side) e/ou rota API Next.js.
4. **Botão de Exportação na UI:** Disponibilizar ação "Exportar PDF" destacada na barra de ferramentas superior da ficha do jogador (`FichaLiveClient`), com feedback de download e nome de arquivo padronizado: `Ficha_<NomeDoInvestigador>_Calafrio2e.pdf`.
5. **Cobertura de Testes Automatizados:** Testes unitários com Vitest validando a integridade da geração, presença dos campos AcroForm e preenchimento correto dos dados derivados.

### Não-Objetivos (Non-Goals)
- Importação reversa automática de PDFs preenchidos de volta para o banco de dados (o fluxo é de exportação/leitura).
- Criação de editor visual de templates de PDF.
- Suporte a geração de PDF em formatos não-A4 (a ficha oficial é estritamente A4).

### Anti-Objetivos (Anti-Goals)
- Gerar PDFs "estáticos" ou capturas de tela rasterizadas (prints/canvas) onde o texto não pode ser editado pelo usuário no leitor de PDF.
- Depender de binários externos ou serviços de terceiros pagos na nuvem para gerar PDFs.

---

## 3. Abordagens Consideradas (Approaches)

### Abordagem 1 (Escolhida): Injetar AcroForm sobre o PDF Oficial via `pdf-lib`
- **Descrição:** Carrega o arquivo `apps/web/public/assets/calafrio/2e-V1_FichaPersonagem_Calafrio.pdf`. Utilizando a biblioteca `pdf-lib`, cria campos interativos de formulário (`createTextField`) posicionados sobre as caixas originais da arte gráfica nas 2 páginas, preenchendo-os com os dados de `FichaCalafrio` e `FichaDerivadaCalafrio`.
- **Trade-offs:** Exige mapeamento de coordenadas (x, y, w, h) calibrado para a geometria da folha A4 oficial.
- **Motivo da Escolha:** Atende com perfeição o requisito de entregar um PDF genuinamente editável, com tamanho leve (~400KB), velocidade instantânea e 100% de fidelidade artística ao Calafrio 2e.

### Abordagem 2: Recriar a ficha vetorial do zero com `@react-pdf/renderer`
- **Descrição:** Reconstruir todas as linhas, ornamentos e caixas em componentes React-PDF.
- **Trade-offs:** O suporte a formulários interativos (AcroForm) no `@react-pdf/renderer` é incompleto e instável; além disso, a recriação manual da arte gótica original seria trabalhosa e inferior à arte gráfica oficial.
- **Veredito:** Descartada.

### Abordagem 3: Exportar via impressão nativa do navegador (`window.print()`)
- **Descrição:** Criar folha de estilo de impressão que renderiza as páginas web em A4.
- **Trade-offs:** O arquivo PDF gerado pelo navegador ("Imprimir > Salvar como PDF") achata os campos de input em texto estático vetorial/imagem; não cria formulários interativos editáveis.
- **Veredito:** Descartada por não cumprir a exigência do PDF editável.

---

## 4. Detalhamento da Solução

### 4.1 Pacote e Arquitetura
- **Dependência:** Adicionar `pdf-lib` ao workspace (instalado em `apps/web` ou `@calafrio/ficha-app`).
- **Módulo de Mapeamento e Geração:** Criar `apps/web/src/services/exportador-pdf-ficha.ts` (ou em pacote core/ficha-app) exportando:
  ```ts
  export async function gerarPdfFichaEditavel(
    ficha: FichaCalafrio,
    derivada: FichaDerivadaCalafrio,
    catalogo?: CatalogoCalafrio
  ): Promise<Uint8Array>
  ```

### 4.2 Conversão de Coordenadas
O PDF oficial possui dimensões A4 exatas:
- Largura: `595.28` pt
- Altura: `841.89` pt
- Origem do PDF: canto inferior esquerdo `(0, 0)`.
- O canvas de referência do projeto no frontend usa `662 × 936` com origem no canto superior esquerdo `(0, 0)`.
- Função de conversão determinística:
  ```ts
  function canvasParaPdf(x: number, y: number, w: number, h: number) {
    const escalaX = 595.276 / 662;
    const escalaY = 841.89 / 936;
    return {
      x: x * escalaX,
      y: 841.89 - (y + h) * escalaY,
      width: w * escalaX,
      height: h * escalaY,
    };
  }
  ```

### 4.3 Campos Mapeados e Preenchidos

#### Página 1 (Frente da Ficha)
1. **Identidade:**
   - `nome`: Nome do Investigador (campo de texto sobre a linha de nome)
   - `apt`: Aptidão (campo numérico centralizado)
   - Retrato do Investigador: Se `ficha.retratoUrl` estiver preenchido (data URL ou URL acessível), é desenhado na caixa de ilustração; caso contrário, a caixa permanece livre para desenho/foto física.
2. **Vitais:**
   - `pv_atual`: PV Atual
   - `pv_max`: PV Máximo
   - `pa_atual`: PA Atual
   - `pa_max`: PA Máximo
   - `pd`: Pontos de Defesa
   - `ecos`: Quantidade de Ecos (igual a APT)
3. **Palavras-chave (9 linhas):**
   - Seguindo rigorosamente a distribuição oficial (`distribuirLinhas`):
     - Linha 1: Ocupação do personagem
     - Linha 2: Talento
     - Linha 3: Falha
     - Linhas 4 a 9: Demais palavras-chave livres
   - Cada linha possui campo de texto editável com o nome da palavra-chave.
4. **Inventário & Equipamento:**
   - Caixa oficial de Inventário mapeada com campo de texto multilinhas formatado, listando armas e itens com indicador de status (`[E]` para equipado), dano, espectro e descrição. Permite que o jogador digite, adicione ou apague itens livremente no leitor de PDF.
5. **Carteira:**
   - `fundos`: Valor de Fundos
   - `espirions`: Valor de Espírions

#### Página 2 (Verso da Ficha - Matriz de Habilidades)
1. **Slots da Matriz de Alinhamento (9 slots no grid 3x3):**
   - Cada um dos 9 slots oficiais possui:
     - Campo de Título: Nome da Habilidade Paranormal alocada (ou Habilidade Única)
     - Campo de Descrição (multilinhas sobre as linhas pautadas): Custo de PA, Tipo de Ação, Personalidade/Domínio e resumo do efeito.
2. **Anotações:**
   - Campo de texto multilinhas cobrindo a caixa oficial de "Anotações" no rodapé da página 2, pré-preenchido com `ficha.anotacoes` e resumo de Ecos ativos/cicatrizes (se houver), 100% editável pelo jogador.

### 4.4 Experiência do Usuário (UI)
- No cabeçalho de [ficha-live-client.tsx](file:///Users/andrewozniack/Documents/Calafrio-master/apps/web/src/app/mesa/[mesaId]/players/[playerId]/ficha/ficha-live-client.tsx):
  - Botão com ícone `FileDown` (ou `Download`): **"Exportar PDF"**.
  - Ao clicar:
    1. Mostra estado de carregamento leve no botão ("Gerando PDF...").
    2. Gera o buffer do PDF via `gerarPdfFichaEditavel(f.ficha, f.derivada, catalogo)`.
    3. Dispara o download automático no navegador via Blob URL (`application/pdf`).
    4. Restaura o estado normal do botão.

---

## 5. Decisões do Builder (Builder's Scope)
- O builder ajustará a tipografia padrão dos campos AcroForm (fontes padrão do PDF como `Helvetica` / `TimesRoman` que não requerem embutir arquivos de fonte adicionais, mantendo o PDF leve e universalmente compatível).
- Cores de texto dos campos de formulário configuradas em preto/grafite para perfeita legibilidade sobre os fundos claros da ficha.
- Configuração de `readOnly: false` em todos os campos para garantir total editabilidade por parte do jogador.

---

## 6. Verificação e Testes
1. **Testes Unitários:**
   - Teste de integração do serviço `gerarPdfFichaEditavel`:
     - Validação de que o PDF resultante é válido (`%PDF-1.` no cabeçalho).
     - Validação de que possui exatamente 2 páginas.
     - Validação de que os campos AcroForm existem com os nomes e valores corretos.
2. **Teste no Navegador:**
   - Exportar ficha de um jogador real.
   - Abrir o PDF gerado no Chrome/Acrobat/Preview e verificar:
     - Dados preenchidos corretamente.
     - Campos clicáveis e editáveis com o cursor.
     - Fidelidade visual e alinhamento sobre as caixas oficiais.
