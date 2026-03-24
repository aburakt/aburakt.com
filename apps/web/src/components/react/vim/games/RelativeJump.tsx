import { useState, useRef, useEffect, useCallback } from 'react'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { vim } from '@replit/codemirror-vim'
import { saveVimStat } from '../../useAuth'
import { useVimSuspend } from '../../useVimSuspend'

interface Props {
  locale: string
}

const sampleBuffer = Array.from({ length: 20 }, (_, i) => {
  const lines = [
    'function processData(input) {',
    '  const result = [];',
    '  for (let i = 0; i < input.length; i++) {',
    '    if (input[i] > threshold) {',
    '      result.push(transform(input[i]));',
    '    } else {',
    '      result.push(input[i]);',
    '    }',
    '  }',
    '  return result.filter(Boolean);',
    '}',
    '',
    'const config = {',
    '  timeout: 5000,',
    '  retries: 3,',
    '  debug: false,',
    '  verbose: true,',
    '  maxItems: 100,',
    '};',
    'export default config;',
  ]
  return lines[i]
}).join('\n')

const editorTheme = EditorView.theme({
  '&': { backgroundColor: '#18181b', color: '#e4e4e7', fontSize: '14px', height: '400px' },
  '.cm-content': { fontFamily: '"JetBrains Mono", monospace', caretColor: '#14b8a6' },
  '.cm-cursor': { borderLeftColor: '#14b8a6' },
  '.cm-gutters': { backgroundColor: '#09090b', color: '#52525b', border: 'none' },
  '.cm-activeLine': { backgroundColor: '#14b8a622' },
  '.cm-activeLineGutter': { backgroundColor: '#14b8a622', color: '#14b8a6' },
})

export default function RelativeJump({ locale }: Props) {
  const [state, setState] = useState<'idle' | 'playing' | 'done'>('idle')
  useVimSuspend(state === 'playing')
  const [targetLine, setTargetLine] = useState(0)
  const [currentLine, setCurrentLine] = useState(0)
  const [round, setRound] = useState(0)
  const [scores, setScores] = useState<Array<{ keystrokes: number; usedArrows: boolean }>>([])
  const [keystrokes, setKeystrokes] = useState(0)
  const [usedArrows, setUsedArrows] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const totalRounds = 8
  const tr = locale === 'tr'

  const startRound = useCallback(() => {
    setKeystrokes(0)
    setUsedArrows(false)

    if (viewRef.current) viewRef.current.destroy()
    if (!editorRef.current) return

    const startLine = Math.floor(Math.random() * 20)
    let target = Math.floor(Math.random() * 20)
    while (Math.abs(target - startLine) < 3) {
      target = Math.floor(Math.random() * 20)
    }
    setTargetLine(target)
    setCurrentLine(startLine)

    const s = EditorState.create({
      doc: sampleBuffer,
      extensions: [
        vim(),
        editorTheme,
        EditorView.lineWrapping,
      ],
    })

    const view = new EditorView({ state: s, parent: editorRef.current })
    viewRef.current = view

    // Move cursor to start line
    const line = view.state.doc.line(startLine + 1)
    view.dispatch({
      selection: { anchor: line.from },
      scrollIntoView: true,
    })
    view.focus()
  }, [])

  // Track cursor position and keystrokes
  useEffect(() => {
    if (state !== 'playing') return

    const handler = (e: KeyboardEvent) => {
      setKeystrokes((k) => k + 1)
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        setUsedArrows(true)
      }
    }
    document.addEventListener('keydown', handler)

    const interval = setInterval(() => {
      if (!viewRef.current) return
      const pos = viewRef.current.state.selection.main.head
      const line = viewRef.current.state.doc.lineAt(pos).number - 1
      setCurrentLine(line)

      if (line === targetLine) {
        setScores((prev) => {
          const newScores = [...prev, { keystrokes, usedArrows }]
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
  }, [state, targetLine, keystrokes, usedArrows, startRound])

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
  const arrowPenalties = scores.filter((s) => s.usedArrows).length

  // Save stat when game ends
  useEffect(() => {
    if (state === 'done' && scores.length > 0) {
      saveVimStat({ game: 'relative-jump', score: scores.length, keystrokes: totalKeystrokes })
    }
  }, [state, scores, totalKeystrokes])

  return (
    <div className="rounded-xl border border-green-900/30 bg-green-950/20 p-6">
      <h3 className="text-lg font-semibold text-green-400">
        <svg className="inline-block h-5 w-5 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25zm0 4.5a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5zm0 2.25a3 3 0 110 6 3 3 0 010-6z" /></svg>
        Relative Jump
      </h3>
      <p className="mt-1 text-sm text-green-600">
        {tr
          ? 'Hedef satıra göreceli zıplayarak (12j, 5k vb.) ulaşın. Ok tuşları ceza verir.'
          : 'Reach the target line using relative jumps (12j, 5k etc.). Arrow keys give penalties.'}
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
          <div className="rounded-lg bg-yellow-500/5 border border-yellow-500/20 p-3">
            <p className="text-sm text-amber-400">
              {tr ? 'Hedef satır' : 'Target line'}: <span className="font-mono font-bold">{targetLine + 1}</span>
              {' · '}
              {tr ? 'Şu anki satır' : 'Current line'}: <span className="font-mono">{currentLine + 1}</span>
              {' · '}
              {tr ? 'Fark' : 'Difference'}: <span className="font-mono">{Math.abs(targetLine - currentLine)}</span> {tr ? 'satır' : 'lines'} {targetLine > currentLine ? '↓' : '↑'}
            </p>
          </div>
          <div ref={editorRef} className="overflow-hidden rounded-lg border border-green-900/30" />
          {usedArrows && (
            <p className="text-xs text-red-400">
              ⚠️ {tr ? 'Ok tuşları kullanıldı! Göreceli atlama deneyin (örn: 5j, 3k)' : 'Arrow keys used! Try relative jumps (e.g. 5j, 3k)'}
            </p>
          )}
        </div>
      )}

      {state === 'done' && (
        <div className="mt-4 space-y-4">
          <div className="rounded-lg bg-green-500/10 p-4 text-center">
            <p className="text-lg font-semibold text-green-400">
              {tr ? 'Toplam tuş' : 'Total keystrokes'}: {totalKeystrokes}
              {arrowPenalties > 0 && (
                <span className="ml-2 text-sm text-red-400">
                  ({arrowPenalties} {tr ? 'ok tuşu cezası' : 'arrow penalties'})
                </span>
              )}
            </p>
          </div>
          <div className="space-y-1">
            {scores.map((s, i) => (
              <div key={i} className="flex justify-between text-xs text-green-600">
                <span>{tr ? 'Tur' : 'Round'} {i + 1}</span>
                <span>
                  {s.keystrokes} {tr ? 'tuş' : 'keys'}
                  {s.usedArrows && <span className="ml-1 text-red-400">⚠</span>}
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
