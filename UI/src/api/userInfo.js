import axios from "axios";
import { API_BASE_URL, getHeaders } from "./constant";

// Fetch user details
export const fetchUserDetails = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: getHeaders(),
    });
    console.log("User Details Fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error.response || error);
    throw error.response?.data || new Error("Failed to fetch user details.");
  }
};

// Update user profile
export const updateUserProfileAPI = async (data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/auth/profile`, data, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update user profile:", error.response || error);
    throw error.response?.data || new Error("Profile update failed.");
  }
};

// Add address
export const addAddressAPI = async (data, userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/address/${userId}`, data, {
      headers: getHeaders(),
    });
    console.log("Address added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding address:", error.response || error);
    throw error.response?.data || new Error("Failed to add address.");
  }
};

// Update address
export const updateAddressAPI = async (data, userId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/auth/address/${userId}`,  // Include userId in the URL
      data,
      {
        headers: getHeaders(),  // Ensure proper authorization headers are set
      }
    );
    console.log("Address updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating address:", error.response || error);
    throw error.response?.data || new Error("Failed to update address.");
  }
};


// Delete address
export const deleteAddressAPI = async (userId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/auth/address/${userId}`, {
      headers: getHeaders(), // Use the same method to fetch headers for consistency
    });
    console.log("Address deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting address:", error.response || error);
    throw error.response?.data || new Error("Failed to delete address.");
  }
};

// Get address
export const getAddressAPI = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/address/${userId}`, {
      headers: getHeaders(),
    });
    console.log("User address data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching address details:", error.response || error);
    throw error.response?.data || new Error("Failed to fetch address.");
  }
};

// Fetch user orders
