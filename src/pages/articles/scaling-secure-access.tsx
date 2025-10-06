import { ArticleLayout } from '@/components/ArticleLayout'
import { getAllArticles } from '@/lib/articles'
import { useEffect, useState } from 'react'

export default function Article() {
  const [article, setArticle] = useState<any>(null)

  useEffect(() => {
    getAllArticles().then((articles) => {
      const found = articles.find((a) => a.slug === 'scaling-secure-access')
      if (found) setArticle(found)
    })
  }, [])

  if (!article) return <div>Loading...</div>

  return (
    <ArticleLayout article={article}>
      <p>
        When I joined the Ministry of Interior in late 2022, every product team owned its
        own login flow. By August 2023 we had collapsed those one-off solutions into a
        single OAuth 2.0 and JWT gateway that now issues millions of tokens each month.
        The project blended lightweight Node.js services, Spring Boot integrations, and a
        shared TypeScript client that front-end teams can drop in without ceremony.
      </p>
      <p>
        Rolling out the gateway meant pairing with each squad, rehearsing cutovers, and
        building dashboards that surface token health in real time. Today security
        reviews focus on policy instead of plumbing, and new applications ship faster
        because authentication is already solved.
      </p>
    </ArticleLayout>
  )
}
