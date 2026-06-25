import type { CartItem } from '@/shared/context/CartContext'
import type {
  ColorOption,
  Phone,
  PhoneListItem,
  PhoneSpecs,
  StorageOption,
} from '@/shared/lib/types/domain'

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

export const colorOptionFixtures: ColorOption[] = [
  { name: 'Black Titanium', hexCode: '#62605F', imageUrl: 'https://example.com/black.png' },
  { name: 'Blue Titanium', hexCode: '#4D4E5F', imageUrl: 'https://example.com/blue.png' },
  { name: 'Natural Titanium', hexCode: '#ACA49B', imageUrl: 'https://example.com/natural.png' },
]

export const storageOptionFixtures: StorageOption[] = [
  { capacity: '128 GB', price: 1099 },
  { capacity: '256 GB', price: 1199 },
  { capacity: '512 GB', price: 1399 },
]

export const phoneSpecsFixtures: PhoneSpecs = {
  brand: 'Apple',
  name: 'iPhone 15 Pro',
  description: 'A magical new way to interact with iPhone.',
  screen: '6.1" Super Retina XDR',
  resolution: '2556 x 1179',
  processor: 'Apple A17 Pro',
  mainCamera: '48 MP',
  selfieCamera: '12 MP',
  battery: '3274 mAh',
  os: 'iOS 17',
  screenRefreshRate: '120 Hz',
}

export const phoneDetailFixtures: Phone = {
  id: 'AP15P',
  brand: 'Apple',
  name: 'iPhone 15 Pro',
  basePrice: 1099,
  imageUrl: 'https://example.com/iphone-15-pro.png',
  description: 'A magical new way to interact with iPhone.',
  rating: 4.6,
  specs: phoneSpecsFixtures,
  colorOptions: colorOptionFixtures,
  storageOptions: storageOptionFixtures,
  similarProducts: phoneFixtures,
}

export const cartItemFixtures: CartItem[] = [
  {
    id: 'AP15P',
    brand: 'Apple',
    name: 'iPhone 15 Pro',
    color: colorOptionFixtures[0],
    storage: storageOptionFixtures[1],
    quantity: 1,
  },
  {
    id: 'SGS24',
    brand: 'Samsung',
    name: 'Galaxy S24 Ultra',
    color: colorOptionFixtures[1],
    storage: storageOptionFixtures[2],
    quantity: 2,
  },
  {
    id: 'PX8P',
    brand: 'Google',
    name: 'Pixel 8 Pro',
    color: colorOptionFixtures[2],
    storage: storageOptionFixtures[0],
    quantity: 3,
  },
]
