import { useState, useEffect } from "react";
import {
  getUnavailableRestaurants,
  updateRestaurantAvailability,
} from "../../services/restaurentServices";

const RestaurantApproval = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approvingId, setApprovingId] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  // Fetch unavailable restaurants
  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const response = await getUnavailableRestaurants();
      setRestaurants(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch restaurants");
    } finally {
      setLoading(false);
    }
  };

  // Update restaurant availability
  const updateAvailability = async (restaurantId) => {
    setApprovingId(restaurantId);
    try {
      await updateRestaurantAvailability(restaurantId);
      setRestaurants(restaurants.filter((r) => r._id !== restaurantId));
      setShowConfirmModal(false);
      setSelectedRestaurantId(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to approve restaurant");
    } finally {
      setApprovingId(null);
    }
  };

  // Open confirmation modal
  const openConfirmModal = (restaurantId) => {
    setSelectedRestaurantId(restaurantId);
    setShowConfirmModal(true);
  };

  // Close confirmation modal
  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedRestaurantId(null);
  };

  // Dismiss error
  const dismissError = () => setError(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Restaurant Approval Dashboard
          </h1>
          <button
            onClick={fetchRestaurants}
            disabled={loading}
            className="inline-flex items-center px-4 py-2s hover:bg-gray-700 text-sm font-medium rounded-md disabled:opacity-50 transition-colors duration-200"
            aria-label="Refresh restaurant list"
          >
            {loading ? (
              <span className="inline-block h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
            Refresh
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Error Toast */}
        {error && (
          <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center justify-between max-w-sm z-20 animate-slide-in">
            <p>{error}</p>
            <button
              onClick={dismissError}
              className="ml-4 text-white hover:text-gray-200 font-semibold"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && !restaurants.length ? (
          <div className="flex justify-center items-center h-64">
            <span className="inline-block h-8 w-8 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {restaurants.length === 0 ? (
              <p className="text-center text-gray-600 text-lg col-span-full">
                No restaurants pending approval.
              </p>
            ) : (
              restaurants.map((restaurant) => (
                <div
                  key={restaurant._id}
                  className="bg-white rounded-lg p-6  transition-all duration-300"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    {restaurant.storeName || "N/A"}
                  </h2>
                  <div className="space-y-2 text-gray-600 text-sm">
                    <p>
                      <span className="font-medium">Brand:</span>{" "}
                      {restaurant.brandName || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Business Type:</span>{" "}
                      {restaurant.businessType || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {restaurant.streetAddress || "N/A"}
                      {restaurant.floorSuite &&
                        `, ${restaurant.floorSuite}`},{" "}
                      {restaurant.city || "N/A"}, {restaurant.state || "N/A"}{" "}
                      {restaurant.zipcode || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {restaurant.countryCode && restaurant.phoneNumber
                        ? `${restaurant.countryCode} ${restaurant.phoneNumber}`
                        : "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Owner ID:</span>{" "}
                      {restaurant.owner ? restaurant.owner.toString() : "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Created At:</span>{" "}
                      {restaurant.createdAt
                        ? new Date(restaurant.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={
                          restaurant.isAvailable
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        {restaurant.isAvailable
                          ? "Approved"
                          : "Pending Approval"}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => openConfirmModal(restaurant._id)}
                    disabled={approvingId === restaurant._id}
                    className={`mt-4 w-full flex justify-center items-center py-2 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
                      approvingId === restaurant._id
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-black hover:bg-gray-800"
                    }`}
                    aria-label={`Approve ${
                      restaurant.storeName || "restaurant"
                    }`}
                  >
                    {approvingId === restaurant._id ? (
                      <span className="inline-block h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      "Approve"
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Approval
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve this restaurant? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
                aria-label="Cancel approval"
              >
                Cancel
              </button>
              <button
                onClick={() => updateAvailability(selectedRestaurantId)}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-200"
                aria-label="Confirm approval"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animation for Error Toast */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RestaurantApproval;
