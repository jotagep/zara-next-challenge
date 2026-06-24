import type { Metadata } from 'next'

import { Header } from '@/shared/components/Header/Header'
import { CartProvider } from '@/shared/context/CartContext'

import './globals.css'
import styles from './layout.module.css'

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
        <CartProvider>
          <Header />
          <main className={styles.main}>{children}</main>
        </CartProvider>
      </body>
    </html>
  )
}
