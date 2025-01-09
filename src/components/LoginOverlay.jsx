import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { postData } from '../services/FetchNodeServices';
import closeIcon from '../assets/icons/cancel.svg';
import googleIcon from '../assets/icons/google.svg';
import appleIcon from '../assets/icons/apple.svg';
import loginPlant from '../assets/login_plant.svg';
import { useDispatch } from 'react-redux';

const LoginOverlay = ({ show, onClose, onForgotPassword, onCreateAccount, setRefresh, refresh }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New state for loader

  const mergeCartData = async (userId) => {
    try {
      const backendCartResponse = await postData('cart/get_user_cart', { userid: userId });
      const backendCart = backendCartResponse?.data[0]?.cart || [];
      backendCart.map((item) => {
        dispatch({
          type: 'ADD_ORDER',
          payload: [
            item.productid._id,
            { ...item.productid, quantity: item.quantity },
          ],
        });
      });
    } catch (error) {
      console.error('Error syncing cart:', error);
      toast.error('Failed to sync cart. Please try again later.');
    }
  };

  const handleLogin = async () => {
    setLoading(true); // Start loader
    try {
      const response = await postData('login/user_login', { emailid: email, password });
      if (response?.status) {
        toast(response?.message);
        localStorage.setItem('TOKEN', response?.token);
        localStorage.setItem('USER', JSON.stringify(response?.data));
        await mergeCartData(response?.data._id); // Sync the cart
        setRefresh(!refresh);
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        toast.error(response?.message);
      }
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Error logging in:', err);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/auth/google';
  };

  return (
    <div
      className={`fixed top-0 right-0 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 h-full bg-white p-4 sm:p-8 shadow-lg transition-transform duration-300 overflow-y-auto ${
        show ? 'transform translate-x-0' : 'transform translate-x-full'
      } z-50`}
    >
      <div className="flex justify-between items-center mb-8">
        <button className="p-2 bg-gray-100 rounded-full" onClick={onClose}>
          <img src={closeIcon} alt="Close" />
        </button>
        <h2 className="text-lg sm:text-xl font-semibold text-center w-full">Login</h2>
      </div>

      <img src={loginPlant} alt="Login Plant" className="w-40 sm:w-56 h-auto mx-auto mb-8" />

      <div className="flex flex-col items-center">
        <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-6">Welcome Back</h3>

        {error && <div className="mb-4 text-sm sm:text-base text-red-500">{error}</div>}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full max-w-[353px] h-[50px] sm:h-[64px] p-4 rounded-3xl border border-gray-300 mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full max-w-[353px] h-[50px] sm:h-[64px] p-4 rounded-3xl border border-gray-300 mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />

        <div className="w-full max-w-[353px] text-right mb-4">
          <button onClick={onForgotPassword} className="text-indigo-500 text-sm sm:text-base">
            Forgot Password?
          </button>
        </div>

        <button
          className="w-full max-w-[353px] h-[50px] sm:h-[64px] bg-indigo-500 text-white rounded-full mb-8 flex items-center justify-center"
          onClick={handleLogin}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <span className="loader animate-spin border-2 border-white border-t-indigo-600 rounded-full w-5 h-5 mr-2"></span>
          ) : (
            'Login'
          )}
        </button>

        <div className="text-center w-full mb-8 text-sm sm:text-base text-gray-400">OR</div>

        <button
          className="w-full max-w-[353px] h-[50px] sm:h-[64px] border border-gray-300 rounded-full mb-4 flex items-center justify-center"
          onClick={handleGoogleLogin}
        >
          <img src={googleIcon} alt="Google" className="w-5 h-5 mr-2" /> Continue with Google
        </button>

        <button className="w-full max-w-[353px] h-[50px] sm:h-[64px] border border-gray-300 rounded-full mb-8 flex items-center justify-center">
          <img src={appleIcon} alt="Apple" className="w-5 h-5 mr-2" /> Continue with Apple
        </button>

        <div className="flex justify-center space-x-2 text-sm sm:text-base">
          <span>First Time Here?</span>
          <button onClick={onCreateAccount} className="text-indigo-500 font-bold">
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginOverlay;
