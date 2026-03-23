import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

const API_BASE = import.meta.env.PUBLIC_API_URL ?? 'https://aburakt-api.aburakt.workers.dev'

interface TypingSummary {
  totalTests: number
  bestWpm: number
  avgWpm: number
  avgAccuracy: number
  recent: Array<{
    wpm: number
    accuracy: number
    mode: string
    layout: string
    created_at: number
  }>
}

interface Props {
  locale: string
}

export default function StatsOverview({ locale }: Props) {
  const tr = locale === 'tr'
  const { authenticated, loading, login, token } = useAuth()
  const [summary, setSummary] = useState<TypingSummary | null>(null)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (!authenticated || !token) return
    setFetching(true)

    fetch(`${API_BASE}/stats/typing/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setSummary(data.data)
      })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [authenticated, token])

  if (loading) {
    return (
      <div className="font-mono text-xs text-green-700">
        {tr ? 'Yükleniyor...' : 'Loading...'}
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="flex items-center gap-3 rounded border border-green-900/30 bg-black/80 px-3 py-2 font-mono">
        <svg
          className="h-4 w-4 text-green-600"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        <span className="text-xs text-green-600">
          {tr ? 'İlerlemenizi takip etmek için giriş yapın' : 'Sign in to track progress'}
        </span>
        <button
          onClick={login}
          className="ml-auto rounded border border-green-800 bg-green-900/30 px-2 py-1 text-xs text-green-400 transition-colors hover:bg-green-900/50"
        >
          {tr ? 'Giriş' : 'Sign in'}
        </button>
      </div>
    )
  }

  if (fetching) {
    return (
      <div className="font-mono text-xs text-green-700">
        {tr ? 'Veriler yükleniyor...' : 'Fetching stats...'}
      </div>
    )
  }

  if (!summary || summary.totalTests === 0) {
    return (
      <div className="rounded border border-green-900/30 bg-black/80 px-3 py-2 font-mono text-xs text-green-700">
        {tr ? 'Henüz veri yok. Pratik yapmaya başlayın!' : 'No data yet. Start practicing!'}
      </div>
    )
  }

  const stats = [
    { label: tr ? 'Testler' : 'Tests', value: summary.totalTests },
    { label: tr ? 'En İyi WPM' : 'Best WPM', value: summary.bestWpm },
    { label: tr ? 'Ort. WPM' : 'Avg WPM', value: Math.round(summary.avgWpm) },
    { label: tr ? 'Doğruluk' : 'Accuracy', value: `${Math.round(summary.avgAccuracy)}%` },
  ]

  const recentWpms = summary.recent.slice(0, 8).map((r) => r.wpm)
  const maxWpm = Math.max(...recentWpms, 1)

  return (
    <div className="space-y-3 font-mono">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded border border-green-900/30 bg-black/80 p-3"
          >
            <div className="text-xs text-green-700">{stat.label}</div>
            <div className="text-lg text-green-400">{stat.value}</div>
          </div>
        ))}
      </div>

      {recentWpms.length > 0 && (
        <div className="rounded border border-green-900/30 bg-black/80 p-3">
          <div className="mb-1 text-xs text-green-700">
            {tr ? 'Son WPM Trendi' : 'Recent WPM Trend'}
          </div>
          <div className="flex h-12 items-end gap-1">
            {recentWpms.map((wpm, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-green-600/60"
                style={{ height: `${(wpm / maxWpm) * 100}%` }}
                title={`${wpm} WPM`}
              />
            ))}
          </div>
        </div>
      )}

      <a
        href={`/${locale}/lab/stats`}
        className="inline-block text-xs text-green-700 transition-colors hover:text-green-400"
      >
        {tr ? 'detaylı istatistikler \u2192' : 'view detailed stats \u2192'}
      </a>
    </div>
  )
}
