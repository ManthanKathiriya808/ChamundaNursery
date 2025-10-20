// Catalog page with multi-level filters and responsive product grid
import React, { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '../components/animations/ScrollReveal.jsx'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductCardSkeleton } from '../components/Skeleton.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useData } from '../context/DataProvider.jsx'
import { 
  useProducts, 
  useCategories, 
  useApiError 
} from '../hooks/usePublicData.js'
import { 
  ProductGridSkeleton, 
  ErrorState 
} from '../components/LoadingSkeletons.jsx'

export default function Catalog() {
  const [params] = useSearchParams()
  const activeCategory = params.get('category')
  const [sort, setSort] = useState('popular')
  const [page, setPage] = useState(1)
  const [openGroups, setOpenGroups] = useState({})

  // Dynamic API data
  const { 
    data: productsData, 
    isLoading: productsLoading, 
    error: productsError,
    refetch: refetchProducts 
  } = useProducts({ 
    category: activeCategory, 
    sort, 
    page,
    limit: 20 
  })

  const { 
    data: categoriesData, 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useCategories()

  // Error handling
  const productsErrorInfo = useApiError(productsError)
  const categoriesErrorInfo = useApiError(categoriesError)

  // Memoized data processing - use only dynamic API data
  const products = useMemo(() => {
    const productList = productsData?.products || []
    return Array.isArray(productList) ? productList : []
  }, [productsData?.products])

  const categories = useMemo(() => {
    if (categoriesData?.categories && categoriesData.categories.length > 0) {
      // Build hierarchical structure from API data
      const categoryMap = new Map()
      const rootCategories = []
      
      // First pass: create all categories
      categoriesData.categories.forEach(cat => {
        if (cat.status === 'active') { // Only include active categories
          categoryMap.set(cat.id, { ...cat, children: [] })
        }
      })
      
      // Second pass: build hierarchy
      categoriesData.categories.forEach(cat => {
        if (cat.status === 'active' && cat.parent_id) {
          const parent = categoryMap.get(cat.parent_id)
          const child = categoryMap.get(cat.id)
          if (parent && child) {
            parent.children.push(child)
          }
        } else if (cat.status === 'active' && !cat.parent_id) {
          rootCategories.push(categoryMap.get(cat.id))
        }
      })
      
      // Convert to the expected format for rendering
      const result = {}
      rootCategories.forEach(rootCat => {
        if (rootCat.children.length > 0) {
          result[rootCat.name] = rootCat.children
        } else {
          // If no children, show the root category itself
          result[rootCat.name] = [rootCat]
        }
      })
      
      return result
    }
    // Fallback to static categories
    return {
      Plants: ['indoor', 'outdoor', 'bonsai', 'fruits', 'vegetables'],
      Supplies: ['tools', 'seeds', 'pots']
    }
  }, [categoriesData?.categories])

  // Initialize open groups when categories load
  useEffect(() => {
    if (Object.keys(categories).length > 0) {
      setOpenGroups(prev => {
        const newGroups = Object.keys(categories).reduce((acc, k) => ({ 
          ...acc, 
          [k]: prev[k] !== undefined ? prev[k] : true 
        }), {})
        return newGroups
      })
    }
  }, [categories])

  const isLoading = productsLoading || categoriesLoading
  const hasError = productsErrorInfo || categoriesErrorInfo

  return (
    <div className="page-container grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Helmet>
        <title>Catalog • Chamunda Nursery</title>
        <meta name="description" content="Browse plants and gardening supplies" />
      </Helmet>

      {/* Page intro / dynamic heading */}
      <div className="lg:col-span-4 -mt-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="rounded-xl border border-neutral-200 bg-white p-4 md:p-5 shadow-soft"
        >
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-neutral-900">
            {activeCategory ? String(activeCategory).charAt(0).toUpperCase() + String(activeCategory).slice(1) : 'All Products'}
          </h1>
          <p className="text-neutral-700 text-sm md:text-base mt-1">Explore curated plants and gardening essentials. Use filters to refine your selection.</p>
        </motion.div>
      </div>

      {/* Filters sidebar */}
      <aside className="lg:col-span-1 space-y-4" aria-label="Filters">
        {categoriesLoading ? (
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-3 bg-neutral-100 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        ) : categoriesErrorInfo ? (
          <ErrorState
            title="Failed to load categories"
            message={categoriesErrorInfo.message}
            onRetry={() => window.location.reload()}
            compact
          />
        ) : (
          Object.entries(categories).map(([group, items]) => (
            <ScrollReveal key={group} variant="fadeUp" className="rounded-lg border border-neutral-200 bg-white">
              <button
                className="w-full flex items-center justify-between px-4 py-3"
                aria-expanded={openGroups[group]}
                onClick={() => setOpenGroups((o) => ({ ...o, [group]: !o[group] }))}
              >
                <span className="font-semibold text-base md:text-lg">{group}</span>
                <span className={`transition-transform duration-300 ${openGroups[group] ? 'rotate-180' : 'rotate-0'}`}>▾</span>
              </button>
              <motion.ul
                initial={false}
                animate={openGroups[group] ? 'open' : 'collapsed'}
                variants={{ open: { height: 'auto', opacity: 1 }, collapsed: { height: 0, opacity: 0 } }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="overflow-hidden px-4 pb-3 space-y-2"
              >
                {(Array.isArray(items) ? items : []).map((item) => {
                  const itemSlug = typeof item === 'object' ? item.slug : item
                  const itemName = typeof item === 'object' ? item.name : item
                  return (
                    <li key={itemSlug}>
                      <Link 
                        className={`link-hover ${activeCategory === itemSlug ? 'text-primary font-semibold' : ''}`} 
                        to={`/catalog?category=${itemSlug}`}
                      >
                        {itemName[0].toUpperCase() + itemName.slice(1)}
                      </Link>
                    </li>
                  )
                })}
              </motion.ul>
            </ScrollReveal>
          ))
        )}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="rounded-lg border border-neutral-200 bg-white p-4"
        >
          <h3 className="font-semibold mb-2">Sort</h3>
          <select 
            className="input input-bordered w-full" 
            value={sort} 
            onChange={(e) => setSort(e.target.value)} 
            aria-label="Sort products"
          >
            <option value="popular">Most Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="name">Name A-Z</option>
          </select>
        </motion.div>
      </aside>

      {/* Product grid */}
      <section className="lg:col-span-3" aria-label="Products">
        {productsErrorInfo && (
          <ErrorState
            title="Failed to load products"
            message={productsErrorInfo.message}
            onRetry={refetchProducts}
            className="mb-6"
          />
        )}
        
        {isLoading ? (
          <ProductGridSkeleton count={12} />
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-neutral-400 text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-neutral-700 mb-2">
              {activeCategory ? 'No products in this category' : 'No products found'}
            </h3>
            <p className="text-neutral-500">
              {activeCategory ? 'Try browsing other categories or check back later.' : 'Check back later for new arrivals.'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-neutral-600">
                Showing {products.length} {products.length === 1 ? 'product' : 'products'}
                {activeCategory && ` in ${activeCategory}`}
              </p>
              {productsData?.totalPages > 1 && (
                <p className="text-sm text-neutral-600">
                  Page {page} of {productsData.totalPages}
                </p>
              )}
            </div>
            
            <ScrollReveal variant="fadeUp" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((item) => (
                <ProductCard 
                  key={item.id || item._id} 
                  id={item.id || item._id} 
                  name={item.name} 
                  price={item.price} 
                  image={item.image || item.images?.[0]} 
                  tag={activeCategory ? activeCategory[0].toUpperCase() + activeCategory.slice(1) : undefined}
                  inStock={item.inStock}
                  discount={item.discount}
                />
              ))}
            </ScrollReveal>

            {/* Pagination */}
            {productsData?.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 rounded-md border border-neutral-200 bg-white text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, productsData.totalPages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 rounded-md border ${
                        page === pageNum
                          ? 'border-primary bg-primary text-white'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => setPage(p => Math.min(productsData.totalPages, p + 1))}
                  disabled={page === productsData.totalPages}
                  className="px-3 py-2 rounded-md border border-neutral-200 bg-white text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}