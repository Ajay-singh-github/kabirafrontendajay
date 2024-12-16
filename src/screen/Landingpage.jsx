import React from 'react';
import Navbar from '../components/Navbar';
import Herosection from '../components/Herosection';
import Portfolio from '../components/Portfolio';
import Faq from '../components/Faq';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { Suspense, lazy } from "react";
const Categories = lazy(() => import("../components/Categories.jsx"));
const TopProducts = lazy(() => import("../components/Topproducts.jsx"));

const LandingPage = () => {
  return (
    <div className="landing-page-wrapper">
      <Navbar />
      <Herosection />
      <Suspense fallback={<Loader />}>
      <Categories />
      <TopProducts />\
     </Suspense>
      
      
      <Portfolio/>
      <Faq/>
      <Footer/>
    </div>
  );
};

export default LandingPage;
