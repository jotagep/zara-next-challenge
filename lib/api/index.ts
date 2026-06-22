import type { ApiPhoneDetail, ApiPhoneListResponse } from '@/lib/types/api'
import type { FetchPhonesParams, Phone, PhoneId, PhoneListItem } from '@/lib/types/domain'

import { apiFetch } from './apiClient'
import { mapPhone, mapPhoneListItem } from './mappers'

const PHONES_PATH = '/products'
const REVALIDATE_SECONDS = 60

export const fetchPhones = async (
  { search, limit, offset }: FetchPhonesParams = {},
  options: { signal?: AbortSignal } = {}
): Promise<PhoneListItem[]> => {
  const data = await apiFetch<ApiPhoneListResponse>(
    PHONES_PATH,
    { search, limit, offset },
    {
      signal: options.signal,
      next: { revalidate: REVALIDATE_SECONDS },
    }
  )
  return data.map(mapPhoneListItem)
}

export const fetchPhoneById = async (
  id: PhoneId,
  options: { signal?: AbortSignal } = {}
): Promise<Phone> => {
  const data = await apiFetch<ApiPhoneDetail>(`${PHONES_PATH}/${id}`, undefined, {
    signal: options.signal,
    next: { revalidate: REVALIDATE_SECONDS },
  })
  return mapPhone(data)
}
