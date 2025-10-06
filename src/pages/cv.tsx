import { Link } from 'react-router-dom'

import { Container } from '@/components/Container'

const CV_FILE = 'Ahmet_Burak_Tekin_CV.v2025-09.pdf'
const CV_PATH = `/cv/${CV_FILE}`
const CV_DOWNLOAD = '/cv/download'

function DownloadIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 11.25 12 15.75l4.5-4.5M12 3v12.75" />
    </svg>
  )
}

function EnvelopeIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 7.5v9A2.25 2.25 0 0 1 19.5 18.75h-15A2.25 2.25 0 0 1 2.25 16.5v-9A2.25 2.25 0 0 1 4.5 5.25h15A2.25 2.25 0 0 1 21.75 7.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 12 13.5 21 7.5" />
    </svg>
  )
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
            to={CV_DOWNLOAD}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 justify-center rounded-md bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600"
          >
            <DownloadIcon className="h-4 w-4" />
            Download PDF
          </Link>
          <Link
            to="mailto:info@aburakt.com"
            className="inline-flex items-center gap-2 justify-center rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-600 dark:text-zinc-200 dark:hover:border-zinc-500"
          >
            <EnvelopeIcon className="h-4 w-4" />
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
