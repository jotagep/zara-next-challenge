import styles from './loading.module.css'

export default function Loading() {
  return (
    <section className={styles.view} aria-busy="true" aria-live="polite">
      <div className={styles.heading} aria-hidden="true" />
      <ul className={styles.list}>
        {Array.from({ length: 2 }).map((_, index) => (
          <li key={index} className={styles.item}>
            <div className={styles.image} aria-hidden="true" />
            <div className={styles.content} aria-hidden="true">
              <div className={styles.line} />
              <div className={styles.lineShort} />
              <div className={styles.linePrice} />
            </div>
          </li>
        ))}
      </ul>
      <footer className={styles.footer} aria-hidden="true" />
    </section>
  )
}
