export const MAX_ATTEMPTS = 6
export const WORD_LENGTH = 5
export const GAME_TIME_ZONE = 'America/Sao_Paulo'

export type LetterMark = 'correct' | 'present' | 'absent'
export type GameStatus = 'playing' | 'won' | 'lost'
export type GameMode = 'classic' | 'learn'

export interface Puzzle {
  id: string
  theme: string
  word: string
  hint: string
  definition: string
  example: string
}

export interface Guess {
  word: string
  marks: LetterMark[]
}

export interface GameState {
  schemaVersion: 1
  puzzleId: string
  gameDate: string
  mode: GameMode
  guesses: Guess[]
  status: GameStatus
  hintUsed: boolean
}

export type GuessResult =
  | { accepted: true; state: GameState; guess: Guess }
  | { accepted: false; reason: 'invalid-length' | 'unknown-word' | 'game-over' }

export const PUZZLES: Puzzle[] = [
  {
    id: 'animal-tigre',
    theme: 'Animais',
    word: 'TIGRE',
    hint: 'Esse felino tem listras escuras.',
    definition: 'Grande felino conhecido pela pelagem laranja com listras pretas.',
    example: 'O tigre caminhou pela mata com passos silenciosos.',
  },
  {
    id: 'natureza-folha',
    theme: 'Natureza',
    word: 'FOLHA',
    hint: 'Ela pode cair das árvores no outono.',
    definition: 'Parte geralmente verde de uma planta, ligada ao caule.',
    example: 'Uma folha caiu devagar perto do jardim.',
  },
  {
    id: 'comidas-manga',
    theme: 'Frutas',
    word: 'MANGA',
    hint: 'Fruta doce que cresce em uma árvore.',
    definition: 'Fruta tropical de polpa macia, doce e perfumada.',
    example: 'A manga madura ficou geladinha na sobremesa.',
  },
  {
    id: 'objetos-livro',
    theme: 'Objetos',
    word: 'LIVRO',
    hint: 'Tem páginas que contam histórias ou ensinam algo.',
    definition: 'Conjunto de páginas reunidas com texto, imagens ou ambos.',
    example: 'Lia escolheu um livro de aventuras na biblioteca.',
  },
  {
    id: 'lugares-praia',
    theme: 'Lugares',
    word: 'PRAIA',
    hint: 'Lugar onde a areia encontra o mar.',
    definition: 'Faixa de areia ou pedras junto ao mar, rio ou lago.',
    example: 'A família caminhou pela praia ao fim da tarde.',
  },
  {
    id: 'ceu-nuvem',
    theme: 'Céu e clima',
    word: 'NUVEM',
    hint: 'Pode deixar o céu nublado e trazer chuva.',
    definition: 'Massa visível de gotículas de água ou cristais de gelo no céu.',
    example: 'Uma nuvem cobriu o sol por alguns minutos.',
  },
  {
    id: 'musica-piano',
    theme: 'Música',
    word: 'PIANO',
    hint: 'Instrumento tocado com teclas pretas e brancas.',
    definition: 'Instrumento musical de teclado, cordas e som delicado.',
    example: 'Rafa praticou uma canção nova no piano.',
  },
  {
    id: 'animal-zebra',
    theme: 'Animais',
    word: 'ZEBRA',
    hint: 'Seu pelo tem listras brancas e pretas.',
    definition: 'Mamífero africano parecido com o cavalo e coberto de listras.',
    example: 'A zebra caminhou junto de seu grupo pela savana.',
  },
  {
    id: 'animal-panda',
    theme: 'Animais',
    word: 'PANDA',
    hint: 'Esse urso adora comer bambu.',
    definition: 'Urso de pelagem preta e branca que vive na China.',
    example: 'O panda descansou depois de comer bambu.',
  },
  {
    id: 'animal-ganso',
    theme: 'Animais',
    word: 'GANSO',
    hint: 'Essa ave pode nadar em lagos e tem o pescoço comprido.',
    definition: 'Ave de pescoço comprido, criada em sítios ou encontrada perto da água.',
    example: 'O ganso atravessou o gramado até a lagoa.',
  },
  {
    id: 'animal-cobra',
    theme: 'Animais',
    word: 'COBRA',
    hint: 'Réptil comprido que não tem patas.',
    definition: 'Réptil de corpo alongado que se move rastejando.',
    example: 'A cobra se escondeu entre as folhas.',
  },
  {
    id: 'natureza-pedra',
    theme: 'Natureza',
    word: 'PEDRA',
    hint: 'Pedaço duro que pode ser encontrado no chão.',
    definition: 'Fragmento sólido de rocha, encontrado na natureza.',
    example: 'Uma pedra lisa ficou perto do riacho.',
  },
  {
    id: 'natureza-grama',
    theme: 'Natureza',
    word: 'GRAMA',
    hint: 'Ela cobre muitos jardins e campos.',
    definition: 'Conjunto de plantas baixas que cobrem o solo.',
    example: 'As crianças correram pela grama do parque.',
  },
  {
    id: 'natureza-musgo',
    theme: 'Natureza',
    word: 'MUSGO',
    hint: 'Planta pequena que cresce em lugares úmidos.',
    definition: 'Planta pequena que costuma crescer sobre pedras e troncos úmidos.',
    example: 'Um tapete de musgo cobria a pedra perto da cachoeira.',
  },
  {
    id: 'fruta-melao',
    theme: 'Frutas',
    word: 'MELÃO',
    hint: 'Fruta redonda, doce e refrescante.',
    definition: 'Fruto grande, geralmente redondo, de polpa doce e suculenta.',
    example: 'No lanche, Bia comeu uma fatia gelada de melão.',
  },
  {
    id: 'fruta-peras',
    theme: 'Frutas',
    word: 'PERAS',
    hint: 'Frutas doces que costumam ser mais largas embaixo.',
    definition: 'Frutos macios e suculentos que crescem na pereira.',
    example: 'As peras maduras ficaram na fruteira.',
  },
  {
    id: 'fruta-limao',
    theme: 'Frutas',
    word: 'LIMÃO',
    hint: 'Fruta cítrica de sabor bem azedinho.',
    definition: 'Fruto cítrico de casca verde ou amarela e polpa ácida.',
    example: 'Um pouco de limão deixou a água mais refrescante.',
  },
  {
    id: 'fruta-macas',
    theme: 'Frutas',
    word: 'MAÇÃS',
    hint: 'Frutas crocantes que podem ser vermelhas ou verdes.',
    definition: 'Frutos redondos e crocantes que crescem na macieira.',
    example: 'As maçãs foram lavadas antes do piquenique.',
  },
  {
    id: 'objeto-lapis',
    theme: 'Objetos',
    word: 'LÁPIS',
    hint: 'Objeto comprido usado para escrever e desenhar.',
    definition: 'Instrumento com grafite usado para escrever ou desenhar.',
    example: 'Davi apontou o lápis para terminar o desenho.',
  },
  {
    id: 'objeto-tinta',
    theme: 'Objetos',
    word: 'TINTA',
    hint: 'Material colorido que usamos para pintar.',
    definition: 'Líquido colorido usado para pintar ou escrever.',
    example: 'A tinta azul deixou o cartaz bem alegre.',
  },
  {
    id: 'objeto-pente',
    theme: 'Objetos',
    word: 'PENTE',
    hint: 'Tem dentes e ajuda a arrumar o cabelo.',
    definition: 'Objeto com dentes alinhados usado para desembaraçar os cabelos.',
    example: 'Ela guardou o pente na gaveta do banheiro.',
  },
  {
    id: 'objeto-chave',
    theme: 'Objetos',
    word: 'CHAVE',
    hint: 'Ela ajuda a abrir uma porta trancada.',
    definition: 'Peça usada para abrir ou fechar uma fechadura.',
    example: 'Caio encontrou a chave dentro da mochila.',
  },
  {
    id: 'lugar-praca',
    theme: 'Lugares',
    word: 'PRAÇA',
    hint: 'Lugar público com bancos, árvores e caminhos.',
    definition: 'Espaço público aberto, muitas vezes com bancos e jardins.',
    example: 'A turma se encontrou na praça depois da aula.',
  },
  {
    id: 'lugar-campo',
    theme: 'Lugares',
    word: 'CAMPO',
    hint: 'Área aberta onde pode haver plantações e animais.',
    definition: 'Terreno amplo, muitas vezes usado para plantio ou criação de animais.',
    example: 'As borboletas voavam pelo campo florido.',
  },
  {
    id: 'lugar-lagoa',
    theme: 'Lugares',
    word: 'LAGOA',
    hint: 'Pequena porção de água cercada por terra.',
    definition: 'Extensão de água parada, menor que um lago.',
    example: 'Um sapo pulou para dentro da lagoa.',
  },
  {
    id: 'lugar-ilhas',
    theme: 'Lugares',
    word: 'ILHAS',
    hint: 'Terras cercadas de água por todos os lados.',
    definition: 'Porções de terra completamente rodeadas por água.',
    example: 'O mapa mostrava pequenas ilhas no oceano.',
  },
  {
    id: 'clima-chuva',
    theme: 'Céu e clima',
    word: 'CHUVA',
    hint: 'Gotas de água que caem das nuvens.',
    definition: 'Água que cai das nuvens em forma de gotas.',
    example: 'A chuva molhou as plantas do jardim.',
  },
  {
    id: 'clima-vento',
    theme: 'Céu e clima',
    word: 'VENTO',
    hint: 'Ar em movimento que balança as folhas.',
    definition: 'Movimento do ar que podemos sentir na pele.',
    example: 'Um vento fresco entrou pela janela.',
  },
  {
    id: 'clima-nevoa',
    theme: 'Céu e clima',
    word: 'NÉVOA',
    hint: 'Uma camada leve que deixa a paisagem meio escondida.',
    definition: 'Pequenas gotículas de água suspensas perto do chão, como uma nuvem baixa.',
    example: 'A névoa cobriu o campo no começo da manhã.',
  },
  {
    id: 'clima-geada',
    theme: 'Céu e clima',
    word: 'GEADA',
    hint: 'Uma camada branca de gelo pode aparecer nas plantas em manhãs frias.',
    definition: 'Camada fina de gelo formada sobre superfícies em noites muito frias.',
    example: 'A geada deixou as folhas branquinhas ao amanhecer.',
  },
  {
    id: 'musica-viola',
    theme: 'Música',
    word: 'VIOLA',
    hint: 'Instrumento de cordas parecido com o violão, comum na música caipira.',
    definition: 'Instrumento musical de cordas tocado com os dedos ou uma palheta.',
    example: 'O som da viola acompanhou a cantoria.',
  },
  {
    id: 'musica-ritmo',
    theme: 'Música',
    word: 'RITMO',
    hint: 'É o que faz a música ter uma batida que dá vontade de dançar.',
    definition: 'Organização dos sons e pausas que forma a batida de uma música.',
    example: 'A banda mudou o ritmo e todos começaram a dançar.',
  },
  {
    id: 'musica-coral',
    theme: 'Música',
    word: 'CORAL',
    hint: 'Grupo de pessoas que canta junto.',
    definition: 'Grupo de cantores que se apresenta em conjunto.',
    example: 'O coral ensaiou uma canção para a festa da escola.',
  },
  {
    id: 'musica-notas',
    theme: 'Música',
    word: 'NOTAS',
    hint: 'Sinais escritos que mostram quais sons tocar.',
    definition: 'Sons musicais organizados em uma escala, ou sinais que os representam.',
    example: 'Luna reconheceu as notas da melodia no papel.',
  },
]

