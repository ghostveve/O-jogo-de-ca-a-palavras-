# Especificacao tecnica: jogo de adivinhacao de palavras

**Status:** proposta tecnica para o MVP  
**Data:** 2026-10-21  
**Documento de produto:** [PRD.md](PRD.md)

## 1. Objetivo e premissas

Este documento descreve a implementacao proposta para o jogo web diario de criancas e jovens, mobile-first, com palavras tematicas em portugues brasileiro. O briefing atualizado do solicitante prevalece sobre o rascunho original para publico e estrategia de retencao; as regras de cinco letras e seis tentativas permanecem como escolhas operacionais do MVP.

### Direcao visual assumida

Adotar a direcao escolhida **Caderno de palavras**: interface editorial acolhedora, grade em primeiro plano, pequenos elementos de anotacao e uma area de aprendizado ligada ao vocabulario. As alternativas **Letreiro de feira** e **Rota sonora** estao disponiveis na galeria interativa em `game/?prototypes=1`; os componentes e regras de jogo permanecem iguais entre as variantes.

Principios visuais:

- Fundo claro com aparencia de pagina, tinta azul-petroleo e acentos terracota e verde-salvia.
- Tipografia serifada expressiva em titulos e sans-serif de alta legibilidade em controles e instrucoes.
- Casas da grade com dimensoes fixas, contornos visiveis e texto centralizado; anotacoes ficam fora da area de jogo.
- A cor nunca e a unica codificacao de acerto: cada resultado tem texto acessivel e um identificador visual redundante.
- Layout de uma coluna no celular. Em telas amplas, o painel de aprendizado pode ocupar a lateral sem reduzir a grade.
- Validar todas as combinacoes finais de cor com contraste WCAG antes de aprovar os tokens. Fontes externas nao devem ser requisito para carregar ou jogar.

## 2. Escopo do MVP

### Incluido

- Aplicacao web responsiva, sem conta, backend ou anuncios.
- Um desafio por dia, com palavra-alvo de cinco letras e seis tentativas.
- Modos **Classico** e **Aprender** sobre o mesmo desafio diario.
- Entrada por teclado fisico e teclado visual, validacao de palpites e feedback por letra.
- Ajuda/dica opcional, definicao e exemplo de uso conforme a politica de revelacao definida na secao 11.
- Persistencia local da partida e estatisticas basicas no navegador.
- Compartilhamento de resultado sem resposta nem palpites.
- Operacao por teclado e meta de conformidade WCAG 2.2 AA nos fluxos principais.

### Fora de escopo

- Login, sincronizacao entre dispositivos, multiplayer, ranking, monetizacao e anuncios.
- CMS ou ferramenta administrativa de curadoria.
- Geracao automatica de respostas por IA.
- Dueto/Quarteto, pratica ilimitada e suporte a variantes nao brasileiras, ate aprovacao de produto.
- Telemetria de comportamento no MVP.

## 3. Arquitetura proposta

### Stack

- **Vite + TypeScript + React** para uma SPA leve, com componentes semanticos e tipados.
- CSS moderno com custom properties para tokens visuais; sem biblioteca de componentes no MVP.
- Logica de dominio pura em TypeScript, isolada de React e do DOM, para facilitar testes unitarios.
- Distribuicao como arquivos estaticos em qualquer host HTTPS. Nenhuma requisicao a API e necessaria no jogo principal.
- Testes unitarios com Vitest; testes de navegador com Playwright; verificacoes de acessibilidade automatizadas com axe-core como apoio, sem substituir testes manuais.

### Limites de responsabilidade

1. **Apresentacao:** renderiza cabecalho, tabuleiro, teclado, controles, mensagens e dialogos. Nao calcula pistas nem escolhe a palavra.
2. **Dominio do jogo:** normaliza entradas, valida palpites, calcula marcas, controla vitoria/derrota e produz estado imutavel.
3. **Catalogo editorial:** contem palavras-alvo, palpites aceitos, definicoes, exemplos e dicas revisados.
4. **Agendamento diario:** converte a data de jogo em um indice estavel do catalogo.
5. **Persistencia:** salva e recupera partidas locais com versao de schema.
6. **Compartilhamento:** prepara uma mensagem sem spoiler e usa APIs do navegador com fallback.

### Estrutura inicial de arquivos

