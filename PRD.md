# PRD: Jogo casual de adivinhacao de palavras

**Status:** Rascunho de descoberta; requisitos iniciais baseados nas respostas do solicitante  
**Data:** 2026-10-21  
**Produto:** Jogo web responsivo de palavras para pessoas aprendendo portugues brasileiro

## 1. Resumo

Um jogo casual, gratuito e sem anuncios que combina um desafio diario de adivinhacao no estilo Wordle com um modo de aprendizado de portugues. A experiencia deve ser rapida e acessivel, com feedback claro sobre as letras, dicas opcionais e uma forma de compartilhar resultados sem revelar a resposta.

O conceito inicial escolhido e uma palavra de cinco letras, seis tentativas e um novo desafio por dia. O publico principal sao aprendizes de portugues; o vocabulario inicial sera o portugues brasileiro. A plataforma inicial sera a web, adaptada a celulares e desktops, sem conta.

## 2. Pesquisa e implicacoes para o produto

### Padroes observados

- O Wordle oficial descreve o nucleo do formato como seis chances para adivinhar uma palavra de cinco letras. Isso demonstra um loop facil de explicar e delimitar, mas nao prova que essa configuracao seja ideal para todos os publicos.
- O Termo, uma implementacao brasileira do formato, informa que ha uma palavra nova por dia, que palavras podem conter letras repetidas e que acentos sao preenchidos automaticamente e ignorados nas dicas. Sua pagina tambem apresenta modos relacionados, como Dueto e Quarteto. Isso oferece precedentes praticos para regras de portugues e expansoes de modo.
- O Vocabulario Ortografico da Lingua Portuguesa (VOLP), mantido pela Academia Brasileira de Letras, e uma referencia possivel para curadoria lexical. A pagina de busca da ABL descreve a base como abrangendo termos vernaculos do VOLP, estrangeirismos, toponimos e gentílicos. A inclusao de cada categoria no jogo ainda precisa de decisao editorial e verificacao de licenca/condicoes de uso.
- As orientacoes WCAG 2.2 do W3C dizem que as funcionalidades devem ser operaveis por teclado e que texto normal deve atingir contraste minimo de 4,5:1 (3:1 para texto grande). Para este jogo, isso significa nao depender apenas das cores para transmitir pistas e garantir que digitacao, envio e controles possam ser usados por teclado.

### O que isso sugere (hipoteses, nao fatos garantidos)

- Um desafio diario e facil de compartilhar e oferece um ponto de entrada comum, mas a retencao gerada por essa cadencia precisa ser validada com jogadores.
- O modo de aprendizado pode diferenciar o produto se ensinar o significado sem invalidar o desafio. Mostrar definicao da palavra secreta a cada tentativa pode entregar a resposta cedo demais; essa decisao deve ser testada antes de virar comportamento definitivo.
- Em portugues, letras acentuadas, flexoes, letras repetidas e variacao regional alteram tanto o conjunto de respostas validas quanto a justica percebida. A lista de respostas deve ser curada e testada com falantes brasileiros, nao apenas importada de um dicionario.
- Compartilhamento sem spoiler pode convidar comparacao social sem expor a solucao. O formato exato, a privacidade e o funcionamento quando o usuario cancela o compartilhamento ainda devem ser definidos.

### Referencias consultadas