const EXTRA_VALID_GUESSES = `ABRIR ACENO ACESA ACESO AGORA AGUAS AINDA ALADO ALBUM ALUNO AMIGO AMORA ANIMO ANTES APICE APOIO ARARA AREIA ARROZ ATLAS AVIAO BAILE BANCO BARCO BATER BEBER BICHO BOLSA BRISA CABRA CAFES CAIXA CALMA CAMPO CANOA CANTO CAPIM CARRO CARTA CEDRO CELAS CENAS CHAVE CICLO CINCO CLIMA COISA COLAR COMER CONTA CORPO COURO CRAVO DEDOS DENTE DEZEM DOCE DORME FALAR FASES FELIZ FERRO FILME FIVEL FLORA FRUTA GATOS GENTE GRAMA GRUPO HOTEL LAGOA LARVA LENTO LETRA LIMAO LINDA LISTA LOUSA LUGAR MACIO MAIOR MANHA MAPAS MARTE MELAO MENOS MISTO MODOS MUNDO NAVIO NINHO NOITE ONDAS ORDEM PAPEL PARTE PEDRA PEIXE PENTE PINTO PLANO PLUMA PONTO PORTA PRATO PRIMA QUASE QUERO REINO ROCHA SABER SAIDA SAUDE SENHA SERES SOMAR TERRA TOCAR VERDE VENTO VIDRO VISTA`.split(' ')

