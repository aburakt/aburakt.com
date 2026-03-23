import tr from './tr.json'
import en from './en.json'

const translations = { tr, en } as const

export type Locale = keyof typeof translations
export type TranslationKey = string

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return path
    }
    current = (current as Record<string, unknown>)[key]
  }
  return typeof current === 'string' ? current : path
}

export function getLocaleFromUrl(url: URL): Locale {
  const pathname = url.pathname
  if (pathname.startsWith('/en/') || pathname === '/en') {
    return 'en'
  }
  return 'tr'
}

export function t(locale: Locale, key: string): string {
  return getNestedValue(translations[locale] as unknown as Record<string, unknown>, key)
}

export function getLocalePath(locale: Locale, path: string): string {
  if (locale === 'tr') {
    return path
  }
  return `/en${path === '/' ? '/' : path}`
}
