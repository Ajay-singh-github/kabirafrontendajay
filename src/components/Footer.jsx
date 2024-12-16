import React from 'react';
import { FaArrowUp } from 'react-icons/fa'; 

const Footer = () => {
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', 
    });
  };

  return (
<footer className="footer bg-black py-20 px-6 sm:px-12 lg:px-20">
  <div className="footer__main grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
    {/* Logo and Links */}
    <div className="footer__column">
      <h1 className="footer__logo text-4xl font-hemera mb-8">Kabira</h1>
      <div className="footer__links flex flex-wrap">
        <a href="#" className="footer__link text-white font-inter text-sm font-semibold mx-1">Home</a>
        <span className="text-white mx-1"> / </span>
        <a href="#blog" className="footer__link text-white font-inter text-sm font-semibold mx-1">Blog</a>
        <span className="text-white mx-1"> / </span>
        <a href="#sale" className="footer__link text-white font-inter text-sm font-semibold mx-1">Sale</a>
        <span className="text-white mx-1"> / </span>
        <a href="#about-us" className="footer__link text-white font-inter text-sm font-semibold">About Us</a>
      </div>
    </div>

    {/* Contact Information */}
    <div className="footer__column">
      <h3 className="footer__contact-title font-inter text-sm font-normal opacity-60 mt-4 sm:mt-8 mb-2">Contact Us</h3>
      <p className="footer__contact-info font-inter text-sm">+91 897 977 7144</p>
      <h3 className="footer__email-title font-inter text-sm font-normal opacity-60 mt-8 mb-2">Email</h3>
      <p className="footer__email-info font-inter text-sm">cinfo@kabirainternational.co.in</p>
    </div>

    {/* Address and Opening Hours */}
    <div className="footer__column">
      <h3 className="footer__address-title font-inter text-sm font-normal opacity-60 mt-4 sm:mt-8 mb-2">Address</h3>
      <p className="footer__address-info font-inter text-sm">
        Patpura near Santoshpuri Ashram, RTO to Mandi Road, Moradabad 244001
      </p>
      <h3 className="footer__hours-title font-inter text-sm font-normal opacity-60 mt-8 mb-2">Opening Hours</h3>
      <p className="footer__hours-info font-inter text-sm">9am - 6pm</p>
    </div>

    {/* Scroll to Top and Copyright */}
    <div className="footer__column flex flex-col items-center">
      <FaArrowUp className="footer__arrow text-gray-600 text-2xl cursor-pointer mb-8 bg-white p-2 rounded-full" onClick={scrollToTop} />
      <p className="footer__copyright font-inter text-sm opacity-60">© 2023 — Copyright</p>
    </div>
  </div>
</footer>

  );
};

export default Footer;
