import React, { useState } from 'react';
import closeIcon from '../assets/icons/cancel.svg';
import createAccImage from '../assets/createacc.svg';
import googleIcon from '../assets/icons/google.svg';
import appleIcon from '../assets/icons/apple.svg';
import { postData } from '../services/FetchNodeServices';
import { toast } from 'react-toastify';

const CreateAccount = ({ onClose, onLoginClick }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loader state

  const handleCreateAccount = async () => {
    if (!username || !email || !password || !phonenumber) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true); // Start loader
    try {
      const response = await postData("user/create_user", {
        name: username,
        emailid: email,
        password: password,
        phonenumber: phonenumber,
        role: 'user',
        address: ''
      });

      if (response?.status) {
        toast(response?.message);
        setSuccessMessage(response?.message);
        setError('');
        setUsername('');
        setEmail('');
        setPassword('');
        setPhoneNumber('');
      } else {
        toast.error(response?.message);
      }

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setError(error.message);
      setSuccessMessage('');
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google Login Clicked');
    window.location.href = 'http://localhost:8000/auth/google';
  };

  const handlePhoneAuth = () => {
    console.log('Continue with Phone');
  };

  return (
    <div className="fixed top-0 right-0 w-full md:w-1/2 h-full bg-white p-8 shadow-lg z-50 overflow-y-auto transition-transform duration-300 transform translate-x-0">
      <div className="flex justify-between items-center mb-8">
        <button className="p-2 bg-gray-100 rounded-full" onClick={onClose}>
          <img src={closeIcon} alt="Close" />
        </button>
        <h2 className="text-lg font-semibold text-center w-full">Create a New Account</h2>
      </div>

      <img src={createAccImage} alt="Create Account" className="w-56 h-56 mx-auto mb-8" />

      <div className="flex flex-col items-center">
        <h3 className="text-md font-medium text-gray-800 mb-6 text-center">
          Let’s get your account set up
        </h3>

        <input
          type="text"
          placeholder="Enter your username"
          className="w-full md:w-[353px] h-[64px] p-4 rounded-xl border border-gray-300 mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full md:w-[353px] h-[64px] p-4 rounded-xl border border-gray-300 mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full md:w-[353px] h-[64px] p-4 rounded-3xl border border-gray-300 mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="number"
          placeholder="Enter your mobile number"
          className="w-full md:w-[353px] h-[64px] p-4 rounded-3xl border border-gray-300 mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          value={phonenumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

        <button
          onClick={handleCreateAccount}
          className="w-full md:w-[353px] h-[64px] bg-indigo-500 text-white rounded-full mb-4"
          disabled={isLoading} // Disable during loading
        >
          {isLoading ? 'Creating...' : 'Create Account'}
        </button>

        {isLoading && <div className="loader mb-4"></div>} {/* Loader */}

        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <button
          className="w-[353px] h-[64px] border border-gray-300 rounded-full mb-6 flex items-center justify-center space-x-2"
          onClick={handleGoogleLogin}>
          <img src={googleIcon} alt="Google" />
          <span>Continue with Google</span>
        </button>

        <button
          className="w-[353px] h-[64px] border border-gray-300 rounded-full flex items-center justify-center space-x-2"
          onClick={handlePhoneAuth}>
          <img src={appleIcon} alt="Apple" />
          <span>Continue with Phone</span>
        </button>
      </div>
    </div>
  );
};

export default CreateAccount;
