import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import cartIcon from '../assets/cart.svg';
import userIcon from '../assets/icons/user.png'; 
import CreateAccount from './CreateAccount';
import ForgotPassword from './ForgotPassword';
import LoginOverlay from './LoginOverlay';

const Navbar = () => {
  var dispatch = useDispatch()
  var navigate = useNavigate()
  const [showLoginPage, setShowLoginPage] = useState(false);
  const [showCreateAccountPage, setShowCreateAccountPage] = useState(false);
  const [showForgotPasswordPage, setShowForgotPasswordPage] = useState(false);
  const [user, setUser] = useState(null); 
  const [showDropdown, setShowDropdown] = useState(false);
  const [refresh, setRefresh] = useState(false);  
  const dropdownRef = useRef(null); 

  const cartItems = useSelector((state) => Object.values(state.orderData || {}));
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const userData = localStorage.getItem('USER');
    if (userData) {
      try {
        setUser(JSON.parse(userData));  
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [refresh]);  

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);  
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showDropdown]);

  const handleLoginClick = () => {
    setShowLoginPage(true);
  };

  const handleCreateAccountClick = () => {
    setShowCreateAccountPage(true);
    setShowLoginPage(false);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPasswordPage(true);
    setShowLoginPage(false);
  };

  const handleCloseLogin = () => {
    setShowLoginPage(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('USER');
    localStorage.removeItem('TOKEN');
    localStorage.removeItem('orderData');
    dispatch({ type: 'RESET_ORDER' });
    setUser(null);  
    setShowDropdown(false);
    setRefresh(!refresh);  
  };

  const handleNavigate=()=>{
    navigate('/')
  }

  const handleOrderComponent=()=>{
    navigate("/order")
  }

  return (
    <>
      <nav className="flex justify-between items-center px-6 sm:px-10 lg:px-20 h-16 bg-white text-black z-50">
        <div className="text-4xl font-light font-hemera text-gray-700 cursor-pointer" onClick={handleNavigate}>Kabira</div>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex space-x-8">
          <li><Link to="/" className="text-base font-semibold hover:text-gray-600">Home</Link></li>
          <li><Link to="/shop" className="text-base font-semibold hover:text-gray-600">Shop</Link></li>
          <li><Link to="/categories" className="text-base font-semibold hover:text-gray-600">Categories</Link></li>
        </ul>

        {/* User and Cart Section */}
        <div className="flex items-center">
          <Link
            to="/cart"
            className="relative ml-4 p-3 bg-gray-100 rounded-full flex items-center justify-center w-12 h-12"
          >
            <img src={cartIcon} alt="Cart" className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div ref={dropdownRef} className="relative ml-4">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="p-3 bg-gray-100 rounded-full flex items-center justify-center w-15 h-12"
              >
                <img src={userIcon} alt="User" className="w-6 h-6" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md text-sm border border-gray-200">
                  <div className="px-4 py-2 text-gray-700 font-semibold">{user?.name || 'User'}</div>
                  <button
                    onClick={handleOrderComponent}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-green-500"
                  >
                    Orders
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="ml-4 w-32 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center hover:opacity-100"
              onClick={handleLoginClick}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Modals */}
      <LoginOverlay
        show={showLoginPage}
        onClose={handleCloseLogin}
        onForgotPassword={handleForgotPasswordClick}
        onCreateAccount={handleCreateAccountClick}
        setRefresh={setRefresh}  
        refresh={refresh}  
      />
      {showCreateAccountPage && (
        <CreateAccount
          onClose={() => setShowCreateAccountPage(false)}
          onLoginClick={() => {
            setShowCreateAccountPage(false);
            setShowLoginPage(true);
          }}
        />
      )}
      {showForgotPasswordPage && (
        <ForgotPassword
          onClose={() => setShowForgotPasswordPage(false)}
          onLoginClick={() => {
            setShowForgotPasswordPage(false);
            setShowLoginPage(true);
          }}
        />
      )}
    </>
  );
};

export default Navbar;
