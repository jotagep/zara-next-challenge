import { Carousel } from '@/shared/components/Carousel/Carousel'
import { PhoneCard } from '@/shared/components/PhoneCard/PhoneCard'
import type { PhoneListItem } from '@/shared/lib/types/domain'

import styles from './SimilarProducts.module.css'

type SimilarProductsProps = {
  products: PhoneListItem[]
}

export const SimilarProducts = ({ products }: SimilarProductsProps) => {
  if (products.length === 0) return null
  return (
    <section className={styles.section} aria-label="Similar items">
      <h2 className={styles.heading}>Similar items</h2>
      <Carousel bleed aria-label="Similar products carousel">
        {products.map((product) => (
          <li key={product.id} className={styles.cardWrapper}>
            <PhoneCard phone={product} />
          </li>
        ))}
      </Carousel>
    </section>
  )
}
