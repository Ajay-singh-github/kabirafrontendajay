// ProductCard.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postData, serverURL } from '../services/FetchNodeServices';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const orderData = useSelector(state => state.orderData);
  const productInCart = orderData[product._id];

  const handleAddIncreaseDecrease=async(quantity)=>{
    const userid = JSON.parse(localStorage.getItem("USER"))?._id
    
    if(userid)
    {
      const body = {"userid":userid,"productid":product._id,"quantity":quantity}
      await postData('cart/add_product_in_cart',body)
    }
  }

  const handleAddToCart = async() => {
    dispatch({ type: 'ADD_ORDER', payload: [product._id, { ...product, quantity: 1 }] });
    handleAddIncreaseDecrease(1)
  };

  const handleIncreaseQuantity = async() => {
    dispatch({ type: 'EDIT_ORDER', payload: [product._id, { ...productInCart, quantity: productInCart.quantity + 1 }] });
   handleAddIncreaseDecrease(productInCart.quantity + 1)
  
  };

  const handleDecreaseQuantity = async() => {
    if (productInCart.quantity > 1) {
      dispatch({ type: 'EDIT_ORDER', payload: [product._id, { ...productInCart, quantity: productInCart.quantity - 1 }] });
     
      handleAddIncreaseDecrease(productInCart.quantity - 1)
    } else {
      handleRemoveFromCart();
    }
  };

  const handleRemoveFromCart = () => {
    dispatch({ type: 'DEL_ORDER', payload: [product._id] });
    handleAddIncreaseDecrease(0)
  };

  return (
    <div className="bg-white rounded-lg flex flex-col justify-between h-[383px] transition-transform duration-300 hover:scale-105 relative group">
      <img
        src={product.image[0]}
        alt={product.name}
        className="w-full h-[313px] bg-gray-300"
      />
      <div className="flex flex-col justify-start flex-grow p-4 bg-white">
        <div className="flex justify-between items-center">
          <span className="text-[#2E2F33] font-medium text-[18px] leading-normal overflow-hidden text-ellipsis whitespace-nowrap w-[150px] mt-4">
            {product.name}
          </span>
          <span className="flex justify-center   gap-3 items-center w-[100px] h-[38px] px-3.5 py-2 text-[16px] font-medium text-[#2E2F33] bg-[#F3F4F7] rounded-full mt-3 ml-6 px-8">
            <span>&#8377;</span><s >{product.regularprice}</s>{product.saleprice}
          </span>
        </div>
        <div className="flex gap-2 mt-2">
          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: 'red' }}></span>
          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: 'blue' }}></span>
          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: 'green' }}></span>
        </div>
      </div>

      {productInCart ? (
        <div className="absolute top-[265px] left-3 transform -translate-x-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={handleDecreaseQuantity} className="px-3 py-1 bg-[rgb(168_85_247_/_var(--tw-bg-opacity))] text-gray-700 rounded-full">-</button>
          <span className="text-xl font-semibold">{productInCart.quantity}</span>
          <button onClick={handleIncreaseQuantity} className="px-3 py-1 bg-[rgb(168_85_247_/_var(--tw-bg-opacity))] text-gray-700 rounded-full">+</button>
        </div>
      ) : (
        <button
          className="absolute top-[265px] left-3 transform -translate-x-0 px-4 py-2 text-white bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductCard;
