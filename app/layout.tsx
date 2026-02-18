import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#006838',
}

export const metadata: Metadata = {
  title: 'Hangle — Vinç Kaldırma Planlama',
  description: 'Vinç kaldırma planı ve menzil diyagramı sistemi',
  icons: { icon: '/logo-hareket.png', apple: '/logo-hareket.png' },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Hangel',
  },
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
