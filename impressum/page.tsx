import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SUPPORT_EMAIL } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum',
}

export default function ImpressumPage() {
  return (
    <>
      <Header />
      
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-serif font-bold mb-8">Impressum</h1>
          
          <div className="prose max-w-none">
            <h2>Angaben gemäß § 5 TMG</h2>
            <p>
              GEGNews - Schülerzeitung<br />
              Mustergymnasium<br />
              Musterstraße 1<br />
              12345 Musterstadt
            </p>
            
            <h2>Kontakt</h2>
            <p>
              E-Mail: {SUPPORT_EMAIL}
            </p>
            
            <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>
              Die Redaktion der GEGNews<br />
              Mustergymnasium<br />
              Musterstraße 1<br />
              12345 Musterstadt
            </p>
            
            <h2>Haftungsausschluss</h2>
            
            <h3>Haftung für Inhalte</h3>
            <p>
              Als Schülerzeitung bemühen wir uns, die Inhalte unserer Seiten stets aktuell und korrekt zu halten. 
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
            </p>
            
            <h3>Haftung für Links</h3>
            <p>
              Unsere Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.
            </p>
            
            <h3>Urheberrecht</h3>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. 
              Beiträge Dritter sind als solche gekennzeichnet.
            </p>
            
            <p className="text-sm text-muted-foreground mt-8">
              <strong>Demo Version</strong> - Dies ist eine Demo-Website.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  )
}
