import { useState, useEffect, useCallback } from 'react'

const API_BASE = import.meta.env.PUBLIC_API_URL ?? 'https://aburakt-api.aburakt.workers.dev'

interface AuthState {
  authenticated: boolean
  userHash: string | null
  token: string | null
  loading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    authenticated: false,
    userHash: null,
    token: null,
    loading: true,
  })

  useEffect(() => {
    // Check for token in URL (OAuth callback) or localStorage
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    if (urlToken) {
      localStorage.setItem('auth_token', urlToken)
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname)
    }

    const token = urlToken ?? localStorage.getItem('auth_token')
    if (!token) {
      setState({ authenticated: false, userHash: null, token: null, loading: false })
      return
    }

    // Verify token
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data: { ok: boolean; data?: { authenticated: boolean; userHash?: string } }) => {
        if (data.ok && data.data?.authenticated) {
          setState({
            authenticated: true,
            userHash: data.data.userHash ?? null,
            token,
            loading: false,
          })
        } else {
          localStorage.removeItem('auth_token')
          setState({ authenticated: false, userHash: null, token: null, loading: false })
        }
      })
      .catch(() => {
        setState({ authenticated: false, userHash: null, token: null, loading: false })
      })
  }, [])

  const login = useCallback(() => {
    fetch(`${API_BASE}/auth/github`)
      .then((r) => r.json())
      .then((data: { ok: boolean; data?: { url: string } }) => {
        if (data.ok && data.data?.url) {
          window.location.href = data.data.url
        }
      })
  }, [])

  const logout = useCallback(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
    }
    localStorage.removeItem('auth_token')
    setState({ authenticated: false, userHash: null, token: null, loading: false })
  }, [])

  return { ...state, login, logout }
}

// Helper to save stats
export async function saveTypingStat(data: {
  mode: string
  wpm: number
  accuracy: number
  duration_s: number
  layout: string
}) {
  const token = localStorage.getItem('auth_token')
  if (!token) return

  await fetch(`${API_BASE}/stats/typing`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
}

export async function saveVimStat(data: {
  game: string
  score: number
  keystrokes: number
}) {
  const token = localStorage.getItem('auth_token')
  if (!token) return

  await fetch(`${API_BASE}/stats/vim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
}
