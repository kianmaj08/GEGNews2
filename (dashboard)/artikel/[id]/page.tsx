import { notFound } from 'next/navigation'
import { ArticleEditor } from '@/components/admin/ArticleEditor'
import { getArticleById, getCategories, getUsers } from '@/lib/api'

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params
  const [article, categories, users] = await Promise.all([
    getArticleById(id),
    getCategories(),
    getUsers()
  ])
  
  if (!article) {
    notFound()
  }

  return <ArticleEditor article={article} categories={categories} users={users} />
}
