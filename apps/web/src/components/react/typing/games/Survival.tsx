import { useState, useEffect, useRef, useCallback } from 'react'

interface Props {
  locale: string
}

const enWords = [
  'a', 'I', 'to', 'the', 'and', 'is', 'in', 'it', 'of', 'for',
  'on', 'you', 'do', 'my', 'we', 'go', 'no', 'up', 'if', 'so',
  'be', 'he', 'me', 'or', 'an', 'at', 'as', 'by', 'us', 'am',
  'code', 'type', 'fast', 'key', 'word', 'test', 'run', 'app', 'web',
  'dev', 'bug', 'fix', 'log', 'git', 'api', 'css', 'dom', 'map',
  'node', 'loop', 'data', 'file', 'port', 'link', 'push', 'pull',
  'react', 'state', 'async', 'fetch', 'build', 'clean', 'start',
  'component', 'function', 'variable', 'interface', 'typescript',
  'development', 'programming', 'application', 'performance',
]

const trWords = [
  'a', 'o', 'bu', 'ne', 've', 'de', 'da', 'mi', 'ki', 'ya',
  'bir', 'var', 'yok', 'ben', 'sen', 'biz', 'siz', 'iyi', 'çok',
  'kod', 'hız', 'tuş', 'yaz', 'oku', 'sil', 'bul', 'çiz', 'aç',
  'dosya', 'veri', 'sayfa', 'ekran', 'satır', 'dizin', 'değer',
  'başla', 'bitir', 'kaydet', 'temiz', 'hızlı', 'kolay', 'doğru',
  'fonksiyon', 'değişken', 'arayüz', 'bileşen', 'geliştirme',
  'programlama', 'uygulama', 'performans', 'veritabanı',
]

export default function Survival({ locale }: Props) {
  const tr = locale === 'tr'
  const pool = tr ? trWords : enWords

  const [state, setState] = useState<'idle' | 'playing' | 'done'>('idle')
  const [currentWord, setCurrentWord] = useState('')
  const [input, setInput] = useState('')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [timeLeft, setTimeLeft] = useState(5000) // ms
  const [maxTime, setMaxTime] = useState(5000)
  const [streak, setStreak] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval>>()
  const startTimeRef = useRef(0)

  const getWordForLevel = useCallback((lvl: number) => {
    // As score increases, pick longer words
    let filtered: string[]
    if (lvl < 5) {
      filtered = pool.filter((w) => w.length <= 3)
    } else if (lvl < 15) {
      filtered = pool.filter((w) => w.length <= 5)
    } else if (lvl < 30) {
      filtered = pool.filter((w) => w.length <= 8)
    } else {
      filtered = pool
    }
    if (filtered.length === 0) filtered = pool
    return filtered[Math.floor(Math.random() * filtered.length)]
  }, [pool])

  const nextRound = useCallback((currentScore: number) => {
    const word = getWordForLevel(currentScore)
    setCurrentWord(word)
    setInput('')
    // Decrease time as score increases, min 1500ms
    const newMax = Math.max(5000 - currentScore * 100, 1500)
    setMaxTime(newMax)
    setTimeLeft(newMax)
    startTimeRef.current = Date.now()
  }, [getWordForLevel])

  function startGame() {
    setScore(0)
    setLives(3)
    setStreak(0)
    setState('playing')
    nextRound(0)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  useEffect(() => {
    if (state !== 'playing') return
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const remaining = maxTime - elapsed
      if (remaining <= 0) {
        setLives((l) => {
          const newLives = l - 1
          if (newLives <= 0) {
            setState('done')
            return 0
          }
          return newLives
        })
        setStreak(0)
        setScore((s) => {
          nextRound(s)
          return s
        })
      } else {
        setTimeLeft(remaining)
      }
    }, 50)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [state, maxTime, nextRound])

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value

    if (val.endsWith(' ') || val.endsWith('\n')) {
      const trimmed = val.trim()
      if (trimmed === currentWord) {
        const newScore = score + 1
        setScore(newScore)
        setStreak((s) => s + 1)
        nextRound(newScore)
      } else {
        setLives((l) => {
          const newLives = l - 1
          if (newLives <= 0) {
            setState('done')
            return 0
          }
          return newLives
        })
        setStreak(0)
        setInput('')
      }
      return
    }
    setInput(val)
  }

  const timePercent = (timeLeft / maxTime) * 100
  const timeColor = timePercent > 50 ? 'bg-green-500' : timePercent > 25 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <div className="rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-6">
      <h3 className="text-lg font-semibold text-zinc-100">💀 Survival</h3>
      <p className="mt-1 text-sm text-zinc-400">
        {tr
          ? 'Her kelimeyi süre dolmadan yazın. Zorluk giderek artar. 3 can hakkınız var.'
          : 'Type each word before time runs out. Difficulty increases. You have 3 lives.'}
      </p>

      {state === 'idle' && (
        <button
          onClick={startGame}
          className="mt-4 rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-primary-500"
        >
          {tr ? 'Başla' : 'Start'}
        </button>
      )}

      {state === 'playing' && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>{tr ? 'Skor' : 'Score'}: <span className="text-primary-400 font-bold">{score}</span></span>
            <span>{tr ? 'Seri' : 'Streak'}: <span className="text-yellow-400">{streak}</span></span>
            <span className="text-lg">{'❤️'.repeat(lives)}</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-zinc-700">
            <div
              className={`h-full transition-all duration-100 ${timeColor}`}
              style={{ width: `${timePercent}%` }}
            />
          </div>

          <div className="rounded-lg bg-zinc-900 px-6 py-8 text-center">
            <p className="font-mono text-3xl font-bold text-zinc-100">
              {currentWord.split('').map((char, i) => {
                let cls = 'text-zinc-100'
                if (i < input.length) {
                  cls = input[i] === char ? 'text-green-400' : 'text-red-400'
                }
                return <span key={i} className={cls}>{char}</span>
              })}
            </p>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInput}
            className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2 text-center font-mono text-lg text-zinc-100 outline-none focus:border-primary-500"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
      )}

      {state === 'done' && (
        <div className="mt-4 space-y-4 text-center">
          <div className="rounded-lg bg-primary-500/10 p-6">
            <p className="text-4xl font-bold text-primary-400">{score}</p>
            <p className="text-sm text-zinc-500">{tr ? 'kelime' : 'words'}</p>
          </div>
          <button
            onClick={startGame}
            className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-primary-500"
          >
            {tr ? 'Tekrar Oyna' : 'Play Again'}
          </button>
        </div>
      )}
    </div>
  )
}
