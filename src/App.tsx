import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Providers } from '@/providers'
import { Layout } from '@/components/Layout'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { PageTransition } from '@/components/PageTransition'

// Pages
import HomePage from '@/pages/home'
import AboutPage from '@/pages/about'
import ArticlesPage from '@/pages/articles'
import CvPage from '@/pages/cv'
import ProjectsPage from '@/pages/projects'
import UsesPage from '@/pages/uses'
import CommunityPage from '@/pages/community'
import ThankYouPage from '@/pages/thank-you'
import NotFound from '@/pages/not-found'

// Lazy load articles
const ArticleAnalytics = lazy(() => import('@/pages/articles/analytics-across-81-provinces'))
const ArticleAuthorization = lazy(() => import('@/pages/articles/architecting-the-authorization-platform'))
const ArticleMacOS = lazy(() => import('@/pages/articles/automating-macos-sysdata-cleanup'))
const ArticlePortfolio = lazy(() => import('@/pages/articles/building-this-portfolio'))
const ArticleSecureAccess = lazy(() => import('@/pages/articles/scaling-secure-access'))

function App() {
  const location = useLocation()

  return (
    <Providers>
      <div className="flex w-full">
        <Layout>
          <AnimatePresence mode="wait">
            <PageTransition>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/analytics-across-81-provinces" element={<ArticleAnalytics />} />
              <Route path="/articles/architecting-the-authorization-platform" element={<ArticleAuthorization />} />
              <Route path="/articles/automating-macos-sysdata-cleanup" element={<ArticleMacOS />} />
              <Route path="/articles/building-this-portfolio" element={<ArticlePortfolio />} />
              <Route path="/articles/scaling-secure-access" element={<ArticleSecureAccess />} />
              <Route path="/cv" element={<CvPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/uses" element={<UsesPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
              <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </PageTransition>
          </AnimatePresence>
        </Layout>
      </div>
    </Providers>
  )
}

export default App
