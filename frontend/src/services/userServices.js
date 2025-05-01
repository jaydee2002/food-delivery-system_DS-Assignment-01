import axios from "axios";

const API_BASE = "/api/user";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/user`;

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

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const updateUserRole = async (userId, role, token) => {
  try {
    const response = await axios.patch(
      `${API_BASE}/${userId}/role`,
      { role },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error updating user role" };
  }
};

export const addToCart = async (item) => {
  try {
    const response = await axiosInstance.post("/cart", item);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to add item to cart"
    );
  }
};

export const getCart = async () => {
  try {
    const response = await axiosInstance.get("/cart");
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch cart");
  }
};
