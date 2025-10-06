import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
}

export function SEO({ title, description }: SEOProps) {
  const siteTitle = 'Ahmet Burak Tekin - Front-end developer leading enterprise-scale platforms'
  const siteDescription = "I'm Ahmet Burak Tekin, a front-end developer in Ankara building mission-critical systems for Türkiye's Ministry of Interior and mentoring teams that serve millions of citizens."

  const fullTitle = title ? `${title} - Ahmet Burak Tekin` : siteTitle
  const metaDescription = description || siteDescription

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
    </Helmet>
  )
}