```text
src/
  app/
    App.tsx
    main.tsx
  components/
    AppHeader.tsx
    ModeSwitch.tsx
    GameBoard.tsx
    GuessRow.tsx
    OnScreenKeyboard.tsx
    LearningPanel.tsx
    GameStatus.tsx
    HelpDialog.tsx
    ShareDialog.tsx
  domain/
    game.ts
    feedback.ts
    normalizeWord.ts
    puzzleSchedule.ts
    types.ts
  data/
    words.pt-BR.json
    puzzleCalendar.ts
  services/
    gameStorage.ts
    shareResult.ts
  styles/
    tokens.css
    app.css
    game.css
  test/
    fixtures.ts
```

Os nomes sao uma organizacao de referencia; manter o dominio pequeno e evitar criar abstracoes que nao tenham uso real.

## 4. Modelo de dominio

### Tipos conceituais

```ts
type GameMode = 'classic' | 'learn';
type GameStatus = 'playing' | 'won' | 'lost';
type LetterMark = 'correct' | 'present' | 'absent';

interface WordEntry {
  id: string;
  display: string;
  normalized: string;
  definition: string;
  example: string;
  hint?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

interface Guess {
  display: string;
  normalized: string;
  marks: LetterMark[];
}

interface GameState {
  schemaVersion: number;
  puzzleId: string;
  gameDate: string;
  mode: GameMode;
  guesses: Guess[];
  status: GameStatus;
  hintUsed: boolean;
  startedAt: number;
  finishedAt?: number;
}
```

`display` conserva a grafia publicada; `normalized` e usado exclusivamente para comparacoes. O conteudo editorial nao deve ser inferido pelo codigo de normalizacao.

### Catalogo

Manter dois conjuntos distintos:

- **Respostas:** subconjunto pequeno, revisado manualmente por familiaridade, nivel e adequacao ao contexto.
- **Palpites aceitos:** termos reconhecidos para validar entradas, podendo ser maior que o conjunto de respostas.

Cada resposta precisa ter definicao e exemplo revisados. Registrar origem, licenca e responsavel pela revisao do vocabulario antes de importar ou republicar qualquer base lexical. Uma referencia ortografica nao implica permissao para redistribuir seus dados.

## 5. Regras de entrada e calculo de pistas

### Normalizacao proposta

Antes de fechar o catalogo, aprovar a politica de acentos. A proposta inicial e:

1. Remover espacos externos e converter para minusculas.
2. Normalizar Unicode para NFD e remover marcas diacriticas para comparacao; isso trata vogais acentuadas sem exigir teclas especiais.
3. Aplicar a mesma regra a resposta, entrada e lista de palpites.
4. Contar letras normalizadas, nao bytes UTF-16. Rejeitar numeros, pontuacao, espacos internos e entradas com tamanho diferente de cinco.
5. Preservar e exibir a grafia original correta no catalogo e na revelacao final.

Essa regra torna `a` e `a` acentuado equivalentes para comparacao e tambem pode tornar `c` e `c` cedilhado equivalentes. A equivalencia da cedilha deve ser validada com falantes brasileiros e documentada antes do lancamento. Se houver necessidade de distinguir grafemas, usar `Intl.Segmenter` quando disponivel e uma estrategia de fallback testada.

### Feedback com letras repetidas

O calculo deve ocorrer em duas passagens para nao marcar ocorrencias duplicadas em excesso:

1. Marcar como `correct` todas as posicoes em que palpite e resposta coincidem; contabilizar apenas as letras restantes da resposta.
2. Para cada posicao ainda nao marcada, consumir uma ocorrencia restante da letra da resposta e marcar `present`; sem ocorrencia restante, marcar `absent`.

Pseudocodigo:

```text
marks = array(size=5)
remaining = contador de letras da resposta

para cada posicao i:
  se palpite[i] == resposta[i]:
    marks[i] = correct
    remaining[palpite[i]] -= 1

para cada posicao i ainda sem marca:
  se remaining[palpite[i]] > 0:
    marks[i] = present
    remaining[palpite[i]] -= 1
  senao:
    marks[i] = absent
```

Nenhuma camada visual deve recalcular marcas. O resultado do dominio e a unica fonte para tabuleiro, teclado, anuncios e compartilhamento.

### Validacao e transicao de estado

