import axios from "axios";
import { API_BASE_URL, getHeaders } from "./constant";  // Assuming getHeaders is imported from 'constant'
import { getToken } from '../utils/jwt-helper'; // Assuming getToken is a utility function to get the token from localStorage

export const placeOrderAPI = async (data) => {
    const url = `${API_BASE_URL}/auth/orders/create`;
    const token = getToken();  // Get the token
  
    console.log("Token:", token);  // Log the token for debugging
  
    if (!token) {
      console.error("No token found, unable to make request.");
      throw new Error("No token found, unable to make request.");
    }
  
    try {
      const response = await axios(url, {
        method: "POST",
        data: data,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      return response?.data;
    } catch (err) {
      console.error("Error placing order:", err);
      throw new Error(err);
    }
  };
  


export const confirmPaymentAPI = async (data)=>{
    const url = API_BASE_URL + '/api/order/update-payment';
    try{
        const response = await axios(url,{
            method:"POST",
            data:data,
            headers:getHeaders()
        });
        return response?.data;
    }
    catch(err){
        throw new Error(err);
    }
}
export const fetchOrderAPI = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/orders/${userId}`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error.response || error);
      throw error.response?.data || new Error("Failed to fetch orders.");
    }
  };
  

  export const cancelOrderAPI = async (orderId) => {
    try {
        const token = getToken(); // Ensure token is set correctly
        console.log(token);
        if (!token) throw new Error("No token found.");

        const response = await axios.patch(
          `${API_BASE_URL}/auth/orders/${orderId}/status`, 
          null, // Body is null because query parameters are used
          {
              headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
              },
              params: {
                  status: "CANCELLED", // Query parameter should be 'status'
              },
          }
      );
      
        return response.data;
    } catch (error) {
        console.error("Error canceling order:", error.response || error);
        throw error.response?.data || new Error("Failed to cancel order.");
    }
};

  