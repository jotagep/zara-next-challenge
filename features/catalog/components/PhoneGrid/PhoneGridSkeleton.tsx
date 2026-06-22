import gridStyles from './PhoneGrid.module.css'
import styles from './PhoneGridSkeleton.module.css'

type PhoneGridSkeletonProps = {
  count?: number
}

export const PhoneGridSkeleton = ({ count = 6 }: PhoneGridSkeletonProps) => {
  const items = Array.from({ length: count }, (_, i) => i)
  return (
    <div className={gridStyles.grid} aria-hidden="true">
      {items.map((item) => (
        <div key={item} className={styles.card}>
          <div className={styles.image} />
          <div className={styles.line} />
          <div className={styles.lineShort} />
        </div>
      ))}
    </div>
  )
}
