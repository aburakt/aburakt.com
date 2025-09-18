import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function ToolsSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  )
}

function Tool({
  title,
  href,
  children,
}: {
  title: string
  href?: string
  children: React.ReactNode
}) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  )
}

export const metadata = {
  title: 'Uses',
  description:
    'The frameworks, libraries, and tooling I rely on to deliver enterprise front-end platforms.',
}

export default function Uses() {
  return (
    <SimpleLayout
      title="The stack behind nationwide-scale front-end delivery."
      intro="Every project at the Ministry of Interior demands reliable, well-tested tooling. These are the technologies and practices I lean on to keep teams productive and platforms resilient."
    >
      <div className="space-y-20">
        <ToolsSection title="Languages & Frameworks">
          <Tool title="React & Next.js">
            My core stack for enterprise dashboards and workflows. Server
            components and Next.js routing let us ship secure modules without
            sacrificing developer velocity.
          </Tool>
          <Tool title="TypeScript">
            Strict typing has been essential while mentoring our front-end team;
            it shortens review cycles and keeps integrations with Spring Boot
            services safe.
          </Tool>
          <Tool title="React Native">
            When I take on freelance engagements, React Native lets me extend
            government platforms into mobile workflows without rebuilding the
            entire stack. Shared TypeScript models keep parity with our web
            applications.
          </Tool>
          <Tool title="Vue.js & Svelte.js">
            Useful for lightweight internal tools where we need rapid
            prototyping or to extend legacy systems without a full rewrite.
          </Tool>
        </ToolsSection>
        <ToolsSection title="State & Data Flow">
          <Tool title="Redux Toolkit & Zustand">
            Large workflows still live in Redux Toolkit, while modular features
            benefit from Zustand’s minimal footprint.
          </Tool>
          <Tool title="TanStack Query & Recoil">
            TanStack Query powers complex, cached API interactions. Recoil helps
            when we need fine-grained control over shared UI state.
          </Tool>
          <Tool title="Secure API Integration">
            RESTful services, JWT, and OAuth 2.0 are the backbone of our
            security posture. I maintain the shared client libraries and token
            lifecycles across applications.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Interface Systems">
          <Tool title="Tailwind CSS & PrimeFlex">
            Tailwind keeps our design tokens consistent, while PrimeFlex speeds
            up internal layout work when teams need reusable patterns.
          </Tool>
          <Tool title="Material UI, Shadcn, and Radix UI">
            I combine these component systems to match institutional guidelines
            and accessibility requirements without reinventing every control.
          </Tool>
          <Tool title="Custom Component Libraries">
            Standardizing visuals across ministries means documenting patterns,
            hardening them with Storybook, and sharing usage guides with every
            squad.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Build & Quality">
          <Tool title="Vite, Jest, and Vitest">
            Migrating our CI/CD pipelines to Vite cut build times by 75%. Jest
            and Vitest cover unit and component suites across the monorepo.
          </Tool>
          <Tool title="ESLint & Prettier">
            Automated formatting and linting enforce the standards I coach the
            team on, reducing drift in large collaborative codebases.
          </Tool>
          <Tool title="Electron & Express.js">
            When we package internal utilities for desktop or embed Node-based
            services, these tools let us bridge front-end skills with custom
            infrastructure.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Collaboration & Design">
          <Tool title="Figma & Framer">
            Product discovery starts here. Shared libraries keep designers and
            developers in sync before any code lands in the repo.
          </Tool>
          <Tool title="Mentorship & Documentation">
            Structured code reviews, onboarding guides, and knowledge bases make
            it easier for junior developers to contribute to mission-critical
            projects.
          </Tool>
        </ToolsSection>
      </div>
    </SimpleLayout>
  )
}
