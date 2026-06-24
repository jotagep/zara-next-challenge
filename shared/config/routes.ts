export const ROUTES = {
  home: '/',
  cart: '/cart',
  phone: (id: string) => `/phone/${encodeURIComponent(id)}`,
  catalog: (params: { search?: string } = {}) => {
    const search = params.search?.trim()
    if (!search) return '/'
    return `/?${SEARCH_PARAM}=${encodeURIComponent(search)}`
  },
}

export const SEARCH_PARAM = 's'
