import Image from 'next/image'
import Link from 'next/link'

import type { PhoneListItem } from '@/shared/lib/types/domain'
import { formatPrice } from '@/shared/lib/utils/formatPrice'

import styles from './PhoneCard.module.css'

type PhoneCardProps = {
  phone: PhoneListItem
  priority?: boolean
}

export const PhoneCard = ({ phone, priority = false }: PhoneCardProps) => (
  <Link href={`/phone/${phone.id}`} className={styles.card}>
    <div className={styles.imageWrapper}>
      <Image
        src={phone.imageUrl}
        alt={`${phone.brand} ${phone.name}`}
        fill
        sizes="(max-width: 767px) 100vw, 344px"
        className={styles.image}
        priority={priority}
      />
    </div>
    <div className={styles.info}>
      <div className={styles.text}>
        <span className={styles.brand}>{phone.brand}</span>
        <span className={styles.name}>{phone.name}</span>
      </div>
      <span className={styles.price}>{formatPrice(phone.basePrice)}</span>
    </div>
  </Link>
)
