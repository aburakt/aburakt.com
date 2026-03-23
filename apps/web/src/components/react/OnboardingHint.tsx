import { useState, useEffect } from 'react'

interface Props {
  locale: string
}

export default function OnboardingHint({ locale }: Props) {
  const tr = locale === 'tr'
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    const seen = localStorage.getItem('hint_seen')
    if (seen) return

    setDismissed(false)

    const timer = setTimeout(() => {
      setVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    setVisible(false)
    localStorage.setItem('hint_seen', '1')
    setTimeout(() => setDismissed(true), 200)
  }

  if (dismissed) return null

  return (
    <div
      className="fixed bottom-4 left-4 z-50 max-w-[calc(100vw-8rem)] rounded border border-green-900/30 bg-black/90 px-3 py-2 font-mono backdrop-blur transition-opacity duration-200"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs text-green-600">
          {tr
            ? '\u0130pucu: ? ile k\u0131sayollar\u0131, Space ile h\u0131zl\u0131 komutlar\u0131 g\u00f6rebilirsiniz'
            : 'Tip: Press ? for shortcuts or Space for quick commands'}
        </span>
        <button
          onClick={dismiss}
          className="ml-1 text-green-700 transition-colors hover:text-green-400"
          aria-label="Dismiss"
        >
          \u00d7
        </button>
      </div>
    </div>
  )
}
