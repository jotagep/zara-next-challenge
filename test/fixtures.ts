import type { PhoneListItem } from '@/shared/lib/types/domain'

export const phoneFixtures: PhoneListItem[] = [
  {
    id: 'AP15P',
    brand: 'Apple',
    name: 'iPhone 15 Pro',
    basePrice: 1099,
    imageUrl: 'https://example.com/iphone-15-pro.png',
  },
  {
    id: 'SGS24',
    brand: 'Samsung',
    name: 'Galaxy S24 Ultra',
    basePrice: 1299,
    imageUrl: 'https://example.com/galaxy-s24.png',
  },
  {
    id: 'PX8P',
    brand: 'Google',
    name: 'Pixel 8 Pro',
    basePrice: 999,
    imageUrl: 'https://example.com/pixel-8-pro.png',
  },
]

export const emptyPhoneFixtures: PhoneListItem[] = []
