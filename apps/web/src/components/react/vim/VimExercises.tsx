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
                    ? 'bg-primary-500'
                    : solved.has(ex.id)
                      ? 'bg-green-500'
                      : 'bg-zinc-700'
                }`}
                title={`${tr ? 'Görev' : 'Task'} ${i + 1}`}
              />
            ))}
          </div>
        </div>
        <span className="text-xs text-zinc-400">
          {solved.size}/{exercises.length} {tr ? 'tamamlandı' : 'completed'}
        </span>
      </div>

      {/* Exercise info */}
      <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs text-zinc-500">
              {tr ? 'Görev' : 'Task'} {currentIdx + 1}/{exercises.length} · {exercise.category}
            </span>
            <h2 className="mt-1 text-lg font-semibold text-zinc-100">
              {tr ? exercise.titleTr : exercise.title}
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              {tr ? exercise.descriptionTr : exercise.description}
            </p>
            <p className="mt-1 text-xs text-zinc-500">
              {tr ? 'Beklenen komut:' : 'Expected command:'}{' '}
              <kbd className="rounded bg-zinc-700 px-1.5 py-0.5 font-mono text-primary-400">
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
            <span className="text-xs font-medium text-zinc-400">
              {tr ? 'Editör (vim modu aktif)' : 'Editor (vim mode active)'}
            </span>
            <span className="text-xs text-zinc-500">
              {tr ? 'Deneme' : 'Attempts'}: {attempts}
            </span>
          </div>
          <div
            ref={editorRef}
            className="overflow-hidden rounded-lg border border-zinc-700"
          />
        </div>
        <div>
          <span className="mb-2 block text-xs font-medium text-zinc-400">
            {tr ? 'Hedef' : 'Goal'}
          </span>
          <pre
            ref={goalRef}
            className="h-[200px] overflow-auto rounded-lg border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-green-400"
          />
        </div>
      </div>

      {/* Hint */}
      {showHint && (
        <div className="rounded-lg border border-primary-500/30 bg-primary-500/5 p-4">
          <p className="text-sm text-primary-400">
            💡 {tr ? exercise.hintTr : exercise.hint}
          </p>
        </div>
      )}

      {/* Solved message */}
      {isSolved && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4 text-center">
          <p className="text-sm font-medium text-green-400">
            🎉 {tr ? 'Harika! Görevi tamamladınız!' : 'Great job! Exercise completed!'}
            {usedHint && (
              <span className="ml-2 text-zinc-500">
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
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 disabled:opacity-30"
        >
          ← {tr ? 'Önceki' : 'Previous'}
        </button>
        <button
          onClick={checkSolution}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-500"
        >
          {tr ? 'Kontrol Et' : 'Check'}
        </button>
        <button
          onClick={resetExercise}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500"
        >
          {tr ? 'Sıfırla' : 'Reset'}
        </button>
        <button
          onClick={() => { setShowHint(true); setUsedHint(true) }}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500"
        >
          ? {tr ? 'İpucu' : 'Hint'}
        </button>
        <button
          onClick={nextExercise}
          disabled={currentIdx === exercises.length - 1}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 disabled:opacity-30"
        >
          {tr ? 'Sonraki' : 'Next'} →
        </button>
      </div>

      {/* Desktop only notice */}
      <p className="text-center text-xs text-zinc-600 sm:hidden">
        {tr ? 'Vim alıştırmaları masaüstünde daha iyi çalışır.' : 'Vim exercises work best on desktop.'}
      </p>
    </div>
  )
}