export const VALID_GUESSES = new Set([
  ...PUZZLES.map((puzzle) => normalizeWord(puzzle.word)),
  ...EXTRA_VALID_GUESSES.map(normalizeWord),
])

export function normalizeWord(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleUpperCase('pt-BR')
}

export function getGameDate(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: GAME_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? ''

  return `${part('year')}-${part('month')}-${part('day')}`
}

function daysBetween(olderDate: string, newerDate: string): number {
  const toUtcDay = (value: string) => {
    const [year, month, day] = value.split('-').map(Number)
    return Date.UTC(year, month - 1, day) / 86_400_000
  }
  return toUtcDay(newerDate) - toUtcDay(olderDate)
}

export function getCurrentStreak(
  streak: number,
  lastCompletedDate: string | undefined,
  today: string,
): number {
  if (!lastCompletedDate) return 0
  const daysSinceLastGame = daysBetween(lastCompletedDate, today)
  return daysSinceLastGame >= 0 && daysSinceLastGame <= 1 ? streak : 0
}

export function getStreakAfterCompletion(
  streak: number,
  lastCompletedDate: string | undefined,
  completedDate: string,
): number {
  return lastCompletedDate && daysBetween(lastCompletedDate, completedDate) === 1
    ? streak + 1
    : 1
}

