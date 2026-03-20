import { useState } from 'react'
import { lessons } from './lessonData'
import TypingEngine from './TypingEngine'
import type { TypingStats } from './TypingEngine'
import type { Layout } from './keyboardLayouts'

interface Props {
  locale: string
}

export default function TypingLessons({ locale }: Props) {
  const tr = locale === 'tr'
  const layout: Layout = tr ? 'tr' : 'en'
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [textIndex, setTextIndex] = useState(0)
  const [completedTexts, setCompletedTexts] = useState<Map<string, TypingStats[]>>(new Map())
  const [key, setKey] = useState(0)

  const lesson = selectedLesson ? lessons.find((l) => l.id === selectedLesson) : null
  const texts = lesson ? (tr ? lesson.textsTr : lesson.texts) : []
  const currentText = texts[textIndex] ?? ''

  function handleComplete(stats: TypingStats) {
    if (!lesson) return
    setCompletedTexts((prev) => {
      const next = new Map(prev)
      const existing = next.get(lesson.id) ?? []
      next.set(lesson.id, [...existing, stats])
      return next
    })
  }

  function nextText() {
    if (textIndex < texts.length - 1) {
      setTextIndex(textIndex + 1)
      setKey((k) => k + 1)
    }
  }

  function resetLesson() {
    setTextIndex(0)
    setKey((k) => k + 1)
  }

  function backToList() {
    setSelectedLesson(null)
    setTextIndex(0)
    setKey((k) => k + 1)
  }

  const lessonStats = lesson ? completedTexts.get(lesson.id) ?? [] : []
  const isTextDone = lessonStats.length > textIndex
  const isLessonDone = lessonStats.length >= texts.length

  if (!lesson) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {lessons.map((l) => {
            const stats = completedTexts.get(l.id)
            const done = stats && stats.length >= (tr ? l.textsTr : l.texts).length
            return (
              <button
                key={l.id}
                onClick={() => setSelectedLesson(l.id)}
                className="group rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-5 text-left transition hover:border-primary-500/50"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-zinc-100 group-hover:text-primary-400">
                    {tr ? l.titleTr : l.title}
                  </h3>
                  {done && <span className="text-green-400">✓</span>}
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  {tr ? l.descriptionTr : l.description}
                </p>
                {l.keys.length > 0 && (
                  <div className="mt-3 flex gap-1">
                    {l.keys.slice(0, 8).map((k) => (
                      <span key={k} className="rounded bg-zinc-700 px-2 py-0.5 font-mono text-xs text-zinc-300">
                        {k}
                      </span>
                    ))}
                    {l.keys.length > 8 && (
                      <span className="text-xs text-zinc-500">+{l.keys.length - 8}</span>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={backToList} className="text-sm text-primary-500 hover:text-primary-400">
          ← {tr ? 'Dersler' : 'Lessons'}
        </button>
        <span className="text-xs text-zinc-500">
          {textIndex + 1} / {texts.length}
        </span>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-zinc-100">{tr ? lesson.titleTr : lesson.title}</h2>
        <p className="mt-1 text-sm text-zinc-500">{tr ? lesson.descriptionTr : lesson.description}</p>
      </div>

      <div className="h-1 overflow-hidden rounded-full bg-zinc-700">
        <div
          className="h-full bg-primary-500 transition-all"
          style={{ width: `${(Math.min(lessonStats.length, texts.length) / texts.length) * 100}%` }}
        />
      </div>

      <TypingEngine
        key={key}
        text={currentText}
        layout={layout}
        onComplete={handleComplete}
        showKeyboard={true}
        showStats={true}
      />

      {isTextDone && !isLessonDone && (
        <div className="flex justify-center">
          <button
            onClick={nextText}
            className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-primary-500"
          >
            {tr ? 'Sonraki Metin' : 'Next Text'} →
          </button>
        </div>
      )}

      {isLessonDone && (
        <div className="space-y-4 text-center">
          <div className="rounded-lg bg-green-500/10 p-4">
            <p className="text-lg font-semibold text-green-400">
              {tr ? 'Ders Tamamlandı!' : 'Lesson Complete!'}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {tr ? 'Ortalama' : 'Average'} WPM: {Math.round(lessonStats.reduce((a, s) => a + s.wpm, 0) / lessonStats.length)}
              {' · '}
              {tr ? 'Doğruluk' : 'Accuracy'}: {Math.round(lessonStats.reduce((a, s) => a + s.accuracy, 0) / lessonStats.length)}%
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={resetLesson}
              className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-500"
            >
              {tr ? 'Tekrarla' : 'Retry'}
            </button>
            <button
              onClick={backToList}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-500"
            >
              {tr ? 'Diğer Dersler' : 'Other Lessons'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
