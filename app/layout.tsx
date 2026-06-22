import type { Metadata } from 'next'

import { Header } from '@/components/Header/Header'

import './globals.css'

export const metadata: Metadata = {
  title: 'Mobile Phone Catalog',
  description: 'Browse the mobile phones catalog',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}
