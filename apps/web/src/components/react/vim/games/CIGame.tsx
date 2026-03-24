import { useState, useRef, useEffect, useCallback } from 'react'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { vim } from '@replit/codemirror-vim'
import { saveVimStat } from '../../useAuth'
import { useVimSuspend } from '../../useVimSuspend'

interface Props {
  locale: string
}

interface Challenge {
  content: string
  target: string
  replacement: string
  instruction: string
  instructionTr: string
}

const challenges: Challenge[] = [
  { content: 'const name = "hello"', target: '"hello"', replacement: '"world"', instruction: 'Change "hello" to "world" using ci"', instructionTr: 'ci" ile "hello"yu "world" olarak değiştirin' },
  { content: "const arr = ['a', 'b', 'c']", target: "'a', 'b', 'c'", replacement: "'x', 'y', 'z'", instruction: "Change array contents using ci[", instructionTr: 'ci[ ile dizi içeriğini değiştirin' },
  { content: 'function foo(bar, baz) {}', target: 'bar, baz', replacement: 'x, y', instruction: 'Change params using ci(', instructionTr: 'ci( ile parametreleri değiştirin' },
  { content: '<div>old content</div>', target: 'old content', replacement: 'new content', instruction: 'Change tag content using cit', instructionTr: 'cit ile tag içeriğini değiştirin' },
  { content: 'const obj = { key: "value" }', target: ' key: "value" ', replacement: ' name: "test" ', instruction: 'Change object contents using ci{', instructionTr: 'ci{ ile obje içeriğini değiştirin' },
  { content: "console.log('debug message')", target: "'debug message'", replacement: "'info'", instruction: "Change string using ci'", instructionTr: "ci' ile string'i değiştirin" },
  { content: 'const x = (a + b) * c', target: 'a + b', replacement: 'x + y', instruction: 'Change expression inside parens using ci)', instructionTr: 'ci) ile parantez içi ifadeyi değiştirin' },
  { content: 'if (condition) { doSomething() }', target: ' doSomething() ', replacement: ' handleClick() ', instruction: 'Change brace content using ci}', instructionTr: 'ci} ile süslü parantez içeriğini değiştirin' },
]

const editorTheme = EditorView.theme({
  '&': { backgroundColor: '#18181b', color: '#e4e4e7', fontSize: '16px', height: '60px' },
  '.cm-content': { fontFamily: '"JetBrains Mono", monospace', caretColor: '#14b8a6', padding: '16px' },
  '.cm-cursor': { borderLeftColor: '#14b8a6' },
  '.cm-gutters': { display: 'none' },
  '.cm-activeLine': { backgroundColor: 'transparent' },
})

export default function CIGame({ locale }: Props) {
  const [state, setState] = useState<'idle' | 'playing' | 'done'>('idle')
  useVimSuspend(state === 'playing')
  const [round, setRound] = useState(0)
  const [scores, setScores] = useState<Array<{ time: number; keystrokes: number }>>([])
  const [startTime, setStartTime] = useState(0)
  const [keystrokes, setKeystrokes] = useState(0)
  const [challenge, setChallenge] = useState<Challenge>(challenges[0])
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const totalRounds = 5
  const tr = locale === 'tr'

  const getGoal = useCallback((ch: Challenge) => {
    return ch.content.replace(ch.target, ch.replacement)
  }, [])

  const startRound = useCallback(() => {
    const ch = challenges[Math.floor(Math.random() * challenges.length)]
    setChallenge(ch)
    setKeystrokes(0)
    setStartTime(Date.now())

    if (viewRef.current) viewRef.current.destroy()
    if (!editorRef.current) return

    const s = EditorState.create({
      doc: ch.content,
      extensions: [vim(), editorTheme],
    })

    viewRef.current = new EditorView({ state: s, parent: editorRef.current })
    viewRef.current.focus()
  }, [])

  useEffect(() => {
    if (state !== 'playing') return
    const interval = setInterval(() => {
      if (!viewRef.current) return
      const content = viewRef.current.state.doc.toString()
      const goal = getGoal(challenge)
      if (content === goal) {
        const elapsed = Date.now() - startTime
        setScores((prev) => {
          const newScores = [...prev, { time: elapsed, keystrokes: Math.max(keystrokes, 1) }]
          if (newScores.length >= totalRounds) {
            setState('done')
          }
          return newScores
        })
        setRound((r) => {
          const next = r + 1
          if (next < totalRounds) {
            setTimeout(() => startRound(), 500)
          }
          return next
        })
      }
    }, 100)
    return () => clearInterval(interval)
  }, [state, startTime, keystrokes, challenge, getGoal, startRound])

  // Track keystrokes
  useEffect(() => {
    if (state !== 'playing') return
    const handler = () => setKeystrokes((k) => k + 1)
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [state])

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
      saveVimStat({ game: 'ci-game', score: avgScore, keystrokes: totalKs })
    }
  }, [state, scores, avgScore])

  return (
    <div className="rounded-xl border border-green-900/30 bg-green-950/20 p-6">
      <h3 className="text-lg font-semibold text-green-400">
        ✂️ CI Game
      </h3>
      <p className="mt-1 text-sm text-green-600">
        {tr
          ? 'ci{char} kullanarak içeriği mümkün olduğunca hızlı değiştirin.'
          : 'Change inner content using ci{char} as fast as possible.'}
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
          <div className="rounded-lg bg-green-500/5 border border-green-500/20 p-3">
            <p className="text-sm text-green-400">{tr ? challenge.instructionTr : challenge.instruction}</p>
            <p className="mt-1 font-mono text-xs text-green-700">
              {tr ? 'Hedef' : 'Goal'}: <span className="text-green-400">{getGoal(challenge)}</span>
            </p>
          </div>
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
                <span>{s.time}ms · {s.keystrokes} {tr ? 'tuş' : 'keys'}</span>
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
    </div>
  )
}
