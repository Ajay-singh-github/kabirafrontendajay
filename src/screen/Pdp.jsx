import React from 'react';
import { useParams } from 'react-router-dom';


const Pdp = () => {
  const { id } = useParams();
  const product = mockProducts.find((item) => item.id === parseInt(id));

  if (!product) {
    return <div>Product not found!</div>;
  }

  return (
    <div className="pdp-container">
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p>{product.price}</p>
    </div>
  );
};

export default Pdp;
