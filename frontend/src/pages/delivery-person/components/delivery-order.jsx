import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getReadyDeliveries, assignDelivery } from "../api/delivery.js";

function ReadyDeliveries() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getReadyDeliveries();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchOrders();
  }, []);

  const handleAccept = async (orderId) => {
    try {
      const delivery = await assignDelivery(orderId);
      console.log("Delivery assigned:", delivery);
      navigate(`/${delivery._id}`);
    } catch (err) {
        console.log(err);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Ready for Pickup</h1>
        <p className="text-lg text-gray-600">Orders waiting for delivery</p>
      </div>
  
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-red-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        </div>
      )}
  
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-2xl font-medium text-gray-800 mb-2">No Orders Available</h3>
          <p className="text-gray-500 text-lg">All orders have been picked up or are being prepared</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Order #{order._id}</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                    READY
                  </span>
                </div>
  
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-medium">{order.customer._id}</p>
                      </div>
                    </div>
                  </div>
  
                  <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h3>
                    <ul className="space-y-3">
                      {order.items.map((item) => (
                        <li key={item._id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.menuItem._id}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-semibold">${item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
  
                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700">Total</span>
                    <span className="text-2xl font-bold text-blue-600">${order.total}</span>
                  </div>
                </div>
  
                <button
                  onClick={() => handleAccept(order._id)}
                  className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ACCEPT ORDER
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReadyDeliveries;