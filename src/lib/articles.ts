interface Article {
  title: string
  description: string
  author: string
  date: string
}

export interface ArticleWithSlug extends Article {
  slug: string
}

export async function getAllArticles(): Promise<ArticleWithSlug[]> {
  const articles: ArticleWithSlug[] = [
    {
      slug: 'analytics-across-81-provinces',
      title: 'Delivering Analytics Across 81 Provinces',
      description: 'Building a resilient analytics hub so provincial leaders and headquarters share the same facts.',
      author: 'Ahmet Burak Tekin',
      date: '2025-02-12',
    },
    {
      slug: 'building-this-portfolio',
      title: 'Building This Portfolio',
      description: 'Why I rebuilt aburakt.com on Next.js and Tailwind with a focus on ministry-scale storytelling.',
      author: 'Ahmet Burak Tekin',
      date: '2024-09-18',
    },
    {
      slug: 'automating-macos-sysdata-cleanup',
      title: 'Automating macOS System Data Cleanup',
      description: 'How the cleanup-macos-sysdata script keeps my development machine lean without risky manual steps.',
      author: 'Ahmet Burak Tekin',
      date: '2024-09-17',
    },
    {
      slug: 'architecting-the-authorization-platform',
      title: "Architecting the Ministry's Authorization Platform",
      description: 'Translating nationwide approval workflows into a modular React and TypeScript experience.',
      author: 'Ahmet Burak Tekin',
      date: '2024-04-18',
    },
    {
      slug: 'scaling-secure-access',
      title: 'Scaling Secure Access Across the Ministry',
      description: 'Migrating every internal product to a unified OAuth 2.0 + JWT gateway without interrupting daily work.',
      author: 'Ahmet Burak Tekin',
      date: '2023-08-14',
    },
  ]

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
