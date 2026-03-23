import { useState, useCallback } from 'react'
import TypingEngine from './TypingEngine'
import type { TypingStats } from './TypingEngine'
import type { Layout } from './keyboardLayouts'

interface Props {
  locale: string
}

const enTexts = [
  'The quick brown fox jumps over the lazy dog near the riverbank.',
  'Programming is the art of telling a computer what to do step by step.',
  'Every great developer you know got there by solving problems they were unqualified to solve until they actually did it.',
  'The best error message is the one that never shows up in the first place.',
  'Code is like humor. When you have to explain it, it is bad and needs refactoring.',
  'First solve the problem then write the code that implements the solution.',
  'Experience is the name everyone gives to their mistakes in software development.',
  'Simplicity is the soul of efficiency when writing clean maintainable code.',
  'Any fool can write code that a computer can understand but good programmers write code that humans can understand.',
  'Talk is cheap so show me the code and let the results speak for themselves.',
]

const trTexts = [
  'Hızlı kahverengi tilki tembel köpeğin üzerinden atladı ve ormana doğru koştu.',
  'Programlama bir bilgisayara ne yapması gerektiğini adım adım anlatma sanatıdır.',
  'İyi bir geliştirici olmak için sürekli pratik yapmak ve yeni teknolojileri öğrenmek gerekir.',
  'En iyi hata mesajı hiç görünmeyen hata mesajıdır çünkü hata yoktur.',
  'Kod yazarken basitlik ve okunabilirlik her zaman karmaşıklıktan daha değerlidir.',
  'Önce problemi çöz sonra çözümü uygulayan kodu yaz ve test et.',
  'Deneyim herkesin hatalarına verdiği isimdir ve hatalardan öğrenmek çok önemlidir.',
  'Temiz ve sürdürülebilir kod yazmanın temelinde sadelik yatar ve bunu unutmamalıyız.',
  'Herkes bilgisayarın anlayacağı kodu yazabilir ama iyi programcılar insanların anlayacağı kodu yazar.',
  'Konuşmak kolay bana kodu göster ve sonuçların kendisi için konuşmasına izin ver.',
]

const durations = [15, 30, 60, 120]

export default function TypingTest({ locale }: Props) {
  const tr = locale === 'tr'
  const layout: Layout = tr ? 'tr' : 'en'
  const [duration, setDuration] = useState(30)
  const [state, setState] = useState<'config' | 'playing' | 'done'>('config')
  const [text, setText] = useState('')
  const [result, setResult] = useState<TypingStats | null>(null)
  const [history, setHistory] = useState<TypingStats[]>([])
  const [key, setKey] = useState(0)

  function generateText() {
    const pool = tr ? trTexts : enTexts
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 4).join(' ')
  }

  function startTest() {
    setText(generateText())
    setState('playing')
    setResult(null)
    setKey((k) => k + 1)
  }

  const handleComplete = useCallback((stats: TypingStats) => {
    setResult(stats)
    setState('done')
    setHistory((h) => [...h, stats])
  }, [])

  function resetTest() {
    setState('config')
    setResult(null)
  }

  if (state === 'config') {
    return (
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            {tr ? 'Süre' : 'Duration'}
          </label>
          <div className="flex gap-2">
            {durations.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  duration === d
                    ? 'bg-primary-600 text-white'
                    : 'border border-zinc-600 text-zinc-400 hover:border-zinc-500'
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startTest}
          className="rounded-lg bg-primary-600 px-8 py-3 text-sm font-medium text-white transition hover:bg-primary-500"
        >
          {tr ? 'Testi Başlat' : 'Start Test'}
        </button>

        {history.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-400">
              {tr ? 'Geçmiş Sonuçlar' : 'Previous Results'}
            </h3>
            {history.slice(-5).reverse().map((s, i) => (
              <div key={i} className="flex justify-between rounded-lg bg-zinc-800/50 px-4 py-2 text-xs text-zinc-400">
                <span>{s.wpm} WPM</span>
                <span>{s.accuracy}% {tr ? 'doğruluk' : 'accuracy'}</span>
                <span>{s.time}s</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (state === 'done' && result) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-zinc-800/50 p-8 text-center">
          <p className="text-5xl font-bold text-primary-400">{result.wpm}</p>
          <p className="mt-1 text-sm text-zinc-500">WPM</p>
          <div className="mt-6 flex justify-center gap-8">
            <div>
              <p className="text-2xl font-semibold text-green-400">{result.accuracy}%</p>
              <p className="text-xs text-zinc-500">{tr ? 'Doğruluk' : 'Accuracy'}</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-blue-400">{result.time}s</p>
              <p className="text-xs text-zinc-500">{tr ? 'Süre' : 'Time'}</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-red-400">{result.incorrect}</p>
              <p className="text-xs text-zinc-500">{tr ? 'Hata' : 'Errors'}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={startTest}
            className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-primary-500"
          >
            {tr ? 'Tekrar Dene' : 'Try Again'}
          </button>
          <button
            onClick={resetTest}
            className="rounded-lg border border-zinc-600 px-6 py-2 text-sm text-zinc-300 transition hover:border-zinc-500"
          >
            {tr ? 'Ayarlar' : 'Settings'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <TypingEngine
      key={key}
      text={text}
      layout={layout}
      onComplete={handleComplete}
      showKeyboard={false}
      showStats={true}
    />
  )
}
