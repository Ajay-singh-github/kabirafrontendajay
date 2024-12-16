import React, { useState } from 'react';


import lamp1 from '../assets/portfolio/lamp1.svg';
import lamp2 from '../assets/portfolio/lamp2.svg';
import lamp3 from '../assets/portfolio/lamp3.svg';
import lamp4 from '../assets/portfolio/lamp4.svg';
import lamp5 from '../assets/portfolio/lamp5.svg';
import lamp6 from '../assets/portfolio/lamp6.svg';
import lamp7 from '../assets/portfolio/lamp7.svg';
import lamp8 from '../assets/portfolio/lamp8.svg';
import lamp9 from '../assets/portfolio/lamp9.svg';


import ShowMore from './ShowMore';

const images = [
  lamp1,
  lamp2,
  lamp3,
  lamp4,
  lamp5,
  lamp6,
  lamp7,
  lamp8,
  lamp9,
];

const Portfolio = () => {
  const [visibleImages, setVisibleImages] = useState(images.slice(0, 8)); 
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    if (showMore) {
      setVisibleImages(images.slice(0, 8)); 
    } else {
      setVisibleImages(images); 
    }
    setShowMore(!showMore);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <section className="py-12 px-6 sm:px-10 lg:px-20">
  <h2 className="text-3xl sm:text-[39px] font-semibold text-[#2E2F33]">
    Design inspiration and modern home ideas
  </h2>
  
  {/* Category Buttons */}
  <div className="flex flex-wrap gap-5 mt-6 mb-6 py-2 overflow-x-auto">
    {['All', 'Wood', 'Iron', 'Ken', 'Mix', 'Glass & Crystal', 'Paper', 'Fabric', 'Printed'].map((category) => (
      <button
        key={category}
        className={`font-semibold py-3 px-8 sm:py-5 sm:px-12 rounded-full cursor-pointer transition-colors duration-150 ${
          selectedCategory === category ? 'bg-[#7C71DF] text-white' : 'bg-[#F8F7FB] text-black'
        }`}
        onClick={() => handleCategoryClick(category)}
      >
        {category}
      </button>
    ))}
  </div>

  {/* Image Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
    {visibleImages.map((image, index) => (
      <div key={index} className="relative overflow-hidden">
        <img
          src={image}
          alt={`Lamp ${index + 1}`}
          className="w-full transition-transform duration-300 hover:scale-105"
        />
      </div>
    ))}
  </div>

  <ShowMore current={visibleImages.length} total={images.length} onShowMore={handleShowMore} />
</section>

  );
};

export default Portfolio;