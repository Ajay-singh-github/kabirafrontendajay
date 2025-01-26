import React from 'react';
// import heroImg from '../assets/heroimg.svg'; 
import heroImg from "../../src/assets/kabirainternationlogo.jpg"

const Herosection = () => {
  return (
    <section className="h-screen bg-white flex items-center justify-center text-center text-black px-6 py-6 md:px-20 md:py-20 box-content">
      <div className="max-w-full md:max-w-[1280px]">
        <div className="text-4xl font-light font-hemera text-gray-700 mb-2" ><span className='text-[#94016b]'>K</span>abira <span className='text-[#94016b]'>G</span>allery</div>

        <h1 className="font-['Plus_Jakarta_Sans'] text-3xl md:text-6xl font-bold leading-[1.3] md:leading-[1.1] mb-6">
          Discover the Artistry of Modern Contemporary Art & Crafts
        </h1>

        <h3 className="font-['Plus_Jakarta_Sans'] text-base md:text-lg font-normal leading-7 mx-auto mb-6 max-w-full md:max-w-[1126px]">
          Experience the elegance and functionality of cutting-edge design where luxury meets innovation in every piece for ultimate relaxation.
        </h3>
        <img
          src={heroImg}
          alt="Furniture Display"
          className="mx-auto w-full h-auto mt-6 max-w-full md:max-w-[1126px] box-content"
        />
      </div>
    </section>
  );

};

export default Herosection;
