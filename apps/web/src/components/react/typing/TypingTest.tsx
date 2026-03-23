import { useState, useEffect, useRef } from 'react'
import { findKey, type Layout } from './keyboardLayouts'
import Keyboard from './Keyboard'
import { saveTypingStat } from '../useAuth'

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
  'A good programmer is someone who always looks both ways before crossing a one way street.',
  'The most important property of a program is whether it accomplishes the intention of its user.',
  'Measuring programming progress by lines of code is like measuring aircraft building progress by weight.',
  'Sometimes it pays to stay in bed on Monday rather than spending the rest of the week debugging Monday code.',
  'Before software can be reusable it first has to be usable by the people who need it most.',
  'Walking on water and developing software from a specification are easy if both are frozen solid.',
  'The function of good software is to make the complex appear to be simple to the end user.',
  'Programming today is a race between software engineers striving to build bigger and better programs.',
  'If debugging is the process of removing software bugs then programming must be the process of putting them in.',
  'There are two ways to write error free programs and only the third one works in practice.',
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
  'Yazılım geliştirme bir takım işidir ve iletişim başarının en önemli anahtarıdır.',
  'İyi bir yazılımcı hata yapmaktan korkmaz çünkü her hata yeni bir öğrenme fırsatıdır.',
  'Kodun kalitesi onu yazan kişinin ne kadar özen gösterdiğiyle doğru orantılıdır.',
  'Basit çözümler her zaman karmaşık çözümlerden daha güvenilir ve sürdürülebilirdir.',
  'Teknoloji dünyasında değişmeyen tek şey değişimin kendisidir ve buna hazır olmalıyız.',
  'Her büyük proje küçük bir adımla başlar ve sabırla büyük başarılara dönüşür.',
  'Test yazmak zaman kaybı değil gelecekteki hataları önlemenin en etkili yoludur.',
  'Yazılımda mükemmellik yoktur ama her gün daha iyisini yapmak için çalışabiliriz.',
  'Bir programın en önemli özelliği kullanıcısının amacını gerçekleştirip gerçekleştirmediğidir.',
  'Hata ayıklama yazılım hatalarını giderme süreciyse programlama onları ekleme sürecidir.',
]

const durations = [15, 30, 60, 120]

interface TestResult {
  wpm: number
  accuracy: number
  time: number
  correct: number
  incorrect: number
  total: number
}

