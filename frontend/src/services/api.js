// Simple API client wired to backend, with mock fallback for development
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const TOKEN_KEY = 'auth.token'

const MOCK_PRODUCTS = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: `Demo Plant ${i + 1}`,
  price: 299 + i * 50,
  image: '/logo.png',
  category: i % 2 === 0 ? 'indoor' : 'outdoor',
  rating: 4.4,
  reviews: 20 + i,
}))

// Mock testimonials for accessible social proof
const MOCK_TESTIMONIALS = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  name: `Happy Gardener ${i + 1}`,
  location: ['Pune', 'Mumbai', 'Delhi', 'Bengaluru'][i % 4],
  rating: 4 + (i % 2),
  comment: 'Beautiful plants and quick delivery. Highly recommended! 🌿',
  avatar: '/logo.png',
}))

// Mock blog posts with SEO-friendly fields
const MOCK_BLOG_POSTS = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  slug: `plant-care-guide-${i + 1}`,
  title: `Plant Care Guide ${i + 1}`,
  excerpt: 'Learn tips and tricks to keep your plants healthy.',
  coverImage: '/logo.png',
  tags: ['care', 'indoor', 'beginner'].slice(0, (i % 3) + 1),
  publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
}))

// Mock care guides with interactive steps
const MOCK_CARE_GUIDES = Array.from({ length: 5 }).map((_, i) => ({
  id: i + 1,
  title: ['Watering Basics', 'Sunlight Needs', 'Soil & Repotting', 'Fertilizing', 'Pest Control'][i],
  difficulty: ['beginner', 'beginner', 'intermediate', 'intermediate', 'advanced'][i],
  steps: [
    { id: 's1', label: 'Read guide overview' },
    { id: 's2', label: 'Follow step-by-step instructions' },
    { id: 's3', label: 'Mark steps as done' },
  ],
}))

async function request(path, options = {}) {
  const token = (() => {
    try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
  })()
  const baseHeaders = { 'Content-Type': 'application/json' }
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}
  const mergedHeaders = { ...baseHeaders, ...authHeaders, ...(options.headers || {}) }
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: mergedHeaders,
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

export async function fetchProductsByIds(ids = []) {
  if (!Array.isArray(ids) || ids.length === 0) return []
  try {
    const query = new URLSearchParams({ ids: ids.join(',') }).toString()
    const res = await request(`/api/products/by-ids?${query}`)
    if (!res.ok) throw new Error(`Failed to fetch products by ids: ${res.status}`)
    return res.json()
  } catch (e) {
    console.warn('API unavailable, using mock products by ids', e)
    return ids
      .map((id) => MOCK_PRODUCTS.find((p) => String(p.id) === String(id)))
      .filter(Boolean)
  }
}

export async function fetchTestimonials(limit = 6) {
  try {
    const params = new URLSearchParams({ limit }).toString()
    const res = await request(`/api/testimonials?${params}`)
    if (!res.ok) throw new Error(`Failed to fetch testimonials: ${res.status}`)
    return res.json()
  } catch (e) {
    console.warn('API unavailable, using mock testimonials', e)
    return MOCK_TESTIMONIALS.slice(0, limit)
  }
}

export async function fetchBlogPosts({ limit = 6, tag } = {}) {
  try {
    const params = new URLSearchParams(
      Object.entries({ limit, tag }).filter(([, v]) => v != null && v !== '')
    ).toString()
    const res = await request(`/api/blog?${params}`)
    if (!res.ok) throw new Error(`Failed to fetch blog posts: ${res.status}`)
    return res.json()
  } catch (e) {
    console.warn('API unavailable, using mock blog posts', e)
    let list = MOCK_BLOG_POSTS.slice(0, limit)
    if (tag) list = list.filter((p) => p.tags.includes(tag))
    return list
  }
}

export async function fetchCareGuides({ limit = 10, difficulty } = {}) {
  try {
    const params = new URLSearchParams(
      Object.entries({ limit, difficulty }).filter(([, v]) => v != null && v !== '')
    ).toString()
    const res = await request(`/api/care-guides?${params}`)
    if (!res.ok) throw new Error(`Failed to fetch care guides: ${res.status}`)
    return res.json()
  } catch (e) {
    console.warn('API unavailable, using mock care guides', e)
    let list = MOCK_CARE_GUIDES.slice(0, limit)
    if (difficulty) list = list.filter((g) => g.difficulty === difficulty)
    return list
  }
}

export async function fetchRecentlyViewed({ userId } = {}) {
  // If backend is unavailable, use localStorage as a fallback store
  try {
    const params = new URLSearchParams(
      Object.entries({ userId }).filter(([, v]) => v != null && v !== '')
    ).toString()
    const res = await request(`/api/recently-viewed?${params}`)
    if (!res.ok) throw new Error(`Failed to fetch recently viewed: ${res.status}`)
    return res.json()
  } catch (e) {
    console.warn('API unavailable, using localStorage recently viewed', e)
    const raw = localStorage.getItem('recently_viewed_ids')
    const ids = raw ? JSON.parse(raw) : []
    return fetchProductsByIds(ids)
  }
}

export async function recordRecentlyViewed(productId, { userId } = {}) {
  try {
    const res = await request(`/api/recently-viewed`, {
      method: 'POST',
      body: JSON.stringify({ productId, userId }),
    })
    if (!res.ok) throw new Error(`Failed to record recently viewed: ${res.status}`)
    return res.json()
  } catch (e) {
    console.warn('API unavailable, writing to localStorage recently viewed', e)
    const raw = localStorage.getItem('recently_viewed_ids')
    const ids = raw ? JSON.parse(raw) : []
    const next = [String(productId), ...ids.filter((id) => String(id) !== String(productId))].slice(0, 12)
    localStorage.setItem('recently_viewed_ids', JSON.stringify(next))
    return { ok: true }
  }
}

export async function uploadProductsBulk(file) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const token = (() => { try { return localStorage.getItem(TOKEN_KEY) } catch { return null } })()
    const res = await fetch(`${BASE_URL}/api/admin/products/bulk`, {
      method: 'POST',
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    if (!res.ok) throw new Error(`Failed to upload bulk products: ${res.status}`)
    return res.json()
  } catch (e) {
    console.warn('Bulk upload failed; returning mock result', e)
    return { imported: 0, errors: [{ line: 1, message: 'Demo mode' }] }
  }
}

// --- Auth-aware endpoints ---
export async function fetchUser() {
  // Frontend stores user in localStorage after login; return it for quick access
  try {
    const raw = localStorage.getItem('auth.user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function fetchOrders() {
  const res = await request('/api/orders')
  if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`)
  return res.json()
}

export async function upsertProduct(product) {
  if (product?.id) {
    const res = await request(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    })
    if (!res.ok) throw new Error(`Failed to update product: ${res.status}`)
    return res.json()
  }
  const res = await request('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(product),
  })
  if (!res.ok) throw new Error(`Failed to create product: ${res.status}`)
  return res.json()
}

export async function deleteProduct(productId) {
  const res = await request(`/api/admin/products/${productId}`, { method: 'DELETE' })
  if (!res.ok && res.status !== 204) throw new Error(`Failed to delete product: ${res.status}`)
  return { ok: true }
}