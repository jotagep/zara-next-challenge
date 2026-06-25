'use client'

import Image from 'next/image'
import Link from 'next/link'

import { RemoveButton } from '@/features/cart/RemoveButton/RemoveButton'
import { ROUTES } from '@/shared/config/routes'
import type { CartItem as CartItemType } from '@/shared/context/CartContext'
import { formatPrice } from '@/shared/lib/utils/formatPrice'

import styles from './CartItem.module.css'

type CartItemProps = {
  item: CartItemType
  onRemove: (id: CartItemType['id'], colorName: string, storageCapacity: string) => void
}

export const CartItem = ({ item, onRemove }: CartItemProps) => {
  const { id, brand, name, color, storage, quantity } = item
  const lineTotal = storage.price * quantity

  return (
    <li className={styles.item}>
      <Link href={ROUTES.phone(id)} className={styles.image} aria-label={`${brand} ${name}`}>
        <Image
          src={color.imageUrl}
          alt={`${brand} ${name} in ${color.name}`}
          fill
          sizes="(max-width: 767px) 140px, 200px"
          className={styles.imageNode}
        />
      </Link>
      <div className={styles.content}>
        <div className={styles.details}>
          <Link href={ROUTES.phone(id)} className={styles.nameLink}>
            <p className={styles.name}>{name}</p>
          </Link>
          <p className={styles.config}>
            {storage.capacity}
            {' | '}
            {color.name}
            {quantity > 1 ? ` × ${quantity}` : ''}
          </p>
          <p className={styles.price}>
            {formatPrice(storage.price)}
            {quantity > 1 && ` (${formatPrice(lineTotal)} total)`}
          </p>
        </div>
        <RemoveButton
          ariaLabel={`Remove ${brand} ${name} from cart`}
          onClick={() => onRemove(id, color.name, storage.capacity)}
        />
      </div>
    </li>
  )
}
