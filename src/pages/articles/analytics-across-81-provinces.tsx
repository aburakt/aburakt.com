import { ArticleLayout } from '@/components/ArticleLayout'
import { getAllArticles } from '@/lib/articles'
import { useEffect, useState } from 'react'

export default function Article() {
  const [article, setArticle] = useState<any>(null)

  useEffect(() => {
    getAllArticles().then((articles) => {
      const found = articles.find((a) => a.slug === 'analytics-across-81-provinces')
      if (found) setArticle(found)
    })
  }, [])

  if (!article) return <div>Loading...</div>

  return (
    <ArticleLayout article={article}>
      <p>
        Early in 2025 we unified provincial reporting into a single analytics hub for
        the Ministry of Interior. React, TanStack Query, and a hardened design system
        let us deliver responsive dashboards that honor the same authentication model as
        our other platforms while keeping role-based access straightforward.
      </p>
      <p>
        We complemented those dashboards with a self-service workspace that standardizes
        metrics and exports. Analysts can experiment without breaking governance rules,
        and leadership can open a single screen to understand how policies are landing
        across 81 provinces. The platform has become the connective tissue for
        data-informed decisions everywhere we operate.
      </p>
    </ArticleLayout>
  )
}
