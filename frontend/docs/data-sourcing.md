# Data Sourcing via DataProvider

This app centralizes data fetching and state in `DataProvider` so pages and components can render dynamic content consistently without duplicating `useEffect` calls.

## Enable Demo Data

- Set `VITE_USE_DEMO_DATA=true` in `.env` to serve demo products, collections, hero slides, testimonials, blogs, care guides, user, and orders.
- When not set, the provider attempts API functions from `services/api.js` if available; missing endpoints return empty lists gracefully.

## Context API

`useData()` exposes:

- State: `products`, `collections`, `testimonials`, `blogs`, `careGuides`, `heroSlides`, `user`, `orders`, `loading`.
- Actions: `refreshAll()`, `addOrUpdateProduct(product)`, `removeProduct(id)`, `getById(id)`.

## Usage Patterns

- Home hero: `<VideoHeroCarousel slides={heroSlides} />`
- Testimonials: map to carousel items `{ name, quote, role }` from `testimonials`.
- Catalog: filter `products` by category and use `loading` for skeletons.
- Product page: `getById(id)` for the item and compute related from `products`.
- Blog and Care: consume `blogs` and `careGuides`; Care supports both `steps[]` and `sections[]` shapes.
- Admin Products: use `addOrUpdateProduct` and `removeProduct` for CRUD; list from `products`.
- Orders/Profile: read `orders` and `user` from context; still gate by `useUser().user.isAuthenticated`.

## Recently Viewed

- Uses `localStorage` key `recently_viewed_ids` to avoid network calls and stay consistent with `recordRecentlyViewed`.
- `RecentlyViewed` maps IDs to items from `products`.

## Notes

- The provider maintains a single `loading` flag across initial parallel fetches; UI should prefer this over component-level spinners.
- In API mode, only endpoints present in `api.js` are used; others are safe no-ops that yield empty arrays.