import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import "swiper/css/effect-cards";

import { cn } from "../lib/utils.js";
import { useStaggerAnimation } from "../hooks/useScrollAnimation.js";

const ProductCarousel = ({ 
  products = [], 
  className = "",
  showPagination = true,
  showNavigation = false,
  loop = true,
  autoplay = true,
  spaceBetween = 0,
}) => {
  // Animation hook for scroll-triggered carousel animation
  const carouselAnimation = useStaggerAnimation();
  const css = `
  .ProductCarousel {
    width: 100%;
    height: 500px;
    padding-bottom: 50px !important;
  }
  
  .ProductCarousel .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 380px;
  }

  .swiper-pagination-bullet {
    background-color: #059669 !important;
  }

  .product-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }

  .product-card:hover {
    transform: translateY(-5px);
  }
`;

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No products available</p>
      </div>
    );
  }

  return (
    <motion.div 
      ref={carouselAnimation.ref}
      variants={carouselAnimation.containerVariants}
      initial="hidden"
      animate={carouselAnimation.inView ? "visible" : "hidden"}
      className={cn("relative w-full max-w-6xl mx-auto px-5", className)}
    >
      <style>{css}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Swiper
          spaceBetween={spaceBetween}
          autoplay={
            autoplay
              ? {
                  delay: 3000,
                  disableOnInteraction: false,
                }
              : false
          }
          effect="coverflow"
          grabCursor={true}
          slidesPerView="auto"
          centeredSlides={true}
          loop={loop && products.length > 3}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={
            showPagination
              ? {
                  clickable: true,
                }
              : false
          }
          navigation={
            showNavigation
              ? {
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }
              : false
          }
          className="ProductCarousel"
          modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
        >
          {products.map((product, index) => (
            <SwiperSlide key={product.id || index} className="">
              <motion.div 
                variants={carouselAnimation.itemVariants}
                className="product-card h-full"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    className="h-full w-full object-cover"
                    src={product.image || '/img.webp'}
                    alt={product.name || 'Product'}
                    onError={(e) => {
                      e.target.src = '/img.webp';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-xl text-gray-900 mb-3 line-clamp-2">
                    {product.name || 'Product Name'}
                  </h3>
                  <p className="text-gray-600 text-base mb-4 line-clamp-3">
                    {product.description || 'Beautiful plant for your garden'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ₹{product.price || '0'}
                    </span>
                    <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors text-base font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
          {showNavigation && (
            <div>
              <div className="swiper-button-next after:hidden">
                <ChevronRightIcon className="h-6 w-6 text-white" />
              </div>
              <div className="swiper-button-prev after:hidden">
                <ChevronLeftIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          )}
        </Swiper>
      </motion.div>
    </motion.div>
  );
};

export default ProductCarousel;