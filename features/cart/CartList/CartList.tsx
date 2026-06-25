import { CartItem } from '@/features/cart/CartItem/CartItem'
import type { CartItem as CartItemType } from '@/shared/context/CartContext'

import styles from './CartList.module.css'

type CartListProps = {
  items: CartItemType[]
  onRemove: (id: CartItemType['id'], colorName: string, storageCapacity: string) => void
}

export const CartList = ({ items, onRemove }: CartListProps) => (
  <ul role="list" aria-label="Cart items" className={styles.list}>
    {items.map((item) => (
      <CartItem
        key={`${item.id}-${item.color.name}-${item.storage.capacity}`}
        item={item}
        onRemove={onRemove}
      />
    ))}
  </ul>
)
