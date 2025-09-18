import { type Metadata } from 'next'
import Link from 'next/link'

import { Container } from '@/components/Container'

const CV_PATH = '/cv/Ahmet_Burak_Tekin_CV.pdf'

export const metadata: Metadata = {
  title: 'CV',
  description: 'View and download Ahmet Burak Tekin’s resume.',
}

export default function Cv() {
  return (
    <Container className="mt-16 flex flex-col items-center sm:mt-24">
      <div className="w-full max-w-3xl text-center mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-800 sm:text-4xl dark:text-zinc-100">
          Ahmet Burak Tekin · CV
        </h1>
        <p className="mt-4 text-base text-zinc-600 text-center dark:text-zinc-400">
          Download the latest PDF or browse the embedded preview below. This
          private link is ideal for sharing with collaborators or recruiters.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={CV_PATH}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 justify-center rounded-md bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600"
          >
            Download PDF
          </Link>
          <Link
            href="mailto:info@aburakt.com"
            className="inline-flex items-center gap-2 justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-600 dark:text-zinc-200 dark:hover:border-zinc-500"
          >
            Contact me
          </Link>
        </div>
      </div>
      <div className="mt-10 aspect-[1/1.414] w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-200 shadow-lg dark:border-zinc-700 dark:bg-zinc-900 mx-auto">
        <iframe
          src={`${CV_PATH}#view=FitH`}
          title="Ahmet Burak Tekin CV"
          className="h-full w-full"
        />
      </div>
    </Container>
  )
}
