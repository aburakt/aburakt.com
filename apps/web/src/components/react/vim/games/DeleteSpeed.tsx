import { useState, useRef, useEffect, useCallback } from 'react'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { vim } from '@replit/codemirror-vim'
import { saveVimStat } from '../../useAuth'
import { useVimSuspend } from '../../useVimSuspend'

interface Props {
  locale: string
}

const sampleLines = [
  'The quick brown fox jumps over the lazy dog.',
  'Lorem ipsum dolor sit amet consectetur.',
  'She sells seashells by the seashore.',
  'How much wood would a woodchuck chuck?',
  'To be or not to be that is the question.',
  'All that glitters is not gold.',
  'A journey of a thousand miles begins with a single step.',
  'The pen is mightier than the sword.',
  'Actions speak louder than words.',
  'Knowledge is power but enthusiasm pulls the switch.',
  'The best way to predict the future is to create it.',
  'In the middle of difficulty lies opportunity.',
  'Stay hungry stay foolish.',
  'Code is like humor when you have to explain it its bad.',
  'First solve the problem then write the code.',
]

const editorTheme = EditorView.theme({
  '&': { backgroundColor: '#18181b', color: '#e4e4e7', fontSize: '16px', height: '60px' },
  '.cm-content': { fontFamily: '"JetBrains Mono", monospace', caretColor: '#14b8a6', padding: '16px' },
  '.cm-cursor': { borderLeftColor: '#14b8a6' },
  '.cm-gutters': { display: 'none' },
  '.cm-activeLine': { backgroundColor: 'transparent' },
})

export default function DeleteSpeed({ locale }: Props) {
  const [state, setState] = useState<'idle' | 'playing' | 'done'>('idle')
  useVimSuspend(state === 'playing')
  const [currentLine, setCurrentLine] = useState('')
  const [round, setRound] = useState(0)
  const [scores, setScores] = useState<Array<{ time: number; keystrokes: number }>>([])
  const [startTime, setStartTime] = useState(0)
  const [keystrokes, setKeystrokes] = useState(0)
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const totalRounds = 5
  const tr = locale === 'tr'

  const getRandomLine = useCallback(() => {
    return sampleLines[Math.floor(Math.random() * sampleLines.length)]
  }, [])

  const startRound = useCallback(() => {
    const line = getRandomLine()
    setCurrentLine(line)
    setKeystrokes(0)
    setStartTime(Date.now())

    if (viewRef.current) viewRef.current.destroy()
    if (!editorRef.current) return

    const s = EditorState.create({
      doc: line,
      extensions: [
        vim(),
        editorTheme,
        EditorView.updateListener.of((update) => {
          if (update.transactions.some((t) => t.isUserEvent('input') || t.isUserEvent('delete'))) {
            setKeystrokes((k) => k + 1)
          }
          if (update.state.doc.toString().trim() === '') {
            // Line deleted
            const elapsed = Date.now() - Date.now() // will be set properly
            setScores((prev) => [...prev, { time: Date.now() - startTime || 1, keystrokes: keystrokes + 1 }])
          }
        }),
      ],
    })

    viewRef.current = new EditorView({ state: s, parent: editorRef.current })
    viewRef.current.focus()
  }, [getRandomLine, startTime, keystrokes])

  // Track when content is fully deleted
  useEffect(() => {
    if (state !== 'playing') return
    const interval = setInterval(() => {
      if (!viewRef.current) return
      const content = viewRef.current.state.doc.toString().trim()
      if (content === '') {
        const elapsed = Date.now() - startTime
        const ks = keystrokes
        setScores((prev) => {
          const newScores = [...prev, { time: elapsed, keystrokes: Math.max(ks, 1) }]
          if (newScores.length >= totalRounds) {
            setState('done')
          }
          return newScores
        })
        setRound((r) => {
          const next = r + 1
          if (next < totalRounds) {
            setTimeout(() => startRound(), 300)
          }
          return next
        })
      }
    }, 100)
    return () => clearInterval(interval)
  }, [state, startTime, keystrokes, startRound])

  function startGame() {
    setState('playing')
    setScores([])
    setRound(0)
    setTimeout(() => startRound(), 100)
  }

  function resetGame() {
    setState('idle')
    setScores([])
    setRound(0)
    if (viewRef.current) viewRef.current.destroy()
  }

  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, s) => a + s.time / s.keystrokes, 0) / scores.length)
      : 0

  // Save stat when game ends
  useEffect(() => {
    if (state === 'done' && scores.length > 0) {
      const totalKs = scores.reduce((a, s) => a + s.keystrokes, 0)
      saveVimStat({ game: 'delete-speed', score: avgScore, keystrokes: totalKs })
    }
  }, [state, scores, avgScore])

  return (
    <div className="rounded-xl border border-green-900/30 bg-green-950/20 p-6">
      <h3 className="text-lg font-semibold text-green-400">
        🗑️ Delete Speed
      </h3>
      <p className="mt-1 text-sm text-green-600">
        {tr
          ? 'Satırı mümkün olduğunca hızlı ve az tuşla silin. Skor = süre / tuş sayısı (düşük = iyi)'
          : 'Delete the line as fast as possible with fewest keystrokes. Score = time / keystrokes (lower = better)'}
      </p>

      {state === 'idle' && (
        <button
          onClick={startGame}
          className="mt-4 rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-black transition hover:bg-green-500"
        >
          {tr ? 'Başla' : 'Start'} ({totalRounds} {tr ? 'tur' : 'rounds'})
        </button>
      )}

      {state === 'playing' && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-green-700">
            <span>{tr ? 'Tur' : 'Round'} {Math.min(round + 1, totalRounds)}/{totalRounds}</span>
            <span>{tr ? 'Tuş sayısı' : 'Keystrokes'}: {keystrokes}</span>
          </div>
          <p className="text-xs text-green-700">
            {tr ? 'Satırı tamamen silin (dd veya diğer yöntemler)' : 'Delete the entire line (dd or other methods)'}
          </p>
          <div ref={editorRef} className="overflow-hidden rounded-lg border border-green-900/30" />
        </div>
      )}

      {state === 'done' && (
        <div className="mt-4 space-y-4">
          <div className="rounded-lg bg-green-500/10 p-4 text-center">
            <p className="text-lg font-semibold text-green-400">
              {tr ? 'Ortalama Skor' : 'Average Score'}: {avgScore}ms/{tr ? 'tuş' : 'keystroke'}
            </p>
          </div>
          <div className="space-y-1">
            {scores.map((s, i) => (
              <div key={i} className="flex justify-between text-xs text-green-600">
                <span>{tr ? 'Tur' : 'Round'} {i + 1}</span>
                <span>{s.time}ms · {s.keystrokes} {tr ? 'tuş' : 'keys'} · {Math.round(s.time / s.keystrokes)}ms/{tr ? 'tuş' : 'key'}</span>
              </div>
            ))}
          </div>
          <button
            onClick={resetGame}
            className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-black transition hover:bg-green-500"
          >
            {tr ? 'Tekrar Oyna' : 'Play Again'}
          </button>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-green-800 sm:hidden">
        {tr ? 'Bu oyun masaüstünde daha iyi çalışır.' : 'This game works best on desktop.'}
      </p>
    </div>
  )
}
