import { useEffect, useRef, useState } from 'react'
import {
  createGameState,
  createShareText,
  getCurrentStreak,
  getGameDate,
  getKeyboardMarks,
  getPuzzleForDate,
  getStreakAfterCompletion,
  MAX_ATTEMPTS,
  normalizeWord,
  PUZZLES,
  submitGuess,
  type GameMode,
  type GameState,
  type LetterMark,
} from './game'
import './App.css'

const gameDate = getGameDate()
const puzzle = getPuzzleForDate(gameDate)
const isPrototypeGallery = new URLSearchParams(window.location.search).has('prototypes')
const STORAGE_KEY = `palavrinha:${isPrototypeGallery ? 'prototype' : 'game'}:v1:${gameDate}`
const DRAFT_KEY = `palavrinha:${isPrototypeGallery ? 'prototype-draft' : 'draft'}:v1:${gameDate}`
const STATS_KEY = `palavrinha:${isPrototypeGallery ? 'prototype-stats' : 'stats'}:v1`
const KEY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']
const MARK_LABELS: Record<LetterMark, string> = {
  correct: 'correta e na posição',
  present: 'presente em outra posição',
  absent: 'não aparece na palavra',
}

interface DailyStats {
  played: number
  wins: number
  solvedIn: number[]
  completedDates: string[]
  streak: number
  lastCompletedDate?: string
}

type DesignVariant = 'caderno' | 'feira' | 'rota'

const DESIGN_OPTIONS: { id: DesignVariant; label: string; description: string }[] = [
  { id: 'caderno', label: 'Caderno', description: 'Editorial e acolhedor' },
  { id: 'feira', label: 'Feira', description: 'Gráfico e vibrante' },
  { id: 'rota', label: 'Rota', description: 'Percurso de descoberta' },
]

const EMPTY_STATS: DailyStats = {
  played: 0,
  wins: 0,
  solvedIn: [0, 0, 0, 0, 0, 0],
  completedDates: [],
  streak: 0,
}

function loadGame(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed: unknown = JSON.parse(saved)
      if (isGameState(parsed)) return parsed
    }
  } catch {
    // Storage can be disabled by the browser or operating system.
  }

  return createGameState(puzzle, gameDate)
}

function isGameState(value: unknown): value is GameState {
  if (!value || typeof value !== 'object') return false
  const state = value as Partial<GameState>
  return (
    state.schemaVersion === 1 &&
    state.puzzleId === puzzle.id &&
    state.gameDate === gameDate &&
    (state.mode === 'classic' || state.mode === 'learn') &&
    Array.isArray(state.guesses) &&
    state.guesses.length <= MAX_ATTEMPTS &&
    state.guesses.every(
      (guess) =>
        typeof guess?.word === 'string' &&
        guess.word.length === 5 &&
        Array.isArray(guess.marks) &&
        guess.marks.length === 5 &&
        guess.marks.every((mark) => mark === 'correct' || mark === 'present' || mark === 'absent'),
    ) &&
    (state.status === 'playing' || state.status === 'won' || state.status === 'lost') &&
    typeof state.hintUsed === 'boolean'
  )
}

function loadStats(): DailyStats {
  try {
    const saved = localStorage.getItem(STATS_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<DailyStats>
      if (
        typeof parsed.played === 'number' &&
        typeof parsed.wins === 'number' &&
        Array.isArray(parsed.solvedIn) &&
        Array.isArray(parsed.completedDates)
      ) {
        return {
          ...EMPTY_STATS,
          ...parsed,
          streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
          lastCompletedDate:
            typeof parsed.lastCompletedDate === 'string'
              ? parsed.lastCompletedDate
              : parsed.completedDates.at(-1),
        }
      }
    }
  } catch {
    // Start with fresh local stats if stored data is unavailable.
  }

  return EMPTY_STATS
}

