import { ArticleLayout } from '@/components/ArticleLayout'
import { getAllArticles } from '@/lib/articles'
import { useEffect, useState } from 'react'

export default function Article() {
  const [article, setArticle] = useState<any>(null)

  useEffect(() => {
    getAllArticles().then((articles) => {
      const found = articles.find((a) => a.slug === 'automating-macos-sysdata-cleanup')
      if (found) setArticle(found)
    })
  }, [])

  if (!article) return <div>Loading...</div>

  return (
    <ArticleLayout article={article}>
      <p>
        On the eve of launching this portfolio refresh I ran out of storage — again. To
        stop babysitting Finder, I wrote the{' '}
        <a href="https://github.com/aburakt/cleanup-macos-sysdata">cleanup-macos-sysdata</a>
        {' '}script, which sweeps Xcode caches, derived data, and orphaned Time Machine
        snapshots while logging every action for review.
      </p>
      <p>
        It leans on familiar shell tooling but adds dry-run mode, confirmation prompts,
        and simple reporting so I can reclaim space with confidence before big builds or
        recording demos. Keeping my development machine tidy now takes minutes instead of
        hours.
      </p>
    </ArticleLayout>
  )
}
