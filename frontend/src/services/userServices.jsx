import axios from "axios";

const API_BASE = "/api/user";

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
