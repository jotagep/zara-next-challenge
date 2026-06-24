import Image from 'next/image'

import styles from './PhoneGallery.module.css'

type PhoneGalleryProps = {
  imageUrl: string
  alt: string
  priority?: boolean
}

export const PhoneGallery = ({ imageUrl, alt, priority = true }: PhoneGalleryProps) => (
  <div className={styles.frame}>
    <Image
      src={imageUrl}
      alt={alt}
      fill
      sizes="(max-width: 1023px) 100vw, (max-width: 1279px) 400px, 510px"
      className={styles.image}
      priority={priority}
    />
  </div>
)
