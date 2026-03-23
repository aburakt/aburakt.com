import { useState, useEffect, useCallback } from 'react'

interface Props {
  locale: string
}

const shortcuts = [
  { key: 'j', descTr: 'Aşağı kaydır', descEn: 'Scroll down' },
  { key: 'k', descTr: 'Yukarı kaydır', descEn: 'Scroll up' },
  { key: 'gg', descTr: 'Sayfa başı', descEn: 'Go to top' },
  { key: 'G', descTr: 'Sayfa sonu', descEn: 'Go to bottom' },
  { key: 'H', descTr: 'İlk görünür bölüm', descEn: 'First visible section' },
  { key: 'M', descTr: 'Orta bölüm', descEn: 'Middle section' },
  { key: 'L', descTr: 'Son bölüm', descEn: 'Last section' },
  { key: '/', descTr: 'Ara', descEn: 'Search' },
  { key: 'gi', descTr: "GitHub'a git", descEn: 'Go to GitHub' },
  { key: 'gc', descTr: "CV'ye git", descEn: 'Go to CV' },
  { key: 'gp', descTr: "Playground'a git", descEn: 'Go to Playground' },
  { key: 'gl', descTr: 'Dil değiştir', descEn: 'Switch language' },
  { key: '?', descTr: 'Bu yardımı göster', descEn: 'Show this help' },
  { key: 'Esc', descTr: 'Kapat', descEn: 'Close' },
]

export default function KeyboardCheatsheet({ locale }: Props) {
  const [open, setOpen] = useState(false)

  const toggle = useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  useEffect(() => {
    function handler() {
      toggle()
    }
    document.addEventListener('vim:cheatsheet', handler)
    return () => document.removeEventListener('vim:cheatsheet', handler)
  }, [toggle])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null

  const title = locale === 'tr' ? 'Klavye Kısayolları' : 'Keyboard Shortcuts'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="mx-4 w-full max-w-md rounded-xl border border-green-900/30 bg-black p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-green-400">{title}</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-green-600 transition hover:text-green-400"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-2">
          {shortcuts.map((s) => (
            <div key={s.key} className="flex items-center justify-between">
              <kbd className="rounded bg-green-950/20 px-2 py-0.5 font-mono text-sm text-green-400">
                {s.key}
              </kbd>
              <span className="text-sm text-green-600">
                {locale === 'tr' ? s.descTr : s.descEn}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
