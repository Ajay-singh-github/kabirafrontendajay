const initialState = {
  orderData: JSON.parse(localStorage.getItem("orderData")) || {},
};

console.log("CART_IN_ROOTREDUCER:",initialState.orderData)

export default function RootReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_ORDER":
      const [productId, product] = action.payload;
      const updatedStateAdd = {
        ...state.orderData,
        [productId]: product,
      };
      localStorage.setItem("orderData", JSON.stringify(updatedStateAdd)); 
      return { orderData: updatedStateAdd };

    case "DEL_ORDER":
      const orderDataCopyDel = { ...state.orderData };
      delete orderDataCopyDel[action.payload[0]];
      localStorage.setItem("orderData", JSON.stringify(orderDataCopyDel)); 
      return { orderData: orderDataCopyDel };

    case "EDIT_ORDER":
      const [editProductId, editProduct] = action.payload;
      const updatedStateEdit = {
        ...state.orderData,
        [editProductId]: editProduct,
      };
      localStorage.setItem("orderData", JSON.stringify(updatedStateEdit));
      return { orderData: updatedStateEdit };

    case "RESET_ORDER":
      localStorage.removeItem("orderData"); 
      return { orderData: {} };

    case "SYNC_CART":
      localStorage.setItem("orderData", JSON.stringify(action.payload)); 
      return { orderData: action.payload };

    default:
      return state;
  }
}
