import { useState, useRef, useEffect, useCallback } from 'react'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { vim } from '@replit/codemirror-vim'
import { saveVimStat } from '../../useAuth'

interface Props {
  locale: string
}

interface Challenge {
  initial: string
  goal: string
  hint: string
  hintTr: string
}

const challenges: Challenge[] = [
  {
    initial: 'foo_bar\nfoo_baz\nfoo_qux\nfoo_quux\nfoo_corge',
    goal: 'fooBar\nfooBaz\nfooQux\nfooQuux\nfooCorge',
    hint: 'Record macro: qa f_ x ~ q then replay with @a or 4@a',
    hintTr: 'Makro kaydet: qa f_ x ~ q sonra @a veya 4@a ile tekrarla',
  },
  {
    initial: 'item1\nitem2\nitem3\nitem4\nitem5',
    goal: '- item1\n- item2\n- item3\n- item4\n- item5',
    hint: 'Record macro: qa I- <Esc> j q then replay with 4@a',
    hintTr: 'Makro kaydet: qa I- <Esc> j q sonra 4@a ile tekrarla',
  },
  {
    initial: 'let a = 1;\nlet b = 2;\nlet c = 3;\nlet d = 4;\nlet e = 5;',
    goal: 'const a = 1;\nconst b = 2;\nconst c = 3;\nconst d = 4;\nconst e = 5;',
    hint: 'Record macro: qa ^cw const<Esc> j q then replay with 4@a',
    hintTr: 'Makro kaydet: qa ^cw const<Esc> j q sonra 4@a ile tekrarla',
  },
  {
    initial: 'name: alice\nname: bob\nname: charlie\nname: dave\nname: eve',
    goal: 'name: "alice"\nname: "bob"\nname: "charlie"\nname: "dave"\nname: "eve"',
    hint: 'Record macro: qa f: wi"<Esc>A"<Esc>j q then replay',
    hintTr: 'Makro kaydet: qa f: wi"<Esc>A"<Esc>j q sonra tekrarla',
  },
]

const editorTheme = EditorView.theme({
  '&': { backgroundColor: '#18181b', color: '#e4e4e7', fontSize: '14px', height: '200px' },
  '.cm-content': { fontFamily: '"JetBrains Mono", monospace', caretColor: '#14b8a6', padding: '12px' },
  '.cm-cursor': { borderLeftColor: '#14b8a6' },
  '.cm-gutters': { backgroundColor: '#09090b', color: '#52525b', border: 'none' },
  '.cm-activeLine': { backgroundColor: '#14b8a622' },
})

export default function MacroRun({ locale }: Props) {
  const [state, setState] = useState<'idle' | 'playing' | 'done'>('idle')
  const [round, setRound] = useState(0)
  const [challenge, setChallenge] = useState<Challenge>(challenges[0])
  const [keystrokes, setKeystrokes] = useState(0)
  const [scores, setScores] = useState<Array<{ keystrokes: number; time: number }>>([])
  const [startTime, setStartTime] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const totalRounds = 4
  const tr = locale === 'tr'

  const startRound = useCallback(() => {
    setKeystrokes(0)
    setStartTime(Date.now())
    setShowHint(false)

    const ch = challenges[round % challenges.length]
    setChallenge(ch)

    if (viewRef.current) viewRef.current.destroy()
    if (!editorRef.current) return

    const s = EditorState.create({
      doc: ch.initial,
      extensions: [vim(), editorTheme],
    })

    viewRef.current = new EditorView({ state: s, parent: editorRef.current })
    viewRef.current.focus()
  }, [round])

  useEffect(() => {
    if (state !== 'playing') return

    const handler = () => setKeystrokes((k) => k + 1)
    document.addEventListener('keydown', handler)

    const interval = setInterval(() => {
      if (!viewRef.current) return
      const content = viewRef.current.state.doc.toString()
      if (content === challenge.goal) {
        const elapsed = Date.now() - startTime
        setScores((prev) => {
          const newScores = [...prev, { keystrokes, time: elapsed }]
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

    return () => {
      document.removeEventListener('keydown', handler)
      clearInterval(interval)
    }
  }, [state, challenge.goal, keystrokes, startTime, startRound])

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

  const totalKeystrokes = scores.reduce((a, s) => a + s.keystrokes, 0)

  // Save stat when game ends
  useEffect(() => {
    if (state === 'done' && scores.length > 0) {
      saveVimStat({ game: 'macro-run', score: totalRounds, keystrokes: totalKeystrokes })
    }
  }, [state, scores, totalKeystrokes])

  return (
    <div className="rounded-xl border border-green-900/30 bg-green-950/20 p-6">
      <h3 className="text-lg font-semibold text-green-400">🔄 Macro Run</h3>
      <p className="mt-1 text-sm text-green-600">
        {tr
          ? 'Vim makrolarını kullanarak tekrarlanan düzenlemeleri yapın. qa ile kaydedin, @a ile tekrarlayın.'
          : 'Use vim macros for repetitive edits. Record with qa, replay with @a.'}
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
            <p className="text-xs text-green-700 mb-1">{tr ? 'Hedef' : 'Goal'}:</p>
            <pre className="font-mono text-xs text-green-400 whitespace-pre">{challenge.goal}</pre>
          </div>

          <div ref={editorRef} className="overflow-hidden rounded-lg border border-green-900/30" />

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-green-700 hover:text-green-600"
            >
              {showHint ? (tr ? 'İpucunu gizle' : 'Hide hint') : (tr ? 'İpucu göster' : 'Show hint')}
            </button>
          </div>
          {showHint && (
            <p className="text-xs text-yellow-400/80 flex items-start gap-1">
              <svg className="h-3.5 w-3.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>
              {tr ? challenge.hintTr : challenge.hint}
            </p>
          )}
        </div>
      )}

      {state === 'done' && (
        <div className="mt-4 space-y-4">
          <div className="rounded-lg bg-green-500/10 p-4 text-center">
            <p className="text-lg font-semibold text-green-400">
              {tr ? 'Toplam tuş' : 'Total keystrokes'}: {totalKeystrokes}
            </p>
          </div>
          <div className="space-y-1">
            {scores.map((s, i) => (
              <div key={i} className="flex justify-between text-xs text-green-600">
                <span>{tr ? 'Tur' : 'Round'} {i + 1}</span>
                <span>
                  {s.keystrokes} {tr ? 'tuş' : 'keys'} · {Math.round(s.time / 1000)}s
                </span>
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
