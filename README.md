# Chamunda Nursery – Modern E‑Commerce Frontend

A modern plant and gardening store frontend implementing advanced e‑commerce UX with accessibility, dynamic data, animations, and admin tools.

## Highlights
- Recently Viewed products with dynamic API + local fallback
- Testimonials with animated cards and ARIA‑compliant semantics
- Animated popups/snackbars with `framer-motion` and `aria-live`
- Admin dashboard with Bulk Upload page (CSV)
- SEO‑optimized Blog listing with structured data (JSON‑LD)
- Plant Care section with interactive, accessible guides
- Skeletons and smooth animations for all async content

## Tech Stack
- Frontend: Vite + React 18, TailwindCSS
- Animations: `framer-motion`
- SEO: `react-helmet-async`
- Accessibility: ARIA roles/attributes and keyboard‑friendly patterns

## Quick Start
- Requirements: Node.js 18+ and npm

1) Install dependencies:
   - Frontend: `cd frontend && npm install`
   - Backend (optional): `cd backend && npm install`

2) Configure environment:
   - In `frontend/.env` set `VITE_API_URL` to your backend base URL, e.g. `http://localhost:4000`
   - The app gracefully falls back to mock data if the API is offline.

3) Run dev:
   - Frontend: `npm run dev` inside `frontend/`
   - Backend: `npm run dev` inside `backend/` (if available)

4) Build:
   - Frontend: `npm run build && npm run preview`

## Dynamic Data & API Config
- Configure `frontend/.env`:
  - `VITE_API_URL=https://your-api.example`
- API client: `frontend/src/services/api.js`
  - `fetchProducts`, `fetchProductById`, `fetchProductsByIds`
  - `fetchTestimonials`, `fetchBlogPosts`, `fetchCareGuides`
  - `fetchRecentlyViewed`, `recordRecentlyViewed`
  - `uploadProductsBulk` (CSV)
- Fallbacks:
  - When the API is unavailable, mock data or localStorage is used to keep the UI interactive.

## Animations Setup
- Library: `framer-motion`
- Global patterns:
  - Respect user preference with `useReducedMotion`
  - Use `AnimatePresence` for dismissible UI (toasts)
  - Staggered grids for product lists and cards
- Examples:
  - `components/ToastProvider.jsx`: animated snackbars
  - `components/Testimonials.jsx`: animated card entries
  - `components/RecentlyViewed.jsx`: staggered product grid
  - `pages/Catalog.jsx` and `components/CollectionGrid.jsx`: animated sections

## Animated Components Guide
The frontend now includes reusable, accessible animation primitives inspired by Magic UI, React Bits, and powered by `framer-motion`. Use these to add world-class scroll/hover/reveal patterns across pages.

- `components/animations/ScrollReveal.jsx`
  - Purpose: Intersection-based fade/slide-in with reduced-motion support.
  - Props: `as` (semantic tag), `variant` (`fade`, `fadeUp`, `fadeLeft`, `fadeRight`), `duration`, `delay`, `staggerChildren`, `once`, `amount`, `className`.
  - Example:
    ```jsx
    import ScrollReveal from './src/components/animations/ScrollReveal'

    <ScrollReveal as="section" variant="fadeUp" className="page-container">
      <h2 className="heading-section">Featured Plants</h2>
      <div className="grid gap-4 md:grid-cols-3">{/* cards */}</div>
    </ScrollReveal>
    ```

- `components/animations/ParallaxBanner.jsx`
  - Purpose: Subtle parallax background image with overlay; disabled when `prefers-reduced-motion`.
  - Example:
    ```jsx
    <ParallaxBanner imageSrc="/hero.jpg" className="mt-8">
      <div className="h-full flex items-end p-6">
        <h2 className="heading-section text-white">Seasonal Collection</h2>
      </div>
    </ParallaxBanner>
    ```

- `components/ui/VideoHero.jsx`
  - Purpose: Autoplay muted looping hero video with gradient overlay and CTA.
  - Example:
    ```jsx
    <VideoHero
      videoSrc="/demo/care-clip.mp4"
      poster="/demo/poster.jpg"
      heading="Nurture Your Green Space"
      subheading="Premium plants, pots, and care delivered with love."
      ctaText="Explore Catalog"
      onCtaClick={() => navigate('/catalog')}
    />
    ```

- `components/ui/SplitSection.jsx`
  - Purpose: Two-column section: animated media on one side, headline + bullets + CTA on the other.
  - Example:
    ```jsx
    <SplitSection
      title="Everything for plant parents"
      bullets={["Premium nursery-grown plants", "Curated tools and pots", "Fast delivery"]}
      ctaText="Shop Now"
      onCtaClick={() => navigate('/catalog')}
      media={<img src="/demo/plant.jpg" alt="Healthy indoor plant" className="w-full h-auto" />}
    />
    ```

