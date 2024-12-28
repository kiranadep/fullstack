import axios from "axios";
import { API_BASE_URL } from "./constant";

// Register API
export const registerAPI = async (body) => {
  try {
    const response = await axios.post(`${API_BASE_URL}auth/signup`, body);
    console.log('Register API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Register API error:', error?.response?.data || error.message);
    throw error?.response?.data || error;
  }
};

// Login API
export const loginAPI = async (values) => {
  try {
    const response = await axios.post("http://localhost:8080/auth/signin", values, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const { token, user } = response.data; // Assuming response contains "token" and "user"
      console.log('Login successful:', token);

      // Save JWT token and user data to localStorage
      localStorage.setItem('jwt', token);
      localStorage.setItem('user', JSON.stringify(user)); // Optionally, save user data

      return response.data; // Return response containing the token and user data
    } else {
      throw new Error('Login failed: Unexpected response');
    }
  } catch (error) {
    console.error('Login API error:', error?.response?.data || error.message);
    throw error?.response?.data || error;
  }
};

// Example of using the token in a request
export const fetchProtectedData = async () => {
  try {
    const token = localStorage.getItem('jwt');
    const response = await axios.get("http://localhost:8080/protected-endpoint", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching protected data:', error?.response?.data || error.message);
    throw error;
  }
};
