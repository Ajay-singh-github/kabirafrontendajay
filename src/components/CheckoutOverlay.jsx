import React, { useCallback, useState } from "react";
import orderSuccessImage from "../assets/ordersuccess.svg";
import closeIcon from "../assets/icons/cancel.svg";
import { deleteData, postData, serverURL } from "../services/FetchNodeServices";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const CheckoutOverlay = ({ show, onClose, totalprice }) => {
  const orderData = useSelector((state) => state.orderData);
  const cartItems = Object.values(orderData || {});
  // console.log("CHECKING DATA IN ROOT REDUCER:",cartItems)
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [validfield, setValidField] = useState();
  const [loaderStatus, setLoaderStatus] = useState();
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    phonenumber: "",
    countryCode: "+1",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [countries] = useState([
    { code: "+1", name: "United States" },
    { code: "+91", name: "India" },
    { code: "+44", name: "United Kingdom" },
  ]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.regularprice * item.quantity,
    0
  );
  const totalDiscount = cartItems.reduce(
    (total, item) =>
      total + (item.regularprice - item.saleprice) * item.quantity,
    0
  );
  const totalDiscountPercentage =
    totalPrice > 0 ? (totalDiscount / totalPrice) * 100 : 0;
  const subtotal = totalPrice - totalDiscount;

  const validation = () => {
    let status = true;

    if (!address.firstName.trim()) {
      setValidField("Please enter the First Name.");
      return (status = false);
    }
    if (!address.lastName.trim()) {
      setValidField("Please enter the Last Name.");
      return (status = false);
    }
    if (!address.countryCode.trim()) {
      setValidField("Please select a Country Code.");
      return (status = false);
    }
    if (!["+1", "+91", "+44"].includes(address.countryCode)) {
      setValidField("Invalid Country Code selected.");
      return (status = false);
    }
    if (!address.phonenumber.trim()) {
      setValidField("Please enter the Phone Number.");
      return (status = false);
    }
    if (!/^\d{10}$/.test(address.phonenumber)) {
      setValidField("Phone Number must be 10 digits.");
      return (status = false);
    }
    if (!address.address.trim()) {
      setValidField("Please enter the Address.");
      return (status = false);
    }
    if (!address.city.trim()) {
      setValidField("Please enter the City.");
      return (status = false);
    }
    if (!address.state.trim()) {
      setValidField("Please enter the State.");
      return (status = false);
    }
    if (!address.pincode.trim()) {
      setValidField("Please enter the Pincode.");
      return (status = false);
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      setValidField("Pincode must be 6 digits.");
      return (status = false);
    }
    return status;
  };

  const proceedToNextStep = async () => {
    if (step === 1) {
      const validate = validation();
      if (validate) {
        try {
          setLoaderStatus(true);
          const userid = JSON.parse(localStorage.getItem("USER"))._id;
          const response = await postData(
            "shippingaddress/add_address_for_order",
            { userid: userid, address: JSON.stringify(address) }
          );
          if (response?.status) {
            setStep(2);
          } else {
            toast("Something is wrong.");
          }
        } catch (error) {
          console.error("Error saving address:", error);
        } finally {
          setLoaderStatus(false);
        }
      } else {
        toast.error(validfield);
      }
    } else if (step === 2) {
      try {
        if (paymentMethod == "razoparpay") {
          handlePayment(totalprice);
          setStep(3);
        } else if (paymentMethod == "credit") {
          alert("from credit cart");
          setStep(3);
        } else if (paymentMethod == "cash on delivery") {
          const userid = JSON.parse(localStorage.getItem("USER"))._id;
          const response = await postData(
            "payment/add_payment_status_by_order",
            {
              userid: userid,
              paymentmode: paymentMethod,
              paymentamount: subtotal,
              transactiondetails: "NA",
            }
          );
          if (response?.status) {
            const orderresponse = await postData(
              "order/add_address_for_order",
              {
                userid: userid,
                paymentid: response?.data?._id,
                items: cartItems,
                totalamount: subtotal,
                orderstatus: "confirmed",
              }
            );
            if (orderresponse?.status) {
              await deleteData(`cart/remove-cart/${userid}`);
              setStep(3);
              dispatch({ type: "RESET_ORDER" });
            }
          }
        } else {
          toast.error("Please Choose one option.");
        }
      } catch (error) {
        console.error("Error processing payment:", error);
      }
    } else if (step === 3) {
      onClose();
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));

    if (name === "pincode") {
      if (value === "123456") {
        setAddress((prev) => ({
          ...prev,
          city: "Sample City",
          state: "Sample State",
        }));
      } else {
        setAddress((prev) => ({ ...prev, city: "", state: "" }));
      }
    }
  };

  const handlePayment = useCallback(
    async (na) => {
      const options = {
        key: "rzp_test_GQ6XaPC6gMPNwH", //es key ko lene ke liye hame ek website pr jaana hota hai jismai hame registration karna hota hai aur us registration mai apna account aur sabhi documentation lagaye jaate hai fir hame key milte hai us key ke duhara payment direct apne account mai pahuch jaata hai.
        amount: na * 100,
        currency: "INR",
        name: "Kabira",
        description: "Online Payments",
        image: `${serverURL}/images/${"image.png"}`,

        handler: (res) => {
          console.log("Payment Details", res);
        },
        prefill: {
          name: "ajay",
          email: "youremail@example.com",
          contact: 626144875,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzpay = new Razorpay(options);
      rzpay.open();
    },
    [Razorpay]
  );

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    // setStep(3)
  };

  if (!show) return null;

  const handleBackToHome = () => {
    setStep(1);
    onClose();
  };

  const handleSetLoginIn = async () => {
    try {
      const userid = JSON.parse(localStorage.getItem("USER"))._id;
      const response = await postData(
        "shippingaddress/fetch_shipping_address_by_userid",
        { userid: userid }
      );
      if (response?.status) {
        const addressa = JSON.parse(response.data.address);
        address.firstName = addressa.firstName;
        address.lastName = addressa.lastName;
        address.countryCode = addressa.countryCode;
        address.address = addressa.address;
        address.city = addressa.city;
        address.phonenumber = addressa.phonenumber;
        address.pincode = addressa.pincode;
        address.state = addressa.state;
        setLoggedIn(true);
      } else {
        setLoggedIn(true);
      }
    } catch (e) {
      toast.error(response?.message);
    }
  };
  const initialOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    // "enable-funding": "venmo",
    // "buyer-country": "IN",
    currency: "USD",
    components: "buttons",
  };



  return (
    <div
      className={`fixed top-0 right-0 w-full sm:w-1/2 h-full bg-white p-4 sm:p-8 md:p-8 shadow-lg transition-transform duration-300 overflow-y-auto ${
        show ? "transform translate-x-0" : "transform translate-x-full"
      } z-50`}
    >
      <div className="flex justify-between items-center mb-4 sm:mb-8">
        <button className="p-2 bg-gray-100 rounded-full" onClick={onClose}>
          <img src={closeIcon} alt="Close" />
        </button>
        <h2 className="text-lg sm:text-xl font-semibold text-center w-full">
          Checkout
        </h2>
      </div>

      <div className="w-full sm:w-[353px] h-full sm:h-[637px] flex flex-col mx-auto mt-6 sm:mt-11">
        {!loggedIn && (
          <div>
            {/* <h3 className="text-lg font-medium text-gray-800 mb-4 sm:mb-6">Please log in to proceed to checkout.</h3> */}
            <button
              className="w-full h-12 bg-indigo-500 text-white rounded-full mt-6 sm:mt-11"
              onClick={handleSetLoginIn}
            >
              Go To Shipping Address
            </button>
          </div>
        )}

        {loggedIn && step === 1 && (
          <div className="flex flex-col justify-start items-start gap-4 sm:gap-6 inline-flex">
            <div className="text-[#5f6980] text-lg sm:text-xl font-semibold font-['Inter']">
              Shipping Address
            </div>
            <input
              type="text"
              name="firstName"
              value={address.firstName}
              onChange={handleAddressChange}
              placeholder="First Name"
              className="w-full sm:w-[325px] h-16 px-3.5 py-4 bg-white rounded-3xl shadow border border-[#babbc1]"
            />
            <input
              type="text"
              name="lastName"
              value={address.lastName}
              onChange={handleAddressChange}
              placeholder="Last Name"
              className="w-full sm:w-[325px] h-16 px-3.5 py-4 bg-white rounded-3xl shadow border border-[#babbc1]"
            />
            <div className="flex flex-col sm:flex-row items-center sm:space-x-2">
              <select
                name="countryCode"
                value={address.countryCode}
                onChange={handleAddressChange}
                className="h-16 px-3.5 py-4 bg-white rounded-3xl shadow border border-[#babbc1] w-full sm:w-auto"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="phonenumber"
                value={address.phonenumber}
                onChange={handleAddressChange}
                placeholder="Phone Number"
                className="w-full sm:w-[250px] h-16 px-3.5 py-4 bg-white rounded-3xl shadow border border-[#babbc1]"
              />
            </div>
            <input
              type="text"
              name="address"
              value={address.address}
              onChange={handleAddressChange}
              placeholder="Address"
              className="w-full sm:w-[325px] h-16 px-3.5 py-4 bg-white rounded-3xl shadow border border-[#babbc1]"
            />
            <input
              type="text"
              name="pincode"
              value={address.pincode}
              onChange={handleAddressChange}
              placeholder="Pincode"
              className="w-full sm:w-[325px] h-16 px-3.5 py-4 bg-white rounded-3xl shadow border border-[#babbc1]"
            />
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={handleAddressChange}
              placeholder="City"
              className="w-full sm:w-[325px] h-16 px-3.5 py-4 bg-white rounded-3xl shadow border border-[#babbc1]"
            />

            <input
              type="text"
              name="state"
              value={address.state}
              onChange={handleAddressChange}
              placeholder="State"
              className="w-full sm:w-[325px] h-16 px-3.5 py-4 bg-white rounded-3xl shadow border border-[#babbc1]"
              // readOnly
            />

            <div className="p-4 w-full sm:w-[325px] h-16 bg-indigo-500 text-white rounded-full flex items-center justify-center mt-6 sm:mt-8">
              <button onClick={proceedToNextStep} disabled={loaderStatus}>
                {loaderStatus ? "Lodding..." : "Proceed to Payment"}
              </button>
            </div>
          </div>
        )}

        {step === 2 && loggedIn && (
          <div className="flex flex-col justify-start items-start gap-4 sm:gap-6 inline-flex">
            <div className="text-[#5f6980] text-lg sm:text-xl font-semibold font-['Inter']">
              Payment Method
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-4 sm:mb-6">
              Choose Payment Method
            </h3>
            {/* <div className="flex items-center mb-4">
              <input
                type="radio"
                value="credit"
                checked={paymentMethod === "credit"}
                onChange={handlePaymentMethodChange}
                className="mr-2"
              />
              <label className="text-gray-700">Credit Card</label>
            </div>

            <div className="flex items-center mb-4">
              <input
                type="radio"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={handlePaymentMethodChange}
                className="mr-2"
              />
              <label className="text-gray-700">PayPal</label>
            </div>

            <div className="flex items-center mb-4">
              <input
                type="radio"
                value="cash on delivery"
                checked={paymentMethod === "cash on delivery"}
                onChange={handlePaymentMethodChange}
                className="mr-2"
              />
              <label className="text-gray-700">Cash On Delivery</label>
            </div> */}
            {/* <button */}
            {/* onClick={proceedToNextStep} */}
            {/* className="mt-4 w-full sm:w-auto h-16 bg-indigo-500 text-white rounded-full flex items-center justify-center" */}
            {/* > */}
            {/* Place Order */}
            {/* </button> */}

            {/* <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{
            shape: "rect",
            layout: "vertical",
            color: "gold",
            label: "paypal",
          }}
          createOrder={async () => {
            try {
              const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                // use the "body" param to optionally pass additional order information
                // like product ids and quantities
                body: JSON.stringify({
                  cart: [
                    {
                      id: "YOUR_PRODUCT_ID",
                      quantity: "YOUR_PRODUCT_QUANTITY",
                    },
                  ],
                }),
              });

              const orderData = await response.json();

              if (orderData.id) {
                return orderData.id;
              } else {
                const errorDetail = orderData?.details?.[0];
                const errorMessage = errorDetail
                  ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                  : JSON.stringify(orderData);

                throw new Error(errorMessage);
              }
            } catch (error) {
              console.error(error);
              setMessage(`Could not initiate PayPal Checkout...${error}`);
            }
          }}
          onApprove={async (data, actions) => {
            try {
              const response = await fetch(
                `/api/orders/${data.orderID}/capture`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              const orderData = await response.json();
              // Three cases to handle:
              //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
              //   (2) Other non-recoverable errors -> Show a failure message
              //   (3) Successful transaction -> Show confirmation or thank you message

              const errorDetail = orderData?.details?.[0];

              if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                return actions.restart();
              } else if (errorDetail) {
                // (2) Other non-recoverable errors -> Show a failure message
                throw new Error(
                  `${errorDetail.description} (${orderData.debug_id})`
                );
              } else {
                // (3) Successful transaction -> Show confirmation or thank you message
                // Or go to another URL:  actions.redirect('thank_you.html');
                const transaction =
                  orderData.purchase_units[0].payments.captures[0];
                setMessage(
                  `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
                );
                console.log(
                  "Capture result",
                  orderData,
                  JSON.stringify(orderData, null, 2)
                );
              }
            } catch (error) {
              console.error(error);
              setMessage(
                `Sorry, your transaction could not be processed...${error}`
              );
            }
          }}
        />
      </PayPalScriptProvider> */}
            <PayPalScriptProvider options={initialOptions}>
              <PayPalButtons 
              createOrder={async () => {
                try {
                  const response = await postData("order/add_address_for_order",{
                    //yhaan body dalni hai jo order kiska bnega
                    //orderStatus add kr dena jiska orderStatus:pending hoga
                  });
    
                  const orderData = await response.json();
    
                  if (orderData.id) {
                    return orderData.id;
                  } else {
                    const errorDetail = orderData?.details?.[0];
                    const errorMessage = errorDetail
                      ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                      : JSON.stringify(orderData);
    
                    throw new Error(errorMessage);
                  }
                } catch (error) {
                  console.error(error);
                  setMessage(`Could not initiate PayPal Checkout...${error}`);
                }
              }}
              onApprove={async (data, actions) => {
                try {
                  const response = await postData("order/add_address_for_order",{
                    //body aayega
                    //isme orderid le kr status update krna hai confirm
                  })
    
                  const orderData = await response.json();
                  // Three cases to handle:
                  //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                  //   (2) Other non-recoverable errors -> Show a failure message
                  //   (3) Successful transaction -> Show confirmation or thank you message
    
                  const errorDetail = orderData?.details?.[0];
    
                  if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                    // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                    // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                    return actions.restart();
                  } else if (errorDetail) {
                    // (2) Other non-recoverable errors -> Show a failure message
                    throw new Error(
                      `${errorDetail.description} (${orderData.debug_id})`
                    );
                  } else {
                    // (3) Successful transaction -> Show confirmation or thank you message
                    // Or go to another URL:  actions.redirect('thank_you.html');
                    const transaction =
                      orderData.purchase_units[0].payments.captures[0];
                    setMessage(
                      `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
                    );
                    console.log(
                      "Capture result",
                      orderData,
                      JSON.stringify(orderData, null, 2)
                    );
                  }
                } catch (error) {
                  console.error(error);
                  setMessage(
                    `Sorry, your transaction could not be processed...${error}`
                  );
                }
              }}
              />
            </PayPalScriptProvider>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center justify-center h-[464px]">
            <img src={orderSuccessImage} alt="Order Success" className="mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2">
              Order Placed Successfully!
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Your order has been successfully placed. We will process it
              shortly.
            </p>
            <button
              onClick={() => handleBackToHome()}
              className="w-full h-12 bg-indigo-500 text-white rounded-full"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutOverlay;
