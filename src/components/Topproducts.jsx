import React, { useEffect, useState } from 'react';
import ShowMore from './ShowMore'; 
import ProductCard from './ProductCard'; 
import dropdownIcon from '../assets/icons/drop-down.svg';
import { getData } from '../services/FetchNodeServices';

const TopProducts = () => {
  const [allProducts,setAllProducts]=useState([])
   const fetchAllProduct=async()=>{
    const result = await getData("product/get_all_product")
    if(result?.status){
      setAllProducts(result?.data)
    }else{
      alert(result?.status)
    }
   }

   useEffect(()=>{fetchAllProduct()},[])
  // const allProducts = [
  //   { id: 1, name: 'Product 1', price: '$99.99', image: 'path/to/image1.png' },
  //   { id: 2, name: 'Product 2', price: '$89.99', image: 'path/to/image2.png' },
  //   { id: 3, name: 'Product 3', price: '$79.99', image: 'path/to/image3.png' },
  //   { id: 4, name: 'Product 4', price: '$59.99', image: 'path/to/image4.png' },
  //   { id: 5, name: 'Product 5', price: '$49.99', image: 'path/to/image5.png' },
  //   { id: 6, name: 'Product 6', price: '$39.99', image: 'path/to/image6.png' },
  //   { id: 7, name: 'Product 7', price: '$29.99', image: 'path/to/image7.png' },
  //   { id: 8, name: 'Product 8', price: '$19.99', image: 'path/to/image8.png' },
  //   { id: 9, name: 'Product 9', price: '$99.99', image: 'path/to/image9.png' },
  //   { id: 10, name: 'Product 10', price: '$89.99', image: 'path/to/image10.png' },
  //   { id: 11, name: 'Product 11', price: '$79.99', image: 'path/to/image11.png' },
  //   { id: 12, name: 'Product 12', price: '$59.99', image: 'path/to/image12.png' },
  //   { id: 13, name: 'Product 13', price: '$49.99', image: 'path/to/image13.png' },
  //   { id: 14, name: 'Product 14', price: '$39.99', image: 'path/to/image14.png' },
  //   { id: 15, name: 'Product 15', price: '$29.99', image: 'path/to/image15.png' },
  //   { id: 16, name: 'Product 16', price: '$19.99', image: 'path/to/image16.png' },
  // ];

  const [visibleProducts, setVisibleProducts] = useState(allProducts.slice(0, 8));
  const [showAll, setShowAll] = useState(false); 

  const handleShowMoreLess = () => {
    if (showAll) {
      setVisibleProducts(allProducts.slice(0, 8)); 
    } else {
      setVisibleProducts(allProducts); 
    }
    setShowAll(!showAll); 
  };

  return (
      <section className="py-12 px-6 sm:px-10 lg:px-20">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 mt-20">
          <h2 className="text-3xl sm:text-[39px] font-['Plus Jakarta Sans'] font-semibold text-[#2E2F33] mb-4 sm:mb-0">
            Top Products
          </h2>
          <div className="relative w-full sm:w-[218px] h-[64px] border border-[#2E2F33] rounded-full">
            <select className="w-full h-full appearance-none text-sm sm:text-[16px] font-['Plus Jakarta Sans'] text-[#2E2F33] bg-transparent pl-6 pr-12 cursor-pointer">
              <option>Most Recent</option>
              <option>Popular</option>
              <option>Cost High to Low</option>
              <option>Cost Low to High</option>
            </select>
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <img src={dropdownIcon} alt="dropdown icon" />
            </div>
          </div>
        </div>
    
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
          {visibleProducts.map(product => (
            <ProductCard key={product?._id} product={product} />
          ))}
        </div>
    
        {/* Show More Button */}
        <ShowMore current={visibleProducts.length} total={allProducts.length} onShowMore={handleShowMoreLess} />
      </section>
    );
    
  
};

export default TopProducts;
