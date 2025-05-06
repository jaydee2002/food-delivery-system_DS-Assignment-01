import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRestaurants } from "../services/restaurentServices";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        const data = await getRestaurants();
        setRestaurants(data.data || []);
      } catch (err) {
        setError(err.message || "Failed to load restaurants");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Restaurants</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow animate-pulse"
            >
              <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <p className="text-gray-600">No restaurants found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant._id}
              to={`/restaurant/${restaurant._id}`}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
            >
              <img
                src={
                  restaurant.image ||
                  "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={restaurant.storeName}
                className="w-full h-48 object-cover rounded-md mb-4"
                loading="lazy"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {restaurant.storeName}
              </h3>
              <p className="text-gray-600 text-sm">{restaurant.brandName}</p>
              <p className="text-gray-500 text-sm capitalize">
                {restaurant.businessType}
              </p>
              <p className="text-gray-500 text-sm">
                {restaurant.city}, {restaurant.state}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Restaurants;