- Entrada vazia, tamanho invalido ou palpite ausente da lista aceita gera erro de validacao e nao altera `guesses`.
- Palpite valido cria exatamente um registro `Guess` e atualiza o estado.
- `won` quando a forma normalizada do palpite e igual a resposta.
- `lost` quando seis palpites validos foram feitos sem acerto.
- Estados finais nao aceitam novos palpites. Mudar entre modos nao pode reiniciar nem contornar o resultado do desafio.
- A submissao deve ser atomica: pressionar Enter e clicar em Enviar ao mesmo tempo nao pode contar duas tentativas.

## 6. Desafio diario

- O catalogo de calendario associa uma data a um `puzzleId` fixo; nao escolher aleatoriamente por carregamento.
- Definir uma data-base e uma zona horaria de produto antes do lancamento. Proposta inicial: `America/Sao_Paulo`, a confirmar para brasileiros fora desse fuso.
- Derivar a data usando `Intl.DateTimeFormat` com a zona configurada, e nao o fuso do computador sem controle.
- Resolver data em uma funcao pura, testada em virada de meia-noite, virada de ano e navegadores com fusos diferentes.
- Cada entrada do calendario aponta para um item do catalogo versionado. Atualizar respostas ja publicadas exige politica explicita para nao mudar uma partida em andamento.
- A distribuicao estaticamente hospedada nao oferece sigilo contra inspecao do bundle. Isso e aceitavel para um jogo casual sem competicao, mas deve ser entendido como uma limitacao. Nao alegar que a resposta do dia esta protegida.
- Nunca substituir silenciosamente uma resposta ausente por uma palavra aleatoria; exibir estado de indisponibilidade e registrar erro local de diagnostico sem dados pessoais.

## 7. Persistencia local e estatisticas

- Usar `localStorage` com chave namespaced, por exemplo `caderno-palavras:game:v1:<gameDate>`.
- Salvar estado depois de cada tentativa valida, uso de dica e transicao de fim.
- Validar schema ao ler. Se o dado estiver corrompido ou for de uma versao desconhecida, recuperar uma partida limpa e informar a pessoa sem quebrar o carregamento.
- Nao salvar texto livre, identificadores pessoais ou historico fora do necessario para restaurar o desafio atual e estatisticas locais.
- Guardar agregados opcionais como partidas concluidas, vitorias e distribuicao de tentativas. Definir retencao e acao para apagar esses dados nas configuracoes/ajuda.
- Se o armazenamento estiver bloqueado ou cheio, manter a partida em memoria e mostrar aviso discreto sobre a perda de progresso ao fechar/recarregar.
- Os modos classico e aprendizado compartilham o estado e o mesmo `puzzleId` diario. O modo e uma preferencia de apresentacao; alternar de modo nao concede tentativas extras.

## 8. Interacao e componentes

### Fluxo principal

1. Mostrar data do desafio, seletor de modo, regra curta e grade vazia.
2. Permitir digitar pelo teclado fisico ou tocar teclas visuais.
3. Acumular ate cinco letras; Backspace remove a ultima letra ainda nao enviada.
4. Submeter por Enter ou pelo botao de envio do teclado visual.
5. Validar, calcular feedback no dominio e atualizar grade e teclado.
6. Exibir a dica opcional conforme politica aprovada.
7. Ao ganhar/perder, revelar o estado final e disponibilizar conteudo de aprendizagem e compartilhamento.

### Componentes

- **AppHeader:** nome do jogo, data diaria e acesso a regras.
- **ModeSwitch:** botoes segmentados com estado selecionado visivel e programatico.
- **GameBoard:** seis linhas por cinco colunas; somente a linha ativa e editavel.
- **OnScreenKeyboard:** botoes virtuais com estado agregado das letras; uma marca melhor nao pode ser substituida por uma pior ao longo da partida.
- **LearningPanel:** dica, definicao e exemplo conforme o modo e a decisao de revelacao; reservar espaco responsivo, sem cobrir a grade.
- **GameStatus:** erros, tentativas restantes, vitoria/derrota e confirmacoes de compartilhamento.
- **HelpDialog:** regras, cores/simbolos e politica de acentos.
- **ShareDialog:** pre-visualizacao do texto e confirmacao/cancelamento.

Mensagens de erro devem aparecer junto ao controle relevante e em regiao de status; evitar toast que desaparece antes de poder ser lido.

## 9. Direcao de interface e responsividade

