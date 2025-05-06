import { useState } from "react";

const PaymentPage = () => {
  const [amount, setAmount] = useState("");
  const [orderId, setOrderId] = useState(`ORDER_${Date.now()}`);
  const [userId, setUserId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [cartItems, setCartItems] = useState([
    { item: "Burger", quantity: 2, price: 200 },
    { item: "Pizza", quantity: 1, price: 500 },
  ]);

  const handlePayment = async () => {
    console.log("Payment started");

    // Additional form fields (user_id, payment_method)
    const paymentDetails = {
      order_id: orderId,
      amount: "3500.00",
      currency: "LKR",
      first_name: "Saman",
      last_name: "Perera",
      email: "samanp@gmail.com",
      phone: "0771234567",
      address: "No.1, Galle Road",
      city: "Colombo",
      country: "Sri Lanka",
      user_id: userId, // New field for user ID
      payment_method: paymentMethod, // New field for payment method
    };

    try {
      // Request backend to generate the hash value
      const response = await fetch("http://localhost:5005/payment/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentDetails),
      });

      if (response.ok) {
        console.log(response);
        const { hash, merchant_id } = await response.json();

        // Payment configuration with added fields
        const payment = {
          sandbox: true, // Use sandbox for testing
          merchant_id: merchant_id,
          return_url: "http://localhost:5173/pay",
          cancel_url: "http://localhost:5173/pay",
          notify_url:
            "https://2204-2402-4000-2260-e928-7862-8cd3-11ba-9289.ngrok-free.app/payment/notify",
          order_id: paymentDetails.order_id,
          items: "Item Title",
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          first_name: paymentDetails.first_name,
          last_name: paymentDetails.last_name,
          email: paymentDetails.email,
          phone: paymentDetails.phone,
          address: paymentDetails.address,
          city: paymentDetails.city,
          country: paymentDetails.country,
          user_id: paymentDetails.user_id, // Include the user ID
          payment_method: paymentDetails.payment_method, // Include the payment method
          hash: hash,
        };

        // Initialize PayHere payment
        payhere.startPayment(payment);
      } else {
        console.error("Failed to generate hash for payment.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setPaymentStatus(e.target.value === "cash" ? "Pending" : "Success");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Complete Your Payment
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="orderId"
              className="block text-sm font-medium text-gray-700"
            >
              Order ID
            </label>
            <input
              type="text"
              id="orderId"
              placeholder="Enter Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount (LKR)
            </label>
            <input
              type="number"
              id="amount"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="userId"
              className="block text-sm font-medium text-gray-700"
            >
              User ID
            </label>
            <input
              type="text"
              id="userId"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <div className="mt-2 flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={handlePaymentMethodChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">Cash</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={handlePaymentMethodChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">Card</span>
              </label>
            </div>
            <div className="mt-2">
              <p className="text-sm">
                <strong>Payment Status:</strong>{" "}
                <span
                  className={
                    paymentStatus === "Success"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {paymentStatus}
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Proceed with Payment
          </button>
        </div>
      </div>

      {/* Order Summary Table */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Order Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Price (LKR)</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-3">{item.item}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">{item.price}</td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td colSpan="2" className="px-4 py-3">
                  Total
                </td>
                <td className="px-4 py-3">
                  {cartItems.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
