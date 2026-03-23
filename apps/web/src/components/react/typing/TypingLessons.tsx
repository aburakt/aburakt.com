import { useState } from 'react'
import { lessons } from './lessonData'
import TypingEngine from './TypingEngine'
import type { TypingStats } from './TypingEngine'
import type { Layout } from './keyboardLayouts'
import { saveTypingStat } from '../useAuth'

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
    saveTypingStat({ mode: 'lesson', wpm: stats.wpm, accuracy: stats.accuracy, duration_s: stats.time, layout })
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
                className="group rounded-xl border border-green-900/30 bg-green-950/20 p-5 text-left transition hover:border-green-500/50"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-green-400 group-hover:text-green-300">
                    {tr ? l.titleTr : l.title}
                  </h3>
                  {done && <span className="text-green-400">✓</span>}
                </div>
                <p className="mt-1 text-sm text-green-700">
                  {tr ? l.descriptionTr : l.description}
                </p>
                {l.keys.length > 0 && (
                  <div className="mt-3 flex gap-1">
                    {l.keys.slice(0, 8).map((k) => (
                      <span key={k} className="rounded bg-green-900/30 px-2 py-0.5 font-mono text-xs text-green-400">
                        {k}
                      </span>
                    ))}
                    {l.keys.length > 8 && (
                      <span className="text-xs text-green-700">+{l.keys.length - 8}</span>
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
        <button onClick={backToList} className="text-sm text-green-400 hover:text-green-300">
          ← {tr ? 'Dersler' : 'Lessons'}
        </button>
        <span className="text-xs text-green-700">
          {textIndex + 1} / {texts.length}
        </span>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-green-400">{tr ? lesson.titleTr : lesson.title}</h2>
        <p className="mt-1 text-sm text-green-700">{tr ? lesson.descriptionTr : lesson.description}</p>
      </div>

      <div className="h-1 overflow-hidden rounded-full bg-green-900/30">
        <div
          className="h-full bg-green-500 transition-all"
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
            className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-black transition hover:bg-green-500"
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
            <p className="mt-1 text-sm text-green-700">
              {tr ? 'Ortalama' : 'Average'} WPM: {Math.round(lessonStats.reduce((a, s) => a + s.wpm, 0) / lessonStats.length)}
              {' · '}
              {tr ? 'Doğruluk' : 'Accuracy'}: {Math.round(lessonStats.reduce((a, s) => a + s.accuracy, 0) / lessonStats.length)}%
            </p>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={resetLesson}
              className="rounded-lg border border-green-900/30 px-4 py-2 text-sm text-green-400 transition hover:border-green-500/50"
            >
              {tr ? 'Tekrarla' : 'Retry'}
            </button>
            <button
              onClick={backToList}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-black transition hover:bg-green-500"
            >
              {tr ? 'Diğer Dersler' : 'Other Lessons'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
