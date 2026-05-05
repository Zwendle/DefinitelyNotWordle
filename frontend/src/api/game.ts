import axios from 'axios'
import type { GameSession, GameStats, Guess } from '../types/index'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  withCredentials: true,
})

export async function getTodayGame(): Promise<GameSession> {
  const res = await api.get('/game/today')
  return res.data
}

export async function postGuess(guess: string): Promise<{
  result: Guess['result']
  guessNumber: number
  status: string
}> {
  const res = await api.post('/game/guess', { guess })
  return res.data
}

export async function getStats(): Promise<GameStats> {
  const res = await api.get('/game/stats')
  return res.data
}