export function getPuzzleForDate(gameDate: string): Puzzle {
  const [year, month, day] = gameDate.split('-').map(Number)
  const [baseYear, baseMonth, baseDay] = '2026-10-21'.split('-').map(Number)
  const dayNumber = Math.floor(
    (Date.UTC(year, month - 1, day) - Date.UTC(baseYear, baseMonth - 1, baseDay)) /
      86_400_000,
  )
  const index = ((dayNumber % PUZZLES.length) + PUZZLES.length) % PUZZLES.length

  return PUZZLES[index]
}

export function createGameState(puzzle: Puzzle, gameDate: string): GameState {
  return {
    schemaVersion: 1,
    puzzleId: puzzle.id,
    gameDate,
    mode: 'classic',
    guesses: [],
    status: 'playing',
    hintUsed: false,
  }
}

export function gradeGuess(answer: string, guess: string): LetterMark[] {
  const targetLetters = [...normalizeWord(answer)]
  const guessLetters = [...normalizeWord(guess)]
  const marks: LetterMark[] = Array(WORD_LENGTH).fill('absent')
  const remaining = new Map<string, number>()

  targetLetters.forEach((letter, index) => {
    if (guessLetters[index] === letter) {
      marks[index] = 'correct'
    } else {
      remaining.set(letter, (remaining.get(letter) ?? 0) + 1)
    }
  })

  guessLetters.forEach((letter, index) => {
    if (marks[index] === 'correct') return

    const available = remaining.get(letter) ?? 0
    if (available > 0) {
      marks[index] = 'present'
      remaining.set(letter, available - 1)
    }
  })

  return marks
}

export function submitGuess(
  state: GameState,
  puzzle: Puzzle,
  rawGuess: string,
): GuessResult {
  if (state.status !== 'playing') return { accepted: false, reason: 'game-over' }

  const word = normalizeWord(rawGuess)
  if ([...word].length !== WORD_LENGTH) {
    return { accepted: false, reason: 'invalid-length' }
  }
  if (!VALID_GUESSES.has(word)) {
    return { accepted: false, reason: 'unknown-word' }
  }

  const guess: Guess = { word, marks: gradeGuess(puzzle.word, word) }
  const guesses = [...state.guesses, guess]
  const status: GameStatus =
    word === normalizeWord(puzzle.word)
      ? 'won'
      : guesses.length >= MAX_ATTEMPTS
        ? 'lost'
        : 'playing'

  return {
    accepted: true,
    guess,
    state: { ...state, guesses, status },
  }
}

export function getKeyboardMarks(guesses: Guess[]): Map<string, LetterMark> {
  const priority: Record<LetterMark, number> = {
    absent: 0,
    present: 1,
    correct: 2,
  }
  const marks = new Map<string, LetterMark>()

  for (const guess of guesses) {
    guess.word.split('').forEach((letter, index) => {
      const nextMark = guess.marks[index]
      const currentMark = marks.get(letter)
      if (!currentMark || priority[nextMark] > priority[currentMark]) {
        marks.set(letter, nextMark)
      }
    })
  }

  return marks
}

export function createShareText(state: GameState, puzzle: Puzzle, gameUrl = ''): string {
  const outcome = state.status === 'won' ? `${state.guesses.length}/6` : 'X/6'
  const symbols: Record<LetterMark, string> = {
    correct: '🟩',
    present: '🟨',
    absent: '⬛',
  }
  const grid = state.guesses
    .map((guess) => guess.marks.map((mark) => symbols[mark]).join(''))
    .join('\n')

  const invitation = gameUrl ? `\n\nJogue também: ${gameUrl}` : ''
  return `Palavra do Dia · ${puzzle.theme} · ${state.gameDate}\n${outcome}\n\n${grid}${invitation}`
}