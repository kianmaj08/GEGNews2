import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SUPPORT_EMAIL } from '@/lib/constants'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutz',
}

export default function DatenschutzPage() {
  return (
    <>
      <Header />
      
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-serif font-bold mb-8">Datenschutzerklärung</h1>
          
          <div className="prose max-w-none">
            <h2>1. Datenschutz auf einen Blick</h2>
            
            <h3>Allgemeine Hinweise</h3>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, 
              wenn Sie unsere Website besuchen.
            </p>
            
            <h3>Datenerfassung auf unserer Website</h3>
            <p>
              <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. 
              Die Kontaktdaten finden Sie im Impressum dieser Website.
            </p>
            
            <h2>2. Allgemeine Hinweise und Pflichtinformationen</h2>
            
            <h3>Datenschutz</h3>
            <p>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. 
              Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften.
            </p>
            
            <h3>Hinweis zur verantwortlichen Stelle</h3>
            <p>
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br /><br />
              GEGNews - Schülerzeitung<br />
              Mustergymnasium<br />
              Musterstraße 1<br />
              12345 Musterstadt<br /><br />
              E-Mail: {SUPPORT_EMAIL}
            </p>
            
            <h2>3. Datenerfassung auf unserer Website</h2>
            
            <h3>Kontaktformular</h3>
            <p>
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular 
              inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von 
              Anschlussfragen bei uns gespeichert.
            </p>
            
            <h3>Kommentarfunktion</h3>
            <p>
              Wenn Sie einen Kommentar auf unserer Website hinterlassen, werden die von Ihnen eingegebenen Daten 
              (Name, optional E-Mail, Kommentartext) gespeichert. Kommentare werden vor der Veröffentlichung von der Redaktion geprüft.
            </p>
            
            <h2>4. Cookies</h2>
            <p>
              Diese Website verwendet technisch notwendige Cookies, um bestimmte Funktionen zu gewährleisten. 
              Es werden keine Tracking-Cookies verwendet.
            </p>
            
            <h2>5. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, 
              deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder 
              Löschung dieser Daten.
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
