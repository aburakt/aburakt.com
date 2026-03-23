import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Fuse from 'fuse.js'

interface Props {
  locale: string
}

interface SearchItem {
  title: string
  href?: string
  action?: string
  category: string
  badge?: string
}

function getSearchItems(locale: string): SearchItem[] {
  const prefix = locale === 'en' ? '/en' : ''
  const tr = locale === 'tr'
  return [
    // Navigation
    { title: tr ? 'Ana Sayfa' : 'Home', href: `${prefix}/`, category: tr ? 'Sayfalar' : 'Pages', badge: 'nav' },
    { title: tr ? 'Hakkımda' : 'About', href: `${prefix}/about`, category: tr ? 'Sayfalar' : 'Pages', badge: 'nav' },
    { title: 'CV', href: `${prefix}/cv`, category: tr ? 'Sayfalar' : 'Pages', badge: 'nav' },
    { title: 'Lab', href: `${prefix}/lab`, category: tr ? 'Sayfalar' : 'Pages', badge: 'nav' },
    { title: tr ? 'İstatistikler' : 'Stats', href: `${prefix}/lab/stats`, category: tr ? 'Sayfalar' : 'Pages', badge: 'nav' },
    { title: tr ? 'Makaleler' : 'Articles', href: `${prefix}/articles`, category: tr ? 'Sayfalar' : 'Pages', badge: 'nav' },
    // Vim
    { title: 'Vim Cheatsheet', href: `${prefix}/lab/vim/motions`, category: 'Vim', badge: 'vim' },
    { title: tr ? 'Vim Alıştırmalar' : 'Vim Exercises', href: `${prefix}/lab/vim/practice`, category: 'Vim', badge: 'vim' },
    { title: tr ? 'Vim Oyunları' : 'Vim Games', href: `${prefix}/lab/vim/games`, category: 'Vim', badge: 'vim' },
    // Typing
    { title: tr ? 'Yazma Dersleri' : 'Typing Lessons', href: `${prefix}/lab/typing/lessons`, category: 'Typing', badge: 'typing' },
    { title: tr ? 'Yazma Testi' : 'Typing Test', href: `${prefix}/lab/typing/test`, category: 'Typing', badge: 'typing' },
    { title: tr ? 'Hız Yarışı' : 'Speed Challenge', href: `${prefix}/lab/typing/speed`, category: 'Typing', badge: 'typing' },
    { title: tr ? 'Yazma Oyunları' : 'Typing Games', href: `${prefix}/lab/typing/games`, category: 'Typing', badge: 'typing' },
    // Commands
    { title: tr ? 'Dil Değiştir' : 'Switch Language', action: 'vim:lang', category: tr ? 'Komutlar' : 'Commands', badge: 'cmd' },
    { title: tr ? 'Kısayollar' : 'Shortcuts', action: 'vim:cheatsheet', category: tr ? 'Komutlar' : 'Commands', badge: 'cmd' },
    // Links
    { title: 'GitHub', href: 'https://github.com/aburakt', category: tr ? 'Bağlantılar' : 'Links', badge: 'link' },
    { title: 'LinkedIn', href: 'https://www.linkedin.com/in/aburakt', category: tr ? 'Bağlantılar' : 'Links', badge: 'link' },
  ]
}

export default function SearchModal({ locale }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const items = useMemo(() => getSearchItems(locale), [locale])
  const fuse = useMemo(
    () => new Fuse(items, { keys: ['title', 'category', 'badge'], threshold: 0.4 }),
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
      if (item.action) {
        if (item.action === 'vim:lang') {
          window.location.href = locale === 'en' ? '/' : '/en/'
        } else {
          document.dispatchEvent(new CustomEvent(item.action))
        }
      } else if (item.href?.startsWith('http')) {
        window.open(item.href, '_blank')
      } else if (item.href) {
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
        className="mx-4 w-full max-w-lg rounded-xl border border-green-900/30 bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-green-900/30 px-4">
          <span className="text-green-500 text-sm font-bold">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder={locale === 'tr' ? 'Komut yazın...' : 'Type a command...'}
            className="w-full bg-transparent px-3 py-3 text-sm text-green-400 placeholder-green-700 outline-none"
          />
          <kbd className="rounded bg-green-950/20 px-1.5 py-0.5 text-xs text-green-700">Esc</kbd>
        </div>
        <div className="max-h-64 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-green-700">
              {locale === 'tr' ? 'Sonuç bulunamadı' : 'No results found'}
            </p>
          ) : (
            results.map((item, i) => (
              <div
                key={item.title + (item.href || item.action || '')}
                role="button"
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition cursor-pointer ${
                  i === selectedIndex
                    ? 'bg-green-500/10 text-green-400'
                    : 'text-green-400 hover:bg-green-950/20'
                }`}
                onClick={() => {
                  if (item.action) {
                    if (item.action === 'vim:lang') {
                      window.location.href = locale === 'en' ? '/' : '/en/'
                    } else {
                      document.dispatchEvent(new CustomEvent(item.action))
                    }
                  } else if (item.href?.startsWith('http')) {
                    window.open(item.href, '_blank')
                  } else if (item.href) {
                    window.location.href = item.href
                  }
                  setOpen(false)
                }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <div className="flex items-center gap-2">
                  <span className="rounded bg-green-950/30 px-1.5 py-0.5 text-xs text-green-600 font-mono">{item.badge}</span>
                  <span>{item.title}</span>
                </div>
                <span className="text-xs text-green-700">{item.category}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
