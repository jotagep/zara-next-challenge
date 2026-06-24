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
    <div className={styles.grid}>
      {phones.map((phone, index) => (
        <PhoneCard key={phone.id} phone={phone} priority={index < PRIORITY_CARD_COUNT} />
      ))}
    </div>
  )
}
