import { useState, useEffect, useRef } from 'react'
import { saveTypingStat } from '../../useAuth'
import { useVimSuspend } from '../../useVimSuspend'

interface Props {
  locale: string
}

const enWords = [
  'function', 'return', 'const', 'import', 'export', 'default', 'class',
  'interface', 'string', 'number', 'boolean', 'object', 'array', 'promise',
  'async', 'await', 'throw', 'catch', 'finally', 'while', 'break', 'switch',
  'component', 'render', 'state', 'effect', 'props', 'context', 'reducer',
  'dispatch', 'action', 'payload', 'middleware', 'selector', 'callback',
  'typescript', 'javascript', 'react', 'angular', 'express', 'server',
]

const trWords = [
  'fonksiyon', 'döndür', 'sabit', 'içeaktar', 'dışaaktar', 'varsayılan',
  'arayüz', 'metin', 'sayı', 'mantıksal', 'nesne', 'dizi', 'sözveri',
  'eşzamansız', 'bekle', 'fırlat', 'yakala', 'sonunda', 'döngü', 'kır',
  'bileşen', 'çiz', 'durum', 'etki', 'özellik', 'bağlam', 'indirgeyici',
  'gönder', 'eylem', 'yük', 'aracı', 'seçici', 'geriçağırma',
  'programlama', 'geliştirme', 'sunucu', 'istemci', 'veritabanı', 'sorgu',
]

const DURATION = 30

export default function TypeSprint({ locale }: Props) {
  const tr = locale === 'tr'
  const pool = tr ? trWords : enWords

  const [state, setState] = useState<'idle' | 'playing' | 'done'>('idle')
  useVimSuspend(state === 'playing')
  const [currentWord, setCurrentWord] = useState('')
  const [input, setInput] = useState('')
  const [wordsTyped, setWordsTyped] = useState(0)
  const [errors, setErrors] = useState(0)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [wordQueue, setWordQueue] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  function generateQueue(): string[] {
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 20)
  }

  function nextWord(queue: string[]) {
    if (queue.length === 0) {
      const newQueue = generateQueue()
      setWordQueue(newQueue.slice(1))
      setCurrentWord(newQueue[0])
    } else {
      setCurrentWord(queue[0])
      setWordQueue(queue.slice(1))
    }
  }

  function startGame() {
    const queue = generateQueue()
    setCurrentWord(queue[0])
    setWordQueue(queue.slice(1))
    setInput('')
    setWordsTyped(0)
    setErrors(0)
    setTimeLeft(DURATION)
    setState('playing')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  useEffect(() => {
    if (state !== 'playing') return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setState('done')
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [state])

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value

    if (val.endsWith(' ') || val.endsWith('\n')) {
      const trimmed = val.trim()
      if (trimmed === currentWord) {
        setWordsTyped((w) => w + 1)
      } else {
        setErrors((err) => err + 1)
      }
      setInput('')
      nextWord(wordQueue)
      return
    }

    setInput(val)
  }

  const wpm = Math.round((wordsTyped / (DURATION - timeLeft || 1)) * 60)
  const accuracy = wordsTyped > 0 ? Math.round((wordsTyped / (wordsTyped + errors)) * 100) : 0

  // Save stat when game ends
  useEffect(() => {
    if (state === 'done') {
      const layout = tr ? 'tr' : 'en'
      saveTypingStat({ mode: 'game', wpm, accuracy, duration_s: DURATION, layout })
    }
  }, [state])

  return (
    <div className="rounded-xl border border-green-900/30 bg-green-950/20 p-6">
      <h3 className="text-lg font-semibold text-green-400">🏃 Type Sprint</h3>
      <p className="mt-1 text-sm text-green-600">
        {tr
          ? `${DURATION} saniyede mümkün olduğunca çok kelime yazın. Boşluk ile onaylayın.`
          : `Type as many words as you can in ${DURATION} seconds. Press space to submit.`}
      </p>

      {state === 'idle' && (
        <button
          onClick={startGame}
          className="mt-4 rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-black transition hover:bg-green-500"
        >
          {tr ? 'Başla' : 'Start'}
        </button>
      )}

      {state === 'playing' && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-400">{timeLeft}s</span>
            <span className="text-sm text-green-700">
              {wordsTyped} {tr ? 'kelime' : 'words'} · {errors} {tr ? 'hata' : 'errors'}
            </span>
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-green-900/30">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${(timeLeft / DURATION) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-center gap-3 py-6">
            <span className="font-mono text-sm text-green-800">
              {wordQueue.length > 0 ? wordQueue[wordQueue.length - 1] : ''}
            </span>
            <div className="rounded-lg bg-black px-6 py-4 text-center">
              <p className="font-mono text-2xl font-bold text-green-400">
                {currentWord.split('').map((char, i) => {
                  let cls = 'text-green-400'
                  if (i < input.length) {
                    cls = input[i] === char ? 'text-green-400' : 'text-red-400'
                  }
                  return <span key={i} className={cls}>{char}</span>
                })}
              </p>
            </div>
            <span className="font-mono text-sm text-green-800">
              {wordQueue.length > 1 ? wordQueue[0] : ''}
            </span>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInput}
            className="w-full rounded-lg border border-green-900/30 bg-black px-4 py-2 text-center font-mono text-lg text-green-400 outline-none focus:border-green-500"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
      )}

      {state === 'done' && (
        <div className="mt-4 space-y-4 text-center">
          <div className="rounded-lg bg-green-500/10 p-6">
            <p className="text-4xl font-bold text-green-400">{wordsTyped}</p>
            <p className="text-sm text-green-700">{tr ? 'kelime' : 'words'}</p>
            <div className="mt-4 flex justify-center gap-6">
              <div>
                <p className="text-xl font-semibold text-green-400">{wpm}</p>
                <p className="text-xs text-green-700">WPM</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-red-400">{errors}</p>
                <p className="text-xs text-green-700">{tr ? 'Hata' : 'Errors'}</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-cyan-400">
                  {wordsTyped > 0 ? Math.round((wordsTyped / (wordsTyped + errors)) * 100) : 0}%
                </p>
                <p className="text-xs text-green-700">{tr ? 'Doğruluk' : 'Accuracy'}</p>
              </div>
            </div>
          </div>
          <button
            onClick={startGame}
            className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-black transition hover:bg-green-500"
          >
            {tr ? 'Tekrar Oyna' : 'Play Again'}
          </button>
        </div>
      )}
    </div>
  )
}