- `components/ui/Accordion.jsx`
  - Purpose: Accessible accordion with smooth height animation and icons from `react-icons`.
  - Usage (FAQ):
    ```jsx
    <Accordion
      items=[
        { id: 'shipping', title: 'What is the delivery time?', content: <p>2–5 days in most cities.</p> },
        { id: 'care', title: 'Do plants include a care guide?', content: <p>Yes, a quick-start guide is included.</p> }
      ]
    />
    ```

- `components/ui/TestimonialCarousel.jsx`
  - Purpose: Auto-gliding, swipeable testimonials with reduced-motion support.
  - Example:
    ```jsx
    <TestimonialCarousel className="mt-8" />
    ```

### Extend & Customize
- Variants: Add/adjust reveal variants or durations via `ScrollReveal` props.
- Tailwind: Customize keyframes/animation utilities in `frontend/tailwind.config.cjs` (`fadeIn*` and `zIndex` scale are provided).
- Reduced motion: All components respect `prefers-reduced-motion`; avoid heavy parallax or spring effects when it’s on.
- Semantics: Prefer `as="section"`, `as="article"`, and include `aria-label` or `aria-labelledby` where appropriate.

### Add/Edit/Remove Animated Sections
- Add: Wrap new content blocks with `ScrollReveal` or use `SplitSection`/`ParallaxBanner` directly. Keep headings as semantic `<h2>`–`<h3>`.
- Edit: Tweak `variant`, `delay`, and layout classes; for carousels, adjust `intervalMs` or replace dummy data.
- Remove: Simply remove the wrapper/component; content remains with static layout.
- Replace assets: Swap demo images, video clips, and testimonials in the component props or the dummy arrays.

### Performance Tips
- Use grid/container-level `ScrollReveal` to avoid animating too many children individually.
- Prefer `once` for sections that don’t need repeat animations.
- Keep parallax subtle; heavy transforms can be disorienting. Always test with reduced motion.

## Accessibility & ARIA
- Toasts: `aria-live="polite"` + `role="alert"` with manual dismiss button
- Lists: `role="list"` and `role="listitem"` for semantic grouping
- Disclosure/Accordion: `aria-expanded`, `aria-controls`, `role="region"` on Care guides
- Forms: labels via `htmlFor`, focus rings, keyboard accessibility everywhere
- Images: meaningful `alt` text with `ImageLazy.jsx`

## Admin – Bulk Upload
- Page: `frontend/src/admin/BulkUpload.jsx`
- Route: `/admin/bulk-upload`
- CSV fields: `name,price,category,image,description`
- Endpoint: `POST /api/admin/products/bulk`
- Demo mode fallback returns a result stub for preview.

## SEO – Blog
- Page: `frontend/src/pages/Blog.jsx`
- Data: `fetchBlogPosts()` from API
- Structured Data: ItemList JSON‑LD via `<Helmet>`
- Canonical link and descriptive meta

## Plant Care Guides
- Page: `frontend/src/pages/Care.jsx`
- Data: `fetchCareGuides()` (filter by difficulty)
- Accessible disclosure pattern with keyboard and ARIA support

## Theme Customization (Fonts & Colors)
- Tailwind config: `frontend/tailwind.config.cjs`
  - Update `theme.colors` to tune brand `primary`, `accent`, etc.
- Global styles: `frontend/src/styles/index.css`
  - Buttons (`.btn`), surfaces (`.surface`), headings (`.heading-section`)
- Fonts:
  - Add Google Fonts imports in `frontend/index.html` or CSS
  - Update Tailwind `fontFamily` for `display` and `body`

## Deployment
- Static hosting:
  - Build with `npm run build` in `frontend/` and deploy `dist/` to Netlify/Vercel/S3
- Full‑stack:
  - Host backend at `VITE_API_URL`, ensure CORS configured
  - Configure environment for production in `frontend/.env`

## File Pointers (Advanced Patterns & Comments)
- `components/ToastProvider.jsx` – animated snackbars with ARIA and comments
- `components/Testimonials.jsx` – motion, skeletons, ARIA region
- `components/RecentlyViewed.jsx` – staggered grid, API fallback
- `admin/BulkUpload.jsx` – accessible file upload + result live region
- `pages/Blog.jsx` – SEO meta + JSON‑LD structured data
- `pages/Care.jsx` – disclosure pattern and animated steps

## Notes
- All new components include inline comments explaining advanced patterns (animation, state, ARIA).
- When the backend is not available, the app continues with sensible mock data to support UX testing.