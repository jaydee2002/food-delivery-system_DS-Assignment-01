import React, { useState } from "react";
import "./PaymentPage.css";

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
    <div className="payment-page-wrapper">
      <div className="payment-container">
        <h2>Complete Your Payment</h2>
        <form className="payment-form">
          <div className="form-group">
            <label htmlFor="orderId">Order ID</label>
            <input
              type="text"
              id="orderId"
              placeholder="Enter Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (LKR)</label>
            <input
              type="number"
              id="amount"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="userId">User ID</label>
            <input
              type="text"
              id="userId"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>

          <div className="payment-method-container">
            <label htmlFor="paymentMethod">Payment Method</label>
            <div className="payment-method-options">
              <label>
                <input
                  type="radio"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={handlePaymentMethodChange}
                />
                Cash
              </label>
              <label>
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={handlePaymentMethodChange}
                />
                Card
              </label>
            </div>
            <div className="payment-status">
              <p>
                <strong>Payment Status:</strong> {paymentStatus}
              </p>
            </div>
          </div>

          <button type="button" onClick={handlePayment}>
            Proceed with Payment
          </button>
        </form>
      </div>

      {/* Order Summary Table */}
      <div className="order-summary">
        <h3>Order Summary</h3>
        <table className="order-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price (LKR)</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={index}>
                <td>{item.item}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="2">
                <strong>Total</strong>
              </td>
              <td>
                <strong>
                  {cartItems.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                  )}
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentPage;