- [Wordle, The New York Times Games](https://www.nytimes.com/games/wordle/index.html): formato anunciado de seis tentativas para palavra de cinco letras.
- [Termo](https://term.ooo/): regras publicadas sobre tentativas, desafios diarios, acentos, letras repetidas e modos adicionais.
- [Busca no vocabulario, Academia Brasileira de Letras](https://www.academia.org.br/nossa-lingua/busca-no-vocabulario): escopo declarado da base lexical da ABL.
- [WCAG 2.2: Contraste minimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): requisitos e explicacao de contraste de texto.
- [WCAG 2.2: Teclado](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html): operabilidade por teclado.

## 3. Publico e necessidade

**Publico primario:** pessoas aprendendo portugues, especialmente portugues brasileiro. Nivel de proficiencia, faixa etaria e necessidades de acessibilidade especificas ainda nao foram definidos.

**Necessidade a atender:** praticar vocabulario de forma leve e recorrente, com um desafio curto e feedback que ajude a compreender letras e palavras sem exigir cadastro.

## 4. Objetivos

- Oferecer uma partida diaria simples de iniciar e concluir em uma sessao curta.
- Apoiar aprendizagem de vocabulario brasileiro por meio de definicoes e exemplos contextualizados.
- Tornar as regras de letras, acentos e tentativas previsiveis e justas.
- Permitir compartilhar o desempenho sem revelar a palavra secreta.
- Funcionar em telas pequenas e grandes, com entrada por teclado fisico ou interface na tela.

## 5. Fora de escopo inicial

- Contas, perfis e sincronizacao de progresso entre dispositivos.
- Anuncios, assinatura ou compra dentro do produto.
- Multijogador, ranking global ou competicao em tempo real.
- Modos adicionais como Dueto/Quarteto, ate que o nucleo esteja validado.
- Suporte a variantes de portugues fora do Brasil no primeiro lancamento.

## 6. Experiencia principal

1. A pessoa abre o jogo e escolhe entre modo classico e modo aprendizado.
2. O jogo apresenta as regras, o estado do desafio diario e a entrada de cinco letras.
3. A pessoa envia uma palavra valida. O jogo informa quais letras estao corretas e em posicao correta, presentes em outra posicao ou ausentes.
4. A partida termina quando a palavra e descoberta ou quando as seis tentativas acabam.
5. O resultado mostra o desfecho, permite consultar conteudo de aprendizado conforme as regras a definir e oferece compartilhamento sem spoiler.

## 7. Requisitos funcionais iniciais

### Jogo

- **RF-01:** disponibilizar um desafio diario com uma palavra-alvo de cinco letras e no maximo seis tentativas.
- **RF-02:** aceitar apenas palpites de cinco letras presentes na lista aprovada de tentativas validas; exibir uma mensagem clara para entradas invalidas sem consumir tentativa.
- **RF-03:** apos cada palpite valido, indicar letras corretas na posicao, presentes em outra posicao e ausentes. O feedback deve ser consistente quando uma letra aparece mais de uma vez.
- **RF-04:** encerrar a partida ao acertar a palavra ou esgotar as tentativas e apresentar um estado final claro.
- **RF-05:** permitir escolher o modo classico ou o modo aprendizado. Ambos devem usar regras de entrada e feedback coerentes; definir se compartilham a palavra diaria.
- **RF-06:** oferecer dicas opcionais. Quantidade, custo em tentativas, tipo de dica e disponibilidade por modo estao pendentes.
- **RF-07:** permitir compartilhar uma representacao do resultado sem incluir a palavra secreta nem o texto dos palpites. A pessoa deve poder cancelar sem perder o progresso.

### Aprendizado e vocabulario

- **RF-08:** oferecer definicao e exemplo de uso em portugues brasileiro no modo de aprendizado. A resposta inicial do solicitante pede que sejam da palavra secreta e aparecam apos cada tentativa; esse comportamento precisa de confirmacao, pois pode revelar a solucao e eliminar o desafio.
- **RF-09:** validar respostas e palpites contra uma lista lexical curada. Fonte, licenca, categorias aceitas, flexoes e processo de revisao ainda precisam ser definidos.
- **RF-10:** definir e aplicar uma regra unica para acentos e cedilha na entrada, comparacao e feedback. O Termo e um precedente, mas a regra final deste produto esta pendente.
- **RF-11:** documentar como o jogo trata letras repetidas, nomes proprios, abreviacoes, palavras raras, estrangeirismos e variantes regionais antes da publicacao da lista.

### Plataforma, acesso e persistencia

- **RF-12:** funcionar em navegadores modernos de celular e desktop, com layout responsivo.
- **RF-13:** permitir operar o jogo por teclado e por controles na tela; comunicar estado e feedback sem depender somente de cor.
- **RF-14:** atender como meta de acessibilidade a WCAG 2.2 nivel AA nos fluxos principais, incluindo contraste de texto conforme o criterio 1.4.3 e operacao por teclado conforme o criterio 2.1.1.
- **RF-15:** salvar estado da partida e estatisticas localmente, sem conta, se essa decisao for confirmada. Definir comportamento para troca de dispositivo, limpeza de dados e fuso horario do desafio diario.
- **RF-16:** nao exibir anuncios nem exigir pagamento no escopo inicial.

## 8. Requisitos nao funcionais e conteudo

- A interface e as instrucoes devem estar em portugues brasileiro.
- As palavras-alvo devem ser familiares e adequadas ao nivel de proficiencia escolhido; evitar respostas que dependam de regionalismos obscuros sem contexto.
- Definicoes e frases de exemplo devem ser revisadas quanto a clareza, correcao e contexto de uso.
- O compartilhamento nao deve incluir a resposta, dados pessoais ou identificadores de conta.
- A regra que determina a palavra do dia deve produzir a mesma resposta para todas as pessoas no mesmo dia, com data e fuso horario explicitamente definidos.
- O jogo deve preservar uma tentativa em andamento ao recarregar a pagina no mesmo dispositivo, caso a persistencia local seja aprovada.

## 9. Criterios de aceite do MVP (proposta)

- Uma pessoa consegue iniciar uma partida sem criar conta e entende as regras antes do primeiro palpite.
- Palpite valido e invalido sao distinguidos; entrada invalida nao reduz o numero de tentativas.
- Feedback de posicao e letras repetidas segue regras publicadas e cobertas por exemplos de teste.
- Vitoria e derrota encerram corretamente a partida e mostram um estado final.
- O resultado pode ser compartilhado sem spoiler, com alternativa de cancelar.
- Os fluxos principais podem ser concluidos por teclado e a informacao nao depende exclusivamente das cores.
- A experiencia permanece utilizavel em viewport estreita de celular e em desktop.
- O modo de aprendizado mostra informacao lexical revisada sem contrariar a decisao sobre quando revelar a solucao.

## 10. Medicao de sucesso (a definir)

Metricas candidatas: taxa de partidas iniciadas/concluidas, distribuicao de vitorias por numero de tentativas, uso de dicas, retorno ao desafio diario, uso de compartilhamento e compreensao de palavras apos a partida. Como o produto nao tera contas, decidir se metricas serao apenas locais/anonimas, agregadas com consentimento ou avaliadas por testes de usabilidade sem telemetria. Nenhuma retencao ou meta numerica foi presumida.

## 11. Riscos e decisoes pendentes

- **Revelacao prematura:** definicao da palavra secreta depois de cada palpite pode entregar a resposta. Confirmar se o conteudo deve ser da palavra tentada, aparecer apenas ao fim, ou ser uma dica opcional.
- **Escopo do dicionario:** palavras aceitas podem parecer injustas se forem raras, regionais, flexionadas ou pouco adequadas ao nivel de quem aprende. Definir curadoria e revisar respostas antes de agendar desafios.
- **Acentos e cedilha:** normalizar sem explicar a regra pode confundir; validar exemplos com participantes brasileiros.
- **Letras duplicadas:** comparar letras por posicao sem contabilizar ocorrencias pode produzir feedback errado.
- **Diario versus pratica:** ainda nao esta decidido se havera somente o desafio diario ou uma pratica ilimitada separada.
- **Sem conta:** progresso fica associado ao dispositivo/navegador; nao ha sincronizacao nem recuperacao apos limpeza de dados.
- **Metricas:** telemetria pode contrariar a expectativa de simplicidade e privacidade; nao implementar coleta antes de decidir necessidade e consentimento.

## 12. Perguntas para fechar o PRD

1. A definicao e o exemplo devem ser da palavra secreta apos cada palpite, da palavra que a pessoa tentou, ou da solucao somente no fim da partida?
2. O modo classico e o modo aprendizado usam a mesma palavra diaria e o mesmo limite de tentativas? Deve existir pratica ilimitada?
3. Como uma dica funciona: revelar uma letra, dar uma pista semantica, mostrar uma frase de exemplo ou reduzir a pontuacao?
4. Qual nivel de portugues e faixa etaria devem orientar a selecao de palavras e exemplos?
5. Quais categorias entram na lista: substantivos apenas ou tambem verbos conjugados, plurais, nomes proprios, estrangeirismos e regionalismos?
6. Acentos devem ser obrigatorios na digitacao, preenchidos automaticamente ou ignorados na validacao e nas pistas? A letra C e cedilha devem ser equivalentes?
7. O progresso deve persistir apenas no navegador? Qual fuso horario define a troca do desafio diario?
8. Estatisticas locais bastam ou existe necessidade de metricas agregadas com consentimento? Que resultado deve aparecer ao compartilhar?
9. Qual identidade visual e tom de voz voce imagina para o jogo?
10. O projeto e pessoal/educacional, ou existe uma meta de lancamento, prazo e plataforma de hospedagem?

## 13. Respostas ja registradas

- Publico principal: aprendizes de portugues.
- Ritmo: desafio diario.
- Mecanica: modo classico junto de modo aprendizado.
- Formato inicial: palavra de cinco letras, seis tentativas.
- Variante: portugues brasileiro.
- Aprendizado: definicao e exemplo da solucao apos cada tentativa (precisa confirmar o risco de spoiler descrito acima).
- Recursos: compartilhar resultado sem spoiler e dicas/ajuda.
- Plataforma: web responsiva, sem conta.
- Monetizacao: gratuito e sem anuncios.

## 14. Direcao aprovada para o MVP

Este alinhamento foi atualizado pelo solicitante em 2026-10-21 e prevalece sobre as premissas anteriores deste rascunho quando houver conflito.

- Publico: criancas e jovens; nivel de leitura e faixa etaria exata devem ser validados em testes com usuarios.
- Produto: jogo casual diario, web responsiva e mobile-first, com palavra secreta e tema do dia.
- Estrategia: estimular recorrencia diaria com uma sequencia de dias consecutivos e crescimento organico via compartilhamento.
- Monetizacao: nenhuma no MVP.
- Design escolhido: **Caderno de palavras**, uma interface editorial acolhedora com o tabuleiro em primeiro plano.
- Variantes para comparacao: a galeria interativa pode ser aberta em `game/?prototypes=1` (Caderno, Feira e Rota); a experiencia regular usa Caderno.
- Regras operacionais mantidas da proposta tecnica: palavras de cinco letras, seis tentativas, acentos normalizados, desafio tematico diario e armazenamento local sem conta.
- No modo Aprender, definicao e exemplo da palavra tentada aparecem durante a partida; a solucao e explicada somente ao final para evitar spoiler.

O catalogo inicial tem 34 desafios editoriais, portanto nao repete palavras nos primeiros 34 dias. O conteudo deve ser ampliado e revisado antes de uma publicacao prolongada.