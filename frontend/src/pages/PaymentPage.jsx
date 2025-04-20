// src/pages/PaymentPage.jsx
import React, { useState } from 'react';
import { processPayment } from '../services/paymentService';
import './PaymentPage.css';

const PaymentPage = () => {
  const [amount, setAmount] = useState('');
  const [orderId, setOrderId] = useState(`ORDER_${Date.now()}`);

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      const res = await processPayment({ orderId, amount });

      if (res?.paymentUrl) {
        window.location.href = res.paymentUrl; // Redirect to PayHere
      } else {
        alert('Failed to process payment');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Error occurred during payment');
    }
  };

  return (
    <div className="payment-page-wrapper">
      <div className="payment-container">
        <h2>Make a Payment</h2>
        <form onSubmit={handlePayment}>
          <input
            type="text"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Enter Amount (LKR)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <button type="submit">Pay Now with PayHere</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
