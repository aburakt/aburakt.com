// D1 Database Schema Types

export interface User {
  id: string // sha256(github_id)
  created_at: number
}

export interface TypingStat {
  id: string
  user_hash: string
  mode: 'test' | 'lesson' | 'speed' | 'game'
  wpm: number
  accuracy: number
  duration_s: number
  layout: 'en' | 'tr'
  created_at: number
}

export interface VimStat {
  id: string
  user_hash: string
  game: string
  score: number
  keystrokes: number
  created_at: number
}

export interface LessonProgress {
  user_hash: string
  lesson_id: string
  completed: 0 | 1
  best_wpm: number
  best_acc: number
}

// API Response Types

export interface ApiResponse<T> {
  ok: boolean
  data?: T
  error?: string
}

export interface HealthResponse {
  ok: boolean
  timestamp: number
}
