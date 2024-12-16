import React, { useState } from 'react';
import closeIcon from '../assets/icons/cancel.svg';
import forgotAccImage from '../assets/forgotpass.svg';

const ForgotPassword = ({ onClose, onLoginClick }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000'; 
      console.log('API URL:', apiUrl); 

      const response = await fetch(`${apiUrl}/api/users/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Failed to send reset link'); 
      }

      setMessage('Reset link sent to your email');
      setEmail(''); 
      setError(''); 
    } catch (error) {
      console.error('Error during password reset:', error); 
      setError(error.message);
    }
  };

  return (
<div
  className={`fixed top-0 right-0 w-full sm:w-3/4 md:w-1/2 h-full bg-white p-8 shadow-lg z-50 overflow-y-auto transition-transform duration-300 transform translate-x-0`}
>
  <div className="flex justify-between items-center mb-8">
    <button className="p-2 bg-gray-100 rounded-full" onClick={onClose}>
      <img src={closeIcon} alt="Close" />
    </button>
    <h2 className="text-lg sm:text-xl font-semibold text-center w-full">
      Forgot Password
    </h2>
  </div>

  <img
    src={forgotAccImage}
    alt="Forgot Password"
    className="w-40 sm:w-48 md:w-56 h-auto mx-auto mb-8"
  />

  <div className="flex flex-col items-center">
    <h3 className="text-center text-sm sm:text-md font-medium text-gray-800 mb-6">
      Enter your email and we'll send a link to reset your password
    </h3>

    <input
      type="email"
      placeholder="Enter your email"
      className="w-full max-w-[300px] sm:max-w-[353px] h-[50px] sm:h-[64px] p-3 sm:p-4 rounded-3xl border border-gray-300 mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    {message && <p className="text-green-500 text-sm sm:text-base mb-4">{message}</p>}
    {error && <p className="text-red-500 text-sm sm:text-base mb-4">{error}</p>}

    <button
      onClick={handleForgotPassword}
      className="w-full max-w-[300px] sm:max-w-[353px] h-[50px] sm:h-[64px] bg-indigo-500 text-white rounded-full mb-8"
    >
      Reset Password
    </button>

    <div className="flex justify-center space-x-2 text-sm sm:text-base">
      <span>Remember your Password?</span>
      <button onClick={onLoginClick} className="text-indigo-500 font-bold">
        Back to Login
      </button>
    </div>
  </div>
</div>

  );
};

export default ForgotPassword;
