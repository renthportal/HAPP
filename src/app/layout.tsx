import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hangel — Crane Lift Planning',
  description: 'Profesyonel vinç kaldırma planı oluşturma ve menzil diyagramı çizim aracı',
  icons: { icon: '/logo-hareket.png', apple: '/logo-hareket.png' },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Hangel',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#006838',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body style={{fontFamily:"'Inter','SF Pro',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>{children}</body>
    </html>
  )
}
