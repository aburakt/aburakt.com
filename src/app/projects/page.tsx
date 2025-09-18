import { type Metadata } from 'next'
import type {
  ComponentPropsWithoutRef,
  ComponentType,
} from 'react'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'

function ShieldIcon(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 3 4.5 6v6c0 4.97 3.285 8.815 7.5 9 4.215-.185 7.5-4.03 7.5-9V6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m9.5 12 1.75 1.75L14.5 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function KeyIcon(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M14.5 5.5a4.5 4.5 0 1 0 1.414 8.776L17.5 15h2v2h2v2h-4.5l-2.036-2.036A4.5 4.5 0 0 0 14.5 5.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 8.5a1.5 1.5 0 1 1 0 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChartIcon(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 20h14M7 16V9m5 7V8m5 8V6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DataIcon(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <ellipse
        cx="12"
        cy="6"
        rx="7"
        ry="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5 6v6c0 1.657 3.134 3 7 3s7-1.343 7-3V6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5 12v6c0 1.657 3.134 3 7 3s7-1.343 7-3v-6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function BuildingIcon(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 21V5l7-3 7 3v16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 21v-6h6v6M9 9.5h.01M12 9.5h.01M15 9.5h.01M9 13h.01M12 13h.01M15 13h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type ProjectIcon = ComponentType<ComponentPropsWithoutRef<'svg'>>

const projects: Array<{
  name: string
  description: string
  link: { href: string; label: string }
  icon: ProjectIcon
}> = [
  {
    name: 'Authorization Management Platform',
    description:
      'React and TypeScript architecture powering nationwide permission requests, approvals, and reporting for the Ministry of Interior.',
    link: {
      href: 'mailto:info@aburakt.com?subject=Authorization%20Platform%20Overview',
      label: 'Request an overview',
    },
    icon: ShieldIcon,
  },
  {
    name: 'Secure Access Gateway',
    description:
      'Organization-wide authentication layer managed with JWT and OAuth, distributing trusted tokens to every internal application.',
    link: {
      href: 'mailto:info@aburakt.com?subject=Secure%20Access%20Gateway',
      label: 'info@aburakt.com',
    },
    icon: KeyIcon,
  },
  {
    name: 'Nationwide Analytics Hub',
    description:
      'Centralized analytics platform serving 81 provinces with high-availability dashboards, proactive monitoring, and performance tuning.',
    link: {
      href: 'mailto:info@aburakt.com?subject=Analytics%20Hub%20Case%20Study',
      label: 'Request the case study',
    },
    icon: ChartIcon,
  },
  {
    name: 'Data Insights Workspace',
    description:
      'Interactive querying environment delivering complex reporting and visualization workflows through a bespoke React interface.',
    link: {
      href: 'mailto:info@aburakt.com?subject=Data%20Insights%20Workspace',
      label: 'Discuss the tooling',
    },
    icon: DataIcon,
  },
  {
    name: 'Visitor & Facility Suite',
    description:
      'Integrated visitor management, accommodation, and procurement tools designed to modernize daily operations across internal teams.',
    link: {
      href: 'mailto:info@aburakt.com?subject=Visitor%20and%20Facility%20Suite',
      label: 'Learn about the suite',
    },
    icon: BuildingIcon,
  },
]

function LinkIcon(props: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm-4.95 1.768a.75.75 0 0 0 1.06-1.06l-1.06 1.06Zm-2.475-1.414a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm4.95-1.768a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.359.53-.884.884 1.06 1.06.885-.883-1.061-1.06Zm-4.95-2.12 1.414-1.415L12 6.344l-1.415 1.413 1.061 1.061Zm0 3.535a2.5 2.5 0 0 1 0-3.536l-1.06-1.06a4 4 0 0 0 0 5.656l1.06-1.06Zm4.95-4.95a2.5 2.5 0 0 1 0 3.535L17.656 12a4 4 0 0 0 0-5.657l-1.06 1.06Zm1.06-1.06a4 4 0 0 0-5.656 0l1.06 1.06a2.5 2.5 0 0 1 3.536 0l1.06-1.06Zm-7.07 7.07.176.177 1.06-1.06-.176-.177-1.06 1.06Zm-3.183-.353.884-.884-1.06-1.06-.884.883 1.06 1.06Zm4.95 2.121-1.414 1.414 1.06 1.06 1.415-1.413-1.06-1.061Zm0-3.536a2.5 2.5 0 0 1 0 3.536l1.06 1.06a4 4 0 0 0 0-5.656l-1.06 1.06Zm-4.95 4.95a2.5 2.5 0 0 1 0-3.535L6.344 12a4 4 0 0 0 0 5.656l1.06-1.06Zm-1.06 1.06a4 4 0 0 0 5.657 0l-1.061-1.06a2.5 2.5 0 0 1-3.535 0l-1.061 1.06Zm7.07-7.07-.176-.177-1.06 1.06.176.178 1.06-1.061Z"
        fill="currentColor"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Enterprise-scale front-end platforms designed for the Ministry of Interior and nationwide stakeholders.',
}

export default function Projects() {
  return (
    <SimpleLayout
      title="Designing front-end systems that keep public services running."
      intro="These initiatives span authorization, security, analytics, and day-to-day operations across Türkiye’s Ministry of Interior. Each project blends modern React tooling with enterprise governance to deliver resilient outcomes for nationwide teams."
    >
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => {
          let Icon = project.icon

          return (
            <Card as="li" key={project.name}>
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white text-teal-600 shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:text-teal-400 dark:ring-0">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
                <Card.Link href={project.link.href}>{project.name}</Card.Link>
              </h2>
              <Card.Description>{project.description}</Card.Description>
              <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
                <LinkIcon className="h-6 w-6 flex-none" />
                <span className="ml-2">{project.link.label}</span>
              </p>
            </Card>
          )
        })}
      </ul>
    </SimpleLayout>
  )
}
