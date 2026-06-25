'use client'

import { Button } from '@/shared/components/Button/Button'
import { ROUTES } from '@/shared/config/routes'
import { formatPrice } from '@/shared/lib/utils/formatPrice'

import styles from './CartSummary.module.css'

type CartSummaryProps = {
  total: number
  empty?: boolean
}

export const CartSummary = ({ total, empty = false }: CartSummaryProps) => {
  return (
    <footer className={styles.footer}>
      <Button href={ROUTES.home} variant="secondary" className={styles.continue}>
        Continue shopping
      </Button>
      {!empty && (
        <>
          <p className={styles.total}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>{formatPrice(total)}</span>
          </p>
          <Button type="button" variant="primary" className={styles.pay}>
            Pay
          </Button>
        </>
      )}
    </footer>
  )
}
