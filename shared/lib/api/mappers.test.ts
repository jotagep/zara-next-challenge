import { apiPhoneDetailFixtures, apiPhoneListItemFixtures } from '@/test/fixtures'
import { describe, expect, it } from 'vitest'

import { mapPhone, mapPhoneListItem } from './mappers'

describe('mappers', () => {
  describe('mapPhoneListItem', () => {
    it('passes through all fields untouched', () => {
      expect(mapPhoneListItem(apiPhoneListItemFixtures[0])).toEqual(apiPhoneListItemFixtures[0])
    })

    it('does not mutate the input DTO', () => {
      const dto = apiPhoneListItemFixtures[1]
      const snapshot = { ...dto }
      mapPhoneListItem(dto)
      expect(dto).toEqual(snapshot)
    })
  })

  describe('mapPhone', () => {
    it('returns the full mapped phone on a complete DTO', () => {
      const mapped = mapPhone(apiPhoneDetailFixtures)
      expect(mapped).toEqual({
        id: apiPhoneDetailFixtures.id,
        brand: apiPhoneDetailFixtures.brand,
        name: apiPhoneDetailFixtures.name,
        basePrice: apiPhoneDetailFixtures.basePrice,
        imageUrl: apiPhoneDetailFixtures.imageUrl,
        description: apiPhoneDetailFixtures.description,
        rating: apiPhoneDetailFixtures.rating,
        specs: {
          brand: apiPhoneDetailFixtures.brand,
          name: apiPhoneDetailFixtures.name,
          description: apiPhoneDetailFixtures.description,
          screen: apiPhoneDetailFixtures.specs.screen,
          resolution: apiPhoneDetailFixtures.specs.resolution,
          processor: apiPhoneDetailFixtures.specs.processor,
          mainCamera: apiPhoneDetailFixtures.specs.mainCamera,
          selfieCamera: apiPhoneDetailFixtures.specs.selfieCamera,
          battery: apiPhoneDetailFixtures.specs.battery,
          os: apiPhoneDetailFixtures.specs.os,
          screenRefreshRate: apiPhoneDetailFixtures.specs.screenRefreshRate,
        },
        colorOptions: apiPhoneDetailFixtures.colorOptions,
        storageOptions: apiPhoneDetailFixtures.storageOptions,
        similarProducts: apiPhoneDetailFixtures.similarProducts,
      })
    })

    it('flattens brand/name/description from the top-level DTO into specs', () => {
      const mapped = mapPhone(apiPhoneDetailFixtures)
      expect(mapped.specs.brand).toBe(apiPhoneDetailFixtures.brand)
      expect(mapped.specs.name).toBe(apiPhoneDetailFixtures.name)
      expect(mapped.specs.description).toBe(apiPhoneDetailFixtures.description)
    })

    it('maps colorOptions through mapColorOption (field-for-field)', () => {
      const mapped = mapPhone(apiPhoneDetailFixtures)
      expect(mapped.colorOptions).toEqual(apiPhoneDetailFixtures.colorOptions)
    })

    it('keeps storageOptions untouched (no mapping applied)', () => {
      const mapped = mapPhone(apiPhoneDetailFixtures)
      expect(mapped.storageOptions).toBe(apiPhoneDetailFixtures.storageOptions)
    })

    it('maps similarProducts through mapPhoneListItem', () => {
      const mapped = mapPhone(apiPhoneDetailFixtures)
      expect(mapped.similarProducts).toEqual(apiPhoneDetailFixtures.similarProducts)
    })

    describe('imageUrl fallback', () => {
      it('uses the DTO imageUrl when present', () => {
        const mapped = mapPhone(apiPhoneDetailFixtures)
        expect(mapped.imageUrl).toBe(apiPhoneDetailFixtures.imageUrl)
      })

      it('falls back to the first color imageUrl when imageUrl is undefined', () => {
        const dto = { ...apiPhoneDetailFixtures, imageUrl: undefined as unknown as string }
        const mapped = mapPhone(dto)
        expect(mapped.imageUrl).toBe(apiPhoneDetailFixtures.colorOptions[0]?.imageUrl)
      })

      it('falls back to an empty string when imageUrl is undefined and there are no color options', () => {
        const dto = {
          ...apiPhoneDetailFixtures,
          imageUrl: undefined as unknown as string,
          colorOptions: [],
        }
        const mapped = mapPhone(dto)
        expect(mapped.imageUrl).toBe('')
      })
    })

    it('does not mutate the input DTO', () => {
      const dto = { ...apiPhoneDetailFixtures }
      const snapshot = {
        ...dto,
        specs: { ...dto.specs },
        colorOptions: [...dto.colorOptions],
        storageOptions: [...dto.storageOptions],
        similarProducts: [...dto.similarProducts],
      }
      mapPhone(dto)
      expect(dto).toEqual(snapshot)
    })
  })
})
