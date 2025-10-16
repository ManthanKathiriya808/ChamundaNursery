import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, A11y, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import ProductCard from './ProductCard.jsx'

export default function RelatedCarousel({ items = [] }) {
  return (
    <section aria-labelledby="related-heading" className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 id="related-heading" className="font-display text-lg md:text-xl font-semibold">Related Products</h3>
      </div>
      <Swiper
        modules={[Pagination, A11y, Autoplay]}
        pagination={{ clickable: true }}
        a11y={{ enabled: true }}
        loop={items.length > 4}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        spaceBetween={12}
        breakpoints={{
          0: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="rounded-xl overflow-hidden"
      >
        {items.map((p) => (
          <SwiperSlide key={p.id || p._id}>
            <ProductCard id={p.id || p._id} name={p.name} price={p.price} image={p.image} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}