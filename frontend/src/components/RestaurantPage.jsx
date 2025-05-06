import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMenuItemsByRestaurant } from "../services/restaurentServices";
import { addToCart } from "../services/userServices";

function RestaurantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true);
      try {
        const data = await getMenuItemsByRestaurant(id);
        console.log(data);
        setMenuItems(data.data || []);
      } catch (err) {
        setError(err.message || "Failed to load menu items");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenuItems();
  }, [id]);

  const handleQuantityChange = (itemId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, parseInt(value) || 1),
    }));
  };

  const handleAddToCart = async (item) => {
    setError("");
    setSuccess("");
    try {
      const quantity = quantities[item._id] || 1;
      await addToCart({
        restaurant: id,
        menuItem: item._id,
        quantity,
        price: item.price,
      });
      setSuccess(`${item.name} added to cart!`);
      setTimeout(() => setSuccess(""), 3000); // Clear success message after 3s
    } catch (err) {
      setError(err.message || "Failed to add item to cart");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Menu</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
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
      ) : menuItems.length === 0 ? (
        <p className="text-gray-600">No menu items available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
            >
              <img
                src={
                  item.image
                    ? `${import.meta.env.VITE_API_RESTAURENT_BASE_URL}${
                        item.image
                      }`
                    : "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={item.name}
                className="w-full h-48 object-cover rounded-md mb-4"
                loading="lazy"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h3>
              <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
              <p className="text-gray-500 text-sm capitalize">
                {item.category}
              </p>
              <p className="text-gray-500 text-sm capitalize">{item.image}</p>
              <p className="text-gray-500 text-sm truncate">
                {item.description}
              </p>
              <p className="text-gray-500 text-sm">
                {item.isAvailable ? "Available" : "Unavailable"}
              </p>
              {item.isAvailable && (
                <div className="mt-4 flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    value={quantities[item._id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(item._id, e.target.value)
                    }
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label={`Quantity for ${item.name}`}
                  />
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => navigate("/cart")}
        className="mt-6 px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        View Cart
      </button>
    </div>
  );
}

export default RestaurantPage;
