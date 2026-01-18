import { getCategories } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminKategorienPage() {
  const categories = await getCategories()

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold mb-8">Kategorien</h1>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <Card key={category.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.badge_color }}
                />
                <CardTitle className="text-lg">{category.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{category.description}</p>
              <p className="text-xs text-muted-foreground mt-2">Slug: {category.slug}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
