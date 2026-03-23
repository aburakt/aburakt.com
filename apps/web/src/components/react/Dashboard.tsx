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

interface VimStat {
  game: string
  score: number
  keystrokes: number
  created_at: number
}

interface LessonProgress {
  lesson_id: string
  completed: number
  best_wpm: number
  best_acc: number
}

interface Props {
  locale: string
}

export default function Dashboard({ locale }: Props) {
  const tr = locale === 'tr'
  const { authenticated, loading, login, logout, token } = useAuth()
  const [typingSummary, setTypingSummary] = useState<TypingSummary | null>(null)
  const [vimStats, setVimStats] = useState<VimStat[]>([])
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([])
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (!authenticated || !token) return

    const headers = { Authorization: `Bearer ${token}` }

    Promise.all([
      fetch(`${API_BASE}/stats/typing/summary`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE}/stats/vim`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE}/progress`, { headers }).then((r) => r.json()),
    ]).then(([typing, vim, progress]) => {
      if (typing.ok) setTypingSummary(typing.data)
      if (vim.ok) setVimStats(vim.data)
      if (progress.ok) setLessonProgress(progress.data)
    }).catch(() => {
      // API not available, show empty state
    })
  }, [authenticated, token])

  async function exportData() {
    if (!token) return
    setExporting(true)
    try {
      const res = await fetch(`${API_BASE}/stats/export`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `aburakt-stats-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-zinc-700/50 bg-zinc-800/50 p-8 text-center">
        <h2 className="text-2xl font-bold text-zinc-100">
          {tr ? 'Giriş Yapın' : 'Sign In'}
        </h2>
        <p className="mt-3 text-sm text-zinc-400">
          {tr
            ? 'İstatistiklerinizi kaydetmek ve ilerlemenizi takip etmek için GitHub ile giriş yapın.'
            : 'Sign in with GitHub to save your stats and track your progress.'}
        </p>
        <button
          onClick={login}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-700 px-6 py-3 text-sm font-medium text-zinc-100 transition hover:bg-zinc-600"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          {tr ? 'GitHub ile Giriş Yap' : 'Sign in with GitHub'}
        </button>
        <p className="mt-4 text-xs text-zinc-600">
          {tr
            ? 'Sadece GitHub ID\'nizin hash\'i saklanır. Kişisel bilgileriniz kaydedilmez.'
            : 'Only a hash of your GitHub ID is stored. No personal information is saved.'}
        </p>
      </div>
    )
  }

  const completedLessons = lessonProgress.filter((l) => l.completed).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-100">
          {tr ? 'İstatistikler' : 'Statistics'}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={exportData}
            disabled={exporting}
            className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-500"
          >
            {exporting ? '...' : tr ? 'Dışa Aktar' : 'Export JSON'}
          </button>
          <button
            onClick={logout}
            className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-500"
          >
            {tr ? 'Çıkış' : 'Sign Out'}
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label={tr ? 'Toplam Test' : 'Total Tests'}
          value={String(typingSummary?.totalTests ?? 0)}
          color="text-primary-400"
        />
        <StatCard
          label={tr ? 'En İyi WPM' : 'Best WPM'}
          value={String(typingSummary?.bestWpm ?? 0)}
          color="text-green-400"
        />
        <StatCard
          label={tr ? 'Ort. WPM' : 'Avg WPM'}
          value={String(typingSummary?.avgWpm ?? 0)}
          color="text-blue-400"
        />
        <StatCard
          label={tr ? 'Ort. Doğruluk' : 'Avg Accuracy'}
          value={`${typingSummary?.avgAccuracy ?? 0}%`}
          color="text-yellow-400"
        />
      </div>

      {/* WPM Trend */}
      {typingSummary && typingSummary.recent.length > 2 && (
        <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-6">
          <h3 className="mb-4 text-sm font-medium text-zinc-400">
            {tr ? 'WPM Trendi' : 'WPM Trend'}
          </h3>
          <div className="flex h-32 items-end gap-1">
            {typingSummary.recent.slice().reverse().map((s, i) => {
              const maxWpm = Math.max(...typingSummary.recent.map((r) => r.wpm), 1)
              return (
                <div key={i} className="group relative flex-1">
                  <div
                    className="w-full rounded-t bg-primary-500/60 transition-colors hover:bg-primary-500"
                    style={{ height: `${Math.max((s.wpm / maxWpm) * 100, 4)}%` }}
                  />
                  <div className="absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 rounded bg-zinc-700 px-2 py-1 text-xs text-zinc-200 group-hover:block">
                    {s.wpm} WPM
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Lesson Progress */}
      {lessonProgress.length > 0 && (
        <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-6">
          <h3 className="mb-4 text-sm font-medium text-zinc-400">
            {tr ? 'Ders İlerlemesi' : 'Lesson Progress'}
          </h3>
          <div className="mb-2 text-xs text-zinc-500">
            {completedLessons}/{lessonProgress.length} {tr ? 'tamamlandı' : 'completed'}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-700">
            <div
              className="h-full bg-green-500"
              style={{ width: `${(completedLessons / Math.max(lessonProgress.length, 1)) * 100}%` }}
            />
          </div>
          <div className="mt-4 space-y-2">
            {lessonProgress.map((l) => (
              <div key={l.lesson_id} className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-2">
                  {l.completed ? <span className="text-green-400">✓</span> : <span className="text-zinc-600">○</span>}
                  {l.lesson_id}
                </span>
                <span className="font-mono">
                  {l.best_wpm} WPM · {l.best_acc}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vim Stats */}
      {vimStats.length > 0 && (
        <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-6">
          <h3 className="mb-4 text-sm font-medium text-zinc-400">
            {tr ? 'Vim Oyun Skorları' : 'Vim Game Scores'}
          </h3>
          <div className="space-y-2">
            {vimStats.slice(0, 10).map((s, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-medium text-zinc-300">{s.game}</span>
                <span className="font-mono">
                  {tr ? 'Skor' : 'Score'}: {s.score} · {s.keystrokes} {tr ? 'tuş' : 'keys'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {(!typingSummary || typingSummary.totalTests === 0) && vimStats.length === 0 && (
        <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/30 p-12 text-center">
          <p className="text-sm text-zinc-500">
            {tr
              ? 'Henüz veri yok. Yazma testleri ve vim oyunları oynayarak istatistiklerinizi burada görün.'
              : 'No data yet. Play typing tests and vim games to see your stats here.'}
          </p>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{label}</p>
    </div>
  )
}
