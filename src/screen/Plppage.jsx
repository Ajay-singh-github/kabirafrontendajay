import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import ShowMore from "../components/ShowMore";
import searchIcon from "../assets/icons/search.svg";
import chevronRight from "../assets/icons/chevron-right.svg";
import dropdownIcon from "../assets/icons/drop-down.svg";
import leftArrow from "../assets/icons/arrowleft.svg";
import rightArrow from "../assets/icons/arrowright.svg";
import { postData } from "../services/FetchNodeServices";
import Loader from "../components/Loader"; 

const PlpPage = () => {
  const location = useLocation();
  const categoryid = location.state?.categoryid;
  const { category } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [current, setCurrent] = useState(20);
  const [showAll, setShowAll] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const productsPerSlide = 4;

  const fetchProductByCategoryId = async () => {
    setLoading(true);
    try {
      const result = await postData("product/get_specific_products_by_category", {
        categoryid,
      });
      if (result?.status) {
        setProducts(result.data);
        setFilteredProducts(result.data);
      } else {
        console.error(result?.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductByCategoryId();
  }, [categoryid]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, products]);

  const displayTitle = category;

  const handleShowMore = () => {
    setShowAll((prev) => !prev);
    setCurrent((prev) => (prev === 20 ? filteredProducts.length : 20));
  };

  const handlePrevSlide = () => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNextSlide = () => {
    const maxIndex = Math.ceil(filteredProducts.length / productsPerSlide) - 1;
    setCarouselIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) {
    return <Loader />; 
  }

  return (
    <div>
      <Navbar />

      <div className="py-20 text-center px-4 sm:px-8">
        <h1 className="mb-8 text-3xl sm:text-4xl font-bold text-gray-900">{displayTitle}</h1>
        <h3 className="mb-8 text-base sm:text-lg font-normal text-gray-500">
          Transform your sitting room with our elegant and functional seating options, perfect for
          every modern home.
        </h3>

        <div className="flex justify-center items-center gap-2 mb-8">
          <span className="text-sm sm:text-base font-normal text-gray-900">Homepage</span>
          <img src={chevronRight} alt="Chevron Right" className="w-4 h-4" />
          <span className="text-sm sm:text-base font-normal text-gray-900">Categories</span>
          <img src={chevronRight} alt="Chevron Right" className="w-4 h-4" />
          <span className="text-sm sm:text-base font-normal text-gray-900">{displayTitle}</span>
        </div>

        <div className="relative w-full max-w-lg mx-auto h-12">
          <input
            type="text"
            placeholder="Search"
            className="w-full h-full px-4 sm:px-6 py-2 border rounded-full text-gray-900 border-gray-300"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <img
            src={searchIcon}
            alt="Search Icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 sm:w-6 h-5 sm:h-6 cursor-pointer"
          />
        </div>
      </div>

      <div className="px-4 sm:px-8 py-8">
        <div className="flex items-center mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mr-auto">Top Products</h2>
          <div className="relative w-[140px] sm:w-[218px] h-10 sm:h-[64px] border border-gray-300 rounded-full">
            <select className="w-full h-full appearance-none text-sm sm:text-base bg-transparent pl-4 sm:pl-6 pr-8 sm:pr-12 cursor-pointer">
              <option>Most Recent</option>
              <option>Popular</option>
              <option>Cost Low to High</option>
              <option>Cost High to Low</option>
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <img src={dropdownIcon} alt="Dropdown Icon" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 mb-16">
          {filteredProducts.slice(0, current).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <ShowMore current={current} total={filteredProducts.length} onShowMore={handleShowMore} />
      </div>

      <div className="px-4 sm:px-8 py-8">
        <div className="flex items-center mb-8">
          <h6 className="text-lg sm:text-xl font-semibold text-gray-900 mr-auto">People Also Viewed</h6>
          <div className="flex gap-2 sm:gap-4">
            <button onClick={handlePrevSlide} className="p-2 bg-gray-100 rounded-full">
              <img src={leftArrow} alt="Left Arrow" />
            </button>
            <button onClick={handleNextSlide} className="p-2 bg-gray-100 rounded-full">
              <img src={rightArrow} alt="Right Arrow" />
            </button>
          </div>
        </div>

        <div
          className="flex overflow-hidden gap-4 transition-transform duration-500"
          style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
        >
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`min-w-[calc(100%/${productsPerSlide})] flex-shrink-0`}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PlpPage;
