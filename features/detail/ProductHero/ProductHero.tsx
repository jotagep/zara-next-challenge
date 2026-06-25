'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { AddToCart } from '@/features/detail/AddToCart/AddToCart'
import { ColorSelector } from '@/features/detail/ColorSelector/ColorSelector'
import { PhoneGallery } from '@/features/detail/PhoneGallery/PhoneGallery'
import { StorageSelector } from '@/features/detail/StorageSelector/StorageSelector'
import { ROUTES } from '@/shared/config/routes'
import { useCart } from '@/shared/context/CartContext'
import type { ColorOption, Phone, StorageOption } from '@/shared/lib/types/domain'
import { formatPrice } from '@/shared/lib/utils/formatPrice'

import styles from './ProductHero.module.css'

type ProductHeroProps = {
  phone: Pick<
    Phone,
    'id' | 'brand' | 'name' | 'basePrice' | 'imageUrl' | 'colorOptions' | 'storageOptions'
  >
}

export const ProductHero = ({ phone }: ProductHeroProps) => {
  const { addToCart } = useCart()
  const router = useRouter()
  const [storageIndex, setStorageIndex] = useState<number | null>(null)
  const [colorIndex, setColorIndex] = useState(0)

  const selectedColor: ColorOption | null = phone.colorOptions[colorIndex] ?? null
  const selectedStorage: StorageOption | null =
    storageIndex !== null ? (phone.storageOptions[storageIndex] ?? null) : null

  const currentImage = selectedColor?.imageUrl ?? phone.imageUrl
  const currentPrice = selectedStorage?.price ?? phone.basePrice
  const priceIsRange = selectedStorage === null

  const canAdd = selectedColor !== null && selectedStorage !== null

  const galleryKey = useMemo(() => currentImage, [currentImage])

  const handleAdd = () => {
    if (!selectedColor || !selectedStorage) return
    addToCart({
      id: phone.id,
      brand: phone.brand,
      name: phone.name,
      color: selectedColor,
      storage: selectedStorage,
    })
    router.push(ROUTES.cart)
  }

  return (
    <section className={styles.hero} aria-label="Product details">
      <div className={styles.gallery}>
        <PhoneGallery
          key={galleryKey}
          imageUrl={currentImage}
          alt={`${phone.brand} ${phone.name} in ${selectedColor?.name ?? 'default colour'}`}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.heading}>
          <h1 className={styles.title}>{`${phone.name}`.toUpperCase()}</h1>
          <p className={styles.price}>
            {priceIsRange ? 'from ' : ''}
            {formatPrice(currentPrice)}
          </p>
        </div>
        <div className={styles.selectors}>
          <StorageSelector
            options={phone.storageOptions}
            selectedIndex={storageIndex}
            onSelect={setStorageIndex}
          />
          <ColorSelector
            options={phone.colorOptions}
            selectedIndex={colorIndex}
            onSelect={setColorIndex}
          />
        </div>
        <AddToCart disabled={!canAdd} onAdd={handleAdd} />
      </div>
    </section>
  )
}