export default function TypingTest({ locale }: Props) {
  const tr = locale === 'tr'
  const layout: Layout = tr ? 'tr' : 'en'
  const [duration, setDuration] = useState(30)
  const [state, setState] = useState<'config' | 'playing' | 'done'>('config')
  const [text, setText] = useState('')
  const [typed, setTyped] = useState('')
  const [errors, setErrors] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [result, setResult] = useState<TestResult | null>(null)
  const [history, setHistory] = useState<TestResult[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval>>()
  const typedRef = useRef('')
  const errorsRef = useRef(0)
  const textRef = useRef('')

  const pos = typed.length
  const currentChar = pos < text.length ? text[pos] : undefined
  const keyDef = currentChar ? findKey(layout, currentChar) : undefined

  function generateText() {
    const pool = tr ? trTexts : enTexts
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    // Use many sentences so user can't finish in time
    return shuffled.join(' ')
  }

  function startTest() {
    const t = generateText()
    setText(t)
    textRef.current = t
    setTyped('')
    typedRef.current = ''
    setErrors(0)
    errorsRef.current = 0
    setStartTime(null)
    setTimeLeft(duration)
    setResult(null)
    setState('playing')
    setTimeout(() => containerRef.current?.focus(), 50)
  }

  // Countdown timer
  useEffect(() => {
    if (state !== 'playing' || startTime === null) return
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      const remaining = Math.max(duration - elapsed, 0)
      setTimeLeft(Math.ceil(remaining))
      if (remaining <= 0) {
        clearInterval(timerRef.current)
        finishTest()
      }
    }, 100)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [state, startTime, duration])

  function finishTest() {
    const currentTyped = typedRef.current
    const currentText = textRef.current
    const currentErrors = errorsRef.current
    const charsTyped = currentTyped.length
    const correct = currentTyped.split('').filter((c, i) => c === currentText[i]).length
    const accuracy = charsTyped > 0 ? Math.round((correct / charsTyped) * 100) : 100
    const wpm = Math.round((charsTyped / 5) / (duration / 60))
    const res: TestResult = {
      wpm,
      accuracy,
      time: duration,
      correct,
      incorrect: currentErrors,
      total: charsTyped,
    }
    setResult(res)
    setState('done')
    setHistory((h) => [...h, res])
    saveTypingStat({ mode: 'test', wpm, accuracy, duration_s: duration, layout })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (state !== 'playing') return
    if (e.ctrlKey || e.altKey || e.metaKey) return

    if (e.key === 'Backspace') {
      e.preventDefault()
      setTyped((t) => {
        const updated = t.slice(0, -1)
        typedRef.current = updated
        return updated
      })
      return
    }

    if (e.key.length !== 1) return
    e.preventDefault()

    if (!startTime) setStartTime(Date.now())

    const expected = text[pos]
    if (e.key !== expected) {
      setErrors((err) => err + 1)
      errorsRef.current += 1
    }
    const next = typed + e.key
    setTyped(next)
    typedRef.current = next
  }

  // Live WPM
  const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0
  const liveWpm = elapsed > 1 ? Math.round(((typed.length / 5) / elapsed) * 60) : 0

  function resetTest() {
    setState('config')
    setResult(null)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  if (state === 'config') {
    return (
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm text-green-600">
            {tr ? 'Süre' : 'Duration'}
          </label>
          <div className="flex gap-2">
            {durations.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  duration === d
                    ? 'bg-green-600 text-black'
                    : 'border border-green-900/30 text-green-600 hover:border-green-500/50'
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startTest}
          className="rounded-lg bg-green-600 px-8 py-3 text-sm font-medium text-black transition hover:bg-green-500"
        >
          {tr ? 'Testi Başlat' : 'Start Test'}
        </button>

        {history.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-green-600">
              {tr ? 'Geçmiş Sonuçlar' : 'Previous Results'}
            </h3>
            {history.slice(-5).reverse().map((s, i) => (
              <div key={i} className="flex justify-between rounded-lg bg-green-950/20 px-4 py-2 text-xs text-green-600">
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
        <div className="rounded-xl bg-green-950/20 p-8 text-center">
          <p className="text-5xl font-bold text-green-400">{result.wpm}</p>
          <p className="mt-1 text-sm text-green-700">WPM</p>
          <div className="mt-6 flex justify-center gap-8">
            <div>
              <p className="text-2xl font-semibold text-green-400">{result.accuracy}%</p>
              <p className="text-xs text-green-700">{tr ? 'Doğruluk' : 'Accuracy'}</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-cyan-400">{result.time}s</p>
              <p className="text-xs text-green-700">{tr ? 'Süre' : 'Time'}</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-red-400">{result.incorrect}</p>
              <p className="text-xs text-green-700">{tr ? 'Hata' : 'Errors'}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-3">
          <button
            onClick={startTest}
            className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-black transition hover:bg-green-500"
          >
            {tr ? 'Tekrar Dene' : 'Try Again'}
          </button>
          <button
            onClick={resetTest}
            className="rounded-lg border border-green-900/30 px-6 py-2 text-sm text-green-400 transition hover:border-green-500/50"
          >
            {tr ? 'Ayarlar' : 'Settings'}
          </button>
        </div>
      </div>
    )
  }

  // Playing state — inline timer-based test
  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="space-y-4 outline-none"
    >
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-green-400">
          {liveWpm} <span className="text-xs font-normal">WPM</span>
        </span>
        <span className={`font-mono text-3xl font-bold ${timeLeft <= 5 ? 'text-red-400' : timeLeft <= 10 ? 'text-amber-400' : 'text-green-400'}`}>
          {timeLeft}s
        </span>
        <span className="text-xs text-green-700">
          {errors} {tr ? 'hata' : 'errors'}
        </span>
      </div>

      <div className="h-1 overflow-hidden rounded-full bg-green-900/30">
        <div
          className={`h-full transition-all ${timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-yellow-500' : 'bg-green-500'}`}
          style={{ width: `${(timeLeft / duration) * 100}%` }}
        />
      </div>

      <div className="rounded-lg border border-green-900/30 bg-black p-6 font-mono text-lg leading-relaxed tracking-wide">
        {text.split('').slice(0, Math.max(pos + 200, 300)).map((char, i) => {
          let cls = 'text-green-800'
          if (i < pos) {
            cls = typed[i] === char ? 'text-green-400' : 'text-red-400 underline'
          } else if (i === pos) {
            cls = 'bg-green-500/30 text-green-400 border-b-2 border-green-500'
          }
          return (
            <span key={i} className={cls}>
              {char === ' ' && i === pos ? '\u00A0' : char}
            </span>
          )
        })}
      </div>

      <div className="mt-4">
        <Keyboard layout={layout} activeKey={currentChar} activeFinger={keyDef?.finger} />
      </div>
    </div>
  )
}
