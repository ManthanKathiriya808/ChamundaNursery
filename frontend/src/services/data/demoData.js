// Demo data for dynamic rendering across the app.
// Replace or extend these structures when wiring to a real backend.
// Each section includes a clear placeholder schema and minimal realistic content.

export const demoProducts = [
  {
    id: 'p-1001',
    slug: 'areca-palm-medium',
    name: 'Areca Palm (Medium)',
    price: 699,
    mrp: 899,
    currency: 'INR',
    images: ['/img.webp'],
    thumbnail: '/img.webp',
    tags: ['indoor', 'low-maintenance'],
    category: 'indoor',
    stock: 32,
    rating: 4.6,
    reviewsCount: 38,
    shortDescription: 'Air-purifying indoor palm suited for homes and offices.',
    description: 'The Areca Palm is a popular indoor plant known for its graceful, feather-like fronds and air-purifying capabilities.',
    care: {
      light: 'Bright indirect light',
      water: 'Moderate; keep soil slightly moist',
      humidity: 'Prefers higher humidity',
      fertilizer: 'Balanced NPK once a month during growth',
    },
    variants: [
      { sku: 'AP-M', size: 'Medium', price: 699 },
      { sku: 'AP-L', size: 'Large', price: 1099 },
    ],
  },
  {
    id: 'p-1002',
    slug: 'snake-plant-laurentii',
    name: 'Snake Plant (Laurentii)',
    price: 499,
    mrp: 599,
    currency: 'INR',
    images: ['/img.webp'],
    thumbnail: '/img.webp',
    tags: ['indoor', 'hardy'],
    category: 'indoor',
    stock: 50,
    rating: 4.8,
    reviewsCount: 120,
    shortDescription: 'Extremely hardy plant great for beginners.',
    description: 'Snake Plant is a resilient, low-maintenance plant that tolerates low light and irregular watering.',
    care: {
      light: 'Low to bright indirect',
      water: 'Minimal; let soil dry out',
      humidity: 'Average household',
      fertilizer: 'Balanced NPK every 6–8 weeks',
    },
    variants: [
      { sku: 'SP-S', size: 'Small', price: 399 },
      { sku: 'SP-M', size: 'Medium', price: 499 },
    ],
  },
]

export const demoTestimonials = [
  {
    id: 't-001',
    name: 'Ananya',
    location: 'Ahmedabad',
    rating: 5,
    comment: 'Beautiful plants and fast delivery! My Areca Palm arrived healthy.',
    avatar: '/logo.png',
    date: '2024-11-02',
  },
  {
    id: 't-002',
    name: 'Ravi',
    location: 'Surat',
    rating: 4,
    comment: 'Great selection and helpful care tips. Will buy again.',
    avatar: '/logo.png',
    date: '2024-09-12',
  },
]

export const demoBlogs = [
  {
    id: 'b-001',
    slug: 'beginner-indoor-plants',
    title: 'Beginner Indoor Plants: Top 5 Picks',
    excerpt: 'Start your plant journey with these easy-care favorites.',
    coverImage: '/img.webp',
    author: 'Chamunda Nursery Team',
    publishedAt: '2024-10-20',
    tags: ['indoor', 'beginner'],
    content: 'These plants thrive with minimal fuss and brighten any space.',
  },
  {
    id: 'b-002',
    slug: 'winter-care-guide',
    title: 'Winter Care Guide for Houseplants',
    excerpt: 'Protect your plants from cold drafts and overwatering.',
    coverImage: '/img.webp',
    author: 'Chamunda Nursery Experts',
    publishedAt: '2024-12-05',
    tags: ['care', 'seasonal'],
    content: 'Adjust watering and light to keep plants happy in winter.',
  },
]

export const demoCareGuides = [
  {
    id: 'c-001',
    slug: 'areca-palm-care',
    title: 'Areca Palm Care Guide',
    coverImage: '/img.webp',
    sections: [
      { heading: 'Light', body: 'Bright indirect light is ideal.' },
      { heading: 'Water', body: 'Keep soil slightly moist; avoid soggy roots.' },
      { heading: 'Fertilizer', body: 'Use balanced fertilizer monthly during growth.' },
    ],
  },
  {
    id: 'c-002',
    slug: 'snake-plant-care',
    title: 'Snake Plant Care Guide',
    coverImage: '/img.webp',
    sections: [
      { heading: 'Light', body: 'Tolerates low to bright indirect light.' },
      { heading: 'Water', body: 'Let soil dry out between waterings.' },
      { heading: 'Fertilizer', body: 'Every 6–8 weeks during active growth.' },
    ],
  },
]

export const demoCollections = [
  {
    id: 'col-001',
    title: 'Indoor Bestsellers',
    slug: 'indoor-bestsellers',
    image: '/img.webp',
    productIds: ['p-1001', 'p-1002'],
  },
]

export const demoHeroSlides = [
  {
    id: 1,
    heading: 'Discover Premium Greens',
    subheading: 'Handpicked plants and expert care tips.',
    ctaText: 'Shop the Catalog',
    ctaHref: '/catalog',
    // Include video to match default carousel behavior
    videoSrc: '/3816531-uhd_3840_2160_30fps.mp4',
    poster: '/img.webp',
    imageSrc: '/img.webp',
  },
  {
    id: 2,
    heading: 'Indoor Plant Picks',
    subheading: 'Low-maintenance beauties for homes and offices.',
    ctaText: 'Explore Indoor',
    ctaHref: '/catalog?category=indoor',
    imageSrc: '/img.webp',
  },
]

export const demoOrders = [
  {
    id: 'o-0001',
    status: 'Processing',
    createdAt: '2025-01-10T10:35:00Z',
    items: [
      { productId: 'p-1001', name: 'Areca Palm (Medium)', qty: 1, price: 699 },
      { productId: 'p-1002', name: 'Snake Plant (Laurentii)', qty: 2, price: 499 },
    ],
    total: 1697,
    currency: 'INR',
    shipping: { name: 'Ananya', address: 'Navrangpura, Ahmedabad', phone: '+91 90000 00000' },
  },
]

export const demoUser = {
  id: 'u-100',
  name: 'Demo User',
  email: 'demo@chamunda.nursery',
  phone: '+91 90000 00000',
  avatar: '/logo.png',
}

// Placeholder schemas (JSDoc) for quick reference when wiring APIs
/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {number} price
 * @property {number} mrp
 * @property {string} currency
 * @property {string[]} images
 * @property {string} thumbnail
 * @property {string[]} tags
 * @property {string} category
 * @property {number} stock
 * @property {number} rating
 * @property {number} reviewsCount
 * @property {string} shortDescription
 * @property {string} description
 * @property {{light:string,water:string,humidity?:string,fertilizer?:string}} care
 * @property {{sku:string,size:string,price:number}[]} variants
 */

/**
 * @typedef {Object} Testimonial
 * @property {string} id
 * @property {string} name
 * @property {string} location
 * @property {number} rating
 * @property {string} comment
 * @property {string} avatar
 * @property {string} date
 */

/**
 * @typedef {Object} BlogPost
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} excerpt
 * @property {string} coverImage
 * @property {string} author
 * @property {string} publishedAt
 * @property {string[]} tags
 * @property {string} content
 */

/**
 * @typedef {Object} CareGuide
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} coverImage
 * @property {{heading:string,body:string}[]} sections
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} status
 * @property {string} createdAt
 * @property {{productId:string,name:string,qty:number,price:number}[]} items
 * @property {number} total
 * @property {string} currency
 * @property {{name:string,address:string,phone:string}} shipping
 */