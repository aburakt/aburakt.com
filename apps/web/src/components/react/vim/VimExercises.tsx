import { useState, useRef, useEffect, useCallback } from 'react'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { defaultKeymap } from '@codemirror/commands'
import { vim } from '@replit/codemirror-vim'
import { javascript } from '@codemirror/lang-javascript'
import { exercises, type VimExercise } from './exerciseData'

interface Props {
  locale: string
}

const editorTheme = EditorView.theme({
  '&': {
    backgroundColor: '#18181b',
    color: '#e4e4e7',
    fontSize: '14px',
    height: '200px',
  },
  '.cm-content': {
    fontFamily: '"JetBrains Mono", monospace',
    caretColor: '#14b8a6',
  },
  '.cm-cursor': {
    borderLeftColor: '#14b8a6',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
    backgroundColor: '#14b8a633',
  },
  '.cm-gutters': {
    backgroundColor: '#09090b',
    color: '#52525b',
    border: 'none',
  },
  '.cm-activeLine': {
    backgroundColor: '#27272a33',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#27272a33',
  },
})

export default function VimExercises({ locale }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [solved, setSolved] = useState<Set<number>>(new Set())
  const [attempts, setAttempts] = useState(0)
  const [usedHint, setUsedHint] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  const goalRef = useRef<HTMLDivElement>(null)

  const tr = locale === 'tr'
  const exercise = exercises[currentIdx]

  const initEditor = useCallback((ex: VimExercise) => {
    if (!editorRef.current) return
    if (viewRef.current) {
      viewRef.current.destroy()
    }

    const state = EditorState.create({
      doc: ex.initialContent,
      extensions: [
        vim(),
        keymap.of(defaultKeymap),
        javascript(),
        editorTheme,
        EditorView.lineWrapping,
      ],
    })

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current.focus()
  }, [])

  useEffect(() => {
    initEditor(exercise)
    setShowHint(false)
    setUsedHint(false)
    return () => {
      viewRef.current?.destroy()
    }
  }, [currentIdx, initEditor, exercise])

  // Init goal viewer
  useEffect(() => {
    if (!goalRef.current) return
    goalRef.current.textContent = exercise.goalContent
  }, [exercise])

  function checkSolution() {
    if (!viewRef.current) return
    const current = viewRef.current.state.doc.toString()
    setAttempts((a) => a + 1)
    if (current === exercise.goalContent) {
      setSolved((s) => new Set(s).add(exercise.id))
    }
  }

  function resetExercise() {
    initEditor(exercise)
    setShowHint(false)
  }

  function nextExercise() {
    if (currentIdx < exercises.length - 1) {
      setCurrentIdx(currentIdx + 1)
    }
  }

  function prevExercise() {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1)
    }
  }

  const isSolved = solved.has(exercise.id)

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex gap-1">
            {exercises.map((ex, i) => (
              <button
                key={ex.id}
                onClick={() => setCurrentIdx(i)}
                className={`h-2 flex-1 rounded-full transition ${
                  i === currentIdx
                    ? 'bg-green-500'
                    : solved.has(ex.id)
                      ? 'bg-green-500'
                      : 'bg-green-900/30'
                }`}
                title={`${tr ? 'Görev' : 'Task'} ${i + 1}`}
              />
            ))}
          </div>
        </div>
        <span className="text-xs text-green-600">
          {solved.size}/{exercises.length} {tr ? 'tamamlandı' : 'completed'}
        </span>
      </div>

      {/* Exercise info */}
      <div className="rounded-xl border border-green-900/30 bg-green-950/20 p-6">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs text-green-700">
              {tr ? 'Görev' : 'Task'} {currentIdx + 1}/{exercises.length} · {exercise.category}
            </span>
            <h2 className="mt-1 text-lg font-semibold text-green-400">
              {tr ? exercise.titleTr : exercise.title}
            </h2>
            <p className="mt-2 text-sm text-green-600">
              {tr ? exercise.descriptionTr : exercise.description}
            </p>
            <p className="mt-1 text-xs text-green-700">
              {tr ? 'Beklenen komut:' : 'Expected command:'}{' '}
              <kbd className="rounded bg-green-900/30 px-1.5 py-0.5 font-mono text-green-400">
                {exercise.expectedMotion}
              </kbd>
            </p>
          </div>
          {isSolved && (
            <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
              ✓ {tr ? 'Çözüldü' : 'Solved'}
            </span>
          )}
        </div>
      </div>

      {/* Editor and Goal side by side */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-green-600">
              {tr ? 'Editör (vim modu aktif)' : 'Editor (vim mode active)'}
            </span>
            <span className="text-xs text-green-700">
              {tr ? 'Deneme' : 'Attempts'}: {attempts}
            </span>
          </div>
          <div
            ref={editorRef}
            className="overflow-hidden rounded-lg border border-green-900/30"
          />
        </div>
        <div>
          <span className="mb-2 block text-xs font-medium text-green-600">
            {tr ? 'Hedef' : 'Goal'}
          </span>
          <pre
            ref={goalRef}
            className="h-[200px] overflow-auto rounded-lg border border-green-900/30 bg-black p-4 font-mono text-sm text-green-400"
          />
        </div>
      </div>

      {/* Hint */}
      {showHint && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
          <p className="text-sm text-green-400 flex items-start gap-1.5">
            <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>
            {tr ? exercise.hintTr : exercise.hint}
          </p>
        </div>
      )}

      {/* Solved message */}
      {isSolved && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4 text-center">
          <p className="text-sm font-medium text-green-400">
            🎉 {tr ? 'Harika! Görevi tamamladınız!' : 'Great job! Exercise completed!'}
            {usedHint && (
              <span className="ml-2 text-green-700">
                ({tr ? 'ipucu kullanıldı' : 'hint used'})
              </span>
            )}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={prevExercise}
          disabled={currentIdx === 0}
          className="rounded-lg border border-green-900/30 px-4 py-2 text-sm font-medium text-green-400 transition hover:border-green-500/50 disabled:opacity-30"
        >
          ← {tr ? 'Önceki' : 'Previous'}
        </button>
        <button
          onClick={checkSolution}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-black transition hover:bg-green-500"
        >
          {tr ? 'Kontrol Et' : 'Check'}
        </button>
        <button
          onClick={resetExercise}
          className="rounded-lg border border-green-900/30 px-4 py-2 text-sm font-medium text-green-400 transition hover:border-green-500/50"
        >
          {tr ? 'Sıfırla' : 'Reset'}
        </button>
        <button
          onClick={() => { setShowHint(true); setUsedHint(true) }}
          className="rounded-lg border border-green-900/30 px-4 py-2 text-sm font-medium text-green-400 transition hover:border-green-500/50"
        >
          ? {tr ? 'İpucu' : 'Hint'}
        </button>
        <button
          onClick={nextExercise}
          disabled={currentIdx === exercises.length - 1}
          className="rounded-lg border border-green-900/30 px-4 py-2 text-sm font-medium text-green-400 transition hover:border-green-500/50 disabled:opacity-30"
        >
          {tr ? 'Sonraki' : 'Next'} →
        </button>
      </div>

      {/* Desktop only notice */}
      <p className="text-center text-xs text-green-800 sm:hidden">
        {tr ? 'Vim alıştırmaları masaüstünde daha iyi çalışır.' : 'Vim exercises work best on desktop.'}
      </p>
    </div>
  )
}
