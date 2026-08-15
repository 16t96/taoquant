import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

const SITE_TITLE = 'TAOQuant — Quant Subnet Analytics & Risk Matrix for Bittensor'
const SITE_DESCRIPTION =
  'Deterministic, open-source risk analytics for Bittensor (TAO) subnets. No AI, pure statistics — an educational, non-custodial, client-side tool.'

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  generator: 'v0.app',
  applicationName: 'TAOQuant',
  keywords: [
    'Bittensor',
    'TAO',
    'subnet analytics',
    'risk matrix',
    'IRA score',
    'deterministic',
    'quant',
  ],
  openGraph: {
    type: 'website',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: 'TAOQuant',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0d1117',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
