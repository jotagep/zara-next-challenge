import { PRIORITY_CARD_COUNT } from '@/features/catalog/constants'
import { PhoneCard } from '@/shared/components/PhoneCard/PhoneCard'
import type { PhoneListItem } from '@/shared/lib/types/domain'

import styles from './PhoneGrid.module.css'

type PhoneGridProps = {
  phones: PhoneListItem[]
}

export const PhoneGrid = ({ phones }: PhoneGridProps) => {
  if (phones.length === 0) {
    return <p className={styles.empty}>No smartphones match your search.</p>
  }

  return (
    <ul role="list" aria-label="Phone catalog" className={styles.grid}>
      {phones.map((phone, index) => (
        <li key={phone.id}>
          <PhoneCard phone={phone} priority={index < PRIORITY_CARD_COUNT} />
        </li>
      ))}
    </ul>
  )
}
