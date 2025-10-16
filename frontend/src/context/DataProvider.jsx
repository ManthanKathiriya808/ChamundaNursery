import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import {
  getProducts,
  getProductById,
  getCollections,
  getTestimonials,
  getBlogs,
  getCareGuides,
  getHeroSlides,
  getUser,
  getOrders,
  upsertProduct,
  deleteProduct,
} from '../services/data/dataSource'

// Central content/state provider for dynamic rendering across the app.
// Pages/components consume via useData() to get lists and helper actions.

const DataContext = createContext(null)

export default function DataProvider({ children }) {
  const [products, setProducts] = useState([])
  const [collections, setCollections] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [blogs, setBlogs] = useState([])
  const [careGuides, setCareGuides] = useState([])
  const [heroSlides, setHeroSlides] = useState([])
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const refreshAll = useCallback(async () => {
    setLoading(true)
    try {
      // Check if user is authenticated before fetching protected data
      const token = localStorage.getItem('auth.token')
      
      // Fetch public data that doesn't require authentication
      const [p, c, t, b, cg, hs] = await Promise.all([
        getProducts(),
        getCollections(),
        getTestimonials(6),
        getBlogs(),
        getCareGuides(),
        getHeroSlides(),
      ])
      
      setProducts(p)
      setCollections(c)
      setTestimonials(t)
      setBlogs(b)
      setCareGuides(cg)
      setHeroSlides(hs)
      
      // Only fetch protected data if authenticated
      if (token) {
        try {
          const [u, o] = await Promise.all([
            getUser(),
            getOrders(),
          ])
          setUser(u)
          setOrders(o)
        } catch (error) {
          // If auth fails, clear the token and reset user state
          console.warn('Authentication failed, clearing token:', error)
          localStorage.removeItem('auth.token')
          setUser(null)
          setOrders([])
        }
      } else {
        setUser(null)
        setOrders([])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshAll()
  }, [refreshAll])

  const addOrUpdateProduct = useCallback(async (product) => {
    const saved = await upsertProduct(product)
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = saved
        return next
      }
      return [saved, ...prev]
    })
    return saved
  }, [])

  const removeProduct = useCallback(async (id) => {
    await deleteProduct(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const getById = useCallback(async (id) => {
    return await getProductById(id)
  }, [])

  const value = useMemo(() => ({
    // state
    products,
    collections,
    testimonials,
    blogs,
    careGuides,
    heroSlides,
    user,
    orders,
    loading,
    // actions
    refreshAll,
    addOrUpdateProduct,
    removeProduct,
    getById,
  }), [products, collections, testimonials, blogs, careGuides, heroSlides, user, orders, loading, refreshAll, addOrUpdateProduct, removeProduct, getById])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}