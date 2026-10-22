import { describe, expect, it } from 'vitest'
import {
  createGameState,
  createShareText,
  getKeyboardMarks,
  getCurrentStreak,
  getPuzzleForDate,
  getStreakAfterCompletion,
  gradeGuess,
  normalizeWord,
  PUZZLES,
  submitGuess,
  VALID_GUESSES,
  type GameState,
  type Guess,
} from './game.ts'

describe('game rules', () => {
  it('normalizes Portuguese accents without changing letter count', () => {
    expect(normalizeWord('maçã')).toBe('MACA')
    expect([...normalizeWord('ação')].length).toBe(4)
  })

  it('returns the same themed puzzle for the same date and advances by day', () => {
    expect(getPuzzleForDate('2026-10-21').id).toBe('animal-tigre')
    expect(getPuzzleForDate('2026-10-21').id).toBe(getPuzzleForDate('2026-10-21').id)
    expect(getPuzzleForDate('2026-10-21').id).not.toBe(getPuzzleForDate('2026-10-22').id)

    const firstCycle = Array.from({ length: 34 }, (_, offset) => {
      const date = new Date(Date.UTC(2026, 9, 21 + offset)).toISOString().slice(0, 10)
      return getPuzzleForDate(date).id
    })
    expect(new Set(firstCycle).size).toBe(firstCycle.length)
  })

  it('keeps every scheduled answer at five normalized letters with unique ids', () => {
    expect(new Set(PUZZLES.map((puzzle) => puzzle.id)).size).toBe(PUZZLES.length)
    for (const puzzle of PUZZLES) {
      expect([...normalizeWord(puzzle.word)].length, puzzle.id).toBe(5)
      expect(VALID_GUESSES.has(normalizeWord(puzzle.word)), puzzle.id).toBe(true)
    }
  })

  it('counts consecutive daily plays and resets a missed-day streak', () => {
    expect(getCurrentStreak(3, '2026-10-20', '2026-10-21')).toBe(3)
    expect(getCurrentStreak(3, '2026-10-19', '2026-10-21')).toBe(0)
    expect(getStreakAfterCompletion(3, '2026-10-20', '2026-10-21')).toBe(4)
    expect(getStreakAfterCompletion(3, '2026-10-19', '2026-10-21')).toBe(1)
  })

  it('counts repeated letters only as many times as the answer contains them', () => {
    expect(gradeGuess('MANGA', 'MAMAM')).toEqual([
      'correct',
      'correct',
      'absent',
      'present',
      'absent',
    ])
  })

  it('does not consume an attempt for an unknown word', () => {
    const puzzle = getPuzzleForDate('2026-10-21')
    const state = createGameState(puzzle, '2026-10-21')
    const result = submitGuess(state, puzzle, 'ZZZZZ')

    expect(result.accepted).toBe(false)
    if (!result.accepted) expect(result.reason).toBe('unknown-word')
    expect(state.guesses.length).toBe(0)
  })

  it('finishes on the correct answer and rejects submissions after the game ends', () => {
    const puzzle = getPuzzleForDate('2026-10-21')
    const state = createGameState(puzzle, '2026-10-21')
    const result = submitGuess(state, puzzle, 'TIGRE')

    expect(result.accepted).toBe(true)
    if (!result.accepted) return
    expect(result.state.status).toBe('won')
    expect(submitGuess(result.state, puzzle, 'FOLHA').accepted).toBe(false)
  })

  it('keeps the strongest clue for each keyboard key and never shares guessed words', () => {
    const state: GameState = {
      ...createGameState(getPuzzleForDate('2026-10-21'), '2026-10-21'),
      guesses: [
        { word: 'MANGA', marks: ['correct', 'present', 'absent', 'absent', 'correct'] },
        { word: 'MAMAM', marks: ['correct', 'correct', 'absent', 'present', 'absent'] },
      ],
    }
    const keyboard = getKeyboardMarks(state.guesses)
    const guess: Guess = state.guesses[0]

    expect(keyboard.get('M')).toBe('correct')
    expect(keyboard.get('A')).toBe('correct')
    const shareText = createShareText(state, getPuzzleForDate(state.gameDate), 'https://palavrinha.example')
    expect(shareText).not.toContain(guess.word)
    expect(shareText).toContain('2026-10-21')
    expect(shareText).toContain('https://palavrinha.example')
  })
})