- Desktop: cabecalho compacto; tabuleiro central com largura limitada; painel editorial ao lado apenas quando houver espaco suficiente.
- Celular: uma coluna; tabuleiro primeiro, status junto ao tabuleiro, teclado abaixo e conteudo didatico depois. Sem rolagem horizontal a 320 CSS px.
- Casas quadradas com dimensoes estaveis via `aspect-ratio: 1`; teclado em grade dimensionada por colunas, com alvos de toque confortaveis.
- Evitar efeitos de papel/textura que reduzam contraste ou legibilidade. A identidade de caderno pode aparecer em hierarquia, linhas e pequenas anotacoes, nao como imagem de fundo ruidosa.
- Usar `prefers-reduced-motion`; animacoes nunca devem carregar informacao exclusiva.
- Testar zoom de 200% e reflow. Paineis, dialogos e mensagens devem quebrar linha sem sobrepor tabuleiro ou controles.

## 10. Acessibilidade e semantica

Meta: WCAG 2.2 AA nos fluxos essenciais, sujeita a auditoria manual.

- HTML semantico: `header`, `main`, headings em ordem, botoes reais, formularios e rotulos associados.
- Navegacao de tabuleiro: nao atribuir `role="grid"` sem implementar seu modelo de foco por setas. Para o MVP, preferir linhas e celulas informativas com ordem de leitura natural; uma unica entrada/botao de envio controla a linha ativa.
- Teclado fisico: aceitar letras conforme regra lexical, Backspace e Enter; ignorar atalhos quando foco estiver em controles que precisam deles.
- Foco: indicador claramente visivel, ordem logica e sem armadilhas. Dialogos retornam o foco ao controle que os abriu.
- Anuncios: regiao `role="status"` persistente comunica resultado do palpite e tentativas restantes; `role="alert"` apenas para erro urgente. Nao marcar toda a grade como `aria-live`.
- Feedback: nomear estados com texto acessivel (por exemplo, "R correta e na posicao") e nao apenas cor/forma. Garantir que o estado da tecla virtual tambem tenha nome.
- Contraste: texto normal 4,5:1; texto grande 3:1; componentes/indicadores visuais essenciais com contraste suficiente conforme WCAG. Validar tokens finais com ferramenta automatizada.
- Alvos: almejar 44 x 44 CSS px em controles de toque; nunca abaixo dos criterios WCAG aplicaveis.
- Testes manuais: NVDA com Firefox/Chrome, VoiceOver com Safari e TalkBack com Chrome nos fluxos de entrada, tentativa, ajuda e compartilhamento.

## 11. Definicao, exemplo e dicas: politica aprovada

Para preservar o desafio e manter o valor educacional, a politica aprovada para o MVP e:

- No modo **Classico**, manter a solucao sem definicao ate o fim.
- No modo **Aprender**, mostrar apos cada palpite valido a definicao e exemplo da palavra tentada, sem revelar a palavra-alvo. Ao fim da partida, mostrar definicao e exemplo da solucao.
- Oferecer uma dica semantica opcional da palavra-alvo, sem repetir a definicao literal, marcada como dica e disponivel por acao explicita.
- Modelar o painel para suportar as tres politicas (palavra tentada, dica da solucao, definicao da solucao) sem alterar o dominio do jogo.

O modo Aprender apresenta a definicao e o exemplo da palavra tentada durante a partida e revela o verbete da solucao somente no fim. Palpites aceitos sem verbete editorial mostram um aviso transparente, sem inventar uma definicao. Dica, quantidade e custo permanecem configuraveis por decisao de produto.

## 12. Compartilhamento e privacidade

- Criar uma mensagem incluindo nome do jogo, identificador/data do desafio e padrao de resultados, nunca resposta ou palpites textuais.
- Preferir `navigator.share()` quando suportado; tratar rejeicao/cancelamento sem erro e sem limpar partida.
- Fallback para `navigator.clipboard.writeText()` em contexto seguro; mostrar confirmacao acessivel. Se clipboard nao estiver disponivel, oferecer texto selecionavel.
- Nao incluir URL com parametros pessoais, nome, telemetria ou dados do dispositivo.
- Nao carregar scripts de analytics ou anuncios no MVP. Servir a aplicacao por HTTPS e aplicar politicas de seguranca de conteudo compativeis com os recursos estaticos.

## 13. Tratamento de falhas e estados

