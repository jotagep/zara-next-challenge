import { PhoneGridSkeleton } from '@/features/catalog/components/PhoneGrid/PhoneGridSkeleton'
import { PAGE_SIZE } from '@/features/catalog/constants'

import styles from './loading.module.css'

export default function Loading() {
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <div className={styles.search} aria-hidden="true" />
        <div className={styles.countLine} aria-hidden="true" />
        <PhoneGridSkeleton count={PAGE_SIZE} />
      </section>
    </main>
  )
}
