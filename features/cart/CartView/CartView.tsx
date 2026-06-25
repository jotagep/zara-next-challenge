'use client'

import { CartList } from '@/features/cart/CartList/CartList'
import { CartSummary } from '@/features/cart/CartSummary/CartSummary'
import { Button } from '@/shared/components/Button/Button'
import { ROUTES } from '@/shared/config/routes'
import { useCart } from '@/shared/context/CartContext'

import styles from './CartView.module.css'

export const CartView = () => {
  const { items, count, removeFromCart } = useCart()

  const total = items.reduce((sum, item) => sum + item.storage.price * item.quantity, 0)
  const hasItems = items.length > 0

  return (
    <section className={styles.view} aria-label="Shopping cart">
      <h1 className={styles.heading}>{`Cart (${count})`}</h1>
      {hasItems ? (
        <>
          <CartList items={items} onRemove={removeFromCart} />
          <CartSummary total={total} />
        </>
      ) : (
        <footer className={styles.emptyFooter}>
          <Button href={ROUTES.home} variant="secondary" className={styles.continue}>
            Continue shopping
          </Button>
        </footer>
      )}
    </section>
  )
}
