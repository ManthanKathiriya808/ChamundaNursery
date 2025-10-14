// Data source adapter for swapping between demo data and live API.
// Set VITE_USE_DEMO_DATA=true in .env during development to use local demo data.
// This module centralizes how components/pages load data, ensuring a seamless switch later.

import {
  demoProducts,
  demoTestimonials,
  demoBlogs,
  demoCareGuides,
  demoCollections,
  demoHeroSlides,
  demoOrders,
  demoUser,
} from './demoData'
import * as api from '../../services/api'

const useDemo = import.meta.env.VITE_USE_DEMO_DATA === 'true'

// Helper to simulate latency for demo parity with API UX
const sleep = (ms = 300) => new Promise((res) => setTimeout(res, ms))

// Each getter returns a normalized array/object, regardless of source
export async function getProducts() {
  if (useDemo) {
    await sleep()
    return demoProducts
  }
  const res = await api.fetchProducts?.()
  return Array.isArray(res) ? res : []
}

export async function getProductById(id) {
  if (useDemo) {
    await sleep()
    return demoProducts.find((p) => p.id === id) || null
  }
  const res = await api.fetchProductById?.(id)
  return res || null
}

export async function getCollections() {
  if (useDemo) {
    await sleep()
    return demoCollections
  }
  const res = await api.fetchCollections?.()
  return Array.isArray(res) ? res : []
}

export async function getTestimonials(limit = 6) {
  if (useDemo) {
    await sleep()
    return demoTestimonials.slice(0, limit)
  }
  const res = await api.fetchTestimonials?.(limit)
  return Array.isArray(res) ? res : []
}

export async function getBlogs() {
  if (useDemo) {
    await sleep()
    return demoBlogs
  }
  const res = await api.fetchBlogs?.()
  return Array.isArray(res) ? res : []
}

export async function getCareGuides() {
  if (useDemo) {
    await sleep()
    return demoCareGuides
  }
  const res = await api.fetchCareGuides?.()
  return Array.isArray(res) ? res : []
}

export async function getHeroSlides() {
  if (useDemo) {
    await sleep()
    return demoHeroSlides
  }
  const res = await api.fetchHeroSlides?.()
  return Array.isArray(res) ? res : []
}

export async function getUser() {
  if (useDemo) {
    await sleep()
    return demoUser
  }
  const res = await api.fetchUser?.()
  return res || null
}

export async function getOrders() {
  if (useDemo) {
    await sleep()
    return demoOrders
  }
  try {
    const res = await api.fetchOrders?.()
    return Array.isArray(res) ? res : []
  } catch {
    // If unauthenticated or API unavailable, return empty list gracefully
    return []
  }
}

// Mutation examples
export async function upsertProduct(product) {
  if (useDemo) {
    // In demo mode, return product with id if missing
    return { ...product, id: product.id || `p-${Date.now()}` }
  }
  const res = await api.upsertProduct?.(product)
  return res
}

export async function deleteProduct(productId) {
  if (useDemo) {
    // Demo: pretend deletion succeeded
    return { ok: true }
  }
  const res = await api.deleteProduct?.(productId)
  return res
}