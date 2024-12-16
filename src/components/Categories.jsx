import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData, serverURL } from '../services/FetchNodeServices';
import Loader from './Loader'; // Import the Loader component

const CategoryCard = ({ title, image, isWide = false, categoryid }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`relative bg-[#F3F4F7] rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300
        ${isWide ? 'h-[400px] col-span-2' : 'h-[300px]'}`}
    >
      <div className="absolute inset-0 flex justify-between items-center p-8 md:p-12">
        <div className="flex flex-col items-start gap-4">
          <h3 className="font-['Plus_Jakarta_Sans'] text-2xl md:text-3xl font-semibold text-[#2E2F33]">
            {title}
          </h3>
          <button
            onClick={() =>
              navigate(`/plp/${title}`, { state: { categoryid: categoryid } })
            }
            className="px-6 py-2.5 rounded-full border border-[#2E2F33] bg-white/80 backdrop-blur-sm text-[#2E2F33] hover:bg-[#2E2F33] hover:text-white transition-colors duration-300 flex items-center gap-2"
          >
            Shop Now
            <span className="text-lg">→</span>
          </button>
        </div>
        <div className="w-1/2 flex justify-end">
          <img
            src={`${serverURL}/images/${image}`}
            alt={title}
            className="object-contain h-full max-h-[280px] md:max-h-[320px]"
          />
        </div>
      </div>
    </div>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); 

  const fetchCategory = async () => {
    try {
      setLoading(true); 
      const result = await getData('category/get_all_category');
      if (result?.status) {
        setCategories(result?.data);
      } else {
        alert(result?.status);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  if (loading) {
    return <Loader />; 
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
      <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-semibold mb-8 text-[#060607]">
        Categories
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryCard
          title={categories[0]?.name}
          image={categories[0]?.image}
          categoryid={categories[0]?._id}
          isWide={true}
        />

        {categories?.slice(1)?.map((category) => (
          <CategoryCard
            key={category?._id}
            title={category?.name}
            image={category?.image}
            categoryid={category?._id}
          />
        ))}
      </div>
    </section>
  );
};

export default Categories;
