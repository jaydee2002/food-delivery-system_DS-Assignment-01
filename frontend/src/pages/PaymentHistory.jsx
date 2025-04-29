// src/pages/PaymentHistory.jsx
import React, { useState, useEffect } from 'react';
import './PaymentHistory.css';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('http://localhost:5005/api/payments');
        const data = await response.json();
        setPayments(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payment history:', error);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return <div>Loading payment records...</div>;
  }

  return (
    <div className="payment-history">
      <h2>Payment Records</h2>
      <div className="filter">
        <input
          type="text"
          placeholder="Search by Order ID or User ID"
          // Implement search functionality here
        />
        <select>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="success">Success</option>
        </select>
        <select>
          <option value="all">All Methods</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
        </select>
      </div>
      <table className="payment-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Amount (LKR)</th>
            <th>Status</th>
            <th>Method</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td>{payment.orderId}</td>
              <td>{payment.userId}</td>
              <td>{payment.amount}</td>
              <td className={payment.status === 'success' ? 'success' : 'pending'}>
                {payment.status}
              </td>
              <td>{payment.method}</td>
              <td>{new Date(payment.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
