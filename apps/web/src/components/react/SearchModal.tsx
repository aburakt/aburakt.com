import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Fuse from 'fuse.js'

interface Props {
  locale: string
}

interface SearchItem {
  title: string
  href: string
  category: string
}

function getSearchItems(locale: string): SearchItem[] {
  const prefix = locale === 'en' ? '/en' : ''
  return [
    { title: locale === 'tr' ? 'Ana Sayfa' : 'Home', href: `${prefix}/`, category: locale === 'tr' ? 'Sayfalar' : 'Pages' },
    { title: locale === 'tr' ? 'Hakkımda' : 'About', href: `${prefix}/about`, category: locale === 'tr' ? 'Sayfalar' : 'Pages' },
    { title: 'CV', href: `${prefix}/cv`, category: locale === 'tr' ? 'Sayfalar' : 'Pages' },
    { title: 'Playground', href: `${prefix}/playground`, category: locale === 'tr' ? 'Sayfalar' : 'Pages' },
    { title: 'GitHub', href: 'https://github.com/aburakt', category: locale === 'tr' ? 'Bağlantılar' : 'Links' },
    { title: 'LinkedIn', href: 'https://www.linkedin.com/in/aburakt', category: locale === 'tr' ? 'Bağlantılar' : 'Links' },
  ]
}

export default function SearchModal({ locale }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const items = useMemo(() => getSearchItems(locale), [locale])
  const fuse = useMemo(
    () => new Fuse(items, { keys: ['title', 'category'], threshold: 0.4 }),
    [items]
  )

  const results = query.trim()
    ? fuse.search(query).map((r) => r.item)
    : items

  const toggle = useCallback(() => {
    setOpen((prev) => {
      if (!prev) {
        setQuery('')
        setSelectedIndex(0)
      }
      return !prev
    })
  }, [])

  useEffect(() => {
    function handler() {
      toggle()
    }
    document.addEventListener('vim:search', handler)
    return () => document.removeEventListener('vim:search', handler)
  }, [toggle])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      const item = results[selectedIndex]
      if (item.href.startsWith('http')) {
        window.open(item.href, '_blank')
      } else {
        window.location.href = item.href
      }
      setOpen(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="mx-4 w-full max-w-lg rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-zinc-700 px-4">
          <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder={locale === 'tr' ? 'Ara...' : 'Search...'}
            className="w-full bg-transparent px-3 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none"
          />
          <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-500">Esc</kbd>
        </div>
        <div className="max-h-64 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-zinc-500">
              {locale === 'tr' ? 'Sonuç bulunamadı' : 'No results found'}
            </p>
          ) : (
            results.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                  i === selectedIndex
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-zinc-300 hover:bg-zinc-800'
                }`}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <span>{item.title}</span>
                <span className="text-xs text-zinc-500">{item.category}</span>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
