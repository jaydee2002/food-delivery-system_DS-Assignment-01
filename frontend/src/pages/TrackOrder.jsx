import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { trackOrder } from '../services/userServices';

const TrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await trackOrder(orderId);
        setOrder(response);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch order details');
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Track Order #{order._id}</h2>
      <div className="space-y-4">
        <p>
          <span className="font-semibold">Status:</span> {order.status || 'N/A'}
        </p>
        <p>
          <span className="font-semibold">Total:</span> ${order.total?.toFixed(2) || 'N/A'}
        </p>
        <p>
          <span className="font-semibold">Date:</span>{' '}
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold">Restaurant ID:</span> {order.restaurant || 'N/A'}
        </p>
        <div>
          <span className="font-semibold">Items:</span>
          <ul className="list-disc pl-5 mt-2">
            {order.items?.map((item, index) => (
              <li key={index}>
                {item.menuItem?.name || 'Unknown Item'} (x{item.quantity}) - $
                {item.price?.toFixed(2) || 'N/A'}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Link
        to="/profile"
        className="mt-6 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Back to Profile
      </Link>
    </div>
  );
};

export default TrackOrder;