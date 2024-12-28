import axios from "axios";

// api/fetchCategories.js
export const fetchCategories = async () => {
  try {
    const response = await fetch('http://localhost:8080/auth/categories'); // Adjust the URL based on your Spring Boot endpoint
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories from backend:', error);
    throw error;
  }
};

