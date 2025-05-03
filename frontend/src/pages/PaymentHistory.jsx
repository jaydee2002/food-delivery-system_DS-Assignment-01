// src/pages/PaymentHistory.jsx
import React, { useState, useEffect } from 'react';
import './PaymentHistory.css';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');

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

  // Filtering logic: includes search by orderId and userId
  const filteredPayments = payments.filter((payment) => {
    // Search by Order ID or User ID
    const matchesSearchTerm =
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userId.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by Status
    const matchesStatus =
      statusFilter === 'all' || payment.status === statusFilter;

    // Filter by Payment Method
    const matchesMethod =
      methodFilter === 'all' || payment.method === methodFilter;

    return matchesSearchTerm && matchesStatus && matchesMethod;
  });

  if (loading) {
    return <div>Loading payment records...</div>;
  }

  return (
    <div className="payment-history">
      <h2>Payment Records</h2>
      <div className="filter">
        {/* Search by Order ID or User ID */}
        <input
          type="text"
          placeholder="Search by Order ID or User ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="success">Success</option>
        </select>

        {/* Payment Method Filter */}
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
        >
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
          {filteredPayments.map((payment) => (
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
