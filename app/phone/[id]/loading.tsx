import { BackLink } from '@/features/detail/BackLink/BackLink'
import { Container } from '@/shared/components/Container/Container'

import styles from './loading.module.css'

export default function PhoneDetailLoading() {
  return (
    <>
      <BackLink />
      <Container size="narrow" className={styles.content}>
        <div className={styles.hero} aria-hidden="true">
          <div className={styles.gallery} />
          <div className={styles.info}>
            <div className={styles.title} />
            <div className={styles.price} />
            <div className={styles.options} />
            <div className={styles.options} />
            <div className={styles.cta} />
          </div>
        </div>
        <div className={styles.section} aria-hidden="true">
          <div className={styles.heading} />
          <div className={styles.specList}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={styles.specRow}>
                <div className={styles.specLabel} />
                <div className={styles.specValue} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  )
}
