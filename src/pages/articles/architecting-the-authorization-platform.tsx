import { ArticleLayout } from '@/components/ArticleLayout'
import { getAllArticles } from '@/lib/articles'
import { useEffect, useState } from 'react'

export default function Article() {
  const [article, setArticle] = useState<any>(null)

  useEffect(() => {
    getAllArticles().then((articles) => {
      const found = articles.find((a) => a.slug === 'architecting-the-authorization-platform')
      if (found) setArticle(found)
    })
  }, [])

  if (!article) return <div>Loading...</div>

  return (
    <ArticleLayout article={article}>
      <p>
        Throughout 2024 I led the rebuild of the Ministry of Interior's authorization
        platform, a system that shepherds every permission request across 81 provinces.
        We replaced brittle legacy screens with a modular React and TypeScript
        architecture so new directorates can reuse the same building blocks without
        forking business logic.
      </p>
      <p>
        Success depended on partnership. I mentored our four-person front-end team,
        co-designed API contracts with Spring Boot engineers, and invested in automated
        reviews that keep the codebase healthy. The payoff is a platform that processes
        thousands of approvals each day while giving leadership real-time visibility into
        what's moving forward.
      </p>
    </ArticleLayout>
  )
}
