import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import { getData } from "../services/FetchNodeServices";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  console.log("ORDDDDDD:",orders)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const userid = JSON.parse(localStorage.getItem('USER'))?._id;
  console.log(userid)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getData(`order/orders/${userid}`);
        // console.log("ORDERS ARE COMING :",response.orders)

        if(response?.status)
        {
            setOrders(response?.orders);
        }else
        {
            toast.error(response?.message)
        }
        
        
      } catch (err) {
        setError(err.message);
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userid]);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleInvoice=(order)=>{
    const { _id, totalamount, items, shippingid } = order;
    const { firstName, lastname, city, state, pincode, mobilenumber } = shippingid?.address || {};

    const invoiceHtml = `
      <div style="text-align: left; margin: 10px 0;">
        <p><strong>Order ID:</strong> ${_id}</p>
        <p><strong>Total Amount:</strong> ₹${totalamount}</p>
        <p><strong>Shipping Address:</strong></p>
        <p>${firstName} ${lastname}, ${city}, ${state}, Pincode: ${pincode}</p>
        <p><strong>Phone:</strong> ${mobilenumber}</p>
        <hr />
        <p><strong>Items:</strong></p>
        <ul>
          ${items
            ?.map(
              (item) =>
                `<li>${item.name} - Qty: ${item.quantity}</li>`
            )
            .join("")}
        </ul>
      </div>
    `;

    Swal.fire({
      title: `<strong>Invoice</strong>`,
      html: invoiceHtml,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Print",
      cancelButtonText: "Close",
    }).then((result) => {
      if (result.isConfirmed) {
        printInvoice(invoiceHtml);
      }
    });
  };

  const printInvoice = (invoiceHtml) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            h2 {
              text-align: center;
              margin-bottom: 20px;
            }
            ul {
              list-style-type: none;
              padding: 0;
            }
            li {
              margin-bottom: 5px;
            }
            hr {
              margin: 20px 0;
            }
          </style>
        </head>
        <body>${invoiceHtml}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h2>
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 mt-6">No Order by now</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Order ID</th>
                  <th className="py-3 px-6 text-left">Item</th>
                  <th className="py-3 px-6 text-left">Total Amount</th>
                  <th className="py-3 px-6 text-left">Address</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <span className="font-medium">{order?._id}</span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span>{order.item}</span>
                      {order.items?.map((item)=>(
                        
                        <li>{item.name} <span className="ml-7">qty:{item?.quantity}</span></li>
                     
                     ))
                    }
                    </td>

                    <td className="py-3 px-6 text-left">
                      
                        {order?.totalamount}
                     
                    </td>

                    <td className="py-3 px-6 text-left">
                      
                        {/* {JSON.parse(order?.shippingid.address).address+", "+JSON.parse(order?.shippingid.address).city+", "+JSON.parse(order?.shippingid.address).state+", pincode "+JSON.parse(order?.shippingid.address).pincode+", Phone Number "+JSON.parse(order?.shippingid.address).phonenumber} */}
                     
                    </td>


                    <td className="py-3 px-6 text-left">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          order.orderstatus=== "confirmed"
                            ? "bg-green-200 text-green-600"
                            : "bg-yellow-200 text-yellow-600"
                        }`}
                      >
                        {order.orderstatus}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      {order.orderstatus === "confirmed" && (
                        <button
                          onClick={()=>handleInvoice(order)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                        >
                          Print Invoice
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Orders;
