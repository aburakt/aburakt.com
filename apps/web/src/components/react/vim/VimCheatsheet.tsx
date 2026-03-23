import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import { cheatsheetData, categories, type VimEntry, type Category } from './cheatsheetData'

interface Props {
  locale: string
}

const levelLabels = {
  beginner: { en: 'Beginner', tr: 'Başlangıç' },
  intermediate: { en: 'Intermediate', tr: 'Orta' },
  advanced: { en: 'Advanced', tr: 'İleri' },
}

const levelColors = {
  beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function VimCheatsheet({ locale }: Props) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all')
  const [activeLevel, setActiveLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')

  const fuse = useMemo(
    () =>
      new Fuse(cheatsheetData, {
        keys: ['key', 'description', 'descriptionTr', 'example', 'why', 'whyTr'],
        threshold: 0.3,
      }),
    []
  )

  const filtered = useMemo(() => {
    let items: VimEntry[]
    if (query.trim()) {
      items = fuse.search(query).map((r) => r.item)
    } else {
      items = cheatsheetData
    }
    if (activeCategory !== 'all') {
      items = items.filter((e) => e.category === activeCategory)
    }
    if (activeLevel !== 'all') {
      items = items.filter((e) => e.level === activeLevel)
    }
    return items
  }, [query, activeCategory, activeLevel, fuse])

  const grouped = useMemo(() => {
    const map = new Map<string, VimEntry[]>()
    for (const entry of filtered) {
      const group = map.get(entry.category) || []
      group.push(entry)
      map.set(entry.category, group)
    }
    return map
  }, [filtered])

  const tr = locale === 'tr'

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tr ? 'Komut veya açıklama ara...' : 'Search commands or descriptions...'}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div className="text-xs text-zinc-500">
          {filtered.length} {tr ? 'sonuç' : 'results'}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
            activeCategory === 'all'
              ? 'border-primary-500 bg-primary-500/10 text-primary-400'
              : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
          }`}
        >
          {tr ? 'Tümü' : 'All'}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat === activeCategory ? 'all' : cat)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              activeCategory === cat
                ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
          <button
            key={lvl}
            onClick={() => setActiveLevel(lvl)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              activeLevel === lvl
                ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
            }`}
          >
            {lvl === 'all' ? (tr ? 'Tüm Seviyeler' : 'All Levels') : levelLabels[lvl][locale as 'en' | 'tr']}
          </button>
        ))}
      </div>

      {/* Results */}
      {Array.from(grouped.entries()).map(([category, entries]) => (
        <div key={category}>
          <h2 className="mb-4 text-lg font-semibold text-zinc-100">{category}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <div
                key={entry.key + entry.category}
                className="rounded-xl border border-zinc-700/50 bg-zinc-800/50 p-4 transition hover:border-zinc-600"
              >
                <div className="flex items-start justify-between gap-2">
                  <kbd className="rounded bg-zinc-700 px-2 py-0.5 font-mono text-sm text-primary-400">
                    {entry.key}
                  </kbd>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${levelColors[entry.level]}`}>
                    {levelLabels[entry.level][locale as 'en' | 'tr']}
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-300">
                  {tr ? entry.descriptionTr : entry.description}
                </p>
                {entry.example && (
                  <p className="mt-1 font-mono text-xs text-zinc-500">{entry.example}</p>
                )}
                {(entry.why || entry.whyTr) && (
                  <p className="mt-1 text-xs text-primary-400/70">
                    💡 {tr ? entry.whyTr : entry.why}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="py-12 text-center text-zinc-500">
          {tr ? 'Sonuç bulunamadı. Farklı bir arama deneyin.' : 'No results found. Try a different search.'}
        </div>
      )}
    </div>
  )
}
