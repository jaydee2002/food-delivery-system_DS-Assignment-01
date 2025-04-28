import axios from "axios";

const deliveryApi = axios.create({
  baseURL: "http://localhost:3004/api/delivery",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const orderApi = axios.create({
  baseURL: "http://localhost:3003/api/orders",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getReadyDeliveries = async () => {
  try {
    const response = await orderApi.get("/ready");
    return response.data;
  } catch (error) {
    console.error("Error fetching ready deliveries:", error);
    throw error;
  }
};

export const assignDelivery = async (orderId) => {
  try {
    const response = await deliveryApi.post("/assign", { orderId });
    return response.data;
  } catch (error) {
    console.error("Error assigning delivery:", error);
    throw error;
  }
};

export const updateDeliveryStatus = async (deliveryId, status) => {
  console.log("Updating delivery status:", deliveryId, status);
  try {
    const response = await deliveryApi.put(`/${deliveryId}`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating delivery status:", error);
    throw error;
  }
};

export const getDeliveries = async () => {
  try {
    const response = await deliveryApi.get(`/my-deliveries`);
    return response.data;
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    throw error;
  }
};

export const getOrderDetails = async (orderId) => {
  try {
    const response = await orderApi.get(`/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw error;
  }
};

export const getDeliveryById = async (deliveryId) => {
  try {
    const response = await deliveryApi.get(`/${deliveryId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching delivery by ID:", error);
    throw error;
  }
};
