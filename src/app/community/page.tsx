import { type Metadata } from 'next'

import { Card } from '@/components/Card'
import { Section } from '@/components/Section'
import { SimpleLayout } from '@/components/SimpleLayout'

function CommunitySection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <div className="space-y-16">{children}</div>
    </Section>
  )
}

function Contribution({
  title,
  description,
  event,
  cta,
  href,
}: {
  title: string
  description: string
  event: string
  cta: string
  href: string
}) {
  return (
    <Card as="article">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Eyebrow decorate>{event}</Card.Eyebrow>
      <Card.Description>{description}</Card.Description>
      <Card.Cta>{cta}</Card.Cta>
    </Card>
  )
}

export const metadata: Metadata = {
  title: 'Community',
  description:
    'Volunteer leadership across JCI Ankara, JCI Europe, and Iyader focused on growth, outreach, and digital transformation.',
}

export default function Community() {
  return (
    <SimpleLayout
      title="Leading volunteer teams to amplify community impact."
      intro="I stay close to the people my work serves by contributing to civil society organizations. From strategic leadership roles in JCI to youth programs at Iyader, I focus on growth, digital transformation, and collaborative outreach."
    >
      <div className="space-y-20">
        <CommunitySection title="Leadership">
          <Contribution
            href="mailto:info@aburakt.com?subject=JCI%20Ankara%20Collaboration"
            title="Secretary General"
            description="Coordinating chapter operations, governance, and volunteer engagement while guiding strategic initiatives across JCI Ankara."
            event="JCI Ankara · 2025"
            cta="Discuss the role"
          />
          <Contribution
            href="mailto:info@aburakt.com?subject=JCI%20Europe%20Outreach"
            title="Development Council Officer · Outreach & Engagement"
            description="Planning outreach programs that connect new members with impact-driven projects throughout Europe."
            event="JCI Europe · 2025"
            cta="Plan an initiative"
          />
          <Contribution
            href="mailto:info@aburakt.com?subject=Digital%20Platforms%20Initiatives"
            title="Board Member · Digital Platforms"
            description="Directed digital transformation programs, refreshed communication channels, and improved platform governance for members."
            event="JCI Ankara · 2024"
            cta="Learn about the initiatives"
          />
          <Contribution
            href="mailto:info@aburakt.com?subject=Growth%20and%20Development"
            title="Board Member · Growth & Development"
            description="Designed recruitment journeys and mentorship frameworks that increased membership engagement and retention."
            event="JCI Ankara · 2023"
            cta="Request program insights"
          />
          <Contribution
            href="mailto:info@aburakt.com?subject=JCI%20Europe%20Impact"
            title="Development Council Officer· Impact & Promotion"
            description="Supporting Impact & Promotion initiatives across JCI Europe, enabling collaboration between chapters and amplifying success stories."
            event="JCI Europe · 2024"
            cta="Explore regional collaboration"
          />
        </CommunitySection>
        <CommunitySection title="Programs & Advocacy">
          <Contribution
            href="mailto:info@aburakt.com?subject=JciThon%20Experience"
            title="JciThon: Sustainable Entrepreneurship Journey"
            description="Participated in innovation sprints that addressed sustainability challenges and sparked long-term community projects."
            event="JCI Ankara · 2022"
            cta="Talk about the program"
          />
          <Contribution
            href="mailto:info@aburakt.com?subject=Iyader%20Youth%20Ambassador"
            title="Youth Ambassador"
            description="Represented Iyader in empowering youth-focused initiatives and promoted civic engagement opportunities."
            event="Iyader · 2021"
            cta="Collaborate with Iyader"
          />
        </CommunitySection>
      </div>
    </SimpleLayout>
  )
}
