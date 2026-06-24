import type { ApiColorOption, ApiPhoneDetail, ApiPhoneListItem } from '@/lib/types/api'
import type { ColorOption, Phone, PhoneListItem } from '@/lib/types/domain'

const mapColorOption = (dto: ApiColorOption): ColorOption => ({
  name: dto.name,
  hexCode: dto.hexCode,
  imageUrl: dto.imageUrl,
})

export const mapPhoneListItem = (dto: ApiPhoneListItem): PhoneListItem => ({
  id: dto.id,
  brand: dto.brand,
  name: dto.name,
  basePrice: dto.basePrice,
  imageUrl: dto.imageUrl,
})

export const mapPhone = (dto: ApiPhoneDetail): Phone => {
  const fallbackImage = dto.colorOptions[0]?.imageUrl ?? ''
  return {
    id: dto.id,
    brand: dto.brand,
    name: dto.name,
    basePrice: dto.basePrice,
    imageUrl: dto.imageUrl ?? fallbackImage,
    description: dto.description,
    rating: dto.rating,
    specs: {
      brand: dto.brand,
      name: dto.name,
      description: dto.description,
      screen: dto.specs.screen,
      resolution: dto.specs.resolution,
      processor: dto.specs.processor,
      mainCamera: dto.specs.mainCamera,
      selfieCamera: dto.specs.selfieCamera,
      battery: dto.specs.battery,
      os: dto.specs.os,
      screenRefreshRate: dto.specs.screenRefreshRate,
    },
    colorOptions: dto.colorOptions.map(mapColorOption),
    storageOptions: dto.storageOptions,
    similarProducts: dto.similarProducts.map(mapPhoneListItem),
  }
}
