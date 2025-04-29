import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_RESTAURENT_BASE_URL}/restaurants`;

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("authToken") || null;
};

// Create an Axios instance with default headers
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const RestaurantService = {
  // Create a new restaurant
  createRestaurant: async (restaurantData) => {
    try {
      const response = await axiosInstance.post("/", restaurantData);
      return response.data;
    } catch (error) {
      console.error(
        "Error creating restaurant:",
        error.response?.data || error.message
      );
      throw error.response?.data?.error || "Failed to create restaurant";
    }
  },

  // Get all restaurants
  getAllRestaurants: async () => {
    try {
      const response = await axiosInstance.get("/");
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching restaurants:",
        error.response?.data || error.message
      );
      throw error.response?.data?.error || "Failed to fetch restaurants";
    }
  },

  // Get restaurant by ID
  getRestaurantById: async (id) => {
    try {
      const response = await axiosInstance.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching restaurant details:",
        error.response?.data || error.message
      );
      throw error.response?.data?.error || "Failed to fetch restaurant details";
    }
  },

  // Update restaurant
  updateRestaurant: async (id, updatedData) => {
    try {
      const response = await axiosInstance.put(`/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(
        "Error updating restaurant:",
        error.response?.data || error.message
      );
      throw error.response?.data?.error || "Failed to update restaurant";
    }
  },

  // Delete restaurant
  deleteRestaurant: async (id) => {
    try {
      const response = await axiosInstance.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Error deleting restaurant:",
        error.response?.data || error.message
      );
      throw error.response?.data?.error || "Failed to delete restaurant";
    }
  },
};

export default RestaurantService;
