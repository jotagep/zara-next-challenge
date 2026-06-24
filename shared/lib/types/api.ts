import type { PhoneId } from '@/shared/lib/types/domain'

export type ApiPhoneListItem = {
  id: PhoneId
  brand: string
  name: string
  basePrice: number
  imageUrl: string
}

export type ApiColorOption = {
  name: string
  hexCode: string
  imageUrl: string
}

export type ApiStorageOption = {
  capacity: string
  price: number
}

export type ApiPhoneDetail = {
  id: PhoneId
  brand: string
  name: string
  description: string
  basePrice: number
  rating: number
  imageUrl: string
  specs: {
    screen: string
    resolution: string
    processor: string
    mainCamera: string
    selfieCamera: string
    battery: string
    os: string
    screenRefreshRate: string
  }
  colorOptions: ApiColorOption[]
  storageOptions: ApiStorageOption[]
  similarProducts: ApiPhoneListItem[]
}

export type ApiPhoneListResponse = ApiPhoneListItem[]
