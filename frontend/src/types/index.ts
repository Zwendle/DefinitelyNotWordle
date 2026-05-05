export type LetterResult = 'correct' | 'present' | 'absent'

export type GameStatus = 'IN_PROGRESS' | 'WON' | 'LOST'

export interface GameSession {
  sessionId: string
  status: GameStatus
  guesses: Guess[]
  word?: string
}

export interface Guess {
  id: string
  gameSessionId: string
  guessNumber: number
  word: string
  result: LetterResult[]
}

export interface GameStats {
  totalGames: number
  winPercentage: number
  currentStreak: number
  maxStreak: number
  distribution: Record<number, number>
}