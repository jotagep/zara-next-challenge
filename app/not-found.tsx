import { Button } from '@/shared/components/Button/Button'

import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <div className={styles.center}>
      <div className={styles.card}>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.message}>The page you&apos;re looking for doesn&apos;t exist.</p>
        <Button href="/">Continue shopping</Button>
      </div>
    </div>
  )
}
