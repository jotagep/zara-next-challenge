export type PhoneId = string

export type ColorOption = {
  name: string
  hexCode: string
  imageUrl: string
}

export type StorageOption = {
  capacity: string
  price: number
}

export type PhoneSpecs = {
  brand: string
  name: string
  description: string
  screen: string
  resolution: string
  processor: string
  mainCamera: string
  selfieCamera: string
  battery: string
  os: string
  screenRefreshRate: string
}

export type Phone = {
  id: PhoneId
  brand: string
  name: string
  basePrice: number
  imageUrl: string
  description: string
  rating: number
  specs: PhoneSpecs
  colorOptions: ColorOption[]
  storageOptions: StorageOption[]
  similarProducts: PhoneListItem[]
}

export type PhoneListItem = Pick<Phone, 'id' | 'brand' | 'name' | 'basePrice' | 'imageUrl'>

export type FetchPhonesParams = {
  search?: string
  limit?: number
  offset?: number
}
