import { ArticleLayout } from '@/components/ArticleLayout'
import { getAllArticles } from '@/lib/articles'
import { useEffect, useState } from 'react'

export default function Article() {
  const [article, setArticle] = useState<any>(null)

  useEffect(() => {
    getAllArticles().then((articles) => {
      const found = articles.find((a) => a.slug === 'building-this-portfolio')
      if (found) setArticle(found)
    })
  }, [])

  if (!article) return <div>Loading...</div>

  return (
    <ArticleLayout article={article}>
      <p>
        Publishing today's refresh of aburakt.com was about more than a new coat of
        paint. I wanted a home that tells the story of my Ministry of Interior work with
        clarity, so I reached for Next.js, Tailwind CSS, and the component systems I
        depend on at the office. The result performs well whether you're grabbing my CV
        or diving into the case studies.
      </p>
      <p>
        Rebuilding the site forced me to audit everything: the hero, the project copy,
        links to volunteer roles, even the tools list. Every section now maps directly to
        work I've led since 2019, making it easier for partners and recruiters to see how
        I can help their teams.
      </p>
    </ArticleLayout>
  )
}
