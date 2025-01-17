// import { PayPalScriptProvider } from "@paypal/react-paypal-js";


// export default function Paypay()
// {

//     const initialOptions = {
//         "client-id": "Af9DDOd6jMLivS6JOM6p_xo7xJzjfiOMgifJUqFqvNHoypaifI8UwCZRf1q-jEOnU9AWkgVdZu6aTLzg",
//         // "enable-funding": "venmo",
//         // "buyer-country": "IN",
//         currency: "USD",
//         components: "buttons",
//       };

//  const handlePayPal=()=>{
//     alert("HELLO")
//     return(<div>
// <PayPalScriptProvider options={initialOptions}>
//       <PayPalButtons
//         createOrder={async () => {
//           try {
//             // const userid = JSON.parse(localStorage.getItem("USER"))._id;

//             // const response = await postData("order/add_order", {
//             //   userid,
//             //   items: cartItems,
//             //   totalamount: subtotal,
//             //   orderstatus: "pending",
//             //   shippingid,
//             // });

//             // if (response && response._id) {
//             //   return response._id; // Return the order ID to PayPal
//             // } else {
//             //   throw new Error("Failed to create an order");
//             // }
//           } catch (error) {
//             // console.error("Error creating order:", error);
//             // throw new Error(`Could not create order: ${error.message}`);
//           }
//         }}
//         onApprove={async (data, actions) => {
//           try {
//             // const captureResult = await actions.order.capture();
//             // console.log("Transaction successfully captured:", captureResult);

//             // await postData("order/add_address_for_order", {
//             //   orderId: data.orderID,
//             //   status: "confirmed",
//             // });

//             // alert("Payment successful! Your order is confirmed.");
//           } catch (error) {
//             // console.error("Error capturing transaction:", error);
//             // alert("Payment failed. Please try again.");
//           }
//         }}
//         onError={(error) => {
//           console.error("PayPal Checkout Error:", error);
//           alert("Something went wrong with the payment process.");
//         }}
//       />
//     </PayPalScriptProvider>


        
//     </div>)
//  }
//         return(<div>
//            <div className="w-28 h-6 bg-slate-500 rounded-md ml-28" onClick={()=>handlePayPal()}>click me</div>
//     </div>)
// }




import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function PayPalComponent() {
  const initialOptions = {
    "client-id": "Af9DDOd6jMLivS6JOM6p_xo7xJzjfiOMgifJUqFqvNHoypaifI8UwCZRf1q-jEOnU9AWkgVdZu6aTLzg", // Sandbox client ID
    currency: "USD",
    components: "buttons",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: "10.00", // Transaction amount
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          alert("Payment Approved!");
        }}
        onError={(err) => {
          console.error("PayPal Error:", err);
          alert("Something went wrong. Please try again.");
        }}
      />
    </PayPalScriptProvider>
  );
}

