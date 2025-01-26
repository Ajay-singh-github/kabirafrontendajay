import React, { useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const ProductPage = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const orderData = useSelector((state) => state.orderData);
    const { product } = location.state || {};
    const productInCart = orderData[product?._id]; // Check if the product is in the cart

    if (!product) {
        return <p>Product not found</p>;
    }

    const [mainImage, setMainImage] = useState(product.image[0]);

    const handleThumbnailClick = (imageUrl) => {
        setMainImage(imageUrl);
    };

    const handleAddIncreaseDecrease = async (quantity) => {
        const userid = JSON.parse(localStorage.getItem("USER"))?._id;

        if (userid) {
            const body = { userid: userid, productid: product._id, quantity: quantity };
            await postData("cart/add_product_in_cart", body);
        }
    };

    const handleAddToCart = async () => {
        dispatch({ type: "ADD_ORDER", payload: [product._id, { ...product, quantity: 1 }] });
        handleAddIncreaseDecrease(1);
    };

    const handleIncreaseQuantity = async () => {
        dispatch({
            type: "EDIT_ORDER",
            payload: [product._id, { ...productInCart, quantity: productInCart.quantity + 1 }],
        });
        handleAddIncreaseDecrease(productInCart.quantity + 1);
    };

    const handleDecreaseQuantity = async () => {
        if (productInCart.quantity > 1) {
            dispatch({
                type: "EDIT_ORDER",
                payload: [product._id, { ...productInCart, quantity: productInCart.quantity - 1 }],
            });
            handleAddIncreaseDecrease(productInCart.quantity - 1);
        } else {
            handleRemoveFromCart();
        }
    };

    const handleRemoveFromCart = () => {
        dispatch({ type: "DEL_ORDER", payload: [product._id] });
        handleAddIncreaseDecrease(0);
    };

    const tags = product?.tags.split(",");

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <div className="shadow-xl bg-white rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                    {/* Left Section - Image and Thumbnails */}
                    <div>
                        <img src={mainImage} alt="Product" className="w-full rounded-xl" />
                        <div className="flex mt-2 space-x-2">
                            {product.image.map((item, index) => (
                                <img
                                    key={index}
                                    src={item}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-16 h-16 rounded-md border border-gray-300 cursor-pointer"
                                    onClick={() => handleThumbnailClick(item)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Section - Details */}
                    <div>
                        <h1 className="text-2xl font-bold mt-2">{product?.name}</h1>
                        <div className="flex items-center mt-2 space-x-2">
                            <span className="text-green-600 font-semibold">SKU: {product?.sku}</span>
                            <span className="text-gray-600">Tags: {tags?.map((item, i) => <span key={i} className="ml-1">{item}</span>)}</span>
                        </div>
                        <div className="text-gray-600">In Stock: {product?.stockquantity}</div>

                        <div className="mt-4">
                            <span className="text-2xl font-bold text-green-600">₹{product?.saleprice}</span>
                            <span className="line-through ml-4 text-gray-500">₹{product?.regularprice}</span>
                        </div>

                        <div className="mt-6">
                            {/* Conditional Rendering for Add to Cart or Quantity Controls */}
                            {productInCart ? (
                                <div className="flex items-center space-x-4">
                                    <button
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md"
                                        onClick={handleDecreaseQuantity}
                                    >
                                        -
                                    </button>
                                    <span className="text-lg font-semibold">{productInCart.quantity}</span>
                                    <button
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md"
                                        onClick={handleIncreaseQuantity}
                                    >
                                        +
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                                        onClick={handleRemoveFromCart}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
                                    onClick={handleAddToCart}
                                >
                                    <AiOutlineShoppingCart />
                                    <span>Add to Cart</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
