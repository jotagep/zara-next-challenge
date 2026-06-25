import { Metadata } from 'next'

import { CartView } from '@/features/cart/CartView/CartView'
import { Container } from '@/shared/components/Container/Container'
import { siteConfig } from '@/shared/config/site'

export const metadata: Metadata = {
  title: 'Cart',
  description: `Review your shopping cart | ${siteConfig.name}`,
}

export default function CartPage() {
  return (
    <Container>
      <CartView />
    </Container>
  )
}
