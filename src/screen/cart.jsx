import React, { useState } from 'react';
import ProductCarousel from '../components/ProductCarousel';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import CheckoutOverlay from '../components/CheckoutOverlay';
import { postData, serverURL } from '../services/FetchNodeServices';
import { toast } from 'react-toastify';
import LoginOverlay from '../components/LoginOverlay';

const Cart = () => {
  const dispatch = useDispatch();
  const orderData = useSelector((state) => state.orderData);
  const cartItems = Object.values(orderData || {});
  const [status, setStatus] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);

  const [isCheckoutOverlayOpen, setCheckoutOverlayOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);  
  console.log("CART ITEMS",cartItems)
  // Calculations
  const totalPrice = cartItems.reduce((total, item) => total + item.regularprice * item.quantity, 0);
  const totalDiscount = cartItems.reduce((total, item) => total + (item.regularprice - item.saleprice) * item.quantity, 0);
  const totalDiscountPercentage = totalPrice > 0 ? (totalDiscount / totalPrice) * 100 : 0;
  const subtotal = totalPrice - totalDiscount;

  const handleCheckoutButtonClick = () => {
    if (status) {
      setCheckoutOverlayOpen(true);
    }
    checkUser();
  };

  const closeCheckoutOverlay = () => {
    setCheckoutOverlayOpen(false);
  };

  const emptyCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const handleCloseLogin = () => {
    setShowLoginPage(false);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPasswordPage(true);
    setShowLoginPage(false);
  };

  const handleCreateAccountClick = () => {
    setShowCreateAccountPage(true);
    setShowLoginPage(false);
  };

  const checkUser = async () => {
    try {
      const userData = localStorage.getItem('USER');
      if (!userData) {
        localStorage.removeItem('USER');
        setStatus(false);
        setShowLoginPage(true);
        return false;
      }
      const localCart = JSON.parse(userData);

      if (!localCart._id) {
        localStorage.removeItem('USER');
        setStatus(false);
        toast('Invalid user session. Please log in again.');
        return false;
      }

      const response = await postData('user/get_specific_user', { userid: localCart._id });
      if (response?.status) {
        setStatus(true);
        return true;
      } else {
        localStorage.removeItem('USER');
        setStatus(false);
        toast('User verification failed. Please log in again.');
        return false;
      }
    } catch (error) {
      localStorage.removeItem('USER');
      setStatus(false);
      toast('User verification failed. Please log in again.');
      return false;
    }
  };

  const handleRemoveItem = async (productid) => {
    dispatch({ type: 'DEL_ORDER', payload: [productid] });
    const userid = JSON.parse(localStorage.getItem('USER'))?._id;
    if (userid) {
      const body = { userid, productid, quantity: 0 };
      await postData('cart/add_product_in_cart', body);
    }
  };

  const handleAddIncreaseDecrease = async (quantity, productId) => {
    const userid = JSON.parse(localStorage.getItem('USER'))?._id;
    if (userid) {
      const body = { userid, productid: productId, quantity };
      await postData('cart/add_product_in_cart', body);
    }
  };

  const handleIncreaseQuantity = async (product) => {
    const productInCart = orderData[product._id];
    if (productInCart) {
      const newQuantity = productInCart.quantity + 1;
      dispatch({ type: 'EDIT_ORDER', payload: [product._id, { ...productInCart, quantity: newQuantity }] });
      handleAddIncreaseDecrease(newQuantity, product._id);
    }
  };

  const handleDecreaseQuantity = async (product) => {
    const productInCart = orderData[product._id];
    if (productInCart.quantity > 1) {
      const newQuantity = productInCart.quantity - 1;
      dispatch({ type: 'EDIT_ORDER', payload: [product._id, { ...productInCart, quantity: newQuantity }] });
      handleAddIncreaseDecrease(newQuantity, product._id);
    } else {
      handleRemoveItem(product._id);
    }
  };

  return (
    <div>

      <div className="p-4 sm:p-8 md:p-16 lg:px-20">
        <div className="text-gray-600 mb-4 md:mb-8">
          <Link href="/" className="hover:underline">
            Home
          </Link>{' '}
          &gt; <span>Cart</span>
        </div>

        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item._id} className="flex flex-col md:flex-row mb-12">
              <img
                src={`${item?.image[0]} || 'placeholder-image.jpg'`}
                alt={item.name}
                className="w-40 h-40 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-96 lg:h-96 object-cover mx-auto md:mx-0"
              />
              <div className="mt-4 md:mt-0 md:ml-8 lg:ml-36 pl-4 md:pl-8 pr-4 flex-1">
                <h2 className="text-gray-800 text-xl md:text-2xl lg:text-3xl font-medium">{item.name}</h2>
                <div className="flex items-center mb-4 mt-2">
                  <span className="text-indigo-600 text-lg md:text-xl lg:text-2xl font-semibold">
                    ₹<s className='mr-4'>{item?.regularprice?.toFixed(2)}</s>{item?.saleprice?.toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 text-sm md:text-base">{item.description}</p>
                <div className="flex items-center mb-6">
                  <div className="transform -translate-x-0 flex items-center justify-center gap-4 opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleDecreaseQuantity(item)}
                      className="text-gray-700 rounded-full w-9 h-6 bg-[#e0d5ea] font-bold"
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleIncreaseQuantity(item)}
                      className="text-gray-700 w-9 h-6 bg-[#e0d5ea] font-bold rounded-full"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="w-full h-12 sm:h-14 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  Remove Item
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-lg">Your cart is empty.</p>
        )}

        {cartItems?.length > 0 && (
          <div className="mt-8 md:mt-12 p-4 md:p-8 bg-gray-100 rounded-lg shadow-md max-w-full md:max-w-md mx-auto">
            <h2 className="text-base md:text-lg font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2 text-sm md:text-base">
              <span className="text-gray-600">Total Price:</span>
              <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm md:text-base">
              <span className="text-gray-600">Total Discount:</span>
              <span className="font-semibold text-red-500">-₹{totalDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-sm md:text-base">
              <span className="text-gray-600">Discount Percentage:</span>
              <span className="font-semibold text-green-600">{totalDiscountPercentage.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between mb-6 text-sm md:text-base">
              <span className="text-gray-800 font-semibold">Subtotal:</span>
              <span className="font-bold text-lg">₹{subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckoutButtonClick}
              className="w-full h-12 sm:h-14 bg-yellow-600 text-white rounded-full hover:bg-yellow-700"
            >
              Checkout
            </button>
          </div>
        )}
      </div>

      <CheckoutOverlay
        totalprice={subtotal.toFixed(2)}
        show={isCheckoutOverlayOpen}
        onClose={closeCheckoutOverlay}
        emptyCart={emptyCart}
      />

      <LoginOverlay
        show={showLoginPage}
        onClose={handleCloseLogin}
        refresh={refresh}  
        setRefresh={setRefresh}
        onForgotPassword={handleForgotPasswordClick}
        onCreateAccount={handleCreateAccountClick} 
      />

      <ProductCarousel products={cartItems} />
      <Footer />
    </div>
  );
};

export default Cart;
