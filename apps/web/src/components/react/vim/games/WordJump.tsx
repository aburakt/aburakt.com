import { useState, useRef, useEffect, useCallback } from 'react'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { vim } from '@replit/codemirror-vim'
import { saveVimStat } from '../../useAuth'

interface Props {
  locale: string
}

const sampleLines = [
  'const express = require("express");',
  'const app = express();',
  'const router = express.Router();',
  '',
  'router.get("/users", async (req, res) => {',
  '  const users = await db.query("SELECT * FROM users");',
  '  res.json({ success: true, data: users });',
  '});',
  '',
  'router.post("/users", async (req, res) => {',
  '  const { name, email } = req.body;',
  '  const result = await db.insert({ name, email });',
  '  res.status(201).json({ id: result.id });',
  '});',
  '',
  'app.use("/api", router);',
  'app.listen(3000, () => console.log("Server running"));',
]

const editorTheme = EditorView.theme({
  '&': { backgroundColor: '#18181b', color: '#e4e4e7', fontSize: '14px', height: '350px' },
  '.cm-content': { fontFamily: '"JetBrains Mono", monospace', caretColor: '#14b8a6' },
  '.cm-cursor': { borderLeftColor: '#14b8a6' },
  '.cm-gutters': { backgroundColor: '#09090b', color: '#52525b', border: 'none' },
  '.cm-activeLine': { backgroundColor: '#14b8a622' },
  '.cm-activeLineGutter': { backgroundColor: '#14b8a622', color: '#14b8a6' },
})

export default function WordJump({ locale }: Props) {
  const [state, setState] = useState<'idle' | 'playing' | 'done'>('idle')
  const [round, setRound] = useState(0)
  const [targetWord, setTargetWord] = useState('')
  const [targetPos, setTargetPos] = useState(0)
  const [keystrokes, setKeystrokes] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const totalRounds = 8
  const tr = locale === 'tr'

  const doc = sampleLines.join('\n')

  // Find word positions in the document
  const getWordPositions = useCallback(() => {
    const positions: Array<{ word: string; from: number; to: number }> = []
    const regex = /\b\w{2,}\b/g
    let match
    while ((match = regex.exec(doc)) !== null) {
      positions.push({ word: match[0], from: match.index, to: match.index + match[0].length })
    }
    return positions
  }, [doc])

  const startRound = useCallback(() => {
    setKeystrokes(0)

    if (viewRef.current) viewRef.current.destroy()
    if (!editorRef.current) return

    const positions = getWordPositions()
    if (positions.length < 2) return

    // Pick random start and target positions
    const startIdx = Math.floor(Math.random() * positions.length)
    let targetIdx = Math.floor(Math.random() * positions.length)
    while (Math.abs(targetIdx - startIdx) < 2) {
      targetIdx = Math.floor(Math.random() * positions.length)
    }

    const target = positions[targetIdx]
    setTargetWord(target.word)
    setTargetPos(target.from)

    const s = EditorState.create({
      doc,
      extensions: [vim(), editorTheme, EditorView.lineWrapping],
    })

    const view = new EditorView({ state: s, parent: editorRef.current })
    viewRef.current = view

    // Move cursor to start position
    const startPos = positions[startIdx].from
    view.dispatch({
      selection: { anchor: startPos },
      scrollIntoView: true,
    })
    view.focus()
  }, [doc, getWordPositions])

  useEffect(() => {
    if (state !== 'playing') return

    const handler = () => setKeystrokes((k) => k + 1)
    document.addEventListener('keydown', handler)

    const interval = setInterval(() => {
      if (!viewRef.current) return
      const cursorPos = viewRef.current.state.selection.main.head

      // Check if cursor is on the target word
      if (cursorPos >= targetPos && cursorPos <= targetPos + targetWord.length) {
        setScores((prev) => {
          const newScores = [...prev, keystrokes]
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
  }, [state, targetPos, targetWord, keystrokes, startRound])

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

  const totalKeystrokes = scores.reduce((a, s) => a + s, 0)

  // Save stat when game ends
  useEffect(() => {
    if (state === 'done' && scores.length > 0) {
      saveVimStat({ game: 'word-jump', score: totalRounds, keystrokes: totalKeystrokes })
    }
  }, [state, scores, totalKeystrokes])

  return (
    <div className="rounded-xl border border-green-900/30 bg-green-950/20 p-6">
      <h3 className="text-lg font-semibold text-green-400">🏃 Word Jump</h3>
      <p className="mt-1 text-sm text-green-600">
        {tr
          ? 'w, b, e, f, t komutlarıyla hedef kelimeye ulaşın. Minimum tuş kullanın.'
          : 'Navigate to the target word using w, b, e, f, t motions. Minimize keystrokes.'}
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
            <p className="text-sm text-green-400">
              {tr ? 'Hedef kelime' : 'Target word'}: <span className="font-mono font-bold">{targetWord}</span>
            </p>
            <p className="mt-1 text-xs text-green-700">
              {tr ? 'w, b, e, f{char}, t{char} kullanın' : 'Use w, b, e, f{char}, t{char}'}
            </p>
          </div>
          <div ref={editorRef} className="overflow-hidden rounded-lg border border-green-900/30" />
        </div>
      )}

      {state === 'done' && (
        <div className="mt-4 space-y-4">
          <div className="rounded-lg bg-green-500/10 p-4 text-center">
            <p className="text-lg font-semibold text-green-400">
              {tr ? 'Toplam tuş' : 'Total keystrokes'}: {totalKeystrokes}
            </p>
            <p className="mt-1 text-sm text-green-700">
              {tr ? 'Ortalama' : 'Average'}: {Math.round(totalKeystrokes / totalRounds)} {tr ? 'tuş/tur' : 'keys/round'}
            </p>
          </div>
          <div className="space-y-1">
            {scores.map((s, i) => (
              <div key={i} className="flex justify-between text-xs text-green-600">
                <span>{tr ? 'Tur' : 'Round'} {i + 1}</span>
                <span>{s} {tr ? 'tuş' : 'keys'}</span>
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
