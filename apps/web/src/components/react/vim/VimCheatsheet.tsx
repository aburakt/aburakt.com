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
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tr ? 'Komut veya açıklama ara...' : 'Search commands or descriptions...'}
            className="w-full rounded-lg border border-green-900/30 bg-green-950/20 py-2 pl-10 pr-4 text-sm text-green-400 placeholder-green-700 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
        </div>
        <div className="text-xs text-green-700">
          {filtered.length} {tr ? 'sonuç' : 'results'}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
            activeCategory === 'all'
              ? 'border-green-500 bg-green-500/10 text-green-400'
              : 'border-green-900/30 text-green-600 hover:border-green-500/50'
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
                ? 'border-green-500 bg-green-500/10 text-green-400'
                : 'border-green-900/30 text-green-600 hover:border-green-500/50'
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
                ? 'border-green-500 bg-green-500/10 text-green-400'
                : 'border-green-900/30 text-green-600 hover:border-green-500/50'
            }`}
          >
            {lvl === 'all' ? (tr ? 'Tüm Seviyeler' : 'All Levels') : levelLabels[lvl][locale as 'en' | 'tr']}
          </button>
        ))}
      </div>

      {/* Results */}
      {Array.from(grouped.entries()).map(([category, entries]) => (
        <div key={category}>
          <h2 className="mb-4 text-lg font-semibold text-green-400">{category}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <div
                key={entry.key + entry.category}
                className="rounded-xl border border-green-900/30 bg-green-950/20 p-4 transition hover:border-green-500/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <kbd className="rounded bg-green-900/30 px-2 py-0.5 font-mono text-sm text-green-400">
                    {entry.key}
                  </kbd>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${levelColors[entry.level]}`}>
                    {levelLabels[entry.level][locale as 'en' | 'tr']}
                  </span>
                </div>
                <p className="mt-2 text-sm text-green-400">
                  {tr ? entry.descriptionTr : entry.description}
                </p>
                {entry.example && (
                  <p className="mt-1 font-mono text-xs text-green-700">{entry.example}</p>
                )}
                {(entry.why || entry.whyTr) && (
                  <p className="mt-1 text-xs text-green-400/70 flex items-start gap-1">
                    <svg className="h-3.5 w-3.5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>
                    {tr ? entry.whyTr : entry.why}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="py-12 text-center text-green-700">
          {tr ? 'Sonuç bulunamadı. Farklı bir arama deneyin.' : 'No results found. Try a different search.'}
        </div>
      )}
    </div>
  )
}