- Palavra diaria nao encontrada: tela de indisponibilidade com opcao de tentar novamente; nunca iniciar com resposta diferente por usuario.
- Palavra invalida: mensagem proxima ao tabuleiro, tentativa preservada e foco mantido em local previsivel.
- Falha de armazenamento: jogo continua em memoria com aviso; nao apresentar progresso como persistido.
- Falha de compartilhamento: manter modal/resultado, oferecer copiar ou selecionar texto; cancelamento nao e erro.
- Definicao ausente: ocultar bloco didatico ou explicar que o conteudo esta indisponivel; nunca exibir texto inventado.
- Estado final restaurado: ao recarregar, manter tentativa e resultado; evitar animacao como se o palpite tivesse acabado de ser submetido.

## 14. Plano de testes e criterios de aceite tecnico

### Unitarios

- Normalizacao de maiusculas, acentos combinantes/precompostos, cedilha e caracteres fora do alfabeto aprovado.
- Contagem de caracteres em Unicode e rejeicao de entradas com tamanho incorreto.
- Feedback de letras unicas, repetidas no palpite, repetidas na resposta e repetidas em ambos.
- Transicoes de estado: invalido, tentativa valida, vitoria, sexta tentativa e estado final sem submissao adicional.
- Agendamento diario em limites de data/fuso e calendario ausente.
- Serializacao, migracao, dado corrompido e indisponibilidade de `localStorage`.
- Mensagem de compartilhamento sem resposta/palpites e fallback de API.

### Integracao e navegador

- Jogar uma partida com teclado fisico e teclado na tela.
- Confirmar que entrada invalida nao consome tentativa e que alternar modo nao zera progresso.
- Recarregar antes e depois da conclusao e conferir restauracao local.
- Testar compartilhar, copiar, cancelar e falha de permissao.
- Verificar desktop e mobile estreito, zoom 200%, sem sobreposicao ou rolagem horizontal.
- Executar verificacao automatizada de acessibilidade e testar manualmente com leitor de tela e somente teclado.
- Conferir contrastes nas cores finais, inclusive estados desabilitados e foco.

### Aceite tecnico do MVP

- A mesma data e o mesmo calendario resultam no mesmo desafio em todos os clientes.
- Nenhuma tentativa invalida e contabilizada; uma submissao valida incrementa uma vez.
- Feedback para duplicatas e identico no tabuleiro, teclado e mensagem anunciada.
- Vitoria/derrota e estado de fim persistem corretamente no mesmo navegador.
- A grade, entrada, ajuda e compartilhamento funcionam sem mouse e sem dependencia exclusiva de cor.
- Nenhum dado pessoal e transmitido; a aplicacao funciona sem backend e sem conta.

## 15. Sequencia de implementacao

1. Aprovar as decisoes de portugues restantes (cedilha, acentos, letras aceitas) e validar a adequacao do vocabulario com criancas e jovens.
2. Criar scaffold Vite/React/TypeScript e tokens da direcao Caderno de palavras.
3. Implementar tipos, normalizacao, validacao, feedback com duplicatas e testes unitarios antes do tabuleiro.
4. Curar pequeno catalogo piloto com palavras, metadados, definicoes e exemplos licenciados/revisados.
5. Implementar calendario, estado da partida e persistencia versionada.
6. Construir tabuleiro, teclado, modos, mensagens e conteudo didatico responsivos.
7. Implementar compartilhamento sem spoiler e todos os fallbacks.
8. Fazer revisao de acessibilidade, testes de dispositivos e ajustes de conteudo.
9. Publicar bundle estatico em HTTPS; documentar como atualizar o calendario sem alterar desafios publicados.

## 16. Decisoes que precisam de confirmacao

1. A direcao Caderno de palavras e de fato a escolhida, ou deve-se usar Letreiro de feira/Rota sonora?
2. A politica aprovada e mostrar durante a partida a definicao da palavra tentada e revelar a solucao somente no fim.
3. Qual zona horaria determina a troca diaria? A proposta e `America/Sao_Paulo`.
4. Acentos e cedilha sao equivalentes na validacao e nas pistas?
5. A dica consome tentativa? Quantas dicas e de que tipo?
6. Qual nivel de proficiencia guia a curadoria? Quais flexoes e categorias entram na lista?
7. As estatisticas locais serao mantidas? Deve haver acao para apagar historico?
8. Qual fonte lexical pode ser usada e redistribuida, considerando licenca e atribuicao?