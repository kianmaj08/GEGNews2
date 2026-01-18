import type { Metadata } from "next"
import "./globals.css"
import { VisualEditsMessenger } from "orchids-visual-edits";
import ErrorReporter from "@/components/ErrorReporter"
import Script from "next/script"
import { ClerkProvider } from "@clerk/nextjs"

export const metadata: Metadata = {
  title: {
    default: "GEGNews - Die Schülerzeitung",
    template: "%s | GEGNews"
  },
  description: "Die offizielle Schülerzeitung des GEG. Aktuelle News, Events, Interviews und mehr von Schülern für Schüler.",
  keywords: ["Schülerzeitung", "GEG", "News", "Schule", "Events"],
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "GEGNews",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="de">
        <body className="antialiased">
          <Script
            id="orchids-browser-logs"
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
            strategy="afterInteractive"
            data-orchids-project-id="9e46b249-1330-4fe0-8f04-c39641bde8e2"
          />
          <ErrorReporter />
          <Script
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
            strategy="afterInteractive"
            data-target-origin="*"
            data-message-type="ROUTE_CHANGE"
            data-include-search-params="true"
            data-only-in-iframe="true"
            data-debug="true"
            data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
          />
          {children}
          <VisualEditsMessenger />
        </body>
      </html>
    </ClerkProvider>
  );
}