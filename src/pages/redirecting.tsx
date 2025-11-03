import { useEffect } from 'react'
import { Container } from '@/components/Container'

interface RedirectingProps {
  url: string
  delay?: number
}

export default function Redirecting({ url, delay = 1500 }: RedirectingProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = url
    }, delay)

    return () => clearTimeout(timer)
  }, [url, delay])

  return (
    <Container className="mt-16 sm:mt-32">
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-8">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-zinc-200 dark:border-zinc-800"></div>
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-teal-500"></div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-800 sm:text-3xl dark:text-zinc-100">
              Redirecting...
            </h1>
            <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
              You will be redirected shortly
            </p>
          </div>
        </div>
      </div>
    </Container>
  )
}
