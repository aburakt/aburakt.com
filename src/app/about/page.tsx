import { type Metadata } from 'next'
import Link from 'next/link'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import Portrait from '@/images/pp/logo.webp'
import { GitHubIcon, LinkedInIcon } from '@/components/SocialIcons'
import { AnimatedImage } from '@/components/AnimatedImage'

function SocialLink({
  className,
  href,
  children,
  icon: Icon,
}: {
  className?: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <li className={clsx(className, 'flex')}>
      <Link
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </Link>
    </li>
  )
}

function MailIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M6 5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6Zm.245 2.187a.75.75 0 0 0-.99 1.126l6.25 5.5a.75.75 0 0 0 .99 0l6.25-5.5a.75.75 0 0 0-.99-1.126L12 12.251 6.245 7.187Z"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'About',
  description:
    'I’m Ahmet Burak Tekin, a front-end developer in Ankara building enterprise-scale platforms for Türkiye’s public sector.',
}

export default function About() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
        <div className="lg:pl-20">
          <div className="max-w-xs px-2.5 lg:max-w-none">
            <AnimatedImage
              src={Portrait}
              alt="Ahmet Burak Tekin"
              sizes="(min-width: 1024px) 32rem, 20rem"
              width={1536}
              height={2048}
              className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            />
          </div>
        </div>
        <div className="lg:order-first lg:row-span-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            I’m Ahmet Burak Tekin, a front-end developer helping Türkiye’s
            public sector deliver dependable digital services.
          </h1>
          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <p>
              Based in Ankara, I specialize in architecting React and
              TypeScript applications that power critical government services.
              I led the front-end design of the Ministry of Interior’s
              authorization management system, creating the workflows that keep
              permissions and approvals synchronized across every province.
            </p>
            <p>
              My day-to-day involves mentoring a team of four developers while
              collaborating closely with Java Spring Boot teams to deliver
              secure, well-tested integrations. I maintain the organization’s
              authentication gateway built on JWT and OAuth, and keep a
              nationwide analytics platform running smoothly for stakeholders in
              all 81 provinces.
            </p>
            <p>
              Beyond authorization and analytics, I launch new internal tools —
              from data query applications that unlock reporting across
              directorates to bespoke photo processing workflows and visitor
              management dashboards. Each project is an opportunity to embed
              modern front-end practices into institutions that millions rely on
              daily.
            </p>
            <p>
              Earlier in my career at EBS Computer Systems &amp; IT I built
              responsive interfaces, WordPress sites, and SQL reports that
              served complex accounting workflows. My internships at public and
              private organizations gave me firsthand insight into enterprise
              software delivery, shaping how I approach large-scale projects
              today.
            </p>
            <p>
              I stay curious through community work with JCI Ankara and JCI
              Europe, where I’ve served on growth, digital platforms, and
              outreach teams — most recently as Secretary General and a
              Development Council Officer. Giving back keeps me learning and
              ensures the solutions I design stay grounded in real human needs.
            </p>
            <p>
              Curious about the full story? You can <Link href="/cv" className="font-semibold text-teal-600 transition hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300">view my CV here</Link> to dive into projects, certifications, and community work at a glance.
            </p>
          </div>
        </div>
        <div className="lg:pl-20">
          <ul role="list">
            <SocialLink href="https://github.com/aburakt" icon={GitHubIcon}>
              GitHub
            </SocialLink>
            <SocialLink
              href="https://www.linkedin.com/in/aburakt"
              icon={LinkedInIcon}
              className="mt-4"
            >
              LinkedIn
            </SocialLink>
            <SocialLink
              href="mailto:info@aburakt.com"
              icon={MailIcon}
              className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
            >
              info@aburakt.com
            </SocialLink>
          </ul>
        </div>
      </div>
    </Container>
  )
}
