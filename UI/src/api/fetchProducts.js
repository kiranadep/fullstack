import axios from "axios";
import { API_BASE_URL, API_URLS } from "./constant"


// api/fetchProducts.js
export const getAllProducts = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:8080/auth/products`); // Replace with your actual backend endpoint
      const data = await response.json();
      return data.products; // Adjust based on your backend response structure
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };
  