function loadDraft(): string {
  try {
    const saved = localStorage.getItem(DRAFT_KEY)
    if (!saved) return ''
    const normalized = normalizeWord(saved)
    return [...normalized].length <= 5 && /^[A-Z]*$/.test(normalized) ? normalized : ''
  } catch {
    return ''
  }
}

function persistGame(state: GameState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}

function persistStats(nextStats: DailyStats): boolean {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(nextStats))
    return true
  } catch {
    return false
  }
}

function dateLabel(): string {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
}

function App() {
  const [design, setDesign] = useState<DesignVariant>(() => {
    const requested = new URLSearchParams(window.location.search).get('design')
    return isPrototypeGallery && DESIGN_OPTIONS.some((option) => option.id === requested)
      ? (requested as DesignVariant)
      : 'caderno'
  })
  const [game, setGame] = useState<GameState>(loadGame)
  const [draft, setDraft] = useState(loadDraft)
  const [message, setMessage] = useState('Digite uma palavra de cinco letras.')
  const [storageWarning, setStorageWarning] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [stats, setStats] = useState<DailyStats>(loadStats)
  const dialogRef = useRef<HTMLElement>(null)
  const dialogCloseRef = useRef<HTMLButtonElement>(null)

  const keyboardMarks = getKeyboardMarks(game.guesses)
  const completed = game.status !== 'playing'
  const remaining = MAX_ATTEMPTS - game.guesses.length
  const currentStreak = getCurrentStreak(stats.streak, stats.lastCompletedDate, gameDate)
  const lastGuess = game.guesses.at(-1)
  const lastLesson = lastGuess
    ? PUZZLES.find((entry) => normalizeWord(entry.word) === lastGuess.word)
    : undefined

  useEffect(() => {
    const checkForNewDay = () => {
      if (getGameDate() !== gameDate) window.location.reload()
    }
    const timer = window.setInterval(checkForNewDay, 30_000)
    document.addEventListener('visibilitychange', checkForNewDay)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', checkForNewDay)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showHelp || showShare || completed) return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      ) {
        return
      }

      if (event.key === 'Backspace') {
        event.preventDefault()
        updateDraft(draft.slice(0, -1))
      } else if (event.key === 'Enter') {
        event.preventDefault()
        handleSubmit()
      } else if (/^[a-zA-ZçÇ]$/.test(event.key)) {
        event.preventDefault()
        addLetter(event.key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  useEffect(() => {
    if (!showHelp && !showShare) return

    const previousFocus = document.activeElement
    const getFocusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), textarea:not(:disabled), input:not(:disabled), a[href]',
        ) ?? [],
      )
    dialogCloseRef.current?.focus()

    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowHelp(false)
        setShowShare(false)
        return
      }
      if (event.key !== 'Tab') return

      const focusable = getFocusable()
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleDialogKeys)
    return () => {
      document.removeEventListener('keydown', handleDialogKeys)
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus()
    }
  }, [showHelp, showShare])

  function updateDraft(value: string) {
    const nextDraft = normalizeWord(value).replace(/[^A-Z]/g, '').slice(0, 5)
    setDraft(nextDraft)
    if (completed) return

    try {
      if (nextDraft) localStorage.setItem(DRAFT_KEY, nextDraft)
      else localStorage.removeItem(DRAFT_KEY)
    } catch {
      setStorageWarning(true)
    }
  }

  function addLetter(letter: string) {
    if (completed) return
    if (draft.length < 5) updateDraft(draft + normalizeWord(letter))
  }

  function handleSubmit() {
    const result = submitGuess(game, puzzle, draft)
    if (!result.accepted) {
      const nextMessage =
        result.reason === 'invalid-length'
          ? 'A palavra precisa ter cinco letras.'
          : result.reason === 'unknown-word'
            ? 'Essa palavra ainda não está no nosso caderno. Tente outra!'
            : 'Este desafio já terminou.'
      setMessage(nextMessage)
      return
    }

    setGame(result.state)
    if (!persistGame(result.state)) setStorageWarning(true)
    setDraft('')
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      setStorageWarning(true)
    }
    if (result.state.status !== 'playing' && !stats.completedDates.includes(gameDate)) {
      const nextStats: DailyStats = {
        played: stats.played + 1,
        wins: stats.wins + (result.state.status === 'won' ? 1 : 0),
        solvedIn: [...stats.solvedIn],
        completedDates: [...stats.completedDates, gameDate],
        streak: getStreakAfterCompletion(stats.streak, stats.lastCompletedDate, gameDate),
        lastCompletedDate: gameDate,
      }
      if (result.state.status === 'won') {
        nextStats.solvedIn[result.state.guesses.length - 1] += 1
      }
      setStats(nextStats)
      if (!persistStats(nextStats)) setStorageWarning(true)
    }
    const rowResult = result.guess.marks
      .map((mark, index) => `${result.guess.word[index]} ${MARK_LABELS[mark]}`)
      .join('; ')
    const nextAttempts = MAX_ATTEMPTS - result.state.guesses.length
    if (result.state.status === 'won') {
      setMessage(`Isso! Você descobriu em ${result.state.guesses.length} ${result.state.guesses.length === 1 ? 'tentativa' : 'tentativas'}. ${rowResult}`)
    } else if (result.state.status === 'lost') {
      setMessage(`As tentativas acabaram. A palavra era ${puzzle.word}. ${rowResult}`)
    } else {
      setMessage(`Palpite registrado. Restam ${nextAttempts} ${nextAttempts === 1 ? 'tentativa' : 'tentativas'}. ${rowResult}`)
    }
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    handleSubmit()
  }

  function changeMode(mode: GameMode) {
    const nextGame = { ...game, mode }
    setGame(nextGame)
    if (!persistGame(nextGame)) setStorageWarning(true)
    setMessage(mode === 'learn' ? 'Modo aprender: depois de cada palpite, veja o significado da palavra que tentou.' : 'Modo clássico selecionado.')
  }

  function revealHint() {
    if (completed || game.hintUsed) return
    setShowHint(true)
    const nextGame = { ...game, hintUsed: true }
    setGame(nextGame)
    if (!persistGame(nextGame)) setStorageWarning(true)
    setMessage('Dica revelada. Boa investigação!')
  }

  async function handleShare() {
    const text = createShareText(game, puzzle, getGameUrl())
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Palavrinha do dia', text })
        setMessage('Resultado compartilhado!')
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          setMessage('Compartilhamento cancelado. Seu jogo continua salvo.')
          return
        }
        await copyShareText(text)
      }
      return
    }

    await copyShareText(text)
  }

  async function copyShareText(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setMessage('Resultado copiado, sem revelar a resposta!')
    } catch {
      setShowShare(true)
    }
  }

  function getGameUrl(): string {
    const url = new URL(window.location.href)
    url.search = ''
    url.hash = ''
    return url.toString()
  }

  const activeRow = game.guesses.length

  return (
    <div className={`app-shell design-${design}`}>
      {isPrototypeGallery && (
        <section className="prototype-picker" aria-labelledby="prototype-title">
          <div>
            <p className="eyebrow small">PROTÓTIPOS INTERATIVOS</p>
            <h2 id="prototype-title">Escolha uma direção visual</h2>
          </div>
          <div className="prototype-options" role="group" aria-label="Direções visuais">
            {DESIGN_OPTIONS.map((option, index) => (
              <button
                key={option.id}
                type="button"
                className={`prototype-option${design === option.id ? ' is-selected' : ''}`}
                aria-pressed={design === option.id}
                onClick={() => setDesign(option.id)}
              >
                <span className="prototype-number">0{index + 1}</span>
                <span className="prototype-label">{option.label}</span>
                <span className="prototype-description">{option.description}</span>
              </button>
            ))}
          </div>
        </section>
      )}
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Palavrinha, início">
          <span className="brand-mark" aria-hidden="true">p!</span>
          <span>palavrinha</span>
        </a>
        <div className="topbar-actions">
          <div className="streak" aria-label={`Sua sequência atual é de ${currentStreak} ${currentStreak === 1 ? 'dia' : 'dias'}`}>
            <span aria-hidden="true">✦</span>
            <span>{currentStreak} {currentStreak === 1 ? 'dia seguido' : 'dias seguidos'}</span>
          </div>
          <button className="icon-button" type="button" onClick={() => setShowHelp(true)} aria-label="Como jogar">?</button>
        </div>
      </header>

      <main id="inicio" className="main-layout">
        <section className="game-column" aria-labelledby="page-title">
          <div className="intro-row">
            <div>
              <p className="eyebrow">DESAFIO DE HOJE <span className="sparkle" aria-hidden="true">✳</span></p>
              <h1 id="page-title">Uma palavra<br className="desktop-break" /> para descobrir.</h1>
              <p className="date-line">{dateLabel()} <span aria-hidden="true">·</span> um novo tema todo dia</p>
            </div>
            <div className="mascot" aria-hidden="true">
              <span className="mascot-spark">✦</span>
              <span className="mascot-face">{puzzle.theme === 'Animais' ? '🐯' : puzzle.theme === 'Frutas' ? '🥭' : puzzle.theme === 'Natureza' ? '🍃' : puzzle.theme === 'Objetos' ? '📚' : puzzle.theme === 'Lugares' ? '🏖️' : puzzle.theme === 'Música' ? '🎹' : '☁️'}</span>
              <span className="mascot-caption">vamos nessa!</span>
            </div>
          </div>

          <div className="mode-and-theme">
            <div className="mode-switch" role="group" aria-label="Modo de jogo">
              <button type="button" aria-pressed={game.mode === 'classic'} className={game.mode === 'classic' ? 'mode-button is-active' : 'mode-button'} onClick={() => changeMode('classic')}>Clássico</button>
              <button type="button" aria-pressed={game.mode === 'learn'} className={game.mode === 'learn' ? 'mode-button is-active' : 'mode-button'} onClick={() => changeMode('learn')}>Aprender <span aria-hidden="true">✿</span></button>
            </div>
            <div className="theme-tag"><span className="theme-dot" aria-hidden="true" /> Tema: <strong>{puzzle.theme}</strong></div>
          </div>

          <div className="board-section">
            <div className="board-caption">
              <span className="attempt-count">{game.guesses.length}<span>/{MAX_ATTEMPTS}</span></span>
              <span>{completed ? (game.status === 'won' ? 'Palavra encontrada!' : 'Fim do desafio') : `${remaining} ${remaining === 1 ? 'tentativa restante' : 'tentativas restantes'}`}</span>
            </div>

            <ol className="game-board" aria-label="Tentativas do desafio">
              {Array.from({ length: MAX_ATTEMPTS }, (_, rowIndex) => {
                const guess = game.guesses[rowIndex]
                const isCurrentRow = !completed && rowIndex === activeRow
                const rowLetters = guess?.word ?? (isCurrentRow ? draft : '')
                const rowLabel = guess
                  ? `Tentativa ${rowIndex + 1}: ${guess.word.split('').map((letter, index) => `${letter}, ${MARK_LABELS[guess.marks[index]]}`).join('; ')}`
                  : `Tentativa ${rowIndex + 1}${isCurrentRow ? ', atual' : ''}${rowLetters ? `, ${rowLetters.split('').join(' ')}` : ', vazia'}`

                return (
                  <li className={`guess-row${isCurrentRow ? ' is-current' : ''}`} key={rowIndex} aria-label={rowLabel}>
                    {Array.from({ length: 5 }, (_, columnIndex) => {
                      const mark = guess?.marks[columnIndex]
                      const letter = rowLetters[columnIndex] ?? ''
                      return (
                        <span
                          className={`letter-tile${letter ? ' has-letter' : ''}${mark ? ` mark-${mark}` : ''}${isCurrentRow && columnIndex === rowLetters.length ? ' is-cursor' : ''}`}
                          key={columnIndex}
                          aria-hidden="true"
                        >
                          {letter}
                          {mark === 'correct' && <span className="tile-symbol">✓</span>}
                          {mark === 'present' && <span className="tile-symbol">↗</span>}
                          {mark === 'absent' && <span className="tile-symbol">·</span>}
                        </span>
                      )
                    })}
                  </li>
                )
              })}
            </ol>

            <p className="board-help">Digite no teclado ou toque nas letras abaixo.</p>

            <form className="guess-form" onSubmit={handleFormSubmit}>
              <label className="sr-only" htmlFor="guess-input">Palpite com cinco letras</label>
              <input
                id="guess-input"
                className="guess-input"
                value={draft}
                onChange={(event) => updateDraft(event.target.value)}
                maxLength={5}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                disabled={completed}
                placeholder="Sua palavra"
                aria-describedby="game-status"
              />
              <button className="submit-button" type="submit" disabled={completed}>Enviar <span aria-hidden="true">↗</span></button>
            </form>

            <div className="keyboard" aria-label="Teclado de letras">
              {KEY_ROWS.map((row, rowIndex) => (
                <div className={`keyboard-row keyboard-row-${rowIndex + 1}`} key={row}>
                  {row.split('').map((letter) => {
                    const mark = keyboardMarks.get(letter)
                    return (
                      <button
                        className={`key${mark ? ` key-${mark}` : ''}`}
                        type="button"
                        key={letter}
                        onClick={() => addLetter(letter)}
                        disabled={completed}
                        aria-label={mark ? `Letra ${letter}, ${MARK_LABELS[mark]}` : `Letra ${letter}`}
                      >
                        {letter}
                      </button>
                    )
                  })}
                  {rowIndex === 2 && (
                    <>
                      <button className="key key-action" type="button" onClick={() => updateDraft(draft.slice(0, -1))} disabled={completed} aria-label="Apagar última letra">⌫</button>
                      <button className="key key-enter" type="button" onClick={handleSubmit} disabled={completed}>OK</button>
                    </>
                  )}
                </div>
              ))}
            </div>

            <p id="game-status" className="game-status" role="status" aria-live="polite">{message}</p>
            {storageWarning && <p className="storage-note" role="status">O jogo continua, mas o navegador não conseguiu salvar seu progresso.</p>}
          </div>
        </section>

        <aside className="journal-column" aria-label="Caderno do desafio">
          <section className="journal-card theme-card">
            <div className="card-topline"><span>NO CADERNO DE HOJE</span><span aria-hidden="true">✳</span></div>
            <div className="theme-illustration" aria-hidden="true">{puzzle.theme === 'Animais' ? '🐾' : puzzle.theme === 'Frutas' ? '🍃' : puzzle.theme === 'Natureza' ? '🌱' : puzzle.theme === 'Objetos' ? '✎' : puzzle.theme === 'Lugares' ? '☀' : puzzle.theme === 'Música' ? '♫' : '☁'}</div>
            <h2>{puzzle.theme}</h2>
            <p className="theme-copy">Observe as letras, faça conexões e descubra a palavra escondida.</p>
            <div className="rule-dots" aria-hidden="true"><i /><i /><i /></div>
          </section>

          <section className="journal-card hint-card" aria-labelledby="hint-title">
            <div className="hint-icon" aria-hidden="true">✦</div>
            <div>
              <p className="eyebrow small">UMA PISTA, SE PRECISAR</p>
              <h2 id="hint-title">Detetive também pede ajuda.</h2>
              {showHint ? (
                <p className="hint-text">{puzzle.hint}</p>
              ) : (
                <p className="hint-copy">Uma dica gratuita espera por você. Ela não tira tentativas.</p>
              )}
              {!completed && !game.hintUsed && (
                <button className="text-action" type="button" onClick={revealHint}>Mostrar pista <span aria-hidden="true">↗</span></button>
              )}
              {game.hintUsed && !showHint && <p className="hint-text">{puzzle.hint}</p>}
            </div>
          </section>

          {game.mode === 'learn' && !completed && lastGuess && (
            <section className="journal-card lesson-card" aria-labelledby="lesson-title">
              <div className="card-topline"><span>PALAVRA DA SUA TENTATIVA</span><span aria-hidden="true">✎</span></div>
              <h2 id="lesson-title" className="lesson-word">{lastGuess.word.toLocaleLowerCase('pt-BR')}</h2>
              {lastLesson ? (
                <>
                  <p>{lastLesson.definition}</p>
                  <blockquote>“{lastLesson.example}”</blockquote>
                </>
              ) : (
                <p>Uma boa palavra para conhecer. A definição ainda não está no caderno.</p>
              )}
            </section>
          )}

          {completed ? (
            <section className="journal-card meaning-card" aria-labelledby="meaning-title">
              <div className="card-topline"><span>PALAVRA DESCOBERTA</span><span aria-hidden="true">✿</span></div>
              <h2 id="meaning-title" className="answer-word">{puzzle.word.toLocaleLowerCase('pt-BR')}</h2>
              <p>{puzzle.definition}</p>
              <blockquote>“{puzzle.example}”</blockquote>
              <button className="share-button" type="button" onClick={() => void handleShare()}><span aria-hidden="true">↗</span> Compartilhar resultado</button>
            </section>
          ) : (
            <section className="journal-note">
              <span className="note-star" aria-hidden="true">✳</span>
              <p>Uma palavra por dia. Sem pressa: cada tentativa é uma nova pista.</p>
            </section>
          )}

          <section className="mini-stats" aria-label="Seu caderno de desafios">
            <div><strong>{stats.played}</strong><span>desafios concluídos</span></div>
            <div><strong>{stats.wins}</strong><span>palavras descobertas</span></div>
          </section>
        </aside>
      </main>

      <footer className="page-footer"><span>feito para mentes curiosas</span><span aria-hidden="true">✦</span><span>volte amanhã para outra palavra</span></footer>

      {(showHelp || showShare) && (
        <div className="dialog-backdrop" onClick={() => { setShowHelp(false); setShowShare(false) }}>
          <section
            className="dialog-panel"
              ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
              <button ref={dialogCloseRef} className="dialog-close" type="button" onClick={() => { setShowHelp(false); setShowShare(false) }} aria-label="Fechar">×</button>
            {showHelp ? (
              <>
                <p className="eyebrow small">AS REGRAS DO JOGO</p>
                <h2 id="dialog-title">Como brincar</h2>
                <ul className="help-list">
                  <li>Descubra a palavra de cinco letras em até seis tentativas.</li>
                  <li><span className="legend-dot correct" /> A letra está no lugar certo.</li>
                  <li><span className="legend-dot present" /> A letra existe, mas em outro lugar.</li>
                  <li><span className="legend-dot absent" /> A letra não aparece na palavra.</li>
                  <li>O tema do dia e uma pista gratuita ajudam sua investigação.</li>
                </ul>
                <button className="submit-button dialog-action" type="button" onClick={() => setShowHelp(false)}>Entendi!</button>
              </>
            ) : (
              <>
                <p className="eyebrow small">SEM SPOILERS</p>
                <h2 id="dialog-title">Seu resultado</h2>
                <p className="share-copy">Copie esta grade para compartilhar. A palavra e os palpites ficam em segredo.</p>
                <textarea className="share-preview" readOnly value={createShareText(game, puzzle, getGameUrl())} aria-label="Prévia do resultado para compartilhar" />
                <div className="dialog-actions">
                  <button className="submit-button" type="button" onClick={() => void copyShareText(createShareText(game, puzzle, getGameUrl()))}>Copiar resultado</button>
                  <button className="plain-button" type="button" onClick={() => setShowShare(false)}>Fechar</button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  )
}

export default App