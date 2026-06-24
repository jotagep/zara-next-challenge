import { Button } from '@/shared/components/Button/Button'
import { ROUTES } from '@/shared/config/routes'

import styles from './not-found.module.css'

export default function PhoneNotFound() {
  return (
    <div className={styles.center}>
      <div className={styles.card}>
        <h1 className={styles.title}>Phone not found</h1>
        <p className={styles.message}>The phone you&apos;re looking for is no longer available.</p>
        <Button href={ROUTES.home}>Continue shopping</Button>
      </div>
    </div>
  )
}
