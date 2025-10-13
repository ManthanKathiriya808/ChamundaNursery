// Simple API client wired to backend, with mock fallback for development
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const MOCK_PRODUCTS = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: `Demo Plant ${i + 1}`,
  price: 299 + i * 50,
  image: '/logo.png',
  category: i % 2 === 0 ? 'indoor' : 'outdoor',
  rating: 4.4,
  reviews: 20 + i,
}))

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  return res
}

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams(Object.entries(params).filter(([, v]) => v != null && v !== '')).toString()
  try {
    const res = await request(`/api/products${query ? `?${query}` : ''}`)
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`)
    return res.json()
  } catch (e) {
    console.warn('API unavailable, using mock products', e)
    let list = MOCK_PRODUCTS.slice()
    if (params.category) list = list.filter(p => String(p.category).toLowerCase() === String(params.category).toLowerCase())
    if (params.limit) list = list.slice(0, Number(params.limit))
    return list
  }
}

export async function fetchProductById(id) {
  try {
    const res = await request(`/api/products/${id}`)
    if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`)
    return res.json()
  } catch (e) {
    console.warn('API unavailable, using mock product', e)
    const found = MOCK_PRODUCTS.find(p => String(p.id) === String(id))
    return (
      found || {
        id,
        name: `Demo Plant ${id}`,
        price: 699,
        image: '/logo.png',
        category: 'indoor',
        rating: 4.5,
        reviews: 28,
        description: 'Premium mock plant for preview when backend is unavailable.'
      }
    )
  }
}