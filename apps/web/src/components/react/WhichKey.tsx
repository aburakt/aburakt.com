import { useState, useEffect } from 'react'

interface LeaderCommand {
  key: string
  label: string
  color: string
}

const commands: LeaderCommand[] = [
  { key: 'v', label: 'vim', color: 'text-cyan-400' },
  { key: 't', label: 'typing', color: 'text-amber-400' },
  { key: 's', label: 'search', color: 'text-green-400' },
  { key: 'g', label: 'github', color: 'text-green-400' },
  { key: 'l', label: 'lang', color: 'text-green-400' },
  { key: '?', label: 'help', color: 'text-green-400' },
]

interface Props {
  locale: string
}

export default function WhichKey({ locale }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleShow() {
      setVisible(true)
    }

    function handleDismiss() {
      setVisible(false)
    }

    window.addEventListener('vim:leader', handleShow)
    window.addEventListener('vim:leader-dismiss', handleDismiss)

    return () => {
      window.removeEventListener('vim:leader', handleShow)
      window.removeEventListener('vim:leader-dismiss', handleDismiss)
    }
  }, [])

  return (
    <div
      className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 font-mono transition-opacity duration-200"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div className="rounded border border-green-900/40 bg-black/95 px-4 py-3 backdrop-blur">
        <div className="mb-2 text-center text-xs text-green-700">SPACE LEADER</div>
        <div className="grid grid-cols-3 gap-x-6 gap-y-2">
          {commands.map((cmd) => (
            <div key={cmd.key} className="flex items-center gap-2 text-sm">
              <span className="text-green-600">{cmd.key}</span>
              <span className={cmd.color}>{cmd.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
