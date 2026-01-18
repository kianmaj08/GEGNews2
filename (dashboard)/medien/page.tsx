import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminMedienPage() {
  return (
    <div>
      <h1 className="text-3xl font-serif font-bold mb-8">Medienbibliothek</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Bilder</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-12">
            Die Medienbibliothek ist in der Demo-Version nicht verfügbar.<br />
            Bilder können direkt im Artikel-Editor per URL eingebunden werden.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
