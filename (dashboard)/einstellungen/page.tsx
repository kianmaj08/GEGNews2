import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SUPPORT_EMAIL } from '@/lib/constants'

export default function AdminEinstellungenPage() {
  return (
    <div>
      <h1 className="text-3xl font-serif font-bold mb-8">Einstellungen</h1>
      
      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Allgemein</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Zeitungsname</Label>
              <Input defaultValue="GEGNews" />
            </div>
            <div>
              <Label>Support E-Mail</Label>
              <Input defaultValue={SUPPORT_EMAIL} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Eilmeldungen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Aktive Eilmeldung</Label>
              <Input placeholder="Eilmeldungstext eingeben..." />
            </div>
            <div>
              <Label>Link (optional)</Label>
              <Input placeholder="/artikel/..." />
            </div>
            <Button>Eilmeldung aktualisieren</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Standard Meta-Beschreibung</Label>
              <Input defaultValue="Die offizielle Schülerzeitung des GEG. Aktuelle News, Events, Interviews und mehr." />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
