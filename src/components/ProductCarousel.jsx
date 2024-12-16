import React, { useState } from 'react';
import ProductCard from './ProductCard';
import leftArrow from '../assets/icons/arrowleft.svg';
import rightArrow from '../assets/icons/arrowright.svg';

const ProductCarousel = ({ products }) => {
  const itemsPerPage = 4; // Number of items to show per slide
  const totalProducts = Math.min(products.length, 12); // Only show up to 12 products
  const [carouselIndex, setCarouselIndex] = useState(0);

  const handlePrevSlide = () => {
    setCarouselIndex((prev) => (prev === 0 ? totalProducts - itemsPerPage : prev - itemsPerPage));
  };

  const handleNextSlide = () => {
    setCarouselIndex((prev) => (prev + itemsPerPage >= totalProducts ? 0 : prev + itemsPerPage));
  };

  // Create a sliced array to only show up to 12 products
  const displayedProducts = products.slice(0, totalProducts);

  return (
    <div className="relative overflow-hidden px-20 py-20"> {/* Prevent horizontal scroll */}
      <div className="flex items-center mb-8">
        <h6 className="text-2xl font-semibold text-gray-900 mr-auto">
          People Also Viewed
        </h6>
        <div className="flex gap-4">
          <button
            onClick={handlePrevSlide}
            className="p-2 bg-gray-100 rounded-full opacity-50 hover:opacity-100"
          >
            <img src={leftArrow} alt="Left Arrow" />
          </button>
          <button
            onClick={handleNextSlide}
            className="p-2 bg-gray-100 rounded-full opacity-50 hover:opacity-100"
          >
            <img src={rightArrow} alt="Right Arrow" />
          </button>
        </div>
      </div>

      <div
        className="flex gap-8 transition-transform duration-500"
        style={{ transform: `translateX(-${carouselIndex * (100 / itemsPerPage)}%)` }}
      >
        {displayedProducts.map((product, index) => (
          <div key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
