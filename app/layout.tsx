import type { Metadata } from 'next'

import { Header } from '@/shared/components/Header/Header'
import { siteConfig } from '@/shared/config/site'
import { CartProvider } from '@/shared/context/CartContext'

import './globals.css'
import styles from './layout.module.css'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main className={styles.main}>{children}</main>
        </CartProvider>
      </body>
    </html>
  )
}
