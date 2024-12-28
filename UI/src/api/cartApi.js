import axios from 'axios';
import { getToken } from '../utils/jwt-helper'; // Import the helper function to retrieve the token
import { API_BASE_URL, getHeaders } from "./constant";

export const getCartByUserId = async (userId) => {
  try {
    const token = getToken(); // Use the getToken method to fetch the token from localStorage
    console.log('Token from localStorage:', token);  // Check if the token is null or expired

    if (!token) {
      console.error('No token found');
      throw new Error('Authentication token is missing. Please log in again.');
    }

    const response = await axios.get(`http://localhost:8080/auth/cart/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,  // Attach token to the request headers
      },
    });
    console.log('Cart data:', response.data);  // Log the response to see if cart data is returned
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};



// Define the base URL for your API

export const removeCartItem = async (userId, cartItemId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/auth/cart/${userId}/remove/${cartItemId}`, {
      headers: getHeaders(),
    });
    console.log('Cart updated after removal:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};
